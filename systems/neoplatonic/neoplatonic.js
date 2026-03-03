/**
 * Liber Numerus — Neoplatonic Numerology
 * Decad reduction, mathematical property analysis, Tetractys, ratio analysis
 */
const ReductionUtils = (typeof require !== 'undefined') ? require('../../shared/reduction-utils') : window.ReductionUtils;

const Neoplatonic = (() => {
  // The Decad — meanings of 1-10
  const DECAD = {
    1:  { name: 'The Monad', keywords: ['unity','source','the One'], description: 'The source of all numbers, the principle of unity. Neither odd nor even. The seed of all being. Plotinus: The One beyond being.' },
    2:  { name: 'The Dyad', keywords: ['duality','otherness','matter'], description: 'The principle of division and otherness. The Indefinite Dyad — matter, multiplicity, the feminine. First even number.' },
    3:  { name: 'The Triad', keywords: ['harmony','completion','mean'], description: 'The first true odd number. Beginning, middle, end. The arithmetic mean. The principle of harmony resolving the tension of the Dyad.' },
    4:  { name: 'The Tetrad', keywords: ['stability','justice','square'], description: 'The first square number. Four elements, four seasons, four directions. Justice and stability. The foundation of the Tetractys.' },
    5:  { name: 'The Pentad', keywords: ['marriage','life','mediation'], description: 'The "nuptial number" — union of the first masculine (3) and feminine (2). Life, health, and the quintessence. The mean of the Decad.' },
    6:  { name: 'The Hexad', keywords: ['perfection','harmony','creation'], description: 'The first perfect number (1+2+3=6). Harmony and creation. The number of Aphrodite. The "area" of the 3-4-5 triangle.' },
    7:  { name: 'The Heptad', keywords: ['virginity','wisdom','kairos'], description: 'Neither generates nor is generated within the Decad. The "virgin" number. Athena. The critical moment (kairos). Seven planets, seven notes.' },
    8:  { name: 'The Ogdoad', keywords: ['solidity','cube','first cube'], description: 'The first cube (2³). Solidity, stability in three dimensions. The octave in music (2:1 ratio). Cosmic harmony.' },
    9:  { name: 'The Ennead', keywords: ['completion','horizon','boundary'], description: 'The "horizon" — last single digit, boundary of the Monad series. 3² — perfection of perfection. The Muses.' },
    10: { name: 'The Decad', keywords: ['perfection','totality','return'], description: 'The Tetractys: 1+2+3+4=10. Return to unity at a higher level. Contains all numbers within itself. Perfection and completeness.' }
  };

  // Deity associations
  const DEITY_ASSOCIATIONS = {
    1: 'Apollo/Helios (the Sun, the One)',
    2: 'Artemis/Selene (the Moon, duality)',
    3: 'Hecate (triple goddess, crossroads)',
    4: 'Heracles (four labors, stability)',
    5: 'Hermes (mediation between worlds)',
    6: 'Aphrodite (harmony, love, perfection)',
    7: 'Athena (virgin wisdom, unconquerable)',
    8: 'Poseidon (cosmic order, ocean depths)',
    9: 'Hephaestus (craft, the horizon of creation)',
    10: 'Atlas/Pan (bearing all, containing all)'
  };

  // Musical/cosmological ratios
  const SIGNIFICANT_RATIOS = {
    '2:1': { name: 'Octave (diapason)', description: 'The most consonant interval. Unity reflected at a higher level.' },
    '3:2': { name: 'Perfect fifth (diapente)', description: 'The second most consonant interval. Harmony of the spheres.' },
    '4:3': { name: 'Perfect fourth (diatessaron)', description: 'Completion meeting harmony.' },
    '9:8': { name: 'Whole tone (epogdoic)', description: 'The basic step of the musical scale.' },
    '256:243': { name: 'Leimma (semitone)', description: 'The residual interval completing the fourth.' }
  };

  const DEFAULT_CONFIG = {
    source: 'composite',
    includeDeityAssociations: true
  };

  const VARIANTS = {
    plotinus:    { source: 'plotinus', includeDeityAssociations: false },
    iamblichus:  { source: 'iamblichus', includeDeityAssociations: true },
    nicomachus:  { source: 'nicomachus', includeDeityAssociations: true },
    composite:   { source: 'composite', includeDeityAssociations: true }
  };

  function create(config) {
    if (typeof config === 'string' && VARIANTS[config]) {
      config = { ...VARIANTS[config] };
    }
    const cfg = { ...DEFAULT_CONFIG, ...(config || {}) };

    function decadPrinciple(n) {
      // Reduce to 1-10
      n = Math.abs(Math.floor(n));
      while (n > 10) {
        n = ReductionUtils.digitSum(n);
      }
      return n;
    }

    function isPerfect(n) { return ReductionUtils.isPerfect(n); }
    function isTriangular(n) { return ReductionUtils.isTriangular(n); }
    function isPrime(n) { return ReductionUtils.isPrime(n); }
    function isSquare(n) { return ReductionUtils.isSquare(n); }
    function isCubic(n) { return ReductionUtils.isCubic(n); }

    function properties(n) {
      const props = {
        odd: n % 2 !== 0,
        even: n % 2 === 0,
        prime: isPrime(n),
        composite: n > 1 && !isPrime(n),
        perfect: isPerfect(n),
        abundant: ReductionUtils.isAbundant(n),
        deficient: ReductionUtils.isDeficient(n),
        triangular: isTriangular(n),
        square: isSquare(n),
        cubic: isCubic(n)
      };

      const triangularRoot = ReductionUtils.triangularRoot(n);
      if (triangularRoot !== null) {
        props.triangularRoot = triangularRoot;
      }

      const factorList = ReductionUtils.factors(n);
      props.factors = factorList;

      // Decad principle
      props.decadPrinciple = decadPrinciple(n);
      const decadMeaning = DECAD[props.decadPrinciple];
      if (decadMeaning) {
        props.decadName = decadMeaning.name;
        props.decadDescription = decadMeaning.description;
      }

      if (cfg.includeDeityAssociations) {
        props.deity = DEITY_ASSOCIATIONS[props.decadPrinciple] || null;
      }

      return props;
    }

    function tetractys() {
      return {
        levels: [1, 2, 3, 4],
        sum: 10,
        description: 'The Tetractys: 1+2+3+4=10. The sacred figure of the Pythagoreans. It contains all musical ratios: 4:3 (fourth), 3:2 (fifth), 2:1 (octave), and represents point, line, surface, solid.',
        ratios: {
          '4:3': 'Perfect fourth',
          '3:2': 'Perfect fifth',
          '2:1': 'Octave',
          '4:1': 'Double octave'
        }
      };
    }

    function factorize(n) {
      const factorList = ReductionUtils.factors(n);
      const commentary = [];

      if (isPerfect(n)) {
        commentary.push(n + ' is a perfect number — equal to the sum of its proper divisors. In Neoplatonic thought, perfection mirrors the divine completeness.');
      }
      if (isTriangular(n)) {
        const root = ReductionUtils.triangularRoot(n);
        commentary.push(n + ' is triangular(' + root + ') — the sum of integers 1 through ' + root + '. Triangular numbers embody orderly accumulation.');
      }
      if (isPrime(n)) {
        commentary.push(n + ' is prime — indivisible, a unity unto itself. Prime numbers resist decomposition, mirroring the simplicity of higher principles.');
      }
      if (isSquare(n)) {
        const root = Math.round(Math.sqrt(n));
        commentary.push(n + ' = ' + root + '² — a square number, representing justice and equal measure (area = side × side).');
      }
      if (isCubic(n)) {
        const root = Math.round(Math.cbrt(n));
        commentary.push(n + ' = ' + root + '³ — a cubic number, representing solidity and three-dimensional completeness.');
      }

      return {
        number: n,
        factors: factorList,
        commentary: commentary
      };
    }

    function ratio(a, b) {
      // Reduce to simplest form
      function gcd(x, y) { return y === 0 ? x : gcd(y, x % y); }
      const g = gcd(Math.abs(a), Math.abs(b));
      const ra = a / g;
      const rb = b / g;
      const key = ra + ':' + rb;

      const result = {
        ratio: key,
        decimal: a / b
      };

      if (SIGNIFICANT_RATIOS[key]) {
        result.interval = SIGNIFICANT_RATIOS[key].name;
        result.significance = SIGNIFICANT_RATIOS[key].description;
      }

      return result;
    }

    function numberMeaning(n) {
      if (n >= 1 && n <= 10) {
        const meaning = { ...DECAD[n] };
        if (cfg.includeDeityAssociations) {
          meaning.deity = DEITY_ASSOCIATIONS[n];
        }
        return meaning;
      }
      // For larger numbers, analyze via properties
      const props = properties(n);
      const result = { number: n, decadPrinciple: props.decadPrinciple };
      if (props.perfect) result.perfect = true;
      if (props.triangular) result.triangular = true;
      if (props.triangularRoot !== undefined) result.triangularRoot = props.triangularRoot;
      return result;
    }

    function analyze(input) {
      if (typeof input === 'number') {
        return {
          properties: properties(input),
          factorization: factorize(input),
          meaning: numberMeaning(input)
        };
      }
      return null;
    }

    return {
      decadPrinciple,
      isPerfect,
      isTriangular,
      isPrime,
      isSquare,
      isCubic,
      properties,
      tetractys,
      factorize,
      ratio,
      numberMeaning,
      analyze
    };
  }

  return { create, DEFAULT_CONFIG, VARIANTS, DECAD, DEITY_ASSOCIATIONS, SIGNIFICANT_RATIOS };
})();

if (typeof module !== 'undefined') module.exports = Neoplatonic;
