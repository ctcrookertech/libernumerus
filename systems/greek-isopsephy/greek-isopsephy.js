/**
 * Libernumerus — Greek Isopsephy
 * Classical Greek letter-number system with archaic numerals
 */
const UnicodeUtils = (typeof require !== 'undefined') ? require('../../shared/unicode-utils') : window.UnicodeUtils;
const ReductionUtils = (typeof require !== 'undefined') ? require('../../shared/reduction-utils') : window.ReductionUtils;

const GreekIsopsephy = (() => {
  // Standard 24 Greek letters + archaic numerals
  const LETTERS = [
    { char: 'Α', lower: 'α', name: 'Alpha',   value: 1 },
    { char: 'Β', lower: 'β', name: 'Beta',    value: 2 },
    { char: 'Γ', lower: 'γ', name: 'Gamma',   value: 3 },
    { char: 'Δ', lower: 'δ', name: 'Delta',   value: 4 },
    { char: 'Ε', lower: 'ε', name: 'Epsilon', value: 5 },
    // Position 6 is Digamma/Stigma (archaic)
    { char: 'Ζ', lower: 'ζ', name: 'Zeta',    value: 7 },
    { char: 'Η', lower: 'η', name: 'Eta',     value: 8 },
    { char: 'Θ', lower: 'θ', name: 'Theta',   value: 9 },
    { char: 'Ι', lower: 'ι', name: 'Iota',    value: 10 },
    { char: 'Κ', lower: 'κ', name: 'Kappa',   value: 20 },
    { char: 'Λ', lower: 'λ', name: 'Lambda',  value: 30 },
    { char: 'Μ', lower: 'μ', name: 'Mu',      value: 40 },
    { char: 'Ν', lower: 'ν', name: 'Nu',      value: 50 },
    { char: 'Ξ', lower: 'ξ', name: 'Xi',      value: 60 },
    { char: 'Ο', lower: 'ο', name: 'Omicron', value: 70 },
    { char: 'Π', lower: 'π', name: 'Pi',      value: 80 },
    // Position 90 is Qoppa (archaic)
    { char: 'Ρ', lower: 'ρ', name: 'Rho',     value: 100 },
    { char: 'Σ', lower: 'σ', name: 'Sigma',   value: 200 },
    { char: 'Τ', lower: 'τ', name: 'Tau',     value: 300 },
    { char: 'Υ', lower: 'υ', name: 'Upsilon', value: 400 },
    { char: 'Φ', lower: 'φ', name: 'Phi',     value: 500 },
    { char: 'Χ', lower: 'χ', name: 'Chi',     value: 600 },
    { char: 'Ψ', lower: 'ψ', name: 'Psi',     value: 700 },
    { char: 'Ω', lower: 'ω', name: 'Omega',   value: 800 }
  ];

  // Archaic letters
  const ARCHAIC = {
    'Ϝ': 6, 'ϝ': 6,   // Digamma
    'Ϛ': 6, 'ϛ': 6,   // Stigma (later form of Digamma for numeral 6)
    'Ϟ': 90, 'ϟ': 90, // Qoppa
    'Ϡ': 900, 'ϡ': 900 // Sampi
  };

  // Build value map
  const VALUE_MAP = {};
  for (const l of LETTERS) {
    VALUE_MAP[l.char] = l.value;
    VALUE_MAP[l.lower] = l.value;
  }
  // Final sigma
  VALUE_MAP['ς'] = 200;

  // Romanization → Greek value mapping
  const ROMAN_TO_GREEK = {
    'A': 1, 'B': 2, 'G': 3, 'D': 4, 'E': 5,
    'Z': 7, 'H': 8, 'TH': 9,
    'I': 10, 'K': 20, 'L': 30, 'M': 40, 'N': 50,
    'X': 60, 'O': 70, 'P': 80,
    'R': 100, 'S': 200, 'T': 300,
    'U': 400, 'Y': 400, 'PH': 500, 'CH': 600, 'PS': 700,
    'W': 800
  };

  // Known significant values
  const KNOWN_VALUES = {
    888: ['Ἰησοῦς'],       // Iesous (Jesus)
    365: ['Ἀβρασάξ'],      // Abraxas
    93:  ['θελημα', 'ἀγάπη'], // Thelema, Agape
    666: ['Νερων Καισαρ'],  // Neron Kaisar (in Hebrew, but cross-referenced)
  };

  const DEFAULT_CONFIG = {
    includeArchaic: true,
    stigmaForDigamma: false,
    allowReduction: false,
    inputMode: 'greek'
  };

  const VARIANTS = {
    classical: { includeArchaic: true, stigmaForDigamma: false, allowReduction: false, inputMode: 'greek' },
    byzantine: { includeArchaic: true, stigmaForDigamma: true, allowReduction: false, inputMode: 'greek' },
    modern:    { includeArchaic: true, stigmaForDigamma: false, allowReduction: true, inputMode: 'greek' }
  };

  function create(config) {
    if (typeof config === 'string' && VARIANTS[config]) {
      config = { ...VARIANTS[config] };
    }
    const cfg = { ...DEFAULT_CONFIG, ...(config || {}) };

    function letterValue(ch) {
      // Strip diacritics for lookup
      const stripped = UnicodeUtils.normalizeGreek(ch);
      if (VALUE_MAP[stripped] !== undefined) return VALUE_MAP[stripped];
      if (cfg.includeArchaic && ARCHAIC[stripped] !== undefined) return ARCHAIC[stripped];
      return 0;
    }

    function wordValue(str, options) {
      const opts = options || {};
      const mode = opts.inputMode || cfg.inputMode;

      if (mode === 'romanized') {
        return romanizedValue(str);
      }

      // Strip diacritics for consistent matching
      const normalized = UnicodeUtils.normalizeGreek(str);
      let sum = 0;
      for (const ch of normalized) {
        sum += letterValue(ch);
      }
      return sum;
    }

    function romanizedValue(str) {
      const upper = str.toUpperCase();
      let sum = 0;
      let i = 0;
      while (i < upper.length) {
        // Try two-character combinations first
        if (i + 1 < upper.length) {
          const two = upper[i] + upper[i + 1];
          if (ROMAN_TO_GREEK[two] !== undefined) {
            sum += ROMAN_TO_GREEK[two];
            i += 2;
            continue;
          }
        }
        if (ROMAN_TO_GREEK[upper[i]] !== undefined) {
          sum += ROMAN_TO_GREEK[upper[i]];
        }
        i++;
      }
      return sum;
    }

    function reduce(n) {
      if (!cfg.allowReduction) return n;
      return ReductionUtils.reduce(n, []);
    }

    function findEquivalences(value) {
      return KNOWN_VALUES[value] || [];
    }

    function numberMeaning(n) {
      const equivs = findEquivalences(n);
      if (equivs.length > 0) {
        return { value: n, equivalences: equivs };
      }
      return null;
    }

    function analyze(input) {
      if (typeof input === 'string') {
        const total = wordValue(input);
        const result = { total: total, equivalences: findEquivalences(total) };
        if (cfg.allowReduction) {
          result.reduced = reduce(total);
        }
        return result;
      }
      if (typeof input === 'number') {
        return { value: input, equivalences: findEquivalences(input) };
      }
      return null;
    }

    return {
      letterValue,
      wordValue,
      reduce,
      findEquivalences,
      numberMeaning,
      analyze
    };
  }

  return { create, DEFAULT_CONFIG, VARIANTS, LETTERS, ARCHAIC, VALUE_MAP, KNOWN_VALUES };
})();

if (typeof module !== 'undefined') module.exports = GreekIsopsephy;
