const TestRunner = require('../../shared/test-runner');
const CelticOgham = require('./celtic-ogham');
const { describe, it, assertEqual, assertDeepEqual, assert } = TestRunner;

// ── Letter Position Lookups ──────────────────────────────────────────────

describe('Celtic Ogham — Letter Positions', () => {
  const og = CelticOgham.create();

  it('letterPosition(Beith) → aicme:1, posInAicme:1, overall:1, tree:Birch', () => {
    const pos = og.letterPosition('Beith');
    assertEqual(pos.aicme, 1);
    assertEqual(pos.posInAicme, 1);
    assertEqual(pos.overall, 1);
    assertEqual(pos.tree, 'Birch');
  });

  it('letterPosition(Luis) → aicme:1, posInAicme:2, overall:2, tree:Rowan', () => {
    const pos = og.letterPosition('Luis');
    assertEqual(pos.aicme, 1);
    assertEqual(pos.posInAicme, 2);
    assertEqual(pos.overall, 2);
    assertEqual(pos.tree, 'Rowan');
  });

  it('letterPosition(Duir) → aicme:2, posInAicme:2, overall:7, tree:Oak', () => {
    const pos = og.letterPosition('Duir');
    assertEqual(pos.aicme, 2);
    assertEqual(pos.posInAicme, 2);
    assertEqual(pos.overall, 7);
    assertEqual(pos.tree, 'Oak');
  });

  it('letterPosition(Iodhadh) → aicme:4, posInAicme:5, overall:20, tree:Yew', () => {
    const pos = og.letterPosition('Iodhadh');
    assertEqual(pos.aicme, 4);
    assertEqual(pos.posInAicme, 5);
    assertEqual(pos.overall, 20);
    assertEqual(pos.tree, 'Yew');
  });

  it('letterPosition returns null for unknown name', () => {
    const pos = og.letterPosition('Unknown');
    assertEqual(pos, null);
  });

  it('letterPosition is case-insensitive', () => {
    const pos = og.letterPosition('beith');
    assertEqual(pos.name, 'Beith');
    assertEqual(pos.overall, 1);
  });
});

// ── Aicme Structure ─────────────────────────────────────────────────────

describe('Celtic Ogham — Aicme Structure', () => {
  it('4 aicme x 5 = 20 core letters', () => {
    assertEqual(CelticOgham.OGHAM_LETTERS.length, 20);
  });

  it('each aicme contains exactly 5 letters', () => {
    for (let a = 1; a <= 4; a++) {
      const count = CelticOgham.OGHAM_LETTERS.filter(l => l.aicme === a).length;
      assertEqual(count, 5, 'Aicme ' + a + ' should have 5 letters');
    }
  });

  it('overall positions run 1 through 20', () => {
    for (let i = 0; i < 20; i++) {
      assertEqual(CelticOgham.OGHAM_LETTERS[i].overall, i + 1);
    }
  });

  it('each letter has a Unicode Ogham character', () => {
    for (const letter of CelticOgham.OGHAM_LETTERS) {
      const code = letter.character.codePointAt(0);
      assert(code >= 0x1681 && code <= 0x1694,
        letter.name + ' should have Ogham codepoint, got U+' + code.toString(16).toUpperCase());
    }
  });
});

// ── Forfeda ──────────────────────────────────────────────────────────────

describe('Celtic Ogham — Forfeda', () => {
  it('forfeda disabled by default → 20 letters', () => {
    const og = CelticOgham.create();
    const letters = og.getLetters();
    assertEqual(letters.length, 20);
  });

  it('forfeda enabled → 25 letters', () => {
    const og = CelticOgham.create({ forfeda: true });
    const letters = og.getLetters();
    assertEqual(letters.length, 25);
  });

  it('5 forfeda exist in the static array', () => {
    assertEqual(CelticOgham.FORFEDA.length, 5);
  });

  it('forfeda overall positions are 21-25', () => {
    for (let i = 0; i < CelticOgham.FORFEDA.length; i++) {
      assertEqual(CelticOgham.FORFEDA[i].overall, 21 + i);
    }
  });

  it('forfeda can be looked up by name when enabled', () => {
    const og = CelticOgham.create({ forfeda: true });
    const pos = og.letterPosition('Ór');
    assert(pos !== null, 'Ór should be found');
    assertEqual(pos.overall, 22);
    assertEqual(pos.isForfeda, true);
  });
});

