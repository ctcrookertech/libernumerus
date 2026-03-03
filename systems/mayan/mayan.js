/**
 * Liber Numerus — Mayan Numerology
 * Vigesimal conversion, Tzolkin, Haab, Long Count, Calendar Round, day-sign interpretation
 */
const DateUtils = (typeof require !== 'undefined') ? require('../../shared/date-utils') : window.DateUtils;

const Mayan = (() => {
  // 20 Tzolkin day signs (Yukatek names)
  const DAY_SIGNS_YUKATEK = [
    { index: 0,  name: 'Imix',    meaning: 'Crocodile/Water Lily', keywords: ['beginning','nurturing','primordial'] },
    { index: 1,  name: 'Ik',      meaning: 'Wind/Breath',         keywords: ['communication','spirit','life force'] },
    { index: 2,  name: 'Akbal',   meaning: 'Night/Darkness',      keywords: ['introspection','dreams','underworld'] },
    { index: 3,  name: 'Kan',     meaning: 'Seed/Lizard',         keywords: ['abundance','growth','planting'] },
    { index: 4,  name: 'Chicchan', meaning: 'Serpent',             keywords: ['life force','kundalini','instinct'] },
    { index: 5,  name: 'Cimi',    meaning: 'Death/Transformer',   keywords: ['transformation','rebirth','ancestors'] },
    { index: 6,  name: 'Manik',   meaning: 'Deer/Hand',           keywords: ['healing','accomplishment','tools'] },
    { index: 7,  name: 'Lamat',   meaning: 'Star/Rabbit',         keywords: ['harmony','beauty','abundance'] },
    { index: 8,  name: 'Muluc',   meaning: 'Water/Moon',          keywords: ['offering','purification','flow'] },
    { index: 9,  name: 'Oc',      meaning: 'Dog',                 keywords: ['loyalty','guidance','faithfulness'] },
    { index: 10, name: 'Chuen',   meaning: 'Monkey/Artisan',      keywords: ['creativity','play','illusion'] },
    { index: 11, name: 'Eb',      meaning: 'Road/Grass',          keywords: ['path','journey','community'] },
    { index: 12, name: 'Ben',     meaning: 'Reed/Corn',           keywords: ['authority','growth','sky-earth'] },
    { index: 13, name: 'Ix',      meaning: 'Jaguar/Wizard',       keywords: ['shamanism','magic','feminine'] },
    { index: 14, name: 'Men',     meaning: 'Eagle',               keywords: ['vision','freedom','higher mind'] },
    { index: 15, name: 'Cib',     meaning: 'Vulture/Owl',         keywords: ['wisdom','forgiveness','karma'] },
    { index: 16, name: 'Caban',   meaning: 'Earth/Earthquake',    keywords: ['evolution','navigation','knowledge'] },
    { index: 17, name: 'Etznab',  meaning: 'Flint/Mirror',        keywords: ['reflection','truth','sacrifice'] },
    { index: 18, name: 'Cauac',   meaning: 'Storm/Rain',          keywords: ['purification','healing','transformation'] },
    { index: 19, name: 'Ajaw',    meaning: 'Sun Lord/Flower',     keywords: ['enlightenment','mastery','wholeness'] }
  ];

  // K'iche' names
  const DAY_SIGNS_KICHE = [
    { index: 0,  name: 'Imox',    meaning: 'Crocodile' },
    { index: 1,  name: "Iq'",     meaning: 'Wind' },
    { index: 2,  name: "Aq'ab'al", meaning: 'Night' },
    { index: 3,  name: "K'at",    meaning: 'Net/Seed' },
    { index: 4,  name: 'Kan',     meaning: 'Serpent' },
    { index: 5,  name: 'Kame',    meaning: 'Death' },
    { index: 6,  name: 'Kej',     meaning: 'Deer' },
    { index: 7,  name: "Q'anil",  meaning: 'Seed/Star' },
    { index: 8,  name: 'Toj',     meaning: 'Offering' },
    { index: 9,  name: "Tz'i'",   meaning: 'Dog' },
    { index: 10, name: "B'atz'",  meaning: 'Monkey' },
    { index: 11, name: 'E',       meaning: 'Road' },
    { index: 12, name: 'Aj',      meaning: 'Reed' },
    { index: 13, name: "I'x",     meaning: 'Jaguar' },
    { index: 14, name: "Tz'ikin", meaning: 'Eagle' },
    { index: 15, name: "Ajmaq",   meaning: 'Owl/Sinner' },
    { index: 16, name: "No'j",    meaning: 'Knowledge' },
    { index: 17, name: 'Tijax',   meaning: 'Flint' },
    { index: 18, name: 'Kawoq',   meaning: 'Storm' },
    { index: 19, name: 'Ajpu',    meaning: 'Sun Lord' }
  ];

  // Long Count period names and durations in days
  const LONG_COUNT_PERIODS = {
    kin:    1,
    uinal:  20,
    tun:    360,       // 18 × 20 (modified base-20)
    katun:  7200,      // 20 × 360
    baktun: 144000,    // 20 × 7200
    piktun: 2880000,   // 20 × 144000
    kalabtun: 57600000
  };

  // Haab months (18 months of 20 days + Wayeb)
  const HAAB_MONTHS = [
    'Pop', 'Wo', 'Sip', 'Sotz', 'Sek', 'Xul', 'Yaxkin', 'Mol', 'Chen',
    'Yax', 'Sak', 'Keh', 'Mak', 'Kankin', 'Muwan', 'Pax', 'Kayab', 'Kumku', 'Wayeb'
  ];

  // Numbers 1-13 meanings
  const NUMBER_MEANINGS = {
    1: 'Unity, beginning, the One',
    2: 'Duality, sacrifice, polarity',
    3: 'Action, creativity, the hearth',
    4: 'Stability, four directions, measurement',
    5: 'Empowerment, center of the four directions',
    6: 'Flow, equilibrium, organic stability',
    7: 'Reflection, purpose, mystical connection',
    8: 'Justice, harmony, resonance',
    9: 'Patience, perseverance, greater cycles',
    10: 'Manifestation, community, cooperation',
    11: 'Resolution, clarity, dynamic change',
    12: 'Understanding, retrospection, complex stability',
    13: 'Completion, ascension, cosmic flight'
  };

  const DEFAULT_CONFIG = {
    correlationConstant: 584283, // GMT (Goodman-Martinez-Thompson)
    daySignLanguage: 'yukatek',
    longCountDigits: 5
  };

  const VARIANTS = {
    gmt:       { correlationConstant: 584283, daySignLanguage: 'yukatek', longCountDigits: 5 },
    lounsbury: { correlationConstant: 584285, daySignLanguage: 'yukatek', longCountDigits: 5 },
    kiche:     { correlationConstant: 584283, daySignLanguage: 'kiche',   longCountDigits: 5 }
  };

  function create(config) {
    if (typeof config === 'string' && VARIANTS[config]) {
      config = { ...VARIANTS[config] };
    }
    const cfg = { ...DEFAULT_CONFIG, ...(config || {}) };

    // The Long Count epoch in JDN (depends on correlation constant)
    // GMT: Long Count 0.0.0.0.0 = JDN 584283
    const LC_EPOCH_JDN = cfg.correlationConstant;

    function getDaySigns() {
      return cfg.daySignLanguage === 'kiche' ? DAY_SIGNS_KICHE : DAY_SIGNS_YUKATEK;
    }

    // Convert decimal to vigesimal (standard base-20)
    function toVigesimal(n) {
      if (n === 0) return [0];
      const digits = [];
      let remaining = n;
      while (remaining > 0) {
        digits.unshift(remaining % 20);
        remaining = Math.floor(remaining / 20);
      }
      return digits;
    }

    // Convert Gregorian date to Long Count
    function toLongCount(date) {
      const d = DateUtils.extractComponents(date);
      const jdn = DateUtils.gregorianToJDN(d.year, d.month, d.day);
      const daysSinceEpoch = jdn - LC_EPOCH_JDN;
      return daysToLongCount(daysSinceEpoch);
    }

    function daysToLongCount(totalDays) {
      let remaining = totalDays;
      const lc = [];
      const periods = [144000, 7200, 360, 20, 1]; // baktun, katun, tun, uinal, kin
      for (const p of periods) {
        lc.push(Math.floor(remaining / p));
        remaining = remaining % p;
      }
      // Extend or truncate to configured digits
      while (lc.length < cfg.longCountDigits) lc.unshift(0);
      return lc.slice(lc.length - cfg.longCountDigits);
    }

    // Convert Long Count to Gregorian date
    function fromLongCount(lc) {
      let totalDays = 0;
      const periods = [144000, 7200, 360, 20, 1];
      const padded = lc.slice();
      while (padded.length < 5) padded.unshift(0);
      for (let i = 0; i < 5; i++) {
        totalDays += padded[i] * periods[i];
      }
      const jdn = LC_EPOCH_JDN + totalDays;
      return DateUtils.jdnToGregorian(jdn);
    }

    // Tzolkin date (260-day sacred calendar)
    function tzolkinDate(date) {
      const d = DateUtils.extractComponents(date);
      const jdn = DateUtils.gregorianToJDN(d.year, d.month, d.day);
      const daysSinceEpoch = jdn - LC_EPOCH_JDN;

      // Tzolkin reference: 0.0.0.0.0 = 4 Ajaw
      // Day number cycles 1-13, day sign cycles 0-19
      const dayNumber = ((daysSinceEpoch + 3) % 13 + 13) % 13 + 1; // 4 Ajaw → number 4 at epoch
      const daySign = ((daysSinceEpoch + 19) % 20 + 20) % 20;       // Ajaw = index 19

      const signs = getDaySigns();
      return {
        number: dayNumber,
        sign: signs[daySign],
        name: dayNumber + ' ' + signs[daySign].name
      };
    }

    // Haab date (365-day solar calendar)
    function haabDate(date) {
      const d = DateUtils.extractComponents(date);
      const jdn = DateUtils.gregorianToJDN(d.year, d.month, d.day);
      const daysSinceEpoch = jdn - LC_EPOCH_JDN;

      // Reference: 0.0.0.0.0 = 8 Kumku (day 348 of Haab year)
      const haabDay = ((daysSinceEpoch + 348) % 365 + 365) % 365;
      const monthIndex = Math.floor(haabDay / 20);
      const dayInMonth = haabDay % 20;

      return {
        day: dayInMonth,
        month: HAAB_MONTHS[monthIndex] || 'Wayeb',
        monthIndex: monthIndex,
        name: dayInMonth + ' ' + (HAAB_MONTHS[monthIndex] || 'Wayeb')
      };
    }

    // Calendar Round
    function calendarRound(date) {
      return {
        tzolkin: tzolkinDate(date),
        haab: haabDate(date)
      };
    }

    // Day-sign interpretation
    function daySignMeaning(signName) {
      const signs = getDaySigns();
      return signs.find(s => s.name.toLowerCase() === signName.toLowerCase()) || null;
    }

    // Trecena (13-day period)
    function trecena(date) {
      const tz = tzolkinDate(date);
      const trecenaNumber = Math.ceil(tz.number / 13) || 1;
      return {
        number: trecenaNumber,
        daySign: tz.sign,
        tzolkinDate: tz
      };
    }

    // Dot-and-bar representation (0-19)
    function dotAndBar(n) {
      if (n < 0 || n > 19) return null;
      if (n === 0) return { bars: 0, dots: 0, shell: true, display: '🐚' };
      const bars = Math.floor(n / 5);
      const dots = n % 5;
      let display = '';
      for (let i = 0; i < dots; i++) display += '•';
      if (bars > 0 && dots > 0) display += '\n';
      for (let i = 0; i < bars; i++) {
        display += '———';
        if (i < bars - 1) display += '\n';
      }
      return { bars, dots, shell: false, display };
    }

    function numberMeaning(n) {
      return NUMBER_MEANINGS[n] || null;
    }

    function analyze(input) {
      if (typeof input === 'object' && (input instanceof Date || (input.year && input.month && input.day))) {
        return {
          longCount: toLongCount(input),
          tzolkin: tzolkinDate(input),
          haab: haabDate(input),
          calendarRound: calendarRound(input)
        };
      }
      if (typeof input === 'number') {
        return {
          vigesimal: toVigesimal(input),
          dotAndBar: input <= 19 ? dotAndBar(input) : null,
          meaning: numberMeaning(input)
        };
      }
      return null;
    }

    return {
      toVigesimal,
      toLongCount,
      fromLongCount,
      tzolkinDate,
      haabDate,
      calendarRound,
      daySignMeaning,
      trecena,
      dotAndBar,
      numberMeaning,
      analyze
    };
  }

  return {
    create, DEFAULT_CONFIG, VARIANTS,
    DAY_SIGNS_YUKATEK, DAY_SIGNS_KICHE, HAAB_MONTHS,
    LONG_COUNT_PERIODS, NUMBER_MEANINGS
  };
})();

if (typeof module !== 'undefined') module.exports = Mayan;
