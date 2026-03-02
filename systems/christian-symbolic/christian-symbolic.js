/**
 * Libernumerus — Christian Symbolic Numerology
 * Biblical number meanings, Augustinian factorization, typological pairs,
 * Latin isopsephy, Revelation number analysis
 */
const ReductionUtils = (typeof require !== 'undefined') ? require('../../shared/reduction-utils') : window.ReductionUtils;

const ChristianSymbolic = (() => {
  // Biblical number meanings
  const MEANINGS = {
    1:   { number: 1, name: 'Unity', description: 'God is one. The Shema: "Hear O Israel, the Lord our God, the Lord is One." Unity and primacy.', sources: ['Deut 6:4'] },
    2:   { number: 2, name: 'Witness', description: 'Two witnesses establish truth. Two natures of Christ (divine/human). Two Testaments.', sources: ['Deut 19:15', 'Rev 11:3'] },
    3:   { number: 3, name: 'Trinity', description: 'Father, Son, Holy Spirit. Three days in the tomb. Three theological virtues (faith, hope, love). Peter\'s triple denial and restoration.', sources: ['Matt 28:19', '1 Cor 13:13'] },
    4:   { number: 4, name: 'Creation/Universality', description: 'Four corners of the earth. Four winds. Four Gospels. Four living creatures. Universal scope.', sources: ['Rev 7:1', 'Ezek 1:10'] },
    5:   { number: 5, name: 'Grace', description: 'Five books of the Law. Five wounds of Christ. Five loaves multiplied. Grace completing the Law.', sources: ['Matt 14:17'] },
    6:   { number: 6, name: 'Imperfection', description: 'Humanity created on the sixth day. Falls short of 7 (perfection). Work days before rest. 666 = ultimate human pretension.', sources: ['Gen 1:31', 'Rev 13:18'] },
    7:   { number: 7, name: 'Perfection/Completion', description: 'Seven days of creation. Seven sacraments. Seven deadly sins. Seven gifts of the Spirit. Seven seals, trumpets, bowls in Revelation.', sources: ['Gen 2:2', 'Rev 5:1'] },
    8:   { number: 8, name: 'New Beginning/Resurrection', description: 'Circumcision on the eighth day. Eight souls saved on Noah\'s Ark. Resurrection on the first/eighth day. The octave.', sources: ['Gen 17:12', '1 Pet 3:20'] },
    9:   { number: 9, name: 'Finality/Judgment', description: 'Nine fruits of the Spirit. Christ died at the ninth hour. Judgment and finality.', sources: ['Gal 5:22', 'Matt 27:46'] },
    10:  { number: 10, name: 'Law/Completeness', description: 'Ten Commandments. Ten plagues. Complete earthly order. Ten virgins.', sources: ['Exod 20', 'Matt 25:1'] },
    11:  { number: 11, name: 'Disorder/Incompleteness', description: 'One beyond perfection (10), one short of governance (12). Disorder. The eleven remaining apostles.', sources: ['Acts 1:26'] },
    12:  { number: 12, name: 'Governance/God\'s People', description: '12 tribes of Israel. 12 apostles. 12 gates of New Jerusalem. Divine governance.', sources: ['Gen 49', 'Matt 10:2', 'Rev 21:12'] },
    13:  { number: 13, name: 'Rebellion/Transition', description: 'Thirteen at the Last Supper. Genesis 14:4 — rebellion in the 13th year. Transition and testing.', sources: ['Matt 26:20', 'Gen 14:4'] },
    24:  { number: 24, name: 'Heavenly Governance', description: '24 elders around the throne. Double 12 — fullness of divine governance.', sources: ['Rev 4:4'] },
    40:  { number: 40, name: 'Testing/Probation', description: '40 days of rain. 40 years wandering. 40 days of temptation. 40 days of Lent. Period of testing and preparation.', sources: ['Gen 7:4', 'Matt 4:2'] },
    70:  { number: 70, name: 'Universality/Restoration', description: '70 elders of Israel. 70 nations in Genesis. 70 years of exile. 70 × 7 = complete forgiveness.', sources: ['Num 11:16', 'Jer 29:10', 'Matt 18:22'] },
    153: { number: 153, name: 'The Miraculous Catch', description: 'Augustine: triangular(17), and 17 = 10(Law) + 7(Grace). All nations gathered. Jerome: 153 species of fish known to the ancients.', sources: ['John 21:11'], augustinian: '153 = T(17), 17 = 10 + 7, Law + Grace = fullness of the Church' },
    144000: { number: 144000, name: 'The Sealed', description: '12 × 12 × 1000 = fullness of God\'s people × completeness × immensity. The sealed of Revelation.', sources: ['Rev 7:4', 'Rev 14:1'] },
    666: { number: 666, name: 'The Beast', description: 'Gematria of "Neron Kaisar" in Hebrew transliteration (נרון קסר). Falling short of the divine 777. Variant: 616 in P115.', sources: ['Rev 13:18'], gematria: 'Nero Caesar in Hebrew = 50+200+6+50+100+60+200 = 666' },
    616: { number: 616, name: 'Beast Variant', description: 'Attested in Papyrus 115 (P115), an early Revelation manuscript. Possibly encoding "Gaius Caesar" or the Latin form of Nero.', sources: ['P115', 'Irenaeus mentions the variant'] },
    888: { number: 888, name: 'Jesus', description: 'Greek isopsephy of Ιησους (Jesus): Ι(10)+η(8)+σ(200)+ο(70)+υ(400)+ς(200) = 888. Triple 8 — resurrection perfected.', sources: ['Greek gematria tradition'] },
    1000: { number: 1000, name: 'Immensity/Millennium', description: 'The Millennium — 1000-year reign of Christ. Divine immensity. "A day is as a thousand years."', sources: ['Rev 20:4', '2 Pet 3:8'] }
  };

  // Typological pairs — OT/NT correspondences
  const TYPOLOGICAL_PAIRS = {
    1:  { OT: 'One God (Shema)', NT: 'One Lord, one faith, one baptism', Revelation: 'One throne' },
    3:  { OT: 'Three visitors to Abraham', NT: 'Trinity', Revelation: 'Three woes' },
    4:  { OT: 'Four rivers of Eden', NT: 'Four Gospels', Revelation: 'Four living creatures' },
    7:  { OT: 'Seven days of Creation', NT: 'Seven "I am" statements', Revelation: 'Seven seals/trumpets/bowls' },
    12: { OT: '12 tribes of Israel', NT: '12 apostles', Revelation: '12 gates of New Jerusalem' },
    40: { OT: '40 years in wilderness', NT: '40 days of temptation', Revelation: null },
    70: { OT: '70 elders, 70 years exile', NT: '70 disciples sent out', Revelation: null }
  };

  // Latin isopsephy — Roman numeral letter values
  const LATIN_VALUES = {
    I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000
  };

  const DEFAULT_CONFIG = {
    tradition: 'ecumenical',
    includeLatinIsopsephy: false,
    beastNumber: 666
  };

  const VARIANTS = {
    catholic:    { tradition: 'catholic', includeLatinIsopsephy: false, beastNumber: 666 },
    orthodox:    { tradition: 'orthodox', includeLatinIsopsephy: false, beastNumber: 666 },
    protestant:  { tradition: 'protestant', includeLatinIsopsephy: false, beastNumber: 666 },
    ecumenical:  { tradition: 'ecumenical', includeLatinIsopsephy: false, beastNumber: 666 }
  };

  function create(config) {
    if (typeof config === 'string' && VARIANTS[config]) {
      config = { ...VARIANTS[config] };
    }
    const cfg = { ...DEFAULT_CONFIG, ...(config || {}) };

    function meaning(n) {
      if (n === 616 && cfg.beastNumber === 616) {
        return MEANINGS[616];
      }
      return MEANINGS[n] || null;
    }

    function augustinianAnalysis(n) {
      const result = { number: n, factors: ReductionUtils.factors(n), commentary: [] };

      if (ReductionUtils.isTriangular(n)) {
        const root = ReductionUtils.triangularRoot(n);
        result.triangular = true;
        result.triangularRoot = root;
        result.commentary.push(n + ' = triangular(' + root + ')');
        // Check if root decomposes meaningfully
        if (root > 1) {
          const parts = [];
          // Try 10 + remainder (Law + Grace pattern)
          if (root > 10) {
            parts.push(root + ' = 10 + ' + (root - 10));
            result.commentary.push('10 (Commandments/Law) + ' + (root - 10) + ' (Gifts of the Spirit)');
          }
          // Try 7 + remainder
          if (root > 7 && root <= 10) {
            parts.push(root + ' = 7 + ' + (root - 7));
          }
        }
      }

      if (ReductionUtils.isPerfect(n)) {
        result.perfect = true;
        result.commentary.push(n + ' is a perfect number — sum of its divisors. Augustine saw perfection in God\'s creative work.');
      }

      // Factor analysis
      if (result.factors.length > 1) {
        const factorPairs = [];
        for (let i = 1; i * i <= n; i++) {
          if (n % i === 0) {
            factorPairs.push([i, n / i]);
          }
        }
        result.factorPairs = factorPairs;
      }

      return result;
    }

    function typology(n) {
      return TYPOLOGICAL_PAIRS[n] || null;
    }

    function latinValue(str) {
      if (!cfg.includeLatinIsopsephy) return null;
      let sum = 0;
      for (const ch of str.toUpperCase()) {
        if (LATIN_VALUES[ch]) sum += LATIN_VALUES[ch];
      }
      return sum;
    }

    function revelationAnalysis(n) {
      const numbers = [7, 12, 24, 666, 616, 888, 1000, 144000];
      if (!numbers.includes(n)) return null;
      return meaning(n);
    }

    function numberMeaning(n) {
      return meaning(n);
    }

    function analyze(input) {
      if (typeof input === 'number') {
        const result = {
          meaning: meaning(input),
          augustinian: augustinianAnalysis(input),
          typology: typology(input)
        };
        if (cfg.includeLatinIsopsephy) {
          result.latinIsopsephy = 'enabled';
        }
        return result;
      }
      if (typeof input === 'string' && cfg.includeLatinIsopsephy) {
        return { latinValue: latinValue(input) };
      }
      return null;
    }

    return {
      meaning,
      augustinianAnalysis,
      typology,
      latinValue,
      revelationAnalysis,
      numberMeaning,
      analyze
    };
  }

  return { create, DEFAULT_CONFIG, VARIANTS, MEANINGS, TYPOLOGICAL_PAIRS, LATIN_VALUES };
})();

if (typeof module !== 'undefined') module.exports = ChristianSymbolic;
