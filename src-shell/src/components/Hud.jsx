import { useAppStore, SCREENS } from '../state/appStore.js';

const SCREEN_LABELS = {
  [SCREENS.BOOTING]: 'booting',
  [SCREENS.ANON_TITLE]: 'title (anon)',
  [SCREENS.AUTHENTICATING]: 'authenticating',
  [SCREENS.AUTH_TITLE]: 'title (signed in)',
  [SCREENS.IN_GAME]: 'in game',
  [SCREENS.STATUS]: 'status',
  [SCREENS.SETTINGS]: 'settings',
  [SCREENS.GAME_OVER]: 'game over',
};

export default function Hud() {
  const screen = useAppStore(s => s.screen);
  const session = useAppStore(s => s.session);
  const gotoSettings = useAppStore(s => s.gotoSettings);
  const gotoTitle = useAppStore(s => s.gotoTitle);

  const showSettingsBtn = screen !== SCREENS.SETTINGS && screen !== SCREENS.IN_GAME;
  const showTitleBtn =
    screen !== SCREENS.ANON_TITLE &&
    screen !== SCREENS.AUTH_TITLE &&
    screen !== SCREENS.IN_GAME;

  return (
    <div className="hud">
      <span className="title">LINGO DUNGEON</span>
      <span className="screen-name">
        {SCREEN_LABELS[screen] || screen}
        {session ? ` · ${session.profile.name}` : ''}
      </span>
      <div className="hud-actions">
        {showTitleBtn && (
          <button type="button" className="hud-btn" onClick={gotoTitle}>
            TITLE
          </button>
        )}
        {showSettingsBtn && (
          <button type="button" className="hud-btn" onClick={gotoSettings}>
            ⚙
          </button>
        )}
      </div>
    </div>
  );
}
