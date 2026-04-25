import { useState } from 'react';
import { useStore } from '../store.js';

const LEVEL_NAMES = [
  'The Entrance Hall', "The Scholar's Maze", "The Conjurer's Keep",
  'The Market', 'The Clocktower', 'The Kitchen Catacombs',
  'The Night School', 'The Trainyard', 'The Office', 'The Palace',
];

const LANGUAGES = [
  { id: 'es', flag: '🇪🇸', name: 'SPANISH',    native: 'Español'   },
  { id: 'fr', flag: '🇫🇷', name: 'FRENCH',     native: 'Français'  },
  { id: 'de', flag: '🇩🇪', name: 'GERMAN',     native: 'Deutsch'   },
  { id: 'it', flag: '🇮🇹', name: 'ITALIAN',    native: 'Italiano'  },
  { id: 'pt', flag: '🇵🇹', name: 'PORTUGUESE', native: 'Português' },
  { id: 'ja', flag: '🇯🇵', name: 'JAPANESE',   native: '日本語'    },
];

export default function StatusPage() {
  const { user, save, setScreen, startGame } = useStore();
  const status = save?.status ?? {};
  const snapshot = save?.snapshot ?? null;
  const wordBank = user?.word_bank ?? [];
  const completed = user?.levels_completed ?? [];

  const currentLevel = status.levelIndex ?? 1;
  const hasResume = !!snapshot;

  const [selectedLang, setSelectedLang] = useState('es');

  return (
    <div className="page">
      <div className="page-title" style={{ fontSize: 14 }}>STATUS</div>
      <button className="btn btn-ghost" style={{ width: 'auto', padding: '8px 16px' }}
        onClick={() => setScreen('menu')}>← BACK</button>

      {/* Save recap */}
      <div className="card">
        <div className="card-title">CURRENT RUN</div>
        {hasResume ? (
          <>
            <div className="stat-row">
              <span className="stat-label">LEVEL</span>
              <span className="stat-value">{status.levelName || `Level ${currentLevel}`}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">SCORE</span>
              <span className="stat-value">{status.score ?? 0} XP</span>
            </div>
            <button className="btn btn-accent" style={{ marginTop: 12 }}
              onClick={() => startGame(currentLevel, true)}>
              ▶ RESUME LEVEL {currentLevel}
            </button>
          </>
        ) : (
          <div style={{ fontSize: 8, color: 'var(--text-dim)' }}>No active run. Start below.</div>
        )}
      </div>

      {/* Language selector */}
      <div className="card">
        <div className="card-title">STUDY LANGUAGE</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {LANGUAGES.map(lang => {
            const active = selectedLang === lang.id;
            return (
              <button
                key={lang.id}
                className="btn"
                style={{
                  padding: '12px 6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  borderColor: active ? 'var(--accent)' : undefined,
                  background: active ? 'rgba(var(--accent-rgb,204,34,68),0.08)' : undefined,
                }}
                onClick={() => setSelectedLang(lang.id)}
              >
                <span style={{ fontSize: 22, lineHeight: 1 }}>{lang.flag}</span>
                <span style={{ fontSize: 6, color: active ? 'var(--accent)' : 'var(--text)' }}>
                  {lang.name}
                </span>
                <span style={{ fontSize: 11, fontFamily: 'sans-serif', color: active ? 'var(--accent)' : 'var(--text-dim)' }}>
                  {lang.native}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Level selector with completion status */}
      <div className="card">
        <div className="card-title">LEVELS — {completed.length}/10 COMPLETED</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map(n => {
            const done = completed.includes(n);
            return (
              <button
                key={n}
                className="btn"
                style={{
                  padding: '10px 12px',
                  fontSize: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderColor: done ? 'var(--accent)' : undefined,
                  color: done ? 'var(--accent)' : undefined,
                }}
                onClick={() => startGame(n, false)}
              >
                <span>{n}. {LEVEL_NAMES[n - 1]}</span>
                <span style={{ fontSize: 10 }}>{done ? '✓' : ''}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Word bank preview */}
      {wordBank.length > 0 && (
        <div className="card" style={{ width: '100%', overflowY: 'auto', maxHeight: 200 }}>
          <div className="card-title">WORD BANK ({wordBank.length})</div>
          {wordBank.slice(0, 20).map((w, i) => (
            <div key={i} className="word-row">
              <span className="word-es">{w.word_es}</span>
              <span className="word-en">{w.word_en}</span>
            </div>
          ))}
          {wordBank.length > 20 && (
            <div style={{ fontSize: 7, color: 'var(--text-dim)', paddingTop: 6 }}>
              +{wordBank.length - 20} more
            </div>
          )}
        </div>
      )}
    </div>
  );
}
