import { useStore } from '../store.js';
import { THEMES } from '../themes.js';
import { api } from '../api.js';

function SliderRow({ label, value, min, max, step = 1, unit = '', onChange }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span style={{ fontSize: 7, color: 'var(--text-dim)' }}>{label}</span>
        <span style={{ fontSize: 9, color: 'var(--accent)', minWidth: 40, textAlign: 'right' }}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range" className="ui-slider"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontSize: 6, color: 'var(--text-dim)' }}>{min}{unit}</span>
        <span style={{ fontSize: 6, color: 'var(--text-dim)' }}>{max}{unit}</span>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { setScreen, theme, setTheme, user, lightMode, toggleLightMode, ui, setUI } = useStore();

  function handleTheme(themeId) {
    setTheme(themeId);
    api.setTheme(themeId).catch(() => {});
  }

  const div = <div style={{ borderTop: 'var(--border-w) solid var(--border-col)', margin: '18px 0 14px' }} />;

  return (
    <div className="page">
      <div className="page-title" style={{ fontSize: 14 }}>SETTINGS</div>
      <button className="btn btn-ghost" style={{ width: 'auto', padding: '8px 16px' }}
        onClick={() => setScreen('menu')}>BACK</button>

      {/* ── Color theme ── */}
      <div className="card">
        <div className="card-title">COLOR THEME</div>
        <div className="theme-grid">
          {THEMES.map(t => (
            <div key={t.id} className="theme-swatch" onClick={() => handleTheme(t.id)}>
              <div className={`swatch-circle${theme.id === t.id ? ' active' : ''}`} style={{ background: t.accent }} />
              <span className="swatch-label">{t.label.toUpperCase()}</span>
            </div>
          ))}
        </div>

        {div}

        <div style={{ fontSize: 7, color: 'var(--text-dim)', marginBottom: 8 }}>BACKGROUND</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
          {[{ id: 'dark', label: 'DARK' }, { id: 'light', label: 'LIGHT' }].map(opt => {
            const active = opt.id === 'light' ? lightMode : !lightMode;
            return (
              <button key={opt.id} className="btn" style={{ flex: 1, padding: '10px 8px', fontSize: 7,
                borderColor: active ? 'var(--accent)' : undefined, color: active ? 'var(--accent)' : undefined }}
                onClick={() => { if (active) return; toggleLightMode(); }}>
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── UI Playground ── */}
      <div className="card">
        <div className="card-title">UI PLAYGROUND</div>

        <SliderRow label="FONT SIZE" value={Math.round(ui.fontSize * 100)} min={75} max={150} unit="%"
          onChange={v => setUI('fontSize', v / 100)} />

        {div}

        <SliderRow label="BORDER WIDTH" value={ui.borderWidth} min={0} max={8} unit="px"
          onChange={v => setUI('borderWidth', v)} />

        <SliderRow label="BORDER ACCENT" value={ui.borderTint} min={0} max={100} unit="%"
          onChange={v => setUI('borderTint', v)} />

        {div}

        <SliderRow label="CORNER RADIUS" value={ui.radius} min={0} max={24} unit="px"
          onChange={v => setUI('radius', v)} />

        {div}

        <SliderRow label="GLOW SIZE" value={ui.glowSize} min={0} max={64} unit="px"
          onChange={v => setUI('glowSize', v)} />

        <SliderRow label="BORDER SHIMMER" value={ui.shimmer} min={0} max={100} unit="%"
          onChange={v => setUI('shimmer', v)} />

        {lightMode && (
          <>
            {div}
            <SliderRow label="CANVAS TINT" value={Math.round(ui.canvasTint * 100)} min={0} max={100} unit="%"
              onChange={v => setUI('canvasTint', v / 100)} />
          </>
        )}

        {div}

        <button className="btn btn-ghost" style={{ fontSize: 7 }}
          onClick={() => {
            [
              ['borderWidth', 1], ['radius', 8], ['glowSize', 16],
              ['canvasTint', 0.58], ['borderTint', 0], ['shimmer', 0], ['fontSize', 1.0],
            ].forEach(([k, v]) => setUI(k, v));
          }}>
          RESET DEFAULTS
        </button>
      </div>

      {/* ── Account ── */}
      <div className="card">
        <div className="card-title">ACCOUNT</div>
        <div style={{ fontSize: 8, color: 'var(--text-dim)' }}>Logged in as:</div>
        <div style={{ fontSize: 10, color: 'var(--text)', marginTop: 4 }}>{user?.username ?? '?'}</div>
      </div>
    </div>
  );
}
