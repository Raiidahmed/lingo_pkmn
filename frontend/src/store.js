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
  thickBorder: localStorage.getItem('lingo_thick_border') === '1',

  setScreen: (screen) => set({ screen }),
  setLanguage: (language) => set({ language }),
  toggleLightMode: () => set(s => {
    const next = !s.lightMode;
    localStorage.setItem('lingo_light_mode', next ? '1' : '0');
    document.documentElement.classList.toggle('light-mode', next);
    return { lightMode: next };
  }),
  toggleThickBorder: () => set(s => {
    const next = !s.thickBorder;
    localStorage.setItem('lingo_thick_border', next ? '1' : '0');
    document.documentElement.classList.toggle('thick-border', next);
    return { thickBorder: next };
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
