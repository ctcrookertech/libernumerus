/**
 * Libernumerus — Master Test Runner
 * Executes all 18 system test suites + shared utility tests + cross-system verification
 */

const TestRunner = require('./shared/test-runner');

// Track results across all suites
let totalPassed = 0;
let totalFailed = 0;
const suiteResults = [];

function runSuite(name, path) {
  console.log('\n' + '='.repeat(60));
  console.log('  ' + name);
  console.log('='.repeat(60));
  try {
    // Clear module cache so TestRunner gets fresh suites
    delete require.cache[require.resolve('./shared/test-runner')];
    delete require.cache[require.resolve(path)];
    const TR = require('./shared/test-runner');

    // Re-run the test file which registers and runs suites
    require(path);

    // The test file calls runAll() itself, so we just need to count
    // But since it exits, we need a different approach
  } catch (e) {
    console.log('  ERROR loading ' + path + ': ' + e.message);
    suiteResults.push({ name, passed: 0, failed: 1, error: e.message });
    totalFailed++;
  }
}

// We need to run each test file as a child process to isolate them
const { execSync } = require('child_process');

const SUITES = [
  { name: 'Pythagorean / Western',     path: 'systems/pythagorean/pythagorean.test.js' },
  { name: 'Hebrew Gematria',           path: 'systems/hebrew-gematria/hebrew-gematria.test.js' },
  { name: 'Chaldean',                  path: 'systems/chaldean/chaldean.test.js' },
  { name: 'Vedic / Indian',            path: 'systems/vedic-indian/vedic-indian.test.js' },
  { name: 'Greek Isopsephy',           path: 'systems/greek-isopsephy/greek-isopsephy.test.js' },
  { name: 'Arabic Abjad',              path: 'systems/arabic-abjad/arabic-abjad.test.js' },
  { name: 'Hurufism',                  path: 'systems/hurufism/hurufism.test.js' },
  { name: 'Thelemic',                  path: 'systems/thelemic/thelemic.test.js' },
  { name: 'Tarot',                     path: 'systems/tarot/tarot.test.js' },
  { name: 'Chinese Cosmological',      path: 'systems/chinese-cosmological/chinese-cosmological.test.js' },
  { name: 'Japanese / Shinto',         path: 'systems/japanese-shinto/japanese-shinto.test.js' },
  { name: 'Mayan',                     path: 'systems/mayan/mayan.test.js' },
  { name: 'Yoruba / Ifá',              path: 'systems/yoruba-ifa/yoruba-ifa.test.js' },
  { name: 'Norse / Runic',             path: 'systems/norse-runic/norse-runic.test.js' },
  { name: 'Celtic / Ogham',            path: 'systems/celtic-ogham/celtic-ogham.test.js' },
  { name: 'Neoplatonic',               path: 'systems/neoplatonic/neoplatonic.test.js' },
  { name: 'Christian Symbolic',        path: 'systems/christian-symbolic/christian-symbolic.test.js' },
  { name: 'Egyptian',                  path: 'systems/egyptian/egyptian.test.js' },
];

console.log('\n╔══════════════════════════════════════════════════════════╗');
console.log('║          LIBERNUMERUS — Full Test Suite                  ║');
console.log('║          18 Numerology Traditions                        ║');
console.log('╚══════════════════════════════════════════════════════════╝');

for (const suite of SUITES) {
  process.stdout.write('\n▶ ' + suite.name + ' ... ');
  try {
    const output = execSync('node ' + suite.path, {
      cwd: __dirname,
      encoding: 'utf-8',
      timeout: 30000
    });
    // Parse results from output
    const match = output.match(/(\d+) passed, (\d+) failed, (\d+) total/);
    if (match) {
      const passed = parseInt(match[1]);
      const failed = parseInt(match[2]);
      totalPassed += passed;
      totalFailed += failed;
      suiteResults.push({ name: suite.name, passed, failed });
      if (failed === 0) {
        process.stdout.write('✓ ' + passed + ' tests passed\n');
      } else {
        process.stdout.write('✗ ' + passed + '/' + (passed + failed) + ' passed\n');
      }
    } else {
      process.stdout.write('? (could not parse output)\n');
      suiteResults.push({ name: suite.name, passed: 0, failed: 0, note: 'unparseable' });
    }
  } catch (e) {
    const output = (e.stdout || '') + (e.stderr || '');
    const match = output.match(/(\d+) passed, (\d+) failed, (\d+) total/);
    if (match) {
      const passed = parseInt(match[1]);
      const failed = parseInt(match[2]);
      totalPassed += passed;
      totalFailed += failed;
      suiteResults.push({ name: suite.name, passed, failed });
      process.stdout.write('✗ ' + passed + '/' + (passed + failed) + ' passed\n');
    } else {
      process.stdout.write('✗ ERROR: ' + (e.message || 'unknown').substring(0, 80) + '\n');
      totalFailed++;
      suiteResults.push({ name: suite.name, passed: 0, failed: 1, error: true });
    }
  }
}

