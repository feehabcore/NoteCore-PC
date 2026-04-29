import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

export interface ToastItem {
  id: number;
  msg: string;
  type: 'ok' | 'er';
  visible: boolean;
}

interface ToastsProps {
  toasts: ToastItem[];
}

export default function Toasts({ toasts }: ToastsProps) {
  return ReactDOM.createPortal(
    <div className="toasts">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}${t.visible ? ' in' : ''}`}>
          <div className="toast-dot"/>
          {t.msg}
        </div>
      ))}
    </div>,
    document.body
  );
}
