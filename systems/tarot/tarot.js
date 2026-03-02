/**
 * Libernumerus — Tarot Numerology
 * Birth Cards, Hebrew letter correspondences, Major/Minor Arcana,
 * tradition-specific variations
 */
const ReductionUtils = (typeof require !== 'undefined') ? require('../../shared/reduction-utils') : window.ReductionUtils;

const Tarot = (() => {
  // Major Arcana — Waite tradition (default)
  const MAJOR_ARCANA_WAITE = [
    { number: 0,  name: 'The Fool',            hebrewGD: '\u05D0', astro: 'Air' },
    { number: 1,  name: 'The Magician',         hebrewGD: '\u05D1', astro: 'Mercury' },
    { number: 2,  name: 'The High Priestess',   hebrewGD: '\u05D2', astro: 'Moon' },
    { number: 3,  name: 'The Empress',          hebrewGD: '\u05D3', astro: 'Venus' },
    { number: 4,  name: 'The Emperor',          hebrewGD: '\u05E6', astro: 'Aries' },
    { number: 5,  name: 'The Hierophant',       hebrewGD: '\u05D5', astro: 'Taurus' },
    { number: 6,  name: 'The Lovers',           hebrewGD: '\u05D6', astro: 'Gemini' },
    { number: 7,  name: 'The Chariot',          hebrewGD: '\u05D7', astro: 'Cancer' },
    { number: 8,  name: 'Strength',             hebrewGD: '\u05D8', astro: 'Leo' },
    { number: 9,  name: 'The Hermit',           hebrewGD: '\u05D9', astro: 'Virgo' },
    { number: 10, name: 'Wheel of Fortune',     hebrewGD: '\u05DB', astro: 'Jupiter' },
    { number: 11, name: 'Justice',              hebrewGD: '\u05DC', astro: 'Libra' },
    { number: 12, name: 'The Hanged Man',       hebrewGD: '\u05DE', astro: 'Water' },
    { number: 13, name: 'Death',                hebrewGD: '\u05E0', astro: 'Scorpio' },
    { number: 14, name: 'Temperance',           hebrewGD: '\u05E1', astro: 'Sagittarius' },
    { number: 15, name: 'The Devil',            hebrewGD: '\u05E2', astro: 'Capricorn' },
    { number: 16, name: 'The Tower',            hebrewGD: '\u05E4', astro: 'Mars' },
    { number: 17, name: 'The Star',             hebrewGD: '\u05D4', astro: 'Aquarius' },
    { number: 18, name: 'The Moon',             hebrewGD: '\u05E7', astro: 'Pisces' },
    { number: 19, name: 'The Sun',              hebrewGD: '\u05E8', astro: 'Sun' },
    { number: 20, name: 'Judgement',            hebrewGD: '\u05E9', astro: 'Fire' },
    { number: 21, name: 'The World',            hebrewGD: '\u05EA', astro: 'Saturn' }
  ];

  const MAJOR_ARCANA_CROWLEY = [
    { number: 0,  name: 'The Fool',        hebrewGD: '\u05D0', astro: 'Air' },
    { number: 1,  name: 'The Magus',       hebrewGD: '\u05D1', astro: 'Mercury' },
    { number: 2,  name: 'The Priestess',   hebrewGD: '\u05D2', astro: 'Moon' },
    { number: 3,  name: 'The Empress',     hebrewGD: '\u05D3', astro: 'Venus' },
    { number: 4,  name: 'The Emperor',     hebrewGD: '\u05E6', astro: 'Aries' },
    { number: 5,  name: 'The Hierophant',  hebrewGD: '\u05D5', astro: 'Taurus' },
    { number: 6,  name: 'The Lovers',      hebrewGD: '\u05D6', astro: 'Gemini' },
    { number: 7,  name: 'The Chariot',     hebrewGD: '\u05D7', astro: 'Cancer' },
    { number: 8,  name: 'Adjustment',      hebrewGD: '\u05DC', astro: 'Libra' },
    { number: 9,  name: 'The Hermit',      hebrewGD: '\u05D9', astro: 'Virgo' },
    { number: 10, name: 'Fortune',         hebrewGD: '\u05DB', astro: 'Jupiter' },
    { number: 11, name: 'Lust',            hebrewGD: '\u05D8', astro: 'Leo' },
    { number: 12, name: 'The Hanged Man',  hebrewGD: '\u05DE', astro: 'Water' },
    { number: 13, name: 'Death',           hebrewGD: '\u05E0', astro: 'Scorpio' },
    { number: 14, name: 'Art',             hebrewGD: '\u05E1', astro: 'Sagittarius' },
    { number: 15, name: 'The Devil',       hebrewGD: '\u05E2', astro: 'Capricorn' },
    { number: 16, name: 'The Tower',       hebrewGD: '\u05E4', astro: 'Mars' },
    { number: 17, name: 'The Star',        hebrewGD: '\u05D4', astro: 'Aquarius' },
    { number: 18, name: 'The Moon',        hebrewGD: '\u05E7', astro: 'Pisces' },
    { number: 19, name: 'The Sun',         hebrewGD: '\u05E8', astro: 'Sun' },
    { number: 20, name: 'The Aeon',        hebrewGD: '\u05E9', astro: 'Fire' },
    { number: 21, name: 'The Universe',    hebrewGD: '\u05EA', astro: 'Saturn' }
  ];

  const MAJOR_ARCANA_MARSEILLE = [
    { number: null, name: 'Le Mat (The Fool)',    hebrewLevi: '\u05E9', astro: null },
    { number: 1,  name: 'Le Bateleur',            hebrewLevi: '\u05D0', astro: null },
    { number: 2,  name: 'La Papesse',             hebrewLevi: '\u05D1', astro: null },
    { number: 3,  name: "L'Impératrice",          hebrewLevi: '\u05D2', astro: null },
    { number: 4,  name: "L'Empereur",             hebrewLevi: '\u05D3', astro: null },
    { number: 5,  name: 'Le Pape',                hebrewLevi: '\u05D4', astro: null },
    { number: 6,  name: "L'Amoureux",             hebrewLevi: '\u05D5', astro: null },
    { number: 7,  name: 'Le Chariot',             hebrewLevi: '\u05D6', astro: null },
    { number: 8,  name: 'La Justice',             hebrewLevi: '\u05D7', astro: null },
    { number: 9,  name: "L'Hermite",              hebrewLevi: '\u05D8', astro: null },
    { number: 10, name: 'La Roue de Fortune',     hebrewLevi: '\u05D9', astro: null },
    { number: 11, name: 'La Force',               hebrewLevi: '\u05DB', astro: null },
    { number: 12, name: 'Le Pendu',               hebrewLevi: '\u05DC', astro: null },
    { number: 13, name: 'La Mort',                hebrewLevi: '\u05DE', astro: null },
    { number: 14, name: 'Tempérance',             hebrewLevi: '\u05E0', astro: null },
    { number: 15, name: 'Le Diable',              hebrewLevi: '\u05E1', astro: null },
    { number: 16, name: 'La Maison Dieu',         hebrewLevi: '\u05E2', astro: null },
    { number: 17, name: "L'Étoile",               hebrewLevi: '\u05E4', astro: null },
    { number: 18, name: 'La Lune',                hebrewLevi: '\u05E6', astro: null },
    { number: 19, name: 'Le Soleil',              hebrewLevi: '\u05E7', astro: null },
    { number: 20, name: 'Le Jugement',            hebrewLevi: '\u05E8', astro: null },
    { number: 21, name: 'Le Monde',               hebrewLevi: '\u05EA', astro: null }
  ];

  // Suits for Minor Arcana
  const SUITS = {
    wands:    { element: 'Fire',  sephirotic: true },
    cups:     { element: 'Water', sephirotic: true },
    swords:   { element: 'Air',   sephirotic: true },
    pentacles:{ element: 'Earth', sephirotic: true }
  };

  // Sephirotic pip mapping (Golden Dawn system)
  const SEPHIROTIC_PIPS = {
    1:  'Keter',
    2:  'Chokmah',
    3:  'Binah',
    4:  'Chesed',
    5:  'Gevurah',
    6:  'Tiferet',
    7:  'Netzach',
    8:  'Hod',
    9:  'Yesod',
    10: 'Malkut'
  };

  // Pip meanings
  const PIP_MEANINGS = {
    1:  'Beginning, seed, potential',
    2:  'Balance, partnership, duality',
    3:  'Growth, creativity, expression',
    4:  'Stability, structure, foundation',
    5:  'Conflict, change, instability',
    6:  'Harmony, beauty, resolution',
    7:  'Assessment, challenge, perseverance',
    8:  'Movement, speed, power',
    9:  'Culmination, attainment, near completion',
    10: 'Completion, fulfillment, ending/new beginning'
  };

  const DEFAULT_CONFIG = {
    tradition: 'waite',
    hebrewMapping: 'goldenDawn',
    justiceStrengthSwap: true,    // Waite: 8=Strength, 11=Justice
    foolPlacement: 'beginning',
    reversals: true,
    sephiroticPips: false
  };

  const VARIANTS = {
    marseille: {
      tradition: 'marseille', hebrewMapping: 'levi',
      justiceStrengthSwap: false, foolPlacement: 'unnumbered',
      reversals: false, sephiroticPips: false
    },
    waite: {
      tradition: 'waite', hebrewMapping: 'goldenDawn',
      justiceStrengthSwap: true, foolPlacement: 'beginning',
      reversals: true, sephiroticPips: false
    },
    crowley: {
      tradition: 'crowley', hebrewMapping: 'crowley',
      justiceStrengthSwap: false, foolPlacement: 'beginning',
      reversals: false, sephiroticPips: true
    },
    goldenDawn: {
      tradition: 'goldenDawn', hebrewMapping: 'goldenDawn',
      justiceStrengthSwap: false, foolPlacement: 'beginning',
      reversals: false, sephiroticPips: true
    }
  };

  function create(config) {
    if (typeof config === 'string' && VARIANTS[config]) {
      config = { ...VARIANTS[config] };
    }
    const cfg = { ...DEFAULT_CONFIG, ...(config || {}) };

    function getMajorArcana() {
      switch (cfg.tradition) {
        case 'crowley': return MAJOR_ARCANA_CROWLEY;
        case 'marseille': return MAJOR_ARCANA_MARSEILLE;
        default: return MAJOR_ARCANA_WAITE;
      }
    }

    function getCard(n) {
      const arcana = getMajorArcana();
      return arcana.find(c => c.number === n) || null;
    }

    function birthCard(date) {
      const { month, day, year } = date;
      // Sum all digits
      const str = String(month) + String(day) + String(year);
      let sum = 0;
      for (const ch of str) {
        sum += parseInt(ch, 10);
      }

      // Reduction chain for birth card
      const chain = [];
      let current = sum;
      while (current > 22) {
        chain.push(current);
        current = ReductionUtils.digitSum(current);
      }
      // If we got 22, we keep it (The World/Universe)
      // If > 22 after first reduction, keep reducing
      chain.push(current);

      // The primary birth card is the final number
      const primaryCard = getCard(current);

      // Build the full triad chain
      const cards = chain.map(n => {
        if (n <= 22) return getCard(n);
        return { number: n, name: 'Intermediate sum' };
      }).filter(c => c !== null);

      return {
        value: current,
        card: primaryCard,
        reductionChain: chain,
        linkedCards: cards
      };
    }

    function reductionChain(n) {
      const chain = [n];
      let current = n;
      while (current > 9) {
        current = ReductionUtils.digitSum(current);
        chain.push(current);
      }
      return chain.map(v => {
        const card = getCard(v);
        return card ? { number: v, name: card.name } : { number: v, name: null };
      });
    }

    function yearCard(year) {
      let sum = 0;
      for (const ch of String(year)) {
        sum += parseInt(ch, 10);
      }
      while (sum > 22) {
        sum = ReductionUtils.digitSum(sum);
      }
      return { value: sum, card: getCard(sum) };
    }

    function dailyCard(date) {
      const { month, day, year } = date;
      const str = String(month) + String(day) + String(year);
      let sum = 0;
      for (const ch of str) sum += parseInt(ch, 10);
      while (sum > 22) sum = ReductionUtils.digitSum(sum);
      return { value: sum, card: getCard(sum) };
    }

    function pipMeaning(number, suit) {
      const result = {
        number: number,
        suit: suit,
        element: SUITS[suit] ? SUITS[suit].element : null,
        meaning: PIP_MEANINGS[number] || null
      };
      if (cfg.sephiroticPips && SEPHIROTIC_PIPS[number]) {
        result.sefirah = SEPHIROTIC_PIPS[number];
      }
      return result;
    }

    function hebrewLetter(cardNumber) {
      const card = getCard(cardNumber);
      if (!card) return null;
      if (cfg.tradition === 'marseille') return card.hebrewLevi || null;
      return card.hebrewGD || null;
    }

    function numberMeaning(n) {
      const card = getCard(n);
      if (card) return card;
      if (PIP_MEANINGS[n]) return { number: n, meaning: PIP_MEANINGS[n] };
      return null;
    }

    function analyze(input) {
      if (typeof input === 'object' && input.month && input.day && input.year) {
        return {
          birthCard: birthCard(input),
          yearCard: yearCard(input.year)
        };
      }
      if (typeof input === 'number') {
        return { card: getCard(input), meaning: numberMeaning(input) };
      }
      return null;
    }

    return {
      getCard,
      birthCard,
      reductionChain,
      yearCard,
      dailyCard,
      pipMeaning,
      hebrewLetter,
      numberMeaning,
      analyze,
      getMajorArcana
    };
  }

  return { create, DEFAULT_CONFIG, VARIANTS, SUITS, PIP_MEANINGS, SEPHIROTIC_PIPS };
})();

if (typeof module !== 'undefined') module.exports = Tarot;
