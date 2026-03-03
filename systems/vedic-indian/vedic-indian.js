/**
 * Liber Numerus — Vedic / Indian Numerology
 * Psychic, Destiny, Name Numbers; Katapayadi; Navagraha planetary system
 */
const ReductionUtils = (typeof require !== 'undefined') ? require('../../shared/reduction-utils') : window.ReductionUtils;

const VedicIndian = (() => {
  // Vedic letter mapping (similar to Chaldean — shared genealogy)
  const LETTER_MAP = {
    A:1, B:2, C:3, D:4, E:5, F:8, G:3, H:5, I:1,
    J:1, K:2, L:3, M:4, N:5, O:7, P:8, Q:1, R:2,
    S:3, T:4, U:6, V:6, W:6, X:5, Y:1, Z:7
  };

  // Navagraha — planetary attribution (identical to Chaldean 1-9 scheme)
  const PLANETS = {
    1: { sanskrit: 'Surya',      english: 'Sun',        gemstone: 'Ruby',            color: 'Orange', element: 'Fire' },
    2: { sanskrit: 'Chandra',    english: 'Moon',       gemstone: 'Pearl',           color: 'White', element: 'Water' },
    3: { sanskrit: 'Brihaspati', english: 'Jupiter',    gemstone: 'Yellow Sapphire', color: 'Yellow', element: 'Ether' },
    4: { sanskrit: 'Rahu',       english: 'North Node', gemstone: 'Hessonite',       color: 'Smoky', element: 'Air' },
    5: { sanskrit: 'Budha',      english: 'Mercury',    gemstone: 'Emerald',         color: 'Green', element: 'Earth' },
    6: { sanskrit: 'Shukra',     english: 'Venus',      gemstone: 'Diamond',         color: 'Indigo', element: 'Water' },
    7: { sanskrit: 'Ketu',       english: 'South Node', gemstone: "Cat's Eye",       color: 'Gray', element: 'Fire' },
    8: { sanskrit: 'Shani',      english: 'Saturn',     gemstone: 'Blue Sapphire',   color: 'Blue', element: 'Air' },
    9: { sanskrit: 'Mangala',    english: 'Mars',       gemstone: 'Red Coral',       color: 'Red', element: 'Fire' }
  };

  // Compound number meanings (shared genealogy with Chaldean)
  const COMPOUND_MEANINGS = {
    10: { name: 'Wheel of Fortune', description: 'Rise and fall, the eternal cycle of karma.' },
    11: { name: 'Hidden Dangers', description: 'Trials and tests, hidden influences.' },
    12: { name: 'The Sacrifice', description: 'Sacrifice for others, anxiety and suffering.' },
    13: { name: 'The Great Transformer', description: 'Transformation, death and rebirth of the self.' },
    14: { name: 'Movement', description: 'Magnetic communication, change and flux.' },
    15: { name: 'The Magician', description: 'Eloquence and magic. Can serve light or darkness.' },
    16: { name: 'The Shattered Citadel', description: 'Sudden downfall through ego. Humility brings renewal.' },
    17: { name: 'The Star of the Magi', description: 'Spiritual illumination, hope, and immortality.' },
    18: { name: 'Spiritual-Material Conflict', description: 'Inner conflict, deception from trusted ones.' },
    19: { name: 'The Prince of Heaven', description: 'Success, honor, and happiness through effort.' },
    20: { name: 'The Awakening', description: 'New purpose and resurrection of ambitions.' },
    21: { name: 'The Crown of the Magi', description: 'Supreme success and advancement.' },
    22: { name: 'Submission', description: 'Warning against living in illusion.' },
    23: { name: 'The Royal Star', description: 'Promise of success and divine protection.' },
    24: { name: 'Love and Money', description: 'Favorable for partnerships and love.' },
    25: { name: 'Strength Through Trial', description: 'Wisdom gained through experience.' },
    26: { name: 'Partnerships', description: 'Warnings about associations and partnerships.' },
    27: { name: 'The Scepter', description: 'Authority, power, and command.' },
    28: { name: 'The Trusting Lamb', description: 'Promise then loss through misplaced trust.' },
    29: { name: 'Grace Under Pressure', description: 'Uncertainties and inner strength.' },
    30: { name: 'The Lure of the Spotlight', description: 'Thoughtful deduction and introspection.' },
    31: { name: 'The Recluse', description: 'Self-contained isolation.' },
    32: { name: 'Communication', description: 'Magical power of communication.' },
    33: { name: 'The Fortunate', description: 'Very fortunate in all endeavors.' },
    34: { name: 'The Warrior', description: 'Strength through struggle.' },
    35: { name: 'The Peacemaker', description: 'Diplomacy and partnership warnings.' },
    36: { name: 'The Explorer', description: 'Adventurous spirit and opportunities.' },
    37: { name: 'Divine Protection', description: 'Strong protection in partnerships.' },
    38: { name: 'Misfortune', description: 'Treachery and difficulties.' },
    39: { name: 'The Communicator', description: 'Power of expression.' },
    40: { name: 'The Organizer', description: 'Organizing ability.' },
    41: { name: 'The Achiever', description: 'Power of words and ideas.' },
    42: { name: 'The Craftsperson', description: 'Skills and beauty.' },
    43: { name: 'Revolution', description: 'Upheaval and failure.' },
    44: { name: 'The Architect', description: 'Material success with warnings.' },
    45: { name: 'The Strategist', description: 'Strategic mind and authority.' },
    46: { name: 'The Victor', description: 'Triumph through alliances.' },
    47: { name: 'The Counselor', description: 'Wisdom through challenges.' },
    48: { name: 'The Judge', description: 'Fairness and intellectual power.' },
    49: { name: 'The Transformer', description: 'Deep change and reflection.' },
    50: { name: 'The Orator', description: 'Powerful communication.' },
    51: { name: 'The Warrior King', description: 'Very favorable, powerful.' },
    52: { name: 'The Seer', description: 'Intuition and insight.' }
  };

  // Katapayadi encoding table
  // ka=1, kha=2, ga=3, gha=4, ṅa=5, ca=6, cha=7, ja=8, jha=9, ña=0
  // ṭa=1, ṭha=2, ḍa=3, ḍha=4, ṇa=5, ta=6, tha=7, da=8, dha=9, na=0
  // pa=1, pha=2, ba=3, bha=4, ma=5
  // ya=1, ra=2, la=3, va=4, śa=5, ṣa=6, sa=7, ha=8
  // Vowels and anusvara/visarga are ignored
  const KATAPAYADI_MAP = {
    'k':1, 'kh':2, 'g':3, 'gh':4, 'ṅ':5, 'c':6, 'ch':7, 'j':8, 'jh':9, 'ñ':0,
    'ṭ':1, 'ṭh':2, 'ḍ':3, 'ḍh':4, 'ṇ':5, 't':6, 'th':7, 'd':8, 'dh':9, 'n':0,
    'p':1, 'ph':2, 'b':3, 'bh':4, 'm':5,
    'y':1, 'r':2, 'l':3, 'v':4, 'ś':5, 'ṣ':6, 's':7, 'h':8
  };

  // Compatibility table: 1=friendly, 0=neutral, -1=hostile
  const COMPATIBILITY = {
    '1_1':1,'1_2':0,'1_3':1,'1_4':-1,'1_5':0,'1_6':1,'1_7':-1,'1_8':-1,'1_9':1,
    '2_2':1,'2_3':0,'2_4':1,'2_5':1,'2_6':0,'2_7':1,'2_8':-1,'2_9':0,
    '3_3':1,'3_4':0,'3_5':0,'3_6':1,'3_7':0,'3_8':0,'3_9':1,
    '4_4':1,'4_5':-1,'4_6':1,'4_7':1,'4_8':0,'4_9':-1,
    '5_5':1,'5_6':0,'5_7':0,'5_8':1,'5_9':0,
    '6_6':1,'6_7':0,'6_8':1,'6_9':0,
    '7_7':1,'7_8':0,'7_9':-1,
    '8_8':1,'8_9':0,
    '9_9':1
  };

  // Yuga cycle reference numbers
  const YUGA_CYCLES = {
    kaliYuga:   { years: 432000,   description: 'Age of darkness, current age' },
    dvaparaYuga:{ years: 864000,   description: 'Age of duality' },
    tretaYuga:  { years: 1296000,  description: 'Age of ritual' },
    satyaYuga:  { years: 1728000,  description: 'Golden age, age of truth' },
    mahayuga:   { years: 4320000,  description: 'Complete cycle of four yugas' },
    manvantara: { years: 306720000, description: '71 mahayugas' },
    kalpa:      { years: 4320000000, description: 'Day of Brahma, 1000 mahayugas' }
  };

  const DEFAULT_CONFIG = {
    system: 'modern',
    letterMapping: 'vedic',
    planetaryNames: 'both'
  };

  const VARIANTS = {
    modern:     { system: 'modern',     letterMapping: 'vedic',     planetaryNames: 'both' },
    katapayadi: { system: 'katapayadi', letterMapping: 'vedic',     planetaryNames: 'sanskrit' },
    jyotish:    { system: 'modern',     letterMapping: 'vedic',     planetaryNames: 'sanskrit' }
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

    function psychicNumber(dayOfBirth) {
      return reduce(dayOfBirth);
    }

    function destinyNumber(date) {
      const { day, month, year } = date;
      const sum = ReductionUtils.digitSum(day) + ReductionUtils.digitSum(month) + ReductionUtils.digitSum(year);
      return reduce(sum);
    }

    function nameNumber(name) {
      const total = wordValue(name);
      return { total: total, reduced: reduce(total), compound: total >= 10 ? total : null };
    }

    function planet(n) {
      const p = PLANETS[n];
      if (!p) return null;
      if (cfg.planetaryNames === 'sanskrit') {
        return { sanskrit: p.sanskrit, gemstone: p.gemstone, color: p.color, element: p.element };
      }
      if (cfg.planetaryNames === 'english') {
        return { english: p.english, gemstone: p.gemstone, color: p.color, element: p.element };
      }
      return { ...p };
    }

    function compoundMeaning(n) {
      return COMPOUND_MEANINGS[n] || null;
    }

    function katapayadi(text) {
      // Simplified Katapayadi for romanized Sanskrit
      const consonants = text.toLowerCase().replace(/[aeiouāīūṛḷ\s]/g, '');
      const digits = [];
      let i = 0;
      while (i < consonants.length) {
        // Try two-character consonant first
        if (i + 1 < consonants.length) {
          const two = consonants[i] + consonants[i + 1];
          if (KATAPAYADI_MAP[two] !== undefined) {
            digits.push(KATAPAYADI_MAP[two]);
            i += 2;
            continue;
          }
        }
        const one = consonants[i];
        if (KATAPAYADI_MAP[one] !== undefined) {
          digits.push(KATAPAYADI_MAP[one]);
        }
        i++;
      }
      // Read reversed to get the number
      const reversed = digits.slice().reverse();
      const number = parseInt(reversed.join(''), 10) || 0;
      return { digits: digits, reversed: reversed, number: number };
    }

    function gemstone(n) {
      const p = PLANETS[n];
      return p ? p.gemstone : null;
    }

    function compatible(a, b) {
      const key1 = Math.min(a, b) + '_' + Math.max(a, b);
      const value = COMPATIBILITY[key1];
      const labels = { 1: 'friendly', 0: 'neutral', '-1': 'hostile' };
      return {
        numbers: [a, b],
        planets: [PLANETS[a], PLANETS[b]],
        compatibility: value !== undefined ? value : 0,
        label: labels[value] || 'neutral'
      };
    }

    function yugaCycle(name) {
      return YUGA_CYCLES[name] || null;
    }

    function numberMeaning(n) {
      if (n >= 1 && n <= 9) {
        return { digit: n, planet: planet(n) };
      }
      return compoundMeaning(n);
    }

    function analyze(input) {
      if (typeof input === 'object' && input.day) {
        return {
          psychic: psychicNumber(input.day),
          destiny: destinyNumber(input),
          psychicPlanet: planet(psychicNumber(input.day)),
          destinyPlanet: planet(destinyNumber(input))
        };
      }
      if (typeof input === 'string') {
        const nn = nameNumber(input);
        return { nameNumber: nn, planet: planet(nn.reduced) };
      }
      if (typeof input === 'number') {
        return { reduced: reduce(input), planet: planet(reduce(input)), meaning: numberMeaning(input) };
      }
      return null;
    }

    return {
      letterValue, wordValue, reduce,
      psychicNumber, destinyNumber, nameNumber,
      planet, compoundMeaning, katapayadi,
      gemstone, compatible, yugaCycle,
      numberMeaning, analyze
    };
  }

  return { create, DEFAULT_CONFIG, VARIANTS, LETTER_MAP, PLANETS, COMPOUND_MEANINGS, YUGA_CYCLES };
})();

if (typeof module !== 'undefined') module.exports = VedicIndian;
