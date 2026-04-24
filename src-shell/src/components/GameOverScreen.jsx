import { useAppStore } from '../state/appStore.js';

export default function GameOverScreen() {
  const stats = useAppStore(s => s.gameOverStats);
  const resetGameOver = useAppStore(s => s.resetGameOver);
  const gotoStatus = useAppStore(s => s.gotoStatus);
  const gotoTitle = useAppStore(s => s.gotoTitle);
  const session = useAppStore(s => s.session);

  function handleBack(fn) {
    resetGameOver();
    fn();
  }

  return (
    <div className="screen" id="screen-gameover">
      <div className="screen-shell">
        <h1>{stats?.result === 'win' ? 'Run Complete' : 'Game Over'}</h1>
        <h2>{stats?.levelLabel || 'Dungeon run ended'}</h2>

        <div className="stat-grid">
          <div className="stat-box">
            <div className="val">{stats?.xp ?? 0}</div>
            <div className="lbl">XP EARNED</div>
          </div>
          <div className="stat-box">
            <div className="val">{stats?.challenges ?? 0}</div>
            <div className="lbl">CHALLENGES</div>
          </div>
          <div className="stat-box">
            <div className="val">{stats?.time || '0s'}</div>
            <div className="lbl">TIME</div>
          </div>
          <div className="stat-box">
            <div className="val">{stats?.attempts ?? 0}</div>
            <div className="lbl">ATTEMPTS</div>
          </div>
        </div>

        <p>Stats were reported by the embedded legacy game.</p>

        <div className="screen-actions">
          {session ? (
            <button
              type="button"
              className="big-btn"
              onClick={() => handleBack(gotoStatus)}
            >
              Back to Status ▶
            </button>
          ) : (
            <button
              type="button"
              className="big-btn"
              onClick={() => handleBack(gotoTitle)}
            >
              Back to Title ▶
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
