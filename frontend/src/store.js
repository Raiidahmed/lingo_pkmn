import { create } from 'zustand';
import { THEMES, DEFAULT_THEME, applyTheme } from './themes.js';

function buildShimmerGradient(pulses) {
  const step = 360 / pulses;
  const pw = Math.min(52, step * 0.52);
  const stops = [];
  for (let i = 0; i < pulses; i++) {
    const o = i * step;
    const d = (f) => (o + pw * f).toFixed(1);
    stops.push(
      `transparent ${o.toFixed(1)}deg`,
      `color-mix(in srgb, var(--accent) 30%, transparent) ${d(0.18)}deg`,
      `var(--accent) ${d(0.36)}deg`,
      `color-mix(in srgb, var(--accent) 55%, white) ${d(0.46)}deg`,
      `white ${d(0.5)}deg`,
      `color-mix(in srgb, var(--accent) 55%, white) ${d(0.54)}deg`,
      `var(--accent) ${d(0.64)}deg`,
      `color-mix(in srgb, var(--accent) 30%, transparent) ${d(0.82)}deg`,
      `transparent ${d(1.0)}deg`,
    );
  }
  stops.push('transparent 360deg');
  return `conic-gradient(from var(--shimmer-angle), ${stops.join(', ')})`;
}

function applyUI(ui) {
  const el = document.documentElement;
  el.style.setProperty('--border-w',         `${ui.borderWidth}px`);
  el.style.setProperty('--radius',           `${ui.radius}px`);
  el.style.setProperty('--glow-size',        `${ui.glowSize}px`);
  el.style.setProperty('--border-col',
    ui.borderTint > 0
      ? `color-mix(in srgb, var(--accent) ${ui.borderTint}%, var(--border))`
      : 'var(--border)'
  );
  el.style.setProperty('--shimmer-str',      ui.shimmer / 100);
  el.style.setProperty('--shimmer-speed',    `${ui.shimmerSpeed}s`);
  el.style.setProperty('--shimmer-gradient', buildShimmerGradient(ui.shimmerPulses ?? 1));
  const root = document.getElementById('root');
  if (root) root.style.zoom = ui.fontSize ?? 1;
}

export const useStore = create((set, get) => ({
  screen: 'login',
  user: null,
  sessionToken: null,
  theme: DEFAULT_THEME,
  gameResult: null,
  startLevel: 1,
  resumeMode: false,
  save: null,   // { snapshot, status } from API
  language: 'es',
  lightMode: localStorage.getItem('lingo_light_mode') === '1',
  ui: JSON.parse(localStorage.getItem('lingo_ui') || 'null') || {
    borderWidth: 1,    // px, 0–8
    radius:      8,    // px, 0–24
    glowSize:    16,   // px, 0–48
    canvasTint:  0.58, // 0–1, light mode overlay strength
    borderTint:  0,    // 0–100, blend border toward accent color
    shimmer:       0,  // 0–100, animated gradient shimmer on card borders
    shimmerSpeed:  2,  // 0.5–8s, rotation period
    shimmerPulses: 1,  // 1–4, number of bright sweeps per rotation
    fontSize:    1.0,  // 0.75–1.5, page zoom scale
  },

  setScreen: (screen) => set({ screen }),
  setLanguage: (language) => set({ language }),

  toggleLightMode: () => set(s => {
    const next = !s.lightMode;
    localStorage.setItem('lingo_light_mode', next ? '1' : '0');
    document.documentElement.classList.toggle('light-mode', next);
    return { lightMode: next };
  }),

  setUI: (key, value) => set(s => {
    const next = { ...s.ui, [key]: value };
    localStorage.setItem('lingo_ui', JSON.stringify(next));
    applyUI(next);
    return { ui: next };
  }),

  login: (user, token, saveData = null) => {
    localStorage.setItem('lingo_token', token);
    const theme = applyTheme(user.accent_theme);
    set({ user, sessionToken: token, theme, screen: 'menu', save: saveData });
  },

  logout: () => {
    localStorage.removeItem('lingo_token');
    set({ user: null, sessionToken: null, screen: 'login', gameResult: null, save: null });
  },

  setTheme: (themeId) => {
    const theme = applyTheme(themeId);
    set(s => {
      // Re-generate shimmer gradient so it picks up the new accent color
      if (s.ui.shimmer > 0) applyUI({ ...s.ui });
      return { theme, user: s.user ? { ...s.user, accent_theme: themeId } : s.user };
    });
  },

  updateWordBank: (words) => {
    set(s => ({
      user: s.user ? { ...s.user, word_bank: words } : s.user
    }));
  },

  refreshFromMe: (meData) => {
    set(s => ({
      user: s.user ? { ...s.user, ...meData.user } : meData.user,
      save: meData.save ?? s.save,
    }));
  },

  setSave: (save) => set({ save }),

  startGame: (level = 1, resume = false) =>
    set({ screen: 'game', startLevel: level, resumeMode: resume, gameResult: null }),

  endGame: (result) => set({ screen: 'game_over', gameResult: result }),
}));
