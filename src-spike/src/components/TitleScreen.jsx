import { useAppStore, SCREENS } from '../state/appStore.js';
import AuthPanel from './AuthPanel.jsx';
import LeaderboardPanel from './LeaderboardPanel.jsx';

export default function TitleScreen() {
  const screen = useAppStore(s => s.screen);
  const session = useAppStore(s => s.session);
  const gotoStatus = useAppStore(s => s.gotoStatus);
  const logout = useAppStore(s => s.logout);

  const isAuthenticated = screen === SCREENS.AUTH_TITLE && !!session;

  return (
    <div className="screen" id="screen-title">
      <div className="screen-shell">
        <h1>LINGO DUNGEON</h1>
        <h2>Shell Spike — React + Zustand</h2>

        {isAuthenticated ? (
          <div className="ui-panel">
            <h3>Welcome back, {session.profile.name}</h3>
            <p>Your save is loaded. Head to the status screen to pick a level.</p>
            <div className="auth-actions">
              <button
                type="button"
                className="big-btn"
                onClick={gotoStatus}
              >
                Continue ▶
              </button>
              <button
                type="button"
                className="ghost-btn"
                onClick={logout}
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <AuthPanel />
        )}

        <LeaderboardPanel />
      </div>
    </div>
  );
}
