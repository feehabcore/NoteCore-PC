import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Note, Cred, AppTab, AppLang } from './types';
import { t } from './utils/i18n';
import { uid, nowIso, CRED_FIELDS } from './utils/data';
import LockScreen from './components/LockScreen';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Vault from './components/Vault';
import CredModal from './components/CredModal';
import SettingsModal from './components/SettingsModal';
import ContextMenu from './components/ContextMenu';
import Toasts, { ToastItem } from './components/Toasts';
import './index.css';

// ── Persistence helpers ──────────────────────────────────────────────────────
function loadNotes(): Note[] { try { return JSON.parse(localStorage.getItem('nc_notes') || '[]'); } catch { return []; } }
function loadCreds(): Cred[] { try { return JSON.parse(localStorage.getItem('nc_creds') || '[]'); } catch { return []; } }
function saveNotes(n: Note[]) { localStorage.setItem('nc_notes', JSON.stringify(n)); }
function saveCreds(c: Cred[]) { localStorage.setItem('nc_creds', JSON.stringify(c)); }

// ── Print helpers ────────────────────────────────────────────────────────────
function printNote(n: Note) {
  const w = window.open('', '_blank')!;
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${n.title||'Note'} — Notecore</title>
  <style>body{font-family:'Segoe UI',system-ui,sans-serif;max-width:760px;margin:48px auto;padding:0 40px;color:#111;line-height:1.8;}
  h1{font-weight:800;font-size:2rem;margin-bottom:4px;letter-spacing:-.5px;}
  .meta{font-size:.72rem;color:#888;margin-bottom:36px;padding-bottom:14px;border-bottom:2px solid #eee;}
  blockquote{border-left:3px solid #5b6af0;padding:8px 16px;background:#f6f6ff;margin:12px 0;border-radius:0 6px 6px 0;}
  code{background:#f0f0f4;padding:2px 5px;border-radius:4px;font-size:.83em;font-family:'Cascadia Code','Consolas','Courier New',monospace;}
  pre{background:#f4f4f8;padding:14px;border-radius:6px;margin:12px 0;}
  table{width:100%;border-collapse:collapse;margin:12px 0;font-size:.85rem;}
  td,th{border:1px solid #ddd;padding:7px 11px;}th{background:#f5f5f5;}
  a{color:#5b6af0;}hr{border:none;border-top:1px solid #eee;margin:20px 0;}
  .footer{margin-top:48px;border-top:1px solid #eee;padding-top:12px;font-size:.68rem;color:#bbb;text-align:center;}
  @media print{@page{margin:18mm;}}</style></head><body>
  <h1>${n.title||'Untitled'}</h1>
  <div class="meta">Category: ${n.cat} &nbsp;·&nbsp; Notecore</div>
  <div>${n.content||''}</div>
  <div class="footer">Exported from Notecore &nbsp;·&nbsp; ${new Date().toLocaleString()}</div>
  </body></html>`);
  w.document.close(); setTimeout(() => { w.focus(); w.print(); }, 600);
}

export default function App() {
  const [locked, setLocked] = useState(true);
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [creds, setCreds] = useState<Cred[]>(loadCreds);
  const [appPin, setAppPin] = useState(() => localStorage.getItem('nc_pin') || '1234');
  const [lang, setLang] = useState<AppLang>(() => (localStorage.getItem('nc_lang') as AppLang) || 'en-US');
  const [activeTab, setActiveTab] = useState<AppTab>('notes');
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [catFilter, setCatFilter] = useState('all');
  const [credCatFilter, setCredCatFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [credModalOpen, setCredModalOpen] = useState(false);
  const [editCred, setEditCred] = useState<Cred | null>(null);
  const [ctxOpen, setCtxOpen] = useState(false);
  const [ctxPos, setCtxPos] = useState({ x: 0, y: 0 });
  const [ctxNoteId, setCtxNoteId] = useState<string | null>(null);
  const [googleConnected, setGoogleConnected] = useState(false);
  const toastId = useRef(0);

  // Check initial Google auth status
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.googleStatus().then(status => setGoogleConnected(status));
    }
  }, []);

  // Seed welcome note on first run
  useEffect(() => {
    if (notes.length === 0) {
      const welcome: Note = {
        id: uid(), title: 'Getting started', cat: 'General', created: nowIso(), updated: nowIso(),
        content: `<h1>Welcome to Notecore</h1>
<p>A clean, private, local-first workspace for notes and credentials. All data is stored locally — nothing is sent anywhere.</p>
<h2>Notes</h2>
<p>Use the toolbar to format your writing. Right-click any note in the sidebar to rename, duplicate, export as PDF, or delete it.</p>
<h2>Vault</h2>
<p>Switch to the Vault tab to store passwords, bank accounts, card numbers, and credentials. Password fields are blurred — hover to reveal.</p>
<h2>Keyboard shortcuts</h2>
<table><tr><th>Shortcut</th><th>Action</th></tr>
<tr><td>Ctrl + N</td><td>New note</td></tr>
<tr><td>Ctrl + S</td><td>Force save</td></tr>
<tr><td>Ctrl + P</td><td>Export as PDF</td></tr>
<tr><td>Escape</td><td>Close modals</td></tr></table>
<h2>Security</h2>
<p>The app is protected by a PIN. Default is <code>1234</code>. Change it in Settings.</p>`
      };
      const next = [welcome];
      setNotes(next);
      saveNotes(next);
      setActiveNote(welcome);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === 'n' && activeTab === 'notes') { e.preventDefault(); newNote(); }
      if (ctrl && e.key === 's') { e.preventDefault(); toast(t(lang,'saved')); }
      if (ctrl && e.key === 'p') { e.preventDefault(); exportPDF(); }
      if (e.key === 'Escape') { setSettingsOpen(false); setCredModalOpen(false); setCtxOpen(false); }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [activeTab, lang, activeNote]);

  // Close context menu on click
  useEffect(() => {
    function onClick() { setCtxOpen(false); }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // ── Toast ──────────────────────────────────────────────────────────────────
  function toast(msg: string, type: string = 'ok') {
    const tType = (type === 'er' ? 'er' : 'ok') as 'ok' | 'er';
    const id = ++toastId.current;
    const item: ToastItem = { id, msg, type: tType, visible: false };
    setToasts(prev => [...prev, item]);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: true } : t));
    }));
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: false } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 350);
    }, 2800);
  }

  // ── Notes ──────────────────────────────────────────────────────────────────
  function newNote() {
    const n: Note = { id: uid(), title: '', content: '', cat: 'General', created: nowIso(), updated: nowIso() };
    const next = [n, ...notes];
    setNotes(next); saveNotes(next); setActiveNote(n);
  }

  function openNote(id: string) {
    const n = notes.find(x => x.id === id);
    if (n) setActiveNote(n);
  }

  function patchNote(patch: Partial<Note>) {
    if (!activeNote) return;
    const updated = { ...activeNote, ...patch, updated: nowIso() };
    setActiveNote(updated);
    const next = notes.map(n => n.id === activeNote.id ? updated : n);
    setNotes(next); saveNotes(next);
  }

  function deleteNote(id: string) {
    const next = notes.filter(n => n.id !== id);
    setNotes(next); saveNotes(next);
    if (activeNote?.id === id) setActiveNote(null);
    toast(t(lang, 'noteDeleted'));
  }

  function duplicateNote(id: string) {
    const src = notes.find(n => n.id === id);
    if (!src) return;
    const copy: Note = { ...src, id: uid(), title: src.title + ' (copy)', created: nowIso(), updated: nowIso() };
    const idx = notes.findIndex(n => n.id === id);
    const next = [...notes];
    next.splice(idx + 1, 0, copy);
    setNotes(next); saveNotes(next);
    toast(t(lang, 'noteDuplicated'));
  }

  // ── Download File ────────────────────────────────────────────────────────
  function downloadNote(id: string) {
    const n = notes.find(x => x.id === id);
    if (!n) return;
    const content = `# ${n.title || 'Untitled'}\n\n${n.content.replace(/<[^>]+>/g, '')}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${n.title || 'note'}.md`;
    a.click();
    toast(t(lang, 'downloaded'));
  }

  function downloadCred(id: string) {
    const c = creds.find(x => x.id === id);
    if (!c) return;
    const blob = new Blob([JSON.stringify(c, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${c.name || 'credential'}.json`;
    a.click();
    toast(t(lang, 'downloaded'));
  }

  // ── Context menu ──────────────────────────────────────────────────────────
  function openCtx(e: React.MouseEvent, id: string) {
    e.preventDefault(); e.stopPropagation();
    setCtxNoteId(id);
    setCtxPos({ x: Math.min(e.clientX, window.innerWidth - 180), y: Math.min(e.clientY, window.innerHeight - 170) });
    setCtxOpen(true);
  }

  function handleCtxAction(action: string) {
    setCtxOpen(false);
    if (!ctxNoteId) return;
    if (action === 'rename') { openNote(ctxNoteId); }
    else if (action === 'duplicate') { duplicateNote(ctxNoteId); }
    else if (action === 'export') {
      const n = notes.find(x => x.id === ctxNoteId);
      if (n) printNote(n);
    }
    else if (action === 'download') { downloadNote(ctxNoteId); }
    else if (action === 'delete') {
      if (window.confirm(t(lang, 'deleteThisNoteShort'))) deleteNote(ctxNoteId);
    }
  }

  // ── Vault ─────────────────────────────────────────────────────────────────
  function openAddCred() { setEditCred(null); setCredModalOpen(true); }
  function openEditCred(id: string) {
    const c = creds.find(x => x.id === id);
    if (c) { setEditCred(c); setCredModalOpen(true); }
  }

  function handleSaveCred(cred: Cred) {
    let next: Cred[];
    if (editCred) {
      next = creds.map(c => c.id === cred.id ? cred : c);
    } else {
      next = [cred, ...creds];
    }
    setCreds(next); saveCreds(next);
    toast(t(lang, 'credentialSaved'));
  }

  function handleDeleteCred(id: string) {
    if (!window.confirm(t(lang, 'deleteThisCred'))) return;
    const next = creds.filter(c => c.id !== id);
    setCreds(next); saveCreds(next);
    toast(t(lang, 'credentialDeleted'));
  }

  function copyCredPw(id: string) {
    const c = creds.find(x => x.id === id);
    if (!c) return;
    const pf = (CRED_FIELDS[c.type] || []).find(f => f.type === 'password');
    const val = pf ? c.fields?.[pf.id] : undefined;
    if (val) { navigator.clipboard.writeText(val).then(() => toast(t(lang,'copied'))); }
    else toast(t(lang, 'nothingToCopy'), 'er');
  }

  // ── Settings ──────────────────────────────────────────────────────────────
  function handleSavePin(pin: string) {
    setAppPin(pin); localStorage.setItem('nc_pin', pin);
    setSettingsOpen(false); toast(t(lang, 'pinUpdated'));
  }

  function handleLangChange(l: AppLang) {
    setLang(l); localStorage.setItem('nc_lang', l);
    toast(t(l, 'languageUpdated'));
  }

  function exportData() {
    const blob = new Blob([JSON.stringify({ notes, creds, exported: new Date().toISOString(), version: 1 }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `notecore-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    toast(t(lang, 'backupDownloaded'));
  }

  function importData(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (!data.version) throw new Error();
        if (!window.confirm(t(lang, 'importConfirm', { notes: data.notes?.length || 0, creds: data.creds?.length || 0 }))) return;
        const nids = new Set(notes.map(n => n.id));
        const cids = new Set(creds.map(c => c.id));
        const mergedNotes = [...notes, ...(data.notes || []).filter((n: Note) => !nids.has(n.id))];
        const mergedCreds = [...creds, ...(data.creds || []).filter((c: Cred) => !cids.has(c.id))];
        setNotes(mergedNotes); saveNotes(mergedNotes);
        setCreds(mergedCreds); saveCreds(mergedCreds);
        toast(t(lang, 'importSuccess'));
      } catch { toast(t(lang, 'invalidBackup'), 'er'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  // ── Google Drive Sync ─────────────────────────────────────────────────────
  async function handleGoogleLogin() {
    try {
      if (!window.electronAPI) return;
      const success = await window.electronAPI.googleLogin();
      if (success) {
        setGoogleConnected(true);
        toast(t(lang, 'Google Drive Connected'));
      }
    } catch (e: any) { toast(e.toString(), 'er'); }
  }

  async function handleGoogleLogout() {
    try {
      if (!window.electronAPI) return;
      await window.electronAPI.googleLogout();
      setGoogleConnected(false);
      toast(t(lang, 'Google Drive Disconnected'));
    } catch (e: any) { toast(e.toString(), 'er'); }
  }

  async function handleGoogleBackup() {
    try {
      if (!window.electronAPI) return;
      toast('Uploading to Google Drive...');
      const dataStr = JSON.stringify({ notes, creds, exported: new Date().toISOString(), version: 1 });
      await window.electronAPI.googleBackup(dataStr);
      toast('Backup uploaded successfully!');
    } catch (e: any) { toast(e.toString(), 'er'); }
  }

  async function handleGoogleRestore() {
    try {
      if (!window.electronAPI) return;
      toast('Downloading from Google Drive...');
      const dataStr = await window.electronAPI.googleRestore();
      const data = JSON.parse(dataStr);
      if (!data.version) throw new Error('Invalid format');
      
      const nids = new Set(notes.map(n => n.id));
      const cids = new Set(creds.map(c => c.id));
      const mergedNotes = [...notes, ...(data.notes || []).filter((n: Note) => !nids.has(n.id))];
      const mergedCreds = [...creds, ...(data.creds || []).filter((c: Cred) => !cids.has(c.id))];
      
      setNotes(mergedNotes); saveNotes(mergedNotes);
      setCreds(mergedCreds); saveCreds(mergedCreds);
      toast('Restored from Google Drive successfully!');
    } catch (e: any) { toast(e.toString(), 'er'); }
  }

  // ── PDF export ────────────────────────────────────────────────────────────
  function exportPDF() {
    if (activeTab === 'notes') {
      if (!activeNote) { toast(t(lang, 'openNoteFirst'), 'er'); return; }
      printNote(activeNote);
    }
  }

  // ── Lock ──────────────────────────────────────────────────────────────────
  function lockApp() { setLocked(true); }

  if (locked) {
    return <LockScreen appPin={appPin} lang={lang} onUnlock={() => setLocked(false)} onToast={toast} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* TOPBAR */}
      <div className="topbar">
        <div style={{display:'flex', alignItems:'center'}}>
          <div className="nc-logo-icon"></div>
          <div className="app-brand">NOTE<span>CORE</span></div>
        </div>
        <div className="tab-group">
          <button className={`tab-btn${activeTab === 'notes' ? ' active' : ''}`} onClick={() => setActiveTab('notes')}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            {t(lang,'notes')}
          </button>
          <button className={`tab-btn${activeTab === 'vault' ? ' active' : ''}`} onClick={() => setActiveTab('vault')}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            {t(lang,'vault')}
          </button>
        </div>
        <div className="topbar-actions">
          <button className="icon-btn" title={`Export as PDF (Ctrl+P)`} onClick={exportPDF}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>
          <button className="icon-btn" title="Settings" onClick={() => setSettingsOpen(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
          <button className="icon-btn" title="Toggle Sidebar" onClick={() => setSidebarCollapsed(c => !c)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/>
            </svg>
          </button>
          <button className="icon-btn danger" title="Lock App" onClick={lockApp}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="app-body">
        <Sidebar
          notes={notes}
          activeNote={activeNote}
          collapsed={sidebarCollapsed}
          lang={lang}
          catFilter={catFilter}
          searchQuery={searchQuery}
          noteCount={notes.length}
          credCount={creds.length}
          activeTab={activeTab}
          onSearch={setSearchQuery}
          onCatFilter={setCatFilter}
          onOpenNote={openNote}
          onNewNote={activeTab === 'notes' ? newNote : openAddCred}
          onContextMenu={openCtx}
        />

        {activeTab === 'notes' && (
          <Editor
            note={activeNote}
            lang={lang}
            onSave={patchNote}
            onDelete={() => activeNote && deleteNote(activeNote.id)}
            onToast={toast}
          />
        )}

        {activeTab === 'vault' && (
          <Vault
            creds={creds}
            lang={lang}
            catFilter={credCatFilter}
            searchQuery={searchQuery}
            onAddCred={openAddCred}
            onEditCred={openEditCred}
            onDeleteCred={handleDeleteCred}
            onCopyPw={copyCredPw}
            onCatFilter={setCredCatFilter}
            onDownloadCred={downloadCred}
          />
        )}
      </div>

      {/* MODALS */}
      <CredModal
        open={credModalOpen}
        editCred={editCred}
        lang={lang}
        onClose={() => setCredModalOpen(false)}
        onSave={handleSaveCred}
        onToast={toast}
      />
      <SettingsModal
        open={settingsOpen}
        lang={lang}
        notes={notes}
        creds={creds}
        onClose={() => setSettingsOpen(false)}
        onSavePin={handleSavePin}
        onLangChange={handleLangChange}
        onExport={exportData}
        onImport={importData}
        onToast={toast}
        googleConnected={googleConnected}
        onGoogleLogin={handleGoogleLogin}
        onGoogleLogout={handleGoogleLogout}
        onGoogleBackup={handleGoogleBackup}
        onGoogleRestore={handleGoogleRestore}
      />

      {/* CONTEXT MENU */}
      <ContextMenu
        open={ctxOpen}
        x={ctxPos.x}
        y={ctxPos.y}
        lang={lang}
        onAction={handleCtxAction}
        onClose={() => setCtxOpen(false)}
      />

      {/* TOASTS */}
      <Toasts toasts={toasts} />
    </div>
  );
}
