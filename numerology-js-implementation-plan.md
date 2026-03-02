# Numerology Systems: JavaScript Implementation Plan

## Specification for vanilla JS modules covering 18 traditions

---

## I. Architectural Overview

### Design Principles

Each numerology system becomes a self-contained JavaScript module (ES module syntax with CommonJS fallback) consumable from both browser `<script>` tags and Node.js `require()`. No external dependencies. Every module exports a constructor or factory that accepts a configuration object controlling variant behavior.

### Module Shape (Common Interface)

Every system module follows a consistent structure:

```
SystemName/
  system-name.js          # Core module: calculations, mappings, configuration
  system-name.test.js     # Comprehensive test suite (assert-based, no framework)
```

Each module exports an object with:

- `create(config)` — factory function returning a configured instance
- `DEFAULT_CONFIG` — the default configuration object
- `VARIANTS` — enumeration of named configuration presets
- Instance methods vary per system but share patterns:
  - `.reduce(number)` — where applicable, reduce per system rules
  - `.letterValue(char)` — where applicable, map character to number
  - `.wordValue(string)` — where applicable, compute total for a string
  - `.numberMeaning(n)` — look up the symbolic meaning of a number
  - `.analyze(input)` — primary analysis entry point (system-specific)

### Test Harness

A minimal test runner (`test-runner.js`) that works in both Node.js and browser:

```js
function assert(condition, message) { ... }
function assertEqual(actual, expected, message) { ... }
function assertDeepEqual(actual, expected, message) { ... }
function runSuite(name, tests) { ... }
```

Each test file is a standalone script that can be run with `node system-name.test.js` or included via `<script>` in HTML. Tests cover: known input/output pairs, edge cases, configuration variant behavior, and cross-references from the source material (e.g., verifiable gematria values like YHVH=26, Iesous=888).

---

## II. System-by-System Specifications

---

### 1. Pythagorean / Western (`pythagorean.js`)

**Computational Processes:**

