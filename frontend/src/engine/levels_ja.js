// Japanese levels — TILE: FLOOR=0, WALL=1, DOOR_C=2, DOOR_O=3, CHEST_C=4, CHEST_O=5, STAIRS=6, RUG=7
// Course: hiragana (1–10), katakana (11–20), numbers (21–23).
// Each chest is a "mouse" critter (rendered via mouseAssets); each level has
// one final door that locks the stairs and tests a quick recall question.

// ─── Map templates ─────────────────────────────────────────────────────────────
// Each template defines: a 13×15 grid, the player start, the chest positions
// (one per critter), and a final-door position that gates the stairs.
// All paths verified by hand.

const T5 = {
  // 5 chests scattered through a connected garden, stairs top-left,
  // single locked door blocks the stairs corridor.
  map: () => [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,6,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,2,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,4,0,0,0,0,0,4,0,0,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,0,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,4,0,0,0,0,0,0,1],
    [1,0,1,0,1,1,1,0,1,1,1,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,0,0,4,0,0,0,0,0,4,0,0,0,1],
    [1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ],
  playerStart: { col: 7, row: 11 },
  chestKeys:   ['4,3', '10,3', '7,6', '4,9', '10,9'],
  doorKey:     '2,2',
};

const T4 = {
  // 4 chests in symmetric chambers — used for the review halls (10, 20).
  map: () => [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,6,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,2,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
    [1,0,4,0,1,0,0,0,0,0,1,0,4,0,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
    [1,1,0,1,1,1,1,0,1,1,1,1,0,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,1,1,0,1,1,0,1],
    [1,0,4,1,0,0,0,0,0,0,0,1,4,0,1],
    [1,0,0,1,1,1,1,0,1,1,1,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ],
  playerStart: { col: 7, row: 11 },
  chestKeys:   ['2,4', '12,4', '2,9', '12,9'],
  doorKey:     '2,2',
};

const T3 = {
  // 3 chests, single column corridors on each side, central chest on the
  // middle horizontal hall. Used at temple-gate / hilltop / tower levels.
  map: () => [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,6,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,2,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,4,1,1,1,1,1,4,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,4,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ],
  playerStart: { col: 7, row: 11 },
  chestKeys:   ['4,4', '10,4', '7,6'],
  doorKey:     '2,2',
};

const T8 = {
  // 8 chests across two factions (levels 8, 18). Top half + bottom half,
  // central wall, single door before the stairs corridor.
  map: () => [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,6,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,2,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,4,0,0,4,0,0,0,4,0,0,4,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,4,0,0,4,0,0,0,4,0,0,4,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ],
  playerStart: { col: 7, row: 11 },
  chestKeys:   ['2,4', '5,4', '9,4', '12,4', '2,8', '5,8', '9,8', '12,8'],
  doorKey:     '2,2',
};

// ─── Builder ───────────────────────────────────────────────────────────────────
// Builds a level given a template, kana set, color, recall question, and NPC.

function buildLevel({
  id, name, template, kanas, color,
  recallPrompt, recallChoices, recallAnswer, recallReward,
  npc,
}) {
  const map = template.map();
  const locks = {};
  const challenges = [];

  // 1 challenge per chest (recognition: glyph → sound).
  // Builder requires kanas.length === template.chestKeys.length.
  if (kanas.length !== template.chestKeys.length) {
    throw new Error(`level ${id}: ${kanas.length} kanas but template expects ${template.chestKeys.length}`);
  }
  kanas.forEach((k, i) => {
    locks[template.chestKeys[i]] = { type: 'chest', challengeId: i };
    challenges.push({
      display: k.glyph,
      prompt: 'Which sound is this?',
      choices: k.choices,
      answer: k.answer,
      color,
      hint: k.hint,
      reward: `'${k.glyph}' is '${k.sound}'`,
    });
  });

  // Final door — recall question gating the stairs.
  const doorChId = challenges.length;
  locks[template.doorKey] = { type: 'door', challengeId: doorChId };
  challenges.push({
    prompt: recallPrompt,
    choices: recallChoices,
    answer: recallAnswer,
    choiceStyle: 'hiragana',
    color,
    reward: recallReward,
  });

  return {
    id,
    name,
    playerStart: { ...template.playerStart },
    map,
    locks,
    challenges,
    npcs: [npc],
  };
}

// Helper: build a kana entry with 4 sound choices (correct + 3 distractors).
const k = (glyph, sound, distractors, hint) => ({
  glyph, sound, hint,
  choices: [sound, ...distractors],
  answer: 0,
});

// ─── Levels ────────────────────────────────────────────────────────────────────

const LEVELS_JA = [

  // ─── L1 — Hiragana Vowels ───────────────────────────────────────────────────
  buildLevel({
    id: 1, name: 'あいうえお — Vowel Garden', template: T5, color: '#a0c4ff',
    kanas: [
      k('あ', 'a', ['i','o','u'], 'Open your mouth wide — "ah".'),
      k('い', 'i', ['a','e','o'], 'Like the start of "eel".'),
      k('う', 'u', ['o','a','e'], 'Like "oo" in "moon".'),
      k('え', 'e', ['a','i','o'], 'Like "eh" in "egg".'),
      k('お', 'o', ['a','i','u'], 'Like "oh".'),
    ],
    recallPrompt: "Which one says 'a'?",
    recallChoices: ['い','う','あ','え'], recallAnswer: 2,
    recallReward: "'あ' is 'a'",
    npc: { col: 8, row: 11, name: 'GARDEN SAGE', label: 'S', color: '#30c870',
      dialogue: [
        'Welcome to the Garden of Five Sounds.',
        'あいうえお — every Japanese syllable ends in one of these.',
        'Five mice hide among the petals. Each one carries a vowel.',
        'Find them all, then the gate opens.',
      ] },
  }),

  // ─── L2 — Hiragana K-Series ─────────────────────────────────────────────────
  buildLevel({
    id: 2, name: 'かきくけこ — Stone Dojo', template: T5, color: '#9bf6ff',
    kanas: [
      k('か', 'ka', ['ki','ko','ke'], 'KARATE begins here.'),
      k('き', 'ki', ['ka','ke','ku'], 'A tree — KI also means "tree".'),
      k('く', 'ku', ['ki','ko','ka'], 'Like a beak — "koo".'),
      k('け', 'ke', ['ka','ko','ki'], 'Like "keh".'),
      k('こ', 'ko', ['ka','ku','ki'], 'Two short strokes — "koh".'),
    ],
    recallPrompt: "Which one says 'ki'?",
    recallChoices: ['か','き','く','こ'], recallAnswer: 1,
    recallReward: "'き' is 'ki'",
    npc: { col: 8, row: 11, name: 'DOJO GUARD', label: 'G',
      dialogue: [
        'The K-mice are training. Or pretending to.',
        'か き く け こ — five sounds in the K column.',
        'Speak with each. The inner gate opens once they\'re all reached.',
      ] },
  }),

  // ─── L3 — Hiragana S-Series ─────────────────────────────────────────────────
  buildLevel({
    id: 3, name: 'さしすせそ — Bamboo Grove', template: T5, color: '#e3f2fd',
    kanas: [
      k('さ', 'sa', ['shi','se','so'], 'SAKURA — cherry blossom.'),
      k('し', 'shi', ['sa','su','so'], 'Irregular — not "si".'),
      k('す', 'su', ['sa','so','shi'], 'SUSHI starts with me.'),
      k('せ', 'se', ['sa','so','shi'], 'Like "seh".'),
      k('そ', 'so', ['sa','shi','su'], 'Like "soh".'),
    ],
    recallPrompt: "Which one says 'shi'?",
    recallChoices: ['さ','し','す','そ'], recallAnswer: 1,
    recallReward: "'し' is 'shi'",
    npc: { col: 8, row: 11, name: 'GROVE SAGE', label: 'S', color: '#30b8e8',
      dialogue: [
        'さ し す せ そ. Five S-sounds.',
        'Note: し is "shi", not "si". Japanese keeps things interesting.',
        'The mice are meditating. Or pretending to.',
      ] },
  }),

  // ─── L4 — Hiragana T-Series ─────────────────────────────────────────────────
  buildLevel({
    id: 4, name: 'たちつてと — Temple Steps', template: T5, color: '#bbdefb',
    kanas: [
      k('た', 'ta', ['chi','tsu','to'], 'TAIKO drum.'),
      k('ち', 'chi', ['ta','tsu','te'], 'Irregular — not "ti".'),
      k('つ', 'tsu', ['ta','to','chi'], 'Irregular — not "tu".'),
      k('て', 'te', ['ta','to','chi'], 'Like "teh".'),
      k('と', 'to', ['ta','tsu','te'], 'TOKYO begins with this.'),
    ],
    recallPrompt: "Which one says 'tsu'?",
    recallChoices: ['た','ち','つ','と'], recallAnswer: 2,
    recallReward: "'つ' is 'tsu'",
    npc: { col: 8, row: 11, name: 'STEP SAGE', label: 'S', color: '#8888cc',
      dialogue: [
        'Five T-mice along the steps. Each looking very purposeful.',
        'た ち つ て と — but ち is "chi" and つ is "tsu". Watch out.',
        'Classic T-series behavior.',
      ] },
  }),

  // ─── L5 — Hiragana N-Series ─────────────────────────────────────────────────
  buildLevel({
    id: 5, name: 'なにぬねの — Forest Clearing', template: T5, color: '#c5cae9',
    kanas: [
      k('な', 'na', ['ni','no','ne'], 'NA-rabbits.'),
      k('に', 'ni', ['na','ne','nu'], 'NIHON — Japan.'),
      k('ぬ', 'nu', ['na','ne','no'], 'Like "noo".'),
      k('ね', 'ne', ['na','no','ni'], 'NEKO — cat.'),
      k('の', 'no', ['na','nu','ne'], 'Used as "of" in grammar.'),
    ],
    recallPrompt: "Which one says 'ne'?",
    recallChoices: ['な','に','ね','の'], recallAnswer: 2,
    recallReward: "'ね' is 'ne'",
    npc: { col: 8, row: 11, name: 'FOREST SAGE', label: 'S', color: '#a0c4ff',
      dialogue: [
        'Five N-mice in the moss-path clearings.',
        'The rabbit in the corner is NOT one of them. That\'s just a rabbit.',
        'な に ぬ ね の. Find them all.',
      ] },
  }),

  // ─── L6 — Hiragana H-Series ─────────────────────────────────────────────────
  buildLevel({
    id: 6, name: 'はひふへほ — Onsen Courtyard', template: T5, color: '#90caf9',
    kanas: [
      k('は', 'ha', ['hi','ho','he'], 'Also pronounced "wa" as a particle.'),
      k('ひ', 'hi', ['ha','he','fu'], 'HI — sun, also fire.'),
      k('ふ', 'fu', ['ha','ho','hi'], 'Irregular — not "hu".'),
      k('へ', 'he', ['ha','ho','hi'], 'A simple checkmark shape.'),
      k('ほ', 'ho', ['ha','fu','he'], 'Like "hoh".'),
    ],
    recallPrompt: "Which one says 'fu'?",
    recallChoices: ['は','ひ','ふ','ほ'], recallAnswer: 2,
    recallReward: "'ふ' is 'fu'",
    npc: { col: 8, row: 11, name: 'ONSEN SAGE', label: 'S', color: '#81d4fa',
      dialogue: [
        'Steam rises from somewhere. The H-mice are here, mostly meditating.',
        'は ひ ふ へ ほ. Note: ふ sounds like "fu", not "hu".',
        'They like the warmth of the center stones.',
      ] },
  }),

  // ─── L7 — Hiragana M-Series ─────────────────────────────────────────────────
  buildLevel({
    id: 7, name: 'まみむめも — Garden Market', template: T5, color: '#b3e5fc',
    kanas: [
      k('ま', 'ma', ['mi','mo','me'], 'MAMA, MATCHA.'),
      k('み', 'mi', ['ma','me','mu'], 'MI — also means "three".'),
      k('む', 'mu', ['ma','mo','mi'], 'Like "moo".'),
      k('め', 'me', ['ma','mo','mu'], 'ME — eye.'),
      k('も', 'mo', ['ma','mu','mi'], 'MOTTO — "more".'),
    ],
    recallPrompt: "Which one says 'mu'?",
    recallChoices: ['ま','み','む','も'], recallAnswer: 2,
    recallReward: "'む' is 'mu'",
    npc: { col: 8, row: 11, name: 'MARKET SAGE', label: 'S', color: '#a0c4ff',
      dialogue: [
        'The M-mice run a market here. They are extremely enthusiastic.',
        'ま み む め も. Five sounds, five stalls.',
        'Check behind the inner walls — a couple are hiding.',
      ] },
  }),

  // ─── L8 — Hiragana Y & R Series ─────────────────────────────────────────────
  buildLevel({
    id: 8, name: 'やゆよ・らりるれろ — Riverside Pavilion', template: T8, color: '#b2ebf2',
    kanas: [
      k('や', 'ya', ['yu','yo','ra'], 'Y-mice are dramatic.'),
      k('ゆ', 'yu', ['ya','yo','ru'], 'YU — hot water.'),
      k('よ', 'yo', ['ya','yu','ro'], 'YO — also "world".'),
      k('ら', 'ra', ['ri','ru','re'], 'Soft R, almost like "la".'),
      k('り', 'ri', ['ra','ru','re'], 'Two strokes.'),
      k('る', 'ru', ['ra','ri','re'], 'Common verb-ending.'),
      k('れ', 're', ['ra','ri','ru'], 'Like "reh".'),
      k('ろ', 'ro', ['ra','ri','ru'], 'Like "roh".'),
    ],
    recallPrompt: "Which one says 'yo'?",
    recallChoices: ['や','ゆ','よ','ろ'], recallAnswer: 2,
    recallReward: "'よ' is 'yo'",
    npc: { col: 8, row: 11, name: 'RIVER SAGE', label: 'S', color: '#90caf9',
      dialogue: [
        'Two factions in this pavilion: three Y-mice up top, five R-mice below.',
        'They are NOT happy about being in the same level.',
        'やゆよ・らりるれろ. Visit all eight.',
      ] },
  }),

  // ─── L9 — Hiragana W & N ────────────────────────────────────────────────────
  buildLevel({
    id: 9, name: 'わをん — Temple Gate', template: T3, color: '#a0c4ff',
    kanas: [
      k('わ', 'wa', ['wo','n','o'], 'Topic particle: は (read as "wa").'),
      k('を', 'wo', ['wa','n','o'], 'Object particle. Often pronounced "o".'),
      k('ん', 'n',  ['wa','wo','m'], 'The only consonant-only kana.'),
    ],
    recallPrompt: "Which one says 'n'?",
    recallChoices: ['わ','を','ん','の'], recallAnswer: 2,
    recallReward: "'ん' is 'n'",
    npc: { col: 8, row: 11, name: 'GATE GUARD', label: 'G',
      dialogue: [
        'Three characters at the temple gate.',
        'わ を ん — each thinks it\'s the most important.',
        'Speak with all three to pass through.',
      ] },
  }),

  // ─── L10 — Hiragana Review (Grand Hall) ────────────────────────────────────
  buildLevel({
    id: 10, name: 'ひらがな — Grand Hall', template: T4, color: '#a0c4ff',
    kanas: [
      k('か', 'ka', ['sa','ta','na'], 'KARATE.'),
      k('さ', 'sa', ['ka','ta','na'], 'SAKURA.'),
      k('た', 'ta', ['ka','sa','na'], 'TAIKO.'),
      k('な', 'na', ['ka','sa','ta'], 'NEKO starts with N too.'),
    ],
    recallPrompt: "Which is 'sa'?",
    recallChoices: ['か','さ','た','な'], recallAnswer: 1,
    recallReward: "'さ' is 'sa'",
    npc: { col: 8, row: 11, name: 'TEA MASTER', label: 'S', color: '#bdb2ff',
      dialogue: [
        'You have completed all 46 hiragana. Sit. There is tea.',
        'Four veterans wait in the great hall — か さ た な.',
        'Revisit them. Have you truly learned, or only think you have?',
      ] },
  }),

  // ─── L11 — Katakana Vowels ─────────────────────────────────────────────────
  buildLevel({
    id: 11, name: 'アイウエオ — Port District', template: T5, color: '#fff59d',
    kanas: [
      k('ア', 'a', ['i','o','u'], 'ANIME starts with me.'),
      k('イ', 'i', ['a','e','o'], 'INKU — ink.'),
      k('ウ', 'u', ['o','a','e'], 'UISUKII — whiskey.'),
      k('エ', 'e', ['a','i','o'], 'EREBEETAA — elevator.'),
      k('オ', 'o', ['a','i','u'], 'ORENJI — orange.'),
    ],
    recallPrompt: "Which is the katakana 'a'?",
    recallChoices: ['ア','イ','エ','オ'], recallAnswer: 0,
    recallReward: "'ア' is 'a'",
    npc: { col: 8, row: 11, name: 'PORT SAGE', label: 'S', color: '#fff9c4',
      dialogue: [
        'Welcome to the katakana district. ANIME. KARAOKE. SUSHI BAR.',
        'Same sounds as hiragana — sharper shapes. Five mice are waiting.',
        'Foreign words, foreign letters.',
      ] },
  }),

  // ─── L12 — Katakana K-Series ───────────────────────────────────────────────
  buildLevel({
    id: 12, name: 'カキクケコ — Training Ground', template: T5, color: '#fdffb6',
    kanas: [
      k('カ', 'ka', ['ki','ko','ke'], 'KAMERA — camera.'),
      k('キ', 'ki', ['ka','ke','ku'], 'KIROGURAMU — kilogram.'),
      k('ク', 'ku', ['ki','ko','ka'], 'KUREJITTO — credit.'),
      k('ケ', 'ke', ['ka','ko','ki'], 'KEEKI — cake.'),
      k('コ', 'ko', ['ka','ku','ki'], 'KOOHII — coffee.'),
    ],
    recallPrompt: "Which is 'ki' in katakana?",
    recallChoices: ['カ','キ','ク','コ'], recallAnswer: 1,
    recallReward: "'キ' is 'ki'",
    npc: { col: 8, row: 11, name: 'TRAINING SAGE', label: 'S', color: '#fff59d',
      dialogue: [
        'Five katakana K-mice across the field.',
        'Sharper. Louder. More geometric. They know it.',
        'カ キ ク ケ コ — the K-column.',
      ] },
  }),

  // ─── L13 — Katakana S-Series ───────────────────────────────────────────────
  buildLevel({
    id: 13, name: 'サシスセソ — Lantern District', template: T5, color: '#fff9c4',
    kanas: [
      k('サ', 'sa', ['shi','se','so'], 'SARADA — salad.'),
      k('シ', 'shi', ['so','sa','su'], 'Strokes go bottom-up.'),
      k('ス', 'su', ['sa','so','shi'], 'SUUPU — soup.'),
      k('セ', 'se', ['sa','so','shi'], 'SEERU — sale.'),
      k('ソ', 'so', ['shi','sa','su'], 'Strokes go top-down. NOT シ.'),
    ],
    recallPrompt: "Which is 'shi' (NOT 'so')?",
    recallChoices: ['ソ','シ','サ','ス'], recallAnswer: 1,
    recallReward: "'シ' is 'shi'",
    npc: { col: 8, row: 11, name: 'LANTERN SAGE', label: 'S', color: '#fff59d',
      dialogue: [
        'シ and ソ are notorious. They know.',
        'They\'ve prepared visual aids: themselves, standing next to each other.',
        'サ シ ス セ ソ. Pay attention.',
      ] },
  }),

  // ─── L14 — Katakana T-Series ───────────────────────────────────────────────
  buildLevel({
    id: 14, name: 'タチツテト — Clock Tower', template: T5, color: '#fffde7',
    kanas: [
      k('タ', 'ta', ['chi','tsu','to'], 'TAKUSHII — taxi.'),
      k('チ', 'chi', ['ta','tsu','te'], 'CHIKETTO — ticket.'),
      k('ツ', 'tsu', ['shi','ta','chi'], 'NOT シ. Strokes are different.'),
      k('テ', 'te', ['ta','to','chi'], 'TEREBI — TV.'),
      k('ト', 'to', ['ta','te','chi'], 'TOMATO.'),
    ],
    recallPrompt: "Which is 'tsu' (NOT 'shi')?",
    recallChoices: ['シ','ツ','チ','タ'], recallAnswer: 1,
    recallReward: "'ツ' is 'tsu'",
    npc: { col: 8, row: 11, name: 'TOWER SAGE', label: 'S', color: '#fff59d',
      dialogue: [
        'The katakana T-mice arrived on time. They\'d like that noted.',
        'タ チ ツ テ ト. ツ wants you to know it is NOT シ.',
        'It has visual aids. The lecture is unsolicited.',
      ] },
  }),

  // ─── L15 — Katakana N-Series ───────────────────────────────────────────────
  buildLevel({
    id: 15, name: 'ナニヌネノ — Night Market', template: T5, color: '#f0f4c3',
    kanas: [
      k('ナ', 'na', ['ni','no','ne'], 'NAIFU — knife.'),
      k('ニ', 'ni', ['na','ne','nu'], 'NIYUUSU — news.'),
      k('ヌ', 'nu', ['na','ne','no'], 'Rare in modern words.'),
      k('ネ', 'ne', ['na','no','ni'], 'NETTO — net.'),
      k('ノ', 'no', ['na','nu','so'], 'A single stroke. NOT ソ.'),
    ],
    recallPrompt: "Which is 'no'?",
    recallChoices: ['ナ','ノ','ヌ','ニ'], recallAnswer: 1,
    recallReward: "'ノ' is 'no'",
    npc: { col: 8, row: 11, name: 'NIGHT SAGE', label: 'S', color: '#fff59d',
      dialogue: [
        'Lanterns glow. The N-mice are passionate about one thing:',
        'ン (N) is NOT ソ (so). They have a chart.',
        'ナ ニ ヌ ネ ノ. Find them all.',
      ] },
  }),

  // ─── L16 — Katakana H-Series ───────────────────────────────────────────────
  buildLevel({
    id: 16, name: 'ハヒフヘホ — Harbor Docks', template: T5, color: '#fffde7',
    kanas: [
      k('ハ', 'ha', ['hi','ho','he'], 'HARO — hello.'),
      k('ヒ', 'hi', ['ha','he','fu'], 'HIIROO — hero.'),
      k('フ', 'fu', ['ha','ho','hi'], 'FURANSU — France.'),
      k('ヘ', 'he', ['ha','ho','hi'], 'Same shape as hiragana へ.'),
      k('ホ', 'ho', ['ha','fu','he'], 'HOTERU — hotel.'),
    ],
    recallPrompt: "Which is 'fu'?",
    recallChoices: ['ハ','フ','ホ','ヒ'], recallAnswer: 1,
    recallReward: "'フ' is 'fu'",
    npc: { col: 8, row: 11, name: 'HARBOR SAGE', label: 'S', color: '#fff59d',
      dialogue: [
        'Ships arrive from foreign shores. Katakana was built for this.',
        'ハ ヒ フ ヘ ホ — the H-column on the docks.',
        'A crane is watching. It\'s not a mouse, but it appreciates your learning.',
      ] },
  }),

  // ─── L17 — Katakana M-Series ───────────────────────────────────────────────
  buildLevel({
    id: 17, name: 'マミムメモ — Mountain Road', template: T5, color: '#fff9c4',
    kanas: [
      k('マ', 'ma', ['mi','mo','me'], 'MAIKU — mike.'),
      k('ミ', 'mi', ['ma','me','mu'], 'MIRUKU — milk.'),
      k('ム', 'mu', ['ma','mo','mi'], 'GEEMU — game.'),
      k('メ', 'me', ['ma','mo','mu'], 'MEERU — email.'),
      k('モ', 'mo', ['ma','mu','mi'], 'MOTAA — motor.'),
    ],
    recallPrompt: "Which is 'me'?",
    recallChoices: ['マ','メ','モ','ム'], recallAnswer: 1,
    recallReward: "'メ' is 'me'",
    npc: { col: 8, row: 11, name: 'MOUNTAIN SAGE', label: 'S', color: '#fff59d',
      dialogue: [
        'They waited at the summit. Got bored. Came halfway down.',
        'マ ミ ム メ モ — spread along the path.',
        'They are not apologizing.',
      ] },
  }),

  // ─── L18 — Katakana Y & R Series ───────────────────────────────────────────
  buildLevel({
    id: 18, name: 'ヤユヨ・ラリルレロ — Highway Rest Stop', template: T8, color: '#fff59d',
    kanas: [
      k('ヤ', 'ya', ['yu','yo','ra'], 'TAIYA — tire.'),
      k('ユ', 'yu', ['ya','yo','ru'], 'YUNIBAASHITII — university.'),
      k('ヨ', 'yo', ['ya','yu','ro'], 'YOOGURUTO — yogurt.'),
      k('ラ', 'ra', ['ri','ru','re'], 'RAJIO — radio.'),
      k('リ', 'ri', ['ra','ru','re'], 'RISUTO — list.'),
      k('ル', 'ru', ['ra','ri','re'], 'BIIRU — beer.'),
      k('レ', 're', ['ra','ri','ru'], 'REMON — lemon.'),
      k('ロ', 'ro', ['ra','ri','ru'], 'ROBOTTO — robot.'),
    ],
    recallPrompt: "Which is 'ru'?",
    recallChoices: ['ラ','リ','ル','レ'], recallAnswer: 2,
    recallReward: "'ル' is 'ru'",
    npc: { col: 8, row: 11, name: 'REST STOP SAGE', label: 'S', color: '#fff9c4',
      dialogue: [
        'Y-mice on one side, R-mice on the other. Median between them.',
        'There is a vending machine. Nobody mentions it.',
        'ヤユヨ・ラリルレロ. Visit all eight.',
      ] },
  }),

  // ─── L19 — Katakana W & N ──────────────────────────────────────────────────
  buildLevel({
    id: 19, name: 'ワヲン — Windy Hilltop', template: T3, color: '#fff59d',
    kanas: [
      k('ワ', 'wa', ['wo','n','o'], 'Rare in modern katakana.'),
      k('ヲ', 'wo', ['wa','n','o'], 'Even rarer than ヲ\'s hiragana cousin.'),
      k('ン', 'n',  ['wa','wo','so'], 'NOT ソ. ン is a wider check-mark.'),
    ],
    recallPrompt: "Which is 'n' (NOT 'so')?",
    recallChoices: ['ソ','ン','ノ','シ'], recallAnswer: 1,
    recallReward: "'ン' is 'n'",
    npc: { col: 8, row: 11, name: 'HILLTOP SAGE', label: 'S', color: '#fff9c4',
      dialogue: [
        'Three mice at the windy summit. ワ ヲ ン.',
        'ン would, for the third time today, like everyone to know it is not ソ.',
        'Speak with all three. You\'ll have completed all 46 katakana.',
      ] },
  }),

  // ─── L20 — Katakana Review (Translation Hall) ──────────────────────────────
  buildLevel({
    id: 20, name: 'カタカナ — Translation Hall', template: T4, color: '#fff59d',
    kanas: [
      k('カ', 'ka', ['sa','ta','na'], 'KAMERA.'),
      k('サ', 'sa', ['ka','ta','na'], 'SARADA.'),
      k('タ', 'ta', ['ka','sa','na'], 'TAKUSHII.'),
      k('ナ', 'na', ['ka','sa','ta'], 'NAIFU.'),
    ],
    recallPrompt: "Which is 'ta' in katakana?",
    recallChoices: ['カ','サ','タ','ナ'], recallAnswer: 2,
    recallReward: "'タ' is 'ta'",
    npc: { col: 8, row: 11, name: 'HALL CURATOR', label: 'S', color: '#fff9c4',
      dialogue: [
        'A study hall lined with foreign-word references.',
        'Four veterans here for review — the column-starter crew.',
        'カ サ タ ナ. They have opinions. They want to be heard.',
      ] },
  }),

  // ─── L21 — Numbers 1-5 ─────────────────────────────────────────────────────
  buildLevel({
    id: 21, name: '一二三四五 — Counting House', template: T5, color: '#efebe9',
    kanas: [
      k('一', 'ichi', ['ni','san','yon'], 'One stroke = one.'),
      k('二', 'ni',   ['ichi','san','go'], 'Two strokes = two.'),
      k('三', 'san',  ['ni','yon','go'], 'Three strokes = three.'),
      k('四', 'yon',  ['ichi','san','go'], 'Also "shi", but "yon" is safer.'),
      k('五', 'go',   ['yon','ichi','ni'], 'Like "GO!".'),
    ],
    recallPrompt: "How do you say 3?",
    recallChoices: ['いち','に','さん','ご'], recallAnswer: 2,
    recallReward: "'三' is 'san' (3)",
    npc: { col: 8, row: 11, name: 'COUNTING SAGE', label: 'S', color: '#d7ccc8',
      dialogue: [
        'Numbers — the foundation of practical Japanese.',
        '一二三四五 — one through five.',
        'いち is very proud of being first. ご thinks it deserves more recognition.',
      ] },
  }),

  // ─── L22 — Numbers 6-10 ────────────────────────────────────────────────────
  buildLevel({
    id: 22, name: '六七八九十 — Treasury', template: T5, color: '#f5f5f5',
    kanas: [
      k('六', 'roku', ['nana','hachi','kyuu'], 'Six.'),
      k('七', 'nana', ['roku','hachi','kyuu'], 'Also "shichi".'),
      k('八', 'hachi', ['roku','nana','juu'], 'Eight — fans out at the bottom.'),
      k('九', 'kyuu', ['nana','hachi','juu'], 'Also "ku".'),
      k('十', 'juu',  ['kyuu','hachi','roku'], 'Cross shape — ten.'),
    ],
    recallPrompt: "How do you say 10?",
    recallChoices: ['ろく','なな','きゅう','じゅう'], recallAnswer: 3,
    recallReward: "'十' is 'juu' (10)",
    npc: { col: 8, row: 11, name: 'TREASURY SAGE', label: 'S', color: '#e0e0e0',
      dialogue: [
        'The treasury. Six through ten, in vaults of varying security.',
        'はち is extremely serious. きゅう won\'t stop talking.',
        'じゅう just says ten and means it.',
      ] },
  }),

  // ─── L23 — Numbers 11-20 ───────────────────────────────────────────────────
  buildLevel({
    id: 23, name: '十一・十二・二十 — Math Tower', template: T3, color: '#e0e0e0',
    kanas: [
      k('十一', 'juuichi', ['juuni','nijuu','juu'], '10 + 1 = 11.'),
      k('十二', 'juuni',   ['juuichi','nijuu','juu'], '10 + 2 = 12.'),
      k('二十', 'nijuu',   ['juuni','juuichi','juu'], '2 × 10 = 20.'),
    ],
    recallPrompt: "How do you say 20?",
    recallChoices: ['じゅう','じゅうに','にじゅう','じゅういち'], recallAnswer: 2,
    recallReward: "'二十' is 'nijuu' (20)",
    npc: { col: 8, row: 11, name: 'MATH SAGE', label: 'S', color: '#bdb2ff',
      dialogue: [
        'Three mice in the tower. They teach the principle of compound counting.',
        'じゅういち = 10+1. にじゅう = 2×10. Logical.',
        'Master this and you can count to 99 and beyond.',
      ] },
  }),

];

export function getLevel(n) {
  return LEVELS_JA[Math.min(Math.max(n - 1, 0), LEVELS_JA.length - 1)];
}