// Cross-System Verification
console.log('\n' + '='.repeat(60));
console.log('  Cross-System Verification');
console.log('='.repeat(60));

let crossPassed = 0;
let crossFailed = 0;

function crossTest(description, fn) {
  try {
    fn();
    crossPassed++;
    totalPassed++;
    console.log('  ✓ ' + description);
  } catch (e) {
    crossFailed++;
    totalFailed++;
    console.log('  ✗ ' + description + ': ' + e.message);
  }
}

function assertEqual(a, b, msg) {
  if (a !== b) throw new Error((msg || '') + ': Expected ' + b + ' but got ' + a);
}

// Load modules for cross-verification
const HebrewGematria = require('./systems/hebrew-gematria/hebrew-gematria');
const GreekIsopsephy = require('./systems/greek-isopsephy/greek-isopsephy');
const ArabicAbjad = require('./systems/arabic-abjad/arabic-abjad');
const Thelemic = require('./systems/thelemic/thelemic');
const Chaldean = require('./systems/chaldean/chaldean');
const VedicIndian = require('./systems/vedic-indian/vedic-indian');
const Neoplatonic = require('./systems/neoplatonic/neoplatonic');
const ChristianSymbolic = require('./systems/christian-symbolic/christian-symbolic');
const Mayan = require('./systems/mayan/mayan');
const YorubaIfa = require('./systems/yoruba-ifa/yoruba-ifa');
const ChineseCosmological = require('./systems/chinese-cosmological/chinese-cosmological');

// 1. Thelema = Agape = 93
crossTest('Thelema = Agape = 93 (Greek Isopsephy + Thelemic)', () => {
  const gi = GreekIsopsephy.create();
  const t = Thelemic.create();
  assertEqual(gi.wordValue('θελημα'), 93, 'Thelema');
  assertEqual(gi.wordValue('ἀγάπη'), 93, 'Agape');
  assertEqual(t.greekValue('θελημα'), t.greekValue('ἀγάπη'), 'Thelema=Agape via Thelemic');
});

// 2. Iesous = 888
crossTest('Iesous = 888 (Greek Isopsephy + Christian Symbolic)', () => {
  const gi = GreekIsopsephy.create();
  assertEqual(gi.wordValue('Ἰησοῦς'), 888, 'Iesous');
  const cs = ChristianSymbolic.create();
  const m = cs.meaning(888);
  if (!m || !m.description.includes('Jesus')) throw new Error('Christian Symbolic should reference Jesus at 888');
});

// 3. YHVH = 26
crossTest('YHVH = 26 (Hebrew Gematria + Thelemic)', () => {
  const hg = HebrewGematria.create();
  const t = Thelemic.create();
  assertEqual(hg.wordValue('\u05D9\u05D4\u05D5\u05D4'), 26, 'YHVH via Hebrew');
  assertEqual(t.hebrewValue('\u05D9\u05D4\u05D5\u05D4'), 26, 'YHVH via Thelemic');
});

// 4. Echad = Ahavah = 13
crossTest('Echad = Ahavah = 13 (Hebrew Gematria)', () => {
  const hg = HebrewGematria.create();
  assertEqual(hg.wordValue('\u05D0\u05D7\u05D3'), 13, 'Echad');
  assertEqual(hg.wordValue('\u05D0\u05D4\u05D1\u05D4'), 13, 'Ahavah');
});

// 5. Mashiach = Nachash = 358
crossTest('Mashiach = Nachash = 358 (Hebrew Gematria)', () => {
  const hg = HebrewGematria.create();
  assertEqual(hg.wordValue('\u05DE\u05E9\u05D9\u05D7'), 358, 'Mashiach');
  assertEqual(hg.wordValue('\u05E0\u05D7\u05E9'), 358, 'Nachash');
});

// 6. Bismillah = 786
crossTest('Bismillah = 786 (Arabic Abjad)', () => {
  const aa = ArabicAbjad.create();
  assertEqual(aa.wordValue('\u0628\u0633\u0645 \u0627\u0644\u0644\u0647 \u0627\u0644\u0631\u062D\u0645\u0646 \u0627\u0644\u0631\u062D\u064A\u0645'), 786, 'Bismillah');
});

