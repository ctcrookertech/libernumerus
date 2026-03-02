const TestRunner = require('../../shared/test-runner');
const Mayan = require('./mayan');
const { describe, it, assertEqual, assertDeepEqual, assert } = TestRunner;

describe('Mayan — Long Count', () => {
  const m = Mayan.create('gmt');

  it('Dec 21, 2012 → 13.0.0.0.0 (GMT)', () => {
    const lc = m.toLongCount({ year: 2012, month: 12, day: 21 });
    assertDeepEqual(lc, [13, 0, 0, 0, 0]);
  });

  it('fromLongCount([13,0,0,0,0]) → Dec 21, 2012', () => {
    const date = m.fromLongCount([13, 0, 0, 0, 0]);
    assertEqual(date.year, 2012);
    assertEqual(date.month, 12);
    assertEqual(date.day, 21);
  });

  it('Lounsbury correlation gives different date for same Long Count', () => {
    const ml = Mayan.create('lounsbury');
    const date = ml.fromLongCount([13, 0, 0, 0, 0]);
    // Lounsbury = GMT + 2 days
    assertEqual(date.day, 23);
  });
});

describe('Mayan — Long Count Arithmetic', () => {
  it('1 Tun = 360 days', () => {
    assertEqual(Mayan.LONG_COUNT_PERIODS.tun, 360);
  });

  it('1 Katun = 7200 days', () => {
    assertEqual(Mayan.LONG_COUNT_PERIODS.katun, 7200);
  });

  it('1 Baktun = 144000 days', () => {
    assertEqual(Mayan.LONG_COUNT_PERIODS.baktun, 144000);
  });
});

describe('Mayan — Tzolkin', () => {
  it('Dec 21, 2012 → 4 Ajaw', () => {
    const m = Mayan.create('gmt');
    const tz = m.tzolkinDate({ year: 2012, month: 12, day: 21 });
    assertEqual(tz.number, 4);
    assertEqual(tz.sign.name, 'Ajaw');
  });

  it('260 Tzolkin days cycle correctly', () => {
    const m = Mayan.create('gmt');
    const tz1 = m.tzolkinDate({ year: 2012, month: 12, day: 21 });
    // 260 days later should be same Tzolkin date
    // Dec 21, 2012 + 260 days = Sep 7, 2013
    const tz2 = m.tzolkinDate({ year: 2013, month: 9, day: 7 });
    assertEqual(tz1.number, tz2.number);
    assertEqual(tz1.sign.name, tz2.sign.name);
  });
});

describe('Mayan — Dot and Bar', () => {
  it('dotAndBar(0) → shell', () => {
    const m = Mayan.create();
    const db = m.dotAndBar(0);
    assertEqual(db.shell, true);
  });

  it('dotAndBar(7) → 1 bar + 2 dots', () => {
    const m = Mayan.create();
    const db = m.dotAndBar(7);
    assertEqual(db.bars, 1);
    assertEqual(db.dots, 2);
  });

  it('dotAndBar(19) → 3 bars + 4 dots', () => {
    const m = Mayan.create();
    const db = m.dotAndBar(19);
    assertEqual(db.bars, 3);
    assertEqual(db.dots, 4);
  });

  it('dotAndBar(5) → 1 bar + 0 dots', () => {
    const m = Mayan.create();
    const db = m.dotAndBar(5);
    assertEqual(db.bars, 1);
    assertEqual(db.dots, 0);
  });
});

describe('Mayan — Vigesimal Conversion', () => {
  it('toVigesimal(20) → [1, 0]', () => {
    const m = Mayan.create();
    assertDeepEqual(m.toVigesimal(20), [1, 0]);
  });

  it('toVigesimal(0) → [0]', () => {
    const m = Mayan.create();
    assertDeepEqual(m.toVigesimal(0), [0]);
  });

  it('toVigesimal(400) → [1, 0, 0]', () => {
    const m = Mayan.create();
    assertDeepEqual(m.toVigesimal(400), [1, 0, 0]);
  });
});

describe('Mayan — Day Sign Language', () => {
  it('Yukatek uses Ajaw', () => {
    const m = Mayan.create('gmt');
    const tz = m.tzolkinDate({ year: 2012, month: 12, day: 21 });
    assertEqual(tz.sign.name, 'Ajaw');
  });

  it("K'iche' uses Ajpu", () => {
    const m = Mayan.create('kiche');
    const tz = m.tzolkinDate({ year: 2012, month: 12, day: 21 });
    assertEqual(tz.sign.name, 'Ajpu');
  });
});

describe('Mayan — Calendar Round', () => {
  it('calendarRound returns both Tzolkin and Haab', () => {
    const m = Mayan.create();
    const cr = m.calendarRound({ year: 2012, month: 12, day: 21 });
    assert(cr.tzolkin !== undefined);
    assert(cr.haab !== undefined);
  });
});

describe('Mayan — Number Meanings', () => {
  it('meaning for 13 exists', () => {
    const m = Mayan.create();
    assert(m.numberMeaning(13) !== null);
  });
});

describe('Mayan — Analyze', () => {
  it('analyze date input', () => {
    const m = Mayan.create();
    const result = m.analyze({ year: 2012, month: 12, day: 21 });
    assert(result.longCount !== undefined);
    assert(result.tzolkin !== undefined);
  });

  it('analyze number input', () => {
    const m = Mayan.create();
    const result = m.analyze(7);
    assert(result.dotAndBar !== undefined);
  });
});

const result = TestRunner.runAll();
if (typeof process !== 'undefined') process.exit(result.failed > 0 ? 1 : 0);
