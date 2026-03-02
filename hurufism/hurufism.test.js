const TestRunner = require('../shared/test-runner');
const Hurufism = require('./hurufism');
const ArabicAbjad = require('../arabic-abjad/arabic-abjad');
const { describe, it, assertEqual, assert } = TestRunner;

describe('Hurufism — Abjad Values Carry Over', () => {
  const h = Hurufism.create();
  const aa = ArabicAbjad.create();

  it('All 28 standard Abjad values match', () => {
    for (const letter of ArabicAbjad.LETTERS_EASTERN) {
      assertEqual(h.letterValue(letter.char), aa.letterValue(letter.char),
        letter.name + ' should match');
    }
  });
});

describe('Hurufism — Facial Line Mapping', () => {
  const h = Hurufism.create();

  it('Alif maps to a facial line', () => {
    const line = h.facialLine('\u0627');
    assert(line !== null);
    assertEqual(line.line, 1);
    assertEqual(line.name, 'Right Eyebrow');
  });

  it('Ghayn maps to mouth line (line 7)', () => {
    const line = h.facialLine('\u063A');
    assertEqual(line.line, 7);
    assertEqual(line.name, 'Mouth Line');
  });

  it('7 facial lines × 4 letters = 28', () => {
    let total = 0;
    for (const line of Hurufism.FACIAL_LINES) {
      assertEqual(line.letters.length, 4);
      total += line.letters.length;
    }
    assertEqual(total, 28);
  });
});

describe('Hurufism — Letter Set Config', () => {
  it('28-letter system has no Persian letters', () => {
    const h = Hurufism.create('fazlallah');
    const letters = h.getLetterSet();
    assertEqual(letters.length, 28);
  });

  it('32-letter system includes Persian letters', () => {
    const h = Hurufism.create('persian');
    const letters = h.getLetterSet();
    assertEqual(letters.length, 32);
  });

  it('Persian Pe (پ) only available in 32-letter system', () => {
    const h32 = Hurufism.create('persian');
    assert(h32.letterValue('\u067E') > 0);
  });

  it('Persian Che (چ) available in 32-letter system', () => {
    const h32 = Hurufism.create('persian');
    assert(h32.letterValue('\u0686') > 0);
  });
});

describe('Hurufism — Prophetic Cycle', () => {
  const h = Hurufism.create();

  it('Alif → Adam cycle', () => {
    const cycle = h.propheticCycle('\u0627');
    assertEqual(cycle.prophet, 'Adam');
  });

  it('Ghayn → Muhammad cycle', () => {
    const cycle = h.propheticCycle('\u063A');
    assertEqual(cycle.prophet, 'Muhammad');
  });

  it('7 prophetic cycles covering 28 letters', () => {
    let total = 0;
    for (const cycle of Hurufism.PROPHETIC_CYCLES) {
      total += cycle.letters.length;
    }
    assertEqual(total, 28);
  });
});

describe('Hurufism — Body Map (Teeth)', () => {
  it('body map for Alif in 32-letter system', () => {
    const h = Hurufism.create('persian');
    const map = h.bodyMap('\u0627');
    assert(map !== null);
    assertEqual(map.quadrant, 'upperRight');
  });

  it('body map disabled returns null', () => {
    const h = Hurufism.create({ includeBodyMap: false });
    assertEqual(h.bodyMap('\u0627'), null);
  });

  it('32 teeth positions available', () => {
    let total = 0;
    for (const letters of Object.values(Hurufism.TEETH_MAP)) {
      total += letters.length;
    }
    assertEqual(total, 32);
  });
});

describe('Hurufism — Analyze', () => {
  it('analyze returns value and letter set info', () => {
    const h = Hurufism.create();
    const result = h.analyze('\u0627\u0644\u0644\u0647');
    assertEqual(result.value, 66);
    assertEqual(result.letterSet, 'arabic28');
  });
});

const result = TestRunner.runAll();
if (typeof process !== 'undefined') process.exit(result.failed > 0 ? 1 : 0);
