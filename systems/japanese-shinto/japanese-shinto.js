/**
 * Libernumerus — Japanese / Shinto Numerology
 * Seimei Handan (name-stroke numerology), Rokuyo day cycle,
 * phonetic digit associations, gift amount evaluation, kanji stroke lookup
 */
const DateUtils = (typeof require !== 'undefined') ? require('../../shared/date-utils') : window.DateUtils;

const JapaneseShinto = (() => {

  // ── Phonetic digit associations ──────────────────────────────────────
  // Japanese-specific readings — distinct from Chinese numerology
  const DIGIT_INFO = {
    0: {
      readings: ['rei', 'zero'],
      onReading: 'rei',
      kunReading: 'zero',
      auspicious: null,
      notes: 'Neutral; emptiness (mu/ku) in Buddhist context'
    },
    1: {
      readings: ['ichi', 'hitotsu'],
      onReading: 'ichi',
      kunReading: 'hitotsu',
      auspicious: true,
      notes: 'Beginning, unity; generally favorable'
    },
    2: {
      readings: ['ni', 'futatsu'],
      onReading: 'ni',
      kunReading: 'futatsu',
      auspicious: null,
      notes: 'Pair, duality; neutral'
    },
    3: {
      readings: ['san', 'mittsu'],
      onReading: 'san',
      kunReading: 'mittsu',
      auspicious: true,
      notes: 'Growth, creation; associated with birth and vitality'
    },
    4: {
      readings: ['shi', 'yon', 'yottsu'],
      onReading: 'shi',
      kunReading: 'yon',
      auspicious: false,
      notes: 'Shi is homophone of death (shi/死); strongly inauspicious'
    },
    5: {
      readings: ['go', 'itsutsu'],
      onReading: 'go',
      kunReading: 'itsutsu',
      auspicious: true,
      notes: 'Balance, five elements (godai); generally favorable'
    },
    6: {
      readings: ['roku', 'muttsu'],
      onReading: 'roku',
      kunReading: 'muttsu',
      auspicious: null,
      notes: 'Neutral; associated with the six realms in Buddhism'
    },
    7: {
      readings: ['shichi', 'nana', 'nanatsu'],
      onReading: 'shichi',
      kunReading: 'nana',
      auspicious: true,
      notes: 'Lucky number; Seven Gods of Fortune (Shichifukujin)'
    },
    8: {
      readings: ['hachi', 'ya', 'yattsu'],
      onReading: 'hachi',
      kunReading: 'ya',
      auspicious: true,
      notes: 'Ya/hachi — eightfold, abundant;末広がり (suehirogari) — expanding prosperity. Sacred in Shinto'
    },
    9: {
      readings: ['ku', 'kyuu', 'kokonotsu'],
      onReading: 'ku',
      kunReading: 'kokonotsu',
      auspicious: false,
      notes: 'Ku is homophone of suffering (ku/苦); inauspicious'
    }
  };

  // ── Rokuyo (六曜) day names ──────────────────────────────────────────
  const ROKUYO_NAMES = [
    {
      name: 'Sensho',
      kanji: '先勝',
      meaning: 'Win first',
      description: 'Morning is lucky, afternoon is unlucky. Good for urgent matters.',
      auspicious: 'morning'
    },
    {
      name: 'Tomobiki',
      kanji: '友引',
      meaning: 'Friend-pulling',
      description: 'Avoid funerals (pulls friends to death). Midday unlucky, morning/evening good.',
      auspicious: 'mixed'
    },
    {
      name: 'Senbu',
      kanji: '先負',
      meaning: 'Lose first',
      description: 'Morning is unlucky, afternoon is lucky. Stay calm and patient.',
      auspicious: 'afternoon'
    },
    {
      name: 'Butsumetsu',
      kanji: '仏滅',
      meaning: 'Buddha\'s death',
      description: 'The most unlucky day. Avoid weddings and celebrations.',
      auspicious: false
    },
    {
      name: 'Taian',
      kanji: '大安',
      meaning: 'Great peace',
      description: 'The most auspicious day. Ideal for weddings, openings, and celebrations.',
      auspicious: true
    },
    {
      name: 'Shakku',
      kanji: '赤口',
      meaning: 'Red mouth',
      description: 'Only the hour of the Horse (11am-1pm) is lucky. Otherwise unlucky.',
      auspicious: 'midday'
    }
  ];

  // ── Kanji stroke-count table (common name characters) ────────────────
  // Traditional (kyuujitai) counts used by default in seimei handan
  const KANJI_STROKES_TRADITIONAL = {
    // Common family name kanji
    '山': 3, '田': 5, '中': 4, '村': 7, '小': 3,
    '大': 3, '川': 3, '林': 8, '森': 12, '木': 4,
    '井': 4, '石': 5, '高': 10, '松': 8, '竹': 6,
    '藤': 18, '佐': 7, '伊': 6, '加': 5, '吉': 6,
    '鈴': 13, '渡': 12, '辺': 16, '斉': 14, '斎': 11,
    '橋': 16, '池': 6, '岡': 8, '原': 10, '野': 11,
    '島': 10, '上': 3, '下': 3, '本': 5, '宮': 10,
    '清': 11, '長': 8, '谷': 7, '近': 11, '遠': 16,
    '福': 13, '黒': 11, '白': 5, '赤': 7, '青': 8,
    '金': 8, '銀': 14, '鉄': 13, '玉': 5, '花': 7,
    // Common given name kanji
    '太': 4, '郎': 9, '一': 1, '二': 2, '三': 3,
    '子': 3, '美': 9, '和': 8, '正': 5, '光': 6,
    '明': 8, '春': 9, '夏': 10, '秋': 9, '冬': 5,
    '健': 11, '幸': 8, '恵': 10, '愛': 13, '真': 10,
    '直': 8, '雄': 12, '男': 7, '女': 3, '千': 3,
    '万': 3, '百': 6, '十': 2, '五': 4, '七': 2,
    '八': 2, '九': 2, '四': 5, '六': 4, '信': 9,
    '義': 13, '勇': 9, '智': 12, '仁': 4, '礼': 5,
    '忠': 8, '孝': 7, '悟': 10, '浩': 10, '翔': 12,
    '優': 17, '結': 12, '桜': 10, '陽': 12, '蓮': 13
  };

  // Simplified (shinjitai) — some characters have fewer strokes
  const KANJI_STROKES_SIMPLIFIED = {
    ...KANJI_STROKES_TRADITIONAL,
    '辺': 5, '斉': 8, '斎': 8, '鉄': 13,
    '鈴': 13, '渡': 12, '橋': 16, '近': 7,
    '遠': 13, '銀': 14
  };

  // ── Seimei Handan grid interpretations ───────────────────────────────
  const GRID_MEANINGS = {
    tenkaku: 'Ancestral fortune; influences early life and family karma.',
    jinkaku: 'Core personality; the most important grid for character and middle life.',
    chikaku: 'Foundation fortune; influences youth and inner nature.',
    gaikaku: 'Social fortune; influences relationships and external circumstances.',
    soukaku: 'Overall fortune; influences the whole life, especially later years.'
  };

  // Simple number-luck mapping for seimei handan (1-81 cycle)
  // Broadly: certain numbers are kichi (lucky) or kyou (unlucky)
  const LUCKY_NUMBERS = [1, 3, 5, 6, 7, 8, 11, 13, 15, 16, 17, 18, 21, 23, 24, 25, 29, 31, 32, 33, 35, 37, 38, 39, 41, 45, 47, 48, 52, 57, 58, 61, 63, 65, 67, 68, 73, 75, 81];
  const UNLUCKY_NUMBERS = [2, 4, 9, 10, 12, 14, 19, 20, 22, 26, 27, 28, 30, 34, 36, 40, 42, 43, 44, 46, 49, 50, 51, 53, 54, 55, 56, 59, 60, 62, 64, 66, 69, 70, 71, 72, 74, 76, 77, 78, 79, 80];

  function numberLuck(n) {
    if (n <= 0) return 'neutral';
    // Cycle within 1-81
    const cycled = ((n - 1) % 81) + 1;
    if (LUCKY_NUMBERS.includes(cycled)) return 'kichi';
    if (UNLUCKY_NUMBERS.includes(cycled)) return 'kyou';
    return 'neutral';
  }

  // ── Configuration ────────────────────────────────────────────────────
  const DEFAULT_CONFIG = {
    seimeiMethod: 'standard',        // 'standard' | 'simplified'
    includeOnReading: true,          // include on'yomi reading in evaluateDigit
    kanjiStrokeSource: 'traditional' // 'traditional' | 'simplified'
  };

  const VARIANTS = {
    traditional: {
      seimeiMethod: 'standard',
      includeOnReading: true,
      kanjiStrokeSource: 'traditional'
    },
    modern: {
      seimeiMethod: 'simplified',
      includeOnReading: false,
      kanjiStrokeSource: 'simplified'
    }
  };

  // ── Factory ──────────────────────────────────────────────────────────
  function create(config) {
    if (typeof config === 'string' && VARIANTS[config]) {
      config = { ...VARIANTS[config] };
    }
    const cfg = { ...DEFAULT_CONFIG, ...(config || {}) };

    /**
     * Get the kanji stroke table based on config
     */
    function getStrokeTable() {
      return cfg.kanjiStrokeSource === 'simplified'
        ? KANJI_STROKES_SIMPLIFIED
        : KANJI_STROKES_TRADITIONAL;
    }

    /**
     * Look up stroke count for a single kanji character
     * @param {string} kanji - single kanji character
     * @returns {number|null} stroke count or null if not in table
     */
    function lookupStrokes(kanji) {
      const table = getStrokeTable();
      return table[kanji] !== undefined ? table[kanji] : null;
    }

    /**
     * Evaluate a single digit (0-9) for its phonetic associations
     * @param {number} digit - 0-9
     * @returns {object} evaluation including reading, auspiciousness, notes
     */
    function evaluateDigit(digit) {
      const info = DIGIT_INFO[digit];
      if (!info) return null;
      const result = {
        digit: digit,
        reading: cfg.includeOnReading ? info.onReading : info.kunReading,
        readings: info.readings,
        auspicious: info.auspicious,
        notes: info.notes
      };
      if (cfg.includeOnReading) {
        result.onReading = info.onReading;
        result.kunReading = info.kunReading;
      }
      return result;
    }

    /**
     * Seimei Handan (姓名判断) — Five-grid name-stroke numerology
     * @param {number[]} familyNameStrokes - stroke counts per character of family name
     * @param {number[]} givenNameStrokes - stroke counts per character of given name
     * @returns {object} the five grids with values and interpretations
     */
    function seimeiHandan(familyNameStrokes, givenNameStrokes) {
      if (!Array.isArray(familyNameStrokes) || !Array.isArray(givenNameStrokes)) {
        throw new Error('seimeiHandan requires arrays of stroke counts');
      }
      if (familyNameStrokes.length === 0 || givenNameStrokes.length === 0) {
        throw new Error('Both family name and given name must have at least one character');
      }

      const familyTotal = familyNameStrokes.reduce((a, b) => a + b, 0);
      const givenTotal = givenNameStrokes.reduce((a, b) => a + b, 0);
      const totalStrokes = familyTotal + givenTotal;

      // Last character of family name
      const lastFamily = familyNameStrokes[familyNameStrokes.length - 1];
      // First character of given name
      const firstGiven = givenNameStrokes[0];

      let tenkaku, chikaku;

      if (cfg.seimeiMethod === 'standard') {
        // Standard method: add 1 (仮成数) for single-char names
        tenkaku = familyTotal + 1;
        chikaku = givenTotal + 1;
      } else {
        // Simplified method: just use totals directly
        tenkaku = familyTotal;
        chikaku = givenTotal;
      }

      const jinkaku = lastFamily + firstGiven;
      const soukaku = totalStrokes;
      const gaikaku = soukaku - jinkaku + 2;

      return {
        tenkaku: {
          value: tenkaku,
          label: 'Tenkaku (天格, Heaven)',
          meaning: GRID_MEANINGS.tenkaku,
          luck: numberLuck(tenkaku)
        },
        jinkaku: {
          value: jinkaku,
          label: 'Jinkaku (人格, Person)',
          meaning: GRID_MEANINGS.jinkaku,
          luck: numberLuck(jinkaku)
        },
        chikaku: {
          value: chikaku,
          label: 'Chikaku (地格, Earth)',
          meaning: GRID_MEANINGS.chikaku,
          luck: numberLuck(chikaku)
        },
        gaikaku: {
          value: gaikaku,
          label: 'Gaikaku (外格, Outer)',
          meaning: GRID_MEANINGS.gaikaku,
          luck: numberLuck(gaikaku)
        },
        soukaku: {
          value: soukaku,
          label: 'Soukaku (総格, Total)',
          meaning: GRID_MEANINGS.soukaku,
          luck: numberLuck(soukaku)
        }
      };
    }

    /**
     * Calculate Rokuyo (六曜) for a given Gregorian date
     * Uses lunisolar approximation from DateUtils
     * @param {number} year - Gregorian year
     * @param {number} month - 1-12
     * @param {number} day - 1-31
     * @returns {object} Rokuyo day information
     */
    function rokuyo(year, month, day) {
      const lunar = DateUtils.approximateLunisolar(year, month, day);
      const index = (lunar.lunarMonth + lunar.lunarDay) % 6;
      return {
        ...ROKUYO_NAMES[index],
        index: index,
        lunarMonth: lunar.lunarMonth,
        lunarDay: lunar.lunarDay
      };
    }

    /**
     * Evaluate a gift amount for auspiciousness
     * Rules:
     *   - Amounts containing digit 4 or 9 are inauspicious
     *   - Wedding gifts should be odd multiples of 10,000 (odd man = indivisible union)
     *   - Funeral/condolence amounts should be even
     * @param {number} amount - gift amount in yen
     * @param {string} occasion - 'wedding' | 'funeral' | 'general'
     * @returns {object} evaluation
     */
    function evaluateGiftAmount(amount, occasion) {
      occasion = occasion || 'general';
      const digits = String(amount).split('').map(Number);
      const containsFour = digits.includes(4);
      const containsNine = digits.includes(9);
      const inauspiciousDigits = containsFour || containsNine;

      // Check the "man" unit (10,000 yen units) for odd/even
      const manUnit = Math.floor(amount / 10000);
      const isOddMan = manUnit % 2 !== 0;
      const isEvenMan = manUnit % 2 === 0;

      const warnings = [];
      let auspicious = true;

      if (containsFour) {
        warnings.push('Contains 4 (shi/死 = death)');
        auspicious = false;
      }
      if (containsNine) {
        warnings.push('Contains 9 (ku/苦 = suffering)');
        auspicious = false;
      }

      if (occasion === 'wedding') {
        if (isEvenMan && manUnit > 0) {
          warnings.push('Wedding gifts should be odd amounts (indivisible, symbolizing lasting union)');
          auspicious = false;
        }
      }

      if (occasion === 'funeral') {
        if (isOddMan) {
          warnings.push('Funeral/condolence amounts are traditionally even');
          auspicious = false;
        }
      }

      return {
        amount: amount,
        occasion: occasion,
        auspicious: auspicious,
        manUnit: manUnit,
        containsFour: containsFour,
        containsNine: containsNine,
        warnings: warnings
      };
    }

    /**
     * Analyze — convenience multi-purpose entry point
     */
    function analyze(input) {
      if (typeof input === 'number') {
        if (input >= 0 && input <= 9) {
          return evaluateDigit(input);
        }
        return { number: input, luck: numberLuck(input) };
      }
      return null;
    }

    return {
      evaluateDigit,
      seimeiHandan,
      rokuyo,
      evaluateGiftAmount,
      lookupStrokes,
      analyze,
      numberLuck
    };
  }

  return {
    create,
    DEFAULT_CONFIG,
    VARIANTS,
    DIGIT_INFO,
    ROKUYO_NAMES,
    KANJI_STROKES_TRADITIONAL,
    KANJI_STROKES_SIMPLIFIED,
    GRID_MEANINGS
  };
})();

if (typeof module !== 'undefined') module.exports = JapaneseShinto;
