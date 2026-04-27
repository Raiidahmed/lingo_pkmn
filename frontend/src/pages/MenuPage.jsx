import { useEffect } from 'react';
import { useStore } from '../store.js';
import { api } from '../api.js';

export default function MenuPage() {
  const { user, setScreen, startGame, logout, save, refreshFromMe } = useStore();
  const wordCount = user?.word_bank?.length ?? 0;
  const hasResume = !!save?.snapshot;

  useEffect(() => {
    api.me().then(d => refreshFromMe(d)).catch(() => {});
  }, []);

  return (
    <div className="page">
      <div className="page-title">LINGO SMT</div>
      <div className="subtitle">Welcome, {user?.username ?? '?'}</div>

      <div className="card" style={{ textAlign: 'center' }}>
        <div className="card-title">WORD BANK</div>
        <div style={{ fontSize: 18, color: 'var(--text)' }}>{wordCount}</div>
        <div style={{ fontSize: 7, color: 'var(--text-dim)' }}>words learned</div>
        {wordCount > 0 && (
          <div style={{ marginTop: 12, maxHeight: 100, overflowY: 'auto' }}>
            {user.word_bank.slice(0, 6).map(w => (
              <div key={w.word_es} className="word-row">
                <span className="word-es">{w.word_es}</span>
                <span className="word-en">{w.word_en}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
        {hasResume && (
          <button className="btn btn-accent" onClick={() => startGame(save.snapshot.levelIndex, true)}>
            ▶ RESUME
          </button>
        )}
        <button className={`btn${hasResume ? '' : ' btn-accent'}`} onClick={() => setScreen('status')}>
          {hasResume ? 'NEW GAME / LEVELS' : '▶ PLAY'}
        </button>
        <button className="btn" onClick={() => setScreen('leaderboard')}>🏆 LEADERBOARD</button>
        <button className="btn" onClick={() => setScreen('settings')}>⚙ SETTINGS</button>
        <div className="spacer" />
        <button className="btn btn-ghost" onClick={logout}>LOGOUT</button>
      </div>
    </div>
  );
}
