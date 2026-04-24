import { useAppStore } from '../state/appStore.js';

export default function LeaderboardPanel() {
  const scores = useAppStore(s => s.leaderboard);
  const pending = useAppStore(s => s.pending.leaderboard);
  const refresh = useAppStore(s => s.loadLeaderboard);

  return (
    <div className="ui-panel">
      <h3>Hall of Fame</h3>
      <div className="leaderboard">
        {pending && scores.length === 0 ? (
          <div className="lb-empty">Loading scores...</div>
        ) : scores.length === 0 ? (
          <div className="lb-empty">No scores yet — be the first.</div>
        ) : (
          scores.slice(0, 10).map((row, i) => (
            <div className="lb-row" key={`${row.name}-${i}`}>
              <span className="rank">#{i + 1}</span>
              <span className="name">{row.name}</span>
              <span className="xp">{row.xp ?? row.score ?? 0} XP</span>
            </div>
          ))
        )}
      </div>
      <button
        type="button"
        className="ghost-btn"
        style={{ marginTop: 10 }}
        onClick={refresh}
        disabled={pending}
      >
        {pending ? 'Refreshing...' : 'Refresh'}
      </button>
    </div>
  );
}
