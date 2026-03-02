/**
 * Libernumerus — Hurufism
 * Extends Arabic Abjad with facial line mapping, prophetic cycles, body mapping
 */
const ArabicAbjad = (typeof require !== 'undefined') ? require('../arabic-abjad/arabic-abjad') : window.ArabicAbjad;

const Hurufism = (() => {
  // 28 Arabic letters — base Abjad values imported from ArabicAbjad
  // 4 additional Persian letters for 32-letter system
  const PERSIAN_EXTENSIONS = [
    { char: '\u067E', name: 'Pe',  value: 2,  position: 29 },  // پ (like Ba)
    { char: '\u0686', name: 'Che', value: 3,  position: 30 },  // چ (like Jim)
    { char: '\u0698', name: 'Zhe', value: 7,  position: 31 },  // ژ (like Zayn)
    { char: '\u06AF', name: 'Gaf', value: 20, position: 32 }   // گ (like Kaf)
  ];

  // 7 facial lines — each mapped to 4 letters (28 letters / 7 = 4 per line)
  // The 7 lines of the face according to Fazlallah
  const FACIAL_LINES = [
    {
      line: 1, name: 'Right Eyebrow',
      letters: ['\u0627', '\u0628', '\u062C', '\u062F'], // Alif, Ba, Jim, Dal
      description: 'The arc of divine knowledge'
    },
    {
      line: 2, name: 'Left Eyebrow',
      letters: ['\u0647', '\u0648', '\u0632', '\u062D'], // Ha, Waw, Zayn, Hha
      description: 'The arc of divine mercy'
    },
    {
      line: 3, name: 'Right Eye',
      letters: ['\u0637', '\u064A', '\u0643', '\u0644'], // Tta, Ya, Kaf, Lam
      description: 'The eye of outer perception'
    },
    {
      line: 4, name: 'Left Eye',
      letters: ['\u0645', '\u0646', '\u0633', '\u0639'], // Mim, Nun, Sin, Ayn
      description: 'The eye of inner perception'
    },
    {
      line: 5, name: 'Right Nostril',
      letters: ['\u0641', '\u0635', '\u0642', '\u0631'], // Fa, Sad, Qaf, Ra
      description: 'The breath of the manifest'
    },
    {
      line: 6, name: 'Left Nostril',
      letters: ['\u0634', '\u062A', '\u062B', '\u062E'], // Shin, Ta, Tha, Kha
      description: 'The breath of the hidden'
    },
    {
      line: 7, name: 'Mouth Line',
      letters: ['\u0630', '\u0636', '\u0638', '\u063A'], // Dhal, Dad, Zza, Ghayn
      description: 'The line of speech and prophecy'
    }
  ];

  // 32-letter body mapping (teeth)
  // Upper right (8), Upper left (8), Lower left (8), Lower right (8)
  const TEETH_MAP = {
    upperRight: ['\u0627', '\u0628', '\u062C', '\u062F', '\u0647', '\u0648', '\u0632', '\u062D'],
    upperLeft:  ['\u0637', '\u064A', '\u0643', '\u0644', '\u0645', '\u0646', '\u0633', '\u0639'],
    lowerLeft:  ['\u0641', '\u0635', '\u0642', '\u0631', '\u0634', '\u062A', '\u062B', '\u062E'],
    lowerRight: ['\u0630', '\u0636', '\u0638', '\u063A', '\u067E', '\u0686', '\u0698', '\u06AF']
  };

  // Prophetic cycle — letter groups associated with prophets
  const PROPHETIC_CYCLES = [
    { prophet: 'Adam', letters: ['\u0627', '\u0628', '\u062C', '\u062F'], totalValue: 10 },
    { prophet: 'Noah', letters: ['\u0647', '\u0648', '\u0632', '\u062D'], totalValue: 26 },
    { prophet: 'Abraham', letters: ['\u0637', '\u064A', '\u0643', '\u0644'], totalValue: 69 },
    { prophet: 'Moses', letters: ['\u0645', '\u0646', '\u0633', '\u0639'], totalValue: 220 },
    { prophet: 'David', letters: ['\u0641', '\u0635', '\u0642', '\u0631'], totalValue: 470 },
    { prophet: 'Jesus', letters: ['\u0634', '\u062A', '\u062B', '\u062E'], totalValue: 1800 },
    { prophet: 'Muhammad', letters: ['\u0630', '\u0636', '\u0638', '\u063A'], totalValue: 3400 }
  ];

  const DEFAULT_CONFIG = {
    letterSet: 'arabic28',
    includeBodyMap: true
  };

  const VARIANTS = {
    fazlallah: { letterSet: 'arabic28', includeBodyMap: true },
    persian:   { letterSet: 'persian32', includeBodyMap: true }
  };

  function create(config) {
    if (typeof config === 'string' && VARIANTS[config]) {
      config = { ...VARIANTS[config] };
    }
    const cfg = { ...DEFAULT_CONFIG, ...(config || {}) };
    const abjad = ArabicAbjad.create('standard');

    // Build Persian extension map
    const persianMap = {};
    for (const ext of PERSIAN_EXTENSIONS) {
      persianMap[ext.char] = ext.value;
    }

    function letterValue(ch) {
      // Check Persian extensions first
      if (cfg.letterSet === 'persian32' && persianMap[ch] !== undefined) {
        return persianMap[ch];
      }
      return abjad.letterValue(ch);
    }

    function wordValue(str) {
      let sum = 0;
      for (const ch of str) {
        if (ch === ' ') continue;
        sum += letterValue(ch);
      }
      return sum;
    }

    function facialLine(ch) {
      for (const line of FACIAL_LINES) {
        if (line.letters.includes(ch)) {
          return {
            line: line.line,
            name: line.name,
            description: line.description,
            groupLetters: line.letters
          };
        }
      }
      return null;
    }

    function propheticCycle(ch) {
      for (const cycle of PROPHETIC_CYCLES) {
        if (cycle.letters.includes(ch)) {
          return { ...cycle };
        }
      }
      return null;
    }

    function bodyMap(ch) {
      if (!cfg.includeBodyMap) return null;
      for (const [quadrant, letters] of Object.entries(TEETH_MAP)) {
        const pos = letters.indexOf(ch);
        if (pos !== -1) {
          return { quadrant, toothPosition: pos + 1, letter: ch };
        }
      }
      return null;
    }

    function getLetterSet() {
      if (cfg.letterSet === 'persian32') {
        return [...ArabicAbjad.LETTERS_EASTERN, ...PERSIAN_EXTENSIONS];
      }
      return ArabicAbjad.LETTERS_EASTERN;
    }

    function analyze(input) {
      if (typeof input === 'string') {
        const total = wordValue(input);
        const result = {
          value: total,
          letterSet: cfg.letterSet,
          letterCount: getLetterSet().length
        };
        return result;
      }
      return null;
    }

    return {
      letterValue,
      wordValue,
      facialLine,
      propheticCycle,
      bodyMap,
      getLetterSet,
      analyze
    };
  }

  return {
    create, DEFAULT_CONFIG, VARIANTS,
    PERSIAN_EXTENSIONS, FACIAL_LINES, TEETH_MAP, PROPHETIC_CYCLES
  };
})();

if (typeof module !== 'undefined') module.exports = Hurufism;
