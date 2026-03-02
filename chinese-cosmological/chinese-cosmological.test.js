const TestRunner = require('../shared/test-runner');
const ChineseCosmological = require('./chinese-cosmological');
const { describe, it, assertEqual, assertDeepEqual, assert } = TestRunner;

// ─── Phonetic Homophony ──────────────────────────────────────────────

describe('Chinese Cosmological — Phonetic Homophony', () => {
  const c = ChineseCosmological.create();

  it('evaluateDigit(8, "mandarin") → auspicious (fa = prosper)', () => {
    const r = c.evaluateDigit(8, 'mandarin');
    assertEqual(r.auspiciousness, 'auspicious');
    assert(r.meaning.indexOf('prosper') !== -1 || r.meaning.indexOf('wealth') !== -1,
      'meaning should reference prosperity');
  });

  it('evaluateDigit(4, "mandarin") → inauspicious (si = death)', () => {
    const r = c.evaluateDigit(4, 'mandarin');
    assertEqual(r.auspiciousness, 'inauspicious');
    assert(r.meaning.indexOf('death') !== -1, 'meaning should reference death');
  });

  it('evaluateDigit(9, "mandarin") → auspicious (jiu = long-lasting)', () => {
    const r = c.evaluateDigit(9, 'mandarin');
    assertEqual(r.auspiciousness, 'auspicious');
  });

  it('evaluateDigit(6, "mandarin") → auspicious (liu = smooth)', () => {
    const r = c.evaluateDigit(6, 'mandarin');
    assertEqual(r.auspiciousness, 'auspicious');
  });

  it('evaluateDigit(0, "mandarin") → neutral', () => {
    const r = c.evaluateDigit(0, 'mandarin');
    assertEqual(r.auspiciousness, 'neutral');
  });

  it('evaluateDigit(8, "cantonese") → auspicious (faat3 = prosperity)', () => {
    const r = c.evaluateDigit(8, 'cantonese');
    assertEqual(r.auspiciousness, 'auspicious');
    assertEqual(r.dialect, 'cantonese');
  });

  it('evaluateDigit(4, "cantonese") → inauspicious', () => {
    const r = c.evaluateDigit(4, 'cantonese');
    assertEqual(r.auspiciousness, 'inauspicious');
  });

  it('returns null for invalid digit', () => {
    assertEqual(c.evaluateDigit(10), null);
    assertEqual(c.evaluateDigit(-1), null);
  });

  it('returns all 10 digits (0-9) with valid data', () => {
    for (let d = 0; d <= 9; d++) {
      const r = c.evaluateDigit(d);
      assert(r !== null, 'digit ' + d + ' should return data');
      assertEqual(r.digit, d);
      assert(typeof r.pronunciation === 'string', 'should have pronunciation');
      assert(typeof r.meaning === 'string', 'should have meaning');
    }
  });
});

// ─── Multi-digit Phrase Reading ──────────────────────────────────────

describe('Chinese Cosmological — Multi-digit Phrases', () => {
  const c = ChineseCosmological.create();

  it('evaluateNumber(168) → auspicious (all the way to prosperity)', () => {
    const r = c.evaluateNumber(168);
    assertEqual(r.auspiciousness, 'auspicious');
    assert(r.phrase !== null, 'should have a phrase reading');
    assert(r.phrase.meaning.indexOf('prosperity') !== -1, 'meaning should mention prosperity');
  });

  it('evaluateNumber(514) → inauspicious (I will die)', () => {
    const r = c.evaluateNumber(514);
    assertEqual(r.auspiciousness, 'inauspicious');
    assert(r.phrase !== null, 'should have a phrase reading');
    assert(r.phrase.meaning.indexOf('die') !== -1, 'meaning should mention death');
  });

  it('evaluateNumber(888) → auspicious (triple prosperity)', () => {
    const r = c.evaluateNumber(888);
    assertEqual(r.auspiciousness, 'auspicious');
    assert(r.phrase !== null, 'should have phrase');
  });

  it('evaluateNumber(1314) → auspicious (forever)', () => {
    const r = c.evaluateNumber(1314);
    assertEqual(r.auspiciousness, 'auspicious');
    assert(r.phrase !== null, 'should have phrase');
  });

  it('evaluateNumber(250) → inauspicious (stupid)', () => {
    const r = c.evaluateNumber(250);
    assertEqual(r.auspiciousness, 'inauspicious');
    assert(r.phrase !== null, 'should have phrase');
  });

  it('evaluateNumber returns digits array with per-digit evaluations', () => {
    const r = c.evaluateNumber(168);
    assertEqual(r.digits.length, 3);
    assertEqual(r.digits[0].digit, 1);
    assertEqual(r.digits[1].digit, 6);
    assertEqual(r.digits[2].digit, 8);
  });

  it('evaluateNumber returns yin/yang balance', () => {
    const r = c.evaluateNumber(168);
    assert(r.yinYang !== undefined, 'should have yinYang');
    assert(typeof r.yinYang.yinCount === 'number', 'should have yinCount');
    assert(typeof r.yinYang.yangCount === 'number', 'should have yangCount');
  });

  it('evaluateNumber with no known phrase returns null phrase', () => {
    const r = c.evaluateNumber(237);
    assertEqual(r.phrase, null);
  });
});

