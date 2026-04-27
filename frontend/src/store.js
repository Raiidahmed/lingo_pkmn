import { create } from 'zustand';
import { api } from './api.js';
import { THEMES, DEFAULT_THEME, applyTheme, applyRawTheme } from './themes.js';

const PRESET_THEME_BY_ID = new Map(THEMES.map((theme) => [theme.id, theme]));

const DEFAULT_UI_STATE = {
  borderWidth: 1,   // px, 0-8
  radius: 8,        // px, 0-24
  glowSize: 16,     // px, 0-48
  canvasTint: 0,    // 0-1, board blend: dark (0) -> light (1)
  borderTint: 0,    // 0-100, blend border toward accent color
  customColors: [],
  fontSize: 1.0,    // 0.75-1.5, page zoom scale
};

let preferenceSyncTimer = null;

function clampNumber(value, min, max, fallback) {
  const n = Number(value);
  if (Number.isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function sanitizeCustomTheme(theme) {
  if (!theme || typeof theme !== 'object') return null;

  const preset = typeof theme.id === 'string' ? PRESET_THEME_BY_ID.get(theme.id) : null;
  if (preset && !theme.custom) return preset;

  if (typeof theme.accent !== 'string') return null;

  return {
    id: String(theme.id || `custom_${theme.accent}`),
    label: String(theme.label || theme.accent.replace('#', '').toUpperCase()),
    accent: theme.accent,
    accentDark: typeof theme.accentDark === 'string' ? theme.accentDark : theme.accent,
    accentRgb: typeof theme.accentRgb === 'string' ? theme.accentRgb : undefined,
    glow: typeof theme.glow === 'string' ? theme.glow : undefined,
    custom: true,
  };
}

function sanitizeCustomColors(colors) {
  if (!Array.isArray(colors)) return [];
  const next = [];
  const seen = new Set();
  for (const color of colors) {
    const normalized = sanitizeCustomTheme({ ...color, custom: true });
    if (!normalized) continue;
    const key = `${normalized.id}:${normalized.accent}`;
    if (seen.has(key)) continue;
    seen.add(key);
    next.push(normalized);
    if (next.length >= 64) break;
  }
  return next;
}

function normalizeUISettings(uiSettings, customColors) {
  const source = (uiSettings && typeof uiSettings === 'object') ? uiSettings : {};
  return {
    borderWidth: clampNumber(source.borderWidth, 0, 8, DEFAULT_UI_STATE.borderWidth),
    radius: clampNumber(source.radius, 0, 24, DEFAULT_UI_STATE.radius),
    glowSize: clampNumber(source.glowSize, 0, 64, DEFAULT_UI_STATE.glowSize),
    canvasTint: clampNumber(source.canvasTint, 0, 1, DEFAULT_UI_STATE.canvasTint),
    borderTint: clampNumber(source.borderTint, 0, 100, DEFAULT_UI_STATE.borderTint),
    fontSize: clampNumber(source.fontSize, 0.75, 1.5, DEFAULT_UI_STATE.fontSize),
    customColors: sanitizeCustomColors(customColors),
  };
}

function normalizeThemeFromUser(user, fallbackTheme) {
  const activeTheme = sanitizeCustomTheme(user?.active_theme);
  if (activeTheme) {
    return activeTheme.custom ? applyRawTheme(activeTheme) : applyTheme(activeTheme.id);
  }
  if (user?.accent_theme) return applyTheme(user.accent_theme);
  return fallbackTheme;
}

function serializeTheme(theme) {
  if (!theme || typeof theme !== 'object') return null;
  const safe = sanitizeCustomTheme(theme.custom ? theme : { id: theme.id, custom: false });
  if (safe) return safe;
  if (typeof theme.id === 'string' && PRESET_THEME_BY_ID.has(theme.id)) {
    return { id: theme.id };
  }
  return null;
}

function serializeUISettings(ui) {
  return {
    borderWidth: clampNumber(ui.borderWidth, 0, 8, DEFAULT_UI_STATE.borderWidth),
    radius: clampNumber(ui.radius, 0, 24, DEFAULT_UI_STATE.radius),
    glowSize: clampNumber(ui.glowSize, 0, 64, DEFAULT_UI_STATE.glowSize),
    canvasTint: clampNumber(ui.canvasTint, 0, 1, DEFAULT_UI_STATE.canvasTint),
    borderTint: clampNumber(ui.borderTint, 0, 100, DEFAULT_UI_STATE.borderTint),
    fontSize: clampNumber(ui.fontSize, 0.75, 1.5, DEFAULT_UI_STATE.fontSize),
  };
}

function applyUI(ui) {
  const el = document.documentElement;
  el.style.setProperty('--border-w', `${ui.borderWidth}px`);
  el.style.setProperty('--radius', `${ui.radius}px`);
  el.style.setProperty('--glow-size', `${ui.glowSize}px`);
  el.style.setProperty(
    '--border-col',
    ui.borderTint > 0
      ? `color-mix(in srgb, var(--accent) ${ui.borderTint}%, var(--border))`
      : 'var(--border)'
  );
  // Shimmer settings were removed from the UI. Keep the effect disabled.
  el.style.setProperty('--shimmer-str', '0');
  const styleEl = document.getElementById('lingo-shimmer-style');
  if (styleEl) styleEl.remove();
  el.style.setProperty('--ui-scale', `${ui.fontSize ?? DEFAULT_UI_STATE.fontSize}`);
}

function buildPreferencePayload(state) {
  return {
    ui_settings: serializeUISettings(state.ui),
    custom_colors: sanitizeCustomColors(state.ui.customColors || []),
    active_theme: serializeTheme(state.theme),
    light_mode: !!state.lightMode,
  };
}

function queuePreferenceSync(get) {
  if (preferenceSyncTimer) clearTimeout(preferenceSyncTimer);
  preferenceSyncTimer = window.setTimeout(async () => {
    const state = get();
    if (!state.sessionToken || !state.user) return;
    try {
      await api.savePreferences(buildPreferencePayload(state));
    } catch (err) {
      console.warn('savePreferences', err);
    }
  }, 220);
}

function applyPreferenceState(theme, ui, lightMode) {
  applyRawTheme(theme);
  applyUI(ui);
  document.documentElement.classList.toggle('light-mode', !!lightMode);
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
  lightMode: false,
  ui: { ...DEFAULT_UI_STATE },

  setScreen: (screen) => set({ screen }),
  setLanguage: (language) => set({ language }),

  toggleLightMode: () => {
    const next = !get().lightMode;
    document.documentElement.classList.toggle('light-mode', next);
    set((s) => ({
      lightMode: next,
      user: s.user ? { ...s.user, light_mode: next } : s.user,
    }));
    queuePreferenceSync(get);
  },

  setUI: (key, value) => {
    set((s) => {
      const next = {
        ...s.ui,
        [key]: value,
      };
      const normalized = normalizeUISettings(next, next.customColors);
      applyUI(normalized);
      return {
        ui: normalized,
        user: s.user ? { ...s.user, ui_settings: serializeUISettings(normalized), custom_colors: normalized.customColors } : s.user,
      };
    });
    queuePreferenceSync(get);
  },

  // call once on mount to push initial state into the DOM
  initUI: () => {
    const s = get();
    applyPreferenceState(s.theme, s.ui, s.lightMode);
  },

  login: (user, token, saveData = null) => {
    localStorage.setItem('lingo_token', token);
    const ui = normalizeUISettings(user?.ui_settings, user?.custom_colors);
    const lightMode = !!user?.light_mode;
    const theme = normalizeThemeFromUser(user, DEFAULT_THEME);
    applyPreferenceState(theme, ui, lightMode);
    set({
      user: { ...user, ui_settings: serializeUISettings(ui), custom_colors: ui.customColors, light_mode: lightMode },
      sessionToken: token,
      theme,
      lightMode,
      ui,
      screen: 'menu',
      save: saveData,
    });
  },

  logout: () => {
    localStorage.removeItem('lingo_token');
    const ui = { ...DEFAULT_UI_STATE };
    const theme = applyTheme(DEFAULT_THEME.id);
    applyPreferenceState(theme, ui, false);
    set({
      user: null,
      sessionToken: null,
      screen: 'login',
      gameResult: null,
      save: null,
      theme,
      lightMode: false,
      ui,
    });
  },

  setCustomTheme: (themeObj) => {
    const t = applyRawTheme(themeObj);
    set((s) => ({ theme: t, user: s.user ? { ...s.user, active_theme: serializeTheme(t) } : s.user }));
    queuePreferenceSync(get);
  },

  addCustomColor: (colorObj) => {
    set((s) => {
      const colors = [...(s.ui.customColors || [])];
      const normalized = sanitizeCustomTheme({ ...colorObj, custom: true });
      if (!normalized) return {};
      const idx = colors.findIndex((t) => t.id === normalized.id || t.accent === normalized.accent);
      if (idx >= 0) colors[idx] = normalized;
      else colors.push(normalized);
      const ui = normalizeUISettings(s.ui, colors);
      return {
        ui,
        user: s.user ? { ...s.user, custom_colors: ui.customColors } : s.user,
      };
    });
    queuePreferenceSync(get);
  },

  removeCustomColor: (idx) => {
    set((s) => {
      const colors = (s.ui.customColors || []).filter((_, i) => i !== idx);
      const ui = normalizeUISettings(s.ui, colors);
      return {
        ui,
        user: s.user ? { ...s.user, custom_colors: ui.customColors } : s.user,
      };
    });
    queuePreferenceSync(get);
  },

  setTheme: (themeId) => {
    const theme = applyTheme(themeId);
    set((s) => ({
      theme,
      user: s.user ? { ...s.user, accent_theme: theme.id, active_theme: serializeTheme(theme) } : s.user,
    }));
    queuePreferenceSync(get);
  },

  updateWordBank: (words) => {
    set((s) => ({
      user: s.user ? { ...s.user, word_bank: words } : s.user
    }));
  },

  refreshFromMe: (meData) => {
    set((s) => {
      const mergedUser = s.user ? { ...s.user, ...meData.user } : { ...meData.user };
      const ui = normalizeUISettings(mergedUser.ui_settings, mergedUser.custom_colors);
      const lightMode = typeof mergedUser.light_mode === 'boolean' ? mergedUser.light_mode : s.lightMode;
      const theme = normalizeThemeFromUser(mergedUser, s.theme);
      applyPreferenceState(theme, ui, lightMode);
      return {
        user: { ...mergedUser, ui_settings: serializeUISettings(ui), custom_colors: ui.customColors, light_mode: lightMode },
        theme,
        ui,
        lightMode,
        save: meData.save ?? s.save,
      };
    });
  },

  setSave: (save) => set({ save }),

  startGame: (level = 1, resume = false) =>
    set({ screen: 'game', startLevel: level, resumeMode: resume, gameResult: null }),

  endGame: (result) => set({ screen: 'game_over', gameResult: result }),
}));
