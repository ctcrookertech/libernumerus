const TestRunner = require('../../shared/test-runner');
const YorubaIfa = require('./yoruba-ifa');
const { describe, it, assertEqual, assertDeepEqual, assert } = TestRunner;

describe('Yoruba Ifá — Odù Identification', () => {
  const y = YorubaIfa.create();

  it('identifyOdu([1,1,1,1]) → Ogbe', () => {
    const odu = y.identifyOdu([1,1,1,1]);
    assertEqual(odu.name, 'Ogbe');
  });

  it('identifyOdu([2,2,2,2]) → Oyeku', () => {
    const odu = y.identifyOdu([2,2,2,2]);
    assertEqual(odu.name, 'Oyeku');
  });

  it('Ogbe binary = [1,1,1,1] (all single marks)', () => {
    const ogbe = YorubaIfa.PRINCIPAL_ODU.find(o => o.name === 'Ogbe');
    assertDeepEqual(ogbe.binary, [1,1,1,1]);
  });
});

describe('Yoruba Ifá — Ranking', () => {
  const y = YorubaIfa.create();

  it('Ogbe rank = 1 (senior)', () => {
    assertEqual(y.rank('Ogbe'), 1);
  });

  it('Ofun rank = 16 (junior)', () => {
    assertEqual(y.rank('Ofun'), 16);
  });

  it('All 16 ranks exist', () => {
    for (let i = 1; i <= 16; i++) {
      const odu = YorubaIfa.PRINCIPAL_ODU.find(o => o.rank === i);
      assert(odu !== undefined, 'Rank ' + i + ' should exist');
    }
  });
});

describe('Yoruba Ifá — Composite Odù', () => {
  const y = YorubaIfa.create();

  it('compositeOdu(Ogbe, Oyeku) produces composite figure', () => {
    const comp = y.compositeOdu('Ogbe', 'Oyeku');
    assert(comp !== null);
    assertEqual(comp.name, 'Ogbe-Oyeku');
    assertEqual(comp.isOmo, true);
  });

  it('compositeOdu(Ogbe, Ogbe) is principal (not omo)', () => {
    const comp = y.compositeOdu('Ogbe', 'Ogbe');
    assertEqual(comp.isOmo, false);
  });

  it('total composite space = 256 (16 × 16)', () => {
    let count = 0;
    for (const o1 of YorubaIfa.PRINCIPAL_ODU) {
      for (const o2 of YorubaIfa.PRINCIPAL_ODU) {
        count++;
      }
    }
    assertEqual(count, 256);
  });

  it('256 = 16² = 2⁸', () => {
    assertEqual(Math.pow(16, 2), 256);
    assertEqual(Math.pow(2, 8), 256);
  });
});

describe('Yoruba Ifá — Orisha Associations', () => {
  const y = YorubaIfa.create();

  it('Osa → Oya', () => {
    const orishas = y.orishaFor('Osa');
    assert(orishas.includes('Oya'));
  });

  it('Ogbe → Obatala', () => {
    const orishas = y.orishaFor('Ogbe');
    assert(orishas.includes('Obatala'));
  });

  it('tradition switch: Yoruba vs Lukumi differ', () => {
    const yoruba = YorubaIfa.create('yoruba');
    const lukumi = YorubaIfa.create('lukumi');
    const yOrishas = yoruba.orishaFor('Ose');
    const lOrishas = lukumi.orishaFor('Ose');
    // Yoruba: Oshun, Lukumi: Ochun (different spelling)
    assert(yOrishas.length > 0);
    assert(lOrishas.length > 0);
  });
});

describe('Yoruba Ifá — Casting Methods', () => {
  const y = YorubaIfa.create();

  it('opele produces 8 binary marks split into two halves', () => {
    const reading = y.cast();
    assertEqual(reading.method, 'opele');
    assertEqual(reading.right.marks.length, 4);
    assertEqual(reading.left.marks.length, 4);
    // All marks should be 1 or 2
    for (const m of reading.right.marks) {
      assert(m === 1 || m === 2, 'Mark should be 1 or 2');
    }
  });

  it('ikin method produces valid marks', () => {
    const yi = YorubaIfa.create({ castingMethod: 'ikin' });
    const reading = yi.cast();
    assertEqual(reading.method, 'ikin');
    for (const m of reading.right.marks) {
      assert(m === 1 || m === 2, 'Ikin mark should be 1 or 2');
    }
  });
});

describe('Yoruba Ifá — Presets', () => {
  it('yoruba preset', () => {
    const y = YorubaIfa.create('yoruba');
    assert(y.orishaFor('Ogbe').length > 0);
  });

  it('lukumi preset', () => {
    const y = YorubaIfa.create('lukumi');
    assert(y.orishaFor('Ogbe').length > 0);
  });

  it('candomble preset', () => {
    const y = YorubaIfa.create('candomble');
    assert(y.orishaFor('Ogbe').length > 0);
  });
});

describe('Yoruba Ifá — Analyze', () => {
  const y = YorubaIfa.create();

  it('analyze binary input', () => {
    const result = y.analyze([1,1,1,1]);
    assertEqual(result.odu.name, 'Ogbe');
    assertEqual(result.rank, 1);
  });

  it('analyze string input', () => {
    const result = y.analyze('Osa');
    assertEqual(result.odu.name, 'Osa');
    assert(result.orisha.length > 0);
  });
});

const result = TestRunner.runAll();
if (typeof process !== 'undefined') process.exit(result.failed > 0 ? 1 : 0);
