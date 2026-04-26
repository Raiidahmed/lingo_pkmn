export const THEMES = [
  { id: 'crimson', label: 'Crimson', accent: '#cc2244', accentDark: '#881122', glow: 'rgba(204,34,68,0.3)' },
  { id: 'violet',  label: 'Violet',  accent: '#7c3aed', accentDark: '#4c1d95', glow: 'rgba(124,58,237,0.3)' },
  { id: 'teal',    label: 'Teal',    accent: '#0d9488', accentDark: '#065f5f', glow: 'rgba(13,148,136,0.3)' },
  { id: 'amber',   label: 'Amber',   accent: '#d97706', accentDark: '#92400e', glow: 'rgba(217,119,6,0.3)' },
  { id: 'mint',    label: 'Mint',    accent: '#059669', accentDark: '#064e3b', glow: 'rgba(5,150,105,0.3)' },
  { id: 'sky',     label: 'Sky',     accent: '#0090c4', accentDark: '#005a8a', glow: 'rgba(0,144,196,0.3)' },
];

export const DEFAULT_THEME = THEMES[0];

export function applyTheme(themeId) {
  const t = THEMES.find(t => t.id === themeId) || THEMES[0];
  const root = document.documentElement;
  root.style.setProperty('--accent', t.accent);
  root.style.setProperty('--accent-dark', t.accentDark);
  root.style.setProperty('--accent-glow', t.glow);
  return t;
}
