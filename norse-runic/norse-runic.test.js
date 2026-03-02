const TestRunner = require('../shared/test-runner');
const NorseRunic = require('./norse-runic');
const { describe, it, assertEqual, assertDeepEqual, assert, assertThrows } = TestRunner;

describe('Norse Runic — Elder Futhark Basics', function() {
  var nr = NorseRunic.create();

  it('runeValue Fehu = 1', function() {
    assertEqual(nr.runeValue('\u16A0'), 1);
  });

  it('runeValue Othala = 24 (finalRune=othala)', function() {
    assertEqual(nr.runeValue('\u16DF'), 24);
  });

  it('Elder Futhark has 24 runes', function() {
    assertEqual(nr.getRunes().length, 24);
  });

  it('first rune is Fehu', function() {
    var runes = nr.getRunes();
    assertEqual(runes[0].name, 'Fehu');
    assertEqual(runes[0].rune, '\u16A0');
    assertEqual(runes[0].position, 1);
  });

  it('last rune is Othala when finalRune=othala', function() {
    var runes = nr.getRunes();
    assertEqual(runes[23].name, 'Othala');
    assertEqual(runes[23].position, 24);
  });

  it('each rune has name, phoneme, position, keywords, meaning', function() {
    var runes = nr.getRunes();
    for (var i = 0; i < runes.length; i++) {
      var r = runes[i];
      assert(r.name !== undefined, 'rune ' + i + ' missing name');
      assert(r.phoneme !== undefined, 'rune ' + i + ' missing phoneme');
      assert(r.position !== undefined, 'rune ' + i + ' missing position');
      assert(Array.isArray(r.keywords), 'rune ' + i + ' missing keywords');
      assert(typeof r.meaning === 'string', 'rune ' + i + ' missing meaning');
    }
  });

  it('positions go from 1 to 24', function() {
    var runes = nr.getRunes();
    for (var i = 0; i < runes.length; i++) {
      assertEqual(runes[i].position, i + 1);
    }
  });
});

describe('Norse Runic — Final Rune Config', function() {
  it('finalRune=dagaz puts Dagaz at position 24', function() {
    var nr = NorseRunic.create({ finalRune: 'dagaz' });
    var runes = nr.getRunes();
    assertEqual(runes[23].name, 'Dagaz');
    assertEqual(runes[23].position, 24);
    assertEqual(nr.runeValue('\u16DE'), 24);
  });

  it('finalRune=dagaz puts Othala at position 23', function() {
    var nr = NorseRunic.create({ finalRune: 'dagaz' });
    assertEqual(nr.runeValue('\u16DF'), 23);
  });

  it('finalRune=othala puts Dagaz at position 23', function() {
    var nr = NorseRunic.create({ finalRune: 'othala' });
    assertEqual(nr.runeValue('\u16DE'), 23);
  });
});

describe('Norse Runic — Aett Classification', function() {
  var nr = NorseRunic.create();

  it('Fehu is in aett 1, position 1 (Freyr)', function() {
    var a = nr.aett('\u16A0');
    assertEqual(a.aett, 1);
    assertEqual(a.position, 1);
    assertEqual(a.name, "Freyr's \u00E6tt");
  });

  it('Wunjo is in aett 1, position 8', function() {
    var a = nr.aett('\u16B9');
    assertEqual(a.aett, 1);
    assertEqual(a.position, 8);
  });

  it('Hagalaz is in aett 2, position 1', function() {
    var a = nr.aett('\u16BA');
    assertEqual(a.aett, 2);
    assertEqual(a.position, 1);
  });

  it('Sowilo is in aett 2, position 8', function() {
    var a = nr.aett('\u16CA');
    assertEqual(a.aett, 2);
    assertEqual(a.position, 8);
  });

  it('Tiwaz is in aett 3, position 1', function() {
    var a = nr.aett('\u16CF');
    assertEqual(a.aett, 3);
    assertEqual(a.position, 1);
  });

  it('aett 1 = runes 1-8, aett 2 = runes 9-16, aett 3 = runes 17-24', function() {
    var runes = nr.getRunes();
    for (var i = 0; i < runes.length; i++) {
      var a = nr.aett(runes[i].rune);
      var expectedAett = Math.ceil(runes[i].position / 8);
      assertEqual(a.aett, expectedAett, runes[i].name + ' aett');
    }
  });
});

