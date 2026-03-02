const TestRunner = require('../../shared/test-runner');
const Chaldean = require('./chaldean');
const { describe, it, assertEqual, assert } = TestRunner;

describe('Chaldean — Letter Mapping', () => {
  const c = Chaldean.create();

  it('A=1', () => { assertEqual(c.letterValue('A'), 1); });
  it('F=8', () => { assertEqual(c.letterValue('F'), 8); });
  it('O=7', () => { assertEqual(c.letterValue('O'), 7); });

  it('9 is never assigned to any letter', () => {
    for (let i = 65; i <= 90; i++) {
      const ch = String.fromCharCode(i);
      assert(c.letterValue(ch) !== 9, ch + ' should not map to 9');
    }
  });
});

describe('Chaldean — Word Values', () => {
  const c = Chaldean.create();

  it('CHEIRO = 23 compound, 5 reduced', () => {
    // C=3, H=5, E=5, I=1, R=2, O=7 = 23
    assertEqual(c.wordValue('CHEIRO'), 23);
    assertEqual(c.reduce(23), 5);
  });
});

describe('Chaldean — Birth Number', () => {
  const c = Chaldean.create();

  it('birthNumber(16) → compound 16, reduced 7', () => {
    const bn = c.birthNumber(16);
    assertEqual(bn.compound, 16);
    assertEqual(bn.single, 7);
  });

  it('birthNumber(16) compound meaning = Shattered Citadel', () => {
    const bn = c.birthNumber(16);
    assertEqual(bn.compoundMeaning.name, 'The Shattered Citadel');
  });

  it('birthNumber(7) → no compound, single digit 7', () => {
    const bn = c.birthNumber(7);
    assertEqual(bn.single, 7);
    assertEqual(bn.compound, null);
  });
});

describe('Chaldean — Compound Meanings', () => {
  const c = Chaldean.create();

  it('compoundMeaning(10) = Wheel of Fortune', () => {
    assertEqual(c.compoundMeaning(10).name, 'Wheel of Fortune');
  });

  it('compoundMeaning(13) = The Great Transformer', () => {
    assertEqual(c.compoundMeaning(13).name, 'The Great Transformer');
  });

  it('compoundMeaning(52) returns meaning', () => {
    assert(c.compoundMeaning(52) !== null);
  });

  it('compoundMeaning(53) returns null for default range', () => {
    assertEqual(c.compoundMeaning(53), null);
  });
});

describe('Chaldean — Planetary Attribution', () => {
  const c = Chaldean.create();

  it('planetFor(4) with rahuKetu → Rahu', () => {
    assertEqual(c.planetFor(4).name, 'Rahu');
  });

  it('planetFor(7) with rahuKetu → Ketu', () => {
    assertEqual(c.planetFor(7).name, 'Ketu');
  });

  it('planetFor(4) with uranusNeptune → Uranus', () => {
    const c2 = Chaldean.create({ planetaryScheme: 'uranusNeptune' });
    assertEqual(c2.planetFor(4).name, 'Uranus');
  });

  it('planetFor(7) with uranusNeptune → Neptune', () => {
    const c2 = Chaldean.create({ planetaryScheme: 'uranusNeptune' });
    assertEqual(c2.planetFor(7).name, 'Neptune');
  });

  it('planetFor(1) → Sun', () => {
    assertEqual(c.planetFor(1).name, 'Sun');
  });
});

describe('Chaldean — Name Vibration', () => {
  const c = Chaldean.create();

  it('nameVibration returns compound and reduced', () => {
    const nv = c.nameVibration('CHEIRO');
    assertEqual(nv.compound, 23);
    assertEqual(nv.reduced, 5);
    assert(nv.planet !== null);
  });
});

describe('Chaldean — Presets', () => {
  it('cheiro preset uses rahuKetu', () => {
    const c = Chaldean.create('cheiro');
    assertEqual(c.planetFor(4).name, 'Rahu');
  });

  it('modernWestern preset uses uranusNeptune', () => {
    const c = Chaldean.create('modernWestern');
    assertEqual(c.planetFor(4).name, 'Uranus');
  });
});

const result = TestRunner.runAll();
if (typeof process !== 'undefined') process.exit(result.failed > 0 ? 1 : 0);
