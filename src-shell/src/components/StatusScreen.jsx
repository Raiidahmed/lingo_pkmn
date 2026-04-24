import { useAppStore } from '../state/appStore.js';

export default function StatusScreen() {
  const session = useAppStore(s => s.session);
  const status = useAppStore(s => s.saveStatus);
  const wordBank = useAppStore(s => s.wordBank);
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
  const hasActiveRun = Boolean(s.hasActiveRun);
  const resumeDetail = hasActiveRun
    ? `Resume run at ${s.levelLabel || 'current level'}`
    : 'No active run saved';
  const actionLabel = hasActiveRun ? 'Resume Run ▶' : 'Start Fresh ▶';
  const summary = hasActiveRun
    ? 'Your saved run is ready to continue.'
    : 'No in-progress run found. Starting will begin a fresh run.';

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
          <button type="button" className="big-btn" onClick={enterDungeon}>
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
