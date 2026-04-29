import React, { useState, useEffect } from 'react';
import { Cred, AppLang } from '../types';
import { t } from '../utils/i18n';
import { CRED_FIELDS, uid, nowIso } from '../utils/data';

interface CredModalProps {
  open: boolean;
  editCred: Cred | null;
  lang: AppLang;
  onClose: () => void;
  onSave: (cred: Cred) => void;
  onToast: (msg: string, type?: string) => void;
}

const CRED_TYPES = ['Website','Social','Email','Banking','Card','App','Other'];

export default function CredModal({ open, editCred, lang, onClose, onSave, onToast }: CredModalProps) {
  const [type, setType] = useState('Website');
  const [name, setName] = useState('');
  const [fields, setFields] = useState<Record<string,string>>({});
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open) {
      if (editCred) {
        setType(editCred.type);
        setName(editCred.name);
        setFields(editCred.fields || {});
        setNotes(editCred.notes || '');
      } else {
        setType('Website');
        setName('');
        setFields({});
        setNotes('');
      }
    }
  }, [open, editCred]);

  function handleTypeChange(newType: string) {
    setType(newType);
    setFields({});
  }

  function setField(id: string, val: string) {
    setFields(prev => ({ ...prev, [id]: val }));
  }

  function save() {
    if (!name.trim()) { onToast(t(lang,'enterName'), 'er'); return; }
    const cred: Cred = {
      id: editCred?.id || uid(),
      name: name.trim(),
      type,
      fields,
      notes,
      date: nowIso(),
    };
    onSave(cred);
    onClose();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }

  return (
    <div className={`overlay${open ? ' open' : ''}`} onKeyDown={onKeyDown} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <h2>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          {editCred ? t(lang,'editCredentialTitle') : t(lang,'addCredentialTitle')}
        </h2>

        <div className="fg">
          <label className="fl">{t(lang,'type')}</label>
          <select className="fs" value={type} onChange={e => handleTypeChange(e.target.value)}>
            {CRED_TYPES.map(ct => <option key={ct} value={ct}>{ct}</option>)}
          </select>
        </div>

        <div className="fg">
          <label className="fl">{t(lang,'nameTitle')}</label>
          <input
            className="fi"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Gmail, Facebook, HSBC..."
          />
        </div>

        {(CRED_FIELDS[type] || []).map(f => (
          <div className="fg" key={f.id}>
            <label className="fl">{f.label}</label>
            <input
              className="fi"
              type={f.type}
              placeholder={f.ph}
              value={fields[f.id] || ''}
              onChange={e => setField(f.id, e.target.value)}
            />
          </div>
        ))}

        <div className="fg">
          <label className="fl">{t(lang,'noteLabel')}</label>
          <textarea
            className="fi"
            rows={2}
            placeholder="Optional notes..."
            style={{resize:'vertical'}}
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        <div className="mf">
          <button className="btn-s" onClick={onClose}>{t(lang,'cancel')}</button>
          <button className="btn-p" onClick={save}>{t(lang,'saveCredential')}</button>
        </div>
      </div>
    </div>
  );
}
