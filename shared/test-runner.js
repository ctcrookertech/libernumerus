/**
 * Libernumerus — Minimal assert-based test framework
 * Works in both Node.js and browser environments
 */
const TestRunner = (() => {
  const suites = [];
  let currentSuite = null;

  function deepEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (typeof a !== typeof b) return false;
    if (typeof a !== 'object') return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }

  function formatValue(v) {
    if (v === undefined) return 'undefined';
    if (v === null) return 'null';
    if (typeof v === 'string') return JSON.stringify(v);
    if (typeof v === 'object') {
      try { return JSON.stringify(v); } catch { return String(v); }
    }
    return String(v);
  }

  function assert(condition, message) {
    if (!condition) {
      throw new Error('Assertion failed: ' + (message || ''));
    }
  }

  function assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(
        (message ? message + ': ' : '') +
        'Expected ' + formatValue(expected) + ' but got ' + formatValue(actual)
      );
    }
  }

  function assertDeepEqual(actual, expected, message) {
    if (!deepEqual(actual, expected)) {
      throw new Error(
        (message ? message + ': ' : '') +
        'Expected ' + formatValue(expected) + ' but got ' + formatValue(actual)
      );
    }
  }

  function assertThrows(fn, message) {
    let threw = false;
    try { fn(); } catch (e) { threw = true; }
    if (!threw) {
      throw new Error('Expected function to throw: ' + (message || ''));
    }
  }

  function assertApprox(actual, expected, epsilon, message) {
    if (typeof epsilon !== 'number') { epsilon = 0.0001; }
    if (Math.abs(actual - expected) > epsilon) {
      throw new Error(
        (message ? message + ': ' : '') +
        'Expected ~' + expected + ' (±' + epsilon + ') but got ' + actual
      );
    }
  }

  function describe(suiteName, fn) {
    const suite = { name: suiteName, tests: [] };
    suites.push(suite);
    const prevSuite = currentSuite;
    currentSuite = suite;
    fn();
    currentSuite = prevSuite;
  }

  function it(testName, fn) {
    if (!currentSuite) {
      throw new Error('it() must be called inside describe()');
    }
    currentSuite.tests.push({ name: testName, fn: fn });
  }

  function runAll() {
    let totalPass = 0;
    let totalFail = 0;
    const failures = [];

    for (const suite of suites) {
      console.log('\n  ' + suite.name);
      for (const test of suite.tests) {
        try {
          test.fn();
          totalPass++;
          console.log('    ✓ ' + test.name);
        } catch (e) {
          totalFail++;
          console.log('    ✗ ' + test.name);
          console.log('      ' + e.message);
          failures.push(suite.name + ' > ' + test.name + ': ' + e.message);
        }
      }
    }

    console.log('\n  Results: ' + totalPass + ' passed, ' + totalFail + ' failed, ' + (totalPass + totalFail) + ' total\n');

    if (failures.length > 0) {
      console.log('  Failures:');
      for (const f of failures) {
        console.log('    - ' + f);
      }
      console.log('');
    }

    // Clear suites for potential re-runs
    suites.length = 0;

    return { passed: totalPass, failed: totalFail, total: totalPass + totalFail, failures: failures };
  }

  return { assert, assertEqual, assertDeepEqual, assertThrows, assertApprox, describe, it, runAll };
})();

if (typeof module !== 'undefined') module.exports = TestRunner;
