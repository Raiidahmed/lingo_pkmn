import { useStore } from '../store.js';
import { THEMES } from '../themes.js';
import { api } from '../api.js';

export default function SettingsPage() {
  const { setScreen, theme, setTheme, user, lightMode, toggleLightMode, thickBorder, toggleThickBorder } = useStore();

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

        <div style={{ marginTop: 20, paddingTop: 16, borderTop: 'var(--border-w) solid var(--border)' }}>
          <div className="card-title" style={{ marginBottom: 12 }}>BACKGROUND</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[{ id: 'dark', label: 'DARK' }, { id: 'light', label: 'LIGHT' }].map(opt => {
              const active = opt.id === 'light' ? lightMode : !lightMode;
              return (
                <button key={opt.id} className="btn" style={{ flex: 1, padding: '10px 8px', fontSize: 7, borderColor: active ? 'var(--accent)' : undefined, color: active ? 'var(--accent)' : undefined }}
                  onClick={() => { if (active) return; toggleLightMode(); }}>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 16, paddingTop: 16, borderTop: 'var(--border-w) solid var(--border)' }}>
          <div className="card-title" style={{ marginBottom: 12 }}>BORDERS</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[{ id: 'thin', label: 'THIN' }, { id: 'thick', label: 'THICK' }].map(opt => {
              const active = opt.id === 'thick' ? thickBorder : !thickBorder;
              return (
                <button key={opt.id} className="btn" style={{ flex: 1, padding: '10px 8px', fontSize: 7, borderColor: active ? 'var(--accent)' : undefined, color: active ? 'var(--accent)' : undefined }}
                  onClick={() => { if (active) return; toggleThickBorder(); }}>
                  {opt.label}
                </button>
              );
            })}
          </div>
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
