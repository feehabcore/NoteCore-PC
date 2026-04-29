import React, { useState } from 'react';
import { Note, Cred, AppLang } from '../types';
import { t } from '../utils/i18n';

interface SettingsModalProps {
  open: boolean;
  lang: AppLang;
  notes: Note[];
  creds: Cred[];
  onClose: () => void;
  onSavePin: (pin: string) => void;
  onLangChange: (lang: AppLang) => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToast: (msg: string, type?: string) => void;
  googleConnected: boolean;
  onGoogleLogin: () => void;
  onGoogleLogout: () => void;
  onGoogleBackup: () => void;
  onGoogleRestore: () => void;
}

const LANGS: { value: AppLang; label: string }[] = [
  { value: 'en-US', label: 'English (United States)' },
  { value: 'bn-BD', label: 'Bangla (Bangladesh)' },
  { value: 'hi-IN', label: 'Hindi (India)' },
  { value: 'es-ES', label: 'Spanish (Spain)' },
];

export default function SettingsModal({
  open, lang, onClose, onSavePin, onLangChange, onExport, onImport, onToast,
  googleConnected, onGoogleLogin, onGoogleLogout, onGoogleBackup, onGoogleRestore
}: SettingsModalProps) {
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  function savePin() {
    if (newPin.length < 4) { onToast(t(lang,'pinMin'), 'er'); return; }
    if (newPin !== confirmPin) { onToast(t(lang,'pinMismatch'), 'er'); return; }
    onSavePin(newPin);
    setNewPin(''); setConfirmPin('');
  }

  return (
    <div
      className={`overlay${open ? ' open' : ''}`}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal">
        <h2>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          {t(lang,'settings')}
        </h2>

        <div className="fg">
          <label className="fl">{t(lang,'newPin')}</label>
          <input className="fi" type="password" placeholder={t(lang,'newPin')} value={newPin} onChange={e => setNewPin(e.target.value)} />
        </div>
        <div className="fg">
          <label className="fl">{t(lang,'confirmPin')}</label>
          <input className="fi" type="password" placeholder={t(lang,'confirmPin')} value={confirmPin} onChange={e => setConfirmPin(e.target.value)} />
        </div>

        <div className="fg">
          <label className="fl">{t(lang,'appLanguage')}</label>
          <select className="fs" value={lang} onChange={e => onLangChange(e.target.value as AppLang)}>
            {LANGS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>

        <div className="divider"/>

        <div className="fg">
          <label className="fl">{t(lang,'backup')}</label>
          <button className="btn-s" style={{width:'100%'}} onClick={onExport}>{t(lang,'downloadBackup')}</button>
        </div>
        <div className="fg">
          <label className="fl">{t(lang,'restore')}</label>
          <input type="file" id="importFile" accept=".json" style={{display:'none'}} onChange={onImport}/>
          <button className="btn-s" style={{width:'100%'}} onClick={() => document.getElementById('importFile')?.click()}>
            {t(lang,'importBackup')}
          </button>
        </div>

        <div className="divider"/>
        
        <div className="fg" style={{marginBottom:'4px'}}>
          <label className="fl" style={{color:'var(--purple)'}}>Cloud Sync (Google Drive)</label>
          {googleConnected ? (
            <button className="btn-s" style={{width:'100%', borderColor:'var(--red)', color:'var(--red)'}} onClick={onGoogleLogout}>
              Disconnect Account
            </button>
          ) : (
            <button className="btn-s" style={{width:'100%', borderColor:'var(--purple)', color:'var(--purple)'}} onClick={onGoogleLogin}>
              Connect Google Drive
            </button>
          )}
        </div>
        
        {googleConnected && (
          <>
            <div className="fg" style={{marginBottom:'4px'}}>
              <button className="btn-s" style={{width:'100%'}} onClick={onGoogleBackup}>
                Backup to Google Drive
              </button>
            </div>
            <div className="fg">
              <button className="btn-s" style={{width:'100%'}} onClick={onGoogleRestore}>
                Restore from Google Drive
              </button>
            </div>
          </>
        )}

        <div className="mf">
          <button className="btn-s" onClick={onClose}>{t(lang,'close')}</button>
          <button className="btn-p" onClick={savePin}>{t(lang,'savePin')}</button>
        </div>
      </div>
    </div>
  );
}