// ─── Yin/Yang Classification ─────────────────────────────────────────

describe('Chinese Cosmological — Yin/Yang', () => {
  const c = ChineseCosmological.create();

  it('yinYang(3) → yang (odd)', () => {
    assertEqual(c.yinYang(3), 'yang');
  });

  it('yinYang(4) → yin (even)', () => {
    assertEqual(c.yinYang(4), 'yin');
  });

  it('yinYang(0) → yin (even)', () => {
    assertEqual(c.yinYang(0), 'yin');
  });

  it('yinYang(1) → yang (odd)', () => {
    assertEqual(c.yinYang(1), 'yang');
  });

  it('yinYang(9) → yang (odd)', () => {
    assertEqual(c.yinYang(9), 'yang');
  });

  it('yinYangBalance(168) → 1 yang, 2 yin → yin-dominant', () => {
    const b = c.yinYangBalance(168);
    assertEqual(b.yangCount, 1);
    assertEqual(b.yinCount, 2);
    assertEqual(b.balance, 'yin-dominant');
  });

  it('yinYangBalance(13) → 2 yang, 0 yin → yang-dominant', () => {
    const b = c.yinYangBalance(13);
    assertEqual(b.yangCount, 2);
    assertEqual(b.yinCount, 0);
    assertEqual(b.balance, 'yang-dominant');
  });

  it('yinYangBalance(12) → 1 yang, 1 yin → balanced', () => {
    const b = c.yinYangBalance(12);
    assertEqual(b.yangCount, 1);
    assertEqual(b.yinCount, 1);
    assertEqual(b.balance, 'balanced');
  });

  it('yinYangBalance(135) → 3 yang, 0 yin → yang-dominant', () => {
    const b = c.yinYangBalance(135);
    assertEqual(b.yangCount, 3);
    assertEqual(b.yinCount, 0);
    assertEqual(b.balance, 'yang-dominant');
  });
});

// ─── Wuxing (Five Phases) ────────────────────────────────────────────

