import React from 'react';
import { Note, AppLang } from '../types';
import { t } from '../utils/i18n';
import { shortDate } from '../utils/data';

interface SidebarProps {
  notes: Note[];
  activeNote: Note | null;
  collapsed: boolean;
  lang: AppLang;
  catFilter: string;
  searchQuery: string;
  noteCount: number;
  credCount: number;
  activeTab: string;
  onSearch: (q: string) => void;
  onCatFilter: (cat: string) => void;
  onOpenNote: (id: string) => void;
  onNewNote: () => void;
  onContextMenu: (e: React.MouseEvent, id: string) => void;
}

export default function Sidebar({
  notes, activeNote, collapsed, lang, catFilter, searchQuery,
  noteCount, credCount, activeTab, onSearch, onCatFilter,
  onOpenNote, onNewNote, onContextMenu
}: SidebarProps) {
  const cats = ['all', 'General', 'Work', 'Personal', 'Ideas', 'Important'];
  const catLabels: Record<string, string> = {
    all: t(lang, 'all'), General: t(lang, 'general'), Work: t(lang, 'work'),
    Personal: t(lang, 'personal'), Ideas: t(lang, 'ideas'), Important: t(lang, 'important')
  };

  let filtered = [...notes];
  if (catFilter !== 'all') filtered = filtered.filter(n => n.cat === catFilter);
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(n =>
      n.title.toLowerCase().includes(q) ||
      (n.content || '').replace(/<[^>]+>/g, '').toLowerCase().includes(q)
    );
  }

  return (
    <div className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-top">
        <div className="search-wrap">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
          />
        </div>
        <button className="new-btn" onClick={onNewNote}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {activeTab === 'notes' ? t(lang, 'newNote') : t(lang, 'addCredential')}
        </button>
      </div>

      {activeTab === 'notes' && (
        <div className="cat-scroll">
          {cats.map(cat => (
            <button
              key={cat}
              className={`cat-chip${catFilter === cat ? ' active' : ''}`}
              onClick={() => onCatFilter(cat)}
            >
              {catLabels[cat]}
            </button>
          ))}
        </div>
      )}

      <div className="note-list">
        {activeTab === 'notes' && (
          filtered.length === 0
            ? <div style={{textAlign:'center',color:'var(--text3)',fontSize:'.75rem',padding:'28px 12px'}}>{t(lang,'noNotes')}</div>
            : <>
                <div className="list-label">{t(lang,'notes')} ({filtered.length})</div>
                {filtered.map(n => (
                  <div
                    key={n.id}
                    className={`note-row${activeNote?.id === n.id ? ' active' : ''}`}
                    onClick={() => onOpenNote(n.id)}
                    onContextMenu={e => onContextMenu(e, n.id)}
                  >
                    <div className="note-row-title">{n.title || 'Untitled'}</div>
                    <div className="note-row-meta">
                      <span className="badge badge-note">{n.cat}</span>
                      <span>{shortDate(n.updated, lang)}</span>
                    </div>
                  </div>
                ))}
              </>
        )}
      </div>

      <div className="sidebar-foot">
        <div className="stat-row">
          <div className="stat-box">
            <div className="stat-n">{noteCount}</div>
            <div className="stat-l">{t(lang,'notes')}</div>
          </div>
          <div className="stat-box">
            <div className="stat-n v">{credCount}</div>
            <div className="stat-l">{t(lang,'creds')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