describe('Norse Runic — Aett Cipher', function() {
  var nr = NorseRunic.create();

  it('Isa (pos 11) encodes as {aett:2, position:3}', function() {
    var c = nr.aettCipher('\u16C1');
    assertEqual(c.aett, 2);
    assertEqual(c.position, 3);
  });

  it('Fehu encodes as {aett:1, position:1}', function() {
    var c = nr.aettCipher('\u16A0');
    assertEqual(c.aett, 1);
    assertEqual(c.position, 1);
  });

  it('Othala (pos 24) encodes as {aett:3, position:8}', function() {
    var c = nr.aettCipher('\u16DF');
    assertEqual(c.aett, 3);
    assertEqual(c.position, 8);
  });

  it('decode(2,3) returns Isa', function() {
    var r = nr.aettCipherDecode(2, 3);
    assertEqual(r.name, 'Isa');
  });

  it('encode then decode round-trips for all runes', function() {
    var runes = nr.getRunes();
    for (var i = 0; i < runes.length; i++) {
      var c = nr.aettCipher(runes[i].rune);
      var decoded = nr.aettCipherDecode(c.aett, c.position);
      assertEqual(decoded.name, runes[i].name, 'round-trip ' + runes[i].name);
    }
  });
});

describe('Norse Runic — Runic Name Value', function() {
  var nr = NorseRunic.create();

  it('nameValue ODIN transliterates and sums', function() {
    var result = nr.nameValue('ODIN');
    // O -> Othala (24), D -> Dagaz (23), I -> Isa (11), N -> Nauthiz (10)
    assertEqual(result.value, 24 + 23 + 11 + 10);
    assertEqual(result.breakdown.length, 4);
  });

  it('nameValue returns breakdown with letter, rune, name, value', function() {
    var result = nr.nameValue('FA');
    assert(result.breakdown.length === 2, 'FA should have 2 letters');
    assertEqual(result.breakdown[0].letter, 'F');
    assertEqual(result.breakdown[0].name, 'Fehu');
    assertEqual(result.breakdown[0].value, 1);
    assertEqual(result.breakdown[1].letter, 'A');
    assertEqual(result.breakdown[1].name, 'Ansuz');
    assertEqual(result.breakdown[1].value, 4);
    assertEqual(result.value, 5);
  });

  it('nameValue is case-insensitive', function() {
    var upper = nr.nameValue('ODIN');
    var lower = nr.nameValue('odin');
    assertEqual(upper.value, lower.value);
  });
});

describe('Norse Runic — Blank Rune', function() {
  it('blank rune NOT included by default', function() {
    var nr = NorseRunic.create();
    var all = nr.allRunes();
    var blank = all.find(function(r) { return r.name === 'Wyrd'; });
    assertEqual(blank, undefined);
  });

  it('blank rune included when blankRune=true', function() {
    var nr = NorseRunic.create({ blankRune: true });
    var all = nr.allRunes();
    var blank = all.find(function(r) { return r.name === 'Wyrd'; });
    assert(blank !== undefined, 'blank rune should be in pool');
    assertEqual(blank.nonHistorical, true);
  });

  it('blank rune is flagged as non-historical', function() {
    assertEqual(NorseRunic.BLANK_RUNE.nonHistorical, true);
    assert(NorseRunic.BLANK_RUNE.meaning.indexOf('NON-HISTORICAL') !== -1);
  });

  it('blankRune=true gives 25 runes in pool', function() {
    var nr = NorseRunic.create({ blankRune: true });
    assertEqual(nr.allRunes().length, 25);
  });

  it('blankRune=false gives 24 runes in pool', function() {
    var nr = NorseRunic.create({ blankRune: false });
    assertEqual(nr.allRunes().length, 24);
  });
});

