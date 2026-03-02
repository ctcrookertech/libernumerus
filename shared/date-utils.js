/**
 * Libernumerus — Date utility functions
 * Julian Day Number conversion, calendar conversions, lunisolar approximation
 */
const DateUtils = (() => {

  /**
   * Gregorian date → Julian Day Number
   * @param {number} year - Gregorian year (negative for BCE)
   * @param {number} month - 1-12
   * @param {number} day - 1-31
   * @returns {number} Julian Day Number
   */
  function gregorianToJDN(year, month, day) {
    // Adjust for Jan/Feb being months 13/14 of previous year
    let a = Math.floor((14 - month) / 12);
    let y = year + 4800 - a;
    let m = month + 12 * a - 3;
    return day + Math.floor((153 * m + 2) / 5) + 365 * y +
           Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  }

  /**
   * Julian Day Number → Gregorian date
   * @param {number} jdn - Julian Day Number
   * @returns {{year: number, month: number, day: number}}
   */
  function jdnToGregorian(jdn) {
    let a = jdn + 32044;
    let b = Math.floor((4 * a + 3) / 146097);
    let c = a - Math.floor(146097 * b / 4);
    let d = Math.floor((4 * c + 3) / 1461);
    let e = c - Math.floor(1461 * d / 4);
    let m = Math.floor((5 * e + 2) / 153);
    let day = e - Math.floor((153 * m + 2) / 5) + 1;
    let month = m + 3 - 12 * Math.floor(m / 10);
    let year = 100 * b + d - 4800 + Math.floor(m / 10);
    return { year, month, day };
  }

  /**
   * Julian calendar date → Julian Day Number
   */
  function julianToJDN(year, month, day) {
    let a = Math.floor((14 - month) / 12);
    let y = year + 4800 - a;
    let m = month + 12 * a - 3;
    return day + Math.floor((153 * m + 2) / 5) + 365 * y +
           Math.floor(y / 4) - 32083;
  }

  /**
   * Julian Day Number → Julian calendar date
   */
  function jdnToJulian(jdn) {
    let b = 0;
    let c = jdn + 32082;
    let d = Math.floor((4 * c + 3) / 1461);
    let e = c - Math.floor(1461 * d / 4);
    let m = Math.floor((5 * e + 2) / 153);
    let day = e - Math.floor((153 * m + 2) / 5) + 1;
    let month = m + 3 - 12 * Math.floor(m / 10);
    let year = d - 4800 + Math.floor(m / 10);
    return { year, month, day };
  }

  /**
   * Gregorian → Julian calendar date
   */
  function gregorianToJulian(year, month, day) {
    const jdn = gregorianToJDN(year, month, day);
    return jdnToJulian(jdn);
  }

  /**
   * Julian → Gregorian calendar date
   */
  function julianToGregorian(year, month, day) {
    const jdn = julianToJDN(year, month, day);
    return jdnToGregorian(jdn);
  }

  /**
   * Extract date components from a Date object or {year, month, day}
   */
  function extractComponents(date) {
    if (date instanceof Date) {
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      };
    }
    return { year: date.year, month: date.month, day: date.day };
  }

  /**
   * Approximate lunisolar month and day for Japanese Rokuyō calculation.
   * This is a simplified approximation based on astronomical new moon estimates.
   * For the Rokuyō cycle: index = (lunarMonth + lunarDay) % 6
   * 0=Sensho, 1=Tomobiki, 2=Senbu, 3=Butsumetsu, 4=Taian, 5=Shakku
   *
   * Uses a known new moon reference (Jan 6, 2000 = JDN 2451551)
   * and the synodic month length (~29.53059 days).
   */
  function approximateLunisolar(year, month, day) {
    const jdn = gregorianToJDN(year, month, day);
    const SYNODIC_MONTH = 29.53059;
    // Reference new moon: January 6, 2000 (approximately 18:14 UTC)
    const REF_NEW_MOON_JDN = 2451551;

    const daysSinceRef = jdn - REF_NEW_MOON_JDN;
    const lunarMonthsSinceRef = daysSinceRef / SYNODIC_MONTH;
    const currentLunarMonth = lunarMonthsSinceRef - Math.floor(lunarMonthsSinceRef);
    const lunarDay = Math.floor(currentLunarMonth * SYNODIC_MONTH) + 1;

    // Approximate the lunar month number (1-12)
    // This is rough — proper calculation needs solar terms
    const monthsSinceRef = Math.floor(lunarMonthsSinceRef);
    const lunarMonth = ((monthsSinceRef % 12) + 12) % 12 + 1;

    return { lunarMonth, lunarDay };
  }

  /**
   * Day of week from JDN (0=Monday, ..., 6=Sunday)
   */
  function dayOfWeek(jdn) {
    return jdn % 7;
  }

  /**
   * Is leap year (Gregorian)?
   */
  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  return {
    gregorianToJDN,
    jdnToGregorian,
    julianToJDN,
    jdnToJulian,
    gregorianToJulian,
    julianToGregorian,
    extractComponents,
    approximateLunisolar,
    dayOfWeek,
    isLeapYear
  };
})();

if (typeof module !== 'undefined') module.exports = DateUtils;
