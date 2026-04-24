import { useAppStore } from '../state/appStore.js';

export default function GameOverScreen() {
  const stats = useAppStore(s => s.gameOverStats);
  const terminal = useAppStore(s => s.gameOverTerminal);
  const pendingRefresh = useAppStore(s => s.pending.saveRefresh);
  const resetGameOver = useAppStore(s => s.resetGameOver);
  const gotoStatus = useAppStore(s => s.gotoStatus);
  const gotoTitle = useAppStore(s => s.gotoTitle);
  const playAgainFromGameOver = useAppStore(s => s.playAgainFromGameOver);
  const session = useAppStore(s => s.session);
  const saveStatus = useAppStore(s => s.saveStatus);

  const result = stats?.result || terminal?.result || 'quit';
  const heading = result === 'win' ? 'Run Complete' : 'Run Ended';
  const subtitle = stats?.levelLabel || saveStatus?.levelLabel || 'Dungeon run ended';
  const detail = result === 'win'
    ? 'Legacy gameplay ended in a victory. The shell now owns the transition.'
    : 'Legacy gameplay emitted a terminal event. Continue from shell actions below.';

  function handleBack(fn) {
    resetGameOver();
    fn();
  }

  return (
    <div className="screen" id="screen-gameover">
      <div className="screen-shell">
        <h1>{heading}</h1>
        <h2>{subtitle}</h2>

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

        <div className="ui-panel gameover-summary">
          <h3>Post-Run Sync</h3>
          <p>{detail}</p>
          <p className="subtle-note">
            {pendingRefresh ? 'Refreshing save and word bank from account...' : 'Shell save status is up to date.'}
          </p>
        </div>

        <div className="screen-actions">
          {session ? (
            <>
              <button
                type="button"
                className="big-btn"
                onClick={playAgainFromGameOver}
                disabled={pendingRefresh}
              >
                Play Again ▶
              </button>
              <button
                type="button"
                className="ghost-btn"
                onClick={() => handleBack(gotoStatus)}
              >
                Back to Status
              </button>
            </>
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
