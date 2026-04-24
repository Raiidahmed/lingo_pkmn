export const WORD_PAIRS = [
  // Level 1 — greetings
  [
    { es: 'hola',      en: 'hello' },
    { es: 'adiós',     en: 'goodbye' },
    { es: 'gracias',   en: 'thank you' },
    { es: 'por favor', en: 'please' },
    { es: 'sí',        en: 'yes' },
    { es: 'no',        en: 'no' },
  ],
  // Level 2 — numbers
  [
    { es: 'uno',    en: 'one' },
    { es: 'dos',    en: 'two' },
    { es: 'tres',   en: 'three' },
    { es: 'cuatro', en: 'four' },
    { es: 'cinco',  en: 'five' },
    { es: 'diez',   en: 'ten' },
  ],
  // Level 3 — colors
  [
    { es: 'rojo',     en: 'red' },
    { es: 'azul',     en: 'blue' },
    { es: 'verde',    en: 'green' },
    { es: 'negro',    en: 'black' },
    { es: 'blanco',   en: 'white' },
    { es: 'amarillo', en: 'yellow' },
  ],
  // Level 4 — animals
  [
    { es: 'perro',   en: 'dog' },
    { es: 'gato',    en: 'cat' },
    { es: 'pájaro',  en: 'bird' },
    { es: 'pez',     en: 'fish' },
    { es: 'caballo', en: 'horse' },
    { es: 'lobo',    en: 'wolf' },
  ],
  // Level 5 — food
  [
    { es: 'pan',     en: 'bread' },
    { es: 'agua',    en: 'water' },
    { es: 'leche',   en: 'milk' },
    { es: 'manzana', en: 'apple' },
    { es: 'arroz',   en: 'rice' },
    { es: 'fuego',   en: 'fire' },
  ],
  // Level 6 — dungeon
  [
    { es: 'espada', en: 'sword' },
    { es: 'llave',  en: 'key' },
    { es: 'puerta', en: 'door' },
    { es: 'oro',    en: 'gold' },
    { es: 'dragón', en: 'dragon' },
    { es: 'magia',  en: 'magic' },
  ],
  // Level 7 — actions
  [
    { es: 'correr',  en: 'run' },
    { es: 'saltar',  en: 'jump' },
    { es: 'luchar',  en: 'fight' },
    { es: 'escapar', en: 'escape' },
    { es: 'ganar',   en: 'win' },
    { es: 'morir',   en: 'die' },
  ],
  // Level 8 — adjectives
  [
    { es: 'grande',   en: 'big' },
    { es: 'pequeño',  en: 'small' },
    { es: 'rápido',   en: 'fast' },
    { es: 'fuerte',   en: 'strong' },
    { es: 'oscuro',   en: 'dark' },
    { es: 'valiente', en: 'brave' },
  ],
  // Level 9 — family
  [
    { es: 'madre',   en: 'mother' },
    { es: 'padre',   en: 'father' },
    { es: 'hermano', en: 'brother' },
    { es: 'hermana', en: 'sister' },
    { es: 'amigo',   en: 'friend' },
    { es: 'enemigo', en: 'enemy' },
  ],
  // Level 10 — advanced
  [
    { es: 'biblioteca', en: 'library' },
    { es: 'peligroso',  en: 'dangerous' },
    { es: 'aventura',   en: 'adventure' },
    { es: 'victoria',   en: 'victory' },
    { es: 'campeón',    en: 'champion' },
    { es: 'leyenda',    en: 'legend' },
  ],
];

// Returns all pairs from all levels for generating wrong answers
export const ALL_PAIRS = WORD_PAIRS.flat();

export function getOraclePairs(levelN) {
  const idx = Math.min(Math.max(levelN - 1, 0), WORD_PAIRS.length - 1);
  return WORD_PAIRS[idx];
}

// Seeded PRNG (mulberry32)
export function seededRng(seed) {
  let s = seed;
  return function() {
    s |= 0; s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export function makeChallenge(pair, levelN, rng) {
  // pick 3 wrong answers from other pairs
  const pool = ALL_PAIRS.filter(p => p.es !== pair.es);
  const wrong = [];
  const used = new Set();
  while (wrong.length < 3 && wrong.length < pool.length) {
    const i = Math.floor(rng() * pool.length);
    if (!used.has(i)) { used.add(i); wrong.push(pool[i].en); }
  }
  const choices = [pair.en, ...wrong];
  // shuffle
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  return { word: pair.es, answer: pair.en, choices };
}
