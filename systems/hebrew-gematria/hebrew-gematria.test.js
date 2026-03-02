const TestRunner = require('../../shared/test-runner');
const HebrewGematria = require('./hebrew-gematria');
const { describe, it, assertEqual, assertDeepEqual, assert } = TestRunner;

describe('Hebrew Gematria — Standard (Hechrachi)', () => {
  const hg = HebrewGematria.create();

  it('YHVH (יהוה) = 26', () => {
    assertEqual(hg.wordValue('\u05D9\u05D4\u05D5\u05D4'), 26);
  });

  it('Echad (אחד) = 13', () => {
    assertEqual(hg.wordValue('\u05D0\u05D7\u05D3'), 13);
  });

  it('Ahavah (אהבה) = 13', () => {
    assertEqual(hg.wordValue('\u05D0\u05D4\u05D1\u05D4'), 13);
  });

  it('Echad = Ahavah (Unity = Love)', () => {
    const echad = hg.wordValue('\u05D0\u05D7\u05D3');
    const ahavah = hg.wordValue('\u05D0\u05D4\u05D1\u05D4');
    assertEqual(echad, ahavah);
  });

  it('Chai (חי) = 18', () => {
    assertEqual(hg.wordValue('\u05D7\u05D9'), 18);
  });

  it('Mashiach (משיח) = 358', () => {
    assertEqual(hg.wordValue('\u05DE\u05E9\u05D9\u05D7'), 358);
  });

  it('Nachash (נחש) = 358', () => {
    assertEqual(hg.wordValue('\u05E0\u05D7\u05E9'), 358);
  });

  it('Mashiach = Nachash (Messiah = Serpent)', () => {
    const mashiach = hg.wordValue('\u05DE\u05E9\u05D9\u05D7');
    const nachash = hg.wordValue('\u05E0\u05D7\u05E9');
    assertEqual(mashiach, nachash);
  });
});

describe('Hebrew Gematria — Letter Values', () => {
  const hg = HebrewGematria.create();

  it('Aleph (א) standard = 1', () => {
    assertEqual(hg.letterValue('\u05D0'), 1);
  });

  it('Tav (ת) standard = 400', () => {
    assertEqual(hg.letterValue('\u05EA'), 400);
  });

  it('Yod (י) standard = 10', () => {
    assertEqual(hg.letterValue('\u05D9'), 10);
  });
});

describe('Hebrew Gematria — Ordinal (Siduri)', () => {
  const hg = HebrewGematria.create({ method: 'siduri' });

  it('Aleph ordinal = 1', () => {
    assertEqual(hg.letterValue('\u05D0'), 1);
  });

  it('Tav ordinal = 22', () => {
    assertEqual(hg.letterValue('\u05EA'), 22);
  });

  it('Kaf ordinal = 11', () => {
    assertEqual(hg.letterValue('\u05DB'), 11);
  });
});

describe('Hebrew Gematria — Small (Katan)', () => {
  const hg = HebrewGematria.create({ method: 'katan' });

  it('Aleph katan = 1', () => {
    assertEqual(hg.letterValue('\u05D0'), 1);
  });

  it('Tav katan = 4 (400 → 4)', () => {
    assertEqual(hg.letterValue('\u05EA'), 4);
  });

  it('Yod katan = 1 (10 → 1)', () => {
    assertEqual(hg.letterValue('\u05D9'), 1);
  });

  it('Kaf katan = 2 (20 → 2)', () => {
    assertEqual(hg.letterValue('\u05DB'), 2);
  });
});

describe('Hebrew Gematria — Gadol (Sofit extended)', () => {
  it('Kaf sofit (ך) gadol = 500', () => {
    const hg = HebrewGematria.create({ method: 'gadol' });
    assertEqual(hg.letterValue('\u05DA'), 500);
  });

  it('Mem sofit (ם) gadol = 600', () => {
    const hg = HebrewGematria.create({ method: 'gadol' });
    assertEqual(hg.letterValue('\u05DD'), 600);
  });

  it('Kaf sofit (ך) standard (no sofit) = 20', () => {
    const hg = HebrewGematria.create({ sofitValues: 'standard' });
    assertEqual(hg.letterValue('\u05DA'), 20);
  });
});

