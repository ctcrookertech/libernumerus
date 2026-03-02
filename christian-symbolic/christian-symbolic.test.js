const TestRunner = require('../shared/test-runner');
const ChristianSymbolic = require('./christian-symbolic');
const { describe, it, assertEqual, assert } = TestRunner;

describe('Christian Symbolic — Number Meanings', () => {
  const cs = ChristianSymbolic.create();

  it('meaning(3) → Trinity', () => {
    const m = cs.meaning(3);
    assertEqual(m.name, 'Trinity');
  });

  it('meaning(7) → creation days, sacraments', () => {
    const m = cs.meaning(7);
    assert(m.description.includes('creation'));
    assert(m.description.includes('sacraments'));
  });

  it('meaning(12) → tribes, apostles', () => {
    const m = cs.meaning(12);
    assert(m.description.includes('12 tribes'));
    assert(m.description.includes('12 apostles'));
  });

  it('meaning(40) → testing, wilderness', () => {
    const m = cs.meaning(40);
    assert(m.description.includes('40'));
  });

  it('meaning(153) → Augustinian analysis', () => {
    const m = cs.meaning(153);
    assert(m.augustinian !== undefined);
    assert(m.augustinian.includes('17'));
  });

  it('meaning(666) → Beast number, Neron Kaisar', () => {
    const m = cs.meaning(666);
    assert(m.description.includes('Neron'));
  });

  it('meaning(888) → Jesus in Greek', () => {
    const m = cs.meaning(888);
    assert(m.description.includes('Jesus'));
    assert(m.description.includes('888'));
  });

  it('meaning(1000) → Millennium', () => {
    const m = cs.meaning(1000);
    assert(m.description.includes('Millennium'));
  });
});

describe('Christian Symbolic — Beast Number Config', () => {
  it('default beast number = 666', () => {
    const cs = ChristianSymbolic.create();
    const m = cs.meaning(666);
    assert(m !== null);
  });

  it('beastNumber=616 → meaning(616) returns variant', () => {
    const cs = ChristianSymbolic.create({ beastNumber: 616 });
    const m = cs.meaning(616);
    assert(m !== null);
    assert(m.description.includes('Papyrus 115'));
  });
});

describe('Christian Symbolic — Augustinian Analysis', () => {
  const cs = ChristianSymbolic.create();

  it('153 = triangular(17), 17 = 10 + 7', () => {
    const a = cs.augustinianAnalysis(153);
    assertEqual(a.triangular, true);
    assertEqual(a.triangularRoot, 17);
    assert(a.commentary.some(c => c.includes('10')));
  });

  it('6 is perfect', () => {
    const a = cs.augustinianAnalysis(6);
    assertEqual(a.perfect, true);
  });
});

describe('Christian Symbolic — Typological Pairs', () => {
  const cs = ChristianSymbolic.create();

  it('typology(12) → OT/NT/Revelation', () => {
    const t = cs.typology(12);
    assertEqual(t.OT, '12 tribes of Israel');
    assertEqual(t.NT, '12 apostles');
    assert(t.Revelation.includes('12 gates'));
  });

  it('typology(7) has all three', () => {
    const t = cs.typology(7);
    assert(t.OT !== null);
    assert(t.NT !== null);
    assert(t.Revelation !== null);
  });
});

describe('Christian Symbolic — Latin Isopsephy', () => {
  it('disabled by default', () => {
    const cs = ChristianSymbolic.create();
    assertEqual(cs.latinValue('DIC LVX'), null);
  });

  it('enabled: DIC LVX → D(500)+I(1)+C(100)+L(50)+V(5)+X(10) = 666', () => {
    const cs = ChristianSymbolic.create({ includeLatinIsopsephy: true });
    assertEqual(cs.latinValue('DIC LVX'), 666);
  });
});

describe('Christian Symbolic — Revelation Analysis', () => {
  const cs = ChristianSymbolic.create();

  it('revelationAnalysis(7) returns data', () => {
    const r = cs.revelationAnalysis(7);
    assert(r !== null);
  });

  it('revelationAnalysis(144000) returns data', () => {
    const r = cs.revelationAnalysis(144000);
    assert(r !== null);
  });

  it('revelationAnalysis(5) returns null (not a Revelation number)', () => {
    assertEqual(cs.revelationAnalysis(5), null);
  });
});

describe('Christian Symbolic — Presets', () => {
  it('all 4 tradition presets work', () => {
    for (const preset of ['catholic', 'orthodox', 'protestant', 'ecumenical']) {
      const cs = ChristianSymbolic.create(preset);
      assert(cs.meaning(7) !== null, preset + ' should have meaning for 7');
    }
  });
});

describe('Christian Symbolic — Analyze', () => {
  it('analyze number returns full breakdown', () => {
    const cs = ChristianSymbolic.create();
    const result = cs.analyze(153);
    assert(result.meaning !== null);
    assert(result.augustinian !== undefined);
  });

  it('analyze string with Latin isopsephy', () => {
    const cs = ChristianSymbolic.create({ includeLatinIsopsephy: true });
    const result = cs.analyze('DIC LVX');
    assertEqual(result.latinValue, 666);
  });
});

const result = TestRunner.runAll();
if (typeof process !== 'undefined') process.exit(result.failed > 0 ? 1 : 0);
