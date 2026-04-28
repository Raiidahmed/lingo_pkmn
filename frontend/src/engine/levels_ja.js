// Japanese levels — TILE: FLOOR=0, WALL=1, DOOR_C=2, DOOR_O=3, CHEST_C=4, CHEST_O=5, STAIRS=6, RUG=7
// Course: hiragana only. Mice hold practice questions; doors hold gate questions; NPCs teach without challenges.

const FLOOR = 0;
const WALL = 1;
const DOOR_C = 2;
const CHEST_C = 4;
const STAIRS = 6;
const RUG = 7;

const TILE_BY_CHAR = {
  '#': WALL,
  '.': FLOOR,
  '~': RUG,
  'M': CHEST_C,
  'D': DOOR_C,
  'S': STAIRS,
  'P': FLOOR,
};

const MOUSE_COLORS = ['#a0c4ff', '#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#fffffc', '#bdb2ff'];

function compileMap(rows, id) {
  if (rows.length !== 13) throw new Error(`level ${id}: map must have 13 rows`);

  const chestKeys = [];
  const doorKeys = [];
  let playerStart = null;
  let stairs = 0;

  const map = rows.map((row, r) => {
    if (row.length !== 15) throw new Error(`level ${id}: row ${r} must have 15 columns`);
    return [...row].map((ch, c) => {
      if (!(ch in TILE_BY_CHAR)) throw new Error(`level ${id}: unknown tile '${ch}' at ${c},${r}`);
      if (ch === 'P') {
        if (playerStart) throw new Error(`level ${id}: duplicate player start`);
        playerStart = { col: c, row: r };
      }
      if (ch === 'S') stairs += 1;
      if (ch === 'M') chestKeys.push(`${c},${r}`);
      if (ch === 'D') doorKeys.push(`${c},${r}`);
      return TILE_BY_CHAR[ch];
    });
  });

  if (!playerStart) throw new Error(`level ${id}: missing player start`);
  if (stairs !== 1) throw new Error(`level ${id}: expected exactly one stairs tile`);
  if (chestKeys.length === 0) throw new Error(`level ${id}: expected at least one mouse`);
  if (doorKeys.length === 0) throw new Error(`level ${id}: expected at least one door`);

  return { map, playerStart, chestKeys, doorKeys, signature: rows.join('|') };
}

function mouse(glyph, sound, wrong, hint, line, color = null) {
  return {
    glyph,
    sound,
    color,
    prompt: `${line}\n\nThe mouse puffs up to the size of a vocabulary quiz. Which sound is '${glyph}'?`,
    choices: [sound, ...wrong],
    answer: 0,
    hint,
    reward: `'${glyph}' is '${sound}'. The mouse nods like this was legally binding.`,
  };
}

function door(prompt, choices, answer, hint, reward) {
  return {
    display: 'とびら',
    prompt,
    choices,
    answer,
    choiceStyle: 'hiragana',
    color: '#fffffc',
    hint,
    reward,
  };
}

function npc(name, label, col, row, color, dialogue) {
  return { name, label, col, row, color, dialogue };
}

function buildLevel({ id, name, textureSet = 'garden', rows, mice, doors, npcs }) {
  const compiled = compileMap(rows, id);
  if (mice.length !== compiled.chestKeys.length) {
    throw new Error(`level ${id}: ${mice.length} mice but map has ${compiled.chestKeys.length} mouse tiles`);
  }
  if (doors.length !== compiled.doorKeys.length) {
    throw new Error(`level ${id}: ${doors.length} doors but map has ${compiled.doorKeys.length} door tiles`);
  }

  const locks = {};
  const challenges = [];

  mice.forEach((m, i) => {
    locks[compiled.chestKeys[i]] = { type: 'chest', challengeId: challenges.length };
    challenges.push({
      display: m.glyph,
      prompt: m.prompt,
      choices: m.choices,
      answer: m.answer,
      color: m.color || MOUSE_COLORS[i % MOUSE_COLORS.length],
      hint: m.hint,
      reward: m.reward,
    });
  });

  doors.forEach((d, i) => {
    locks[compiled.doorKeys[i]] = { type: 'door', challengeId: challenges.length };
    challenges.push({ ...d, lockLabel: `door-${i + 1}` });
  });

  return {
    id,
    name,
    playerStart: compiled.playerStart,
    map: compiled.map,
    locks,
    challenges,
    npcs,
    textureSet,
    signature: compiled.signature,
  };
}

