/**
 * Libernumerus — Egyptian Numerology
 * Number meanings, hieroglyphic numeral representation, ritual repetition analysis,
 * decan identification. Primarily a meaning-lookup system with no digit reduction.
 */
const Egyptian = (() => {
  // Core number meanings in Egyptian mythology/ritual
  const NUMBER_MEANINGS = {
    1:  { number: 1,  name: 'Atum',         meaning: 'Unity, primordial creator',
          description: 'Atum, the self-created one who emerged from the primordial waters of Nun. Represents unity, the monad, and the source of all creation.' },
    2:  { number: 2,  name: 'Geb and Nut',  meaning: 'Duality, heaven and earth',
          description: 'The separation of Geb (earth) and Nut (sky) by Shu. Represents duality, the pairing of opposites, and the cosmic division.' },
    3:  { number: 3,  name: 'Divine Triad',  meaning: 'Plurality, divine triad (Osiris/Isis/Horus)',
          description: 'The archetypal family of Osiris, Isis, and Horus. In Egyptian grammar, three indicates plurality. Represents divine family, resurrection, and completeness of a cycle.' },
    4:  { number: 4,  name: 'Four Sons of Horus', meaning: 'Completeness, cardinal directions',
          description: 'The four sons of Horus (Imsety, Hapy, Duamutef, Qebehsenuef) who guard the canopic jars. Represents completeness, the four cardinal directions, and cosmic totality.' },
    5:  { number: 5,  name: 'Five Epagomenal Days', meaning: 'The five extra days, children of Nut',
          description: 'The five epagomenal days upon which Osiris, Horus the Elder, Seth, Isis, and Nephthys were born. Days outside the regular calendar.' },
    7:  { number: 7,  name: 'Seven Hathors', meaning: 'Perfection, Hathor\'s seven aspects',
          description: 'The Seven Hathors who decree fate at birth. Seven represents perfection and magical completeness in Egyptian thought.' },
    8:  { number: 8,  name: 'Ogdoad',        meaning: 'Ogdoad of Hermopolis, eight primordial deities',
          description: 'The Ogdoad of Hermopolis: four pairs of primordial deities (Nun/Naunet, Huh/Hauhet, Kuk/Kauket, Amun/Amaunet) representing the state before creation.' },
    9:  { number: 9,  name: 'Ennead',        meaning: 'Ennead of Heliopolis, nine great gods',
          description: 'The Great Ennead of Heliopolis: Atum, Shu, Tefnut, Geb, Nut, Osiris, Isis, Seth, and Nephthys. The nine gods who form the complete divine hierarchy.' },
    10: { number: 10, name: 'Decan Week',    meaning: 'Ten-day week, decanal period',
          description: 'The Egyptian ten-day week. The calendar was divided into 36 decans, each ruling a 10-day period.' },
    12: { number: 12, name: 'Hours',         meaning: 'Hours of day/night, zodiacal divisions',
          description: 'Twelve hours of the day and twelve hours of the night. The sun god Ra travels through twelve regions of the Duat. Also the zodiacal divisions.' },
    14: { number: 14, name: 'Parts of Osiris', meaning: 'Fourteen parts of Osiris\'s dismembered body',
          description: 'The fourteen pieces into which Seth dismembered Osiris, scattered throughout Egypt. Isis gathered thirteen; the fourteenth (phallus) was eaten by an oxyrhynchus fish.' },
    36: { number: 36, name: 'Decans',        meaning: 'Thirty-six star groups ruling ten-day weeks',
          description: 'The 36 decans are star groups that rise heliacally in succession throughout the year, each ruling a 10-day week. Used for time-keeping and astrology.' },
    42: { number: 42, name: 'Assessors',     meaning: 'Forty-two judges of the dead, Negative Confession',
          description: 'The 42 assessor gods before whom the deceased recites the Negative Confession in the Hall of Two Truths. Each assessor judges a specific sin.' }
  };

  // Hieroglyphic numeral symbols (base-10 additive system)
  const HIEROGLYPHIC_SYMBOLS = {
    1:       { symbol: '|',  name: 'stroke',                 unicode: '𓏺' },
    10:      { symbol: '\u2229', name: 'hobble/heel bone',       unicode: '𓎆' },
    100:     { symbol: '𓍢', name: 'coiled rope',             unicode: '𓍢' },
    1000:    { symbol: '𓆼', name: 'lotus flower',            unicode: '𓆼' },
    10000:   { symbol: '𓂭', name: 'bent finger',             unicode: '𓂭' },
    100000:  { symbol: '𓆐', name: 'tadpole/frog',            unicode: '𓆐' },
    1000000: { symbol: '𓁨', name: 'Heh kneeling figure',     unicode: '𓁨' }
  };

  // Ritual repetition meanings
  const RITUAL_REPETITIONS = {
    1:  { times: 1,  meaning: 'Single utterance, direct invocation' },
    2:  { times: 2,  meaning: 'Duality, invoking paired forces' },
    3:  { times: 3,  meaning: 'Plurality, establishing magical reality' },
    4:  { times: 4,  meaning: 'Completeness, covering all four directions, total magical protection' },
    7:  { times: 7,  meaning: 'Perfection, invoking the Seven Hathors, maximal magical efficacy' },
    9:  { times: 9,  meaning: 'Ennead invocation, summoning the power of the nine great gods' }
  };

  // 36 Decans — traditional names and approximate periods
  const DECANS = [
    { number: 1,  name: 'Kenmet',         period: 'I Akhet 1-10',  description: 'First decan, associated with the beginning of the inundation season' },
    { number: 2,  name: 'Kenmet Her',     period: 'I Akhet 11-20', description: 'Second decan of first month of Akhet' },
    { number: 3,  name: 'Kenmet Khert',   period: 'I Akhet 21-30', description: 'Third decan of first month of Akhet' },
    { number: 4,  name: 'Kha',            period: 'II Akhet 1-10', description: 'First decan of second month of Akhet' },
    { number: 5,  name: 'Kha Her',        period: 'II Akhet 11-20', description: 'Second decan of second month of Akhet' },
    { number: 6,  name: 'Kha Khert',      period: 'II Akhet 21-30', description: 'Third decan of second month of Akhet' },
    { number: 7,  name: 'Sah',            period: 'III Akhet 1-10', description: 'Decan associated with Orion (Sah), the celestial Osiris' },
    { number: 8,  name: 'Sah Her',        period: 'III Akhet 11-20', description: 'Second decan of third month of Akhet' },
    { number: 9,  name: 'Sah Khert',      period: 'III Akhet 21-30', description: 'Third decan of third month of Akhet' },
    { number: 10, name: 'Sopdet',          period: 'IV Akhet 1-10', description: 'Decan of Sirius (Sopdet), herald of the inundation' },
    { number: 11, name: 'Sopdet Her',      period: 'IV Akhet 11-20', description: 'Second decan of fourth month of Akhet' },
    { number: 12, name: 'Sopdet Khert',    period: 'IV Akhet 21-30', description: 'Third decan of fourth month of Akhet' },
    { number: 13, name: 'Seret',           period: 'I Peret 1-10',  description: 'First decan of the growing season (Peret)' },
    { number: 14, name: 'Seret Her',       period: 'I Peret 11-20', description: 'Second decan of first month of Peret' },
    { number: 15, name: 'Seret Khert',     period: 'I Peret 21-30', description: 'Third decan of first month of Peret' },
    { number: 16, name: 'Tepy-a Seba',     period: 'II Peret 1-10', description: 'First decan of second month of Peret' },
    { number: 17, name: 'Tepy-a Seba Her', period: 'II Peret 11-20', description: 'Second decan of second month of Peret' },
    { number: 18, name: 'Tepy-a Seba Khert', period: 'II Peret 21-30', description: 'Third decan of second month of Peret' },
    { number: 19, name: 'Arit',            period: 'III Peret 1-10', description: 'First decan of third month of Peret' },
    { number: 20, name: 'Arit Her',        period: 'III Peret 11-20', description: 'Second decan of third month of Peret' },
    { number: 21, name: 'Arit Khert',      period: 'III Peret 21-30', description: 'Third decan of third month of Peret' },
    { number: 22, name: 'Seshmu',          period: 'IV Peret 1-10', description: 'First decan of fourth month of Peret' },
    { number: 23, name: 'Seshmu Her',      period: 'IV Peret 11-20', description: 'Second decan of fourth month of Peret' },
    { number: 24, name: 'Seshmu Khert',    period: 'IV Peret 21-30', description: 'Third decan of fourth month of Peret' },
    { number: 25, name: 'Kenmu',           period: 'I Shemu 1-10',  description: 'First decan of the harvest season (Shemu)' },
    { number: 26, name: 'Kenmu Her',       period: 'I Shemu 11-20', description: 'Second decan of first month of Shemu' },
    { number: 27, name: 'Kenmu Khert',     period: 'I Shemu 21-30', description: 'Third decan of first month of Shemu' },
    { number: 28, name: 'Semed',           period: 'II Shemu 1-10', description: 'First decan of second month of Shemu' },
    { number: 29, name: 'Semed Her',       period: 'II Shemu 11-20', description: 'Second decan of second month of Shemu' },
    { number: 30, name: 'Semed Khert',     period: 'II Shemu 21-30', description: 'Third decan of second month of Shemu' },
    { number: 31, name: 'Seret Weret',     period: 'III Shemu 1-10', description: 'First decan of third month of Shemu' },
    { number: 32, name: 'Seret Weret Her', period: 'III Shemu 11-20', description: 'Second decan of third month of Shemu' },
    { number: 33, name: 'Seret Weret Khert', period: 'III Shemu 21-30', description: 'Third decan of third month of Shemu' },
    { number: 34, name: 'Tepy-a Akhut',    period: 'IV Shemu 1-10', description: 'First decan of fourth month of Shemu' },
    { number: 35, name: 'Tepy-a Akhut Her', period: 'IV Shemu 11-20', description: 'Second decan of fourth month of Shemu' },
    { number: 36, name: 'Tepy-a Akhut Khert', period: 'IV Shemu 21-30', description: 'Last decan of the year, preceding the epagomenal days' }
  ];

  // Greek-source annotations (Plutarch, Herodotus, etc.)
  const GREEK_SOURCES = {
    14: 'Plutarch (De Iside et Osiride) records 14 parts of Osiris, though some traditions count differently.',
    42: 'Plutarch mentions the 42 nomes of Egypt, each providing one assessor for the judgment of the dead.',
    8:  'The Ogdoad concept was documented by Greek writers noting the Hermopolitan cosmogony.',
    9:  'The Ennead was central to Heliopolitan theology, extensively documented in Greek-period sources.',
    36: 'Decan system described by Greek astronomers who inherited Egyptian stellar observations.'
  };

  const DEFAULT_CONFIG = {
    period: 'newKingdom',
    includeGreekSources: true
  };

  function create(config) {
    const cfg = { ...DEFAULT_CONFIG, ...(config || {}) };

    /**
     * Look up the mythological/ritual meaning of a number (face value, no reduction).
     */
    function meaning(n) {
      if (typeof n !== 'number' || n < 0) return null;
      const entry = NUMBER_MEANINGS[n];
      if (!entry) return { number: n, name: null, meaning: null, description: 'No specific Egyptian mythological association recorded for this number.' };
      const result = { ...entry };
      if (cfg.includeGreekSources && GREEK_SOURCES[n]) {
        result.greekSource = GREEK_SOURCES[n];
      }
      return result;
    }

    /**
     * Convert a number to hieroglyphic numeral representation (base-10 additive).
     * Returns an object with counts per denomination and symbol descriptions.
     */
    function toHieroglyphic(n) {
      if (typeof n !== 'number' || n < 0 || !Number.isInteger(n)) return null;
      if (n === 0) return { total: 0, denominations: [], millions: 0, hundredThousands: 0, tenThousands: 0, thousands: 0, hundreds: 0, tens: 0, ones: 0 };

      const millions = Math.floor(n / 1000000);
      let remainder = n % 1000000;
      const hundredThousands = Math.floor(remainder / 100000);
      remainder = remainder % 100000;
      const tenThousands = Math.floor(remainder / 10000);
      remainder = remainder % 10000;
      const thousands = Math.floor(remainder / 1000);
      remainder = remainder % 1000;
      const hundreds = Math.floor(remainder / 100);
      remainder = remainder % 100;
      const tens = Math.floor(remainder / 10);
      const ones = remainder % 10;

      const denominations = [];
      if (millions > 0) denominations.push({ value: 1000000, count: millions, symbol: HIEROGLYPHIC_SYMBOLS[1000000] });
      if (hundredThousands > 0) denominations.push({ value: 100000, count: hundredThousands, symbol: HIEROGLYPHIC_SYMBOLS[100000] });
      if (tenThousands > 0) denominations.push({ value: 10000, count: tenThousands, symbol: HIEROGLYPHIC_SYMBOLS[10000] });
      if (thousands > 0) denominations.push({ value: 1000, count: thousands, symbol: HIEROGLYPHIC_SYMBOLS[1000] });
      if (hundreds > 0) denominations.push({ value: 100, count: hundreds, symbol: HIEROGLYPHIC_SYMBOLS[100] });
      if (tens > 0) denominations.push({ value: 10, count: tens, symbol: HIEROGLYPHIC_SYMBOLS[10] });
      if (ones > 0) denominations.push({ value: 1, count: ones, symbol: HIEROGLYPHIC_SYMBOLS[1] });

      return {
        total: n,
        millions: millions,
        hundredThousands: hundredThousands,
        tenThousands: tenThousands,
        thousands: thousands,
        hundreds: hundreds,
        tens: tens,
        ones: ones,
        denominations: denominations
      };
    }

    /**
     * Analyze ritual repetition — "to be spoken N times" patterns.
     */
    function ritualRepetition(n) {
      if (typeof n !== 'number' || n < 1) return null;
      const known = RITUAL_REPETITIONS[n];
      if (known) {
        return { ...known };
      }
      return {
        times: n,
        meaning: 'Non-standard repetition count; no specific ritual association recorded.'
      };
    }

    /**
     * Identify a decan by number (1-36).
     */
    function decan(n) {
      if (typeof n !== 'number' || n < 1 || n > 36 || !Number.isInteger(n)) return null;
      return { ...DECANS[n - 1] };
    }

    /**
     * General analysis entry point.
     */
    function analyze(input) {
      if (typeof input === 'number') {
        return {
          meaning: meaning(input),
          hieroglyphic: Number.isInteger(input) && input >= 0 ? toHieroglyphic(input) : null,
          ritualRepetition: input >= 1 ? ritualRepetition(input) : null,
          decan: (Number.isInteger(input) && input >= 1 && input <= 36) ? decan(input) : null
        };
      }
      return null;
    }

    return {
      meaning,
      toHieroglyphic,
      ritualRepetition,
      decan,
      analyze
    };
  }

  return {
    create, DEFAULT_CONFIG,
    NUMBER_MEANINGS, HIEROGLYPHIC_SYMBOLS, RITUAL_REPETITIONS, DECANS, GREEK_SOURCES
  };
})();

if (typeof module !== 'undefined') module.exports = Egyptian;
