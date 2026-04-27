import { create } from 'zustand';
import { THEMES, DEFAULT_THEME, applyTheme, applyRawTheme } from './themes.js';

const DEFAULT_UI_STATE = {
  borderWidth: 1,    // px, 0-8
  radius:      8,    // px, 0-24
  glowSize:    16,   // px, 0-48
  canvasTint:  0,    // 0-1, board blend: dark (0) -> light (1)
  borderTint:  0,    // 0-100, blend border toward accent color
  customColors:  [],
  fontSize:    1.0,  // 0.75-1.5, page zoom scale
};

function readJson(key, fallback) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || 'null');
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function readUIState() {
  const savedUI = readJson('lingo_ui', {});
  const savedCustomColors = readJson('lingo_custom_colors', null);
  return {
    ...DEFAULT_UI_STATE,
    ...savedUI,
    customColors: Array.isArray(savedCustomColors)
      ? savedCustomColors
      : (Array.isArray(savedUI.customColors) ? savedUI.customColors : []),
  };
}

/*
  Build a continuous conic gradient with N evenly-spaced bright peaks.
  Every degree of the rotation has SOME color (a soft accent halo);
  each peak ramps to white in the middle of its slice. This gives the
  Apple-Intelligence look — always-on accent ring with a traveling highlight.
*/
function buildShimmerGradient(pulses) {
  const step = 360 / pulses;
  const stops = [];
  for (let i = 0; i < pulses; i++) {
    const start  = i * step;
    const center = start + step / 2;
    const at = (f) => (start + step * f).toFixed(2);
    stops.push(
      `color-mix(in srgb, var(--accent) 18%, transparent) ${start.toFixed(2)}deg`,
      `color-mix(in srgb, var(--accent) 35%, transparent) ${at(0.15)}deg`,
      `color-mix(in srgb, var(--accent) 70%, transparent) ${at(0.30)}deg`,
      `var(--accent) ${at(0.40)}deg`,
      `color-mix(in srgb, var(--accent) 50%, white) ${at(0.46)}deg`,
      `white ${center.toFixed(2)}deg`,
      `color-mix(in srgb, var(--accent) 50%, white) ${at(0.54)}deg`,
      `var(--accent) ${at(0.60)}deg`,
      `color-mix(in srgb, var(--accent) 70%, transparent) ${at(0.70)}deg`,
      `color-mix(in srgb, var(--accent) 35%, transparent) ${at(0.85)}deg`,
      `color-mix(in srgb, var(--accent) 18%, transparent) ${at(1.0)}deg`,
    );
  }
  return `conic-gradient(from var(--shimmer-angle), ${stops.join(', ')})`;
}

/*
  rAF-driven shimmer — one source of truth, perfect sync across all cards.
  We update --shimmer-angle on documentElement once per frame; @property +
  inherits:true means every .card::after sees the same value at the same time.
*/
let shimmerRAF = null;
let shimmerSpeedSec = 2;
let shimmerPhaseStart = 0;   // performance.now() snapshot
let shimmerAngleAtPhaseStart = 0;

function shimmerTick(now) {
  const elapsed = (now - shimmerPhaseStart) / 1000;
  const angle = (shimmerAngleAtPhaseStart + (elapsed / shimmerSpeedSec) * 360) % 360;
  document.documentElement.style.setProperty('--shimmer-angle', `${angle.toFixed(2)}deg`);
  shimmerRAF = requestAnimationFrame(shimmerTick);
}

function startShimmerLoop() {
  if (shimmerRAF != null) return;
  shimmerPhaseStart = performance.now();
  shimmerAngleAtPhaseStart = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--shimmer-angle')
  ) || 0;
  shimmerRAF = requestAnimationFrame(shimmerTick);
}

function stopShimmerLoop() {
  if (shimmerRAF != null) {
    cancelAnimationFrame(shimmerRAF);
    shimmerRAF = null;
  }
}

function setShimmerSpeed(s) {
  // capture current angle so changing speed doesn't cause a visual jump
  if (shimmerRAF != null) {
    shimmerAngleAtPhaseStart = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--shimmer-angle')
    ) || 0;
    shimmerPhaseStart = performance.now();
  }
  shimmerSpeedSec = s;
}

function applyUI(ui) {
  const el = document.documentElement;
  el.style.setProperty('--border-w',  `${ui.borderWidth}px`);
  el.style.setProperty('--radius',    `${ui.radius}px`);
  el.style.setProperty('--glow-size', `${ui.glowSize}px`);
  el.style.setProperty('--border-col',
    ui.borderTint > 0
      ? `color-mix(in srgb, var(--accent) ${ui.borderTint}%, var(--border))`
      : 'var(--border)'
  );
  // Shimmer settings were removed from the UI. Keep the effect disabled.
  el.style.setProperty('--shimmer-str', '0');
  stopShimmerLoop();
  const styleEl = document.getElementById('lingo-shimmer-style');
  if (styleEl) styleEl.remove();
  el.style.setProperty('--ui-scale', `${ui.fontSize ?? DEFAULT_UI_STATE.fontSize}`);
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
  ui: readUIState(),

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

  // call once on mount to push initial state into the DOM
  initUI: () => {
    const ui = get().ui;
    applyUI(ui);
  },

  login: (user, token, saveData = null) => {
    localStorage.setItem('lingo_token', token);
    const theme = applyTheme(user.accent_theme);
    set({ user, sessionToken: token, theme, screen: 'menu', save: saveData });
  },

  logout: () => {
    localStorage.removeItem('lingo_token');
    set({ user: null, sessionToken: null, screen: 'login', gameResult: null, save: null });
  },

  setCustomTheme: (themeObj) => {
    const t = applyRawTheme(themeObj);
    set(() => ({ theme: t }));
  },

  addCustomColor: (colorObj) => set(s => {
    const colors = [...(s.ui.customColors || [])];
    const idx = colors.findIndex((t) => t.id === colorObj.id || t.accent === colorObj.accent);
    if (idx >= 0) colors[idx] = colorObj;
    else colors.push(colorObj);
    localStorage.setItem('lingo_custom_colors', JSON.stringify(colors));
    return { ui: { ...s.ui, customColors: colors } };
  }),

  removeCustomColor: (idx) => set(s => {
    const colors = (s.ui.customColors || []).filter((_, i) => i !== idx);
    localStorage.setItem('lingo_custom_colors', JSON.stringify(colors));
    return { ui: { ...s.ui, customColors: colors } };
  }),

  setTheme: (themeId) => {
    const theme = applyTheme(themeId);
    set(s => ({ theme, user: s.user ? { ...s.user, accent_theme: theme.id } : s.user }));
  },

  updateWordBank: (words) => {
    set(s => ({
      user: s.user ? { ...s.user, word_bank: words } : s.user
    }));
  },

  refreshFromMe: (meData) => {
    set(s => ({
      user: s.user ? { ...s.user, ...meData.user } : { ...meData.user },
      theme: s.theme?.custom
        ? s.theme
        : (meData.user?.accent_theme ? applyTheme(meData.user.accent_theme) : s.theme),
      save: meData.save ?? s.save,
    }));
  },

  setSave: (save) => set({ save }),

  startGame: (level = 1, resume = false) =>
    set({ screen: 'game', startLevel: level, resumeMode: resume, gameResult: null }),

  endGame: (result) => set({ screen: 'game_over', gameResult: result }),
}));
