import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store.js';
import { THEMES } from '../themes.js';
import { api } from '../api.js';
import Slider     from '../components/Slider.jsx';
import Segmented  from '../components/Segmented.jsx';
import ColorWheel from '../components/ColorWheel.jsx';

const UI_DEFAULTS = {
  borderWidth: 1, radius: 8, glowSize: 16, canvasTint: 0.58,
  borderTint: 0, shimmer: 0, shimmerSpeed: 2, shimmerPulses: 1, fontSize: 1.0,
};

const PRESET_THEME_IDS = new Set(THEMES.map(t => t.id));

function isPresetThemeId(themeId) {
  return PRESET_THEME_IDS.has(themeId);
}

function Subsection({ title, children }) {
  return (
    <div className="subsection">
      <div className="subsection-title">{title}</div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const {
    setScreen, theme, setTheme, setCustomTheme,
    addCustomColor, removeCustomColor,
    user, lightMode, toggleLightMode, ui, setUI,
  } = useStore();

  const [mixerOpen, setMixerOpen] = useState(false);
  const [saveState, setSaveState] = useState('idle');
  const latestThemeIdRef = useRef(theme.id);
  const saveTimerRef = useRef(null);
  const savingRef = useRef(false);
  const savePromiseRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  async function persistLatestTheme() {
    if (savingRef.current) return savePromiseRef.current;
    if (!isPresetThemeId(latestThemeIdRef.current)) return null;

    savePromiseRef.current = (async () => {
      const themeId = latestThemeIdRef.current;
      if (!isPresetThemeId(themeId)) return;
      savingRef.current = true;
      if (mountedRef.current) setSaveState('saving');

      try {
        await api.setTheme(themeId);
        if (mountedRef.current && latestThemeIdRef.current === themeId) {
          setSaveState('saved');
          window.setTimeout(() => {
            if (mountedRef.current && latestThemeIdRef.current === themeId) {
              setSaveState('idle');
            }
          }, 900);
        }
      } catch (err) {
        if (mountedRef.current && latestThemeIdRef.current === themeId) {
          setSaveState('error');
        }
      } finally {
        savingRef.current = false;
        if (latestThemeIdRef.current !== themeId && isPresetThemeId(latestThemeIdRef.current)) {
          await persistLatestTheme();
        }
      }
    })();

    return savePromiseRef.current;
  }

  function queueThemeSave(themeId) {
    latestThemeIdRef.current = themeId;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => {
      saveTimerRef.current = null;
      persistLatestTheme();
    }, 180);
  }

  function handlePresetTheme(themeId) {
    if (theme.id === themeId && saveState !== 'error') return;
    setTheme(themeId);
    setSaveState('queued');
    queueThemeSave(themeId);
  }

  function handleCustomTheme(customTheme) {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    latestThemeIdRef.current = null;
    setCustomTheme(customTheme);
    setSaveState('idle');
  }

  function handleAddCustomTheme(customTheme) {
    addCustomColor(customTheme);
    handleCustomTheme(customTheme);
  }

  function handleRemoveCustomTheme(index, customTheme) {
    removeCustomColor(index);
    if (theme.id === customTheme.id) {
      handlePresetTheme(user?.accent_theme && isPresetThemeId(user.accent_theme)
        ? user.accent_theme
        : THEMES[0].id);
    }
  }

  function resetDefaults() {
    Object.entries(UI_DEFAULTS).forEach(([k, v]) => setUI(k, v));
  }

  async function handleBack() {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
      await persistLatestTheme();
    } else if (savePromiseRef.current) {
      await savePromiseRef.current;
    }
    setScreen('menu');
  }

  return (
    <div className="page" style={{ paddingBottom: 60 }}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          className="btn btn-ghost"
          style={{ width: 'auto', padding: '8px 14px', fontSize: 7 }}
          onClick={handleBack}
        >
          ← BACK
        </button>
        <div style={{ flex: 1 }} />
      </div>

      <div className="page-title" style={{ fontSize: 14, marginTop: 6 }}>SETTINGS</div>
      <div className="subtitle" style={{ marginTop: -8, marginBottom: 8 }}>
        customize your dungeon
      </div>

      {/* ── Appearance ─────────────────────────────────────────────────── */}
      <div className="card">
        <div className="settings-card-head">
          <div className="card-title">APPEARANCE</div>
        </div>

        <Subsection title="THEME">
          <Segmented
            options={[{ value: 'dark', label: 'DARK' }, { value: 'light', label: 'LIGHT' }]}
            value={lightMode ? 'light' : 'dark'}
            onChange={() => toggleLightMode()}
          />
        </Subsection>

        <Subsection title="ACCENT">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))',
            gap: 12,
          }}>
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => handlePresetTheme(t.id)}
                aria-label={t.label}
                style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: t.accent,
                  border: theme.id === t.id ? '3px solid var(--text)' : '2px solid var(--border-col)',
                  boxShadow: theme.id === t.id ? `0 0 16px ${t.accent}` : 'none',
                  cursor: 'pointer',
                  padding: 0,
                  margin: '0 auto',
                  display: 'block',
                  transition: 'transform 120ms ease, box-shadow 120ms ease',
                }}
              />
            ))}

            {(ui.customColors || []).map((t, i) => (
              <div key={t.id} style={{ position: 'relative', width: 44, height: 44, margin: '0 auto' }}>
                <button
                  onClick={() => handleCustomTheme(t)}
                  aria-label={`Custom ${t.label}`}
                  style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: t.accent,
                    border: theme.id === t.id ? '3px solid var(--text)' : '2px solid var(--border-col)',
                    boxShadow: theme.id === t.id ? `0 0 16px ${t.accent}` : 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'transform 120ms ease',
                  }}
                />
                <button
                  onClick={() => handleRemoveCustomTheme(i, t)}
                  aria-label="Remove"
                  style={{
                    position: 'absolute',
                    top: -4, right: -4,
                    width: 16, height: 16,
                    borderRadius: '50%',
                    background: 'var(--surface)',
                    border: '1px solid var(--border-col)',
                    color: 'var(--text-dim)',
                    fontSize: 9,
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                    padding: 0,
                    lineHeight: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >×</button>
              </div>
            ))}

            <button
              onClick={() => setMixerOpen(o => !o)}
              aria-label="Open color mixer"
              style={{
                width: 44, height: 44, borderRadius: '50%',
                background: mixerOpen
                  ? 'var(--accent)'
                  : 'conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                border: '2px dashed var(--border-col)',
                cursor: 'pointer',
                padding: 0,
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                color: '#fff',
                textShadow: '0 0 4px #000',
              }}
            >+</button>
          </div>
        </Subsection>

        {mixerOpen && (
          <Subsection title="COLOR MIXER">
            <ColorWheel onAdd={handleAddCustomTheme} />
          </Subsection>
        )}
      </div>

      {/* ── Feel ───────────────────────────────────────────────────────── */}
      <div className="card">
        <div className="card-title">FEEL</div>

        <Subsection title="TYPOGRAPHY">
          <Slider label="SCALE" value={Math.round(ui.fontSize * 100)}
            min={75} max={150} unit="%"
            onChange={v => setUI('fontSize', v / 100)} />
        </Subsection>

        <Subsection title="BORDERS">
          <Slider label="WIDTH" value={ui.borderWidth}
            min={0} max={8} unit="px"
            onChange={v => setUI('borderWidth', v)} />
          <Slider label="RADIUS" value={ui.radius}
            min={0} max={24} unit="px"
            onChange={v => setUI('radius', v)} />
          <Slider label="ACCENT TINT" value={ui.borderTint}
            min={0} max={100} unit="%"
            onChange={v => setUI('borderTint', v)} />
        </Subsection>

        <Subsection title="GLOW">
          <Slider label="HALO SIZE" value={ui.glowSize}
            min={0} max={64} unit="px"
            onChange={v => setUI('glowSize', v)} />
        </Subsection>

        <Subsection title="SHIMMER">
          <Slider label="STRENGTH" value={ui.shimmer}
            min={0} max={100} unit="%"
            onChange={v => setUI('shimmer', v)} />
          {ui.shimmer > 0 && (
            <>
              <Slider label="SPEED" value={ui.shimmerSpeed}
                min={0.5} max={8} step={0.5} unit="s"
                onChange={v => setUI('shimmerSpeed', v)} />
              <Slider label="PULSES" value={ui.shimmerPulses}
                min={1} max={4}
                onChange={v => setUI('shimmerPulses', v)} />
            </>
          )}
        </Subsection>

        {lightMode && (
          <Subsection title="GAME BOARD">
            <Slider label="LIGHT TINT" value={Math.round(ui.canvasTint * 100)}
              min={0} max={100} unit="%"
              onChange={v => setUI('canvasTint', v / 100)} />
          </Subsection>
        )}

        <button
          className="btn btn-ghost"
          style={{ marginTop: 22, fontSize: 7 }}
          onClick={resetDefaults}
        >
          ↺ RESET DEFAULTS
        </button>
      </div>

      {/* ── Account ────────────────────────────────────────────────────── */}
      <div className="card">
        <div className="card-title">ACCOUNT</div>
        <div style={{ fontSize: 8, color: 'var(--text-dim)' }}>
          Logged in as
        </div>
        <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 6, textShadow: '0 0 8px var(--accent-glow)' }}>
          {user?.username ?? '?'}
        </div>
      </div>
    </div>
  );
}