// ── Graves Calendar ──────────────────────────────────────────────────────

describe('Celtic Ogham — Graves Calendar', () => {
  it('Graves disabled by default: returns warning and null data', () => {
    const og = CelticOgham.create();
    const cal = og.gravesCalendar();
    assertEqual(cal.data, null);
    assert(typeof cal.warning === 'string', 'Should include warning string');
  });

  it('Graves enabled: returns 13 months with modern-construction warning', () => {
    const og = CelticOgham.create({ includeGraves: true });
    const cal = og.gravesCalendar();
    assert(cal.data !== null, 'Data should not be null when enabled');
    assertEqual(cal.data.length, 13);
    assert(cal.warning.indexOf('1948') !== -1, 'Warning should mention 1948');
    assert(cal.warning.indexOf('modern') !== -1, 'Warning should mention modern construction');
  });

  it('Graves calendar months are numbered 1 to 13', () => {
    const og = CelticOgham.create({ includeGraves: true });
    const cal = og.gravesCalendar();
    for (let i = 0; i < 13; i++) {
      assertEqual(cal.data[i].month, i + 1);
    }
  });

  it('Graves static data has 13 entries', () => {
    assertEqual(CelticOgham.GRAVES_CALENDAR.length, 13);
  });
});

// ── Tree Associations ────────────────────────────────────────────────────

describe('Celtic Ogham — Tree Associations', () => {
  it('default (ballymote): Ailm → Pine/Fir', () => {
    const og = CelticOgham.create();
    const pos = og.letterPosition('Ailm');
    assertEqual(pos.tree, 'Pine/Fir');
  });

  it('graves: Ailm → Silver Fir', () => {
    const og = CelticOgham.create({ treeAssociations: 'graves' });
    const pos = og.letterPosition('Ailm');
    assertEqual(pos.tree, 'Silver Fir');
  });

  it('both: Ailm includes ballymote and graves trees', () => {
    const og = CelticOgham.create({ treeAssociations: 'both' });
    const pos = og.letterPosition('Ailm');
    assertEqual(pos.treeBallymote, 'Pine/Fir');
    assertEqual(pos.treeGraves, 'Silver Fir');
  });
});

// ── Presets ──────────────────────────────────────────────────────────────

describe('Celtic Ogham — Presets', () => {
  it('historical preset: no Graves, no forfeda, ballymote trees', () => {
    const og = CelticOgham.create('historical');
    const cfg = og.getConfig();
    assertEqual(cfg.includeGraves, false);
    assertEqual(cfg.forfeda, false);
    assertEqual(cfg.treeAssociations, 'ballymote');
  });

  it('neopagan preset: Graves on, forfeda on, graves trees', () => {
    const og = CelticOgham.create('neopagan');
    const cfg = og.getConfig();
    assertEqual(cfg.includeGraves, true);
    assertEqual(cfg.forfeda, true);
    assertEqual(cfg.treeAssociations, 'graves');
  });

  it('scholarly preset: no Graves, forfeda on, both trees', () => {
    const og = CelticOgham.create('scholarly');
    const cfg = og.getConfig();
    assertEqual(cfg.includeGraves, false);
    assertEqual(cfg.forfeda, true);
    assertEqual(cfg.treeAssociations, 'both');
  });
});

// ── Triad Lookup ─────────────────────────────────────────────────────────