describe('Hebrew Gematria — Kolel', () => {
  it('Kolel of YHVH = 27 (26 + 1)', () => {
    const hg = HebrewGematria.create();
    assertEqual(hg.kolel('\u05D9\u05D4\u05D5\u05D4'), 27);
  });
});

describe('Hebrew Gematria — AIQ BKR', () => {
  const hg = HebrewGematria.create();

  it('Aleph → 1', () => {
    assertEqual(hg.aiqBkr('\u05D0'), 1);
  });

  it('Yod → 1 (same chamber as Aleph)', () => {
    assertEqual(hg.aiqBkr('\u05D9'), 1);
  });

  it('Qof → 1 (same chamber as Aleph, Yod)', () => {
    assertEqual(hg.aiqBkr('\u05E7'), 1);
  });

  it('Bet → 2', () => {
    assertEqual(hg.aiqBkr('\u05D1'), 2);
  });

  it('Resh → 2 (same chamber as Bet)', () => {
    assertEqual(hg.aiqBkr('\u05E8'), 2);
  });
});

describe('Hebrew Gematria — Sefirot', () => {
  it('Sefirah 1 = Keter', () => {
    const hg = HebrewGematria.create();
    const s = hg.sefirah(1);
    assertEqual(s.name, 'Keter');
    assertEqual(s.translation, 'Crown');
  });

  it('Sefirah 6 = Tiferet', () => {
    const hg = HebrewGematria.create();
    assertEqual(hg.sefirah(6).name, 'Tiferet');
  });

  it('Sefirah 10 = Malkut', () => {
    const hg = HebrewGematria.create();
    assertEqual(hg.sefirah(10).name, 'Malkut');
  });
});

describe('Hebrew Gematria — Tree Paths', () => {
  it('Kircher: path 11 connects Keter-Chokmah (Aleph)', () => {
    const hg = HebrewGematria.create({ treeArrangement: 'kircher' });
    const p = hg.letterPath(11);
    assertEqual(p.letter, '\u05D0');
    assert(p.connects.includes('Keter'));
    assert(p.connects.includes('Chokmah'));
  });

  it('GRA arrangement available', () => {
    const hg = HebrewGematria.create('gra');
    const p = hg.letterPath(11);
    assert(p !== null);
  });
});

describe('Hebrew Gematria — Equivalence Finder', () => {
  it('findEquivalences(13) returns Echad and Ahavah', () => {
    const hg = HebrewGematria.create();
    const equivs = hg.findEquivalences(13);
    assertEqual(equivs.length, 2);
  });

  it('findEquivalences(358) returns Mashiach and Nachash', () => {
    const hg = HebrewGematria.create();
    const equivs = hg.findEquivalences(358);
    assertEqual(equivs.length, 2);
  });
});

describe('Hebrew Gematria — Presets', () => {
  it('traditional preset', () => {
    const hg = HebrewGematria.create('traditional');
    assertEqual(hg.wordValue('\u05D9\u05D4\u05D5\u05D4'), 26);
  });

  it('lurianic preset uses extended sofit', () => {
    const hg = HebrewGematria.create('lurianic');
    // With extended sofit, Kaf sofit = 500
    assertEqual(hg.letterValue('\u05DA'), 500);
  });
});

describe('Hebrew Gematria — Analyze', () => {
  it('analyze string input', () => {
    const hg = HebrewGematria.create();
    const result = hg.analyze('\u05D9\u05D4\u05D5\u05D4');
    assertEqual(result.standard, 26);
    assertEqual(result.kolel, 27);
    assert(result.katan > 0);
    assert(result.ordinal > 0);
  });

  it('analyze number input', () => {
    const hg = HebrewGematria.create();
    const result = hg.analyze(26);
    assert(result.equivalences.length > 0);
  });
});

const result = TestRunner.runAll();
if (typeof process !== 'undefined') process.exit(result.failed > 0 ? 1 : 0);
