import { useEffect } from 'react';
import { useStore } from './store.js';
import { api } from './api.js';
import { applyTheme } from './themes.js';
import LoginPage from './pages/LoginPage.jsx';
import MenuPage from './pages/MenuPage.jsx';
import LeaderboardPage from './pages/LeaderboardPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import GamePage from './pages/GamePage.jsx';
import GameOverPage from './pages/GameOverPage.jsx';
import StatusPage from './pages/StatusPage.jsx';

export default function App() {
  const { screen, login, setScreen, lightMode, ui } = useStore();

  useEffect(() => {
    document.documentElement.classList.toggle('light-mode', lightMode);
    // applyUI is imported via store — call it directly from the module
    const el = document.documentElement;
    el.style.setProperty('--border-w',  `${ui.borderWidth}px`);
    el.style.setProperty('--radius',    `${ui.radius}px`);
    el.style.setProperty('--glow-size', `${ui.glowSize}px`);
    el.style.setProperty('--border-col',
      ui.borderTint > 0
        ? `color-mix(in srgb, var(--accent) ${ui.borderTint}%, var(--border))`
        : 'var(--border)'
    );
    const root = document.getElementById('root');
    if (root) root.style.zoom = ui.fontSize ?? 1;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('lingo_token');
    if (token) {
      api.me().then(data => {
        applyTheme(data.user.accent_theme);
        login(data.user, token, data.save ?? null);
      }).catch(() => {
        localStorage.removeItem('lingo_token');
      });
    }
  }, []);

  return (
    <>
      {/* Gradient overlay — sits behind content via mix-blend-mode:screen */}
      {ui.gradient > 0 && (
        <div aria-hidden="true" style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1,
          background: 'radial-gradient(ellipse 120% 50% at 50% 0%, var(--accent), transparent)',
          opacity: ui.gradient / 200,
          mixBlendMode: lightMode ? 'multiply' : 'screen',
        }} />
      )}
      {screen === 'login'       && <LoginPage />}
      {screen === 'menu'        && <MenuPage />}
      {screen === 'leaderboard' && <LeaderboardPage />}
      {screen === 'settings'    && <SettingsPage />}
      {screen === 'status'      && <StatusPage />}
      {screen === 'game'        && <GamePage />}
      {screen === 'game_over'   && <GameOverPage />}
    </>
  );
}
