import { create } from 'zustand';
import { THEMES, DEFAULT_THEME, applyTheme } from './themes.js';

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
    borderWidth: 1,   // px, 0–8
    radius:      8,   // px, 0–24
    glowSize:    16,  // px, 0–48
    canvasTint:  0.58, // 0–1, light mode overlay strength
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
    const el = document.documentElement;
    el.style.setProperty('--border-w', `${next.borderWidth}px`);
    el.style.setProperty('--radius',   `${next.radius}px`);
    el.style.setProperty('--glow-size',`${next.glowSize}px`);
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
    set(s => ({ theme, user: s.user ? { ...s.user, accent_theme: themeId } : s.user }));
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
