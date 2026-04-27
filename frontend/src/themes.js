export const THEMES = [
  { id: 'crimson', label: 'White', accent: '#ffffff', accentDark: '#bdbdbd', accentRgb: '255,255,255', glow: 'rgba(255,255,255,0.34)' },
  { id: 'violet',  label: 'Violet',  accent: '#7c3aed', accentDark: '#4c1d95', accentRgb: '124,58,237', glow: 'rgba(124,58,237,0.3)' },
  { id: 'teal',    label: 'Teal',    accent: '#0d9488', accentDark: '#065f5f', accentRgb: '13,148,136', glow: 'rgba(13,148,136,0.3)' },
  { id: 'amber',   label: 'Amber',   accent: '#d97706', accentDark: '#92400e', accentRgb: '217,119,6', glow: 'rgba(217,119,6,0.3)' },
  { id: 'mint',    label: 'Mint',    accent: '#059669', accentDark: '#064e3b', accentRgb: '5,150,105', glow: 'rgba(5,150,105,0.3)' },
  { id: 'sky',     label: 'Sky',     accent: '#0090c4', accentDark: '#005a8a', accentRgb: '0,144,196', glow: 'rgba(0,144,196,0.3)' },
];

export const DEFAULT_THEME = THEMES[0];

function hexToRgbString(hex) {
  const clean = hex?.replace('#', '');
  if (!clean || !/^[0-9a-fA-F]{6}$/.test(clean)) return DEFAULT_THEME.accentRgb;
  const value = parseInt(clean, 16);
  return `${(value >> 16) & 255},${(value >> 8) & 255},${value & 255}`;
}

export function applyTheme(themeId) {
  const t = THEMES.find(t => t.id === themeId) || THEMES[0];
  return applyRawTheme(t);
}

export function applyRawTheme(t) {
  const accentRgb = t.accentRgb || hexToRgbString(t.accent);
  const theme = {
    ...t,
    accentDark: t.accentDark || t.accent,
    accentRgb,
    glow: t.glow || `rgba(${accentRgb},0.3)`,
  };
  const root = document.documentElement;
  root.style.setProperty('--accent',      theme.accent);
  root.style.setProperty('--accent-dark', theme.accentDark);
  root.style.setProperty('--accent-rgb',  theme.accentRgb);
  root.style.setProperty('--accent-glow', theme.glow);
  return theme;
}
