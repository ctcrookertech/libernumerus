/**
 * Liber Numerus — Norse Runic Numerology
 * Elder Futhark (24 runes), Younger Futhark (16), Anglo-Saxon Futhorc (33),
 * aett classification, aett cipher, runic name value, rune drawing
 */
const NorseRunic = (() => {
  // === Elder Futhark: 24 runes ===
  // Two orderings exist for positions 23-24: Othala-last (traditional) vs Dagaz-last
  // The finalRune config controls which rune occupies position 24.

  const ELDER_FUTHARK_OTHALA_LAST = [
    { rune: '\u16A0', name: 'Fehu',     phoneme: 'f',  position: 1,  keywords: ['wealth','cattle','abundance'],          meaning: 'Movable wealth, prosperity, new beginnings' },
    { rune: '\u16A2', name: 'Uruz',     phoneme: 'u',  position: 2,  keywords: ['strength','aurochs','vitality'],        meaning: 'Raw strength, primal power, endurance' },
    { rune: '\u16A6', name: 'Thurisaz', phoneme: 'th', position: 3,  keywords: ['thorn','giant','protection'],           meaning: 'Reactive force, defense, conflict' },
    { rune: '\u16A8', name: 'Ansuz',    phoneme: 'a',  position: 4,  keywords: ['god','mouth','communication'],          meaning: 'Divine breath, wisdom, inspiration' },
    { rune: '\u16B1', name: 'Raidho',   phoneme: 'r',  position: 5,  keywords: ['ride','journey','order'],               meaning: 'Journey, movement, right action' },
    { rune: '\u16B2', name: 'Kenaz',    phoneme: 'k',  position: 6,  keywords: ['torch','knowledge','craft'],            meaning: 'Illumination, creativity, knowledge' },
    { rune: '\u16B7', name: 'Gebo',     phoneme: 'g',  position: 7,  keywords: ['gift','exchange','partnership'],         meaning: 'Gift, generosity, balance of exchange' },
    { rune: '\u16B9', name: 'Wunjo',    phoneme: 'w',  position: 8,  keywords: ['joy','harmony','fellowship'],           meaning: 'Joy, pleasure, shared well-being' },
    { rune: '\u16BA', name: 'Hagalaz',  phoneme: 'h',  position: 9,  keywords: ['hail','disruption','transformation'],   meaning: 'Hail, uncontrolled forces, crisis leading to transformation' },
    { rune: '\u16BE', name: 'Nauthiz',  phoneme: 'n',  position: 10, keywords: ['need','constraint','endurance'],        meaning: 'Need, hardship, resistance that builds strength' },
    { rune: '\u16C1', name: 'Isa',      phoneme: 'i',  position: 11, keywords: ['ice','stillness','stasis'],             meaning: 'Ice, standstill, challenge of inaction' },
    { rune: '\u16C3', name: 'Jera',     phoneme: 'j',  position: 12, keywords: ['year','harvest','cycle'],               meaning: 'Harvest, reward for effort, natural cycles' },
    { rune: '\u16C7', name: 'Eihwaz',   phoneme: 'ei', position: 13, keywords: ['yew','endurance','death'],              meaning: 'Yew tree, resilience, connection between worlds' },
    { rune: '\u16C8', name: 'Perthro',  phoneme: 'p',  position: 14, keywords: ['lot-cup','mystery','fate'],             meaning: 'Fate, mystery, the unknowable' },
    { rune: '\u16C9', name: 'Algiz',    phoneme: 'z',  position: 15, keywords: ['elk-sedge','protection','guardian'],    meaning: 'Protection, shield, divine connection' },
    { rune: '\u16CA', name: 'Sowilo',   phoneme: 's',  position: 16, keywords: ['sun','victory','wholeness'],            meaning: 'Sun, success, life force' },
    { rune: '\u16CF', name: 'Tiwaz',    phoneme: 't',  position: 17, keywords: ['Tyr','justice','sacrifice'],            meaning: 'Justice, honor, self-sacrifice for the greater good' },
    { rune: '\u16D2', name: 'Berkano',  phoneme: 'b',  position: 18, keywords: ['birch','birth','growth'],               meaning: 'Birth, renewal, nurturing growth' },
    { rune: '\u16D6', name: 'Ehwaz',    phoneme: 'e',  position: 19, keywords: ['horse','movement','trust'],             meaning: 'Horse, partnership, harmonious movement' },
    { rune: '\u16D7', name: 'Mannaz',   phoneme: 'm',  position: 20, keywords: ['man','humanity','self'],                meaning: 'Humanity, the self, social order' },
    { rune: '\u16DA', name: 'Laguz',    phoneme: 'l',  position: 21, keywords: ['water','flow','intuition'],             meaning: 'Water, flow, the unconscious' },
    { rune: '\u16DC', name: 'Ingwaz',   phoneme: 'ng', position: 22, keywords: ['Ing','fertility','potential'],          meaning: 'Fertility, internal growth, gestation' },
    { rune: '\u16DE', name: 'Dagaz',    phoneme: 'd',  position: 23, keywords: ['day','dawn','breakthrough'],            meaning: 'Day, awakening, breakthrough and transformation' },
    { rune: '\u16DF', name: 'Othala',   phoneme: 'o',  position: 24, keywords: ['heritage','homeland','inheritance'],    meaning: 'Ancestral property, heritage, spiritual inheritance' }
  ];

  const ELDER_FUTHARK_DAGAZ_LAST = [
    { rune: '\u16A0', name: 'Fehu',     phoneme: 'f',  position: 1,  keywords: ['wealth','cattle','abundance'],          meaning: 'Movable wealth, prosperity, new beginnings' },
    { rune: '\u16A2', name: 'Uruz',     phoneme: 'u',  position: 2,  keywords: ['strength','aurochs','vitality'],        meaning: 'Raw strength, primal power, endurance' },
    { rune: '\u16A6', name: 'Thurisaz', phoneme: 'th', position: 3,  keywords: ['thorn','giant','protection'],           meaning: 'Reactive force, defense, conflict' },
    { rune: '\u16A8', name: 'Ansuz',    phoneme: 'a',  position: 4,  keywords: ['god','mouth','communication'],          meaning: 'Divine breath, wisdom, inspiration' },
    { rune: '\u16B1', name: 'Raidho',   phoneme: 'r',  position: 5,  keywords: ['ride','journey','order'],               meaning: 'Journey, movement, right action' },
    { rune: '\u16B2', name: 'Kenaz',    phoneme: 'k',  position: 6,  keywords: ['torch','knowledge','craft'],            meaning: 'Illumination, creativity, knowledge' },
    { rune: '\u16B7', name: 'Gebo',     phoneme: 'g',  position: 7,  keywords: ['gift','exchange','partnership'],         meaning: 'Gift, generosity, balance of exchange' },
    { rune: '\u16B9', name: 'Wunjo',    phoneme: 'w',  position: 8,  keywords: ['joy','harmony','fellowship'],           meaning: 'Joy, pleasure, shared well-being' },
    { rune: '\u16BA', name: 'Hagalaz',  phoneme: 'h',  position: 9,  keywords: ['hail','disruption','transformation'],   meaning: 'Hail, uncontrolled forces, crisis leading to transformation' },
    { rune: '\u16BE', name: 'Nauthiz',  phoneme: 'n',  position: 10, keywords: ['need','constraint','endurance'],        meaning: 'Need, hardship, resistance that builds strength' },
    { rune: '\u16C1', name: 'Isa',      phoneme: 'i',  position: 11, keywords: ['ice','stillness','stasis'],             meaning: 'Ice, standstill, challenge of inaction' },
    { rune: '\u16C3', name: 'Jera',     phoneme: 'j',  position: 12, keywords: ['year','harvest','cycle'],               meaning: 'Harvest, reward for effort, natural cycles' },
    { rune: '\u16C7', name: 'Eihwaz',   phoneme: 'ei', position: 13, keywords: ['yew','endurance','death'],              meaning: 'Yew tree, resilience, connection between worlds' },
    { rune: '\u16C8', name: 'Perthro',  phoneme: 'p',  position: 14, keywords: ['lot-cup','mystery','fate'],             meaning: 'Fate, mystery, the unknowable' },
    { rune: '\u16C9', name: 'Algiz',    phoneme: 'z',  position: 15, keywords: ['elk-sedge','protection','guardian'],    meaning: 'Protection, shield, divine connection' },
    { rune: '\u16CA', name: 'Sowilo',   phoneme: 's',  position: 16, keywords: ['sun','victory','wholeness'],            meaning: 'Sun, success, life force' },
    { rune: '\u16CF', name: 'Tiwaz',    phoneme: 't',  position: 17, keywords: ['Tyr','justice','sacrifice'],            meaning: 'Justice, honor, self-sacrifice for the greater good' },
    { rune: '\u16D2', name: 'Berkano',  phoneme: 'b',  position: 18, keywords: ['birch','birth','growth'],               meaning: 'Birth, renewal, nurturing growth' },
    { rune: '\u16D6', name: 'Ehwaz',    phoneme: 'e',  position: 19, keywords: ['horse','movement','trust'],             meaning: 'Horse, partnership, harmonious movement' },
    { rune: '\u16D7', name: 'Mannaz',   phoneme: 'm',  position: 20, keywords: ['man','humanity','self'],                meaning: 'Humanity, the self, social order' },
    { rune: '\u16DA', name: 'Laguz',    phoneme: 'l',  position: 21, keywords: ['water','flow','intuition'],             meaning: 'Water, flow, the unconscious' },
    { rune: '\u16DC', name: 'Ingwaz',   phoneme: 'ng', position: 22, keywords: ['Ing','fertility','potential'],          meaning: 'Fertility, internal growth, gestation' },
    { rune: '\u16DF', name: 'Othala',   phoneme: 'o',  position: 23, keywords: ['heritage','homeland','inheritance'],    meaning: 'Ancestral property, heritage, spiritual inheritance' },
    { rune: '\u16DE', name: 'Dagaz',    phoneme: 'd',  position: 24, keywords: ['day','dawn','breakthrough'],            meaning: 'Day, awakening, breakthrough and transformation' }
  ];

  // === Younger Futhark: 16 runes ===
  const YOUNGER_FUTHARK = [
    { rune: '\u16A0', name: 'Fe',       phoneme: 'f',  position: 1,  keywords: ['wealth','cattle'],              meaning: 'Wealth, money' },
    { rune: '\u16A2', name: 'Ur',       phoneme: 'u',  position: 2,  keywords: ['rain','iron','aurochs'],        meaning: 'Rain, iron slag, aurochs' },
    { rune: '\u16A6', name: 'Thurs',    phoneme: 'th', position: 3,  keywords: ['giant','thorn'],                meaning: 'Giant, suffering' },
    { rune: '\u16AC', name: 'Oss',      phoneme: 'a',  position: 4,  keywords: ['god','estuary'],                meaning: 'God, estuary' },
    { rune: '\u16B1', name: 'Reidh',    phoneme: 'r',  position: 5,  keywords: ['ride','journey'],               meaning: 'Riding, journey' },
    { rune: '\u16B4', name: 'Kaun',     phoneme: 'k',  position: 6,  keywords: ['sore','ulcer'],                 meaning: 'Ulcer, boil' },
    { rune: '\u16BA', name: 'Hagall',   phoneme: 'h',  position: 7,  keywords: ['hail'],                         meaning: 'Hail' },
    { rune: '\u16BE', name: 'Naudhr',   phoneme: 'n',  position: 8,  keywords: ['need','constraint'],            meaning: 'Need, distress' },
    { rune: '\u16C1', name: 'Iss',      phoneme: 'i',  position: 9,  keywords: ['ice'],                          meaning: 'Ice' },
    { rune: '\u16C5', name: 'Ar',       phoneme: 'a',  position: 10, keywords: ['harvest','plenty'],             meaning: 'Plenty, good year' },
    { rune: '\u16CA', name: 'Sol',      phoneme: 's',  position: 11, keywords: ['sun'],                          meaning: 'Sun' },
    { rune: '\u16CF', name: 'Tyr',      phoneme: 't',  position: 12, keywords: ['Tyr','god'],                    meaning: 'The god Tyr' },
    { rune: '\u16D2', name: 'Bjarkan',  phoneme: 'b',  position: 13, keywords: ['birch','twig'],                 meaning: 'Birch twig' },
    { rune: '\u16D7', name: 'Madhr',    phoneme: 'm',  position: 14, keywords: ['man','human'],                  meaning: 'Man, human' },
    { rune: '\u16DA', name: 'Logr',     phoneme: 'l',  position: 15, keywords: ['water','sea'],                  meaning: 'Water, sea' },
    { rune: '\u16E6', name: 'Yr',       phoneme: 'R',  position: 16, keywords: ['yew','bow'],                    meaning: 'Yew bow' }
  ];

  // === Anglo-Saxon Futhorc: 33 runes ===
  const ANGLO_SAXON_FUTHORC = [
    { rune: '\u16A0', name: 'Feoh',     phoneme: 'f',  position: 1,  keywords: ['wealth','cattle'],              meaning: 'Wealth, prosperity' },
    { rune: '\u16A2', name: 'Ur',       phoneme: 'u',  position: 2,  keywords: ['aurochs','strength'],           meaning: 'Aurochs, wild ox' },
    { rune: '\u16A6', name: 'Thorn',    phoneme: 'th', position: 3,  keywords: ['thorn','giant'],                meaning: 'Thorn, giant' },
    { rune: '\u16A9', name: 'Os',       phoneme: 'o',  position: 4,  keywords: ['god','mouth'],                  meaning: 'God, mouth, speech' },
    { rune: '\u16B1', name: 'Rad',      phoneme: 'r',  position: 5,  keywords: ['ride','journey'],               meaning: 'Riding, journey' },
    { rune: '\u16B2', name: 'Cen',      phoneme: 'c',  position: 6,  keywords: ['torch','light'],                meaning: 'Torch' },
    { rune: '\u16B7', name: 'Gyfu',     phoneme: 'g',  position: 7,  keywords: ['gift','generosity'],            meaning: 'Gift' },
    { rune: '\u16B9', name: 'Wynn',     phoneme: 'w',  position: 8,  keywords: ['joy','bliss'],                  meaning: 'Joy, delight' },
    { rune: '\u16BA', name: 'Haegl',    phoneme: 'h',  position: 9,  keywords: ['hail'],                         meaning: 'Hail' },
    { rune: '\u16BE', name: 'Nyd',      phoneme: 'n',  position: 10, keywords: ['need','constraint'],            meaning: 'Need, hardship' },
    { rune: '\u16C1', name: 'Is',       phoneme: 'i',  position: 11, keywords: ['ice'],                          meaning: 'Ice' },
    { rune: '\u16C3', name: 'Ger',      phoneme: 'j',  position: 12, keywords: ['year','harvest'],               meaning: 'Year, harvest' },
    { rune: '\u16C7', name: 'Eoh',      phoneme: 'eo', position: 13, keywords: ['yew','tree'],                   meaning: 'Yew tree' },
    { rune: '\u16C8', name: 'Peordh',   phoneme: 'p',  position: 14, keywords: ['lot-cup','game'],               meaning: 'Gaming piece, mystery' },
    { rune: '\u16C9', name: 'Eolhx',    phoneme: 'x',  position: 15, keywords: ['elk-sedge','protection'],       meaning: 'Elk-sedge, protection' },
    { rune: '\u16CA', name: 'Sigel',    phoneme: 's',  position: 16, keywords: ['sun','victory'],                meaning: 'Sun' },
    { rune: '\u16CF', name: 'Tir',      phoneme: 't',  position: 17, keywords: ['Tiw','glory'],                  meaning: 'The god Tiw, glory' },
    { rune: '\u16D2', name: 'Beorc',    phoneme: 'b',  position: 18, keywords: ['birch','growth'],               meaning: 'Birch tree' },
    { rune: '\u16D6', name: 'Eh',       phoneme: 'e',  position: 19, keywords: ['horse','movement'],             meaning: 'Horse' },
    { rune: '\u16D7', name: 'Mann',     phoneme: 'm',  position: 20, keywords: ['man','humanity'],               meaning: 'Man, human' },
    { rune: '\u16DA', name: 'Lagu',     phoneme: 'l',  position: 21, keywords: ['water','sea'],                  meaning: 'Water, lake' },
    { rune: '\u16DC', name: 'Ing',      phoneme: 'ng', position: 22, keywords: ['Ing','hero'],                   meaning: 'The god Ing' },
    { rune: '\u16DE', name: 'Daeg',     phoneme: 'd',  position: 23, keywords: ['day','dawn'],                   meaning: 'Day, daylight' },
    { rune: '\u16DF', name: 'Ethel',    phoneme: 'oe', position: 24, keywords: ['estate','homeland'],            meaning: 'Homeland, estate' },
    { rune: '\u16AA', name: 'Ac',       phoneme: 'a',  position: 25, keywords: ['oak','strength'],               meaning: 'Oak tree' },
    { rune: '\u16AB', name: 'Aesc',     phoneme: 'ae', position: 26, keywords: ['ash','tree'],                   meaning: 'Ash tree' },
    { rune: '\u16E6', name: 'Yr',       phoneme: 'y',  position: 27, keywords: ['bow','yew'],                    meaning: 'Bow, yew' },
    { rune: '\u16E1', name: 'Ior',      phoneme: 'ia', position: 28, keywords: ['serpent','eel'],                meaning: 'World serpent, eel' },
    { rune: '\u16E0', name: 'Ear',      phoneme: 'ea', position: 29, keywords: ['earth','grave'],                meaning: 'Earth, grave, dust' },
    { rune: '\u16A0', name: 'Cweorth',  phoneme: 'q',  position: 30, keywords: ['fire','ritual'],                meaning: 'Ritual fire, pyre' },
    { rune: '\u16B3', name: 'Calc',     phoneme: 'k',  position: 31, keywords: ['chalice','offering'],           meaning: 'Chalice, offering cup' },
    { rune: '\u16E8', name: 'Stan',     phoneme: 'st', position: 32, keywords: ['stone','earth'],                meaning: 'Stone' },
    { rune: '\u16B7', name: 'Gar',      phoneme: 'g',  position: 33, keywords: ['spear','Odin'],                 meaning: 'Spear, Gungnir' }
  ];

  // Blank rune (non-historical, Blum invention)
  const BLANK_RUNE = {
    rune: null,
    name: 'Wyrd',
    phoneme: null,
    position: null,
    keywords: ['fate', 'unknown', 'destiny'],
    meaning: 'The unknowable, total trust in fate (NON-HISTORICAL: modern invention by Ralph Blum, not attested in any historical source)',
    nonHistorical: true
  };

  // Aett names
  const AETT_NAMES = [
    { number: 1, name: "Freyr's \u00E6tt",    deity: 'Freyr'    },
    { number: 2, name: "Hagal's \u00E6tt",     deity: 'Heimdall' },
    { number: 3, name: "Tyr's \u00E6tt",       deity: 'Tyr'      }
  ];

  // Latin-to-rune phoneme mapping for transliteration (Elder Futhark)
  const LATIN_TO_PHONEME = {
    'F': 'f',  'U': 'u',  'V': 'u',  'W': 'w',
    'A': 'a',  'R': 'r',  'K': 'k',  'C': 'k',
    'G': 'g',  'H': 'h',  'N': 'n',  'I': 'i',
    'J': 'j',  'P': 'p',  'Z': 'z',  'S': 's',
    'T': 't',  'B': 'b',  'E': 'e',  'M': 'm',
    'L': 'l',  'D': 'd',  'O': 'o',
    'Q': 'k',  'X': 'k',  'Y': 'i'
  };

  // Presets
  const PRESETS = {
    historical: {
      runeSet: 'elder',
      finalRune: 'othala',
      blankRune: false,
      reversals: false
    },
    thorsson: {
      runeSet: 'elder',
      finalRune: 'dagaz',
      blankRune: false,
      reversals: false
    },
    blum: {
      runeSet: 'elder',
      finalRune: 'othala',
      blankRune: true,
      reversals: true
    }
  };

  const DEFAULT_CONFIG = {
    runeSet: 'elder',
    finalRune: 'othala',
    blankRune: false,
    reversals: false
  };

  function create(config) {
    if (typeof config === 'string' && PRESETS[config]) {
      config = { ...PRESETS[config] };
    }
    var cfg = { ...DEFAULT_CONFIG, ...(config || {}) };

    function getRunes() {
      switch (cfg.runeSet) {
        case 'younger': return YOUNGER_FUTHARK;
        case 'angloSaxon': return ANGLO_SAXON_FUTHORC;
        default:
          return cfg.finalRune === 'dagaz'
            ? ELDER_FUTHARK_DAGAZ_LAST
            : ELDER_FUTHARK_OTHALA_LAST;
      }
    }

    // Look up a rune by its Unicode character
    function findRune(runeChar) {
      var runes = getRunes();
      return runes.find(function(r) { return r.rune === runeChar; }) || null;
    }

    // Look up a rune by name (case-insensitive)
    function findRuneByName(name) {
      var runes = getRunes();
      var lower = name.toLowerCase();
      return runes.find(function(r) { return r.name.toLowerCase() === lower; }) || null;
    }

    // Get the positional value of a rune
    function runeValue(runeChar) {
      var r = findRune(runeChar);
      return r ? r.position : null;
    }

    // Get aett classification for a rune (Elder Futhark only)
    function aett(runeChar) {
      var r = findRune(runeChar);
      if (!r) return null;
      if (cfg.runeSet !== 'elder') return null;

      var pos = r.position;
      var aettNum = Math.ceil(pos / 8);
      var posInAett = ((pos - 1) % 8) + 1;
      var aettInfo = AETT_NAMES[aettNum - 1];

      return {
        aett: aettNum,
        position: posInAett,
        name: aettInfo.name
      };
    }

    // Aett cipher: encode a rune as (aett number, position within aett)
    function aettCipher(runeChar) {
      var r = findRune(runeChar);
      if (!r) return null;
      if (cfg.runeSet !== 'elder') return null;

      var pos = r.position;
      var aettNum = Math.ceil(pos / 8);
      var posInAett = ((pos - 1) % 8) + 1;

      return { aett: aettNum, position: posInAett };
    }

    // Decode an aett cipher back to a rune
    function aettCipherDecode(aettNum, posInAett) {
      if (aettNum < 1 || aettNum > 3 || posInAett < 1 || posInAett > 8) return null;
      var position = (aettNum - 1) * 8 + posInAett;
      var runes = getRunes();
      return runes.find(function(r) { return r.position === position; }) || null;
    }

    // Transliterate a Latin letter to a rune phoneme match
    function transliterate(letter) {
      var runes = getRunes();
      var phoneme = LATIN_TO_PHONEME[letter.toUpperCase()];
      if (!phoneme) return null;
      return runes.find(function(r) { return r.phoneme === phoneme; }) || null;
    }

    // Compute runic name value: transliterate Latin name to runes, sum positional values
    function nameValue(name) {
      var total = 0;
      var breakdown = [];
      for (var i = 0; i < name.length; i++) {
        var ch = name[i].toUpperCase();
        var mapped = transliterate(ch);
        if (mapped) {
          total += mapped.position;
          breakdown.push({ letter: ch, rune: mapped.rune, name: mapped.name, value: mapped.position });
        }
      }
      return { name: name, value: total, breakdown: breakdown };
    }

    // Get all available runes (including blank if configured)
    function allRunes() {
      var runes = getRunes().slice();
      if (cfg.blankRune) {
        runes.push(BLANK_RUNE);
      }
      return runes;
    }

    // Draw a single random rune
    function drawRune() {
      var pool = allRunes();
      var idx = Math.floor(Math.random() * pool.length);
      var drawn = { ...pool[idx] };
      if (cfg.reversals && drawn.rune !== null) {
        drawn.reversed = Math.random() < 0.5;
      }
      return drawn;
    }

    // Three-rune spread (past, present, future)
    function threeRuneSpread() {
      var pool = allRunes();
      // Draw without replacement
      var indices = [];
      while (indices.length < 3) {
        var idx = Math.floor(Math.random() * pool.length);
        if (indices.indexOf(idx) === -1) {
          indices.push(idx);
        }
      }
      var positions = ['past', 'present', 'future'];
      var spread = [];
      for (var i = 0; i < 3; i++) {
        var drawn = { ...pool[indices[i]], spreadPosition: positions[i] };
        if (cfg.reversals && drawn.rune !== null) {
          drawn.reversed = Math.random() < 0.5;
        }
        spread.push(drawn);
      }
      return spread;
    }

    // Get info about an aett by number
    function getAett(aettNum) {
      if (aettNum < 1 || aettNum > 3) return null;
      var runes = getRunes();
      if (cfg.runeSet !== 'elder') return null;
      var start = (aettNum - 1) * 8 + 1;
      var end = aettNum * 8;
      var aettRunes = runes.filter(function(r) { return r.position >= start && r.position <= end; });
      return {
        ...AETT_NAMES[aettNum - 1],
        runes: aettRunes
      };
    }

    // Analyze: general purpose entry point
    function analyze(input) {
      if (typeof input === 'string' && input.length === 1) {
        var r = findRune(input);
        if (r) {
          var result = { rune: r };
          if (cfg.runeSet === 'elder') {
            result.aett = aett(input);
            result.cipher = aettCipher(input);
          }
          return result;
        }
      }
      if (typeof input === 'string' && input.length > 1) {
        return nameValue(input);
      }
      return null;
    }

    return {
      getRunes: getRunes,
      findRune: findRune,
      findRuneByName: findRuneByName,
      runeValue: runeValue,
      aett: aett,
      aettCipher: aettCipher,
      aettCipherDecode: aettCipherDecode,
      transliterate: transliterate,
      nameValue: nameValue,
      allRunes: allRunes,
      drawRune: drawRune,
      threeRuneSpread: threeRuneSpread,
      getAett: getAett,
      analyze: analyze
    };
  }

  return { create: create, DEFAULT_CONFIG: DEFAULT_CONFIG, PRESETS: PRESETS, AETT_NAMES: AETT_NAMES, BLANK_RUNE: BLANK_RUNE };
})();

if (typeof module !== 'undefined') module.exports = NorseRunic;