describe('Chinese Cosmological — Wuxing', () => {
  it('wuxing with luoshu scheme: 1 → Water', () => {
    const c = ChineseCosmological.create({ wuxingScheme: 'luoshu' });
    assertEqual(c.wuxing(1).element, 'Water');
  });

  it('wuxing with luoshu scheme: 9 → Fire', () => {
    const c = ChineseCosmological.create({ wuxingScheme: 'luoshu' });
    assertEqual(c.wuxing(9).element, 'Fire');
  });

  it('wuxing with luoshu scheme: 3 → Wood', () => {
    const c = ChineseCosmological.create({ wuxingScheme: 'luoshu' });
    assertEqual(c.wuxing(3).element, 'Wood');
  });

  it('wuxing with hetu scheme: 1 → Water, 6 → Water', () => {
    const c = ChineseCosmological.create({ wuxingScheme: 'hetu' });
    assertEqual(c.wuxing(1).element, 'Water');
    assertEqual(c.wuxing(6).element, 'Water');
  });

  it('wuxing with hetu scheme: 2 → Fire, 7 → Fire', () => {
    const c = ChineseCosmological.create({ wuxingScheme: 'hetu' });
    assertEqual(c.wuxing(2).element, 'Fire');
    assertEqual(c.wuxing(7).element, 'Fire');
  });

  it('wuxing with hetu scheme: 3 → Wood, 8 → Wood', () => {
    const c = ChineseCosmological.create({ wuxingScheme: 'hetu' });
    assertEqual(c.wuxing(3).element, 'Wood');
    assertEqual(c.wuxing(8).element, 'Wood');
  });

  it('wuxing with hetu scheme: 4 → Metal, 9 → Metal', () => {
    const c = ChineseCosmological.create({ wuxingScheme: 'hetu' });
    assertEqual(c.wuxing(4).element, 'Metal');
    assertEqual(c.wuxing(9).element, 'Metal');
  });

  it('wuxing with hetu scheme: 0 → Earth, 5 → Earth', () => {
    const c = ChineseCosmological.create({ wuxingScheme: 'hetu' });
    assertEqual(c.wuxing(0).element, 'Earth');
    assertEqual(c.wuxing(5).element, 'Earth');
  });

  it('wuxing returns generation and overcoming cycles', () => {
    const c = ChineseCosmological.create();
    const w = c.wuxing(3);
    assertEqual(w.element, 'Wood');
    assertEqual(w.generates, 'Fire');
    assertEqual(w.overcomes, 'Earth');
  });

  it('wuxing uses last digit for multi-digit numbers', () => {
    const c = ChineseCosmological.create({ wuxingScheme: 'luoshu' });
    assertEqual(c.wuxing(18).element, c.wuxing(8).element);
    assertEqual(c.wuxing(23).element, c.wuxing(3).element);
  });
});

// ─── Luo Shu Magic Square ────────────────────────────────────────────

describe('Chinese Cosmological — Luo Shu Magic Square', () => {
  const c = ChineseCosmological.create();

  it('luoShu() → [[4,9,2],[3,5,7],[8,1,6]]', () => {
    const ls = c.luoShu();
    assertDeepEqual(ls.grid, [[4, 9, 2], [3, 5, 7], [8, 1, 6]]);
  });

  it('all rows sum to 15', () => {
    const ls = c.luoShu();
    for (let i = 0; i < 3; i++) {
      assertEqual(ls.rows[i], 15, 'row ' + i + ' should sum to 15');
    }
  });

  it('all columns sum to 15', () => {
    const ls = c.luoShu();
    for (let i = 0; i < 3; i++) {
      assertEqual(ls.cols[i], 15, 'col ' + i + ' should sum to 15');
    }
  });

  it('both diagonals sum to 15', () => {
    const ls = c.luoShu();
    assertEqual(ls.diagonals[0], 15, 'diagonal 1 should sum to 15');
    assertEqual(ls.diagonals[1], 15, 'diagonal 2 should sum to 15');
  });

  it('magic constant is 15', () => {
    const ls = c.luoShu();
    assertEqual(ls.constant, 15);
  });

  it('valid flag is true', () => {
    const ls = c.luoShu();
    assertEqual(ls.valid, true);
  });
});

// ─── I Ching: Trigrams ───────────────────────────────────────────────