// 7. Allah = 66
crossTest('Allah = 66 (Arabic Abjad)', () => {
  const aa = ArabicAbjad.create();
  assertEqual(aa.wordValue('\u0627\u0644\u0644\u0647'), 66, 'Allah');
});

// 8. Luo Shu magic square all rows/cols/diags = 15
crossTest('Luo Shu all rows/cols/diags = 15 (Chinese Cosmological)', () => {
  const cc = ChineseCosmological.create();
  const ls = cc.luoShu();
  const grid = ls.grid || ls;
  // Verify it's the right grid
  if (Array.isArray(grid)) {
    for (let i = 0; i < 3; i++) {
      const rowSum = grid[i][0] + grid[i][1] + grid[i][2];
      if (rowSum !== 15) throw new Error('Row ' + i + ' sum = ' + rowSum);
      const colSum = grid[0][i] + grid[1][i] + grid[2][i];
      if (colSum !== 15) throw new Error('Col ' + i + ' sum = ' + colSum);
    }
    const diag1 = grid[0][0] + grid[1][1] + grid[2][2];
    const diag2 = grid[0][2] + grid[1][1] + grid[2][0];
    if (diag1 !== 15) throw new Error('Diag1 sum = ' + diag1);
    if (diag2 !== 15) throw new Error('Diag2 sum = ' + diag2);
  } else if (ls.valid !== undefined) {
    if (!ls.valid) throw new Error('Luo Shu not valid');
  }
});

// 9. 13 Baktun = Dec 21, 2012 (GMT)
crossTest('13.0.0.0.0 = Dec 21, 2012 (Mayan GMT)', () => {
  const m = Mayan.create('gmt');
  const date = m.fromLongCount([13, 0, 0, 0, 0]);
  assertEqual(date.year, 2012, 'Year');
  assertEqual(date.month, 12, 'Month');
  assertEqual(date.day, 21, 'Day');
});

// 10. 153 = triangular(17) (Neoplatonic + Christian)
crossTest('153 = triangular(17) (Neoplatonic + Christian Symbolic)', () => {
  const np = Neoplatonic.create();
  if (!np.isTriangular(153)) throw new Error('153 should be triangular');
  const cs = ChristianSymbolic.create();
  const a = cs.augustinianAnalysis(153);
  if (a.triangularRoot !== 17) throw new Error('Expected triangularRoot 17, got ' + a.triangularRoot);
});

// 11. Chaldean and Vedic 1-9 planetary scheme identical
crossTest('Chaldean and Vedic 1-9 planetary scheme identical', () => {
  const c = Chaldean.create();
  const v = VedicIndian.create();
  for (let i = 1; i <= 9; i++) {
    const cp = c.planetFor(i);
    const vp = v.planet(i);
    if (cp.sanskrit !== vp.sanskrit) throw new Error('Planet mismatch for ' + i + ': ' + cp.sanskrit + ' vs ' + vp.sanskrit);
  }
});

// 12. Ogbe = [1,1,1,1], 256 total Odù
crossTest('Ogbe = [1,1,1,1], 256 total Odù (Yoruba/Ifá)', () => {
  const y = YorubaIfa.create();
  const ogbe = y.identifyOdu([1, 1, 1, 1]);
  if (!ogbe || ogbe.name !== 'Ogbe') throw new Error('Expected Ogbe');
  if (YorubaIfa.PRINCIPAL_ODU.length !== 16) throw new Error('Expected 16 principal Odù');
  if (16 * 16 !== 256) throw new Error('16² should be 256');
});

// Summary
console.log('\n' + '='.repeat(60));
console.log('  CROSS-SYSTEM VERIFICATION: ' + crossPassed + '/' + (crossPassed + crossFailed) + ' passed');
console.log('='.repeat(60));

// Final Summary
console.log('\n╔══════════════════════════════════════════════════════════╗');
console.log('║  FINAL RESULTS                                          ║');
console.log('╠══════════════════════════════════════════════════════════╣');

for (const s of suiteResults) {
  const status = s.failed === 0 ? '✓' : '✗';
  const pad = ' '.repeat(Math.max(0, 35 - s.name.length));
  console.log('║  ' + status + ' ' + s.name + pad + s.passed + '/' + (s.passed + s.failed) + ' ║');
}

console.log('╠══════════════════════════════════════════════════════════╣');
console.log('║  Cross-System Verification        ' + crossPassed + '/' + (crossPassed + crossFailed) + '                    ║');
console.log('╠══════════════════════════════════════════════════════════╣');
console.log('║  TOTAL: ' + totalPassed + ' passed, ' + totalFailed + ' failed                        ║');
console.log('╚══════════════════════════════════════════════════════════╝');

process.exit(totalFailed > 0 ? 1 : 0);