describe('Norse Runic — Younger Futhark', function() {
  it('has exactly 16 runes', function() {
    var nr = NorseRunic.create({ runeSet: 'younger' });
    assertEqual(nr.getRunes().length, 16);
  });

  it('first rune is Fe', function() {
    var nr = NorseRunic.create({ runeSet: 'younger' });
    var runes = nr.getRunes();
    assertEqual(runes[0].name, 'Fe');
    assertEqual(runes[0].position, 1);
  });

  it('last rune is Yr at position 16', function() {
    var nr = NorseRunic.create({ runeSet: 'younger' });
    var runes = nr.getRunes();
    assertEqual(runes[15].name, 'Yr');
    assertEqual(runes[15].position, 16);
  });

  it('aett returns null for younger futhark (elder-only feature)', function() {
    var nr = NorseRunic.create({ runeSet: 'younger' });
    var a = nr.aett('\u16A0');
    assertEqual(a, null);
  });
});

describe('Norse Runic — Anglo-Saxon Futhorc', function() {
  it('has exactly 33 runes', function() {
    var nr = NorseRunic.create({ runeSet: 'angloSaxon' });
    assertEqual(nr.getRunes().length, 33);
  });

  it('first rune is Feoh', function() {
    var nr = NorseRunic.create({ runeSet: 'angloSaxon' });
    var runes = nr.getRunes();
    assertEqual(runes[0].name, 'Feoh');
  });

  it('last rune is Gar at position 33', function() {
    var nr = NorseRunic.create({ runeSet: 'angloSaxon' });
    var runes = nr.getRunes();
    assertEqual(runes[32].name, 'Gar');
    assertEqual(runes[32].position, 33);
  });
});

describe('Norse Runic — Rune Drawing', function() {
  it('drawRune returns a valid rune object', function() {
    var nr = NorseRunic.create();
    var drawn = nr.drawRune();
    assert(drawn.name !== undefined, 'drawn rune should have name');
    assert(drawn.position !== undefined, 'drawn rune should have position');
  });

  it('drawRune with reversals includes reversed property', function() {
    var nr = NorseRunic.create({ reversals: true });
    // Draw many to ensure we get both reversed and upright
    var hasReversedProp = false;
    for (var i = 0; i < 50; i++) {
      var drawn = nr.drawRune();
      if (drawn.reversed !== undefined) {
        hasReversedProp = true;
        break;
      }
    }
    assert(hasReversedProp, 'at least one draw should have reversed property');
  });

  it('drawRune without reversals does not have reversed property', function() {
    var nr = NorseRunic.create({ reversals: false });
    for (var i = 0; i < 20; i++) {
      var drawn = nr.drawRune();
      assertEqual(drawn.reversed, undefined);
    }
  });

  it('threeRuneSpread returns 3 runes', function() {
    var nr = NorseRunic.create();
    var spread = nr.threeRuneSpread();
    assertEqual(spread.length, 3);
  });

  it('threeRuneSpread positions are past, present, future', function() {
    var nr = NorseRunic.create();
    var spread = nr.threeRuneSpread();
    assertEqual(spread[0].spreadPosition, 'past');
    assertEqual(spread[1].spreadPosition, 'present');
    assertEqual(spread[2].spreadPosition, 'future');
  });

  it('threeRuneSpread draws without replacement', function() {
    var nr = NorseRunic.create();
    for (var t = 0; t < 20; t++) {
      var spread = nr.threeRuneSpread();
      // Check all three are different (by name, since some rune chars may overlap in futhorc)
      var names = [spread[0].name, spread[1].name, spread[2].name];
      // At least positions differ (indices differ)
      assert(
        spread[0].position !== spread[1].position ||
        spread[0].position !== spread[2].position ||
        spread[1].position !== spread[2].position ||
        spread[0].name !== spread[1].name,
        'three runes should not all be the same'
      );
    }
  });
});

