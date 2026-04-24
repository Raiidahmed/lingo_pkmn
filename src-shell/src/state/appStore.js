import { create } from 'zustand';
import * as api from './api';

// Explicit app state machine. Each screen name matches the proposal:
//   booting | anonymous_title | authenticating | authenticated_title
//   | in_game | status | settings | game_over
export const SCREENS = Object.freeze({
  BOOTING: 'booting',
  ANON_TITLE: 'anonymous_title',
  AUTHENTICATING: 'authenticating',
  AUTH_TITLE: 'authenticated_title',
  IN_GAME: 'in_game',
  STATUS: 'status',
  SETTINGS: 'settings',
  GAME_OVER: 'game_over',
});

export const ACCENT_THEMES = [
  { id: 'violet', label: 'Dungeon Violet', value: '#5b2fb0', dark: '#35156f' },
  { id: 'crimson', label: 'Crimson Sigil', value: '#cc0033', dark: '#7a001f' },
  { id: 'teal', label: 'Temple Teal', value: '#0f8f8f', dark: '#075959' },
  { id: 'amber', label: 'Torch Amber', value: '#c68400', dark: '#7b4f00' },
  { id: 'mint', label: 'Mint Rune', value: '#0f9d73', dark: '#076348' },
];

const TOKEN_KEY = 'lingoSpikeTokenV1';
const ACCENT_KEY = 'lingoAccentTheme';
const SOUND_KEY = 'lingoSound';

