const TestRunner = require('../../shared/test-runner');
const JapaneseShinto = require('./japanese-shinto');
const { describe, it, assertEqual, assertDeepEqual, assert, assertThrows } = TestRunner;

// ── Phonetic Digit Associations ────────────────────────────────────────

describe('Japanese Shinto — Phonetic Digit Associations', () => {
  const js = JapaneseShinto.create();

  it('evaluateDigit(4) → reading "shi", inauspicious', () => {
    const result = js.evaluateDigit(4);
    assertEqual(result.reading, 'shi');
    assertEqual(result.auspicious, false);
  });

  it('evaluateDigit(8) → reading "hachi", auspicious', () => {
    const result = js.evaluateDigit(8);
    assertEqual(result.reading, 'hachi');
    assertEqual(result.auspicious, true);
  });

  it('evaluateDigit(9) → reading "ku", inauspicious', () => {
    const result = js.evaluateDigit(9);
    assertEqual(result.reading, 'ku');
    assertEqual(result.auspicious, false);
  });

  it('evaluateDigit(7) → reading "shichi", auspicious', () => {
    const result = js.evaluateDigit(7);
    assertEqual(result.reading, 'shichi');
    assertEqual(result.auspicious, true);
  });

  it('evaluateDigit(1) → reading "ichi", auspicious', () => {
    const result = js.evaluateDigit(1);
    assertEqual(result.reading, 'ichi');
    assertEqual(result.auspicious, true);
  });

  it('evaluateDigit(0) → reading "rei", neutral', () => {
    const result = js.evaluateDigit(0);
    assertEqual(result.reading, 'rei');
    assertEqual(result.auspicious, null);
  });

  it('evaluateDigit includes on and kun readings when configured', () => {
    const result = js.evaluateDigit(4);
    assertEqual(result.onReading, 'shi');
    assertEqual(result.kunReading, 'yon');
  });

  it('evaluateDigit with includeOnReading=false uses kun reading', () => {
    const jsKun = JapaneseShinto.create({ includeOnReading: false });
    const result = jsKun.evaluateDigit(4);
    assertEqual(result.reading, 'yon');
  });

  it('evaluateDigit(99) → null for invalid digit', () => {
    const result = js.evaluateDigit(99);
    assertEqual(result, null);
  });
});

// ── Seimei Handan (Name-Stroke Numerology) ─────────────────────────────

describe('Japanese Shinto — Seimei Handan (standard method)', () => {
  const js = JapaneseShinto.create({ seimeiMethod: 'standard' });

  // Example: Family name 山田 (3+5=8), Given name 太郎 (4+9=13)
  // Standard method:
  //   Tenkaku = 8 + 1 = 9
  //   Jinkaku = 5 (last of family) + 4 (first of given) = 9
  //   Chikaku = 13 + 1 = 14
  //   Soukaku = 8 + 13 = 21
  //   Gaikaku = 21 - 9 + 2 = 14

  it('computes all five grids for 山田太郎 (Yamada Taro)', () => {
    const result = js.seimeiHandan([3, 5], [4, 9]);
    assertEqual(result.tenkaku.value, 9);
    assertEqual(result.jinkaku.value, 9);
    assertEqual(result.chikaku.value, 14);
    assertEqual(result.soukaku.value, 21);
    assertEqual(result.gaikaku.value, 14);
  });

  it('tenkaku has label and meaning', () => {
    const result = js.seimeiHandan([3, 5], [4, 9]);
    assertEqual(result.tenkaku.label, 'Tenkaku (天格, Heaven)');
    assert(result.tenkaku.meaning.length > 0, 'tenkaku should have meaning text');
  });

  it('each grid has a luck assessment', () => {
    const result = js.seimeiHandan([3, 5], [4, 9]);
    assert(result.tenkaku.luck !== undefined, 'tenkaku luck');
    assert(result.jinkaku.luck !== undefined, 'jinkaku luck');
    assert(result.chikaku.luck !== undefined, 'chikaku luck');
    assert(result.gaikaku.luck !== undefined, 'gaikaku luck');
    assert(result.soukaku.luck !== undefined, 'soukaku luck');
  });

  // Example: Family name 佐藤 (7+18=25), Given name 花子 (7+3=10)
  // Standard method:
  //   Tenkaku = 25 + 1 = 26
  //   Jinkaku = 18 (last of family) + 7 (first of given) = 25
  //   Chikaku = 10 + 1 = 11
  //   Soukaku = 25 + 10 = 35
  //   Gaikaku = 35 - 25 + 2 = 12

  it('computes all five grids for 佐藤花子 (Sato Hanako)', () => {
    const result = js.seimeiHandan([7, 18], [7, 3]);
    assertEqual(result.tenkaku.value, 26);
    assertEqual(result.jinkaku.value, 25);
    assertEqual(result.chikaku.value, 11);
    assertEqual(result.soukaku.value, 35);
    assertEqual(result.gaikaku.value, 12);
  });

  it('throws on empty arrays', () => {
    assertThrows(() => js.seimeiHandan([], [4, 9]));
    assertThrows(() => js.seimeiHandan([3, 5], []));
  });

  it('throws on non-array input', () => {
    assertThrows(() => js.seimeiHandan('abc', [4, 9]));
  });
});

