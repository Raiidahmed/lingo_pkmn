// Maps challenge hex colors to available mouse sprite folders
const COLOR_FOLDER = {
  // Red family
  '#ffadad': 'red', '#ff9999': 'red', '#ffebee': 'red',
  '#ffcdd2': 'red', '#f8bbd0': 'red', '#fce4ec': 'red',
  // Orange family
  '#ffd6a5': 'orange', '#ffab91': 'orange', '#ffecb3': 'orange',
  '#ffe0b2': 'orange', '#ffccbc': 'orange',
  // Yellow family
  '#fdffb6': 'yellow', '#fff9c4': 'yellow', '#fffde7': 'yellow',
  '#f0f4c3': 'yellow', '#fff59d': 'yellow',
  // Green family
  '#caffbf': 'green', '#e8f5e9': 'green', '#b2dfdb': 'green',
  '#c8e6c9': 'green', '#dcedc8': 'green', '#a5d6a7': 'green',
  // Blue family
  '#9bf6ff': 'blue', '#a0c4ff': 'blue', '#e1f5fe': 'blue',
  '#e3f2fd': 'blue', '#c5cae9': 'blue', '#bbdefb': 'blue',
  '#b3e5fc': 'blue', '#b2ebf2': 'blue', '#90caf9': 'blue',
  '#81d4fa': 'blue',
  // White / neutral (anything not matched above)
  '#bdb2ff': 'white', '#ffc6ff': 'white', '#fffffc': 'white',
  '#ffffff': 'white', '#efebe9': 'white', '#d7ccc8': 'white',
  '#f5f5f5': 'white', '#e1bee7': 'white', '#d1c4e9': 'white',
  '#e0e0e0': 'white', '#b0bec5': 'white', '#fff9c4': 'yellow',
};

// Single kana → romaji filename suffix (hiragana + katakana share the suffix)
const KANA_ROMAJI = {
  // Hiragana
  'あ':'a',  'い':'i',  'う':'u',  'え':'e',  'お':'o',
  'か':'ka', 'き':'ki', 'く':'ku', 'け':'ke', 'こ':'ko',
  'さ':'sa', 'し':'shi','す':'su', 'せ':'se', 'そ':'so',
  'た':'ta', 'ち':'chi','つ':'tsu','て':'te', 'と':'to',
  'な':'na', 'に':'ni', 'ぬ':'nu', 'ね':'ne', 'の':'no',
  'は':'ha', 'ひ':'hi', 'ふ':'fu', 'へ':'he', 'ほ':'ho',
  'ま':'ma', 'み':'mi', 'む':'mu', 'め':'me', 'も':'mo',
  'や':'ya', 'ゆ':'yu', 'よ':'yo',
  'ら':'ra', 'り':'ri', 'る':'ru', 'れ':'re', 'ろ':'ro',
  'わ':'wa', 'を':'wo', 'ん':'n',
  // Katakana — same sound, same sprite suffix
  'ア':'a',  'イ':'i',  'ウ':'u',  'エ':'e',  'オ':'o',
  'カ':'ka', 'キ':'ki', 'ク':'ku', 'ケ':'ke', 'コ':'ko',
  'サ':'sa', 'シ':'shi','ス':'su', 'セ':'se', 'ソ':'so',
  'タ':'ta', 'チ':'chi','ツ':'tsu','テ':'te', 'ト':'to',
  'ナ':'na', 'ニ':'ni', 'ヌ':'nu', 'ネ':'ne', 'ノ':'no',
  'ハ':'ha', 'ヒ':'hi', 'フ':'fu', 'ヘ':'he', 'ホ':'ho',
  'マ':'ma', 'ミ':'mi', 'ム':'mu', 'メ':'me', 'モ':'mo',
  'ヤ':'ya', 'ユ':'yu', 'ヨ':'yo',
  'ラ':'ra', 'リ':'ri', 'ル':'ru', 'レ':'re', 'ロ':'ro',
  'ワ':'wa', 'ヲ':'wo', 'ン':'n',
};

function getFolder(color) {
  return (color && COLOR_FOLDER[color.toLowerCase()]) || 'white';
}

const _cache = new Map();

export function loadMouseImage(color, displayChar) {
  const folder = getFolder(color);
  const romaji = (displayChar && displayChar.length === 1)
    ? KANA_ROMAJI[displayChar]
    : null;
  const suffix = romaji || 'base';
  const path = `/mice/${folder}/${folder}_mouse_${suffix}.png`;

  if (!_cache.has(path)) {
    const img = new Image();
    img.src = path;
    _cache.set(path, img);
  }
  return _cache.get(path);
}

export function preloadMouseImages(challenges) {
  if (!challenges) return;
  for (const ch of challenges) {
    loadMouseImage(ch.color, null);
    if (ch.display) loadMouseImage(ch.color, ch.display);
  }
}