function safeGet(key) {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function safeSet(key, value) {
  try {
    if (value == null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch { /* ignore */ }
}

function resolveAccent(themeId) {
  return ACCENT_THEMES.find(t => t.id === themeId) || ACCENT_THEMES[0];
}

function readStoredSoundEnabled() {
  const raw = safeGet(SOUND_KEY);
  return raw !== 'off';
}

function applyAccentToDom(themeId) {
  const theme = resolveAccent(themeId);
  const root = document.documentElement;
  root.style.setProperty('--accent', theme.value);
  root.style.setProperty('--accent-dark', theme.dark);
  return theme.id;
}

export const useAppStore = create((set, get) => ({
  // --- state machine ---
  screen: SCREENS.BOOTING,
  previousScreen: null,

  // --- session (auth) ---
  session: null, // { token, profile: { name, created_at, updated_at } }

  // --- save / status ---
  saveStatus: null, // { storyLabel, totalXP, wordCount, hasActiveRun, levelLabel }
  wordBank: [],

  // --- UI ---
  accent: resolveAccent(safeGet(ACCENT_KEY)).id,
  soundEnabled: readStoredSoundEnabled(),
  leaderboard: [],

  // --- async/pending flags ---
  pending: {
    boot: false,
    auth: false,
    leaderboard: false,
  },

  // --- errors ---
  authMessage: 'Enter your save name, then continue.',

  // --- game_over payload ---
  gameOverStats: null,

  // ========================================================
  // Actions
  // ========================================================
  setScreen(screen) {
    set(s => ({ previousScreen: s.screen, screen }));
  },

  setAccent(id) {
    const resolvedId = applyAccentToDom(id);
    safeSet(ACCENT_KEY, resolvedId);
    set({ accent: resolvedId });
  },

  setSoundEnabled(enabled) {
    const next = Boolean(enabled);
    safeSet(SOUND_KEY, next ? 'on' : 'off');
    set({ soundEnabled: next });
  },

  setAuthMessage(msg) {
    set({ authMessage: msg });
  },

  async boot() {
    const resolvedAccent = applyAccentToDom(get().accent);
    safeSet(ACCENT_KEY, resolvedAccent);
    set(s => ({ pending: { ...s.pending, boot: true } }));
    const token = safeGet(TOKEN_KEY);
    if (!token) {
      set(s => ({
        screen: SCREENS.ANON_TITLE,
        pending: { ...s.pending, boot: false },
      }));
      get().loadLeaderboard();
      return;
    }
    try {
      const me = await api.fetchMe(token);
      const status = (me.save && me.save.status) || {};
      set(s => ({
        screen: SCREENS.AUTH_TITLE,
        session: { token, profile: me.profile },
        saveStatus: {
          storyLabel: status.storyLabel || 'New run',
          totalXP: status.totalXP || 0,
          wordCount: status.wordCount || 0,
          hasActiveRun: Boolean(status.hasActiveRun),
          levelLabel: status.levelLabel || 'Level 1',
        },
        wordBank: me.word_bank || [],
        pending: { ...s.pending, boot: false },
      }));
    } catch (err) {
      safeSet(TOKEN_KEY, null);
      set(s => ({
        screen: SCREENS.ANON_TITLE,
        session: null,
        pending: { ...s.pending, boot: false },
      }));
    }
    get().loadLeaderboard();
  },

  async login({ name, password, intent }) {
    set(s => ({
      screen: SCREENS.AUTHENTICATING,
      pending: { ...s.pending, auth: true },
      authMessage: intent === 'create' ? 'Creating save...' : 'Resuming save...',
    }));
    try {
      const res = await api.login({ name, password, intent });
      safeSet(TOKEN_KEY, res.token);
      const status = (res.save && res.save.status) || {};
      set(s => ({
        screen: SCREENS.STATUS,
        session: { token: res.token, profile: res.profile },
        saveStatus: {
          storyLabel: status.storyLabel || 'New run',
          totalXP: status.totalXP || 0,
          wordCount: status.wordCount || 0,
          hasActiveRun: Boolean(status.hasActiveRun),
          levelLabel: status.levelLabel || 'Level 1',
        },
        wordBank: res.word_bank || [],
        pending: { ...s.pending, auth: false },
        authMessage: res.created
          ? `Save created for ${res.profile.name}.`
          : `Welcome back, ${res.profile.name}.`,
      }));
    } catch (err) {
      set(s => ({
        screen: SCREENS.ANON_TITLE,
        pending: { ...s.pending, auth: false },
        authMessage: err.message || 'Login failed.',
      }));
    }
  },

  async logout() {
    const token = get().session?.token;
    safeSet(TOKEN_KEY, null);
    if (token) {
      // fire-and-forget; shell state clears either way
      api.logout(token).catch(() => {});
    }
    set({
      screen: SCREENS.ANON_TITLE,
      session: null,
      saveStatus: null,
      wordBank: [],
      authMessage: 'Signed out. Enter your save name to resume.',
    });
    get().loadLeaderboard();
  },

  async loadLeaderboard() {
    set(s => ({ pending: { ...s.pending, leaderboard: true } }));
    try {
      const scores = await api.fetchScores(20);
      set(s => ({
        leaderboard: Array.isArray(scores) ? scores : [],
        pending: { ...s.pending, leaderboard: false },
      }));
    } catch {
      set(s => ({
        leaderboard: [],
        pending: { ...s.pending, leaderboard: false },
      }));
    }
  },

  gotoStatus() { get().setScreen(SCREENS.STATUS); },
  gotoSettings() { get().setScreen(SCREENS.SETTINGS); },
  gotoTitle() {
    const session = get().session;
    get().setScreen(session ? SCREENS.AUTH_TITLE : SCREENS.ANON_TITLE);
  },
  enterDungeon() { get().setScreen(SCREENS.IN_GAME); },

  // Called by the game canvas module (iframe postMessage or direct call)
  reportGameOver(stats) {
    set({
      screen: SCREENS.GAME_OVER,
      gameOverStats: stats || null,
    });
  },

  resetGameOver() {
    set({ gameOverStats: null });
    get().loadLeaderboard();
  },
}));

// Expose a debugging hook so you can poke state from the browser console.
if (typeof window !== 'undefined') {
  window.__lingoShell = { useAppStore, SCREENS };
}