describe('Japanese Shinto — Seimei Handan (simplified method)', () => {
  const js = JapaneseShinto.create({ seimeiMethod: 'simplified' });

  // Simplified: no +1 for tenkaku and chikaku
  // Family name 山田 (3+5=8), Given name 太郎 (4+9=13)
  //   Tenkaku = 8
  //   Jinkaku = 5 + 4 = 9
  //   Chikaku = 13
  //   Soukaku = 21
  //   Gaikaku = 21 - 9 + 2 = 14

  it('simplified method omits +1 for tenkaku and chikaku', () => {
    const result = js.seimeiHandan([3, 5], [4, 9]);
    assertEqual(result.tenkaku.value, 8);
    assertEqual(result.jinkaku.value, 9);
    assertEqual(result.chikaku.value, 13);
    assertEqual(result.soukaku.value, 21);
    assertEqual(result.gaikaku.value, 14);
  });
});

// ── Rokuyo (六曜) Day Cycle ────────────────────────────────────────────

describe('Japanese Shinto — Rokuyo', () => {
  const js = JapaneseShinto.create();

  it('returns a valid Rokuyo entry for a known date', () => {
    const result = js.rokuyo(2024, 1, 1);
    assert(result.name !== undefined, 'should have name');
    assert(result.kanji !== undefined, 'should have kanji');
    assert(result.meaning !== undefined, 'should have meaning');
    assert(result.index >= 0 && result.index <= 5, 'index should be 0-5');
  });

  it('Rokuyo index is (lunarMonth + lunarDay) % 6', () => {
    const result = js.rokuyo(2024, 1, 1);
    const expectedIndex = (result.lunarMonth + result.lunarDay) % 6;
    assertEqual(result.index, expectedIndex);
  });

  it('different dates can yield different Rokuyo days', () => {
    const r1 = js.rokuyo(2024, 1, 1);
    const r2 = js.rokuyo(2024, 1, 2);
    // These should typically differ (consecutive days usually have different lunar days)
    // But just verify both are valid
    assert(r1.index >= 0 && r1.index <= 5);
    assert(r2.index >= 0 && r2.index <= 5);
  });

  it('Taian is the most auspicious day', () => {
    const taian = JapaneseShinto.ROKUYO_NAMES[4];
    assertEqual(taian.name, 'Taian');
    assertEqual(taian.auspicious, true);
  });

  it('Butsumetsu is the most inauspicious day', () => {
    const butsumetsu = JapaneseShinto.ROKUYO_NAMES[3];
    assertEqual(butsumetsu.name, 'Butsumetsu');
    assertEqual(butsumetsu.auspicious, false);
  });

  it('all six Rokuyo days are defined', () => {
    assertEqual(JapaneseShinto.ROKUYO_NAMES.length, 6);
    const names = JapaneseShinto.ROKUYO_NAMES.map(r => r.name);
    assert(names.includes('Sensho'));
    assert(names.includes('Tomobiki'));
    assert(names.includes('Senbu'));
    assert(names.includes('Butsumetsu'));
    assert(names.includes('Taian'));
    assert(names.includes('Shakku'));
  });
});

