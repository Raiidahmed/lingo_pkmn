// Japanese levels — TILE: FLOOR=0, WALL=1, DOOR_C=2, DOOR_O=3, CHEST_C=4, CHEST_O=5, STAIRS=6, RUG=7

const LEVELS_JA = [
  {
    id: 1,
    name: 'あいうえお',
    playerStart: { col: 7, row: 10 },

    // 15 × 13 grid
    // Row 3 is a wall barrier with 5 challenge doors (cols 2,5,8,11,13)
    // Upper zone (rows 1-2) holds the stairs; reached only through solved doors
    // Lower zone (rows 4-11) has 3 chests and the player start
    map: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,6,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,2,1,1,2,1,1,2,1,1,2,1,2,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,4,0,0,0,0,0,0,0,0,0,4,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,4,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],

    locks: {
      '2,3':  { type: 'door',  challengeId: 0 },
      '5,3':  { type: 'door',  challengeId: 1 },
      '8,3':  { type: 'door',  challengeId: 2 },
      '11,3': { type: 'door',  challengeId: 3 },
      '13,3': { type: 'door',  challengeId: 4 },
      '2,7':  { type: 'chest', challengeId: 5 },
      '12,7': { type: 'chest', challengeId: 6 },
      '5,9':  { type: 'chest', challengeId: 7 },
    },

    // display: large character shown above the prompt (rendered in Noto Sans JP)
    // choiceStyle: 'hiragana' → choices rendered larger in Noto Sans JP
    challenges: [
      {
        display: 'あ',
        prompt: 'What sound does this hiragana make?',
        choices: ['a', 'i', 'u', 'e'],
        answer: 0,
        hint: 'The very first vowel in Japanese.',
        reward: "'あ' is the sound 'a'",
      },
      {
        display: 'い',
        prompt: 'What sound does this hiragana make?',
        choices: ['e', 'i', 'u', 'o'],
        answer: 1,
        hint: 'Think of the English word "eat".',
        reward: "'い' is the sound 'i'",
      },
      {
        display: 'う',
        prompt: 'What sound does this hiragana make?',
        choices: ['a', 'o', 'u', 'e'],
        answer: 2,
        hint: 'Like "oo" in moon.',
        reward: "'う' is the sound 'u'",
      },
      {
        display: 'え',
        prompt: 'What sound does this hiragana make?',
        choices: ['a', 'e', 'i', 'u'],
        answer: 1,
        hint: 'Like the "e" in egg.',
        reward: "'え' is the sound 'e'",
      },
      {
        display: 'お',
        prompt: 'What sound does this hiragana make?',
        choices: ['a', 'i', 'o', 'u'],
        answer: 2,
        hint: 'Like "oh!" in English.',
        reward: "'お' is the sound 'o'",
      },
      {
        prompt: "Which hiragana makes the sound 'a'?",
        choices: ['い', 'う', 'あ', 'え'],
        answer: 2,
        choiceStyle: 'hiragana',
        hint: 'It was behind the first door.',
        reward: "'あ' is the sound 'a'",
      },
      {
        prompt: "Which hiragana makes the sound 'i'?",
        choices: ['う', 'い', 'お', 'あ'],
        answer: 1,
        choiceStyle: 'hiragana',
        hint: 'The second vowel — like "eat".',
        reward: "'い' is the sound 'i'",
      },
      {
        prompt: "Which hiragana makes the sound 'e'?",
        choices: ['お', 'う', 'あ', 'え'],
        answer: 3,
        choiceStyle: 'hiragana',
        hint: 'The fourth vowel — like "egg".',
        reward: "'え' is the sound 'e'",
      },
    ],

    npcs: [
      {
        col: 12,
        row: 10,
        name: 'SENSEI',
        label: 'S',
        color: '#e8306a',
        dialogue: [
          'Welcome, student.',
          'This is the Hall of Vowels.',
          'Five doors. Five sounds.',
          'あ い う え お.',
          'Each hiragana is one syllable.',
          'The chests test if you can write them.',
          'Master all eight. The path opens.',
        ],
      },
    ],
  },
];

export function getLevel(n) {
  return LEVELS_JA[Math.min(Math.max(n - 1, 0), LEVELS_JA.length - 1)];
}
