const TestRunner = require('../shared/test-runner');
const Neoplatonic = require('./neoplatonic');
const { describe, it, assertEqual, assert } = TestRunner;

describe('Neoplatonic — Perfect Numbers', () => {
  const np = Neoplatonic.create();

  it('isPerfect(6) → true', () => { assertEqual(np.isPerfect(6), true); });
  it('isPerfect(28) → true', () => { assertEqual(np.isPerfect(28), true); });
  it('isPerfect(12) → false', () => { assertEqual(np.isPerfect(12), false); });
  it('isPerfect(496) → true', () => { assertEqual(np.isPerfect(496), true); });
});

describe('Neoplatonic — Triangular Numbers', () => {
  const np = Neoplatonic.create();

  it('isTriangular(10) → true (1+2+3+4)', () => {
    assertEqual(np.isTriangular(10), true);
  });

  it('isTriangular(153) → true (1+2+...+17)', () => {
    assertEqual(np.isTriangular(153), true);
  });

  it('isTriangular(7) → false', () => {
    assertEqual(np.isTriangular(7), false);
  });

  it('isTriangular(1) → true', () => {
    assertEqual(np.isTriangular(1), true);
  });
});

describe('Neoplatonic — Properties', () => {
  const np = Neoplatonic.create();

  it('properties(7) — odd, prime, deficient', () => {
    const p = np.properties(7);
    assertEqual(p.odd, true);
    assertEqual(p.prime, true);
    assertEqual(p.deficient, true);
  });

  it('properties(6) — even, perfect, triangular', () => {
    const p = np.properties(6);
    assertEqual(p.even, true);
    assertEqual(p.perfect, true);
    assertEqual(p.triangular, true);
  });

  it('properties(4) — square', () => {
    const p = np.properties(4);
    assertEqual(p.square, true);
  });

  it('properties(8) — cubic', () => {
    const p = np.properties(8);
    assertEqual(p.cubic, true);
  });

  it('properties include deity association', () => {
    const p = np.properties(6);
    assert(p.deity !== null);
    assert(p.deity.includes('Aphrodite'));
  });

  it('properties without deity when disabled', () => {
    const np2 = Neoplatonic.create({ includeDeityAssociations: false });
    const p = np2.properties(6);
    assertEqual(p.deity, undefined);
  });
});

describe('Neoplatonic — Decad Principle', () => {
  const np = Neoplatonic.create();

  it('decadPrinciple(24) → 6', () => {
    assertEqual(np.decadPrinciple(24), 6);
  });

  it('decadPrinciple(10) → 10', () => {
    assertEqual(np.decadPrinciple(10), 10);
  });

  it('decadPrinciple(7) → 7', () => {
    assertEqual(np.decadPrinciple(7), 7);
  });
});

describe('Neoplatonic — Tetractys', () => {
  const np = Neoplatonic.create();

  it('tetractys sum = 10', () => {
    const t = np.tetractys();
    assertEqual(t.sum, 10);
  });

  it('tetractys levels = [1,2,3,4]', () => {
    const t = np.tetractys();
    assertEqual(t.levels.length, 4);
    assertEqual(t.levels[0] + t.levels[1] + t.levels[2] + t.levels[3], 10);
  });
});

describe('Neoplatonic — Ratio Analysis', () => {
  const np = Neoplatonic.create();

  it('ratio(3, 2) → perfect fifth', () => {
    const r = np.ratio(3, 2);
    assertEqual(r.ratio, '3:2');
    assert(r.interval.includes('fifth'));
  });

  it('ratio(2, 1) → octave', () => {
    const r = np.ratio(2, 1);
    assertEqual(r.ratio, '2:1');
    assert(r.interval.includes('Octave'));
  });

  it('ratio(4, 3) → perfect fourth', () => {
    const r = np.ratio(4, 3);
    assertEqual(r.ratio, '4:3');
    assert(r.interval.includes('fourth'));
  });
});

describe('Neoplatonic — Factorization', () => {
  const np = Neoplatonic.create();

  it('factorize(153) mentions triangular(17)', () => {
    const f = np.factorize(153);
    assert(f.commentary.some(c => c.includes('triangular')));
    assert(f.commentary.some(c => c.includes('17')));
  });

  it('factorize(6) mentions perfect', () => {
    const f = np.factorize(6);
    assert(f.commentary.some(c => c.includes('perfect')));
  });
});

describe('Neoplatonic — Number Meanings', () => {
  const np = Neoplatonic.create();

  it('meaning(1) = The Monad', () => {
    assertEqual(np.numberMeaning(1).name, 'The Monad');
  });

  it('meaning(7) = The Heptad', () => {
    assertEqual(np.numberMeaning(7).name, 'The Heptad');
  });

  it('meaning(10) = The Decad', () => {
    assertEqual(np.numberMeaning(10).name, 'The Decad');
  });
});

describe('Neoplatonic — Presets', () => {
  it('plotinus preset — no deity associations', () => {
    const np = Neoplatonic.create('plotinus');
    const p = np.properties(6);
    assertEqual(p.deity, undefined);
  });

  it('iamblichus preset', () => {
    const np = Neoplatonic.create('iamblichus');
    const p = np.properties(6);
    assert(p.deity !== undefined);
  });

  it('composite preset', () => {
    const np = Neoplatonic.create('composite');
    assert(np.numberMeaning(1) !== null);
  });
});

describe('Neoplatonic — Analyze', () => {
  it('analyze(153) provides full breakdown', () => {
    const np = Neoplatonic.create();
    const result = np.analyze(153);
    assert(result.properties.triangular === true);
    assert(result.factorization !== undefined);
    assert(result.meaning !== undefined);
  });
});

const result = TestRunner.runAll();
if (typeof process !== 'undefined') process.exit(result.failed > 0 ? 1 : 0);
