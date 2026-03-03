/**
 * Liber Numerus — Pythagorean / Western Numerology
 * Letter-mapping + digit-reduction system with Master Numbers and Karmic Debt
 */
const ReductionUtils = (typeof require !== 'undefined') ? require('../../shared/reduction-utils') : window.ReductionUtils;

const Pythagorean = (() => {
  // A=1..I=9, J=1..R=9, S=1..Z=8
  const LETTER_MAP = {
    A:1, B:2, C:3, D:4, E:5, F:6, G:7, H:8, I:9,
    J:1, K:2, L:3, M:4, N:5, O:6, P:7, Q:8, R:9,
    S:1, T:2, U:3, V:4, W:5, X:6, Y:7, Z:8
  };

  const VOWELS = new Set(['A','E','I','O','U']);
  const KARMIC_DEBT_NUMBERS = [13, 14, 16, 19];

  const MEANINGS = {
    1: { number:1, name:'The Individual', keywords:['independence','leadership','initiative','originality'], description:'The beginning, the creative force, the self. Leadership and pioneering energy.', isModernAddition:false },
    2: { number:2, name:'The Peacemaker', keywords:['cooperation','diplomacy','sensitivity','balance'], description:'Duality, partnership, receptivity. The mediator and harmonizer.', isModernAddition:false },
    3: { number:3, name:'The Communicator', keywords:['expression','creativity','joy','social'], description:'Self-expression, artistic creativity, communication. The entertainer and inspirer.', isModernAddition:false },
    4: { number:4, name:'The Builder', keywords:['stability','order','discipline','foundation'], description:'Structure, hard work, practicality. Building solid foundations.', isModernAddition:false },
    5: { number:5, name:'The Freedom Seeker', keywords:['change','freedom','adventure','versatility'], description:'Dynamic change, freedom, sensory experience. The explorer and adventurer.', isModernAddition:false },
    6: { number:6, name:'The Nurturer', keywords:['responsibility','love','harmony','domestic'], description:'Home, family, responsibility, service. The caretaker and healer.', isModernAddition:false },
    7: { number:7, name:'The Seeker', keywords:['analysis','introspection','wisdom','spiritual'], description:'Inner wisdom, spiritual seeking, analytical depth. The philosopher and mystic.', isModernAddition:false },
    8: { number:8, name:'The Powerhouse', keywords:['power','abundance','authority','achievement'], description:'Material mastery, authority, karmic balance. The executive and achiever.', isModernAddition:false },
    9: { number:9, name:'The Humanitarian', keywords:['completion','compassion','universal','selfless'], description:'Universal love, completion, humanitarianism. The teacher and healer.', isModernAddition:false },
    10: { number:10, name:'The Wheel', keywords:['completion','return','wholeness','cycle'], description:'Return to unity through completion of cycle. The Pythagorean Decad.', isModernAddition:false },
    11: { number:11, name:'The Master Intuitive', keywords:['intuition','illumination','idealism','visionary'], description:'Spiritual messenger, heightened intuition, inspiration. Must be lived at high vibration or defaults to 2.', isModernAddition:true },
    12: { number:12, name:'The Cosmic Order', keywords:['completion','cosmic','zodiac','governance'], description:'Cosmic order and governance — 12 signs, 12 tribes, 12 apostles.', isModernAddition:false },
    13: { number:13, name:'Transformation', keywords:['death','rebirth','transformation','karmic'], description:'Death and rebirth, transformation. In Pythagorean context, exceeds the Dodecad.', isModernAddition:false },
    22: { number:22, name:'The Master Builder', keywords:['mastery','architecture','vision','achievement'], description:'The master architect, turning dreams into reality on a grand scale. Must be lived at high vibration or defaults to 4.', isModernAddition:true },
    33: { number:33, name:'The Master Teacher', keywords:['healing','blessing','courage','upliftment'], description:'The master healer and teacher. Selfless devotion to uplifting humanity. Defaults to 6.', isModernAddition:true },
    44: { number:44, name:'The Master Healer', keywords:['metamorphosis','discipline','mastery'], description:'Mastery over the physical and material realm. Extremely rare. Defaults to 8.', isModernAddition:true }
  };

  const KARMIC_DEBT_MEANINGS = {
    13: { number:13, name:'Karmic Debt 13', description:'Laziness and taking shortcuts in past lives. Must learn diligence and hard work.', lesson:'Persistent effort and focus' },
    14: { number:14, name:'Karmic Debt 14', description:'Abuse of freedom in past lives. Must learn moderation and commitment.', lesson:'Temperance and self-control' },
    16: { number:16, name:'Karmic Debt 16', description:'Ego and vanity in past lives. Must learn humility through the destruction of the old self.', lesson:'Humility through ego death' },
    19: { number:19, name:'Karmic Debt 19', description:'Abuse of power in past lives. Must learn self-reliance without selfishness.', lesson:'Independence with compassion' }
  };

  const DEFAULT_CONFIG = {
    masterNumbers: [11, 22, 33],
    karmicDebtEnabled: true,
    yAsVowel: 'contextual',
    reductionMethod: 'standard'
  };

  const VARIANTS = {
    modern: { masterNumbers: [11, 22, 33], karmicDebtEnabled: true, yAsVowel: 'contextual', reductionMethod: 'standard' },
    ancient: { masterNumbers: [], karmicDebtEnabled: false, yAsVowel: 'never', reductionMethod: 'ancient' },
    conservative: { masterNumbers: [11, 22], karmicDebtEnabled: true, yAsVowel: 'contextual', reductionMethod: 'standard' }
  };

  function create(config) {
    if (typeof config === 'string' && VARIANTS[config]) {
      config = { ...VARIANTS[config] };
    }
    const cfg = { ...DEFAULT_CONFIG, ...(config || {}) };

    function getStopAt() {
      if (cfg.reductionMethod === 'ancient') return [];
      return cfg.masterNumbers;
    }

    function reduce(n) {
      if (cfg.reductionMethod === 'ancient') {
        // Reduce to 1-10 (the Decad)
        n = Math.abs(Math.floor(n));
        while (n > 10) {
          n = ReductionUtils.digitSum(n);
        }
        return n;
      }
      return ReductionUtils.reduce(n, getStopAt());
    }

    function reductionPath(n) {
      if (cfg.reductionMethod === 'ancient') {
        n = Math.abs(Math.floor(n));
        const path = [n];
        while (n > 10) {
          n = ReductionUtils.digitSum(n);
          path.push(n);
        }
        return path;
      }
      return ReductionUtils.reductionPath(n, getStopAt());
    }

    function letterValue(ch) {
      return LETTER_MAP[ch.toUpperCase()] || 0;
    }

    function isYVowel(name, index) {
      if (cfg.yAsVowel === 'always') return true;
      if (cfg.yAsVowel === 'never') return false;
      // Contextual: Y is vowel when no other vowel is adjacent
      const upper = name.toUpperCase();
      const prev = index > 0 ? upper[index - 1] : null;
      const next = index < upper.length - 1 ? upper[index + 1] : null;
      const hasAdjacentVowel = (prev && VOWELS.has(prev)) || (next && VOWELS.has(next));
      return !hasAdjacentVowel;
    }

    function classifyLetters(name) {
      const upper = name.toUpperCase().replace(/[^A-Z]/g, '');
      const vowels = [];
      const consonants = [];
      for (let i = 0; i < upper.length; i++) {
        const ch = upper[i];
        if (ch === 'Y') {
          if (isYVowel(upper, i)) {
            vowels.push(ch);
          } else {
            consonants.push(ch);
          }
        } else if (VOWELS.has(ch)) {
          vowels.push(ch);
        } else {
          consonants.push(ch);
        }
      }
      return { vowels, consonants };
    }

    function wordValue(str) {
      let sum = 0;
      for (const ch of str.toUpperCase()) {
        if (LETTER_MAP[ch]) sum += LETTER_MAP[ch];
      }
      return sum;
    }

    function detectKarmicDebt(path) {
      if (!cfg.karmicDebtEnabled || cfg.reductionMethod === 'ancient') return [];
      const found = [];
      for (const n of path) {
        if (KARMIC_DEBT_NUMBERS.includes(n) && !found.includes(n)) {
          found.push(n);
        }
      }
      return found;
    }

    function lifePath(date) {
      const { month, day, year } = date;
      const stopAt = getStopAt();
      // Reduce each component separately
      const monthReduced = ReductionUtils.reduce(month, stopAt);
      const dayReduced = ReductionUtils.reduce(day, stopAt);
      // For year, sum digits then reduce
      const yearSum = ReductionUtils.digitSum(year);
      const yearReduced = ReductionUtils.reduce(yearSum, stopAt);
      const total = monthReduced + dayReduced + yearReduced;
      const path = reductionPath(total);
      const result = reduce(total);
      const karmicDebt = detectKarmicDebt([month + day + year, ...ReductionUtils.reductionPath(month + day + year, stopAt)]);
      return {
        value: result,
        reductionPath: path,
        karmicDebt: karmicDebt,
        components: { month: monthReduced, day: dayReduced, year: yearReduced }
      };
    }

    function expression(name) {
      const sum = wordValue(name);
      const path = reductionPath(sum);
      const result = reduce(sum);
      return { value: result, total: sum, reductionPath: path, karmicDebt: detectKarmicDebt(path) };
    }

    function soulUrge(name) {
      const { vowels } = classifyLetters(name);
      const sum = vowels.reduce((acc, ch) => acc + (LETTER_MAP[ch] || 0), 0);
      const path = reductionPath(sum);
      const result = reduce(sum);
      return { value: result, total: sum, vowels: vowels, reductionPath: path, karmicDebt: detectKarmicDebt(path) };
    }

    function personality(name) {
      const { consonants } = classifyLetters(name);
      const sum = consonants.reduce((acc, ch) => acc + (LETTER_MAP[ch] || 0), 0);
      const path = reductionPath(sum);
      const result = reduce(sum);
      return { value: result, total: sum, consonants: consonants, reductionPath: path, karmicDebt: detectKarmicDebt(path) };
    }

    function personalYear(birthMonth, birthDay, currentYear) {
      const sum = birthMonth + birthDay + currentYear;
      return { value: reduce(sum), reductionPath: reductionPath(sum) };
    }

    function pinnacles(date) {
      const { month, day, year } = date;
      const stopAt = getStopAt();
      const m = ReductionUtils.reduce(month, stopAt);
      const d = ReductionUtils.reduce(day, stopAt);
      const y = ReductionUtils.reduce(ReductionUtils.digitSum(year), stopAt);

      const p1 = reduce(m + d);
      const p2 = reduce(d + y);
      const p3 = reduce(p1 + p2);
      const p4 = reduce(m + y);

      return [
        { pinnacle: 1, value: p1 },
        { pinnacle: 2, value: p2 },
        { pinnacle: 3, value: p3 },
        { pinnacle: 4, value: p4 }
      ];
    }

    function challenges(date) {
      const { month, day, year } = date;
      const stopAt = getStopAt();
      const m = ReductionUtils.reduce(month, stopAt);
      const d = ReductionUtils.reduce(day, stopAt);
      const y = ReductionUtils.reduce(ReductionUtils.digitSum(year), stopAt);

      const c1 = Math.abs(m - d);
      const c2 = Math.abs(d - y);
      const c3 = Math.abs(c1 - c2);
      const c4 = Math.abs(m - y);

      return [
        { challenge: 1, value: c1 },
        { challenge: 2, value: c2 },
        { challenge: 3, value: c3 },
        { challenge: 4, value: c4 }
      ];
    }

    function numberMeaning(n) {
      return MEANINGS[n] || null;
    }

    function karmicDebtMeaning(n) {
      return KARMIC_DEBT_MEANINGS[n] || null;
    }

    function analyze(input) {
      if (typeof input === 'object' && input.month && input.day && input.year) {
        return {
          lifePath: lifePath(input),
          pinnacles: pinnacles(input),
          challenges: challenges(input)
        };
      }
      if (typeof input === 'string') {
        return {
          expression: expression(input),
          soulUrge: soulUrge(input),
          personality: personality(input)
        };
      }
      if (typeof input === 'number') {
        return {
          reduced: reduce(input),
          reductionPath: reductionPath(input),
          meaning: numberMeaning(reduce(input))
        };
      }
      return null;
    }

    return {
      reduce,
      reductionPath,
      letterValue,
      wordValue,
      lifePath,
      expression,
      soulUrge,
      personality,
      personalYear,
      pinnacles,
      challenges,
      numberMeaning,
      karmicDebtMeaning,
      analyze,
      classifyLetters,
      detectKarmicDebt
    };
  }

  return { create, DEFAULT_CONFIG, VARIANTS, LETTER_MAP, MEANINGS, KARMIC_DEBT_MEANINGS };
})();

if (typeof module !== 'undefined') module.exports = Pythagorean;