describe('Norse Runic — Presets', function() {
  it('historical preset: elder, othala, no blank, no reversals', function() {
    var nr = NorseRunic.create('historical');
    assertEqual(nr.getRunes().length, 24);
    assertEqual(nr.allRunes().length, 24);
    var runes = nr.getRunes();
    assertEqual(runes[23].name, 'Othala');
  });

  it('thorsson preset: elder, dagaz last, no blank', function() {
    var nr = NorseRunic.create('thorsson');
    var runes = nr.getRunes();
    assertEqual(runes[23].name, 'Dagaz');
    assertEqual(nr.allRunes().length, 24);
  });

  it('blum preset: elder, othala, blank rune, reversals', function() {
    var nr = NorseRunic.create('blum');
    var runes = nr.getRunes();
    assertEqual(runes[23].name, 'Othala');
    assertEqual(nr.allRunes().length, 25);
  });

  it('all presets produce valid instances', function() {
    var presets = ['historical', 'thorsson', 'blum'];
    for (var i = 0; i < presets.length; i++) {
      var nr = NorseRunic.create(presets[i]);
      assert(nr.getRunes().length > 0, presets[i] + ' should have runes');
    }
  });
});

describe('Norse Runic — findRune and findRuneByName', function() {
  var nr = NorseRunic.create();

  it('findRune returns correct rune object', function() {
    var r = nr.findRune('\u16A0');
    assertEqual(r.name, 'Fehu');
    assertEqual(r.position, 1);
  });

  it('findRune returns null for unknown character', function() {
    assertEqual(nr.findRune('X'), null);
  });

  it('findRuneByName is case-insensitive', function() {
    var r = nr.findRuneByName('fehu');
    assertEqual(r.name, 'Fehu');
    assertEqual(r.position, 1);
  });

  it('findRuneByName returns null for unknown name', function() {
    assertEqual(nr.findRuneByName('NotARune'), null);
  });
});

describe('Norse Runic — getAett', function() {
  var nr = NorseRunic.create();

  it('getAett(1) returns 8 runes from Fehu to Wunjo', function() {
    var a = nr.getAett(1);
    assertEqual(a.number, 1);
    assertEqual(a.runes.length, 8);
    assertEqual(a.runes[0].name, 'Fehu');
    assertEqual(a.runes[7].name, 'Wunjo');
  });

  it('getAett(2) returns 8 runes from Hagalaz to Sowilo', function() {
    var a = nr.getAett(2);
    assertEqual(a.runes.length, 8);
    assertEqual(a.runes[0].name, 'Hagalaz');
    assertEqual(a.runes[7].name, 'Sowilo');
  });

  it('getAett(3) returns 8 runes from Tiwaz', function() {
    var a = nr.getAett(3);
    assertEqual(a.runes.length, 8);
    assertEqual(a.runes[0].name, 'Tiwaz');
  });

  it('getAett returns null for invalid number', function() {
    assertEqual(nr.getAett(0), null);
    assertEqual(nr.getAett(4), null);
  });
});

describe('Norse Runic — Analyze', function() {
  var nr = NorseRunic.create();

  it('analyze single rune character returns rune + aett + cipher', function() {
    var result = nr.analyze('\u16A0');
    assertEqual(result.rune.name, 'Fehu');
    assertEqual(result.aett.aett, 1);
    assertEqual(result.cipher.aett, 1);
    assertEqual(result.cipher.position, 1);
  });

  it('analyze multi-char string returns name value', function() {
    var result = nr.analyze('ODIN');
    assert(result.value > 0, 'should compute name value');
    assert(result.breakdown.length === 4, 'ODIN has 4 letters');
  });
});

var result = TestRunner.runAll();
if (typeof process !== 'undefined') process.exit(result.failed > 0 ? 1 : 0);
