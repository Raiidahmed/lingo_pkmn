import { LEGACY_LEVEL_COUNT, useAppStore } from '../state/appStore.js';

export default function StatusScreen() {
  const session = useAppStore(s => s.session);
  const status = useAppStore(s => s.saveStatus);
  const wordBank = useAppStore(s => s.wordBank);
  const launchPreferences = useAppStore(s => s.launchPreferences);
  const hasResumableSnapshot = useAppStore(s => s.hasResumableSnapshot);
  const setLaunchMode = useAppStore(s => s.setLaunchMode);
  const setLaunchLevelIndex = useAppStore(s => s.setLaunchLevelIndex);
  const enterDungeon = useAppStore(s => s.enterDungeon);
  const gotoSettings = useAppStore(s => s.gotoSettings);
  const logout = useAppStore(s => s.logout);

  if (!session) {
    return (
      <div className="screen">
        <div className="screen-shell">
          <h1>Status</h1>
          <p>No active session. Return to the title screen.</p>
        </div>
      </div>
    );
  }

  const s = status || {};
  const selectedMode = hasResumableSnapshot && launchPreferences.mode === 'resume'
    ? 'resume'
    : 'restart';
  const selectedLevelIndex = Number.isFinite(Number(launchPreferences.levelIndex))
    ? Math.max(0, Math.min(LEGACY_LEVEL_COUNT - 1, Math.floor(Number(launchPreferences.levelIndex))))
    : 0;
  const actionLabel = selectedMode === 'resume'
    ? 'Resume Run ▶'
    : `Start Level ${selectedLevelIndex + 1} ▶`;
  const summary = hasResumableSnapshot
    ? (selectedMode === 'resume'
        ? 'A resumable mid-level run was found. Launching will continue exactly where you left off.'
        : 'A resumable mid-level run was found, but restart is selected.')
    : 'No resumable mid-level snapshot found. Launching will start the selected level fresh.';
  const resumeDetail = hasResumableSnapshot
    ? `Resume run at ${s.levelLabel || `Level ${selectedLevelIndex + 1}`}`
    : 'No active run saved';

  return (
    <div className="screen" id="screen-status">
      <div className="screen-shell">
        <h1>Status</h1>
        <h2>Welcome back, {session.profile.name}</h2>
        <p>{summary}</p>

        <div className="ui-panel">
          <h3>Save Snapshot</h3>
          <div className="status-line">
            <span>Save</span><span>{session.profile.name}</span>
          </div>
          <div className="status-line">
            <span>Story</span><span>{s.storyLabel || 'New run'}</span>
          </div>
          <div className="status-line">
            <span>Total XP</span><span>{s.totalXP ?? 0}</span>
          </div>
          <div className="status-line">
            <span>Best level</span><span>{s.levelLabel || 'Level 1'}</span>
          </div>
          <div className="status-line">
            <span>Resume</span>
            <span>{resumeDetail}</span>
          </div>
        </div>

        <div className="ui-panel">
          <h3>Start Controls</h3>
          <p>
            Choose where to begin. Resume continues the exact mid-level snapshot;
            restart loads the selected level from the start.
          </p>
          <label className="subtle-note" htmlFor="start-level-select">
            Start level
          </label>
          <select
            id="start-level-select"
            value={selectedLevelIndex}
            onChange={e => setLaunchLevelIndex(Number(e.target.value))}
            disabled={selectedMode === 'resume'}
          >
            {Array.from({ length: LEGACY_LEVEL_COUNT }, (_, idx) => (
              <option key={idx} value={idx}>
                Level {idx + 1}
              </option>
            ))}
          </select>
          {hasResumableSnapshot ? (
            <div className="launch-mode-row" role="group" aria-label="Run mode">
              <button
                type="button"
                className={`launch-mode-btn${selectedMode === 'resume' ? ' active' : ''}`}
                onClick={() => setLaunchMode('resume')}
              >
                Resume
              </button>
              <button
                type="button"
                className={`launch-mode-btn${selectedMode === 'restart' ? ' active' : ''}`}
                onClick={() => setLaunchMode('restart')}
              >
                Restart
              </button>
            </div>
          ) : null}
        </div>

        <div className="ui-panel">
          <h3>Word Bank ({wordBank.length})</h3>
          <p>
            Words you have collected. In the full shell this is a navigable
            list; in the spike we just preview the first batch.
          </p>
          <div className="wordbank-list">
            {wordBank.length === 0 ? (
              <div className="lb-empty">No words yet. Start playing.</div>
            ) : (
              wordBank.slice(0, 12).map(w => (
                <div className="word-chip" key={w.key}>
                  <span>{w.text}</span>
                  {w.gloss ? <span className="gloss">— {w.gloss}</span> : null}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="screen-actions">
          <button
            type="button"
            className="big-btn"
            onClick={() => enterDungeon({ mode: selectedMode, levelIndex: selectedLevelIndex })}
          >
            {actionLabel}
          </button>
          <button type="button" className="ghost-btn" onClick={gotoSettings}>
            Settings
          </button>
          <button type="button" className="ghost-btn" onClick={logout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
