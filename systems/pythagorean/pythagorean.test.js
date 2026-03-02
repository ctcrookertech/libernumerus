const TestRunner = require('../../shared/test-runner');
const Pythagorean = require('./pythagorean');
const { describe, it, assertEqual, assertDeepEqual, assert } = TestRunner;

describe('Pythagorean — Letter Mapping', () => {
  it('A=1', () => { assertEqual(Pythagorean.LETTER_MAP['A'], 1); });
  it('I=9', () => { assertEqual(Pythagorean.LETTER_MAP['I'], 9); });
  it('J=1', () => { assertEqual(Pythagorean.LETTER_MAP['J'], 1); });
  it('S=1', () => { assertEqual(Pythagorean.LETTER_MAP['S'], 1); });
  it('Z=8', () => { assertEqual(Pythagorean.LETTER_MAP['Z'], 8); });

  it('letterValue works case-insensitively', () => {
    const p = Pythagorean.create();
    assertEqual(p.letterValue('a'), 1);
    assertEqual(p.letterValue('z'), 8);
  });
});

describe('Pythagorean — Digit Reduction', () => {
  it('reduce(1987) → 7', () => {
    const p = Pythagorean.create();
    assertEqual(p.reduce(1987), 7);
  });

  it('reduce(29) with masterNumbers=[11,22] → 11', () => {
    const p = Pythagorean.create({ masterNumbers: [11, 22] });
    assertEqual(p.reduce(29), 11);
  });

  it('reduce(29) with masterNumbers=[] → 2', () => {
    const p = Pythagorean.create({ masterNumbers: [] });
    assertEqual(p.reduce(29), 2);
  });

  it('reduce(33) with default config → 33', () => {
    const p = Pythagorean.create();
    assertEqual(p.reduce(33), 33);
  });

  it('ancient mode reduces to 1-10', () => {
    const p = Pythagorean.create('ancient');
    assertEqual(p.reduce(29), 2);
    assertEqual(p.reduce(10), 10);
    assertEqual(p.reduce(19), 10);
    assertEqual(p.reduce(11), 2);
  });

  it('reductionPath(1987) → [1987, 25, 7]', () => {
    const p = Pythagorean.create();
    assertDeepEqual(p.reductionPath(1987), [1987, 25, 7]);
  });
});

describe('Pythagorean — Word Values', () => {
  it('wordValue(ALBERT) → 22', () => {
    const p = Pythagorean.create();
    assertEqual(p.wordValue('ALBERT'), 22);
  });
});

describe('Pythagorean — Soul Urge & Personality', () => {
  it('soulUrge(ALBERT) — vowels A,E → 1+5 = 6', () => {
    const p = Pythagorean.create();
    const su = p.soulUrge('ALBERT');
    assertEqual(su.total, 6);
    assertEqual(su.value, 6);
  });

  it('personality(ALBERT) — consonants L,B,R,T → 3+2+9+2 = 16 → 7', () => {
    const p = Pythagorean.create();
    const per = p.personality('ALBERT');
    assertEqual(per.total, 16);
    assertEqual(per.value, 7);
  });

  it('personality(ALBERT) flags Karmic Debt 16', () => {
    const p = Pythagorean.create();
    const per = p.personality('ALBERT');
    assert(per.karmicDebt.includes(16), 'Should flag karmic debt 16');
  });

  it('no Karmic Debt when disabled', () => {
    const p = Pythagorean.create({ karmicDebtEnabled: false });
    const per = p.personality('ALBERT');
    assertEqual(per.karmicDebt.length, 0);
  });
});

describe('Pythagorean — Life Path', () => {
  it('lifePath July 4, 1776 → 5', () => {
    const p = Pythagorean.create();
    const lp = p.lifePath({ month: 7, day: 4, year: 1776 });
    // 7 + 4 + 1+7+7+6=21→3 = 14 → 5
    assertEqual(lp.value, 5);
  });

  it('lifePath Feb 22, 1990 — preserves 22 as Master Number for day', () => {
    const p = Pythagorean.create({ masterNumbers: [11, 22, 33] });
    const lp = p.lifePath({ month: 2, day: 22, year: 1990 });
    assertEqual(lp.components.day, 22);
  });
});

describe('Pythagorean — Personal Year', () => {
  it('personalYear for July 4 in 2026', () => {
    const p = Pythagorean.create();
    const py = p.personalYear(7, 4, 2026);
    // 7 + 4 + 2026 = 2037 → 2+0+3+7 = 12 → 3
    assertEqual(py.value, 3);
  });
});

