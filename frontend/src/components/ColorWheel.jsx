import { useMemo, useRef, useState } from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';

const DEFAULT_COLOR = '#3b82f6';

function normalizeHex(value) {
  const raw = String(value || '').trim().replace(/^#/, '').replace(/[^0-9a-fA-F]/g, '');
  if (raw.length === 3) {
    return `#${raw.split('').map((c) => c + c).join('').toLowerCase()}`;
  }
  if (raw.length === 6) return `#${raw.toLowerCase()}`;
  return null;
}

function hexToRgb(hex) {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;
  const value = parseInt(normalized.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function toHexByte(n) {
  return Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
}

function darkenHex(hex, ratio = 0.35) {
  const rgb = hexToRgb(hex);
  if (!rgb) return DEFAULT_COLOR;
  const factor = Math.max(0, Math.min(1, 1 - ratio));
  return `#${toHexByte(rgb[0] * factor)}${toHexByte(rgb[1] * factor)}${toHexByte(rgb[2] * factor)}`;
}

function makeThemeFromHex(hex) {
  const accent = normalizeHex(hex) || DEFAULT_COLOR;
  const rgb = hexToRgb(accent) || [59, 130, 246];
  const accentRgb = `${rgb[0]},${rgb[1]},${rgb[2]}`;
  return {
    id: `custom_${accent}`,
    label: accent.toUpperCase().slice(1),
    accent,
    accentDark: darkenHex(accent),
    accentRgb,
    glow: `rgba(${accentRgb},0.35)`,
    custom: true,
  };
}

export default function ColorWheel({ onAdd }) {
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [dropperError, setDropperError] = useState('');
  const fallbackPickerRef = useRef(null);
  const theme = useMemo(() => makeThemeFromHex(color), [color]);
  const handleColorChange = (next) => {
    const normalized = normalizeHex(next);
    if (normalized) setColor(normalized);
  };
  const canUseDropper = typeof window !== 'undefined'
    && window.isSecureContext
    && typeof window.EyeDropper === 'function';

  function openFallbackPicker() {
    const picker = fallbackPickerRef.current;
    if (!picker) return;
    picker.value = theme.accent;
    picker.click();
  }

  async function handlePickFromScreen() {
    setDropperError('');
    if (!canUseDropper) {
      openFallbackPicker();
      return;
    }
    try {
      const picker = new window.EyeDropper();
      const result = await picker.open();
      const pickedColor = result?.sRGBHex || result?.srgbHex || '';
      if (!pickedColor) {
        setDropperError('Dropper did not return a color');
        return;
      }
      handleColorChange(pickedColor);
    } catch (err) {
      if (err?.name !== 'AbortError') {
        setDropperError('Dropper unavailable, using fallback picker');
        openFallbackPicker();
      }
    }
  }

  return (
    <div className="color-picker-panel">
      <HexColorPicker className="custom-color-picker" color={theme.accent} onChange={handleColorChange} />

      <div className="color-picker-row">
        <span className="color-picker-label">HEX</span>
        <HexColorInput
          className="text-input color-hex-input"
          color={theme.accent}
          onChange={handleColorChange}
          prefixed
          alpha={false}
        />
      </div>

      <input
        ref={fallbackPickerRef}
        type="color"
        value={theme.accent}
        aria-label="Fallback color picker"
        onChange={(event) => handleColorChange(event.target.value)}
        tabIndex={-1}
        style={{
          position: 'absolute',
          opacity: 0,
          width: 1,
          height: 1,
          pointerEvents: 'none',
        }}
      />

      <button
        className="btn btn-ghost color-dropper-btn"
        type="button"
        onClick={handlePickFromScreen}
      >
        {canUseDropper ? 'USE DROPPER' : 'OPEN COLOR PICKER'}
      </button>
      {dropperError && <div className="color-picker-error">{dropperError}</div>}

      <div className="color-preview-code" style={{ color: theme.accent }}>
        {theme.accent.toUpperCase()}
      </div>

      <button
        className="btn btn-accent"
        style={{ fontSize: 7, width: '100%' }}
        onClick={() => onAdd(theme)}
      >
        + SAVE COLOR
      </button>
    </div>
  );
}
