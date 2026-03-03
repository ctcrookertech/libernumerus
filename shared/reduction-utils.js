/**
 * Liber Numerus — Digit reduction and number theory utilities
 */
const ReductionUtils = (() => {

  function digitSum(n) {
    n = Math.abs(Math.floor(n));
    let sum = 0;
    while (n > 0) {
      sum += n % 10;
      n = Math.floor(n / 10);
    }
    return sum;
  }

  function reduce(n, stopAt) {
    if (!stopAt) stopAt = [];
    n = Math.abs(Math.floor(n));
    while (n > 9 && !stopAt.includes(n)) {
      n = digitSum(n);
    }
    return n;
  }

  function reductionPath(n, stopAt) {
    if (!stopAt) stopAt = [];
    n = Math.abs(Math.floor(n));
    const path = [n];
    while (n > 9 && !stopAt.includes(n)) {
      n = digitSum(n);
      path.push(n);
    }
    return path;
  }

  function isTriangular(n) {
    if (n < 0) return false;
    // n = k(k+1)/2 → k = (-1 + sqrt(1+8n))/2
    const discriminant = 1 + 8 * n;
    const sqrtD = Math.sqrt(discriminant);
    const k = (-1 + sqrtD) / 2;
    return k === Math.floor(k) && k >= 0;
  }

  function triangularRoot(n) {
    if (n < 0) return null;
    const discriminant = 1 + 8 * n;
    const sqrtD = Math.sqrt(discriminant);
    const k = (-1 + sqrtD) / 2;
    if (k === Math.floor(k) && k >= 0) return k;
    return null;
  }

  function isPerfect(n) {
    if (n < 2) return false;
    return sumOfDivisors(n) === n;
  }

  function isPrime(n) {
    if (n < 2) return false;
    if (n < 4) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
  }

  function isSquare(n) {
    if (n < 0) return false;
    const s = Math.floor(Math.sqrt(n));
    return s * s === n;
  }

  function isCubic(n) {
    if (n < 0) return false;
    const c = Math.round(Math.cbrt(n));
    return c * c * c === n;
  }

  function factors(n) {
    n = Math.abs(n);
    if (n < 1) return [];
    const result = [];
    for (let i = 1; i < n; i++) {
      if (n % i === 0) result.push(i);
    }
    return result;
  }

  function sumOfDivisors(n) {
    let sum = 0;
    for (let i = 1; i < n; i++) {
      if (n % i === 0) sum += i;
    }
    return sum;
  }

  function isAbundant(n) {
    if (n < 2) return false;
    return sumOfDivisors(n) > n;
  }

  function isDeficient(n) {
    if (n < 2) return false;
    return sumOfDivisors(n) < n;
  }

  return {
    digitSum,
    reduce,
    reductionPath,
    isTriangular,
    triangularRoot,
    isPerfect,
    isPrime,
    isSquare,
    isCubic,
    factors,
    isAbundant,
    isDeficient,
    sumOfDivisors
  };
})();

if (typeof module !== 'undefined') module.exports = ReductionUtils;
