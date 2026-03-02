const TestRunner = require('../shared/test-runner');
const ArabicAbjad = require('./arabic-abjad');
const { describe, it, assertEqual, assert } = TestRunner;

describe('Arabic Abjad — Letter Values', () => {
  const aa = ArabicAbjad.create();

  it('Alif (أ) = 1', () => {
    assertEqual(aa.letterValue('\u0623'), 1);
  });

  it('Ghayn (غ) = 1000', () => {
    assertEqual(aa.letterValue('\u063A'), 1000);
  });

  it('Ba (ب) = 2', () => {
    assertEqual(aa.letterValue('\u0628'), 2);
  });

  it('Ya (ي) = 10', () => {
    assertEqual(aa.letterValue('\u064A'), 10);
  });
});

describe('Arabic Abjad — Word Values (Verification)', () => {
  const aa = ArabicAbjad.create();

  it('Allah (الله) = 66', () => {
    // Alif=1 + Lam=30 + Lam=30 + Ha=5 = 66
    assertEqual(aa.wordValue('\u0627\u0644\u0644\u0647'), 66);
  });

  it('Muhammad (محمد) = 92', () => {
    // Mim=40 + Hha=8 + Mim=40 + Dal=4 = 92
    assertEqual(aa.wordValue('\u0645\u062D\u0645\u062F'), 92);
  });

  it('Bismillah (بسم الله الرحمن الرحيم) = 786', () => {
    assertEqual(aa.wordValue('\u0628\u0633\u0645 \u0627\u0644\u0644\u0647 \u0627\u0644\u0631\u062D\u0645\u0646 \u0627\u0644\u0631\u062D\u064A\u0645'), 786);
  });
});

describe('Arabic Abjad — Small Calculation (Hisab al-Saghir)', () => {
  const aa = ArabicAbjad.create();

  it('smallCalc of Allah (66) reduces to 3', () => {
    assertEqual(aa.smallCalc('\u0627\u0644\u0644\u0647'), 3);
  });
});

describe('Arabic Abjad — Chronogram', () => {
  const aa = ArabicAbjad.create();

  it('chronogram returns Hijri year', () => {
    const result = aa.chronogram('\u0627\u0644\u0644\u0647');
    assertEqual(result.hijriYear, 66);
  });
});

describe('Arabic Abjad — Elemental Attribution', () => {
  const aa = ArabicAbjad.create();

  it('Alif element = fire', () => {
    assertEqual(aa.elementOf('\u0627'), 'fire');
  });

  it('Ba element = air', () => {
    assertEqual(aa.elementOf('\u0628'), 'air');
  });

  it('Jim element = water', () => {
    assertEqual(aa.elementOf('\u062C'), 'water');
  });

  it('Dal element = earth', () => {
    assertEqual(aa.elementOf('\u062F'), 'earth');
  });
});

describe('Arabic Abjad — Maghrebi Variant', () => {
  it('Sin has different value in Maghrebi ordering', () => {
    const standard = ArabicAbjad.create('standard');
    const maghrebi = ArabicAbjad.create('maghrebi');
    const sinStandard = standard.letterValue('\u0633');
    const sinMaghrebi = maghrebi.letterValue('\u0633');
    // In Eastern: Sin=60, In Maghrebi: Sin=1000
    assertEqual(sinStandard, 60);
    assertEqual(sinMaghrebi, 1000);
  });
});

describe('Arabic Abjad — Hamza Config', () => {
  it('Hamza included by default', () => {
    const aa = ArabicAbjad.create();
    assertEqual(aa.letterValue('\u0621'), 1);
  });

  it('Hamza excluded when configured', () => {
    const aa = ArabicAbjad.create({ includeHamza: false });
    assertEqual(aa.letterValue('\u0621'), 0);
  });
});

describe('Arabic Abjad — Presets', () => {
  it('standard preset', () => {
    const aa = ArabicAbjad.create('standard');
    assertEqual(aa.wordValue('\u0627\u0644\u0644\u0647'), 66);
  });

  it('sufi preset', () => {
    const aa = ArabicAbjad.create('sufi');
    assertEqual(aa.wordValue('\u0627\u0644\u0644\u0647'), 66);
  });
});

describe('Arabic Abjad — Analyze', () => {
  const aa = ArabicAbjad.create();

  it('analyze string', () => {
    const result = aa.analyze('\u0627\u0644\u0644\u0647');
    assertEqual(result.jumal, 66);
    assert(result.saghir > 0);
  });
});

const result = TestRunner.runAll();
if (typeof process !== 'undefined') process.exit(result.failed > 0 ? 1 : 0);