const LEVELS_JA = [
  buildLevel({
    id: 1,
    name: 'あいうえお — Petal Breakfast Garden',
    textureSet: 'garden',
    rows: [
      '###############',
      '#S..D..~..M...#',
      '#.###.###.###.#',
      '#...M...~...M.#',
      '###.#.#####.#.#',
      '#...#.......#.#',
      '#.#####.#####.#',
      '#..~...D...~..#',
      '#.###.###.###.#',
      '#M..~.....~..M#',
      '#.#####.###.#.#',
      '#.....P.......#',
      '###############',
    ],
    mice: [
      mouse('あ', 'a', ['i', 'u', 'o'], 'Open wide: ah.', 'A blue mouse says, "I am あ. I am the sound of remembering you left soup on."'),
      mouse('い', 'i', ['a', 'e', 'o'], 'Like ee in eel.', 'A red mouse says, "い is two strokes having a quiet meeting."'),
      mouse('う', 'u', ['o', 'a', 'e'], 'Like oo in moon.', 'An orange mouse says, "う is the sound of lifting a very polite rock."'),
      mouse('え', 'e', ['a', 'i', 'o'], 'Like eh?', 'A yellow mouse says, "え is surprise wearing a tiny hat."'),
      mouse('お', 'o', ['a', 'u', 'e'], 'Like oh.', 'A green mouse says, "お completes the vowel parade. Please clap internally."'),
    ],
    doors: [
      door('A shoji door whispers, "I only open for the first vowel. Which one says a?"', ['あ', 'い', 'う', 'え'], 0, 'The first vowel is あ.', `'あ' is 'a'. The door slides aside with a tiny embarrassed cough.`),
      door('A garden gate asks, "Which one sounds like oh? I forgot because I am made of wood."', ['え', 'お', 'う', 'い'], 1, 'お sounds like oh.', `'お' is 'o'. The gate remembers its job.`),
    ],
    npcs: [
      npc('PETAL SAGE', 'S', 8, 11, '#30c870', [
        'This garden teaches the five vowels: あ い う え お.',
        'Words for your pocket: あめ means rain. いぬ means dog. うみ means sea.',
        'えき is station. おちゃ is tea. The tea is imaginary but still judging your posture.',
      ]),
      npc('LANTERN INTERN', 'T', 6, 11, '#ffb7c5', [
        'The mice are not chests. They filed paperwork about it.',
        'Bump into each mouse and answer its practice question. Doors also quiz you because architecture has become ambitious.',
      ]),
    ],
  }),

  buildLevel({
    id: 2,
    name: 'かきくけこ — Dojo With Too Many Corners',
    textureSet: 'dojo',
    rows: [
      '###############',
      '#S....D....M..#',
      '#.###.#####.#.#',
      '#...#...M...#.#',
      '###.#.###.###.#',
      '#M..#D..#.....#',
      '#.#.###.#.###.#',
      '#.#.....#...M.#',
      '#.#####.###.#.#',
      '#...M.....#.#.#',
      '###.#####.#.#.#',
      '#......P......#',
      '###############',
    ],
    mice: [
      mouse('か', 'ka', ['ki', 'ku', 'ko'], 'Karate starts with ka.', 'A red mouse chops the air and says, "か! I am the K that started doing pushups."'),
      mouse('き', 'ki', ['ka', 'ke', 'ku'], 'き sounds like key.', 'A green mouse says, "き unlocks reading. Not this door. Emotionally, though."'),
      mouse('く', 'ku', ['ko', 'ka', 'ki'], 'Looks like a beak saying ku.', 'A blue mouse shaped like a suspicious angle says, "く. Less-than? More-than? I transcend math."'),
      mouse('け', 'ke', ['ka', 'ko', 'ki'], 'Like keh.', 'A white mouse says, "け is a fence post that got into linguistics."'),
      mouse('こ', 'ko', ['ku', 'ka', 'ke'], 'Two calm horizontal strokes.', 'An orange mouse says, "こ is two lines contemplating soup."'),
    ],
    doors: [
      door('The dojo door flexes. "Which kana says ki? Do not disappoint my hinges."', ['か', 'き', 'け', 'こ'], 1, 'き is ki.', `'き' is 'ki'. The door bows and pretends it meant to squeak.`),
      door('A side gate asks, "Pick ko. I am running a very small exam."', ['く', 'こ', 'か', 'け'], 1, 'こ is ko.', `'こ' is 'ko'. The gate opens with academic confidence.`),
    ],
    npcs: [
      npc('DOJO GUARD', 'G', 8, 11, '#9bf6ff', [
        'The K row is か き く け こ. Add K to each vowel and march in a straight line.',
        'Useful words: かさ umbrella, き tree, くち mouth, け hair, こ child.',
        'The mouth word is くち. The mouth itself has declined to comment.',
      ]),
    ],
  }),

  buildLevel({
    id: 3,
    name: 'さしすせそ — Bamboo Apology Maze',
    textureSet: 'grove',
    rows: [
      '###############',
      '#S..D.....#..M#',
      '#.#####.#.#.#.#',
      '#.....#.#...#.#',
      '###.#.#.#####.#',
      '#M..#.#...M...#',
      '#.###.###.###.#',
      '#...~...D...~.#',
      '#.#####.#.###.#',
      '#..M....#...M.#',
      '#.###.#####.#.#',
      '#......P......#',
      '###############',
    ],
    mice: [
      mouse('さ', 'sa', ['shi', 'su', 'so'], 'さ starts sakana: fish.', 'A yellow mouse says, "さ is sakura, salad, and sudden confidence."'),
      mouse('し', 'shi', ['sa', 'su', 'se'], 'Not si. It is shi.', 'A white mouse sighs, "I am し. People call me si. I recover slowly."'),
      mouse('す', 'su', ['sa', 'so', 'shi'], 'す starts sushi.', 'A green mouse says, "す is sushi. This fact has made me famous and unbearable."'),
      mouse('せ', 'se', ['sa', 'shi', 'so'], 'Like seh.', 'A blue mouse says, "せ is せんせい in training. I grade snacks."'),
      mouse('そ', 'so', ['su', 'sa', 'shi'], 'Like soh.', 'A red mouse says, "そ is sky-adjacent because そら means sky. I am basically weather."'),
    ],
    doors: [
      door('A bamboo door says, "I will open for shi, because I enjoy irregularity."', ['さ', 'し', 'す', 'そ'], 1, 'し is shi.', `'し' is 'shi'. The bamboo stops being dramatic.`),
      door('A second door asks, "Which kana begins sushi?"', ['す', 'せ', 'さ', 'そ'], 0, 'す starts sushi.', `'す' is 'su'. The door briefly smells like rice.`),
    ],
    npcs: [
      npc('GROVE SAGE', 'S', 8, 11, '#30b8e8', [
        'The S row is さ し す せ そ.',
        'Important: し is shi, not si. The mouse has a whole support group about this.',
        'Words: さかな fish, しお salt, すし sushi, せんせい teacher, そら sky.',
      ]),
    ],
  }),

  buildLevel({
    id: 4,
    name: 'たちつてと — Temple Staircase of Mild Concern',
    textureSet: 'temple',
    rows: [
      '###############',
      '#S...#....D..M#',
      '###.#.#.#####.#',
      '#...#.#.....#.#',
      '#.###.###.#.#.#',
      '#M....D...#...#',
      '#.#####.###.###',
      '#...M...#.....#',
      '###.###.#.###.#',
      '#M..#...#...M.#',
      '#.#.#.#####.#.#',
      '#......P......#',
      '###############',
    ],
    mice: [
      mouse('た', 'ta', ['chi', 'tsu', 'to'], 'Taiko starts with ta.', 'A red mouse thumps the floor. "た! Drum energy. No drum provided."'),
      mouse('ち', 'chi', ['ta', 'te', 'tsu'], 'Not ti. It is chi.', 'A blue mouse says, "ち is chi. I know. I filled out the irregular form."'),
      mouse('つ', 'tsu', ['ta', 'to', 'chi'], 'Not tu. It is tsu.', 'A green mouse says, "つ is tsu, the small hill your tongue trips over."'),
      mouse('て', 'te', ['ta', 'to', 'chi'], 'て means hand.', 'A white mouse waves one paw. "て means hand. I have four. I am overqualified."'),
      mouse('と', 'to', ['ta', 'tsu', 'te'], 'と starts とけい clock.', 'An orange mouse says, "と is time-adjacent. I am late professionally."'),
    ],
    doors: [
      door('A temple door mutters, "Which one says tsu? Choose carefully; I am old and petty."', ['た', 'ち', 'つ', 'て'], 2, 'つ is tsu.', `'つ' is 'tsu'. The door forgives one ancient grudge.`),
      door('A stair gate asks, "Which kana means hand and sounds te?"', ['て', 'と', 'た', 'ち'], 0, 'て is te.', `'て' is 'te'. The gate gives you a tiny invisible high five.`),
    ],
    npcs: [
      npc('STEP SAGE', 'S', 8, 11, '#8888cc', [
        'The T row is た ち つ て と.',
        'Two troublemakers: ち is chi and つ is tsu. They are proud of being exceptions.',
        'Words: たべる to eat, ちず map, つき moon, て hand, とけい clock.',
      ]),
    ],
  }),

  buildLevel({
    id: 5,
    name: 'なにぬねの — Forest of Unnecessary Signage',
    textureSet: 'forest',
    rows: [
      '###############',
      '#S..D....#...M#',
      '#.#####..#.#..#',
      '#.....#..#.#..#',
      '###.#.#D##.#.##',
      '#M..#.#....#..#',
      '#.###.#######.#',
      '#...#.....M...#',
      '#.#.#####.###.#',
      '#.#...M...#M..#',
      '#.###.###.###.#',
      '#......P......#',
      '###############',
    ],
    mice: [
      mouse('な', 'na', ['ni', 'nu', 'no'], 'な starts なまえ: name.', 'A green mouse says, "な is name energy. Please address me as The Green One."'),
      mouse('に', 'ni', ['na', 'ne', 'nu'], 'に starts にほん: Japan.', 'A red mouse says, "に is in にほん. I am on the brochure."'),
      mouse('ぬ', 'nu', ['ne', 'no', 'na'], 'Like noo.', 'A white mouse says, "ぬ looks complicated because I contain a tiny noodle storm."'),
      mouse('ね', 'ne', ['na', 'ni', 'no'], 'ね starts ねこ: cat.', 'A yellow mouse whispers, "ね is cat. I am a mouse saying this. The risk is enormous."'),
      mouse('の', 'no', ['na', 'nu', 'ne'], 'の can mean of.', 'A blue mouse says, "の is of. The wheel of ownership. The donut of grammar."'),
    ],
    doors: [
      door('A wooden sign blocks the path. It says, "Which kana starts neko, cat?"', ['な', 'に', 'ね', 'の'], 2, 'ね starts ねこ.', `'ね' is 'ne'. Somewhere, a cat considers legal action.`),
      door('A mossy door asks, "Which kana can mark possession like of?"', ['の', 'ぬ', 'に', 'な'], 0, 'の is the common possession particle.', `'の' is 'no'. The door opens and claims it was your idea.`),
    ],
    npcs: [
      npc('FOREST SAGE', 'S', 8, 11, '#a0c4ff', [
        'The N row is な に ぬ ね の.',
        'Words: なまえ name, にほん Japan, ぬの cloth, ねこ cat, のり seaweed glue snack situation.',
        'The cat word is near a mouse word. Nature is complicated.',
      ]),
    ],
  }),

  buildLevel({
    id: 6,
    name: 'はひふへほ — Onsen Where Steam Has Opinions',
    textureSet: 'onsen',
    rows: [
      '###############',
      '#S....#D...M..#',
      '#.###.#.#####.#',
      '#...#.#.....#.#',
      '#.#.#.###.#.#.#',
      '#.#M#.....#...#',
      '#.#.#####.###.#',
      '#...D...M.....#',
      '#####.#####.#.#',
      '#M....#...#.#M#',
      '#.#######.#.#.#',
      '#......P......#',
      '###############',
    ],
    mice: [
      mouse('は', 'ha', ['hi', 'fu', 'ho'], 'は is ha, but as a topic particle it is wa.', 'A yellow mouse says, "は is ha. Except when it is wa. I did not make this policy."'),
      mouse('ひ', 'hi', ['ha', 'he', 'fu'], 'ひ starts ひ: fire/day.', 'A red mouse says, "ひ is fire. Please do not test this in the onsen."'),
      mouse('ふ', 'fu', ['ha', 'ho', 'hi'], 'Not hu. It is fu.', 'A blue mouse says, "ふ is fu, said with soft lips like you are cooling soup respectfully."'),
      mouse('へ', 'he', ['ha', 'ho', 'fu'], 'へ can mark direction.', 'A white mouse says, "へ points somewhere. Usually away from responsibility."'),
      mouse('ほ', 'ho', ['ha', 'fu', 'he'], 'ほ starts ほん: book.', 'A green mouse says, "ほ is book-adjacent. I have read one label and feel powerful."'),
    ],
    doors: [
      door('The bathhouse door fogs up and writes, "Which kana says fu?"', ['は', 'ふ', 'ほ', 'ひ'], 1, 'ふ is fu.', `'ふ' is 'fu'. Steam applauds without hands.`),
      door('A direction gate asks, "Which kana can point toward a place and sounds he?"', ['へ', 'ほ', 'は', 'ひ'], 0, 'へ is he.', `'へ' is 'he'. The gate points itself open.`),
    ],
    npcs: [
      npc('ONSEN SAGE', 'S', 8, 11, '#81d4fa', [
        'The H row is は ひ ふ へ ほ.',
        'Important: ふ is fu, not hu. Also は can be read wa as a topic particle. Japanese enjoys tiny traps.',
        'Words: はな flower/nose, ひ fire, ふね boat, へや room, ほん book.',
      ]),
    ],
  }),

  buildLevel({
    id: 7,
    name: 'まみむめも — Market of Questionable Snacks',
    textureSet: 'market',
    rows: [
      '###############',
      '#S..D.....M...#',
      '#.###.#######.#',
      '#...#...M.....#',
      '###.###.###.###',
      '#M....#...#...#',
      '#.###.#D#.#.#.#',
      '#...#...#...#.#',
      '#.#.#######.#.#',
      '#.#...M.....#M#',
      '#.###.#####.#.#',
      '#......P......#',
      '###############',
    ],
    mice: [
      mouse('ま', 'ma', ['mi', 'mu', 'mo'], 'ま starts まち: town.', 'A red mouse says, "ま is marketplace energy. I sell nothing, aggressively."'),
      mouse('み', 'mi', ['ma', 'me', 'mu'], 'み can mean three in some readings.', 'A blue mouse says, "み is three-ish. I counted my paws and panicked."'),
      mouse('む', 'mu', ['ma', 'mo', 'mi'], 'Like moo without the cow.', 'A green mouse says, "む is the sound of a cow trying to be mysterious."'),
      mouse('め', 'me', ['ma', 'mo', 'mu'], 'め means eye.', 'A white mouse says, "め means eye. I am watching your answer with both pixels."'),
      mouse('も', 'mo', ['ma', 'mu', 'me'], 'も can mean also.', 'A yellow mouse says, "も means also. I also want snacks. This is grammar."'),
    ],
    doors: [
      door('A shop door asks, "Which kana means eye and sounds me?"', ['ま', 'み', 'め', 'も'], 2, 'め is me.', `'め' is 'me'. The door blinks, which doors should not do.`),
      door('A back gate says, "Pick mo, the also mouse sound."', ['む', 'も', 'み', 'ま'], 1, 'も is mo.', `'も' is 'mo'. The gate also opens. Grammar works.`),
    ],
    npcs: [
      npc('MARKET SAGE', 'S', 8, 11, '#a0c4ff', [
        'The M row is ま み む め も.',
        'Words: まち town, みず water, むし bug, め eye, もり forest.',
        'The bug word is むし. The market has three. Officially they are vendors.',
      ]),
    ],
  }),

  buildLevel({
    id: 8,
    name: 'やゆよ・らりるれろ — Riverside Argument Pavilion',
    textureSet: 'river',
    rows: [
      '###############',
      '#S..D..M...D.M#',
      '#.###.###.###.#',
      '#M..#.....#..M#',
      '###.#.###.#.###',
      '#...#M#.#M#...#',
      '#.###.#.#.###.#',
      '#M....D....M..#',
      '#.#####.#####.#',
      '#...~.....~...#',
      '###.###.###.###',
      '#......P......#',
      '###############',
    ],
    mice: [
      mouse('や', 'ya', ['yu', 'yo', 'ra'], 'や starts やま: mountain.', 'A red mouse yells, "や! Mountain sound. I climbed a pebble once."'),
      mouse('ゆ', 'yu', ['ya', 'yo', 'ru'], 'ゆ means hot water.', 'A blue mouse says, "ゆ is hot water. I am technically soup-adjacent."'),
      mouse('よ', 'yo', ['ya', 'yu', 'ro'], 'よ is yo.', 'A yellow mouse says, "よ! I add emphasis. This is important, yo."'),
      mouse('ら', 'ra', ['ri', 'ru', 're'], 'Soft Japanese r.', 'A green mouse says, "ら is a soft R. Do not roll me down a hill."'),
      mouse('り', 'ri', ['ra', 'ru', 're'], 'Two strokes, ri.', 'A white mouse says, "り is two strokes waving goodbye to confusion."'),
      mouse('る', 'ru', ['ra', 'ri', 'ro'], 'る is common in verbs.', 'An orange mouse says, "る ends many verbs. I stand at the exit of action."'),
      mouse('れ', 're', ['ra', 'ri', 'ru'], 'Like reh.', 'A blue mouse says, "れ looks busy because I have places to be."'),
      mouse('ろ', 'ro', ['ra', 'ru', 're'], 'Like roh.', 'A red mouse says, "ろ is a tiny loop with ambitions."'),
    ],
    doors: [
      door('A riverside door says, "Which kana is yu, hot water?"', ['や', 'ゆ', 'よ', 'ら'], 1, 'ゆ is yu.', `'ゆ' is 'yu'. The door relaxes like a bath.`),
      door('Another door asks, "Which one says ro? The loop is staring."', ['り', 'る', 'れ', 'ろ'], 3, 'ろ is ro.', `'ろ' is 'ro'. The loop approves.`),
      door('A bridge gate asks, "Which kana is often on verb endings and sounds ru?"', ['ら', 'り', 'る', 'れ'], 2, 'る is ru.', `'る' is 'ru'. The bridge gate performs a tiny verb.`),
    ],
    npcs: [
      npc('RIVER SAGE', 'S', 8, 11, '#90caf9', [
        'This level combines や ゆ よ and ら り る れ ろ.',
        'Words: やま mountain, ゆ hot water, よる night, りんご apple, ろうそく candle.',
        'The Y mice and R mice argue about riverfront property. Nobody owns the river.',
      ]),
    ],
  }),

  buildLevel({
    id: 9,
    name: 'わをん — Wind Gate for Three Final Sounds',
    textureSet: 'gate',
    rows: [
      '###############',
      '#S...D.....#..#',
      '#.#####.##.#M.#',
      '#.....#..#.#..#',
      '###.#.#..#D#.##',
      '#...#....#....#',
      '#.#####.#####.#',
      '#M....#.......#',
      '#####.#.#####.#',
      '#.....#.....M.#',
      '#.###########.#',
      '#......P......#',
      '###############',
    ],
    mice: [
      mouse('わ', 'wa', ['wo', 'n', 'ra'], 'わ says wa.', 'A green mouse says, "わ is wa. Friendly, round, waving from a windy hill."'),
      mouse('を', 'wo', ['wa', 'n', 'o'], 'を marks the direct object and is often pronounced o.', 'A white mouse says, "を is technically wo, often said o. I contain bureaucracy."'),
      mouse('ん', 'n', ['wa', 'wo', 'mu'], 'ん is the only standalone consonant kana.', 'A blue mouse says, "ん is n. I am the final hum at the end of a thought."'),
    ],
    doors: [
      door('A wind gate asks, "Which kana is the object particle, usually pronounced o?"', ['わ', 'を', 'ん', 'の'], 1, 'を marks direct objects.', `'を' is 'wo'. The gate opens after filing a particle report.`),
      door('The last gate hums, "Which kana is just n?"', ['ん', 'わ', 'を', 'む'], 0, 'ん is n.', `'ん' is 'n'. The gate hums back respectfully.`),
    ],
    npcs: [
      npc('GATE GUARD', 'G', 8, 11, '#bdb2ff', [
        'The final basic hiragana are わ を ん.',
        'Words: わたし means I/me. を marks what an action affects. ん ends sounds like a thoughtful refrigerator.',
        'After this, you have seen every basic hiragana. The mice are unionizing.',
      ]),
    ],
  }),

  buildLevel({
    id: 10,
    name: 'ひらがな — Grand Review Department Store',
    textureSet: 'review',
    rows: [
      '###############',
      '#S.D.M...M.D..#',
      '#.###.###.###.#',
      '#M..#.....#..M#',
      '###.#.###.#.###',
      '#...#M#D#M#...#',
      '#.###.#.#.###.#',
      '#M..D..~..D..M#',
      '#.#####.#####.#',
      '#...M.....M...#',
      '###.###.###.###',
      '#......P......#',
      '###############',
    ],
    mice: [
      mouse('あ', 'a', ['i', 'u', 'e'], 'あ is a.', 'A veteran mouse says, "あ returns. Sequels are profitable."'),
      mouse('き', 'ki', ['ka', 'ku', 'ko'], 'き is ki.', 'A green mouse says, "き is still key. I have not changed careers."'),
      mouse('し', 'shi', ['sa', 'su', 'so'], 'し is shi.', 'A white mouse says, "Still shi. Still not si. Healing takes time."'),
      mouse('つ', 'tsu', ['ta', 'chi', 'to'], 'つ is tsu.', 'A blue mouse says, "つ is tsu. I brought flashcards and emotional baggage."'),
      mouse('ね', 'ne', ['na', 'ni', 'no'], 'ね is ne.', 'A yellow mouse says, "ね is cat-adjacent. I am nervous but educational."'),
      mouse('ふ', 'fu', ['ha', 'hi', 'ho'], 'ふ is fu.', 'A red mouse says, "ふ cools soup. I cool incorrect answers."'),
      mouse('め', 'me', ['ma', 'mu', 'mo'], 'め is me.', 'An orange mouse says, "め means eye. The final exam is watching."'),
      mouse('る', 'ru', ['ra', 'ri', 'ro'], 'る is ru.', 'A green mouse says, "る ends verbs and, someday, this hallway."'),
      mouse('を', 'wo', ['wa', 'n', 'o'], 'を is wo/o.', 'A white mouse says, "を: object particle, professional overexplainer."'),
      mouse('ん', 'n', ['wa', 'mu', 'no'], 'ん is n.', 'A blue mouse says, "ん is the credits music of hiragana."'),
    ],
    doors: [
      door('The department-store door says, "Review time. Which one is shi?"', ['し', 'つ', 'く', 'そ'], 0, 'し is shi.', `'し' is 'shi'. The door stamps your receipt.`),
      door('A sale door asks, "Which one is fu? All hinges must know."', ['は', 'ひ', 'ふ', 'ほ'], 2, 'ふ is fu.', `'ふ' is 'fu'. The door discounts its attitude by 20%.`),
      door('A mirror door asks, "Which kana means eye and says me?"', ['め', 'ね', 'ぬ', 'む'], 0, 'め is me.', `'め' is 'me'. The door makes eye contact, somehow.`),
      door('A grammar door asks, "Which kana is the object particle?"', ['わ', 'を', 'ん', 'の'], 1, 'を is the direct object particle.', `'を' is 'wo'. The grammar door opens with unnecessary footnotes.`),
      door('The final door hums, "Which kana is just n?"', ['む', 'ん', 'わ', 'る'], 1, 'ん is n.', `'ん' is 'n'. The final door hums the victory bass line.`),
    ],
    npcs: [
      npc('REVIEW CLERK', 'T', 8, 11, '#ffb7c5', [
        'Welcome to the Grand Review Department Store. Every aisle contains a memory and possibly a mouse.',
        'Today you review core troublemakers: し, つ, ふ, め, を, ん, and friends.',
        'If all mice and all doors are solved, the stairs unlock. That is store policy and also dungeon law.',
      ]),
      npc('EXIT SAGE', 'S', 6, 11, '#caffbf', [
        'You now know basic hiragana: vowels, K, S, T, N, H, M, Y, R, W, and ん.',
        'Reading speed comes from seeing these shapes many times. The mice recommend repetition. Also cheese.',
      ]),
    ],
  }),
];

const seenMaps = new Set();
for (const level of LEVELS_JA) {
  if (seenMaps.has(level.signature)) throw new Error(`duplicate Japanese map detected: ${level.name}`);
  seenMaps.add(level.signature);
  delete level.signature;
}

export function getLevel(n) {
  return LEVELS_JA[Math.min(Math.max(n - 1, 0), LEVELS_JA.length - 1)];
}

export function getLevelCount() {
  return LEVELS_JA.length;
}

export function getLevelName(n) {
  return getLevel(n).name;
}
