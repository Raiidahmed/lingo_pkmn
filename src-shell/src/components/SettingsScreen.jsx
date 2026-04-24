import { useState } from 'react';
import { useAppStore, ACCENT_THEMES } from '../state/appStore.js';

export default function SettingsScreen() {
  const accent = useAppStore(s => s.accent);
  const setAccent = useAppStore(s => s.setAccent);
  const gotoStatus = useAppStore(s => s.gotoStatus);
  const gotoTitle = useAppStore(s => s.gotoTitle);
  const session = useAppStore(s => s.session);

  const [soundOn, setSoundOn] = useState(true);

  return (
    <div className="screen" id="screen-settings">
      <div className="screen-shell">
        <h1>Settings</h1>
        <h2>Shell preferences</h2>

        <div className="ui-panel">
          <h3>Accent Palette</h3>
          <p>Applied across shell + passed to the embedded game host chrome.</p>
          <div
            className="theme-options"
            role="radiogroup"
            aria-label="Accent palette"
          >
            {ACCENT_THEMES.map(t => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={accent === t.id}
                className="theme-chip"
                onClick={() => setAccent(t.id)}
              >
                <span
                  className="swatch"
                  style={{ background: t.value }}
                  aria-hidden="true"
                />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="ui-panel">
          <h3>Sound</h3>
          <p>
            In the spike, audio lives inside the legacy game iframe. This toggle
            only records shell intent — the real SFX switch is inside the game.
          </p>
          <div className="auth-actions">
            <button
              type="button"
              className="ghost-btn"
              onClick={() => setSoundOn(v => !v)}
            >
              Sound: {soundOn ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        <div className="screen-actions">
          {session ? (
            <button type="button" className="big-btn" onClick={gotoStatus}>
              Back to Status ▶
            </button>
          ) : (
            <button type="button" className="big-btn" onClick={gotoTitle}>
              Back to Title ▶
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
