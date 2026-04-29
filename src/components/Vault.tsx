import React from 'react';
import { Cred, AppLang } from '../types';
import { t } from '../utils/i18n';
import { CRED_FIELDS, CRED_COLOR, shortDate, esc } from '../utils/data';

const CRED_SVG: Record<string, React.ReactNode> = {
  Website: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Social: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Email: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>,
  Banking: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>,
  Card: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  App: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" strokeLinecap="round"/></svg>,
  Other: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="3"/></svg>,
};

interface VaultProps {
  creds: Cred[];
  lang: AppLang;
  catFilter: string;
  searchQuery: string;
  onAddCred: () => void;
  onEditCred: (id: string) => void;
  onDeleteCred: (id: string) => void;
  onCopyPw: (id: string) => void;
  onCatFilter: (cat: string) => void;
  onDownloadCred: (id: string) => void;
}

const VCATS = ['all','Website','Social','Email','Banking','Card','App','Other'];
const VCAT_LABELS: Record<string,string> = {
  all:'All', Website:'Website', Social:'Social Media', Email:'Email',
  Banking:'Banking', Card:'Cards', App:'Apps', Other:'Other'
};

export default function Vault({
  creds, lang, catFilter, searchQuery, onAddCred,
  onEditCred, onDeleteCred, onCopyPw, onCatFilter, onDownloadCred
}: VaultProps) {
  let list = [...creds];
  if (catFilter !== 'all') list = list.filter(c => c.type === catFilter);
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(c => c.name.toLowerCase().includes(q) || c.type.toLowerCase().includes(q));
  }

  return (
    <div className="vault-wrap">
      <div className="vault-head">
        <div className="vault-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          {t(lang,'credentialVault')}
        </div>
        <button className="new-btn" style={{width:'auto',padding:'8px 18px'}} onClick={onAddCred}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {t(lang,'addCredential')}
        </button>
      </div>

      <div className="v-filter">
        {VCATS.map(cat => (
          <button
            key={cat}
            className={`cat-chip${catFilter === cat ? ' active' : ''}`}
            onClick={() => onCatFilter(cat)}
          >
            {VCAT_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="cred-grid">
        {list.length === 0 ? (
          <div className="empty-state" style={{gridColumn:'1/-1',minHeight:'260px'}}>
            <svg className="empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <div className="empty-lbl">{t(lang,'noCredentials')}</div>
          </div>
        ) : (
          list.map(c => {
            const col = CRED_COLOR[c.type] || 'var(--text3)';
            const iconBg = col.replace(')', '1a)').replace('var(', 'color-mix(in srgb,');
            return (
              <div key={c.id} className="cred-card" style={{borderTop:`2px solid ${col}`}}>
                <div className="cc-head">
                  <div className="cc-icon" style={{background:`${col}1a`,color:col}}>
                    {CRED_SVG[c.type] || CRED_SVG.Other}
                  </div>
                  <div>
                    <div className="cc-name">{c.name}</div>
                    <div className="cc-type">{c.type} · {shortDate(c.date, lang)}</div>
                  </div>
                </div>
                {(CRED_FIELDS[c.type] || []).slice(0,4).map(f => {
                  const val = c.fields?.[f.id] || '—';
                  const blur = f.type === 'password';
                  return (
                    <div key={f.id} className="cf-row">
                      <span className="cf-lbl">{f.label}</span>
                      <span className={`cf-val${blur ? ' blurred' : ''}`}>{val}</span>
                    </div>
                  );
                })}
                {c.notes && <div style={{fontSize:'.7rem',color:'var(--text3)',marginTop:'8px',borderTop:'1px solid var(--border)',paddingTop:'8px'}}>{c.notes}</div>}
                <div className="cc-actions">
                  <button className="cc-btn" onClick={() => onCopyPw(c.id)}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    Copy
                  </button>
                  <button className="cc-btn" onClick={() => onDownloadCred(c.id)} title={t(lang,'downloadFile')}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </button>
                  <button className="cc-btn" onClick={() => onEditCred(c.id)}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                  <button className="cc-btn del" onClick={() => onDeleteCred(c.id)}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
