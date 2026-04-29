const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  googleLogin: () => ipcRenderer.invoke('google-login'),
  googleLogout: () => ipcRenderer.invoke('google-logout'),
  googleStatus: () => ipcRenderer.invoke('google-status'),
  googleBackup: (data) => ipcRenderer.invoke('google-backup', data),
  googleRestore: () => ipcRenderer.invoke('google-restore')
});
