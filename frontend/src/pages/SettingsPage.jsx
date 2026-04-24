import { useStore } from '../store.js';
import { THEMES } from '../themes.js';
import { api } from '../api.js';

export default function SettingsPage() {
  const { setScreen, theme, setTheme, user } = useStore();

  function handleTheme(themeId) {
    setTheme(themeId);
    api.setTheme(themeId).catch(() => {});
  }

  return (
    <div className="page">
      <div className="page-title" style={{ fontSize: 14 }}>SETTINGS</div>
      <button
        className="btn btn-ghost"
        style={{ width: 'auto', padding: '8px 16px' }}
        onClick={() => setScreen('menu')}
      >
        BACK
      </button>

      <div className="card">
        <div className="card-title">COLOR THEME</div>
        <div className="theme-grid">
          {THEMES.map(t => (
            <div key={t.id} className="theme-swatch" onClick={() => handleTheme(t.id)}>
              <div
                className={`swatch-circle${theme.id === t.id ? ' active' : ''}`}
                style={{ background: t.accent }}
              />
              <span className="swatch-label">{t.label.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">ACCOUNT</div>
        <div style={{ fontSize: 8, color: 'var(--text-dim)' }}>Logged in as:</div>
        <div style={{ fontSize: 10, color: 'var(--text)', marginTop: 4 }}>{user?.username ?? '?'}</div>
      </div>
    </div>
  );
}