describe('Chinese Cosmological — I Ching Trigrams', () => {
  const c = ChineseCosmological.create();

  it('trigramFromBinary([1,1,1]) → Qian/Heaven', () => {
    const t = c.trigramFromBinary([1, 1, 1]);
    assertEqual(t.name, 'Qian');
    assertEqual(t.english, 'Heaven');
  });

  it('trigramFromBinary([0,0,0]) → Kun/Earth', () => {
    const t = c.trigramFromBinary([0, 0, 0]);
    assertEqual(t.name, 'Kun');
    assertEqual(t.english, 'Earth');
  });

  it('trigramFromBinary([1,0,0]) → Zhen/Thunder', () => {
    const t = c.trigramFromBinary([1, 0, 0]);
    assertEqual(t.name, 'Zhen');
    assertEqual(t.english, 'Thunder');
  });

  it('trigramFromBinary([0,1,0]) → Kan/Water', () => {
    const t = c.trigramFromBinary([0, 1, 0]);
    assertEqual(t.name, 'Kan');
    assertEqual(t.english, 'Water');
  });

  it('trigramFromBinary([0,0,1]) → Gen/Mountain', () => {
    const t = c.trigramFromBinary([0, 0, 1]);
    assertEqual(t.name, 'Gen');
    assertEqual(t.english, 'Mountain');
  });

  it('trigramFromBinary([0,1,1]) → Xun/Wind', () => {
    const t = c.trigramFromBinary([0, 1, 1]);
    assertEqual(t.name, 'Xun');
    assertEqual(t.english, 'Wind');
  });

  it('trigramFromBinary([1,0,1]) → Li/Fire', () => {
    const t = c.trigramFromBinary([1, 0, 1]);
    assertEqual(t.name, 'Li');
    assertEqual(t.english, 'Fire');
  });

  it('trigramFromBinary([1,1,0]) → Dui/Lake', () => {
    const t = c.trigramFromBinary([1, 1, 0]);
    assertEqual(t.name, 'Dui');
    assertEqual(t.english, 'Lake');
  });

  it('each trigram has element and direction', () => {
    const trigrams = c.allTrigrams();
    assertEqual(trigrams.length, 8);
    for (const t of trigrams) {
      assert(typeof t.element === 'string', t.name + ' should have element');
      assert(typeof t.direction === 'string', t.name + ' should have direction');
      assert(Array.isArray(t.binary) && t.binary.length === 3, t.name + ' should have 3-bit binary');
    }
  });

  it('trigramFromBinary returns null for invalid input', () => {
    assertEqual(c.trigramFromBinary([1, 1]), null);
    assertEqual(c.trigramFromBinary(null), null);
  });
});

// ─── I Ching: Hexagrams ─────────────────────────────────────────────

describe('Chinese Cosmological — I Ching Hexagrams', () => {
  const c = ChineseCosmological.create();

  it('hexagram(1) → Qian, both trigrams are Qian/Heaven', () => {
    const h = c.hexagram(1);
    assertEqual(h.name, 'Qian');
    assertEqual(h.id, 1);
    assertEqual(h.lowerTrigram.name, 'Qian');
    assertEqual(h.upperTrigram.name, 'Qian');
  });

  it('hexagram(2) → Kun, both trigrams are Kun/Earth', () => {
    const h = c.hexagram(2);
    assertEqual(h.name, 'Kun');
    assertEqual(h.lowerTrigram.name, 'Kun');
    assertEqual(h.upperTrigram.name, 'Kun');
  });

  it('there are exactly 64 hexagrams', () => {
    const all = c.allHexagrams();
    assertEqual(all.length, 64);
  });

  it('each hexagram has id, name, and two trigrams', () => {
    const all = c.allHexagrams();
    for (const h of all) {
      assert(h.id >= 1 && h.id <= 64, 'id should be 1-64, got ' + h.id);
      assert(typeof h.name === 'string' && h.name.length > 0, 'should have name');
      assert(h.lowerTrigram !== null, 'hexagram ' + h.id + ' should have lower trigram');
      assert(h.upperTrigram !== null, 'hexagram ' + h.id + ' should have upper trigram');
    }
  });

  it('hexagram returns null for out of range', () => {
    assertEqual(c.hexagram(0), null);
    assertEqual(c.hexagram(65), null);
  });

  it('hexagramFromTrigrams([1,1,1], [1,1,1]) → hexagram 1 (Qian)', () => {
    const h = c.hexagramFromTrigrams([1, 1, 1], [1, 1, 1]);
    assertEqual(h.id, 1);
    assertEqual(h.name, 'Qian');
  });

  it('hexagramFromTrigrams([0,0,0], [0,0,0]) → hexagram 2 (Kun)', () => {
    const h = c.hexagramFromTrigrams([0, 0, 0], [0, 0, 0]);
    assertEqual(h.id, 2);
    assertEqual(h.name, 'Kun');
  });
});

// ─── I Ching: Divination ────────────────────────────────────────────

