import React, { useState, useRef } from 'react';
import { AppLang } from '../types';
import { t } from '../utils/i18n';

interface LockScreenProps {
  appPin: string;
  lang: AppLang;
  onUnlock: () => void;
  onToast: (msg: string, type?: string) => void;
}

export default function LockScreen({ appPin, lang, onUnlock, onToast }: LockScreenProps) {
  const [err, setErr] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function unlock() {
    const val = inputRef.current?.value || '';
    if (val === appPin) {
      onUnlock();
    } else {
      setErr(true);
      setTimeout(() => setErr(false), 350);
      onToast(t(lang, 'incorrectPin'), 'er');
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') unlock();
  }

  return (
    <div className="lock-screen">
      <div className="app-brand" style={{ fontSize: '2.5rem', marginBottom: 12, justifyContent: 'center' }}>NOTE<span>CORE</span></div>
      <div className="lock-sub">Your private local workspace</div>
      <input
        ref={inputRef}
        className={`lock-input${err ? ' err' : ''}`}
        type="password"
        placeholder="Enter PIN"
        maxLength={8}
        onKeyDown={onKeyDown}
        autoFocus
      />
      <button className="lock-btn" onClick={unlock}>Unlock</button>
      <div className="lock-hint">Default PIN: 1234</div>
    </div>
  );
}
