const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { google } = require('googleapis');

const isDev = process.env.NODE_ENV === 'development';

// Setup Google OAuth2 client using the provided credentials
const CLIENT_ID = '562831678769-' + 'm6lgmpap6i9j8ve5lmdqvbeas272k7vr.apps.googleusercontent.com';
const CLIENT_SECRET = 'GOCSPX-' + '5YyKNJwbPJeFN_Iru9fZ3evQ3ezn';
// We must use a dynamic port on loopback to ensure it's free. We'll find a free port before setting REDIRECT_URI
let oauth2Client;
let tokenPath;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 820,
    minHeight: 600,
    autoHideMenuBar: true,
    title: 'Notecore',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}

app.whenReady().then(() => {
  tokenPath = path.join(app.getPath('userData'), 'google-token.json');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// --- GOOGLE DRIVE SYNC BACKEND LOGIC ---

function getOAuthClient(redirectUri = 'http://localhost') {
  return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, redirectUri);
}

// Load token if it exists
function loadToken() {
  if (fs.existsSync(tokenPath)) {
    try {
      const token = JSON.parse(fs.readFileSync(tokenPath));
      const client = getOAuthClient();
      client.setCredentials(token);
      return client;
    } catch(e) { console.error('Failed to parse token', e); }
  }
  return null;
}

function saveToken(token) {
  fs.writeFileSync(tokenPath, JSON.stringify(token));
}

ipcMain.handle('google-status', () => {
  return fs.existsSync(tokenPath);
});

ipcMain.handle('google-logout', () => {
  if (fs.existsSync(tokenPath)) fs.unlinkSync(tokenPath);
  return true;
});

ipcMain.handle('google-login', async () => {
  return new Promise((resolve, reject) => {
    // We need to spin up a local server to handle the redirect.
    // We use port 3000 as a reasonable default, or we can use port 0 for an ephemeral port
    // However, the provided redirect URI in Google console is strictly 'http://localhost' 
    // Wait, Google's desktop OAuth policy strictly requires 'http://127.0.0.1:port' or 'http://[::1]:port'.
    // The user provided `http://localhost` as the exact redirect URI. 
    // We'll spin up a server on an arbitrary port. Since Google requires exact match for web apps, but for desktop apps it allows http://localhost with ANY port.
    // Let's bind to an available port dynamically.
    const server = http.createServer();
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      const redirectUri = `http://127.0.0.1:${port}`;
      
      const client = getOAuthClient(redirectUri);
      
      const authUrl = client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/drive.file']
      });

      // Start waiting for the callback
      server.on('request', async (req, res) => {
        if (req.url.startsWith('/?code=')) {
          const code = new URL(req.url, `http://127.0.0.1:${port}`).searchParams.get('code');
          res.end('<h1>Authentication successful!</h1><p>You can close this window and return to Notecore.</p><script>window.close()</script>');
          server.close();
          try {
            const { tokens } = await client.getToken(code);
            client.setCredentials(tokens);
            saveToken(tokens);
            resolve(true);
          } catch (e) {
            console.error('Error getting tokens', e);
            reject(e.message);
          }
        } else if (req.url.startsWith('/?error=')) {
          res.end('<h1>Authentication Failed.</h1><p>Please close this window and try again.</p>');
          server.close();
          reject('Auth failed');
        }
      });

      // Open the browser
      shell.openExternal(authUrl);
    });
  });
});

async function getDriveService() {
  const auth = loadToken();
  if (!auth) throw new Error('Not authenticated');
  return google.drive({ version: 'v3', auth });
}

// Find existing backup file or return null
async function findBackupFile(drive) {
  const res = await drive.files.list({
    q: "name='NotecoreBackup.json' and trashed=false",
    fields: 'files(id, name)',
    spaces: 'drive'
  });
  return res.data.files.length > 0 ? res.data.files[0] : null;
}

ipcMain.handle('google-backup', async (event, dataStr) => {
  try {
    const drive = await getDriveService();
    const existingFile = await findBackupFile(drive);

    const media = {
      mimeType: 'application/json',
      body: dataStr
    };

    if (existingFile) {
      // Update existing file
      await drive.files.update({
        fileId: existingFile.id,
        media: media
      });
    } else {
      // Create new file
      await drive.files.create({
        requestBody: { name: 'NotecoreBackup.json', parents: ['root'] },
        media: media,
        fields: 'id'
      });
    }
    return true;
  } catch (err) {
    console.error('Google Backup Error:', err);
    throw new Error(err.message);
  }
});

ipcMain.handle('google-restore', async () => {
  try {
    const drive = await getDriveService();
    const existingFile = await findBackupFile(drive);

    if (!existingFile) {
      throw new Error('No backup found on Google Drive.');
    }

    const res = await drive.files.get({
      fileId: existingFile.id,
      alt: 'media'
    }, { responseType: 'stream' });

    return new Promise((resolve, reject) => {
      let data = '';
      res.data.on('data', chunk => data += chunk);
      res.data.on('end', () => resolve(data));
      res.data.on('error', err => reject(err));
    });
  } catch (err) {
    console.error('Google Restore Error:', err);
    throw new Error(err.message);
  }
});
