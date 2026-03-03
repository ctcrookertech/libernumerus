/**
 * Liber Numerus — Unicode utility functions
 * Script detection, character normalization, vowel/consonant classification
 */
const UnicodeUtils = (() => {

  // Script detection ranges
  const SCRIPT_RANGES = {
    hebrew:    [[0x0590, 0x05FF], [0xFB1D, 0xFB4F]],
    greek:     [[0x0370, 0x03FF], [0x1F00, 0x1FFF]],
    arabic:    [[0x0600, 0x06FF], [0x0750, 0x077F], [0xFB50, 0xFDFF], [0xFE70, 0xFEFF]],
    runic:     [[0x16A0, 0x16FF]],
    ogham:     [[0x1680, 0x169F]],
    latin:     [[0x0041, 0x007A], [0x00C0, 0x024F]]
  };

  function detectScript(str) {
    const cleaned = str.replace(/[\s\u0300-\u036F]/g, '');
    if (!cleaned.length) return 'unknown';
    const cp = cleaned.codePointAt(0);
    for (const [script, ranges] of Object.entries(SCRIPT_RANGES)) {
      for (const [lo, hi] of ranges) {
        if (cp >= lo && cp <= hi) return script;
      }
    }
    return 'unknown';
  }

  // Normalize combining marks — strip them and return base characters
  function normalizeMarks(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036F\u0591-\u05BD\u05BF\u05C1-\u05C7\u0610-\u061A\u064B-\u065F\u0670]/g, '').normalize('NFC');
  }

  // Hebrew sofit (final form) detection
  const HEBREW_SOFIT = {
    '\u05DA': '\u05DB', // ך → כ (Kaf)
    '\u05DD': '\u05DE', // ם → מ (Mem)
    '\u05DF': '\u05E0', // ן → נ (Nun)
    '\u05E3': '\u05E4', // ף → פ (Pe)
    '\u05E5': '\u05E6', // ץ → צ (Tsade)
  };

  const HEBREW_SOFIT_CHARS = new Set(Object.keys(HEBREW_SOFIT));

  function isSofit(ch) {
    return HEBREW_SOFIT_CHARS.has(ch);
  }

  function sofitToNormal(ch) {
    return HEBREW_SOFIT[ch] || ch;
  }

  // Greek archaic characters
  const GREEK_ARCHAIC = {
    '\u03DC': 6,   // Ϝ Digamma
    '\u03DD': 6,   // ϝ digamma lowercase
    '\u03DA': 6,   // Ϛ Stigma
    '\u03DB': 6,   // ϛ stigma lowercase
    '\u03DE': 90,  // Ϟ Qoppa
    '\u03DF': 90,  // ϟ qoppa lowercase
    '\u03E0': 900, // Ϡ Sampi
    '\u03E1': 900, // ϡ sampi lowercase
  };

  function isArchaicGreek(ch) {
    return ch in GREEK_ARCHAIC;
  }

  function archaicGreekValue(ch) {
    return GREEK_ARCHAIC[ch] || null;
  }

  // Arabic normalization — strip tatweel and normalize presentation forms
  function normalizeArabic(str) {
    // Remove tatweel (kashida)
    let result = str.replace(/\u0640/g, '');
    // Map common presentation forms back to basic Arabic
    // FB50-FDFF and FE70-FEFF → basic Arabic block
    const normalized = [];
    for (const ch of result) {
      const cp = ch.codePointAt(0);
      // Presentation form B → basic
      if (cp >= 0xFE70 && cp <= 0xFEFF) {
        normalized.push(mapArabicPresentationB(cp));
      } else if (cp >= 0xFB50 && cp <= 0xFDFF) {
        normalized.push(mapArabicPresentationA(cp));
      } else {
        normalized.push(ch);
      }
    }
    return normalized.join('');
  }

  // Simplified mapping of Arabic presentation forms to base letters
  function mapArabicPresentationB(cp) {
    // Isolated/Final/Initial/Medial forms → base letter
    // This covers the most common mappings
    const PFB_MAP = {
      0xFE80: '\u0621', // Hamza
      0xFE81: '\u0622', 0xFE82: '\u0622', // Alef Madda
      0xFE83: '\u0623', 0xFE84: '\u0623', // Alef Hamza Above
      0xFE85: '\u0624', 0xFE86: '\u0624', // Waw Hamza
      0xFE87: '\u0625', 0xFE88: '\u0625', // Alef Hamza Below
      0xFE89: '\u0626', 0xFE8A: '\u0626', 0xFE8B: '\u0626', 0xFE8C: '\u0626', // Yeh Hamza
      0xFE8D: '\u0627', 0xFE8E: '\u0627', // Alef
      0xFE8F: '\u0628', 0xFE90: '\u0628', 0xFE91: '\u0628', 0xFE92: '\u0628', // Ba
      0xFE93: '\u0629', 0xFE94: '\u0629', // Teh Marbuta
      0xFE95: '\u062A', 0xFE96: '\u062A', 0xFE97: '\u062A', 0xFE98: '\u062A', // Teh
      0xFE99: '\u062B', 0xFE9A: '\u062B', 0xFE9B: '\u062B', 0xFE9C: '\u062B', // Theh
      0xFE9D: '\u062C', 0xFE9E: '\u062C', 0xFE9F: '\u062C', 0xFEA0: '\u062C', // Jeem
      0xFEA1: '\u062D', 0xFEA2: '\u062D', 0xFEA3: '\u062D', 0xFEA4: '\u062D', // Hah
      0xFEA5: '\u062E', 0xFEA6: '\u062E', 0xFEA7: '\u062E', 0xFEA8: '\u062E', // Khah
      0xFEA9: '\u062F', 0xFEAA: '\u062F', // Dal
      0xFEAB: '\u0630', 0xFEAC: '\u0630', // Thal
      0xFEAD: '\u0631', 0xFEAE: '\u0631', // Ra
      0xFEAF: '\u0632', 0xFEB0: '\u0632', // Zain
      0xFEB1: '\u0633', 0xFEB2: '\u0633', 0xFEB3: '\u0633', 0xFEB4: '\u0633', // Seen
      0xFEB5: '\u0634', 0xFEB6: '\u0634', 0xFEB7: '\u0634', 0xFEB8: '\u0634', // Sheen
      0xFEB9: '\u0635', 0xFEBA: '\u0635', 0xFEBB: '\u0635', 0xFEBC: '\u0635', // Sad
      0xFEBD: '\u0636', 0xFEBE: '\u0636', 0xFEBF: '\u0636', 0xFEC0: '\u0636', // Dad
      0xFEC1: '\u0637', 0xFEC2: '\u0637', 0xFEC3: '\u0637', 0xFEC4: '\u0637', // Tah
      0xFEC5: '\u0638', 0xFEC6: '\u0638', 0xFEC7: '\u0638', 0xFEC8: '\u0638', // Zah
      0xFEC9: '\u0639', 0xFECA: '\u0639', 0xFECB: '\u0639', 0xFECC: '\u0639', // Ain
      0xFECD: '\u063A', 0xFECE: '\u063A', 0xFECF: '\u063A', 0xFED0: '\u063A', // Ghain
      0xFED1: '\u0641', 0xFED2: '\u0641', 0xFED3: '\u0641', 0xFED4: '\u0641', // Fa
      0xFED5: '\u0642', 0xFED6: '\u0642', 0xFED7: '\u0642', 0xFED8: '\u0642', // Qaf
      0xFED9: '\u0643', 0xFEDA: '\u0643', 0xFEDB: '\u0643', 0xFEDC: '\u0643', // Kaf
      0xFEDD: '\u0644', 0xFEDE: '\u0644', 0xFEDF: '\u0644', 0xFEE0: '\u0644', // Lam
      0xFEE1: '\u0645', 0xFEE2: '\u0645', 0xFEE3: '\u0645', 0xFEE4: '\u0645', // Meem
      0xFEE5: '\u0646', 0xFEE6: '\u0646', 0xFEE7: '\u0646', 0xFEE8: '\u0646', // Noon
      0xFEE9: '\u0647', 0xFEEA: '\u0647', 0xFEEB: '\u0647', 0xFEEC: '\u0647', // Heh
      0xFEED: '\u0648', 0xFEEE: '\u0648', // Waw
      0xFEEF: '\u0649', 0xFEF0: '\u0649', // Alef Maksura
      0xFEF1: '\u064A', 0xFEF2: '\u064A', 0xFEF3: '\u064A', 0xFEF4: '\u064A', // Yeh
    };
    return PFB_MAP[cp] || String.fromCodePoint(cp);
  }

  function mapArabicPresentationA(cp) {
    // Simplified — return character as-is for most presentation form A
    // Full mapping would be extensive; normalize via NFD/NFC for most cases
    return String.fromCodePoint(cp);
  }

  // Vowel/consonant classification per script
  const HEBREW_VOWEL_LETTERS = new Set(['\u05D0', '\u05D5', '\u05D9']); // Aleph, Vav, Yod (matres lectionis)
  const GREEK_VOWELS = new Set(['Α','α','Ε','ε','Η','η','Ι','ι','Ο','ο','Υ','υ','Ω','ω']);
  const LATIN_VOWELS = new Set(['A','a','E','e','I','i','O','o','U','u']);

  function isVowel(ch, script) {
    if (!script) script = detectScript(ch);
    switch (script) {
      case 'hebrew': return HEBREW_VOWEL_LETTERS.has(ch);
      case 'greek': return GREEK_VOWELS.has(ch);
      case 'latin': return LATIN_VOWELS.has(ch);
      default: return false;
    }
  }

  function isConsonant(ch, script) {
    if (!script) script = detectScript(ch);
    const cp = ch.codePointAt(0);
    // Must be a letter in the script, and not a vowel
    switch (script) {
      case 'hebrew':
        return cp >= 0x05D0 && cp <= 0x05EA && !HEBREW_VOWEL_LETTERS.has(ch);
      case 'greek':
        return ((cp >= 0x0391 && cp <= 0x03C9) || isArchaicGreek(ch)) && !GREEK_VOWELS.has(ch);
      case 'latin':
        return ((cp >= 0x41 && cp <= 0x5A) || (cp >= 0x61 && cp <= 0x7A)) && !LATIN_VOWELS.has(ch);
      default:
        return false;
    }
  }

  // Strip diacritics for Greek
  function normalizeGreek(str) {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036F]/g, '')
      .normalize('NFC');
  }

  return {
    detectScript,
    normalizeMarks,
    isSofit,
    sofitToNormal,
    isArchaicGreek,
    archaicGreekValue,
    normalizeArabic,
    normalizeGreek,
    isVowel,
    isConsonant,
    HEBREW_SOFIT,
    HEBREW_SOFIT_CHARS,
    GREEK_ARCHAIC,
    LATIN_VOWELS,
    GREEK_VOWELS
  };
})();

if (typeof module !== 'undefined') module.exports = UnicodeUtils;
