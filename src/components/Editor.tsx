import React, { useRef, useEffect, useCallback } from 'react';
import { Note, AppLang } from '../types';
import { t } from '../utils/i18n';
import { fmtDate } from '../utils/data';

interface EditorProps {
  note: Note | null;
  lang: AppLang;
  onSave: (patch: Partial<Note>) => void;
  onDelete: () => void;
  onToast: (msg: string, type?: string) => void;
}

const CATS = ['General','Work','Personal','Ideas','Important'];

export default function Editor({ note, lang, onSave, onDelete }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync editor content when active note changes
  useEffect(() => {
    if (note && editorRef.current) {
      if (editorRef.current.innerHTML !== (note.content || '')) {
        editorRef.current.innerHTML = note.content || '';
      }
    }
    if (note && titleRef.current) {
      titleRef.current.value = note.title;
      growTitle();
    }
  }, [note?.id]);

  function growTitle() {
    const el = titleRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

  const scheduleSave = useCallback(() => {
    if (!note) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      onSave({
        title: titleRef.current?.value || 'Untitled',
        content: editorRef.current?.innerHTML || '',
      });
    }, 700);
  }, [note, onSave]);

  function fmt(cmd: string) {
    document.execCommand(cmd, false, undefined);
    editorRef.current?.focus();
  }
  function fmtBlock(tag: string) {
    document.execCommand('formatBlock', false, tag);
    editorRef.current?.focus();
  }
  function fmtColor(c: string) {
    document.execCommand('foreColor', false, c);
    editorRef.current?.focus();
  }
  function insertBlockquote() { document.execCommand('formatBlock', false, 'blockquote'); editorRef.current?.focus(); }
  function insertCode() { document.execCommand('insertHTML', false, '<code>code here</code>'); scheduleSave(); }
  function insertHR() { document.execCommand('insertHTML', false, '<hr>'); scheduleSave(); }
  function insertLink() {
    const url = window.prompt(t(lang,'enterUrl'), 'https://');
    if (url && url !== 'https://') { document.execCommand('createLink', false, url); scheduleSave(); }
  }
  function insertTable() {
    const r = parseInt(window.prompt(t(lang,'rows'), '3') || '0');
    const c = parseInt(window.prompt(t(lang,'columns'), '3') || '0');
    if (!r || !c || r < 1 || c < 1) return;
    let h = '<table><tr>' + Array.from({length:c},(_,i)=>`<th>Col ${i+1}</th>`).join('') + '</tr>';
    for (let i = 0; i < r; i++) h += '<tr>' + Array(c).fill('<td>&nbsp;</td>').join('') + '</tr>';
    h += '</table>';
    document.execCommand('insertHTML', false, h);
    scheduleSave();
  }

  function getWC() {
    const txt = editorRef.current?.innerText || '';
    const w = txt.trim() ? txt.trim().split(/\s+/).length : 0;
    return `${w} word${w !== 1 ? 's' : ''} · ${txt.length} chars`;
  }

  function handleDelete() {
    if (window.confirm(t(lang, 'deleteThisNote'))) onDelete();
  }

  const colors = ['#5b6af0','#e05c6a','#3ecf8e','#f0a45b','#5bc4f0','#b07ef0'];

  if (!note) {
    return (
      <div className="editor-wrap">
        <div className="toolbar" />
        <div className="empty-state">
          <svg className="empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          <div className="empty-lbl">{t(lang,'selectOrCreate')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-wrap">
      <div className="toolbar">
        {/* Format */}
        <button className="tb" onClick={() => fmt('bold')} title="Bold">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
        </button>
        <button className="tb" onClick={() => fmt('italic')} title="Italic">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
        </button>
        <button className="tb" onClick={() => fmt('underline')} title="Underline">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
        </button>
        <button className="tb" onClick={() => fmt('strikeThrough')} title="Strikethrough">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><path d="M16 6c-.7-1.2-2-2-4-2-2.2 0-4 1.3-4 3 0 1 .5 1.8 1.3 2.4"/><path d="M8 18c.7 1.2 2.1 2 4 2 2.4 0 4.3-1.4 4.3-3.3 0-1.1-.6-2-1.7-2.7"/></svg>
        </button>
        <div className="tb-sep"/>
        <button className="tb" onClick={() => fmtBlock('h1')} title="H1" style={{fontWeight:700,fontSize:'.75rem'}}>H1</button>
        <button className="tb" onClick={() => fmtBlock('h2')} title="H2" style={{fontWeight:700,fontSize:'.75rem'}}>H2</button>
        <button className="tb" onClick={() => fmtBlock('h3')} title="H3" style={{fontWeight:700,fontSize:'.75rem'}}>H3</button>
        <div className="tb-sep"/>
        <button className="tb" onClick={() => fmt('insertUnorderedList')} title="Bullet List">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>
        </button>
        <button className="tb" onClick={() => fmt('insertOrderedList')} title="Numbered List">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
        </button>
        <button className="tb" onClick={insertBlockquote} title="Blockquote">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
        </button>
        <button className="tb" onClick={insertCode} title="Code">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        </button>
        <div className="tb-sep"/>
        <button className="tb" onClick={insertTable} title="Table">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
        </button>
        <button className="tb" onClick={insertLink} title="Link">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </button>
        <button className="tb" onClick={insertHR} title="Horizontal Rule">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"/></svg>
        </button>
        <div className="tb-sep"/>
        {colors.map(c => (
          <div key={c} className="swatch" style={{background:c}} onClick={() => fmtColor(c)} title={c}/>
        ))}
        <div className="tb-sep"/>
        <button className="tb" onClick={() => fmt('undo')} title="Undo">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
        </button>
        <button className="tb" onClick={() => fmt('redo')} title="Redo">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/></svg>
        </button>
        <div className="tb-sep"/>
        <button className="tb" onClick={handleDelete} title="Delete Note" style={{color:'var(--red)',marginLeft:'auto'}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </button>
      </div>

      <div className="e-inner">
        <div className="e-head">
          <select
            className="cat-sel"
            value={note.cat}
            onChange={e => onSave({cat: e.target.value})}
          >
            {CATS.map(c => <option key={c}>{c}</option>)}
          </select>
          <textarea
            ref={titleRef}
            className="e-title"
            rows={1}
            placeholder={t(lang, 'untitledNote')}
            defaultValue={note.title}
            onInput={() => { growTitle(); scheduleSave(); }}
          />
        </div>
        <div className="e-date">{fmtDate(note.updated, lang)}</div>
        <div className="e-body">
          <div
            id="richEditor"
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            data-placeholder={t(lang,'startWriting')}
            onInput={scheduleSave}
          />
        </div>
        <div className="wc" id="wc">{getWC()}</div>
      </div>
    </div>
  );
}