describe('Pythagorean — Pinnacles & Challenges', () => {
  it('pinnacles for July 4, 1776', () => {
    const p = Pythagorean.create();
    const pins = p.pinnacles({ month: 7, day: 4, year: 1776 });
    assertEqual(pins.length, 4);
    // P1 = reduce(7+4) = 11 (master), P2 = reduce(4+3) = 7, P3 = reduce(11+7)=18→9, P4 = reduce(7+3) = 10→1
    assertEqual(pins[0].value, 11);
    assertEqual(pins[1].value, 7);
    assertEqual(pins[2].value, 9);
    assertEqual(pins[3].value, 1);
  });

  it('challenges for July 4, 1776', () => {
    const p = Pythagorean.create();
    const chal = p.challenges({ month: 7, day: 4, year: 1776 });
    assertEqual(chal.length, 4);
    // C1=|7-4|=3, C2=|4-3|=1, C3=|3-1|=2, C4=|7-3|=4
    assertEqual(chal[0].value, 3);
    assertEqual(chal[1].value, 1);
    assertEqual(chal[2].value, 2);
    assertEqual(chal[3].value, 4);
  });
});

describe('Pythagorean — Presets', () => {
  it('modern preset', () => {
    const p = Pythagorean.create('modern');
    assertEqual(p.reduce(33), 33);
    assert(p.personality('ALBERT').karmicDebt.length > 0);
  });

  it('ancient preset — no Master Numbers, no Karmic Debt', () => {
    const p = Pythagorean.create('ancient');
    assertEqual(p.reduce(33), 6);
    assertEqual(p.personality('ALBERT').karmicDebt.length, 0);
  });

  it('conservative preset — only 11,22 as Master Numbers', () => {
    const p = Pythagorean.create('conservative');
    assertEqual(p.reduce(33), 6);
    assertEqual(p.reduce(22), 22);
    assertEqual(p.reduce(11), 11);
  });
});

describe('Pythagorean — Meanings', () => {
  it('numberMeaning(1) returns data', () => {
    const p = Pythagorean.create();
    const m = p.numberMeaning(1);
    assertEqual(m.name, 'The Individual');
  });

  it('numberMeaning(11) returns Master Number', () => {
    const p = Pythagorean.create();
    const m = p.numberMeaning(11);
    assertEqual(m.name, 'The Master Intuitive');
    assertEqual(m.isModernAddition, true);
  });

  it('karmicDebtMeaning(16)', () => {
    const p = Pythagorean.create();
    const m = p.karmicDebtMeaning(16);
    assert(m !== null);
    assertEqual(m.number, 16);
  });
});

describe('Pythagorean — Y-as-Vowel', () => {
  it('contextual Y — LYNX: Y is vowel (no adjacent vowel)', () => {
    const p = Pythagorean.create({ yAsVowel: 'contextual' });
    const cl = p.classifyLetters('LYNX');
    assert(cl.vowels.includes('Y'), 'Y should be vowel in LYNX');
  });

  it('contextual Y — YOGA: Y is consonant (adjacent to vowel O)', () => {
    const p = Pythagorean.create({ yAsVowel: 'contextual' });
    const cl = p.classifyLetters('YOGA');
    assert(cl.consonants.includes('Y'), 'Y should be consonant in YOGA');
  });

  it('always Y-as-vowel', () => {
    const p = Pythagorean.create({ yAsVowel: 'always' });
    const cl = p.classifyLetters('YELL');
    assert(cl.vowels.includes('Y'), 'Y should always be vowel');
  });

  it('never Y-as-vowel', () => {
    const p = Pythagorean.create({ yAsVowel: 'never' });
    const cl = p.classifyLetters('YOGA');
    assert(cl.consonants.includes('Y'), 'Y should always be consonant');
  });
});

describe('Pythagorean — Analyze', () => {
  it('analyze with date input', () => {
    const p = Pythagorean.create();
    const result = p.analyze({ month: 7, day: 4, year: 1776 });
    assert(result.lifePath !== undefined);
    assert(result.pinnacles !== undefined);
    assert(result.challenges !== undefined);
  });

  it('analyze with name input', () => {
    const p = Pythagorean.create();
    const result = p.analyze('ALBERT');
    assert(result.expression !== undefined);
    assert(result.soulUrge !== undefined);
    assert(result.personality !== undefined);
  });

  it('analyze with number input', () => {
    const p = Pythagorean.create();
    const result = p.analyze(1987);
    assertEqual(result.reduced, 7);
  });
});

const result = TestRunner.runAll();
if (typeof process !== 'undefined') process.exit(result.failed > 0 ? 1 : 0);
