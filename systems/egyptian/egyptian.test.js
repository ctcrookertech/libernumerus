const TestRunner = require('../../shared/test-runner');
const Egyptian = require('./egyptian');
const { describe, it, assertEqual, assertDeepEqual, assert } = TestRunner;

describe('Egyptian — Number Meanings', () => {
  const e = Egyptian.create();

  it('meaning(9) references Ennead', () => {
    const m = e.meaning(9);
    assertEqual(m.name, 'Ennead');
    assert(m.meaning.indexOf('Ennead') !== -1, 'Should mention Ennead');
    assert(m.meaning.indexOf('nine') !== -1 || m.meaning.indexOf('Heliopolis') !== -1, 'Should reference Heliopolis or nine');
  });

  it('meaning(8) references Ogdoad', () => {
    const m = e.meaning(8);
    assertEqual(m.name, 'Ogdoad');
    assert(m.meaning.indexOf('Ogdoad') !== -1, 'Should mention Ogdoad');
    assert(m.description.indexOf('Hermopolis') !== -1, 'Should reference Hermopolis');
  });

  it('meaning(42) references 42 assessors/judges', () => {
    const m = e.meaning(42);
    assertEqual(m.name, 'Assessors');
    assert(m.meaning.indexOf('judge') !== -1 || m.meaning.indexOf('Negative Confession') !== -1, 'Should mention judges or Negative Confession');
    assert(m.meaning.indexOf('42') !== -1 || m.meaning.indexOf('Forty-two') !== -1, 'Should reference the count 42');
  });

  it('meaning(1) references Atum', () => {
    const m = e.meaning(1);
    assertEqual(m.name, 'Atum');
    assert(m.meaning.indexOf('primordial') !== -1, 'Should reference primordial creation');
  });

  it('meaning(14) references parts of Osiris', () => {
    const m = e.meaning(14);
    assertEqual(m.name, 'Parts of Osiris');
    assert(m.description.indexOf('fourteen') !== -1 || m.description.indexOf('14') !== -1, 'Should reference fourteen');
  });

  it('meaning of unknown number returns null fields', () => {
    const m = e.meaning(99);
    assertEqual(m.number, 99);
    assertEqual(m.name, null);
    assertEqual(m.meaning, null);
  });

  it('meaning includes Greek sources when enabled (default)', () => {
    const m = e.meaning(14);
    assert(m.greekSource !== undefined, 'Should include Greek source');
    assert(m.greekSource.indexOf('Plutarch') !== -1, 'Should reference Plutarch');
  });

  it('meaning excludes Greek sources when disabled', () => {
    const e2 = Egyptian.create({ includeGreekSources: false });
    const m = e2.meaning(14);
    assertEqual(m.greekSource, undefined);
  });
});

describe('Egyptian — Hieroglyphic Numerals', () => {
  const e = Egyptian.create();

  it('toHieroglyphic(1234) decomposes correctly', () => {
    const h = e.toHieroglyphic(1234);
    assertEqual(h.thousands, 1);
    assertEqual(h.hundreds, 2);
    assertEqual(h.tens, 3);
    assertEqual(h.ones, 4);
    assertEqual(h.total, 1234);
  });

  it('toHieroglyphic(1000000) includes Heh hieroglyph', () => {
    const h = e.toHieroglyphic(1000000);
    assertEqual(h.millions, 1);
    assertEqual(h.thousands, 0);
    assertEqual(h.ones, 0);
    assert(h.denominations.length === 1, 'Should have exactly one denomination');
    assert(h.denominations[0].symbol.name.indexOf('Heh') !== -1, 'Should reference Heh');
  });

  it('toHieroglyphic(0) returns all zeros', () => {
    const h = e.toHieroglyphic(0);
    assertEqual(h.total, 0);
    assertEqual(h.ones, 0);
    assertEqual(h.tens, 0);
    assertEqual(h.denominations.length, 0);
  });

  it('toHieroglyphic includes denomination symbols', () => {
    const h = e.toHieroglyphic(111);
    assertEqual(h.hundreds, 1);
    assertEqual(h.tens, 1);
    assertEqual(h.ones, 1);
    assertEqual(h.denominations.length, 3);
  });

  it('toHieroglyphic(54321) covers multiple denominations', () => {
    const h = e.toHieroglyphic(54321);
    assertEqual(h.tenThousands, 5);
    assertEqual(h.thousands, 4);
    assertEqual(h.hundreds, 3);
    assertEqual(h.tens, 2);
    assertEqual(h.ones, 1);
  });
});