describe('Chinese Cosmological — I Ching Divination (Coins)', () => {
  const c = ChineseCosmological.create({ iChingMethod: 'coins' });

  it('generateHexagram produces valid hexagram ID (1-64)', () => {
    // Use deterministic RNG
    let callCount = 0;
    const values = [0.1, 0.3, 0.5, 0.8, 0.2, 0.6];
    const rng = function() { return values[callCount++ % values.length]; };
    const result = c.generateHexagram(rng);
    assert(result.primary !== null, 'should produce a primary hexagram');
    assert(result.primary.id >= 1 && result.primary.id <= 64, 'id should be 1-64');
    assertEqual(result.method, 'coins');
  });

  it('generateHexagram produces 6 lines', () => {
    let i = 0;
    const rng = function() { return (i++ * 0.15) % 1; };
    const result = c.generateHexagram(rng);
    assertEqual(result.lines.length, 6);
  });

  it('each line has value, type, line, and changing fields', () => {
    let i = 0;
    const rng = function() { return (i++ * 0.17) % 1; };
    const result = c.generateHexagram(rng);
    for (const line of result.lines) {
      assert(typeof line.value === 'number', 'should have numeric value');
      assert(typeof line.type === 'string', 'should have type string');
      assert(line.line === 0 || line.line === 1, 'line should be 0 or 1');
      assert(typeof line.changing === 'boolean', 'changing should be boolean');
    }
  });

  it('coin method line values are 6, 7, 8, or 9', () => {
    const validValues = [6, 7, 8, 9];
    let i = 0;
    const rng = function() { return (i++ * 0.23) % 1; };
    const result = c.generateHexagram(rng);
    for (const line of result.lines) {
      assert(validValues.indexOf(line.value) !== -1,
        'line value should be 6-9, got ' + line.value);
    }
  });

  it('changing lines produce a relating hexagram', () => {
    // Force all old yang (value 9, changing)
    const rng = function() { return 0.99; };
    const result = c.generateHexagram(rng);
    assert(result.relating !== null, 'should have relating hexagram when there are changing lines');
    assert(result.changingLines.length > 0, 'should report changing line positions');
  });

  it('no changing lines → relating is null', () => {
    // Force all young yang (value 7, not changing)
    const rng = function() { return 0.3; };
    const result = c.generateHexagram(rng);
    assertEqual(result.relating, null);
    assertEqual(result.changingLines.length, 0);
  });
});

describe('Chinese Cosmological — I Ching Divination (Yarrow)', () => {
  const c = ChineseCosmological.create({ iChingMethod: 'yarrow' });

  it('yarrow method produces valid hexagram', () => {
    let i = 0;
    const rng = function() { return (i++ * 0.15) % 1; };
    const result = c.generateHexagram(rng);
    assertEqual(result.method, 'yarrow');
    assert(result.primary !== null, 'should produce primary hexagram');
    assert(result.primary.id >= 1 && result.primary.id <= 64, 'id should be 1-64');
  });

  it('yarrow old yin (r < 1/16) produces value 6', () => {
    const rng = function() { return 0.05; }; // 0.05 < 1/16 = 0.0625
    const result = c.generateHexagram(rng);
    for (const line of result.lines) {
      assertEqual(line.value, 6);
      assertEqual(line.type, 'old yin');
      assertEqual(line.changing, true);
    }
  });

  it('yarrow young yang (1/16 <= r < 6/16) produces value 7', () => {
    const rng = function() { return 0.1; }; // 0.1 > 1/16=0.0625, < 6/16=0.375
    const result = c.generateHexagram(rng);
    for (const line of result.lines) {
      assertEqual(line.value, 7);
      assertEqual(line.type, 'young yang');
      assertEqual(line.changing, false);
    }
  });

  it('yarrow young yin (6/16 <= r < 13/16) produces value 8', () => {
    const rng = function() { return 0.5; }; // 0.5 > 6/16=0.375, < 13/16=0.8125
    const result = c.generateHexagram(rng);
    for (const line of result.lines) {
      assertEqual(line.value, 8);
      assertEqual(line.type, 'young yin');
      assertEqual(line.changing, false);
    }
  });

  it('yarrow old yang (r >= 13/16) produces value 9', () => {
    const rng = function() { return 0.9; }; // 0.9 > 13/16=0.8125
    const result = c.generateHexagram(rng);
    for (const line of result.lines) {
      assertEqual(line.value, 9);
      assertEqual(line.type, 'old yang');
      assertEqual(line.changing, true);
    }
  });
});

