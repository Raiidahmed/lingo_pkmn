import { useState, useRef, useEffect } from 'react';

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    return Math.round(255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)))
      .toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function makeThemeFromHSL(h, s, l) {
  const accent    = hslToHex(h, s, l);
  const accentDark = hslToHex(h, Math.min(s + 10, 100), Math.max(l - 20, 8));
  const [r, g, b] = [0, 8, 4].map(n => {
    s /= 100; l /= 100;
    const a2 = (s * 100 / 100) * Math.min(l, 1 - l);
    const k = (n + h / 30) % 12;
    return Math.round(255 * (l - a2 * Math.max(Math.min(k - 3, 9 - k, 1), -1)));
    s *= 100; l *= 100;
  });
  return {
    id:        `custom_${accent}`,
    label:     accent.toUpperCase().slice(1),
    accent,
    accentDark,
    glow:      `hsla(${Math.round(h)}, ${s}%, ${l}%, 0.35)`,
    custom:    true,
  };
}

export default function ColorWheel({ onAdd }) {
  const [hue, setHue]   = useState(210);
  const [sat, setSat]   = useState(80);
  const [lit, setLit]   = useState(55);
  const ringRef         = useRef(null);
  const dragging        = useRef(false);

  const SIZE  = 160;
  const THICK = 28;   // ring thickness
  const R     = SIZE / 2;
  const MID   = R - THICK / 2;  // radius to center of ring

  const accent    = `hsl(${hue}, ${sat}%, ${lit}%)`;
  const accentHex = hslToHex(hue, sat, lit);
  const theme     = makeThemeFromHSL(hue, sat, lit);

  function angleFromEvent(e) {
    const rect = ringRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const angle = Math.atan2(clientY - cy, clientX - cx) * 180 / Math.PI + 90;
    return ((angle % 360) + 360) % 360;
  }

  function onPointerDown(e) {
    dragging.current = true;
    setHue(angleFromEvent(e));
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e) {
    if (dragging.current) setHue(angleFromEvent(e));
  }
  function onPointerUp() { dragging.current = false; }

  // Handle position on ring edge
  const hx = R + MID * Math.sin(hue * Math.PI / 180);
  const hy = R - MID * Math.cos(hue * Math.PI / 180);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>

      {/* Hue ring */}
      <div
        ref={ringRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          position: 'relative',
          width: SIZE, height: SIZE,
          borderRadius: '50%',
          background: 'conic-gradient(from -90deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080, #ff0000)',
          cursor: 'crosshair',
          touchAction: 'none',
          userSelect: 'none',
          flexShrink: 0,
        }}
      >
        {/* Inner cutout to make it a ring */}
        <div style={{
          position: 'absolute',
          inset: THICK,
          borderRadius: '50%',
          background: 'var(--surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          {/* Live preview swatch in center */}
          <div style={{
            width: 52, height: 52,
            borderRadius: '50%',
            background: accent,
            border: '2px solid var(--border-col)',
            boxShadow: `0 0 14px ${accent}`,
            transition: 'background 0.1s, box-shadow 0.1s',
          }} />
        </div>

        {/* Draggable hue handle */}
        <div style={{
          position: 'absolute',
          left: hx, top: hy,
          width: 16, height: 16,
          borderRadius: '50%',
          background: accent,
          border: '2.5px solid #fff',
          boxShadow: `0 0 6px rgba(0,0,0,0.6), 0 0 10px ${accent}`,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          transition: 'background 0.05s',
        }} />
      </div>

      {/* Saturation */}
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 6, color: 'var(--text-dim)' }}>SATURATION</span>
          <span style={{ fontSize: 7, color: 'var(--accent)' }}>{sat}%</span>
        </div>
        <input type="range" className="ui-slider" min={10} max={100} value={sat}
          onChange={e => setSat(Number(e.target.value))} />
      </div>

      {/* Lightness */}
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 6, color: 'var(--text-dim)' }}>LIGHTNESS</span>
          <span style={{ fontSize: 7, color: 'var(--accent)' }}>{lit}%</span>
        </div>
        <input type="range" className="ui-slider" min={20} max={78} value={lit}
          onChange={e => setLit(Number(e.target.value))} />
      </div>

      {/* Hex readout */}
      <div style={{
        fontSize: 9,
        color: accentHex,
        letterSpacing: 3,
        textShadow: `0 0 10px ${accentHex}`,
        fontFamily: 'monospace',
      }}>
        {accentHex.toUpperCase()}
      </div>

      {/* Add button */}
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
