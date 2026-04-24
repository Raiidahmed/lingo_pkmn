import { useEffect } from 'react';
import { useAppStore, SCREENS } from './state/appStore.js';
import Hud from './components/Hud.jsx';
import TitleScreen from './components/TitleScreen.jsx';
import StatusScreen from './components/StatusScreen.jsx';
import SettingsScreen from './components/SettingsScreen.jsx';
import GameCanvas from './components/GameCanvas.jsx';
import GameOverScreen from './components/GameOverScreen.jsx';

export default function App() {
  const screen = useAppStore(s => s.screen);
  const boot = useAppStore(s => s.boot);

  useEffect(() => {
    boot();
  }, [boot]);

  let body;
  switch (screen) {
    case SCREENS.BOOTING:
      body = <div className="boot-screen">Loading save...</div>;
      break;
    case SCREENS.AUTHENTICATING:
      body = <div className="boot-screen">Authenticating...</div>;
      break;
    case SCREENS.ANON_TITLE:
    case SCREENS.AUTH_TITLE:
      body = <TitleScreen />;
      break;
    case SCREENS.STATUS:
      body = <StatusScreen />;
      break;
    case SCREENS.SETTINGS:
      body = <SettingsScreen />;
      break;
    case SCREENS.IN_GAME:
      body = <GameCanvas />;
      break;
    case SCREENS.GAME_OVER:
      body = <GameOverScreen />;
      break;
    default:
      body = <div className="boot-screen">Unknown screen: {screen}</div>;
  }

  return (
    <div className="app-shell" data-screen={screen}>
      <Hud />
      {body}
    </div>
  );
}