// ─── Auspiciousness Scoring ──────────────────────────────────────────

describe('Chinese Cosmological — Auspiciousness Scoring', () => {
  const c = ChineseCosmological.create();

  it('auspiciousnessScore(888) → auspicious', () => {
    const r = c.auspiciousnessScore(888);
    assertEqual(r.auspiciousness, 'auspicious');
  });

  it('auspiciousnessScore(444) → inauspicious', () => {
    const r = c.auspiciousnessScore(444);
    assertEqual(r.auspiciousness, 'inauspicious');
  });

  it('auspiciousnessScore returns score as number', () => {
    const r = c.auspiciousnessScore(168);
    assert(typeof r.score === 'number', 'score should be a number');
  });
});

// ─── Configuration & Presets ─────────────────────────────────────────

describe('Chinese Cosmological — Configuration & Presets', () => {
  it('default config uses mandarin, luoshu, coins, folk', () => {
    assertDeepEqual(ChineseCosmological.DEFAULT_CONFIG, {
      dialect: 'mandarin',
      wuxingScheme: 'luoshu',
      iChingMethod: 'coins',
      evaluationStrictness: 'folk'
    });
  });

  it('folk preset', () => {
    const c = ChineseCosmological.create('folk');
    const r = c.evaluateDigit(8);
    assertEqual(r.dialect, 'mandarin');
    assertEqual(r.auspiciousness, 'auspicious');
  });

  it('classical preset uses hetu and yarrow', () => {
    const cfg = ChineseCosmological.VARIANTS.classical;
    assertEqual(cfg.wuxingScheme, 'hetu');
    assertEqual(cfg.iChingMethod, 'yarrow');
    assertEqual(cfg.evaluationStrictness, 'classical');
  });

  it('cantonese preset uses cantonese dialect', () => {
    const c = ChineseCosmological.create('cantonese');
    const r = c.evaluateDigit(8);
    assertEqual(r.dialect, 'cantonese');
    assertEqual(r.auspiciousness, 'auspicious');
  });

  it('fengShui preset uses laterHeaven and classical strictness', () => {
    const cfg = ChineseCosmological.VARIANTS.fengShui;
    assertEqual(cfg.wuxingScheme, 'laterHeaven');
    assertEqual(cfg.evaluationStrictness, 'classical');
  });

  it('custom config overrides defaults', () => {
    const c = ChineseCosmological.create({ dialect: 'cantonese', wuxingScheme: 'hetu' });
    const d = c.evaluateDigit(8);
    assertEqual(d.dialect, 'cantonese');
    const w = c.wuxing(8);
    assertEqual(w.scheme, 'hetu');
    assertEqual(w.element, 'Wood'); // hetu: 8 → Wood
  });
});

// ─── Static Data Exports ─────────────────────────────────────────────

describe('Chinese Cosmological — Static Data Exports', () => {
  it('exports DIGIT_DATA for all 10 digits', () => {
    for (let d = 0; d <= 9; d++) {
      assert(ChineseCosmological.DIGIT_DATA[d] !== undefined, 'should have digit ' + d);
    }
  });

  it('exports TRIGRAMS with 8 entries', () => {
    assertEqual(ChineseCosmological.TRIGRAMS.length, 8);
  });

  it('exports HEXAGRAM_NAMES with 64 entries', () => {
    assertEqual(ChineseCosmological.HEXAGRAM_NAMES.length, 64);
  });

  it('exports LUO_SHU_GRID', () => {
    assertDeepEqual(ChineseCosmological.LUO_SHU_GRID, [[4, 9, 2], [3, 5, 7], [8, 1, 6]]);
  });

  it('exports WUXING_ELEMENTS with 5 entries', () => {
    assertEqual(ChineseCosmological.WUXING_ELEMENTS.length, 5);
    assertDeepEqual(ChineseCosmological.WUXING_ELEMENTS, ['Wood', 'Fire', 'Earth', 'Metal', 'Water']);
  });
});

const result = TestRunner.runAll();
if (typeof process !== 'undefined') process.exit(result.failed > 0 ? 1 : 0);