describe('Celtic Ogham — Triads', () => {
  it('triad(3) returns an Irish triadic saying', () => {
    const og = CelticOgham.create();
    const t = og.triad(3);
    assert(t !== null, 'Triad 3 should exist');
    assertEqual(t.number, 3);
    assert(typeof t.irish === 'string' && t.irish.length > 0, 'Should have Irish text');
    assert(typeof t.english === 'string' && t.english.length > 0, 'Should have English text');
  });

  it('triad(7) returns a saying about seven gifts', () => {
    const og = CelticOgham.create();
    const t = og.triad(7);
    assert(t !== null, 'Triad 7 should exist');
    assertEqual(t.number, 7);
  });

  it('triad for non-existent number returns null', () => {
    const og = CelticOgham.create();
    const t = og.triad(999);
    assertEqual(t, null);
  });

  it('triadNumbers returns available triad keys', () => {
    const og = CelticOgham.create();
    const nums = og.triadNumbers();
    assert(nums.length > 0, 'Should have at least one triad');
    assert(nums.includes(3), 'Should include 3');
    assert(nums.includes(7), 'Should include 7');
  });
});

// ── Name Analysis ────────────────────────────────────────────────────────

describe('Celtic Ogham — Name Analysis', () => {
  it('nameAnalysis(BRIGID) transliterates and sums values', () => {
    const og = CelticOgham.create();
    const result = og.nameAnalysis('BRIGID');
    assert(result !== null, 'Result should not be null');
    assertEqual(result.input, 'BRIGID');
    assert(result.transliteration.length > 0, 'Should have transliterated letters');
    assert(result.sum > 0, 'Sum should be positive');
    assert(typeof result.oghamString === 'string' && result.oghamString.length > 0, 'Should have Ogham string');

    // B=1(Beith), R=15(Ruis), I=20(Iodhadh), G=12(Gort), I=20(Iodhadh), D=7(Duir)
    // Sum = 1 + 15 + 20 + 12 + 20 + 7 = 75
    assertEqual(result.sum, 75);
    assertEqual(result.letterCount, 6);
  });

  it('nameAnalysis handles lowercase input', () => {
    const og = CelticOgham.create();
    const result = og.nameAnalysis('brigid');
    assertEqual(result.sum, 75);
  });

  it('nameAnalysis returns null for empty string', () => {
    const og = CelticOgham.create();
    assertEqual(og.nameAnalysis(''), null);
  });

  it('nameAnalysis skips non-letter characters', () => {
    const og = CelticOgham.create();
    const result = og.nameAnalysis('B-R');
    assertEqual(result.letterCount, 2);
    // B=1 + R=15 = 16
    assertEqual(result.sum, 16);
  });
});

// ── Divination Draw ──────────────────────────────────────────────────────

describe('Celtic Ogham — Divination Draw', () => {
  it('single draw returns 1 fid', () => {
    const og = CelticOgham.create();
    const draw = og.divinationDraw(1);
    assertEqual(draw.count, 1);
    assertEqual(draw.feda.length, 1);
    assert(typeof draw.feda[0].name === 'string', 'Drawn fid should have a name');
  });

  it('multi draw returns correct count', () => {
    const og = CelticOgham.create();
    const draw = og.divinationDraw(3);
    assertEqual(draw.count, 3);
    assertEqual(draw.feda.length, 3);
  });

  it('draw without replacement: no duplicates', () => {
    const og = CelticOgham.create();
    const draw = og.divinationDraw(20);
    const names = draw.feda.map(f => f.name);
    const unique = new Set(names);
    assertEqual(unique.size, 20);
  });

  it('draw capped at pool size', () => {
    const og = CelticOgham.create();
    const draw = og.divinationDraw(100);
    assertEqual(draw.count, 20);
  });

  it('draw with forfeda uses 25-letter pool', () => {
    const og = CelticOgham.create({ forfeda: true });
    const draw = og.divinationDraw(25);
    assertEqual(draw.count, 25);
  });

  it('default draw (no argument) returns 1 fid', () => {
    const og = CelticOgham.create();
    const draw = og.divinationDraw();
    assertEqual(draw.count, 1);
  });
});

const result = TestRunner.runAll();
if (typeof process !== 'undefined') process.exit(result.failed > 0 ? 1 : 0);
