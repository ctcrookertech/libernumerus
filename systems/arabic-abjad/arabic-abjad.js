/**
 * Liber Numerus — Arabic Abjad / Ilm al-Huruf
 * Abjad values, Hisab al-Saghir, Chronograms, Elemental/Planetary attributions
 */
const UnicodeUtils = (typeof require !== 'undefined') ? require('../../shared/unicode-utils') : window.UnicodeUtils;
const ReductionUtils = (typeof require !== 'undefined') ? require('../../shared/reduction-utils') : window.ReductionUtils;

const ArabicAbjad = (() => {
  // 28 Arabic letters in Abjad order (Eastern/Standard)
  const LETTERS_EASTERN = [
    { char: '\u0627', name: 'Alif',    value: 1,    element: 'fire',  planet: 'Sun' },
    { char: '\u0628', name: 'Ba',      value: 2,    element: 'air',   planet: 'Moon' },
    { char: '\u062C', name: 'Jim',     value: 3,    element: 'water', planet: 'Mars' },
    { char: '\u062F', name: 'Dal',     value: 4,    element: 'earth', planet: 'Mercury' },
    { char: '\u0647', name: 'Ha',      value: 5,    element: 'fire',  planet: 'Jupiter' },
    { char: '\u0648', name: 'Waw',     value: 6,    element: 'air',   planet: 'Venus' },
    { char: '\u0632', name: 'Zayn',    value: 7,    element: 'water', planet: 'Saturn' },
    { char: '\u062D', name: 'Hha',     value: 8,    element: 'earth', planet: 'Sun' },
    { char: '\u0637', name: 'Tta',     value: 9,    element: 'fire',  planet: 'Moon' },
    { char: '\u064A', name: 'Ya',      value: 10,   element: 'air',   planet: 'Mars' },
    { char: '\u0643', name: 'Kaf',     value: 20,   element: 'water', planet: 'Mercury' },
    { char: '\u0644', name: 'Lam',     value: 30,   element: 'earth', planet: 'Jupiter' },
    { char: '\u0645', name: 'Mim',     value: 40,   element: 'fire',  planet: 'Venus' },
    { char: '\u0646', name: 'Nun',     value: 50,   element: 'air',   planet: 'Saturn' },
    { char: '\u0633', name: 'Sin',     value: 60,   element: 'water', planet: 'Sun' },
    { char: '\u0639', name: 'Ayn',     value: 70,   element: 'earth', planet: 'Moon' },
    { char: '\u0641', name: 'Fa',      value: 80,   element: 'fire',  planet: 'Mars' },
    { char: '\u0635', name: 'Sad',     value: 90,   element: 'air',   planet: 'Mercury' },
    { char: '\u0642', name: 'Qaf',     value: 100,  element: 'water', planet: 'Jupiter' },
    { char: '\u0631', name: 'Ra',      value: 200,  element: 'earth', planet: 'Venus' },
    { char: '\u0634', name: 'Shin',    value: 300,  element: 'fire',  planet: 'Saturn' },
    { char: '\u062A', name: 'Ta',      value: 400,  element: 'air',   planet: 'Sun' },
    { char: '\u062B', name: 'Tha',     value: 500,  element: 'water', planet: 'Moon' },
    { char: '\u062E', name: 'Kha',     value: 600,  element: 'earth', planet: 'Mars' },
    { char: '\u0630', name: 'Dhal',    value: 700,  element: 'fire',  planet: 'Mercury' },
    { char: '\u0636', name: 'Dad',     value: 800,  element: 'air',   planet: 'Jupiter' },
    { char: '\u0638', name: 'Zza',     value: 900,  element: 'water', planet: 'Venus' },
    { char: '\u063A', name: 'Ghayn',   value: 1000, element: 'earth', planet: 'Saturn' }
  ];

  // Maghrebi ordering — differs for letters after the shared Semitic core
  const LETTERS_MAGHREBI = [
    { char: '\u0627', name: 'Alif',  value: 1 },
    { char: '\u0628', name: 'Ba',    value: 2 },
    { char: '\u062C', name: 'Jim',   value: 3 },
    { char: '\u062F', name: 'Dal',   value: 4 },
    { char: '\u0647', name: 'Ha',    value: 5 },
    { char: '\u0648', name: 'Waw',   value: 6 },
    { char: '\u0632', name: 'Zayn',  value: 7 },
    { char: '\u062D', name: 'Hha',   value: 8 },
    { char: '\u0637', name: 'Tta',   value: 9 },
    { char: '\u064A', name: 'Ya',    value: 10 },
    { char: '\u0643', name: 'Kaf',   value: 20 },
    { char: '\u0644', name: 'Lam',   value: 30 },
    { char: '\u0645', name: 'Mim',   value: 40 },
    { char: '\u0646', name: 'Nun',   value: 50 },
    { char: '\u0635', name: 'Sad',   value: 60 },
    { char: '\u0639', name: 'Ayn',   value: 70 },
    { char: '\u0641', name: 'Fa',    value: 80 },
    { char: '\u0636', name: 'Dad',   value: 90 },
    { char: '\u0642', name: 'Qaf',   value: 100 },
    { char: '\u0631', name: 'Ra',    value: 200 },
    { char: '\u0634', name: 'Shin',  value: 300 },
    { char: '\u062A', name: 'Ta',    value: 400 },
    { char: '\u062B', name: 'Tha',   value: 500 },
    { char: '\u062E', name: 'Kha',   value: 600 },
    { char: '\u0630', name: 'Dhal',  value: 700 },
    { char: '\u0638', name: 'Zza',   value: 800 },
    { char: '\u063A', name: 'Ghayn', value: 900 },
    { char: '\u0633', name: 'Sin',   value: 1000 }
  ];

  // Build value maps
  function buildValueMap(letters) {
    const map = {};
    for (const l of letters) {
      map[l.char] = l.value;
    }
    // Hamza and Alef variants
    map['\u0623'] = map['\u0627'] || 1; // Alef with hamza above
    map['\u0625'] = map['\u0627'] || 1; // Alef with hamza below
    map['\u0622'] = map['\u0627'] || 1; // Alef with madda
    map['\u0621'] = 0; // Hamza standalone (some count, some don't)
    map['\u0629'] = map['\u0647'] || 5; // Teh marbuta = Ha
    map['\u0649'] = map['\u064A'] || 10; // Alef maksura = Ya
    return map;
  }

  const EASTERN_MAP = buildValueMap(LETTERS_EASTERN);
  const MAGHREBI_MAP = buildValueMap(LETTERS_MAGHREBI);

  // Build element/planet lookup
  const ELEMENT_MAP = {};
  const PLANET_MAP = {};
  for (const l of LETTERS_EASTERN) {
    ELEMENT_MAP[l.char] = l.element;
    PLANET_MAP[l.char] = l.planet;
  }

  // 99 Names of God (selection with Abjad values)
  const DIVINE_NAMES = [
    { arabic: '\u0627\u0644\u0644\u0647', transliteration: 'Allah', value: 66 },
    { arabic: '\u0627\u0644\u0631\u062D\u0645\u0646', transliteration: 'Ar-Rahman', value: 329 },
    { arabic: '\u0627\u0644\u0631\u062D\u064A\u0645', transliteration: 'Ar-Rahim', value: 289 },
    { arabic: '\u0627\u0644\u0645\u0644\u0643', transliteration: 'Al-Malik', value: 121 },
    { arabic: '\u0627\u0644\u0642\u062F\u0648\u0633', transliteration: 'Al-Quddus', value: 200 },
    { arabic: '\u0627\u0644\u0633\u0644\u0627\u0645', transliteration: 'As-Salam', value: 162 },
  ];

  const DEFAULT_CONFIG = {
    letterOrder: 'eastern',
    method: 'jumal',
    includeHamza: true
  };

  const VARIANTS = {
    standard: { letterOrder: 'eastern', method: 'jumal', includeHamza: true },
    maghrebi: { letterOrder: 'maghrebi', method: 'jumal', includeHamza: true },
    sufi:     { letterOrder: 'eastern', method: 'jumal', includeHamza: true }
  };

  function create(config) {
    if (typeof config === 'string' && VARIANTS[config]) {
      config = { ...VARIANTS[config] };
    }
    const cfg = { ...DEFAULT_CONFIG, ...(config || {}) };

    function getValueMap() {
      return cfg.letterOrder === 'maghrebi' ? MAGHREBI_MAP : EASTERN_MAP;
    }

    function letterValue(ch) {
      const map = getValueMap();
      const normalized = UnicodeUtils.normalizeArabic(ch);
      // Strip diacritics
      const clean = normalized.replace(/[\u064B-\u065F\u0670]/g, '');
      for (const c of clean) {
        if (map[c] !== undefined) {
          if (c === '\u0621' && !cfg.includeHamza) return 0;
          if (c === '\u0621' && cfg.includeHamza) return 1;
          return map[c];
        }
      }
      return 0;
    }

    function wordValue(str) {
      const normalized = UnicodeUtils.normalizeArabic(str);
      const clean = normalized.replace(/[\u064B-\u065F\u0670]/g, '');
      const map = getValueMap();
      let sum = 0;
      for (const ch of clean) {
        if (ch === ' ' || ch === '\u200C' || ch === '\u200D') continue;
        if (ch === '\u0621') {
          if (cfg.includeHamza) sum += 1;
          continue;
        }
        if (map[ch] !== undefined) {
          sum += map[ch];
        }
      }
      return sum;
    }

    function smallCalc(str) {
      const total = wordValue(str);
      return ReductionUtils.reduce(total, []);
    }

    function chronogram(str) {
      const value = wordValue(str);
      return { hijriYear: value, phrase: str };
    }

    function elementOf(ch) {
      return ELEMENT_MAP[ch] || null;
    }

    function planetOf(ch) {
      return PLANET_MAP[ch] || null;
    }

    function divineName(name) {
      return DIVINE_NAMES.find(d => d.transliteration.toLowerCase() === name.toLowerCase()) || null;
    }

    function reduce(n) {
      return ReductionUtils.reduce(n, []);
    }

    function numberMeaning(n) {
      const dn = DIVINE_NAMES.find(d => d.value === n);
      if (dn) return dn;
      return null;
    }

    function analyze(input) {
      if (typeof input === 'string') {
        const total = wordValue(input);
        const result = {
          jumal: total,
          saghir: ReductionUtils.reduce(total, [])
        };
        return result;
      }
      if (typeof input === 'number') {
        return { value: input, meaning: numberMeaning(input) };
      }
      return null;
    }

    return {
      letterValue,
      wordValue,
      smallCalc,
      chronogram,
      elementOf,
      planetOf,
      divineName,
      reduce,
      numberMeaning,
      analyze
    };
  }

  return { create, DEFAULT_CONFIG, VARIANTS, LETTERS_EASTERN, LETTERS_MAGHREBI, DIVINE_NAMES };
})();

if (typeof module !== 'undefined') module.exports = ArabicAbjad;