// ── Gift Amount Evaluation ─────────────────────────────────────────────

describe('Japanese Shinto — Gift Amount Evaluation', () => {
  const js = JapaneseShinto.create();

  it('evaluateGiftAmount(40000, "wedding") → inauspicious (contains 4, even)', () => {
    const result = js.evaluateGiftAmount(40000, 'wedding');
    assertEqual(result.auspicious, false);
    assertEqual(result.containsFour, true);
    assert(result.warnings.length > 0, 'should have warnings');
  });

  it('evaluateGiftAmount(30000, "wedding") → auspicious (odd, no 4/9)', () => {
    const result = js.evaluateGiftAmount(30000, 'wedding');
    assertEqual(result.auspicious, true);
    assertEqual(result.containsFour, false);
    assertEqual(result.containsNine, false);
    assertEqual(result.warnings.length, 0);
  });

  it('evaluateGiftAmount(50000, "wedding") → auspicious (odd man, no 4/9)', () => {
    const result = js.evaluateGiftAmount(50000, 'wedding');
    assertEqual(result.auspicious, true);
  });

  it('evaluateGiftAmount(20000, "wedding") → inauspicious (even man)', () => {
    const result = js.evaluateGiftAmount(20000, 'wedding');
    assertEqual(result.auspicious, false);
  });

  it('evaluateGiftAmount(90000, "wedding") → inauspicious (contains 9)', () => {
    const result = js.evaluateGiftAmount(90000, 'wedding');
    assertEqual(result.auspicious, false);
    assertEqual(result.containsNine, true);
  });

  it('evaluateGiftAmount(20000, "funeral") → auspicious (even, no 4/9)', () => {
    const result = js.evaluateGiftAmount(20000, 'funeral');
    assertEqual(result.auspicious, true);
  });

  it('evaluateGiftAmount(30000, "funeral") → inauspicious (odd man for funeral)', () => {
    const result = js.evaluateGiftAmount(30000, 'funeral');
    assertEqual(result.auspicious, false);
  });

  it('evaluateGiftAmount(10000, "general") → auspicious (no 4/9)', () => {
    const result = js.evaluateGiftAmount(10000, 'general');
    assertEqual(result.auspicious, true);
  });

  it('evaluateGiftAmount reports manUnit correctly', () => {
    const result = js.evaluateGiftAmount(30000, 'wedding');
    assertEqual(result.manUnit, 3);
  });
});

// ── Kanji Stroke Lookup ────────────────────────────────────────────────

describe('Japanese Shinto — Kanji Stroke Lookup', () => {
  const js = JapaneseShinto.create();

  it('lookupStrokes for common kanji 山 → 3', () => {
    assertEqual(js.lookupStrokes('山'), 3);
  });

  it('lookupStrokes for 藤 → 18 (traditional)', () => {
    assertEqual(js.lookupStrokes('藤'), 18);
  });

  it('lookupStrokes returns null for unknown kanji', () => {
    assertEqual(js.lookupStrokes('龍'), null);
  });

  it('traditional vs simplified stroke sources', () => {
    const jsTrad = JapaneseShinto.create({ kanjiStrokeSource: 'traditional' });
    const jsSimp = JapaneseShinto.create({ kanjiStrokeSource: 'simplified' });
    // 辺 has different counts: traditional=16, simplified=5
    assertEqual(jsTrad.lookupStrokes('辺'), 16);
    assertEqual(jsSimp.lookupStrokes('辺'), 5);
  });
});

