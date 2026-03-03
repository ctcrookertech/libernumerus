/**
 * Liber Numerus — Hebrew Gematria
 * Standard, Small, Gadol, Kolel, Ordinal, AIQ BKR methods
 */
const UnicodeUtils = (typeof require !== 'undefined') ? require('../../shared/unicode-utils') : window.UnicodeUtils;

const HebrewGematria = (() => {
  // 22 Hebrew letters with standard values
  const LETTERS = [
    { char: '\u05D0', name: 'Aleph',   standard: 1,   ordinal: 1,  pictograph: 'Ox' },
    { char: '\u05D1', name: 'Bet',     standard: 2,   ordinal: 2,  pictograph: 'House' },
    { char: '\u05D2', name: 'Gimel',   standard: 3,   ordinal: 3,  pictograph: 'Camel' },
    { char: '\u05D3', name: 'Dalet',   standard: 4,   ordinal: 4,  pictograph: 'Door' },
    { char: '\u05D4', name: 'He',      standard: 5,   ordinal: 5,  pictograph: 'Window' },
    { char: '\u05D5', name: 'Vav',     standard: 6,   ordinal: 6,  pictograph: 'Hook/Nail' },
    { char: '\u05D6', name: 'Zayin',   standard: 7,   ordinal: 7,  pictograph: 'Weapon' },
    { char: '\u05D7', name: 'Chet',    standard: 8,   ordinal: 8,  pictograph: 'Fence' },
    { char: '\u05D8', name: 'Tet',     standard: 9,   ordinal: 9,  pictograph: 'Serpent' },
    { char: '\u05D9', name: 'Yod',     standard: 10,  ordinal: 10, pictograph: 'Hand' },
    { char: '\u05DB', name: 'Kaf',     standard: 20,  ordinal: 11, pictograph: 'Palm' },
    { char: '\u05DC', name: 'Lamed',   standard: 30,  ordinal: 12, pictograph: 'Ox-goad' },
    { char: '\u05DE', name: 'Mem',     standard: 40,  ordinal: 13, pictograph: 'Water' },
    { char: '\u05E0', name: 'Nun',     standard: 50,  ordinal: 14, pictograph: 'Fish' },
    { char: '\u05E1', name: 'Samekh',  standard: 60,  ordinal: 15, pictograph: 'Support' },
    { char: '\u05E2', name: 'Ayin',    standard: 70,  ordinal: 16, pictograph: 'Eye' },
    { char: '\u05E4', name: 'Pe',      standard: 80,  ordinal: 17, pictograph: 'Mouth' },
    { char: '\u05E6', name: 'Tsade',   standard: 90,  ordinal: 18, pictograph: 'Fishhook' },
    { char: '\u05E7', name: 'Qof',     standard: 100, ordinal: 19, pictograph: 'Back of head' },
    { char: '\u05E8', name: 'Resh',    standard: 200, ordinal: 20, pictograph: 'Head' },
    { char: '\u05E9', name: 'Shin',    standard: 300, ordinal: 21, pictograph: 'Tooth' },
    { char: '\u05EA', name: 'Tav',     standard: 400, ordinal: 22, pictograph: 'Cross/Mark' }
  ];

  // Final (sofit) forms → extended values
  const SOFIT_VALUES = {
    '\u05DA': { normal: '\u05DB', standard: 20,  extended: 500, name: 'Kaf Sofit' },   // ך
    '\u05DD': { normal: '\u05DE', standard: 40,  extended: 600, name: 'Mem Sofit' },   // ם
    '\u05DF': { normal: '\u05E0', standard: 50,  extended: 700, name: 'Nun Sofit' },   // ן
    '\u05E3': { normal: '\u05E4', standard: 80,  extended: 800, name: 'Pe Sofit' },    // ף
    '\u05E5': { normal: '\u05E6', standard: 90,  extended: 900, name: 'Tsade Sofit' }  // ץ
  };

  // Build lookup maps
  const STANDARD_MAP = {};
  const ORDINAL_MAP = {};
  const KATAN_MAP = {};
  const LETTER_INFO = {};

  for (const l of LETTERS) {
    STANDARD_MAP[l.char] = l.standard;
    ORDINAL_MAP[l.char] = l.ordinal;
    KATAN_MAP[l.char] = l.standard < 10 ? l.standard : (l.standard < 100 ? Math.floor(l.standard / 10) : Math.floor(l.standard / 100));
    LETTER_INFO[l.char] = l;
  }

  // Sofit default = same as normal letter standard value
  for (const [sofitChar, info] of Object.entries(SOFIT_VALUES)) {
    STANDARD_MAP[sofitChar] = info.standard;
    const normalLetter = LETTERS.find(l => l.char === info.normal);
    if (normalLetter) {
      ORDINAL_MAP[sofitChar] = normalLetter.ordinal;
      KATAN_MAP[sofitChar] = KATAN_MAP[info.normal];
    }
  }

  // AIQ BKR — 9 chambers
  const AIQ_BKR_CHAMBERS = [
    [1, 10, 100],   // Chamber 1: Aleph, Yod, Qof
    [2, 20, 200],   // Chamber 2: Bet, Kaf, Resh
    [3, 30, 300],   // Chamber 3: Gimel, Lamed, Shin
    [4, 40, 400],   // Chamber 4: Dalet, Mem, Tav
    [5, 50],        // Chamber 5: He, Nun
    [6, 60],        // Chamber 6: Vav, Samekh
    [7, 70],        // Chamber 7: Zayin, Ayin
    [8, 80],        // Chamber 8: Chet, Pe
    [9, 90]         // Chamber 9: Tet, Tsade
  ];

  // Sefirot
  const SEFIROT = {
    1:  { name: 'Keter',    translation: 'Crown',         position: 'top',    description: 'The supreme crown, the divine will' },
    2:  { name: 'Chokmah',  translation: 'Wisdom',        position: 'right',  description: 'Creative wisdom, the beginning of pattern' },
    3:  { name: 'Binah',    translation: 'Understanding', position: 'left',   description: 'Contemplative understanding, the womb of form' },
    4:  { name: 'Chesed',   translation: 'Mercy',         position: 'right',  description: 'Loving-kindness, expansive benevolence' },
    5:  { name: 'Gevurah',  translation: 'Severity',      position: 'left',   description: 'Judgment and strength, restrictive power' },
    6:  { name: 'Tiferet',  translation: 'Beauty',        position: 'center', description: 'Harmonious balance, compassionate beauty' },
    7:  { name: 'Netzach',  translation: 'Victory',       position: 'right',  description: 'Endurance, eternity, victory in persistence' },
    8:  { name: 'Hod',      translation: 'Splendor',      position: 'left',   description: 'Majesty, surrender, intellectual clarity' },
    9:  { name: 'Yesod',    translation: 'Foundation',    position: 'center', description: 'Foundation, bonding, the channel of creation' },
    10: { name: 'Malkut',   translation: 'Kingdom',       position: 'bottom', description: 'The kingdom, physical manifestation, the Shekhinah' }
  };

  // 22 letter-paths on the Tree of Life (Kircher arrangement as default)
  const PATHS_KIRCHER = [
    { letter: '\u05D0', path: 11, connects: ['Keter', 'Chokmah'] },
    { letter: '\u05D1', path: 12, connects: ['Keter', 'Binah'] },
    { letter: '\u05D2', path: 13, connects: ['Keter', 'Tiferet'] },
    { letter: '\u05D3', path: 14, connects: ['Chokmah', 'Binah'] },
    { letter: '\u05D4', path: 15, connects: ['Chokmah', 'Tiferet'] },
    { letter: '\u05D5', path: 16, connects: ['Chokmah', 'Chesed'] },
    { letter: '\u05D6', path: 17, connects: ['Binah', 'Tiferet'] },
    { letter: '\u05D7', path: 18, connects: ['Binah', 'Gevurah'] },
    { letter: '\u05D8', path: 19, connects: ['Chesed', 'Gevurah'] },
    { letter: '\u05D9', path: 20, connects: ['Chesed', 'Tiferet'] },
    { letter: '\u05DB', path: 21, connects: ['Chesed', 'Netzach'] },
    { letter: '\u05DC', path: 22, connects: ['Gevurah', 'Tiferet'] },
    { letter: '\u05DE', path: 23, connects: ['Gevurah', 'Hod'] },
    { letter: '\u05E0', path: 24, connects: ['Tiferet', 'Netzach'] },
    { letter: '\u05E1', path: 25, connects: ['Tiferet', 'Yesod'] },
    { letter: '\u05E2', path: 26, connects: ['Tiferet', 'Hod'] },
    { letter: '\u05E4', path: 27, connects: ['Netzach', 'Hod'] },
    { letter: '\u05E6', path: 28, connects: ['Netzach', 'Yesod'] },
    { letter: '\u05E7', path: 29, connects: ['Netzach', 'Malkut'] },
    { letter: '\u05E8', path: 30, connects: ['Hod', 'Yesod'] },
    { letter: '\u05E9', path: 31, connects: ['Hod', 'Malkut'] },
    { letter: '\u05EA', path: 32, connects: ['Yesod', 'Malkut'] }
  ];

  const PATHS_GRA = [
    { letter: '\u05D0', path: 11, connects: ['Keter', 'Chokmah'] },
    { letter: '\u05D1', path: 12, connects: ['Keter', 'Binah'] },
    { letter: '\u05D2', path: 13, connects: ['Keter', 'Tiferet'] },
    { letter: '\u05D3', path: 14, connects: ['Chokmah', 'Binah'] },
    { letter: '\u05D4', path: 15, connects: ['Chokmah', 'Tiferet'] },
    { letter: '\u05D5', path: 16, connects: ['Chokmah', 'Chesed'] },
    { letter: '\u05D6', path: 17, connects: ['Binah', 'Tiferet'] },
    { letter: '\u05D7', path: 18, connects: ['Binah', 'Gevurah'] },
    { letter: '\u05D8', path: 19, connects: ['Chesed', 'Gevurah'] },
    { letter: '\u05D9', path: 20, connects: ['Chesed', 'Tiferet'] },
    { letter: '\u05DB', path: 21, connects: ['Chesed', 'Netzach'] },
    { letter: '\u05DC', path: 22, connects: ['Gevurah', 'Tiferet'] },
    { letter: '\u05DE', path: 23, connects: ['Gevurah', 'Hod'] },
    { letter: '\u05E0', path: 24, connects: ['Tiferet', 'Netzach'] },
    { letter: '\u05E1', path: 25, connects: ['Tiferet', 'Yesod'] },
    { letter: '\u05E2', path: 26, connects: ['Tiferet', 'Hod'] },
    { letter: '\u05E4', path: 27, connects: ['Netzach', 'Hod'] },
    { letter: '\u05E6', path: 28, connects: ['Netzach', 'Yesod'] },
    { letter: '\u05E7', path: 29, connects: ['Netzach', 'Malkut'] },
    { letter: '\u05E8', path: 30, connects: ['Hod', 'Yesod'] },
    { letter: '\u05E9', path: 31, connects: ['Hod', 'Malkut'] },
    { letter: '\u05EA', path: 32, connects: ['Yesod', 'Malkut'] }
  ];

  const PATHS_ARI = [
    { letter: '\u05D0', path: 11, connects: ['Chokmah', 'Keter'] },
    { letter: '\u05D1', path: 12, connects: ['Binah', 'Keter'] },
    { letter: '\u05D2', path: 13, connects: ['Tiferet', 'Keter'] },
    { letter: '\u05D3', path: 14, connects: ['Binah', 'Chokmah'] },
    { letter: '\u05D4', path: 15, connects: ['Tiferet', 'Chokmah'] },
    { letter: '\u05D5', path: 16, connects: ['Chesed', 'Chokmah'] },
    { letter: '\u05D6', path: 17, connects: ['Tiferet', 'Binah'] },
    { letter: '\u05D7', path: 18, connects: ['Gevurah', 'Binah'] },
    { letter: '\u05D8', path: 19, connects: ['Gevurah', 'Chesed'] },
    { letter: '\u05D9', path: 20, connects: ['Tiferet', 'Chesed'] },
    { letter: '\u05DB', path: 21, connects: ['Netzach', 'Chesed'] },
    { letter: '\u05DC', path: 22, connects: ['Tiferet', 'Gevurah'] },
    { letter: '\u05DE', path: 23, connects: ['Hod', 'Gevurah'] },
    { letter: '\u05E0', path: 24, connects: ['Netzach', 'Tiferet'] },
    { letter: '\u05E1', path: 25, connects: ['Yesod', 'Tiferet'] },
    { letter: '\u05E2', path: 26, connects: ['Hod', 'Tiferet'] },
    { letter: '\u05E4', path: 27, connects: ['Hod', 'Netzach'] },
    { letter: '\u05E6', path: 28, connects: ['Yesod', 'Netzach'] },
    { letter: '\u05E7', path: 29, connects: ['Malkut', 'Netzach'] },
    { letter: '\u05E8', path: 30, connects: ['Yesod', 'Hod'] },
    { letter: '\u05E9', path: 31, connects: ['Malkut', 'Hod'] },
    { letter: '\u05EA', path: 32, connects: ['Malkut', 'Yesod'] }
  ];

  // Known significant gematria values for equivalence finder
  const KNOWN_VALUES = {
    13: ['\u05D0\u05D7\u05D3', '\u05D0\u05D4\u05D1\u05D4'], // Echad, Ahavah
    18: ['\u05D7\u05D9'],                                      // Chai
    26: ['\u05D9\u05D4\u05D5\u05D4'],                          // YHVH
    358: ['\u05DE\u05E9\u05D9\u05D7', '\u05E0\u05D7\u05E9'],  // Mashiach, Nachash
    86: ['\u05D0\u05DC\u05D4\u05D9\u05DD'],                    // Elohim
    72: ['\u05D7\u05E1\u05D3'],                                // Chesed
    314: ['\u05E9\u05D3\u05D9'],                               // Shaddai
  };

  const DEFAULT_CONFIG = {
    sofitValues: 'standard',
    method: 'hechrachi',
    treeArrangement: 'kircher'
  };

  const VARIANTS = {
    traditional: { sofitValues: 'standard', method: 'hechrachi', treeArrangement: 'kircher' },
    lurianic:    { sofitValues: 'extended', method: 'hechrachi', treeArrangement: 'ari' },
    gra:         { sofitValues: 'standard', method: 'hechrachi', treeArrangement: 'gra' }
  };

  function create(config) {
    if (typeof config === 'string' && VARIANTS[config]) {
      config = { ...VARIANTS[config] };
    }
    const cfg = { ...DEFAULT_CONFIG, ...(config || {}) };

    function getLetterValue(ch, method) {
      method = method || cfg.method;
      const normalized = UnicodeUtils.normalizeMarks(ch);

      // Check if it's a sofit character
      if (UnicodeUtils.isSofit(normalized)) {
        if (method === 'gadol' || cfg.sofitValues === 'extended') {
          return SOFIT_VALUES[normalized] ? SOFIT_VALUES[normalized].extended : 0;
        }
        return SOFIT_VALUES[normalized] ? SOFIT_VALUES[normalized].standard : 0;
      }

      switch (method) {
        case 'hechrachi':
        case 'standard':
          return STANDARD_MAP[normalized] || 0;
        case 'katan':
          return KATAN_MAP[normalized] || 0;
        case 'gadol':
          return STANDARD_MAP[normalized] || 0;
        case 'kolel':
          return STANDARD_MAP[normalized] || 0;
        case 'siduri':
        case 'ordinal':
          return ORDINAL_MAP[normalized] || 0;
        case 'aiqbkr':
          return aiqBkrValue(normalized);
        default:
          return STANDARD_MAP[normalized] || 0;
      }
    }

    function letterValue(ch) {
      return getLetterValue(ch, cfg.method);
    }

    function wordValue(str, method) {
      method = method || cfg.method;
      const normalized = UnicodeUtils.normalizeMarks(str);
      let sum = 0;
      for (const ch of normalized) {
        const v = getLetterValue(ch, method === 'kolel' ? 'hechrachi' : method);
        sum += v;
      }
      if (method === 'kolel') sum += 1;
      return sum;
    }

    function aiqBkrValue(ch) {
      const std = STANDARD_MAP[ch] || (SOFIT_VALUES[ch] ? SOFIT_VALUES[ch].standard : 0);
      if (std === 0) return 0;
      // Reduce to single digit
      if (std < 10) return std;
      if (std < 100) return Math.floor(std / 10);
      return Math.floor(std / 100);
    }

    function aiqBkr(ch) {
      const normalized = UnicodeUtils.normalizeMarks(ch);
      return aiqBkrValue(normalized);
    }

    function kolel(str) {
      return wordValue(str, 'kolel');
    }

    function findEquivalences(value) {
      return KNOWN_VALUES[value] || [];
    }

    function sefirah(n) {
      return SEFIROT[n] || null;
    }

    function letterPath(letterOrPath) {
      let paths;
      switch (cfg.treeArrangement) {
        case 'gra': paths = PATHS_GRA; break;
        case 'ari': paths = PATHS_ARI; break;
        default: paths = PATHS_KIRCHER;
      }

      if (typeof letterOrPath === 'number') {
        return paths.find(p => p.path === letterOrPath) || null;
      }
      return paths.find(p => p.letter === letterOrPath) || null;
    }

    function numberMeaning(n) {
      const s = SEFIROT[n];
      if (s) return s;
      const equivs = findEquivalences(n);
      if (equivs.length > 0) {
        return { value: n, equivalences: equivs };
      }
      return null;
    }

    function analyze(input) {
      if (typeof input === 'string') {
        const std = wordValue(input, 'hechrachi');
        const katan = wordValue(input, 'katan');
        const ordinal = wordValue(input, 'siduri');
        const result = {
          standard: std,
          katan: katan,
          ordinal: ordinal,
          kolel: std + 1,
          equivalences: findEquivalences(std)
        };
        if (cfg.sofitValues === 'extended') {
          result.gadol = wordValue(input, 'gadol');
        }
        return result;
      }
      if (typeof input === 'number') {
        return {
          sefirah: SEFIROT[input] || null,
          equivalences: findEquivalences(input)
        };
      }
      return null;
    }

    return {
      letterValue,
      wordValue,
      aiqBkr,
      kolel,
      findEquivalences,
      sefirah,
      letterPath,
      numberMeaning,
      analyze,
      getLetterValue
    };
  }

  return {
    create,
    DEFAULT_CONFIG,
    VARIANTS,
    LETTERS,
    SOFIT_VALUES,
    STANDARD_MAP,
    ORDINAL_MAP,
    KATAN_MAP,
    AIQ_BKR_CHAMBERS,
    SEFIROT,
    KNOWN_VALUES
  };
})();

if (typeof module !== 'undefined') module.exports = HebrewGematria;
