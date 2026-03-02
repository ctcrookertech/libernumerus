/**
 * Libernumerus — Thelemic Numerology
 * Delegates Hebrew gematria and Greek isopsephy, English Qabalah ciphers,
 * Tree of Life, 93 Current, Notariqon, Temurah
 */
const HebrewGematria = (typeof require !== 'undefined') ? require('../hebrew-gematria/hebrew-gematria') : window.HebrewGematria;
const GreekIsopsephy = (typeof require !== 'undefined') ? require('../greek-isopsephy/greek-isopsephy') : window.GreekIsopsephy;

const Thelemic = (() => {
  // English Qabalah — ALW cipher (Aiwass-Liber-W)
  const ALW_MAP = {
    A:1, L:2, W:3, H:4, S:5, D:6, O:7, Z:8, K:9, V:10, G:11, R:12,
    C:13, N:14, Y:15, J:16, U:17, F:18, Q:19, B:20, M:21, X:22,
    I:23, T:24, E:25, P:26
  };

  // NAEQ cipher (New Aeon English Qabalah)
  const NAEQ_MAP = {
    A:1, B:20, C:13, D:6, E:25, F:18, G:11, H:4, I:23, J:16, K:9, L:2,
    M:21, N:14, O:7, P:26, Q:19, R:12, S:5, T:24, U:17, V:10, W:3,
    X:22, Y:15, Z:8
  };

  // Trigrammaton cipher
  const TRIGRAMMATON_MAP = {
    A:5, B:20, C:2, D:23, E:13, F:12, G:8, H:18, I:3, J:17, K:10, L:21,
    M:6, N:15, O:1, P:22, Q:14, R:11, S:9, T:16, U:4, V:24, W:19,
    X:7, Y:25, Z:26
  };

  // Simple English (A=1 sequential)
  const SIMPLE_MAP = {};
  for (let i = 0; i < 26; i++) {
    SIMPLE_MAP[String.fromCharCode(65 + i)] = i + 1;
  }

  const CIPHERS = {
    alw: ALW_MAP,
    naeq: NAEQ_MAP,
    trigrammaton: TRIGRAMMATON_MAP,
    simple: SIMPLE_MAP
  };

  // Sepher Sephiroth — key number-word entries
  const SEPHER_SEPHIROTH = {
    1:   ['Keter', 'Eheieh'],
    13:  ['Echad (Unity)', 'Ahavah (Love)'],
    26:  ['YHVH (Tetragrammaton)'],
    31:  ['El (God)', 'LA (Not)'],
    65:  ['Adonai'],
    78:  ['Mezla (Influence from above)'],
    93:  ['Thelema (Will)', 'Agape (Love)'],
    111: ['Aleph spelled in full (ALP)'],
    156: ['Babalon'],
    220: ['Selected (Chosen)'],
    333: ['Choronzon'],
    418: ['Abrahadabra'],
    666: ['Sorath', 'To Mega Therion'],
    777: ['World of Shells (Olam ha-Qliphoth)'],
    888: ['Iesous (Jesus in Greek)']
  };

  // Tree of Life — Sephiroth (1-10) and Paths (11-32)
  // Based on Liber 777 correspondences (Crowley system)
  const TREE_CROWLEY = {
    1:  { name: 'Keter',    translation: 'Crown',         planet: 'Primum Mobile', tarot: null, hebrew: null, element: null },
    2:  { name: 'Chokmah',  translation: 'Wisdom',        planet: 'Neptune/Zodiac', tarot: null, hebrew: null, element: null },
    3:  { name: 'Binah',    translation: 'Understanding', planet: 'Saturn', tarot: null, hebrew: null, element: null },
    4:  { name: 'Chesed',   translation: 'Mercy',         planet: 'Jupiter', tarot: null, hebrew: null, element: null },
    5:  { name: 'Gevurah',  translation: 'Severity',      planet: 'Mars', tarot: null, hebrew: null, element: null },
    6:  { name: 'Tiferet',  translation: 'Beauty',        planet: 'Sun', tarot: null, hebrew: null, element: null },
    7:  { name: 'Netzach',  translation: 'Victory',       planet: 'Venus', tarot: null, hebrew: null, element: null },
    8:  { name: 'Hod',      translation: 'Splendor',      planet: 'Mercury', tarot: null, hebrew: null, element: null },
    9:  { name: 'Yesod',    translation: 'Foundation',    planet: 'Moon', tarot: null, hebrew: null, element: null },
    10: { name: 'Malkut',   translation: 'Kingdom',       planet: 'Earth', tarot: null, hebrew: null, element: null },
    11: { letter: '\u05D0', name: 'Aleph',   tarot: 'The Fool',           attribution: 'Air',     connects: ['Keter', 'Chokmah'] },
    12: { letter: '\u05D1', name: 'Bet',     tarot: 'The Magus',          attribution: 'Mercury', connects: ['Keter', 'Binah'] },
    13: { letter: '\u05D2', name: 'Gimel',   tarot: 'The Priestess',      attribution: 'Moon',    connects: ['Keter', 'Tiferet'] },
    14: { letter: '\u05D3', name: 'Dalet',   tarot: 'The Empress',        attribution: 'Venus',   connects: ['Chokmah', 'Binah'] },
    15: { letter: '\u05D4', name: 'He',      tarot: 'The Star',           attribution: 'Aquarius',connects: ['Chokmah', 'Tiferet'] },
    16: { letter: '\u05D5', name: 'Vav',     tarot: 'The Hierophant',     attribution: 'Taurus',  connects: ['Chokmah', 'Chesed'] },
    17: { letter: '\u05D6', name: 'Zayin',   tarot: 'The Lovers',         attribution: 'Gemini',  connects: ['Binah', 'Tiferet'] },
    18: { letter: '\u05D7', name: 'Chet',    tarot: 'The Chariot',        attribution: 'Cancer',  connects: ['Binah', 'Gevurah'] },
    19: { letter: '\u05D8', name: 'Tet',     tarot: 'Lust',               attribution: 'Leo',     connects: ['Chesed', 'Gevurah'] },
    20: { letter: '\u05D9', name: 'Yod',     tarot: 'The Hermit',         attribution: 'Virgo',   connects: ['Chesed', 'Tiferet'] },
    21: { letter: '\u05DB', name: 'Kaf',     tarot: 'Fortune',            attribution: 'Jupiter', connects: ['Chesed', 'Netzach'] },
    22: { letter: '\u05DC', name: 'Lamed',   tarot: 'Adjustment',         attribution: 'Libra',   connects: ['Gevurah', 'Tiferet'] },
    23: { letter: '\u05DE', name: 'Mem',     tarot: 'The Hanged Man',     attribution: 'Water',   connects: ['Gevurah', 'Hod'] },
    24: { letter: '\u05E0', name: 'Nun',     tarot: 'Death',              attribution: 'Scorpio', connects: ['Tiferet', 'Netzach'] },
    25: { letter: '\u05E1', name: 'Samekh',  tarot: 'Art',                attribution: 'Sagittarius', connects: ['Tiferet', 'Yesod'] },
    26: { letter: '\u05E2', name: 'Ayin',    tarot: 'The Devil',          attribution: 'Capricorn', connects: ['Tiferet', 'Hod'] },
    27: { letter: '\u05E4', name: 'Pe',      tarot: 'The Tower',          attribution: 'Mars',    connects: ['Netzach', 'Hod'] },
    28: { letter: '\u05E6', name: 'Tsade',   tarot: 'The Emperor',        attribution: 'Aries',   connects: ['Netzach', 'Yesod'] },
    29: { letter: '\u05E7', name: 'Qof',     tarot: 'The Moon',           attribution: 'Pisces',  connects: ['Netzach', 'Malkut'] },
    30: { letter: '\u05E8', name: 'Resh',    tarot: 'The Sun',            attribution: 'Sun',     connects: ['Hod', 'Yesod'] },
    31: { letter: '\u05E9', name: 'Shin',    tarot: 'The Aeon',           attribution: 'Fire',    connects: ['Hod', 'Malkut'] },
    32: { letter: '\u05EA', name: 'Tav',     tarot: 'The Universe',       attribution: 'Saturn',  connects: ['Yesod', 'Malkut'] }
  };

  const TREE_GOLDEN_DAWN = { ...TREE_CROWLEY };
  // GD differences: paths 15/28 swap (Star↔Emperor), path 19=Strength, path 22=Justice
  TREE_GOLDEN_DAWN[15] = { ...TREE_CROWLEY[15], tarot: 'The Emperor', attribution: 'Aries' };
  TREE_GOLDEN_DAWN[19] = { ...TREE_CROWLEY[19], tarot: 'Strength' };
  TREE_GOLDEN_DAWN[22] = { ...TREE_CROWLEY[22], tarot: 'Justice' };
  TREE_GOLDEN_DAWN[28] = { ...TREE_CROWLEY[28], tarot: 'The Star', attribution: 'Aquarius' };

  // Hebrew letter mapping for Atbash and Albam
  const HEBREW_LETTERS = [
    '\u05D0','\u05D1','\u05D2','\u05D3','\u05D4',
    '\u05D5','\u05D6','\u05D7','\u05D8','\u05D9',
    '\u05DB','\u05DC','\u05DE','\u05E0','\u05E1',
    '\u05E2','\u05E4','\u05E6','\u05E7','\u05E8',
    '\u05E9','\u05EA'
  ];

  const SIGNIFICANT_NUMBERS = {
    11:  'The number of Magick, the general number of energy tending to change',
    31:  'El (God), LA (Not) — the negative affirmation',
    93:  'Thelema (Will) = Agape (Love) — the central word of the Law',
    156: 'Babalon — the Scarlet Woman',
    220: 'The number of verses in Liber AL vel Legis',
    333: 'Choronzon — the demon of the Abyss',
    418: 'Abrahadabra — the Word of the Aeon, the reward of Ra-Hoor-Khuit',
    666: 'The Number of the Beast, To Mega Therion, the Sun',
    777: 'The flaming sword, the World of Shells',
    888: 'Jesus in Greek Isopsephy'
  };

  const DEFAULT_CONFIG = {
    englishCipher: 'alw',
    primaryScript: 'hebrew',
    treeSystem: 'crowley',
    includeQliphoth: false
  };

  const VARIANTS = {
    standard93: { englishCipher: 'alw', primaryScript: 'hebrew', treeSystem: 'crowley', includeQliphoth: false },
    goldenDawn: { englishCipher: 'simple', primaryScript: 'hebrew', treeSystem: 'goldenDawn', includeQliphoth: false },
    naeq:       { englishCipher: 'naeq', primaryScript: 'hebrew', treeSystem: 'crowley', includeQliphoth: false }
  };

  function create(config) {
    if (typeof config === 'string' && VARIANTS[config]) {
      config = { ...VARIANTS[config] };
    }
    const cfg = { ...DEFAULT_CONFIG, ...(config || {}) };

    const hebrew = HebrewGematria.create('traditional');
    const greek = GreekIsopsephy.create('classical');

    function hebrewValue(str) {
      return hebrew.wordValue(str);
    }

    function greekValue(str) {
      return greek.wordValue(str);
    }

    function englishValue(str, cipher) {
      cipher = cipher || cfg.englishCipher;
      const map = CIPHERS[cipher] || ALW_MAP;
      let sum = 0;
      for (const ch of str.toUpperCase()) {
        if (map[ch]) sum += map[ch];
      }
      return sum;
    }

    function aiqBkr(ch) {
      return hebrew.aiqBkr(ch);
    }

    function treePath(n) {
      const tree = cfg.treeSystem === 'goldenDawn' ? TREE_GOLDEN_DAWN : TREE_CROWLEY;
      return tree[n] || null;
    }

    function sephiroth(n) {
      if (n < 1 || n > 10) return null;
      const tree = cfg.treeSystem === 'goldenDawn' ? TREE_GOLDEN_DAWN : TREE_CROWLEY;
      return tree[n] || null;
    }

    function sepherSephiroth(n) {
      return SEPHER_SEPHIROTH[n] || [];
    }

    function is93(word, cipher) {
      cipher = cipher || cfg.englishCipher;
      return englishValue(word, cipher) === 93;
    }

    function notariqon(phrase) {
      const words = phrase.trim().split(/\s+/);
      return words.map(w => w[0]).join('').toUpperCase();
    }

    function atbash(ch) {
      const idx = HEBREW_LETTERS.indexOf(ch);
      if (idx === -1) return ch;
      return HEBREW_LETTERS[21 - idx];
    }

    function albam(ch) {
      const idx = HEBREW_LETTERS.indexOf(ch);
      if (idx === -1) return ch;
      return HEBREW_LETTERS[(idx + 11) % 22];
    }

    function temurah(str, method) {
      method = method || 'atbash';
      const fn = method === 'albam' ? albam : atbash;
      let result = '';
      for (const ch of str) {
        result += fn(ch);
      }
      return result;
    }

    function numberMeaning(n) {
      const result = {};
      if (SIGNIFICANT_NUMBERS[n]) result.thelemic = SIGNIFICANT_NUMBERS[n];
      if (SEPHER_SEPHIROTH[n]) result.sepherSephiroth = SEPHER_SEPHIROTH[n];
      const tree = cfg.treeSystem === 'goldenDawn' ? TREE_GOLDEN_DAWN : TREE_CROWLEY;
      if (tree[n]) result.tree = tree[n];
      return Object.keys(result).length > 0 ? result : null;
    }

    function analyze(input) {
      if (typeof input === 'string') {
        const results = {};
        // Detect script
        const firstChar = input.trim()[0];
        const cp = firstChar ? firstChar.codePointAt(0) : 0;
        if (cp >= 0x05D0 && cp <= 0x05EA) {
          results.hebrew = hebrewValue(input);
        } else if ((cp >= 0x0370 && cp <= 0x03FF) || (cp >= 0x1F00 && cp <= 0x1FFF)) {
          results.greek = greekValue(input);
        } else {
          results.english = {};
          for (const cipher of Object.keys(CIPHERS)) {
            results.english[cipher] = englishValue(input, cipher);
          }
        }
        return results;
      }
      if (typeof input === 'number') {
        return numberMeaning(input);
      }
      return null;
    }

    return {
      hebrewValue,
      greekValue,
      englishValue,
      aiqBkr,
      treePath,
      sephiroth,
      sepherSephiroth,
      is93,
      notariqon,
      atbash,
      albam,
      temurah,
      numberMeaning,
      analyze
    };
  }

  return { create, DEFAULT_CONFIG, VARIANTS, CIPHERS, SEPHER_SEPHIROTH, SIGNIFICANT_NUMBERS };
})();

if (typeof module !== 'undefined') module.exports = Thelemic;