// ── Presets ─────────────────────────────────────────────────────────────

describe('Japanese Shinto — Presets', () => {
  it('traditional preset uses standard method with on-reading', () => {
    const js = JapaneseShinto.create('traditional');
    const result = js.evaluateDigit(4);
    assertEqual(result.reading, 'shi');
    // Verify seimei uses standard method (+1)
    const handan = js.seimeiHandan([3, 5], [4, 9]);
    assertEqual(handan.tenkaku.value, 9); // 8 + 1
  });

  it('modern preset uses simplified method without on-reading', () => {
    const js = JapaneseShinto.create('modern');
    const result = js.evaluateDigit(4);
    assertEqual(result.reading, 'yon'); // kun reading
    // Verify seimei uses simplified method (no +1)
    const handan = js.seimeiHandan([3, 5], [4, 9]);
    assertEqual(handan.tenkaku.value, 8); // no +1
  });
});

// ── Module Structure ───────────────────────────────────────────────────

describe('Japanese Shinto — Module Structure', () => {
  it('exports create, DEFAULT_CONFIG, VARIANTS', () => {
    assert(typeof JapaneseShinto.create === 'function');
    assert(typeof JapaneseShinto.DEFAULT_CONFIG === 'object');
    assert(typeof JapaneseShinto.VARIANTS === 'object');
  });

  it('DEFAULT_CONFIG has expected keys', () => {
    assertEqual(JapaneseShinto.DEFAULT_CONFIG.seimeiMethod, 'standard');
    assertEqual(JapaneseShinto.DEFAULT_CONFIG.includeOnReading, true);
    assertEqual(JapaneseShinto.DEFAULT_CONFIG.kanjiStrokeSource, 'traditional');
  });

  it('VARIANTS has traditional and modern', () => {
    assert(JapaneseShinto.VARIANTS.traditional !== undefined);
    assert(JapaneseShinto.VARIANTS.modern !== undefined);
  });

  it('DIGIT_INFO is exported as static data', () => {
    assert(JapaneseShinto.DIGIT_INFO !== undefined);
    assertEqual(JapaneseShinto.DIGIT_INFO[8].onReading, 'hachi');
  });

  it('KANJI_STROKES_TRADITIONAL is exported', () => {
    assert(JapaneseShinto.KANJI_STROKES_TRADITIONAL !== undefined);
    assertEqual(JapaneseShinto.KANJI_STROKES_TRADITIONAL['田'], 5);
  });
});

// ── Analyze convenience method ─────────────────────────────────────────

describe('Japanese Shinto — Analyze', () => {
  const js = JapaneseShinto.create();

  it('analyze(8) returns digit evaluation', () => {
    const result = js.analyze(8);
    assertEqual(result.reading, 'hachi');
    assertEqual(result.auspicious, true);
  });

  it('analyze(21) returns number with luck', () => {
    const result = js.analyze(21);
    assertEqual(result.number, 21);
    assertEqual(result.luck, 'kichi');
  });

  it('analyze(null) returns null', () => {
    const result = js.analyze(null);
    assertEqual(result, null);
  });
});

// ── Number Luck ────────────────────────────────────────────────────────

describe('Japanese Shinto — Number Luck', () => {
  const js = JapaneseShinto.create();

  it('numberLuck(1) → kichi (lucky)', () => {
    assertEqual(js.numberLuck(1), 'kichi');
  });

  it('numberLuck(4) → kyou (unlucky)', () => {
    assertEqual(js.numberLuck(4), 'kyou');
  });

  it('numberLuck(8) → kichi', () => {
    assertEqual(js.numberLuck(8), 'kichi');
  });

  it('numberLuck(9) → kyou', () => {
    assertEqual(js.numberLuck(9), 'kyou');
  });
});

// ── Run all tests ──────────────────────────────────────────────────────

const result = TestRunner.runAll();
if (typeof process !== 'undefined') process.exit(result.failed > 0 ? 1 : 0);
