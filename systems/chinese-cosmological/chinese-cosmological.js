/**
 * Libernumerus — Chinese Cosmological Numerology
 * Phonetic homophony, Yin/Yang, Wuxing (Five Phases), Luo Shu magic square,
 * I Ching trigrams/hexagrams, auspiciousness scoring
 */

const ChineseCosmological = (() => {

  // ─── Phonetic Homophony Data ───────────────────────────────────────

  const DIGIT_DATA = {
    0: {
      mandarin: { pinyin: 'ling', tone: 2, homophones: [{ word: 'ling', meaning: 'zero / nothing', auspiciousness: 'neutral' }] },
      cantonese: { jyutping: 'ling4', homophones: [{ word: 'ling4', meaning: 'zero', auspiciousness: 'neutral' }] }
    },
    1: {
      mandarin: { pinyin: 'yi', tone: 1, homophones: [{ word: 'yao', meaning: 'want / will', auspiciousness: 'positive' }] },
      cantonese: { jyutping: 'jat1', homophones: [{ word: 'jat1', meaning: 'certainly', auspiciousness: 'positive' }] }
    },
    2: {
      mandarin: { pinyin: 'er', tone: 4, homophones: [{ word: 'ai', meaning: 'love', auspiciousness: 'positive' }] },
      cantonese: { jyutping: 'ji6', homophones: [{ word: 'ji6', meaning: 'easy', auspiciousness: 'positive' }] }
    },
    3: {
      mandarin: { pinyin: 'san', tone: 1, homophones: [{ word: 'sheng', meaning: 'life / birth', auspiciousness: 'positive' }] },
      cantonese: { jyutping: 'saam1', homophones: [{ word: 'saam1', meaning: 'life', auspiciousness: 'positive' }] }
    },
    4: {
      mandarin: { pinyin: 'si', tone: 4, homophones: [{ word: 'si', meaning: 'death', auspiciousness: 'inauspicious' }] },
      cantonese: { jyutping: 'sei3', homophones: [{ word: 'sei2', meaning: 'death', auspiciousness: 'inauspicious' }] }
    },
    5: {
      mandarin: { pinyin: 'wu', tone: 3, homophones: [{ word: 'wu', meaning: 'I / me', auspiciousness: 'neutral' }] },
      cantonese: { jyutping: 'ng5', homophones: [{ word: 'ng5', meaning: 'not', auspiciousness: 'neutral' }] }
    },
    6: {
      mandarin: { pinyin: 'liu', tone: 4, homophones: [{ word: 'liu', meaning: 'flow / smooth', auspiciousness: 'auspicious' }] },
      cantonese: { jyutping: 'luk6', homophones: [{ word: 'luk6', meaning: 'prosperity', auspiciousness: 'auspicious' }] }
    },
    7: {
      mandarin: { pinyin: 'qi', tone: 1, homophones: [{ word: 'qi', meaning: 'vital energy / togetherness', auspiciousness: 'neutral' }] },
      cantonese: { jyutping: 'cat1', homophones: [{ word: 'cat1', meaning: 'certainty', auspiciousness: 'neutral' }] }
    },
    8: {
      mandarin: { pinyin: 'ba', tone: 1, homophones: [{ word: 'fa', meaning: 'prosper / wealth', auspiciousness: 'auspicious' }] },
      cantonese: { jyutping: 'baat3', homophones: [{ word: 'faat3', meaning: 'prosperity', auspiciousness: 'auspicious' }] }
    },
    9: {
      mandarin: { pinyin: 'jiu', tone: 3, homophones: [{ word: 'jiu', meaning: 'long-lasting / eternity', auspiciousness: 'auspicious' }] },
      cantonese: { jyutping: 'gau2', homophones: [{ word: 'gau2', meaning: 'longevity', auspiciousness: 'auspicious' }] }
    }
  };

  // ─── Multi-digit Phrase Readings ───────────────────────────────────

  const PHRASE_READINGS = {
    '168': { meaning: 'all the way to prosperity', auspiciousness: 'auspicious', reading: 'yi lu fa' },
    '514': { meaning: 'I will die', auspiciousness: 'inauspicious', reading: 'wu yao si' },
    '888': { meaning: 'triple prosperity', auspiciousness: 'auspicious', reading: 'fa fa fa' },
    '1314': { meaning: 'one life one world / forever', auspiciousness: 'auspicious', reading: 'yi sheng yi si' },
    '250': { meaning: 'stupid / idiot', auspiciousness: 'inauspicious', reading: 'er bai wu' },
    '520': { meaning: 'I love you', auspiciousness: 'auspicious', reading: 'wu er ling' },
    '666': { meaning: 'everything goes smoothly', auspiciousness: 'auspicious', reading: 'liu liu liu' },
    '518': { meaning: 'I will prosper', auspiciousness: 'auspicious', reading: 'wu yao fa' },
    '748': { meaning: 'go die', auspiciousness: 'inauspicious', reading: 'qi si ba' },
    '1388': { meaning: 'prosperity for a lifetime', auspiciousness: 'auspicious', reading: 'yi sheng fa fa' },
    '4': { meaning: 'death', auspiciousness: 'inauspicious', reading: 'si' },
    '44': { meaning: 'double death', auspiciousness: 'inauspicious', reading: 'si si' },
    '74': { meaning: 'certainly dead', auspiciousness: 'inauspicious', reading: 'qi si' },
    '13': { meaning: 'certainly live', auspiciousness: 'auspicious', reading: 'yi sheng' },
    '99': { meaning: 'doubly long-lasting', auspiciousness: 'auspicious', reading: 'jiu jiu' }
  };

  // ─── Wuxing (Five Phases) ─────────────────────────────────────────

  const WUXING_ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

  // He Tu cosmological number-element mapping (pairs):
  // 1,6 = Water; 2,7 = Fire; 3,8 = Wood; 4,9 = Metal; 5,0 = Earth
  const WUXING_HETU = { 0: 'Earth', 1: 'Water', 2: 'Fire', 3: 'Wood', 4: 'Metal', 5: 'Earth', 6: 'Water', 7: 'Fire', 8: 'Wood', 9: 'Metal' };

  // Luo Shu: based on Luo Shu magic square positions
  // 1 = Water, 2 = Earth, 3 = Wood, 4 = Wood, 5 = Earth, 6 = Metal, 7 = Metal, 8 = Earth, 9 = Fire, 0 = Earth
  const WUXING_LUOSHU = { 0: 'Earth', 1: 'Water', 2: 'Earth', 3: 'Wood', 4: 'Wood', 5: 'Earth', 6: 'Metal', 7: 'Metal', 8: 'Earth', 9: 'Fire' };

  // Later Heaven (Hou Tian Ba Gua) arrangement
  // 1 = Water (Kan), 2 = Earth (Kun), 3 = Wood (Zhen), 4 = Wood (Xun), 5 = Earth (center),
  // 6 = Metal (Qian), 7 = Metal (Dui), 8 = Earth (Gen), 9 = Fire (Li), 0 = Earth
  const WUXING_LATER_HEAVEN = { 0: 'Earth', 1: 'Water', 2: 'Earth', 3: 'Wood', 4: 'Wood', 5: 'Earth', 6: 'Metal', 7: 'Metal', 8: 'Earth', 9: 'Fire' };

  const WUXING_SCHEMES = {
    hetu: WUXING_HETU,
    luoshu: WUXING_LUOSHU,
    laterHeaven: WUXING_LATER_HEAVEN
  };

  // Wuxing generation (sheng) and overcoming (ke) cycles
  const WUXING_GENERATION = { Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood' };
  const WUXING_OVERCOMING = { Wood: 'Earth', Earth: 'Water', Water: 'Fire', Fire: 'Metal', Metal: 'Wood' };

  // ─── Luo Shu Magic Square ─────────────────────────────────────────

  const LUO_SHU_GRID = [[4, 9, 2], [3, 5, 7], [8, 1, 6]];
  const LUO_SHU_CONSTANT = 15;

  // ─── I Ching: Trigrams ─────────────────────────────────────────────

  const TRIGRAMS = [
    { binary: [1, 1, 1], name: 'Qian',  english: 'Heaven',  element: 'Metal',  direction: 'South',     number: 1 },
    { binary: [0, 0, 0], name: 'Kun',   english: 'Earth',   element: 'Earth',  direction: 'North',     number: 8 },
    { binary: [1, 0, 0], name: 'Zhen',  english: 'Thunder', element: 'Wood',   direction: 'Northeast', number: 4 },
    { binary: [0, 1, 0], name: 'Kan',   english: 'Water',   element: 'Water',  direction: 'West',      number: 6 },
    { binary: [0, 0, 1], name: 'Gen',   english: 'Mountain', element: 'Earth', direction: 'Northwest', number: 7 },
    { binary: [0, 1, 1], name: 'Xun',   english: 'Wind',    element: 'Wood',   direction: 'Southwest', number: 5 },
    { binary: [1, 0, 1], name: 'Li',    english: 'Fire',    element: 'Fire',   direction: 'East',      number: 3 },
    { binary: [1, 1, 0], name: 'Dui',   english: 'Lake',    element: 'Metal',  direction: 'Southeast', number: 2 }
  ];

  // Build lookup from binary key
  const TRIGRAM_LOOKUP = {};
  for (const t of TRIGRAMS) {
    TRIGRAM_LOOKUP[t.binary.join('')] = t;
  }

  // ─── I Ching: 64 Hexagrams ────────────────────────────────────────

  const HEXAGRAM_NAMES = [
    'Qian', 'Kun', 'Zhun', 'Meng', 'Xu', 'Song', 'Shi', 'Bi',
    'Xiao Chu', 'Lu', 'Tai', 'Pi', 'Tong Ren', 'Da You', 'Qian (Modesty)', 'Yu',
    'Sui', 'Gu', 'Lin', 'Guan', 'Shi He', 'Bi (Grace)', 'Bo', 'Fu',
    'Wu Wang', 'Da Chu', 'Yi (Nourishing)', 'Da Guo', 'Kan (Water)', 'Li (Fire)', 'Xian', 'Heng',
    'Dun', 'Da Zhuang', 'Jin', 'Ming Yi', 'Jia Ren', 'Kui', 'Jian', 'Jie (Liberation)',
    'Sun (Decrease)', 'Yi (Increase)', 'Guai', 'Gou', 'Cui', 'Sheng', 'Kun (Exhaustion)', 'Jing',
    'Ge', 'Ding', 'Zhen (Thunder)', 'Gen (Mountain)', 'Jian (Gradual)', 'Gui Mei', 'Feng', 'Lu (Traveler)',
    'Xun (Wind)', 'Dui (Lake)', 'Huan', 'Jie (Regulation)', 'Zhong Fu', 'Xiao Guo', 'Ji Ji', 'Wei Ji'
  ];

  // King Wen sequence: upper and lower trigram indices for each hexagram (1-64)
  // Each entry: [lower trigram binary, upper trigram binary]
  const HEXAGRAM_TRIGRAMS = buildHexagramTrigrams();

  function buildHexagramTrigrams() {
    // King Wen sequence of hexagram line patterns (bottom to top)
    // Each hexagram is 6 lines; lower 3 = lower trigram, upper 3 = upper trigram
    const kingWenLines = [
      [1,1,1,1,1,1], [0,0,0,0,0,0], [1,0,0,0,1,0], [0,1,0,0,0,1],
      [1,1,1,0,1,0], [0,1,0,1,1,1], [0,1,0,0,0,0], [0,0,0,0,1,0],
      [1,1,1,0,1,1], [1,1,0,1,1,1], [1,1,1,0,0,0], [0,0,0,1,1,1],
      [1,0,1,1,1,1], [1,1,1,1,0,1], [0,0,1,0,0,0], [0,0,0,1,0,0],
      [1,0,0,1,1,0], [0,1,1,0,0,1], [1,1,0,0,0,0], [0,0,0,0,1,1],
      [1,0,0,1,0,1], [1,0,1,0,0,1], [0,0,0,0,0,1], [1,0,0,0,0,0],
      [1,0,0,1,1,1], [1,1,1,0,0,1], [1,0,0,0,0,1], [0,1,1,1,1,0],
      [0,1,0,0,1,0], [1,0,1,1,0,1], [0,0,1,1,1,0], [0,1,1,1,0,0],
      [0,0,1,1,1,1], [1,1,1,1,0,0], [0,0,0,1,0,1], [1,0,1,0,0,0],
      [1,0,1,0,1,1], [1,1,0,1,0,1], [0,0,1,0,1,0], [0,1,0,1,0,0],
      [1,1,0,0,0,1], [1,0,0,0,1,1], [1,1,1,1,1,0], [0,1,1,1,1,1],
      [0,0,0,1,1,0], [0,1,1,0,0,0], [0,1,0,1,1,0], [0,1,1,0,1,0],
      [1,0,1,1,1,0], [0,1,1,1,0,1], [1,0,0,1,0,0], [0,0,1,0,0,1],
      [0,0,1,0,1,1], [1,1,0,1,0,0], [1,0,1,1,0,0], [0,0,1,1,0,1],
      [0,1,1,0,1,1], [1,1,0,1,1,0], [0,1,0,0,1,1], [1,1,0,0,1,0],
      [1,1,0,0,1,1], [0,0,1,1,0,0], [1,0,1,0,1,0], [0,1,0,1,0,1]
    ];

    const result = [];
    for (let i = 0; i < 64; i++) {
      const lines = kingWenLines[i];
      const lower = [lines[0], lines[1], lines[2]];
      const upper = [lines[3], lines[4], lines[5]];
      result.push({ lower: lower, upper: upper });
    }
    return result;
  }

  // ─── Auspiciousness Scoring Helpers ────────────────────────────────

  const DIGIT_AUSPICIOUSNESS_SCORE = {
    'auspicious': 2,
    'positive': 1,
    'neutral': 0,
    'inauspicious': -2
  };

  // ─── Configuration ────────────────────────────────────────────────

  const DEFAULT_CONFIG = {
    dialect: 'mandarin',
    wuxingScheme: 'luoshu',
    iChingMethod: 'coins',
    evaluationStrictness: 'folk'
  };

  const VARIANTS = {
    folk: { dialect: 'mandarin', wuxingScheme: 'luoshu', iChingMethod: 'coins', evaluationStrictness: 'folk' },
    classical: { dialect: 'mandarin', wuxingScheme: 'hetu', iChingMethod: 'yarrow', evaluationStrictness: 'classical' },
    cantonese: { dialect: 'cantonese', wuxingScheme: 'luoshu', iChingMethod: 'coins', evaluationStrictness: 'folk' },
    fengShui: { dialect: 'mandarin', wuxingScheme: 'laterHeaven', iChingMethod: 'coins', evaluationStrictness: 'classical' }
  };

  // ─── Factory ───────────────────────────────────────────────────────

  function create(config) {
    if (typeof config === 'string' && VARIANTS[config]) {
      config = { ...VARIANTS[config] };
    }
    const cfg = { ...DEFAULT_CONFIG, ...(config || {}) };

    // ── Phonetic Homophony ──

    function evaluateDigit(digit, dialect) {
      const d = typeof digit === 'number' ? digit : parseInt(digit, 10);
      if (d < 0 || d > 9 || isNaN(d)) return null;
      const data = DIGIT_DATA[d];
      const lang = dialect || cfg.dialect;
      const langData = data[lang];
      if (!langData) return null;
      const primaryHomophone = langData.homophones[0];
      return {
        digit: d,
        dialect: lang,
        pronunciation: lang === 'mandarin' ? langData.pinyin : langData.jyutping,
        homophones: langData.homophones,
        meaning: primaryHomophone.meaning,
        auspiciousness: primaryHomophone.auspiciousness
      };
    }

    // ── Multi-digit Phrase Reading ──

    function evaluateNumber(n) {
      const str = String(n);
      const digits = str.split('').map(Number);

      // Check for known phrase readings
      const phrase = PHRASE_READINGS[str] || null;

      // Per-digit evaluation
      const digitEvals = digits.map(function(d) { return evaluateDigit(d); });

      // Compute overall score from digits
      let totalScore = 0;
      for (const ev of digitEvals) {
        if (ev) {
          totalScore += DIGIT_AUSPICIOUSNESS_SCORE[ev.auspiciousness] || 0;
        }
      }

      // Phrase bonus/penalty
      if (phrase) {
        if (phrase.auspiciousness === 'auspicious') totalScore += 3;
        if (phrase.auspiciousness === 'inauspicious') totalScore -= 3;
      }

      // Positional factors (8 at end is extra lucky; 4 at end is extra unlucky)
      const lastDigit = digits[digits.length - 1];
      if (lastDigit === 8) totalScore += 1;
      if (lastDigit === 4) totalScore -= 1;

      // Yin/Yang balance factor (classical strictness)
      if (cfg.evaluationStrictness === 'classical') {
        const balance = yinYangBalance(n);
        // Balanced numbers get a small bonus
        if (Math.abs(balance.yinCount - balance.yangCount) <= 1) {
          totalScore += 1;
        }
      }

      let overallAuspiciousness;
      if (totalScore >= 2) overallAuspiciousness = 'auspicious';
      else if (totalScore <= -2) overallAuspiciousness = 'inauspicious';
      else overallAuspiciousness = 'neutral';

      return {
        number: n,
        digits: digitEvals,
        phrase: phrase,
        score: totalScore,
        auspiciousness: overallAuspiciousness,
        yinYang: yinYangBalance(n)
      };
    }

    // ── Yin/Yang Classification ──

    function yinYang(n) {
      const num = typeof n === 'number' ? n : parseInt(n, 10);
      if (num < 0 || num > 9 || isNaN(num)) {
        // For multi-digit, classify the entire number
        return num % 2 === 0 ? 'yin' : 'yang';
      }
      return num % 2 === 0 ? 'yin' : 'yang';
    }

    function yinYangBalance(n) {
      const digits = String(n).split('').map(Number);
      let yinCount = 0;
      let yangCount = 0;
      for (const d of digits) {
        if (d % 2 === 0) yinCount++;
        else yangCount++;
      }
      let balance;
      if (yinCount === yangCount) balance = 'balanced';
      else if (yinCount > yangCount) balance = 'yin-dominant';
      else balance = 'yang-dominant';
      return { yinCount: yinCount, yangCount: yangCount, balance: balance };
    }

    // ── Wuxing (Five Phases) ──

    function wuxing(n) {
      const scheme = WUXING_SCHEMES[cfg.wuxingScheme] || WUXING_SCHEMES.luoshu;
      const d = typeof n === 'number' ? n : parseInt(n, 10);
      if (isNaN(d)) return null;
      // Use last digit for element assignment
      const lastDigit = Math.abs(d) % 10;
      const element = scheme[lastDigit];
      return {
        number: d,
        lastDigit: lastDigit,
        element: element,
        generates: WUXING_GENERATION[element],
        overcomes: WUXING_OVERCOMING[element],
        scheme: cfg.wuxingScheme
      };
    }

    // ── Luo Shu Magic Square ──

    function luoShu() {
      const grid = LUO_SHU_GRID.map(function(row) { return row.slice(); });
      const rows = grid.map(function(row) { return row.reduce(function(a, b) { return a + b; }, 0); });
      const cols = [0, 1, 2].map(function(c) { return grid[0][c] + grid[1][c] + grid[2][c]; });
      const diag1 = grid[0][0] + grid[1][1] + grid[2][2];
      const diag2 = grid[0][2] + grid[1][1] + grid[2][0];
      return {
        grid: grid,
        constant: LUO_SHU_CONSTANT,
        rows: rows,
        cols: cols,
        diagonals: [diag1, diag2],
        valid: rows.every(function(s) { return s === LUO_SHU_CONSTANT; }) &&
               cols.every(function(s) { return s === LUO_SHU_CONSTANT; }) &&
               diag1 === LUO_SHU_CONSTANT && diag2 === LUO_SHU_CONSTANT
      };
    }

    // ── I Ching: Trigrams ──

    function trigramFromBinary(bits) {
      if (!Array.isArray(bits) || bits.length !== 3) return null;
      const key = bits.join('');
      return TRIGRAM_LOOKUP[key] || null;
    }

    function allTrigrams() {
      return TRIGRAMS.slice();
    }

    // ── I Ching: Hexagrams ──

    function hexagram(id) {
      if (id < 1 || id > 64) return null;
      const idx = id - 1;
      const trig = HEXAGRAM_TRIGRAMS[idx];
      return {
        id: id,
        name: HEXAGRAM_NAMES[idx],
        lowerTrigram: trigramFromBinary(trig.lower),
        upperTrigram: trigramFromBinary(trig.upper),
        lines: trig.lower.concat(trig.upper)
      };
    }

    function hexagramFromTrigrams(lowerBinary, upperBinary) {
      const lKey = lowerBinary.join('');
      const uKey = upperBinary.join('');
      for (let i = 0; i < 64; i++) {
        const t = HEXAGRAM_TRIGRAMS[i];
        if (t.lower.join('') === lKey && t.upper.join('') === uKey) {
          return hexagram(i + 1);
        }
      }
      return null;
    }

    function allHexagrams() {
      const result = [];
      for (let i = 1; i <= 64; i++) {
        result.push(hexagram(i));
      }
      return result;
    }

    // ── I Ching: Divination Methods ──

    // Coin toss method: 3 coins, heads=3, tails=2
    // Probabilities: 6 (old yin) = 2/8, 7 (young yang) = 2/8, 8 (young yin) = 2/8, 9 (old yang) = 2/8
    // Wait -- standard coin probabilities:
    // sum=6 (TTT): 1/8  →  old yin
    // sum=7 (TTH, THT, HTT): 3/8  →  young yang
    // sum=8 (THH, HTH, HHT): 3/8  →  young yin
    // sum=9 (HHH): 1/8  →  old yang
    // But requirements say P(old yin)=2/8, P(old yang)=2/8
    // We'll use the requirement's stated probabilities for the generation.
    function coinTossLine(rng) {
      // P(old yin=6) = 2/8, P(young yang=7) = 2/8, P(young yin=8) = 2/8, P(old yang=9) = 2/8
      const r = rng();
      if (r < 0.25) return { value: 6, type: 'old yin', line: 0, changing: true };
      if (r < 0.50) return { value: 7, type: 'young yang', line: 1, changing: false };
      if (r < 0.75) return { value: 8, type: 'young yin', line: 0, changing: false };
      return { value: 9, type: 'old yang', line: 1, changing: true };
    }

    // Yarrow stalk method: different probability distribution
    // P(old yin=6) = 1/16, P(young yang=7) = 5/16, P(young yin=8) = 7/16, P(old yang=9) = 3/16
    function yarrowStalkLine(rng) {
      const r = rng();
      if (r < 1 / 16) return { value: 6, type: 'old yin', line: 0, changing: true };
      if (r < 6 / 16) return { value: 7, type: 'young yang', line: 1, changing: false };
      if (r < 13 / 16) return { value: 8, type: 'young yin', line: 0, changing: false };
      return { value: 9, type: 'old yang', line: 1, changing: true };
    }

    function generateHexagram(rng) {
      const rngFn = rng || Math.random;
      const lineFn = cfg.iChingMethod === 'yarrow' ? yarrowStalkLine : coinTossLine;
      const lines = [];
      for (let i = 0; i < 6; i++) {
        lines.push(lineFn(rngFn));
      }
      const lowerBinary = [lines[0].line, lines[1].line, lines[2].line];
      const upperBinary = [lines[3].line, lines[4].line, lines[5].line];
      const primary = hexagramFromTrigrams(lowerBinary, upperBinary);

      // Relating hexagram (changing lines flipped)
      const hasChanging = lines.some(function(l) { return l.changing; });
      let relating = null;
      if (hasChanging) {
        const relatingLines = lines.map(function(l) {
          return l.changing ? (l.line === 0 ? 1 : 0) : l.line;
        });
        const relLower = [relatingLines[0], relatingLines[1], relatingLines[2]];
        const relUpper = [relatingLines[3], relatingLines[4], relatingLines[5]];
        relating = hexagramFromTrigrams(relLower, relUpper);
      }

      return {
        lines: lines,
        primary: primary,
        relating: relating,
        method: cfg.iChingMethod,
        changingLines: lines.reduce(function(acc, l, i) {
          if (l.changing) acc.push(i + 1);
          return acc;
        }, [])
      };
    }

    // ── Auspiciousness Scoring ──

    function auspiciousnessScore(n) {
      return evaluateNumber(n);
    }

    return {
      evaluateDigit: evaluateDigit,
      evaluateNumber: evaluateNumber,
      yinYang: yinYang,
      yinYangBalance: yinYangBalance,
      wuxing: wuxing,
      luoShu: luoShu,
      trigramFromBinary: trigramFromBinary,
      allTrigrams: allTrigrams,
      hexagram: hexagram,
      hexagramFromTrigrams: hexagramFromTrigrams,
      allHexagrams: allHexagrams,
      generateHexagram: generateHexagram,
      auspiciousnessScore: auspiciousnessScore
    };
  }

  return {
    create: create,
    DEFAULT_CONFIG: DEFAULT_CONFIG,
    VARIANTS: VARIANTS,
    DIGIT_DATA: DIGIT_DATA,
    PHRASE_READINGS: PHRASE_READINGS,
    TRIGRAMS: TRIGRAMS,
    HEXAGRAM_NAMES: HEXAGRAM_NAMES,
    LUO_SHU_GRID: LUO_SHU_GRID,
    WUXING_ELEMENTS: WUXING_ELEMENTS
  };
})();

if (typeof module !== 'undefined') module.exports = ChineseCosmological;
