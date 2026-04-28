const getToken = () => localStorage.getItem('lingo_token');
const REQUEST_TIMEOUT_MS = 10000;

async function req(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res;
  try {
    res = await fetch(path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    if (err?.name === 'AbortError') throw new Error('Request timed out');
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json().catch(() => ({}));
}

export const api = {
  login: (username) => req('POST', '/api/login', { username }),
  logout: () => req('POST', '/api/logout'),
  me: () => req('GET', '/api/me'),
  leaderboard: () => req('GET', '/api/leaderboard'),
  submitScore: (level, score, time_ms) => req('POST', '/api/scores', { level, score, time_ms }),
  addWords: (words, source) => req('POST', '/api/word-bank', { words, source }),
  setTheme: (theme) => req('POST', '/api/theme', { theme }),
  saveGame: (snapshot, status) => req('POST', '/api/save', { snapshot, status }),
  markLevelComplete: (level) => req('POST', '/api/level-complete', { level }),
};