describe('Egyptian — Decan Identification', () => {
  const e = Egyptian.create();

  it('decan(1) returns first decan info', () => {
    const d = e.decan(1);
    assertEqual(d.number, 1);
    assertEqual(d.name, 'Kenmet');
    assert(d.period !== undefined, 'Should have a period');
    assert(d.description !== undefined, 'Should have a description');
  });

  it('decan(36) returns last decan info', () => {
    const d = e.decan(36);
    assertEqual(d.number, 36);
    assertEqual(d.name, 'Tepy-a Akhut Khert');
    assert(d.period.indexOf('IV Shemu') !== -1, 'Last decan should be in IV Shemu');
  });

  it('decan(10) returns Sopdet', () => {
    const d = e.decan(10);
    assertEqual(d.number, 10);
    assertEqual(d.name, 'Sopdet');
  });

  it('decan(0) returns null (out of range)', () => {
    assertEqual(e.decan(0), null);
  });

  it('decan(37) returns null (out of range)', () => {
    assertEqual(e.decan(37), null);
  });
});

describe('Egyptian — Ritual Repetition', () => {
  const e = Egyptian.create();

  it('ritualRepetition(4) explains completeness', () => {
    const r = e.ritualRepetition(4);
    assertEqual(r.times, 4);
    assert(r.meaning.indexOf('Completeness') !== -1 || r.meaning.indexOf('completeness') !== -1 || r.meaning.indexOf('four') !== -1,
      'Should reference completeness or four directions');
  });

  it('ritualRepetition(7) explains perfection', () => {
    const r = e.ritualRepetition(7);
    assertEqual(r.times, 7);
    assert(r.meaning.indexOf('Perfection') !== -1 || r.meaning.indexOf('perfection') !== -1,
      'Should reference perfection');
  });

  it('ritualRepetition(9) explains ennead invocation', () => {
    const r = e.ritualRepetition(9);
    assertEqual(r.times, 9);
    assert(r.meaning.indexOf('Ennead') !== -1 || r.meaning.indexOf('nine') !== -1,
      'Should reference Ennead or nine gods');
  });

  it('ritualRepetition of unknown count returns generic message', () => {
    const r = e.ritualRepetition(11);
    assertEqual(r.times, 11);
    assert(r.meaning.length > 0, 'Should have some meaning text');
  });
});

describe('Egyptian — Configuration', () => {
  it('default config is newKingdom with Greek sources', () => {
    assertEqual(Egyptian.DEFAULT_CONFIG.period, 'newKingdom');
    assertEqual(Egyptian.DEFAULT_CONFIG.includeGreekSources, true);
  });

  it('custom config overrides defaults', () => {
    const e = Egyptian.create({ period: 'oldKingdom', includeGreekSources: false });
    const m = e.meaning(42);
    assertEqual(m.greekSource, undefined);
  });
});

describe('Egyptian — Analyze', () => {
  const e = Egyptian.create();

  it('analyze(9) returns meaning, hieroglyphic, ritual, and decan', () => {
    const result = e.analyze(9);
    assert(result.meaning !== undefined, 'Should include meaning');
    assert(result.hieroglyphic !== undefined, 'Should include hieroglyphic');
    assert(result.ritualRepetition !== undefined, 'Should include ritual repetition');
    assert(result.decan !== undefined, 'Should include decan (9 is within 1-36)');
    assertEqual(result.meaning.name, 'Ennead');
  });

  it('analyze(42) includes meaning but no decan (out of 1-36)', () => {
    const result = e.analyze(42);
    assertEqual(result.meaning.name, 'Assessors');
    assertEqual(result.decan, null);
  });

  it('analyze non-number returns null', () => {
    assertEqual(e.analyze('foo'), null);
  });
});

const result = TestRunner.runAll();
if (typeof process !== 'undefined') process.exit(result.failed > 0 ? 1 : 0);