1. **Digit Reduction (Theosophic Reduction)**: Repeatedly sum digits of a number until a single digit (1–9) remains, OR a Master Number is reached (configurable).
2. **Letter-to-Number Mapping**: Latin alphabet sequential cycling: A=1, B=2 ... I=9, J=1, K=2 ... R=9, S=1 ... Z=8.
3. **Life Path Number**: From birth date (MM/DD/YYYY). Sum each component separately, reduce each, then sum and reduce again. The reduction path matters (intermediate sums may flag Karmic Debt).
4. **Expression Number**: Full birth name → letter values → sum → reduce.
5. **Soul Urge (Heart's Desire) Number**: Vowels only of birth name → sum → reduce.
6. **Personality Number**: Consonants only of birth name → sum → reduce.
7. **Personal Year Number**: Birth month + birth day + current year → reduce.
8. **Pinnacle Numbers**: Four pinnacles derived from birth date segments. Pinnacle 1 = month+day reduced. Pinnacle 2 = day+year reduced. Pinnacle 3 = Pinnacle1+Pinnacle2 reduced. Pinnacle 4 = month+year reduced.
9. **Challenge Numbers**: Four challenges using subtraction of birth date segments (absolute difference). Challenge 1 = |month−day|. Challenge 2 = |day−year reduced|. Challenge 3 = |Challenge1−Challenge2|. Challenge 4 = |month−year reduced|.
10. **Karmic Debt Detection**: Check if unreduced intermediate sums are 13, 14, 16, or 19 during Life Path, Expression, or Soul Urge calculation.
11. **Personal Year Cycle Position**: Determine where in the 1–9 cycle the current year falls.

**Configuration Options:**

| Option | Values | Default | Effect |
|--------|--------|---------|--------|
| `masterNumbers` | `[11,22]`, `[11,22,33]`, `[11,22,33,44]`, `[]` | `[11,22,33]` | Which numbers halt reduction |
| `karmicDebtEnabled` | `true` / `false` | `true` | Whether to flag 13,14,16,19 intermediates |
| `yAsVowel` | `'always'`, `'never'`, `'contextual'` | `'contextual'` | Treatment of Y in Soul Urge / Personality split. "Contextual" = vowel when no other vowel is adjacent |
| `reductionMethod` | `'standard'`, `'ancient'` | `'standard'` | "Ancient" reduces everything to 1–10 (the Decad), no Master Numbers, no Karmic Debt — representing the actual Pythagorean framework |

**Named Presets:**

- `'modern'` — Master Numbers [11,22,33], Karmic Debt on, Y contextual (Balliett/Jordan/Goodwin tradition)
- `'ancient'` — No Master Numbers, no Karmic Debt, all reduce to 1–10 (historical Pythagorean Decad)
- `'conservative'` — Master Numbers [11,22] only, Karmic Debt on (earlier 20th-century practice)

**Meaning Data:**

Numbers 1–13 from the systems table, plus Master Number meanings (11, 22, 33), Karmic Debt meanings (13, 14, 16, 19 as unreduced intermediates). Each meaning entry includes: `number`, `name`, `keywords[]`, `description`, `isModernAddition` (boolean).

**Test Cases (representative sample, full suite much larger):**

- `reduce(1987)` → 25 → 7
- `reduce(29)` with masterNumbers=[11,22] → 11 (not 2)
- `reduce(29)` with masterNumbers=[] → 2
- `letterValue('A')` → 1, `letterValue('Z')` → 8, `letterValue('S')` → 1
- `wordValue('ALBERT')` → 22 (1+3+2+5+9+2)
- `lifePath({month:7, day:4, year:1776})` → 5 (7+4+1+7+7+6=32→5)
- `lifePath({month:2, day:22, year:1990})` — should preserve 22 as Master Number in month+day step if configured
- `soulUrge('ALBERT')` — vowels A,E → 1+5 = 6
- `personality('ALBERT')` — consonants L,B,R,T → 3+2+9+2 = 16 → 7 (also flag Karmic Debt 16 if enabled)
- Karmic Debt: `lifePath({month:7, day:5, year:1984})` — check if intermediate sum hits 13,14,16,19
- Personal Year calculation for known date + year
- Pinnacle and Challenge calculations for July 4, 1776

---

### 2. Chaldean (`chaldean.js`)

**Computational Processes:**

1. **Letter-to-Number Mapping**: Non-sequential, specific to the Chaldean system (A=1, B=2, C=3, D=4, E=5, F=8, G=3, H=5, I=1, J=1, K=2, L=3, M=4, N=5, O=7, P=8, Q=1, R=2, S=3, T=4, U=6, V=6, W=6, X=5, Y=1, Z=7). Note: 9 is NOT assigned to any letter.
2. **Digit Reduction**: Sum digits to single digit (1–9). Compound numbers (10–52) are ALSO meaningful before final reduction.
3. **Name Vibration Number**: Use the name the person is commonly CALLED (not necessarily legal name) → letter values → sum. Both the compound number and its reduced single digit carry meaning.
4. **Birth Number**: Day of birth (unreduced if 1–9; compound if 10–31; then reduced to single digit). Both compound and reduced values reported.
5. **Compound Number Interpretation**: Numbers 10–52 each have a specific symbolic "picture" (e.g., 10="Wheel of Fortune", 13="The Great Transformer", 16="The Shattered Citadel").
6. **Planetary Attribution**: Each single digit 1–9 → planet.

**Configuration Options:**

| Option | Values | Default | Effect |
|--------|--------|---------|--------|
| `planetaryScheme` | `'rahuKetu'`, `'uranusNeptune'` | `'rahuKetu'` | 4=Rahu or Uranus, 7=Ketu or Neptune |
| `nameSource` | `'common'`, `'legal'`, `'both'` | `'common'` | Which name to use for analysis |
| `compoundRange` | `[10,52]`, `[10,78]` | `[10,52]` | Range of compound numbers with defined meanings (some practitioners extend beyond Cheiro's 52) |

**Named Presets:**

- `'cheiro'` — Rahu/Ketu scheme, common name, compound 10–52 (Cheiro's original system)
- `'modernWestern'` — Uranus/Neptune, legal name, extended compound range

**Meaning Data:**

Single digits 1–9 with planetary associations. Compound numbers 10–52 with symbolic names and descriptions from the systems/methodology documents. Planetary attribution table.

**Test Cases:**

- `letterValue('A')` → 1, `letterValue('F')` → 8, `letterValue('O')` → 7
- Verify 9 is not returned by any `letterValue()` call for any letter A–Z
- `wordValue('CHEIRO')` → 3+5+5+1+2+7 = 23 (compound) → 5 (reduced)
- `birthNumber(16)` → compound 16 ("Shattered Citadel"), reduced to 7
- `birthNumber(7)` → no compound, single digit 7
- `compoundMeaning(13)` → "The Great Transformer"
- `planetFor(4)` with rahuKetu → 'Rahu'; with uranusNeptune → 'Uranus'
- Full name analysis for a test name showing both compound and reduced values

---

### 3. Hebrew Gematria (`hebrew-gematria.js`)

**Computational Processes:**

1. **Standard Gematria (Mispar Hechrachi)**: Each Hebrew letter → its standard value (Aleph=1 through Tav=400). Sum all letters of a word. Do NOT reduce.
2. **Small Value (Mispar Katan)**: Drop zeros from each letter value (400→4, 200→2, etc.), then sum.
3. **Mispar Gadol (with Sofit)**: Final forms of letters get extended values (Kaf sofit=500, Mem sofit=600, Nun sofit=700, Pe sofit=800, Tsade sofit=900).
4. **Kolel**: Standard value + 1 (the word as a unity).
5. **AIQ BKR (Qabalah of Nine Chambers)**: Group letters into 9 sets by reducing their standard values to single digits. Used to find single-digit equivalences.
6. **Ordinal Value (Mispar Siduri)**: Each letter by its position in the alphabet (Aleph=1 ... Tav=22).
7. **Word Equivalence Finder**: Given a gematria value, report known words/phrases sharing that value.
8. **Sefirotic Association**: Map numbers 1–10 to the ten Sefirot (separately from letter-path associations — these are distinct systems as the source material emphasizes).
9. **Letter-Path Mapping**: The 22 letters → 22 paths on the Tree of Life (distinct from Sefirot numbering).

**Configuration Options:**

| Option | Values | Default | Effect |
|--------|--------|---------|--------|
| `sofitValues` | `'standard'` (no sofit), `'extended'` (500–900) | `'standard'` | Whether final letters get extended values |
| `method` | `'hechrachi'`, `'katan'`, `'gadol'`, `'kolel'`, `'siduri'`, `'aiqbkr'` | `'hechrachi'` | Default calculation method |
| `treeArrangement` | `'gra'`, `'kircher'`, `'ari'` | `'kircher'` | Tree of Life path topology (affects letter-to-path mapping) |

**Named Presets:**

- `'traditional'` — Standard gematria, no sofit, Kircher tree (common Kabbalistic default)
- `'lurianic'` — Extended sofit values, Ari tree arrangement
- `'gra'` — Vilna Gaon's arrangement

**Meaning Data:**

22 Hebrew letters with: character, Unicode codepoint, name, standard value, sofit value (where applicable), ordinal position, pictographic meaning, associated Sefirah path. 10 Sefirot with names, positions, associations. Known significant gematria values: YHVH=26, Echad=13, Ahavah=13, Chai=18, Mashiach=358, Nachash=358, etc.

**Test Cases:**

- `wordValue('יהוה')` → 26 (standard)
- `wordValue('אחד')` → 13; `wordValue('אהבה')` → 13 (demonstrating equivalence)
- `wordValue('חי')` → 18
- `wordValue('משיח')` → 358; `wordValue('נחש')` → 358
- `letterValue('א')` → 1 (standard), 1 (ordinal), 1 (katan)
- `letterValue('ת')` → 400 (standard), 22 (ordinal), 4 (katan)
- `letterValue('ך')` → 500 (gadol with sofit), 20 (standard without sofit)
- `kolel('יהוה')` → 27 (26+1)
- `aiqBkr('א')` → 1, `aiqBkr('י')` → 1, `aiqBkr('ק')` → 1 (all reduce to 1)
- Sefirah lookup: `sefirah(1)` → {name:'Keter', translation:'Crown', ...}
- Path lookup validates correct topology per configuration

---

### 4. Greek Isopsephy (`greek-isopsephy.js`)

**Computational Processes:**

1. **Isopsephic Value**: Each Greek letter → numeric value (Alpha=1 through Omega=800, including archaic numerals Digamma/Stigma=6, Qoppa=90, Sampi=900). Sum all letters. Value is NOT reduced natively.
2. **Optional Modern Reduction**: Reduce to single digit (non-native to the tradition, but included as a configurable option since some modern practitioners do this).
3. **Word Equivalence Finder**: Given a value, find known words/names sharing it.
4. **Transliteration Helper**: Accept Romanized input and convert to Greek letter values (approximate, since some Greek distinctions are lost in Romanization).

**Configuration Options:**

| Option | Values | Default | Effect |
|--------|--------|---------|--------|
| `includeArchaic` | `true` / `false` | `true` | Whether Digamma(6), Qoppa(90), Sampi(900) are available |
| `stigmaForDigamma` | `true` / `false` | `false` | Use Stigma (ϛ) instead of Digamma (Ϝ) for numeral 6 (later Byzantine convention) |
| `allowReduction` | `true` / `false` | `false` | Enable single-digit reduction (modern overlay) |
| `inputMode` | `'greek'`, `'romanized'` | `'greek'` | Accept Greek Unicode or Romanized input |

**Named Presets:**

- `'classical'` — Archaic letters included, no reduction, Greek input (ancient practice)
- `'byzantine'` — Stigma for Digamma, no reduction
- `'modern'` — Reduction enabled, Romanized input accepted

**Meaning Data:**

24 standard letters + 3 archaic numerals with: character, Unicode, name, value, qualitative meaning from the systems table. Significant known values: Iesous=888, Abraxas=365, 666=Neron Kaisar equivalence, Thoth/Hermes values.

**Test Cases:**

- `wordValue('Ἰησοῦς')` → 888 (10+8+200+70+400+200)
- `wordValue('Ἀβρασάξ')` → 365
- `letterValue('Α')` → 1, `letterValue('Ω')` → 800
- `letterValue('Ϝ')` → 6 (Digamma)
- With reduction enabled: `reduce(888)` → 24 → 6
- Romanized: `wordValue('IESOUS', {inputMode:'romanized'})` → 888
- Verify archaic letters: Qoppa → 90, Sampi → 900

---

### 5. Arabic Abjad / Ilm al-Huruf (`arabic-abjad.js`)

**Computational Processes:**

1. **Abjad Value (Hisab al-Jumal / Grand Calculation)**: Each Arabic letter in Abjad order → numeric value (Alif=1 through Ghayn=1000). Sum all letters.
2. **Hisab al-Saghir (Small Calculation)**: Reduce each letter's value by successive operations (specific reduction method varies by tradition). Common method: drop zeros, sum remaining digits.
3. **Chronogram (Tārīkh) Calculation**: Given a phrase, compute its Abjad total and report the corresponding Hijri year.
4. **Elemental Attribution**: Each letter → one of 4 elements (fire, air, water, earth).
5. **Planetary Attribution**: Each letter → one of 7 classical planets.
6. **Divine Name Analysis**: Compute Abjad values of the 99 Names of God.

**Configuration Options:**

| Option | Values | Default | Effect |
|--------|--------|---------|--------|
| `letterOrder` | `'eastern'`, `'maghrebi'` | `'eastern'` | Eastern (standard) vs. Maghrebi variant Abjad ordering (some values differ for letters after the shared Semitic core) |
| `method` | `'jumal'`, `'saghir'` | `'jumal'` | Default calculation method |
| `includeHamza` | `true` / `false` | `true` | Whether to count Hamza as a distinct letter with value |

**Named Presets:**

- `'standard'` — Eastern order, grand calculation, Hamza included
- `'maghrebi'` — Maghrebi order variant
- `'sufi'` — Adds planetary and elemental attributions to output

**Meaning Data:**

28 Arabic letters in Abjad order with: character, Unicode, name, standard value, Maghrebi value (where different), element, planet. Meanings for numbers 1–13. Significant known values: Allah=66, Muhammad=92, Bismillah=786. The 99 Names of God with their Abjad totals.

**Test Cases:**

- `wordValue('الله')` → 66 (1+30+30+5)
- `wordValue('محمد')` → 92 (40+8+40+4)
- `wordValue('بسم الله الرحمن الرحيم')` → 786
- `letterValue('أ')` → 1, `letterValue('غ')` → 1000
- `smallCalc('الله')` → reduced form of 66
- Chronogram: given a commemorative phrase, verify year extraction
- Maghrebi variant: verify differing letter values where applicable
- Element attribution: verify each letter maps to correct element

---

### 6. Hurufism (`hurufism.js`)

**Computational Processes:**

1. **Extended Abjad (28 or 32 letters)**: Standard 28 Arabic letters + optional 4 Persian additions (پ pe, چ che, ژ zhe, گ gaf) for the 32-letter system.
2. **Facial Line Mapping**: Map 7 groups of 4 letters to 7 lines of the human face (eyebrows, eyes, nostrils, mouth edges, etc. — each side has 7 lines = 14 features, encoding 28 letters).
3. **Prophetic Cycle Calculation**: Letters grouped by prophetic dispensation. Each prophet's "word" is a letter-cluster whose Abjad value encodes the duration of their dispensation.
4. **32-Letter Body Mapping**: 32 letters → 32 teeth (in the extended system).

**Configuration Options:**

| Option | Values | Default | Effect |
|--------|--------|---------|--------|
| `letterSet` | `'arabic28'`, `'persian32'` | `'arabic28'` | 28-letter or 32-letter system |
| `includeBodyMap` | `true` / `false` | `true` | Include facial/body correspondences in output |

**Named Presets:**

- `'fazlallah'` — 28-letter Arabic, full facial line mapping (original Fazlallah system)
- `'persian'` — 32-letter extended, includes teeth mapping

**Meaning Data:**

28 (or 32) letters with Abjad values, facial line associations, prophetic cycle associations. The 7 facial line groups and their letter assignments. Prophetic dispensation framework.

**Test Cases:**

- All 28 standard Abjad values carry over from arabic-abjad module (import/share)
- `facialLine('ا')` → specific facial feature mapping
- `letterSet` configuration: 28-letter system has no پ/چ/ژ/گ; 32-letter system includes them
- Prophetic cycle lookup for known letter-clusters
- Body map: 32 letters → 32 teeth mapping when persian32 enabled

---

### 7. Chinese Cosmological (`chinese-cosmological.js`)

**Computational Processes:**

1. **Phonetic Homophony Evaluation**: Given a number (single or multi-digit), evaluate each digit for its phonetic association (auspicious, inauspicious, neutral). Return overall assessment.
2. **Multi-Digit Phrase Reading**: For multi-digit numbers (phone numbers, addresses, prices), read as a sequence of phonetic meanings. E.g., 168 → "all the way to prosperity", 514 → "I will die".
3. **Yin/Yang Classification**: Odd = yang, even = yin. For multi-digit numbers, report the yin/yang balance.
4. **Wuxing (Five Phase) Correspondence**: Numbers 1–5 → elements (1=Water, 2=Fire, 3=Wood, 4=Metal, 5=Earth — OR variant mappings depending on the scheme: He Tu vs. Luo Shu vs. later heaven).
5. **Luo Shu Magic Square**: Generate the 3×3 grid (4-9-2 / 3-5-7 / 8-1-6). Verify magic constant = 15. Report position significance for any number 1–9.
6. **I Ching Trigram Mapping**: 8 trigrams (Bagua) with binary representations, names, elements, directions, family members.
7. **I Ching Hexagram Generation**: From 6 binary lines (yin/yang), identify one of 64 hexagrams. Support coin-toss method (3 coins × 6 lines) and yarrow-stalk method simulation.
8. **Auspiciousness Scoring**: Overall evaluation of a multi-digit number combining phonetic, yin/yang, and positional factors.

**Configuration Options:**

| Option | Values | Default | Effect |
|--------|--------|---------|--------|
| `dialect` | `'mandarin'`, `'cantonese'` | `'mandarin'` | Phonetic associations differ by dialect (e.g., Cantonese 3=saang=life vs. Mandarin 3=san) |
| `wuxingScheme` | `'hetu'`, `'luoshu'`, `'laterHeaven'` | `'luoshu'` | Which element-number mapping to use |
| `iChingMethod` | `'coins'`, `'yarrow'` | `'coins'` | Divination generation method (affects probability distributions — yarrow stalks do NOT produce equal probabilities for all line types) |
| `evaluationStrictness` | `'folk'`, `'classical'` | `'folk'` | "Folk" emphasizes phonetic homophony; "classical" weights Luo Shu and I Ching cosmology more heavily |

**Named Presets:**

- `'folk'` — Mandarin dialect, folk phonetic evaluation (how most Chinese people actually evaluate numbers in daily life)
- `'classical'` — Luo Shu scheme, yarrow stalks, weighted toward cosmological significance
- `'cantonese'` — Cantonese dialect phonetics (significant differences from Mandarin for some numbers)
- `'fengShui'` — Luo Shu emphasis with directional/spatial evaluation

**Meaning Data:**

Digits 0–9 with: Mandarin pronunciation, Cantonese pronunciation, homophone associations for each dialect, auspiciousness rating, yin/yang, Luo Shu position. Common multi-digit combinations with their phrase-meanings (168, 888, 514, 1314, 250, etc.). 8 trigrams with all attributes. 64 hexagrams with names, constituent trigrams, and brief meanings.

**Test Cases:**

- `evaluateDigit(8, 'mandarin')` → {pronunciation:'bā', homophone:'fā', meaning:'prosper', auspicious:true}
- `evaluateDigit(4, 'mandarin')` → {pronunciation:'sì', homophone:'sǐ', meaning:'death', auspicious:false}
- `evaluateNumber(168)` → 'all the way to prosperity' (auspicious)
- `evaluateNumber(514)` → 'I will die' (extremely inauspicious)
- `luoShu()` → [[4,9,2],[3,5,7],[8,1,6]], verify all rows/cols/diags = 15
- `yinYang(3)` → 'yang'; `yinYang(4)` → 'yin'
- `trigramFromBinary([1,1,1])` → Qian/Heaven
- `generateHexagram('coins')` — verify produces valid hexagram ID (1–64)
- `generateHexagram('yarrow')` — verify probability distribution differs from coins (old yin and old yang probabilities are unequal in yarrow method: P(old yin)=1/16, P(old yang)=3/16 vs. coins where both are 1/8 or 2/8 depending on formulation)

---

### 8. Japanese / Shinto (`japanese-shinto.js`)

**Computational Processes:**

1. **Phonetic Homophony Evaluation**: Japanese-specific number-sound associations (4=shi=death, 9=ku=suffering, 8=ya=many/abundant in Shinto context). Distinct from Chinese despite shared roots.
2. **Seimei Handan (Name-Stroke Numerology)**: The five-grid system for analyzing Japanese names written in kanji:
   - **Tenkaku (天格, Heaven)**: Total strokes of family name + 1 (or just family name strokes in some methods).
   - **Jinkaku (人格, Person)**: Last character of family name + first character of given name → stroke total.
   - **Chikaku (地格, Earth)**: Total strokes of given name + 1 (or just given name strokes).
   - **Gaikaku (外格, Outer)**: Total strokes of full name − Jinkaku strokes + 2 (methods vary).
   - **Soukaku (総格, Total)**: Total strokes of entire name.
   Each grid position is evaluated for auspiciousness based on its numeric value.
3. **Rokuyō (六曜) Day Cycle**: Six-day cycle determining auspicious/inauspicious times (Sensho, Tomobiki, Senbu, Butsumetsu, Taian, Shakku). Calculated from the Japanese lunisolar calendar.
4. **Gift Amount Evaluation**: Evaluate whether a monetary amount is appropriate for a given occasion (avoid 4, 9; wedding gifts in odd amounts; etc.).

**Configuration Options:**

| Option | Values | Default | Effect |
|--------|--------|---------|--------|
| `seimeiMethod` | `'standard'`, `'simplified'` | `'standard'` | Stroke count calculation method (the +1 adjustments and Gaikaku formula vary between schools) |
| `includeOnReading` | `true` / `false` | `true` | Include on'yomi (Chinese-derived) readings in phonetic evaluation |
| `kanjiStrokeSource` | `'traditional'`, `'simplified'` | `'traditional'` | Use traditional or modern simplified stroke counts for kanji |

**Named Presets:**

- `'traditional'` — Standard seimei handan, traditional stroke counts, full phonetic evaluation
- `'modern'` — Simplified method, modern stroke counts

**Meaning Data:**

Digits 1–13 with Japanese pronunciations, meanings from systems table, phonetic associations (kun'yomi and on'yomi). Auspiciousness ratings. Seimei handan grid-position interpretation tables. Rokuyō cycle definitions. A kanji stroke-count lookup for common name characters (this would be a data table — necessarily limited; the module should accept stroke counts as input rather than trying to be a complete kanji dictionary).

**Test Cases:**

- `evaluateDigit(4)` → {reading:'shi', homophone:'死', meaning:'death', auspicious:false}
- `evaluateDigit(8)` → {reading:'ya/hachi', shintoAssociation:'eightfold', auspicious:true}
- `evaluateGiftAmount(40000, 'wedding')` → inauspicious (contains 4, even amount for wedding)
- `evaluateGiftAmount(30000, 'wedding')` → auspicious (odd, no 4 or 9)
- Seimei handan: given stroke counts [familyNameStrokes[], givenNameStrokes[]], verify all five grid values
- Rokuyō: given a date, verify correct day in cycle

---

### 9. Vedic / Indian (`vedic-indian.js`)

**Computational Processes:**

1. **Psychic Number**: Day of birth (1–31) → reduce to single digit (1–9).
2. **Destiny Number**: Full birth date (DD+MM+YYYY) → sum all digits → reduce to single digit.
3. **Name Number**: Name → letter values → sum → reduce. Uses a letter mapping similar to Chaldean.
4. **Planetary Attribution**: Each digit 1–9 → planet (1=Sun/Surya, 2=Moon/Chandra, 3=Jupiter/Brihaspati, 4=Rahu, 5=Mercury/Budha, 6=Venus/Shukra, 7=Ketu, 8=Saturn/Shani, 9=Mars/Mangala).
5. **Katapayadi Encoding**: The authentic ancient system. Maps Sanskrit consonants to digits 0–9 per the Katapayadi scheme (ka-ṭa-pa-ya classes). Given a Sanskrit word/verse, extract the encoded number by reading consonant values in reverse.
6. **Compound Number Interpretation**: Numbers 10–52, same structure as Chaldean (shared genealogy).
7. **Gemstone Prescription**: Each number/planet → recommended gemstone.
8. **Compatibility**: Compare two Psychic Numbers or Destiny Numbers for harmony.
9. **Yuga Cycle Reference**: Lookup cosmological cycle numbers (Kali Yuga = 432,000; Mahayuga = 4,320,000; etc.) — not calculated but referenced for context.

**Configuration Options:**

| Option | Values | Default | Effect |
|--------|--------|---------|--------|
| `system` | `'modern'`, `'katapayadi'` | `'modern'` | Modern Cheiro-derived vs. authentic Katapayadi encoding |
| `letterMapping` | `'vedic'`, `'chaldean'` | `'vedic'` | The specific letter-value table (very similar to Chaldean but with minor variations in some practitioners' tables) |
| `planetaryNames` | `'sanskrit'`, `'english'`, `'both'` | `'both'` | How planet names are reported |

**Named Presets:**

- `'modern'` — The popular "Vedic numerology" system (Psychic/Destiny/Name Numbers, Cheiro-derived planetary scheme)
- `'katapayadi'` — Authentic Indian Katapayadi encoding for Sanskrit input
- `'jyotish'` — Planetary associations using full Navagraha framework with Rahu/Ketu

**Meaning Data:**

Numbers 1–13 with Vedic/Indian associations from systems table. Planetary attribution table with Sanskrit and English names, gemstones, colors, elements. Katapayadi consonant-digit mapping table. Compound number meanings 10–52. Yuga cycle reference numbers.

**Test Cases:**

- `psychicNumber(15)` → 6 (1+5)
- `destinyNumber({day:15, month:8, year:1990})` → computed and verified
- `planet(1)` → {sanskrit:'Surya', english:'Sun', gemstone:'Ruby'}
- `planet(4)` → {sanskrit:'Rahu', english:'North Node'}
- Katapayadi: verify 'gopībhāgya' encodes π digits (known test case from source material)
- `compoundMeaning(16)` → same as Chaldean 16 meaning (shared genealogy)
- Compatibility: `compatible(1, 4)` → result with explanation

---

### 10. Egyptian (`egyptian.js`)

**Computational Processes:**

This system has no systematic digit-reduction algorithm. It is primarily a meaning-lookup system with some computational elements:

1. **Number Meaning Lookup**: Given a number (at face value, not reduced), return its Egyptian mythological/ritual associations.
2. **Hieroglyphic Numeral Representation**: Convert a decimal number to its base-10 additive hieroglyphic representation (1=single stroke, 10=hobble/arch, 100=coiled rope, 1000=lotus, 10,000=finger, 100,000=tadpole, 1,000,000=Heh kneeling figure).
3. **Repetition Analysis**: "To be spoken N times" — analyze ritual repetition patterns. The number of repetitions carries power (common: 4 times, 7 times, 9 times).
4. **Decan Identification**: Given a position (1–36), identify the corresponding decan (star-group ruling a 10-day week).

**Configuration Options:**

| Option | Values | Default | Effect |
|--------|--------|---------|--------|
| `period` | `'oldKingdom'`, `'newKingdom'`, `'ptolemaic'` | `'newKingdom'` | Emphasis on which period's associations to prioritize |
| `includeGreekSources` | `true` / `false` | `true` | Whether to include Plutarch and other Greek-reported Egyptian material (some of which is contested) |

**Meaning Data:**

Numbers 1–13 from systems table, plus additional significant numbers (14, 36, 42, etc.) with mythological context. Hieroglyphic numeral symbols. 36 decans. Ennead (9 gods of Heliopolis), Ogdoad (8 primordial deities of Hermopolis).

**Test Cases:**

- `meaning(9)` → Ennead of Heliopolis reference
- `meaning(8)` → Ogdoad of Hermopolis reference
- `meaning(42)` → 42 assessors/judges of the dead
- `toHieroglyphic(1234)` → {thousands:1, hundreds:2, tens:3, ones:4} with symbol descriptions
- `toHieroglyphic(1000000)` → the Heh hieroglyph
- `decan(1)` → first decan info; `decan(36)` → last decan info
- `ritualRepetition(4)` → meaning of 4-fold repetition in Egyptian magical practice

---

### 11. Mayan (`mayan.js`)

**Computational Processes:**

1. **Vigesimal (Base-20) Conversion**: Convert decimal numbers to Mayan vigesimal representation. Note: the Long Count uses a modified base-20 where the second position counts 18×20=360 (Tun) instead of 20×20.
2. **Tzolkin Date Calculation**: Given a starting reference date and a target date, compute the Tzolkin position (day-number 1–13 paired with day-sign 1 of 20). The 260-day cycle = 13 × 20.
3. **Haab Date Calculation**: Compute the 365-day solar calendar position (18 months of 20 days + 5 Wayeb days).
4. **Long Count Calculation**: Convert between Gregorian dates and Long Count positions (Baktun.Katun.Tun.Uinal.Kin). Requires a correlation constant.
5. **Calendar Round**: Determine when Tzolkin and Haab positions realign (every 18,980 days = 52 Haab years = 73 Tzolkin cycles).
6. **Day-Sign Interpretation**: Given a Tzolkin date (e.g., 4 Ahau), return the character/destiny associations.
7. **Trecena (13-Day Period)**: Identify which 13-day period a date falls in and its ruling deity.
8. **Dot-and-Bar Representation**: Convert a number 0–19 to its Mayan dot-and-bar form (dot=1, bar=5, shell=0).

**Configuration Options:**

| Option | Values | Default | Effect |
|--------|--------|---------|--------|
| `correlationConstant` | `584283` (GMT), `584285` (Lounsbury), number | `584283` | The Julian Day Number correlation between the Mayan Long Count epoch and the Gregorian calendar. The GMT (Goodman-Martinez-Thompson) constant is most widely accepted. |
| `daySignLanguage` | `'yukatek'`, `'kiche'` | `'yukatek'` | Which Mayan language's day-sign names to use |
| `longCountDigits` | `5`, `6`, `7`... | `5` | How many positions in Long Count display (5 = Baktun resolution; higher includes Piktun, etc.) |

**Named Presets:**

- `'gmt'` — GMT correlation 584283, Yukatek names, 5-digit Long Count
- `'lounsbury'` — Lounsbury correlation 584285
- `'kiche'` — K'iche' day-sign names (reflecting living daykeeping tradition)

**Meaning Data:**

20 day-signs (Imix through Ajaw in Yukatek; Imox through Ajpu in K'iche') with names, meanings, associated deities. Numbers 1–13 with Mayan meanings from systems table. Long Count period names and durations. 20 trecena rulers.

**Test Cases:**

- `toLongCount(new Date(2012, 11, 21))` → `13.0.0.0.0` with GMT correlation (the famous 2012 date)
- `fromLongCount([13,0,0,0,0])` → December 21, 2012 (GMT)
- `tzolkinDate(new Date(2012, 11, 21))` → 4 Ajaw (verify against published tables)
- `dotAndBar(0)` → shell symbol; `dotAndBar(7)` → 1 bar + 2 dots; `dotAndBar(19)` → 3 bars + 4 dots
- `calendarRound(new Date())` → current Tzolkin + Haab pairing
- Verify 260 Tzolkin days cycle correctly
- Verify Long Count arithmetic: 1 Tun = 360 days (not 400), 1 Katun = 7200, 1 Baktun = 144000
- `daySigning('4 Ajaw')` → destiny/character interpretation
- Correlation constant switch: same date → different Long Count with different constant

---

### 12. Yoruba / Ifá (`yoruba-ifa.js`)

**Computational Processes:**

1. **Odù Generation (Binary Casting)**: Simulate the divination process. Four binary marks (single | or double ||) produce one of 16 principal Odù. Two sets of four marks produce one of 256 composite (Omo Odù) figures.
2. **Palm Nut (Ikin) Method**: Simulate the grabbing of 16 palm nuts — remainder of 1 or 2 determines the mark for each position (4 positions per half-figure).
3. **Divining Chain (Opele) Method**: Simulate casting the 8-pod chain — each pod falls face-up or face-down, determining 8 binary marks in a single cast.
4. **Odù Identification**: From 4 binary marks, identify the principal Odù by name and rank.
5. **Composite Odù Identification**: From two principal Odù, identify the composite figure and its name.
6. **Odù Ranking**: Report the hierarchical rank of an Odù (Ogbe is senior, Ofun is junior — but rankings vary by lineage).
7. **Orisha Association**: Map Odù to associated Orishas.

**Configuration Options:**

| Option | Values | Default | Effect |
|--------|--------|---------|--------|
| `castingMethod` | `'ikin'`, `'opele'`, `'manual'` | `'opele'` | Palm nuts, chain, or direct binary input |
| `rankingLineage` | `'standard'`, `'alternate'` | `'standard'` | Odù ranking order (varies across Yoruba lineages) |
| `tradition` | `'yoruba'`, `'lukumi'`, `'candomble'` | `'yoruba'` | Affects Orisha-number associations and naming conventions |

**Named Presets:**

- `'yoruba'` — Yoruba homeland tradition, standard ranking, ikin or opele
- `'lukumi'` — Cuban Santería/Lukumí adaptations (Orisha-number associations canonized differently)
- `'candomble'` — Brazilian Candomblé variant

**Meaning Data:**

16 principal Odù with: name, binary representation, rank (in standard and alternate orderings), associated Orisha(s), keywords, description. Known composite figures (256 total) with names. Orisha-number associations: Ogun=7, Oya=9, Shango=6/12, Obatala=8, etc. (noting these vary by lineage).

**Test Cases:**

- `identifyOdu([1,1,1,1])` → Ogbe (all single marks)
- `identifyOdu([2,2,2,2])` → Oyeku (all double marks)
- `compositeOdu('Ogbe', 'Oyeku')` → the most powerful composite figure
- `rank('Ogbe')` → 1 (senior); `rank('Ofun')` → 16 (junior)
- Palm nut simulation: verify produces valid marks (1 or 2 only)
- Opele simulation: verify produces 8 binary marks in one cast
- `orishaFor('Osa')` → Oya (9th position in many rankings)
- Tradition switch: verify Orisha associations differ between 'yoruba' and 'lukumi'
- Verify total composite space = 256 (16 × 16)
- Binary representation: verify `[1,1,1,1]` = Ogbe is consistent with the "single mark = |" convention

---

### 13. Norse / Runic (`norse-runic.js`)

**Computational Processes:**

1. **Rune Positional Value**: Each rune in the Elder Futhark → its ordinal position (Fehu=1 through Dagaz/Othala=24).
2. **Ætt Classification**: Determine which of the 3 ættir (groups of 8) a rune belongs to, and its position within that ætt. Ætt 1 (Freyr's) = Fehu through Wunjo. Ætt 2 (Hagal's/Heimdall's) = Hagalaz through Sowilo. Ætt 3 (Tyr's) = Tiwaz through Dagaz/Othala.
3. **Runic Name Value**: Sum the positional values of runes corresponding to the letters in a name (requires transliteration from Latin to rune equivalents). This is a modern reconstruction but widely practiced.
4. **Ætt Cipher Encoding/Decoding**: The historical cipher method where a rune is encoded as its ætt number + position within that ætt (attested in some Scandinavian inscriptions).
5. **Rune Drawing Simulation**: Single rune draw, three-rune spread, or other configurable spreads.
6. **Younger Futhark / Anglo-Saxon Futhorc Support**: Alternative rune sets with different orderings and character counts.

**Configuration Options:**

| Option | Values | Default | Effect |
|--------|--------|---------|--------|
| `runeSet` | `'elder'`, `'younger'`, `'angloSaxon'` | `'elder'` | Which Futhark to use (24, 16, or 28–33 runes) |
| `finalRune` | `'dagaz'`, `'othala'` | `'othala'` | Position of the 24th rune (ordering varies in historical sources) |
| `blankRune` | `true` / `false` | `false` | Include the "Wyrd" blank rune (Blum's modern invention — disabled by default, flagged as non-historical when enabled) |
| `reversals` | `true` / `false` | `false` | Allow reversed rune meanings (modern practice, not historically attested) |

**Named Presets:**

- `'historical'` — Elder Futhark, no blank, no reversals, Othala final (closest to attested practice)
- `'thorsson'` — Elder Futhark, no blank, no reversals, Dagaz final (Edred Thorsson's ordering)
- `'blum'` — Elder Futhark with blank rune and reversals (Ralph Blum's popular system)

**Meaning Data:**

24 Elder Futhark runes with: character (Unicode rune block), name, phoneme, position, ætt, meaning keywords, meaning description (from rune poems: Old Norwegian, Old Icelandic, Anglo-Saxon where available). 16 Younger Futhark runes. Anglo-Saxon Futhorc runes. Mythological number meanings (3, 8, 9, 12, 13 from systems table). Reversed meanings (when enabled).

**Test Cases:**

- `runeValue('ᚠ')` → 1 (Fehu); `runeValue('ᛟ')` → 24 (Othala, if finalRune='othala')
- `aett('ᚠ')` → {aett:1, position:1, name:"Freyr's ætt"}
- `aett('ᚺ')` → {aett:2, position:1, name:"Hagal's ætt"}
- `aettCipher('ᛁ')` → {aett:2, position:3} — encoding of Isa
- `nameValue('ODIN')` — transliterate and sum rune positions
- Blank rune: only available when `blankRune:true`, returns meaning of "unknowable/fate"
- Younger Futhark: verify 16 runes, different ordering
- 540 doors of Valhalla: `9 * 60 = 540` — reference validation
- Draw simulation: verify returned rune is valid member of selected rune set

---

### 14. Celtic / Ogham (`celtic-ogham.js`)

**Computational Processes:**

1. **Ogham Letter Positioning**: 20 (later 25 with forfeda) letters in 4 aicme of 5. Each letter → positional number within its aicme and overall.
2. **Tree Association**: Each Ogham letter → its tree/plant. Standard associations from the Ogham Tract in the Book of Ballymote.
3. **Graves' Tree Calendar** (optional): 13 consonants mapped to 13 lunar months. Flagged as modern construction when enabled.
4. **Ogham Name Analysis**: Transliterate a name to Ogham letters, sum positional values.
5. **Divination Draw**: Single-fid or multi-fid draws from the Ogham set.
6. **Triad Lookup**: Given a number, look up relevant Irish/Welsh triadic associations.

**Configuration Options:**

| Option | Values | Default | Effect |
|--------|--------|---------|--------|
| `includeGraves` | `true` / `false` | `false` | Include Graves' 13-month tree calendar (flagged as 1948 literary construction) |
| `forfeda` | `true` / `false` | `false` | Include the 5 supplementary letters (forfeda), extending from 20 to 25 |
| `treeAssociations` | `'ballymote'`, `'graves'`, `'both'` | `'ballymote'` | Source for tree-letter associations |

**Named Presets:**

- `'historical'` — Book of Ballymote associations, 20 letters, no Graves calendar
- `'neopagan'` — Graves' tree calendar included, all associations, forfeda optional
- `'scholarly'` — Ballymote plus forfeda, no Graves, scholarly notes on contested associations

**Meaning Data:**

20 Ogham letters (+ 5 forfeda) with: character (Unicode Ogham block), name, tree, aicme position, overall position, meaning. Graves' 13 lunar months (when enabled). Significant numbers (3, 5, 7, 9, 12, 13, 17, 27) from systems table. Irish Triads selections.

**Test Cases:**

- `letterPosition('Beith')` → {aicme:1, posInAicme:1, overall:1, tree:'Birch'}
- `letterPosition('Luis')` → {aicme:1, posInAicme:2, overall:2, tree:'Rowan'}
- Verify 4 aicme × 5 = 20 letters in standard set
- Graves calendar: only available when `includeGraves:true`; returns month associations; includes warning about modern construction
- Forfeda: when disabled, letters 21–25 throw error; when enabled, they return values
- `triad(3)` → sample Irish triadic saying
- `nameAnalysis('BRIGID')` → Ogham transliteration + summed value

---

### 15. Neoplatonic (`neoplatonic.js`)

**Computational Processes:**

1. **Decad Reduction**: Reduce any number to its Decad principle (1–10) by extracting factors and relationships.
2. **Mathematical Property Analysis**: For any number, report its mathematical properties: odd/even, prime, composite, perfect, abundant, deficient, triangular, square, cubic, etc. Each property carries theological meaning.
3. **Perfect Number Identification**: Check if a number is perfect (equal to sum of proper divisors): 6, 28, 496, 8128...
4. **Triangular Number Identification**: Check if a number is triangular (sum of first n integers): 1, 3, 6, 10, 15, 21, 28, 36, 45, 55...
5. **Tetractys Analysis**: Report the Tetractys structure (1+2+3+4=10) and its significance.
6. **Factorization with Theological Commentary**: Factor a number and explain the metaphysical significance of its factors per Neoplatonic theology.
7. **Ratio Analysis**: Given two numbers, report their ratio and whether it corresponds to musically/cosmologically significant intervals (octave 2:1, fifth 3:2, fourth 4:3).

**Configuration Options:**

| Option | Values | Default | Effect |
|--------|--------|---------|--------|
| `source` | `'plotinus'`, `'iamblichus'`, `'nicomachus'`, `'composite'` | `'composite'` | Which Neoplatonic authority's emphasis to follow. Plotinus: The One beyond being. Iamblichus: additional hypostases, more layered. Nicomachus: Arithmetical focus. |
| `includeDeityAssociations` | `true` / `false` | `true` | Include Greek deity associations (7=Athena, 6=Aphrodite, etc.) |

**Meaning Data:**

Numbers 1–10 with Neoplatonic Decad meanings from the systems table. Mathematical property definitions. Perfect numbers list. Triangular numbers list. Deity associations per number. Tetractys explanation.

**Test Cases:**

- `isPerfect(6)` → true (1+2+3=6); `isPerfect(28)` → true; `isPerfect(12)` → false
- `isTriangular(10)` → true (1+2+3+4); `isTriangular(153)` → true (1+2+...+17)
- `properties(7)` → {odd:true, prime:true, deficient:true, ...} → "Neither generates nor is generated within the Decad"
- `properties(6)` → {even:true, perfect:true, triangular:true, ...} → "The Hexad, perfection, harmony"
- `analyze(153)` → "Triangular number of 17; 17 = 10+7 = Law+Grace (Christian/Augustinian reading)"
- `ratio(3, 2)` → {ratio:'3:2', interval:'perfect fifth', significance:'...'}
- `decadPrinciple(24)` → related to 6 (24 = 4×6) or 2+4=6

---

### 16. Christian Symbolic (`christian-symbolic.js`)

**Computational Processes:**

1. **Biblical Number Lookup**: Given a number, return all biblical/patristic associations.
2. **Augustinian Factorization**: Factor a number and provide theological commentary in the tradition of Augustine's number analysis. E.g., 153 = triangular(17), 17 = 10(Commandments) + 7(Gifts of the Spirit).
3. **Typological Pairs**: Given a number, report Old Testament / New Testament typological pairings (e.g., 12 tribes → 12 apostles).
4. **Latin Isopsephy** (optional): Compute Latin letter values for phrases using Roman numeral equivalents.
5. **Revelation Number Analysis**: Specialized analysis for numbers prominent in Revelation (7, 12, 24, 144,000, 666/616, 1000).

**Configuration Options:**

| Option | Values | Default | Effect |
|--------|--------|---------|--------|
| `tradition` | `'catholic'`, `'orthodox'`, `'protestant'`, `'ecumenical'` | `'ecumenical'` | Which interpretive tradition to emphasize (mainly affects emphasis, not core data) |
| `includeLatinIsopsephy` | `true` / `false` | `false` | Enable Latin letter-value calculations |
| `beastNumber` | `666`, `616` | `666` | The number of the Beast (both are attested in ancient manuscripts; Papyrus 115 has 616) |

**Meaning Data:**

Numbers 1–13 from systems table, plus 24, 40, 70, 144,000, 153, 666/616, 888, 1000. Patristic commentary references (Augustine, Irenaeus, Isidore). Typological pairs.

**Test Cases:**

- `meaning(3)` → Trinity associations
- `meaning(7)` → creation days, sacraments, deadly sins, gifts of Spirit, seals
- `meaning(153)` → Augustinian analysis (triangular 17, 10+7)
- `meaning(666)` → Beast number, Neron Kaisar decoding
- With beastNumber=616: `meaning(616)` → variant reading, possible Gaius Caesar encoding
- `meaning(888)` → Jesus in Greek isopsephy (cross-reference)
- `typology(12)` → {OT:'12 tribes', NT:'12 apostles', Revelation:'12 gates of New Jerusalem'}
- Latin isopsephy: `latinValue('DIC LVX')` → computed value using D=500, I=1, C=100, L=50, V=5, X=10

---

### 17. Thelemic (`thelemic.js`)

**Computational Processes:**

1. **Hebrew Gematria**: Import/use Hebrew gematria calculation (delegates to hebrew-gematria module or internal reimplementation).
2. **Greek Isopsephy**: Import/use Greek isopsephy calculation.
3. **AIQ BKR (Qabalah of Nine Chambers)**: Group letters into 9 chambers by reducing standard values: Chamber 1 = {Aleph(1), Yod(10), Qof(100)}, Chamber 2 = {Bet(2), Kaf(20), Resh(200)}, etc. Find cross-correspondences.
4. **English Qabalah Ciphers**: Multiple proposed systems:
   - **ALW** (Aiwass-Liber-W): A=1, L=2, W=3, H=4, S=5, D=6, O=7, Z=8, K=9, V=10, G=11, R=12, C=13, N=14, Y=15, J=16, U=17, F=18, Q=19, B=20, M=21, X=22, I=23, T=24, E=25, P=26
   - **NAEQ** (New Aeon English Qabalah): Different mapping derived from Liber AL analysis
   - **Trigrammaton**: Another proposed English cipher
   - **Simple English** (A=1 sequential): The baseline
5. **Sepher Sephiroth Cross-Reference**: Given a number, look up all Hebrew words with that gematria value from Crowley's dictionary.
6. **Tree of Life Path Analysis**: Given a number, identify its position on the Tree (Sephirah 1–10 or path 11–32) and all correspondences (Tarot trump, Hebrew letter, astrological attribution, color, etc. per Liber 777).
7. **93 Current Verification**: Check if a word/phrase equals 93 in any supported cipher (the central verification in Thelemic practice — θελημα and ἀγάπη both = 93 in Greek).
8. **Notariqon**: Take first letters of each word in a phrase and form a new word. Reverse: expand a word into a phrase where each letter begins a word.
9. **Temurah**: Letter permutation/substitution ciphers (e.g., Atbash, Albam, etc.).

**Configuration Options:**

| Option | Values | Default | Effect |
|--------|--------|---------|--------|
| `englishCipher` | `'alw'`, `'naeq'`, `'trigrammaton'`, `'simple'` | `'alw'` | Which English Qabalah cipher to use |
| `primaryScript` | `'hebrew'`, `'greek'`, `'english'` | `'hebrew'` | Default script for gematria operations |
| `treeSystem` | `'goldenDawn'`, `'crowley'` | `'crowley'` | Path attribution system (Crowley modified some Golden Dawn attributions) |
| `includeQliphoth` | `true` / `false` | `false` | Include qliphothic (shadow Tree) correspondences |

**Named Presets:**

- `'standard93'` — ALW English cipher, Hebrew+Greek primary, Crowley tree
- `'goldenDawn'` — Simple English, Hebrew primary, Golden Dawn tree
- `'naeq'` — NAEQ cipher variant

**Meaning Data:**

Liber 777 correspondence tables (as much as can be encoded): Sephiroth 1–10 with all correspondences, paths 11–32 with Hebrew letter, Tarot trump, astrological attribution, color scales. Sepher Sephiroth number-word dictionary (key entries). English Qabalah mapping tables for all supported ciphers. Numbers 1–13 from systems table. Significant Thelemic numbers: 11, 31, 93, 156, 220, 333, 418, 666, 777, 888.

**Test Cases:**

- Greek: `greekValue('θελημα')` → 93; `greekValue('ἀγάπη')` → 93 (the core Thelemic equivalence)
- Greek: `greekValue('τὸ μέγα θηρίον')` → 666
- Hebrew: `hebrewValue('אברהדברא')` → 418 (Abrahadabra)
- ALW: `englishValue('THELEMA', 'alw')` → computed value
- AIQ BKR: `aiqBkr('א')` → 1, `aiqBkr('י')` → 1, `aiqBkr('ק')` → 1 (same chamber)
- `treePath(11)` → {letter:'Aleph', tarot:'The Fool', attribution:'Air', connects:'Keter-Chokmah'}
- `sephiroth(6)` → {name:'Tiphareth', translation:'Beauty', planet:'Sun', ...}
- Notariqon: `firstLetters('Do what thou wilt')` → 'DWTW'
- Atbash: `atbash('א')` → 'ת', `atbash('ב')` → 'ש'
- `is93('LOVE', 'alw')` → true/false depending on ALW value

---

### 18. Tarot (`tarot.js`)

**Computational Processes:**

1. **Birth Card (Soul Card) Calculation**: Sum all digits of birth date (MM+DD+YYYY), reduce. Map result to Major Arcanum. If result is 10–22, it IS the card; if 1–9, it maps directly. The reduction chain creates linked triads (e.g., 19→10→1 links The Sun, Wheel of Fortune, and The Magician).
2. **Card Reduction Chain**: For any Major Arcanum number, compute the full reduction chain showing all linked cards.
3. **Hebrew Letter Correspondence**: Map each of the 22 Major Arcana to Hebrew letters per the chosen system (Lévi vs. Golden Dawn vs. Crowley — these DIFFER).
4. **Astrological Attribution**: Map each Major Arcanum to its astrological attribution (zodiac sign, planet, or element) per the chosen system.
5. **Minor Arcana Numerology**: Each pip number (Ace–10) carries numerological meaning that interacts with the suit element. Optionally map to Sephiroth (Golden Dawn innovation).
6. **Year Card**: Current year's digits summed and reduced → the Major Arcanum governing the year.
7. **Daily Card**: Date digits summed and reduced → the card of the day.
8. **Spread Position Numerology**: Numbers assigned to spread positions carry their own numerological layer.

**Configuration Options:**

| Option | Values | Default | Effect |
|--------|--------|---------|--------|
| `tradition` | `'marseille'`, `'goldenDawn'`, `'waite'`, `'crowley'` | `'waite'` | Determines card ordering (Justice/Strength swap), Hebrew letter assignments, and astrological attributions |
| `hebrewMapping` | `'levi'`, `'goldenDawn'`, `'crowley'` | per tradition | Which Hebrew letter assignment system (Lévi: Aleph=Magician; GD/Waite/Crowley: Aleph=Fool) |
| `justiceStrengthSwap` | `true` / `false` | per tradition | Whether 8=Strength/11=Justice (Waite) or 8=Justice/11=Strength (Marseille/GD/Crowley) |
| `foolPlacement` | `'beginning'`, `'between20and21'`, `'unnumbered'` | per tradition | Where The Fool sits in the sequence |
| `reversals` | `true` / `false` | `true` | Whether reversed card meanings are included |
| `sephiroticPips` | `true` / `false` | `false` | Map Minor Arcana pips to Sephiroth (Golden Dawn system) |

**Named Presets:**

- `'marseille'` — 8=Justice, 11=Strength, Fool unnumbered, no sephirotic pips, continental tradition
- `'waite'` — 8=Strength, 11=Justice, Fool=0 at start, GD Hebrew letters, reversals enabled
- `'crowley'` — Thoth deck: 8=Adjustment(Justice), 11=Lust(Strength), Fool=0, Crowley Hebrew letters, Crowley card names, sephirotic pips enabled
- `'goldenDawn'` — GD attribution system, 8=Justice, 11=Strength, sephirotic pips

**Meaning Data:**

22 Major Arcana (0/unnumbered through XXI) with: number, name (per tradition — names differ between Marseille, Waite, and Crowley), Hebrew letter assignment (per tradition), astrological attribution, keywords, upright meaning, reversed meaning. 40 Minor Arcana pips (Ace–10 in four suits) with numerological meanings per suit. 16 Court cards. Sephirotic pip mapping (when enabled).

**Test Cases:**

- Birth card: `birthCard({month:7, day:4, year:1776})` → 7+4+1+7+7+6=32→3+2=5 → The Hierophant
- Birth card: `birthCard({month:12, day:25, year:1990})` → 1+2+2+5+1+9+9+0=29→2+9=11 → Justice (Waite) or Strength (Marseille)
- Reduction chain: `reductionChain(19)` → [19('The Sun'), 10('Wheel of Fortune'), 1('The Magician')]
- Hebrew letter: with GD system, card 0 (Fool) → Aleph; with Lévi system, card 1 (Magician) → Aleph
- Justice/Strength swap: Waite tradition card 8 → Strength; Marseille tradition card 8 → Justice
- Crowley card names: card 11 → 'Lust' (not 'Strength'); card 8 → 'Adjustment' (not 'Justice')
- Minor Arcana: `pipMeaning(5, 'swords')` → meaning; with sephirotic pips, also maps to Geburah
- Year card: `yearCard(2026)` → 2+0+2+6=10 → Wheel of Fortune
- Fool placement: Marseille → unnumbered; Waite/Crowley → 0 at beginning

---

## III. Shared Infrastructure

### `test-runner.js`

Minimal assert-based test framework:

- `assert(condition, message)` — basic truth assertion
- `assertEqual(a, b, message)` — strict equality
- `assertDeepEqual(a, b, message)` — deep object/array comparison
- `assertThrows(fn, message)` — verify function throws
- `assertApprox(a, b, epsilon, message)` — approximate numeric equality
- `describe(suiteName, fn)` — group tests
- `it(testName, fn)` — individual test
- `runAll()` — execute all registered tests, report pass/fail counts
- Output: plain text compatible with terminal and browser console

### `unicode-utils.js`

Shared Unicode handling for Hebrew, Greek, Arabic, Runic, and Ogham characters:

- Character normalization (handle combining marks, final forms)
- Script detection (identify which script a string is in)
- Hebrew final-form detection (ך,ם,ן,ף,ץ)
- Greek archaic character handling (Digamma, Qoppa, Sampi)
- Arabic character isolation/joining form normalization
- Vowel/consonant classification per script

### `reduction-utils.js`

Shared digit-reduction functions (since multiple systems use digit summing):

- `digitSum(n)` — sum of digits
- `reduce(n, stopAt)` — reduce until single digit or until reaching a value in `stopAt` array
- `reductionPath(n, stopAt)` — return the full chain of intermediate sums
- `isTriangular(n)`, `isPerfect(n)`, `isPrime(n)`, etc. — mathematical property checks used by Neoplatonic and Christian systems

### `date-utils.js`

Shared date handling:

- Julian Day Number conversion (needed by Mayan, rokuyō)
- Gregorian ↔ Julian calendar conversion
- Date component extraction
- Lunisolar calendar approximation (for Japanese rokuyō)

---

## IV. Implementation Sequence

The systems have dependencies and shared patterns. The recommended build order:

**Phase 1 — Foundation (shared utilities + the two most algorithm-heavy systems)**

1. `test-runner.js`
2. `unicode-utils.js`
3. `reduction-utils.js`
4. `date-utils.js`
5. `pythagorean.js` + tests (establishes the letter-mapping and reduction patterns)
6. `hebrew-gematria.js` + tests (establishes the non-reducing alphabetic value pattern)

**Phase 2 — Systems sharing the Cheiro genealogy**

7. `chaldean.js` + tests
8. `vedic-indian.js` + tests (shares Chaldean planetary scheme and compound numbers)

**Phase 3 — Other alphabetic systems**

9. `greek-isopsephy.js` + tests
10. `arabic-abjad.js` + tests
11. `hurufism.js` + tests (extends Arabic Abjad)

**Phase 4 — The syncretic systems (depend on Hebrew + Greek + earlier modules)**

12. `thelemic.js` + tests
13. `tarot.js` + tests

**Phase 5 — Culturally distinct systems**

14. `chinese-cosmological.js` + tests
15. `japanese-shinto.js` + tests
16. `mayan.js` + tests
17. `yoruba-ifa.js` + tests

**Phase 6 — Mythological/theological lookup systems**

18. `norse-runic.js` + tests
19. `celtic-ogham.js` + tests
20. `neoplatonic.js` + tests
21. `christian-symbolic.js` + tests
22. `egyptian.js` + tests

---

## V. File Structure

```
numerology-js/
├── shared/
│   ├── test-runner.js
│   ├── unicode-utils.js
│   ├── reduction-utils.js
│   └── date-utils.js
├── pythagorean/
│   ├── pythagorean.js
│   └── pythagorean.test.js
├── chaldean/
│   ├── chaldean.js
│   └── chaldean.test.js
├── hebrew-gematria/
│   ├── hebrew-gematria.js
│   └── hebrew-gematria.test.js
├── greek-isopsephy/
│   ├── greek-isopsephy.js
│   └── greek-isopsephy.test.js
├── arabic-abjad/
│   ├── arabic-abjad.js
│   └── arabic-abjad.test.js
├── hurufism/
│   ├── hurufism.js
│   └── hurufism.test.js
├── chinese-cosmological/
│   ├── chinese-cosmological.js
│   └── chinese-cosmological.test.js
├── japanese-shinto/
│   ├── japanese-shinto.js
│   └── japanese-shinto.test.js
├── vedic-indian/
│   ├── vedic-indian.js
│   └── vedic-indian.test.js
├── egyptian/
│   ├── egyptian.js
│   └── egyptian.test.js
├── mayan/
│   ├── mayan.js
│   └── mayan.test.js
├── yoruba-ifa/
│   ├── yoruba-ifa.js
│   └── yoruba-ifa.test.js
├── norse-runic/
│   ├── norse-runic.js
│   └── norse-runic.test.js
├── celtic-ogham/
│   ├── celtic-ogham.js
│   └── celtic-ogham.test.js
├── neoplatonic/
│   ├── neoplatonic.js
│   └── neoplatonic.test.js
├── christian-symbolic/
│   ├── christian-symbolic.js
│   └── christian-symbolic.test.js
├── thelemic/
│   ├── thelemic.js
│   └── thelemic.test.js
├── tarot/
│   ├── tarot.js
│   └── tarot.test.js
└── run-all-tests.js
```

---

## VI. Cross-System Verification Points

These are factual equivalences documented in the source material that serve as integration tests when multiple systems are operational:

| Fact | Systems Involved | Expected Result |
|------|-----------------|-----------------|
| Thelema = Agape = 93 | Greek Isopsephy, Thelemic | Both words compute to 93 |
| Iesous = 888 | Greek Isopsephy, Christian Symbolic | Cross-verified |
| YHVH = 26 | Hebrew Gematria, Thelemic | Both compute to 26 |
| Echad = Ahavah = 13 | Hebrew Gematria | Unity = Love equivalence |
| Mashiach = Nachash = 358 | Hebrew Gematria | Messiah = Serpent equivalence |
| Abrahadabra = 418 | Thelemic (Hebrew method) | Verified |
| Bismillah = 786 | Arabic Abjad | Verified |
| Allah = 66 | Arabic Abjad | Verified |
| Neron Kaisar (Hebrew transliteration) = 666 | Hebrew Gematria, Christian Symbolic | The scholarly consensus decoding |
| Luo Shu all rows/cols/diags = 15 | Chinese Cosmological | Magic square validation |
| 13 Baktun = Dec 21, 2012 (GMT) | Mayan | Long Count verification |
| 153 = triangular(17) | Neoplatonic, Christian Symbolic | Mathematical + theological |
| Chaldean and Vedic 1–9 planetary scheme identical | Chaldean, Vedic | Both systems share the same underlying planetary-number table |
| Ogbe = [1,1,1,1] = all single marks | Yoruba/Ifá | Binary representation |
| 256 = 16² = 2⁸ total Odù | Yoruba/Ifá | Complete binary space |

---

## VII. Configuration Philosophy

Each module's configuration is designed around a central tension the source material repeatedly identifies: the gap between what a tradition claims as its historical origin and what can be verified through scholarship. The configuration options let users operate in at least two modes:

1. **As-practiced**: The system as its modern adherents use it, with all accumulated modern additions (Master Numbers, Karmic Debt, planetary assignments, etc.)
2. **Historically grounded**: The system stripped to what is actually attested in historical sources, with modern additions either disabled or flagged

This is implemented through the named presets and the `isModernAddition` flag on meaning entries. The software doesn't editorialize — it provides the information and lets the user configure their stance. Both modes produce useful, complete outputs; they simply differ in what they include and how they annotate provenance.
