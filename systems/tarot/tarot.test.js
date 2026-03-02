const TestRunner = require('../../shared/test-runner');
const Tarot = require('./tarot');
const { describe, it, assertEqual, assert } = TestRunner;

describe('Tarot — Birth Card', () => {
  it('July 4, 1776 → The Hierophant (5)', () => {
    const t = Tarot.create();
    const bc = t.birthCard({ month: 7, day: 4, year: 1776 });
    // 7+4+1+7+7+6 = 32 → 3+2 = 5
    assertEqual(bc.value, 5);
    assertEqual(bc.card.name, 'The Hierophant');
  });

  it('Dec 25, 1990 → 11 → Justice (Waite) or Lust (Crowley)', () => {
    const tw = Tarot.create('waite');
    const bc = tw.birthCard({ month: 12, day: 25, year: 1990 });
    // 1+2+2+5+1+9+9+0 = 29 → 2+9 = 11
    assertEqual(bc.value, 11);
    assertEqual(bc.card.name, 'Justice');

    const tc = Tarot.create('crowley');
    const bc2 = tc.birthCard({ month: 12, day: 25, year: 1990 });
    assertEqual(bc2.value, 11);
    assertEqual(bc2.card.name, 'Lust');
  });
});

describe('Tarot — Reduction Chain', () => {
  it('reductionChain(19) → Sun, Wheel, Magician', () => {
    const t = Tarot.create();
    const chain = t.reductionChain(19);
    assertEqual(chain[0].number, 19);
    assertEqual(chain[0].name, 'The Sun');
    assertEqual(chain[1].number, 10);
    assertEqual(chain[1].name, 'Wheel of Fortune');
    assertEqual(chain[2].number, 1);
    assertEqual(chain[2].name, 'The Magician');
  });
});

describe('Tarot — Justice/Strength Swap', () => {
  it('Waite: card 8 = Strength', () => {
    const t = Tarot.create('waite');
    assertEqual(t.getCard(8).name, 'Strength');
  });

  it('Waite: card 11 = Justice', () => {
    const t = Tarot.create('waite');
    assertEqual(t.getCard(11).name, 'Justice');
  });

  it('Marseille: card 8 = La Justice', () => {
    const t = Tarot.create('marseille');
    assertEqual(t.getCard(8).name, 'La Justice');
  });

  it('Marseille: card 11 = La Force', () => {
    const t = Tarot.create('marseille');
    assertEqual(t.getCard(11).name, 'La Force');
  });

  it('Crowley: card 8 = Adjustment', () => {
    const t = Tarot.create('crowley');
    assertEqual(t.getCard(8).name, 'Adjustment');
  });

  it('Crowley: card 11 = Lust', () => {
    const t = Tarot.create('crowley');
    assertEqual(t.getCard(11).name, 'Lust');
  });
});

describe('Tarot — Hebrew Letter Correspondences', () => {
  it('GD: Fool (0) → Aleph', () => {
    const t = Tarot.create('waite');
    assertEqual(t.hebrewLetter(0), '\u05D0');
  });

  it('Levi/Marseille: Magician (1) → Aleph', () => {
    const t = Tarot.create('marseille');
    assertEqual(t.hebrewLetter(1), '\u05D0');
  });
});

describe('Tarot — Fool Placement', () => {
  it('Waite/Crowley: Fool = 0 at beginning', () => {
    const t = Tarot.create('waite');
    const fool = t.getCard(0);
    assertEqual(fool.name, 'The Fool');
  });

  it('Marseille: Fool is unnumbered', () => {
    const t = Tarot.create('marseille');
    const fool = t.getCard(null);
    assert(fool !== null);
    assert(fool.name.includes('Fool') || fool.name.includes('Mat'));
  });
});

describe('Tarot — Crowley Card Names', () => {
  const t = Tarot.create('crowley');

  it('card 11 = Lust (not Strength)', () => {
    assertEqual(t.getCard(11).name, 'Lust');
  });

  it('card 8 = Adjustment (not Justice)', () => {
    assertEqual(t.getCard(8).name, 'Adjustment');
  });

  it('card 20 = The Aeon (not Judgement)', () => {
    assertEqual(t.getCard(20).name, 'The Aeon');
  });

  it('card 21 = The Universe (not The World)', () => {
    assertEqual(t.getCard(21).name, 'The Universe');
  });
});

describe('Tarot — Year Card', () => {
  it('yearCard(2026) → Wheel of Fortune (10)', () => {
    const t = Tarot.create();
    const yc = t.yearCard(2026);
    // 2+0+2+6 = 10
    assertEqual(yc.value, 10);
    assertEqual(yc.card.name, 'Wheel of Fortune');
  });
});

describe('Tarot — Minor Arcana', () => {
  it('pipMeaning(5, swords) returns meaning', () => {
    const t = Tarot.create();
    const pm = t.pipMeaning(5, 'swords');
    assertEqual(pm.element, 'Air');
    assert(pm.meaning !== null);
  });

  it('sephirotic pips: 5 of swords → Gevurah', () => {
    const t = Tarot.create({ sephiroticPips: true });
    const pm = t.pipMeaning(5, 'swords');
    assertEqual(pm.sefirah, 'Gevurah');
  });

  it('sephirotic pips disabled by default', () => {
    const t = Tarot.create();
    const pm = t.pipMeaning(5, 'swords');
    assertEqual(pm.sefirah, undefined);
  });
});

describe('Tarot — Presets', () => {
  it('all 4 presets work', () => {
    for (const preset of ['marseille', 'waite', 'crowley', 'goldenDawn']) {
      const t = Tarot.create(preset);
      assert(t.getCard(1) !== null, preset + ' should have card 1');
    }
  });
});

describe('Tarot — Analyze', () => {
  it('analyze date returns birth card and year card', () => {
    const t = Tarot.create();
    const result = t.analyze({ month: 7, day: 4, year: 1776 });
    assert(result.birthCard !== undefined);
    assert(result.yearCard !== undefined);
  });

  it('analyze number returns card', () => {
    const t = Tarot.create();
    const result = t.analyze(5);
    assertEqual(result.card.name, 'The Hierophant');
  });
});

const result = TestRunner.runAll();
if (typeof process !== 'undefined') process.exit(result.failed > 0 ? 1 : 0);
