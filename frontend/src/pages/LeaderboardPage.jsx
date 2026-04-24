import { useState, useEffect } from 'react';
import { api } from '../api.js';
import { useStore } from '../store.js';

export default function LeaderboardPage() {
  const { setScreen, user } = useStore();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.leaderboard()
      .then(d => { setScores(d.scores); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function fmtTime(ms) {
    if (!ms) return '--';
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  return (
    <div className="page">
      <div className="page-title" style={{ fontSize: 14 }}>LEADERBOARD</div>
      <button
        className="btn btn-ghost"
        style={{ width: 'auto', padding: '8px 16px' }}
        onClick={() => setScreen('menu')}
      >
        BACK
      </button>

      <div className="card" style={{ flex: 1, width: '100%', overflowY: 'auto' }}>
        {loading && (
          <div style={{ fontSize: 8, color: 'var(--text-dim)', textAlign: 'center' }}>Loading...</div>
        )}
        {!loading && scores.length === 0 && (
          <div style={{ fontSize: 8, color: 'var(--text-dim)', textAlign: 'center' }}>
            No scores yet. Be the first!
          </div>
        )}
        {scores.map((s, i) => (
          <div key={s.id} className={`lb-row${s.username === user?.username ? ' me' : ''}`}>
            <span className="lb-rank">#{i + 1}</span>
            <span className="lb-name">{s.username}</span>
            <span style={{ fontSize: 7, color: 'var(--text-dim)', marginRight: 8 }}>L{s.level}</span>
            <span className="lb-score">{s.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
