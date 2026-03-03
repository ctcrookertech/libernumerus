# Liber Numerus

Vanilla JavaScript library implementing 18 numerology traditions. No external dependencies. ES module + CommonJS dual export.

## Build & Test

```bash
# Run all tests (18 systems + cross-system verification)
node run-all-tests.js

# Run individual system tests
node systems/pythagorean/pythagorean.test.js
node systems/hebrew-gematria/hebrew-gematria.test.js
node systems/chaldean/chaldean.test.js
node systems/vedic-indian/vedic-indian.test.js
node systems/greek-isopsephy/greek-isopsephy.test.js
node systems/arabic-abjad/arabic-abjad.test.js
node systems/hurufism/hurufism.test.js
node systems/thelemic/thelemic.test.js
node systems/tarot/tarot.test.js
node systems/chinese-cosmological/chinese-cosmological.test.js
node systems/japanese-shinto/japanese-shinto.test.js
node systems/mayan/mayan.test.js
node systems/yoruba-ifa/yoruba-ifa.test.js
node systems/norse-runic/norse-runic.test.js
node systems/celtic-ogham/celtic-ogham.test.js
node systems/neoplatonic/neoplatonic.test.js
node systems/christian-symbolic/christian-symbolic.test.js
node systems/egyptian/egyptian.test.js
```

## Architecture

### File Structure

```
shared/                              # Shared infrastructure
  test-runner.js                     # Custom assert-based test framework
  unicode-utils.js                   # Script detection, normalization, vowel/consonant classification
  reduction-utils.js                 # Digit reduction, number theory (triangular, perfect, prime, etc.)
  date-utils.js                      # JDN conversion, calendar utilities, lunisolar approximation

systems/                             # All 18 numerology system modules
  pythagorean/                       # Western numerology (Life Path, Expression, Master Numbers)
  hebrew-gematria/                   # Standard, Katan, Gadol, Kolel, Ordinal, AIQ BKR, Sefirot
  chaldean/                          # Non-sequential mapping, compound numbers 10-52, planets
  vedic-indian/                      # Psychic/Destiny/Name Numbers, Katapayadi, Navagraha
  greek-isopsephy/                   # Classical letter values, archaic numerals, optional reduction
  arabic-abjad/                      # Abjad values, Hisab al-Saghir, chronograms, elements
  hurufism/                          # Extends Arabic Abjad — facial lines, prophetic cycles, teeth map
  thelemic/                          # English Qabalah (ALW/NAEQ), Tree of Life, 93 Current, Temurah
  tarot/                             # Birth Cards, Major/Minor Arcana, tradition-specific variations
  chinese-cosmological/              # Phonetic homophony, Wuxing, Luo Shu, I Ching (64 hexagrams)
  japanese-shinto/                   # Seimei Handan (name strokes), Rokuyō, gift evaluation
  mayan/                             # Vigesimal, Tzolkin, Haab, Long Count, Calendar Round
  yoruba-ifa/                        # 256 Odù, Ikin/Opele casting, Orisha associations
  norse-runic/                       # Elder/Younger Futhark, ættir, ætt cipher, rune drawing
  celtic-ogham/                      # 20+5 letters, 4 aicme, tree associations, Graves calendar
  neoplatonic/                       # Decad, mathematical properties, Tetractys, ratio analysis
  christian-symbolic/                # Biblical numbers, Augustinian factorization, typological pairs
  egyptian/                          # Hieroglyphic numerals, decans, ritual repetition, meaning lookup

design/                              # Design documents, specs, and UI prototypes

run-all-tests.js                     # Master test runner (583 tests + 12 cross-system verifications)
```

### Module Pattern

Every system module follows:

```js
const SystemName = (() => {
  const DEFAULT_CONFIG = { ... };
  const VARIANTS = { presetName: { ...overrides }, ... };

  function create(config) {
    // Accept string preset or config object
    const cfg = { ...DEFAULT_CONFIG, ...(config || {}) };
    return { /* instance methods */ };
  }

  return { create, DEFAULT_CONFIG, VARIANTS };
})();

if (typeof module !== 'undefined') module.exports = SystemName;
```

### Common Instance Methods

- `.letterValue(char)` — single character → number
- `.wordValue(string)` — string → sum of letter values
- `.reduce(number)` — system-specific digit reduction
- `.numberMeaning(n)` — symbolic meaning lookup
- `.analyze(input)` — primary analysis entry point

### Configuration

Each module accepts a config object or preset string:
```js
const p = Pythagorean.create('modern');          // named preset
const p = Pythagorean.create({ masterNumbers: [11, 22] }); // custom config
```

## Conventions

- No external dependencies — pure vanilla JS
- All files work in both Node.js (CommonJS) and browser (`<script>` tag)
- Unicode-native: Hebrew, Greek, Arabic, Runic, Ogham characters handled directly
- Test framework is assert-based (shared/test-runner.js) — no test library needed
- Each test file is standalone: `node systems/<system>/<system>.test.js`
- Cross-system verifications validate factual equivalences (YHVH=26, Iesous=888, Bismillah=786, etc.)
