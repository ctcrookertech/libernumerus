const TestRunner = require('../../shared/test-runner');
const VedicIndian = require('./vedic-indian');
const Chaldean = require('../chaldean/chaldean');
const { describe, it, assertEqual, assert } = TestRunner;

describe('Vedic Indian — Psychic Number', () => {
  const v = VedicIndian.create();
  it('psychicNumber(15) → 6', () => {
    assertEqual(v.psychicNumber(15), 6);
  });
  it('psychicNumber(7) → 7', () => {
    assertEqual(v.psychicNumber(7), 7);
  });
  it('psychicNumber(29) → 2', () => {
    assertEqual(v.psychicNumber(29), 2);
  });
});

describe('Vedic Indian — Destiny Number', () => {
  const v = VedicIndian.create();
  it('destinyNumber for Aug 15, 1990', () => {
    const dn = v.destinyNumber({ day: 15, month: 8, year: 1990 });
    // 1+5=6, 8, 1+9+9+0=19→10→1 → 6+8+1=15→6
    assertEqual(dn, 6);
  });
});

describe('Vedic Indian — Planetary Attribution', () => {
  const v = VedicIndian.create();

  it('planet(1) → Sun/Surya with Ruby', () => {
    const p = v.planet(1);
    assertEqual(p.sanskrit, 'Surya');
    assertEqual(p.english, 'Sun');
    assertEqual(p.gemstone, 'Ruby');
  });

  it('planet(4) → Rahu/North Node', () => {
    const p = v.planet(4);
    assertEqual(p.sanskrit, 'Rahu');
    assertEqual(p.english, 'North Node');
  });

  it('planet(9) → Mars/Mangala', () => {
    const p = v.planet(9);
    assertEqual(p.sanskrit, 'Mangala');
    assertEqual(p.english, 'Mars');
  });
});

describe('Vedic Indian — Cross-verify with Chaldean', () => {
  it('Chaldean and Vedic share identical 1-9 planetary scheme', () => {
    const c = Chaldean.create();
    const v = VedicIndian.create();
    for (let i = 1; i <= 9; i++) {
      const cp = c.planetFor(i);
      const vp = v.planet(i);
      // Both use same sanskrit names as primary identifier
      assertEqual(cp.sanskrit, vp.sanskrit, 'Planet mismatch for ' + i);
    }
  });
});

describe('Vedic Indian — Compound Meanings', () => {
  const v = VedicIndian.create();

  it('compoundMeaning(16) = The Shattered Citadel', () => {
    assertEqual(v.compoundMeaning(16).name, 'The Shattered Citadel');
  });

  it('compoundMeaning(16) matches Chaldean 16', () => {
    const c = Chaldean.create();
    assertEqual(v.compoundMeaning(16).name, c.compoundMeaning(16).name);
  });
});

describe('Vedic Indian — Name Number', () => {
  const v = VedicIndian.create();

  it('nameNumber returns total and reduced', () => {
    const nn = v.nameNumber('KRISHNA');
    assert(nn.total > 0);
    assert(nn.reduced >= 1 && nn.reduced <= 9);
  });
});

describe('Vedic Indian — Compatibility', () => {
  const v = VedicIndian.create();

  it('compatible(1, 4) returns result with label', () => {
    const result = v.compatible(1, 4);
    assert(result.label !== undefined);
    assert(result.compatibility !== undefined);
  });

  it('compatible(1, 1) → friendly', () => {
    const result = v.compatible(1, 1);
    assertEqual(result.label, 'friendly');
  });
});

describe('Vedic Indian — Katapayadi', () => {
  const v = VedicIndian.create();

  it('katapayadi encoding produces a number', () => {
    const result = v.katapayadi('go');
    assert(result.number >= 0);
  });
});

describe('Vedic Indian — Gemstone', () => {
  const v = VedicIndian.create();

  it('gemstone(1) → Ruby', () => {
    assertEqual(v.gemstone(1), 'Ruby');
  });

  it('gemstone(6) → Diamond', () => {
    assertEqual(v.gemstone(6), 'Diamond');
  });
});

describe('Vedic Indian — Yuga Cycles', () => {
  const v = VedicIndian.create();

  it('Kali Yuga = 432,000 years', () => {
    assertEqual(v.yugaCycle('kaliYuga').years, 432000);
  });

  it('Mahayuga = 4,320,000 years', () => {
    assertEqual(v.yugaCycle('mahayuga').years, 4320000);
  });
});

describe('Vedic Indian — Presets', () => {
  it('jyotish preset uses sanskrit names', () => {
    const v = VedicIndian.create('jyotish');
    const p = v.planet(1);
    assert(p.sanskrit !== undefined);
  });

  it('modern preset', () => {
    const v = VedicIndian.create('modern');
    const p = v.planet(1);
    assert(p.english !== undefined);
  });
});

describe('Vedic Indian — Analyze', () => {
  const v = VedicIndian.create();

  it('analyze date returns psychic and destiny', () => {
    const result = v.analyze({ day: 15, month: 8, year: 1990 });
    assertEqual(result.psychic, 6);
    assert(result.destiny > 0);
  });

  it('analyze string returns name number', () => {
    const result = v.analyze('KRISHNA');
    assert(result.nameNumber !== undefined);
  });
});

const result = TestRunner.runAll();
if (typeof process !== 'undefined') process.exit(result.failed > 0 ? 1 : 0);
