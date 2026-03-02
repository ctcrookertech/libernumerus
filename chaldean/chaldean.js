/**
 * Libernumerus — Chaldean Numerology
 * Non-sequential letter mapping, compound numbers 10-52, planetary attributions
 */
const ReductionUtils = (typeof require !== 'undefined') ? require('../shared/reduction-utils') : window.ReductionUtils;

const Chaldean = (() => {
  // Chaldean letter mapping — 9 is NEVER assigned to any letter
  const LETTER_MAP = {
    A:1, B:2, C:3, D:4, E:5, F:8, G:3, H:5, I:1,
    J:1, K:2, L:3, M:4, N:5, O:7, P:8, Q:1, R:2,
    S:3, T:4, U:6, V:6, W:6, X:5, Y:1, Z:7
  };

  // Planetary attributions per single digit
  const PLANETS_RAHU_KETU = {
    1: { name: 'Sun', sanskrit: 'Surya' },
    2: { name: 'Moon', sanskrit: 'Chandra' },
    3: { name: 'Jupiter', sanskrit: 'Brihaspati' },
    4: { name: 'Rahu', sanskrit: 'Rahu', description: 'North Node of the Moon' },
    5: { name: 'Mercury', sanskrit: 'Budha' },
    6: { name: 'Venus', sanskrit: 'Shukra' },
    7: { name: 'Ketu', sanskrit: 'Ketu', description: 'South Node of the Moon' },
    8: { name: 'Saturn', sanskrit: 'Shani' },
    9: { name: 'Mars', sanskrit: 'Mangala' }
  };

  const PLANETS_URANUS_NEPTUNE = {
    1: { name: 'Sun', sanskrit: 'Surya' },
    2: { name: 'Moon', sanskrit: 'Chandra' },
    3: { name: 'Jupiter', sanskrit: 'Brihaspati' },
    4: { name: 'Uranus', sanskrit: 'Uranus' },
    5: { name: 'Mercury', sanskrit: 'Budha' },
    6: { name: 'Venus', sanskrit: 'Shukra' },
    7: { name: 'Neptune', sanskrit: 'Neptune' },
    8: { name: 'Saturn', sanskrit: 'Shani' },
    9: { name: 'Mars', sanskrit: 'Mangala' }
  };

  // Compound number meanings (10-52) — Cheiro's system
  const COMPOUND_MEANINGS = {
    10: { name: 'Wheel of Fortune', description: 'Rise and fall, honor and success followed by reversal. The eternal cycle.' },
    11: { name: 'Hidden Dangers', description: 'Hidden dangers, treachery from others. A number of trials and tests.' },
    12: { name: 'The Sacrifice', description: 'Suffering, anxiety. The sacrifice for others\' benefit.' },
    13: { name: 'The Great Transformer', description: 'Change, transformation, upheaval. Death of the old, birth of the new.' },
    14: { name: 'Movement', description: 'Movement, combination of people and things. Magnetic communication.' },
    15: { name: 'The Magician', description: 'Eloquence, gifts of speech. Magic and mystery. Can be used for good or ill.' },
    16: { name: 'The Shattered Citadel', description: 'Downfall through overconfidence. Plans destroyed suddenly. Rise again after humility.' },
    17: { name: 'The Star of the Magi', description: 'Highly spiritual. The star of hope and immortality. Peace after storms.' },
    18: { name: 'Spiritual-Material Conflict', description: 'Bitter quarrels within close relationships. Deception and treachery from those trusted.' },
    19: { name: 'The Prince of Heaven', description: 'Favorable and fortunate. Success, esteem, honor, happiness.' },
    20: { name: 'The Awakening', description: 'New purpose, plans, ambitions. Call to action. Resurrection and judgment.' },
    21: { name: 'The Crown of the Magi', description: 'Advancement, honors, elevation. Success in all things. The "world" card.' },
    22: { name: 'Submission', description: 'A warning number. Living in a fool\'s paradise. Good judgment needed.' },
    23: { name: 'The Royal Star of the Lion', description: 'Promise of success, help from superiors. Protection and favor.' },
    24: { name: 'Love and Money', description: 'Favorable for love, partnerships. Gaining through others\' association.' },
    25: { name: 'Strength Through Trial', description: 'Strength gained through experience. Observations and deductions.' },
    26: { name: 'Partnerships', description: 'Gravest warnings for the future. Partnerships and associates may bring ruin.' },
    27: { name: 'The Scepter', description: 'Authority, power, command. Rewarded in positions of trust.' },
    28: { name: 'The Trusting Lamb', description: 'Great promise in beginning, loss through trust in others. Must guard against the law.' },
    29: { name: 'Grace Under Pressure', description: 'Uncertainties, treachery. Difficulties from the opposite sex.' },
    30: { name: 'The Lure of the Spotlight', description: 'Thoughtful deduction, retrospection. Can be lonely if too self-contained.' },
    31: { name: 'The Recluse', description: 'Self-contained, lonely, isolated from others. Not a fortunate number for partnerships.' },
    32: { name: 'Communication', description: 'Magical power of communication. Ability to influence masses.' },
    33: { name: 'The Fortunate', description: 'Same as 24 but more powerful. Very fortunate in all endeavors.' },
    34: { name: 'The Warrior', description: 'Same as 25. Strength through struggle and overcoming.' },
    35: { name: 'The Peacemaker', description: 'Same as 26. Warning of partnerships but skill in diplomacy.' },
    36: { name: 'The Explorer', description: 'Same as 27. Great opportunities through adventurous spirit.' },
    37: { name: 'Divine Protection', description: 'Very good number for partnerships, friendships, love. Strong and fortunate.' },
    38: { name: 'Misfortune', description: 'Same as 29. Treachery and difficulties amplified.' },
    39: { name: 'The Communicator', description: 'Same as 30. Power of expression and retrospection.' },
    40: { name: 'The Organizer', description: 'Same as 31. Organizing ability but loneliness.' },
    41: { name: 'The Achiever', description: 'Same as 32. Power of words and ideas.' },
    42: { name: 'The Craftsperson', description: 'Same as 24. Skills and love of beauty.' },
    43: { name: 'Revolution', description: 'Unfortunate. Association with failure, revolution, and upheaval.' },
    44: { name: 'The Architect', description: 'Same as 26. Material success but with warnings.' },
    45: { name: 'The Strategist', description: 'Same as 27. Strategic mind, authority.' },
    46: { name: 'The Victor', description: 'Same as 37. Triumph through good alliances.' },
    47: { name: 'The Counselor', description: 'Same as 29. Wisdom gained through challenges.' },
    48: { name: 'The Judge', description: 'Same as 30. Fairness, intellectual power.' },
    49: { name: 'The Transformer', description: 'Same as 31. Deep change and solitary reflection.' },
    50: { name: 'The Orator', description: 'Same as 32. Powerful communication abilities.' },
    51: { name: 'The Warrior King', description: 'Powerful, ambitious. Same as 33. Very favorable.' },
    52: { name: 'The Seer', description: 'Same as 25. Intuition and insight through experience.' }
  };

  const DEFAULT_CONFIG = {
    planetaryScheme: 'rahuKetu',
    nameSource: 'common',
    compoundRange: [10, 52]
  };

  const VARIANTS = {
    cheiro: { planetaryScheme: 'rahuKetu', nameSource: 'common', compoundRange: [10, 52] },
    modernWestern: { planetaryScheme: 'uranusNeptune', nameSource: 'legal', compoundRange: [10, 78] }
  };

  function create(config) {
    if (typeof config === 'string' && VARIANTS[config]) {
      config = { ...VARIANTS[config] };
    }
    const cfg = { ...DEFAULT_CONFIG, ...(config || {}) };

    function letterValue(ch) {
      return LETTER_MAP[ch.toUpperCase()] || 0;
    }

    function wordValue(str) {
      let sum = 0;
      for (const ch of str.toUpperCase()) {
        if (LETTER_MAP[ch]) sum += LETTER_MAP[ch];
      }
      return sum;
    }

    function reduce(n) {
      return ReductionUtils.reduce(n, []);
    }

    function nameVibration(name) {
      const compound = wordValue(name);
      const reduced = reduce(compound);
      return {
        compound: compound,
        reduced: reduced,
        compoundMeaning: compoundMeaning(compound),
        planet: planetFor(reduced)
      };
    }

    function birthNumber(day) {
      if (day >= 1 && day <= 9) {
        return { single: day, compound: null, compoundMeaning: null, planet: planetFor(day) };
      }
      const reduced = reduce(day);
      return {
        single: reduced,
        compound: day,
        compoundMeaning: compoundMeaning(day),
        planet: planetFor(reduced)
      };
    }

    function compoundMeaning(n) {
      if (n < cfg.compoundRange[0] || n > cfg.compoundRange[1]) return null;
      return COMPOUND_MEANINGS[n] || null;
    }

    function planetFor(n) {
      const scheme = cfg.planetaryScheme === 'uranusNeptune' ? PLANETS_URANUS_NEPTUNE : PLANETS_RAHU_KETU;
      return scheme[n] || null;
    }

    function numberMeaning(n) {
      if (n >= 1 && n <= 9) {
        return { digit: n, planet: planetFor(n) };
      }
      return compoundMeaning(n);
    }

    function analyze(input) {
      if (typeof input === 'string') {
        return nameVibration(input);
      }
      if (typeof input === 'number') {
        if (input >= 1 && input <= 31) {
          return birthNumber(input);
        }
        return { compound: input, reduced: reduce(input), meaning: compoundMeaning(input) };
      }
      return null;
    }

    return {
      letterValue,
      wordValue,
      reduce,
      nameVibration,
      birthNumber,
      compoundMeaning,
      planetFor,
      numberMeaning,
      analyze
    };
  }

  return { create, DEFAULT_CONFIG, VARIANTS, LETTER_MAP, COMPOUND_MEANINGS };
})();

if (typeof module !== 'undefined') module.exports = Chaldean;
