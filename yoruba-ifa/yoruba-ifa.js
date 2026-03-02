/**
 * Libernumerus — Yoruba / Ifá Numerology
 * Odù generation, Ikin/Opele methods, 256 composite figures, Orisha associations
 */
const YorubaIfa = (() => {
  // 16 Principal Odù — binary representation: 1=single mark (|), 2=double mark (||)
  const PRINCIPAL_ODU = [
    { rank: 1,  name: 'Ogbe',       binary: [1,1,1,1], keywords: ['light','clarity','truth'] },
    { rank: 2,  name: 'Oyeku',      binary: [2,2,2,2], keywords: ['darkness','mystery','endings'] },
    { rank: 3,  name: 'Iwori',      binary: [2,1,1,2], keywords: ['reversal','duality','transformation'] },
    { rank: 4,  name: 'Odi',        binary: [1,2,2,1], keywords: ['closure','rebirth','feminine'] },
    { rank: 5,  name: 'Irosun',     binary: [1,1,2,2], keywords: ['vision','prophecy','ancestry'] },
    { rank: 6,  name: 'Owonrin',    binary: [2,2,1,1], keywords: ['change','unpredictability','chaos'] },
    { rank: 7,  name: 'Obara',      binary: [1,2,2,2], keywords: ['abundance','wealth','speech'] },
    { rank: 8,  name: 'Okanran',    binary: [2,2,2,1], keywords: ['conflict','truth','force'] },
    { rank: 9,  name: 'Ogunda',     binary: [1,1,1,2], keywords: ['clearing','war','iron'] },
    { rank: 10, name: 'Osa',        binary: [2,1,1,1], keywords: ['swift change','ancestors','wind'] },
    { rank: 11, name: 'Ika',        binary: [2,1,2,2], keywords: ['caution','power','craft'] },
    { rank: 12, name: 'Oturupon',   binary: [2,2,1,2], keywords: ['illness','healing','earth'] },
    { rank: 13, name: 'Otura',      binary: [1,2,1,1], keywords: ['spirituality','stars','wisdom'] },
    { rank: 14, name: 'Irete',      binary: [1,1,2,1], keywords: ['pressing','attraction','imprint'] },
    { rank: 15, name: 'Ose',        binary: [1,2,1,2], keywords: ['beauty','love','sweetness'] },
    { rank: 16, name: 'Ofun',       binary: [2,1,2,1], keywords: ['purity','beginning','white'] }
  ];

  // Alternate ranking (some lineages)
  const ALTERNATE_RANKING = {
    'Ogbe': 1, 'Oyeku': 2, 'Iwori': 3, 'Odi': 4, 'Irosun': 5,
    'Owonrin': 6, 'Obara': 7, 'Okanran': 8, 'Ogunda': 9, 'Osa': 10,
    'Ika': 11, 'Oturupon': 12, 'Otura': 13, 'Irete': 14, 'Ose': 15, 'Ofun': 16
  };

  // Orisha associations (Yoruba tradition — vary by lineage)
  const ORISHA_YORUBA = {
    'Ogbe':     ['Obatala', 'Orunmila'],
    'Oyeku':    ['Oya', 'Egungun'],
    'Iwori':    ['Oya'],
    'Odi':      ['Yemoja'],
    'Irosun':   ['Orunmila'],
    'Owonrin':  ['Eshu', 'Shango'],
    'Obara':    ['Shango'],
    'Okanran':  ['Shango'],
    'Ogunda':   ['Ogun'],
    'Osa':      ['Oya'],
    'Ika':      ['Ogun'],
    'Oturupon': ['Shango', 'Nana Buruku'],
    'Otura':    ['Orunmila'],
    'Irete':    ['Orunmila', 'Aje'],
    'Ose':      ['Oshun'],
    'Ofun':     ['Obatala', 'Oshala']
  };

  // Lukumi tradition Orisha associations (Cuban Santería)
  const ORISHA_LUKUMI = {
    'Ogbe':     ['Obatala'],
    'Oyeku':    ['Oya', 'Yewa'],
    'Iwori':    ['Oya'],
    'Odi':      ['Yemaya'],
    'Irosun':   ['Orunla'],
    'Owonrin':  ['Elegua', 'Chango'],
    'Obara':    ['Chango'],
    'Okanran':  ['Chango'],
    'Ogunda':   ['Ogun'],
    'Osa':      ['Oya'],
    'Ika':      ['Ogun'],
    'Oturupon': ['Chango', 'Nana Buruku'],
    'Otura':    ['Orunla'],
    'Irete':    ['Orunla'],
    'Ose':      ['Ochun'],
    'Ofun':     ['Obatala']
  };

  // Candomblé tradition
  const ORISHA_CANDOMBLE = {
    'Ogbe':     ['Oxalá'],
    'Oyeku':    ['Iansã', 'Eguns'],
    'Iwori':    ['Iansã'],
    'Odi':      ['Iemanjá'],
    'Irosun':   ['Orunmilá'],
    'Owonrin':  ['Exu', 'Xangô'],
    'Obara':    ['Xangô'],
    'Okanran':  ['Xangô'],
    'Ogunda':   ['Ogum'],
    'Osa':      ['Iansã'],
    'Ika':      ['Ogum'],
    'Oturupon': ['Xangô', 'Nanã'],
    'Otura':    ['Orunmilá'],
    'Irete':    ['Orunmilá'],
    'Ose':      ['Oxum'],
    'Ofun':     ['Oxalá']
  };

  const DEFAULT_CONFIG = {
    castingMethod: 'opele',
    rankingLineage: 'standard',
    tradition: 'yoruba'
  };

  const VARIANTS = {
    yoruba:    { castingMethod: 'opele', rankingLineage: 'standard', tradition: 'yoruba' },
    lukumi:    { castingMethod: 'opele', rankingLineage: 'standard', tradition: 'lukumi' },
    candomble: { castingMethod: 'opele', rankingLineage: 'standard', tradition: 'candomble' }
  };

  function create(config) {
    if (typeof config === 'string' && VARIANTS[config]) {
      config = { ...VARIANTS[config] };
    }
    const cfg = { ...DEFAULT_CONFIG, ...(config || {}) };

    function getOrishaMap() {
      switch (cfg.tradition) {
        case 'lukumi': return ORISHA_LUKUMI;
        case 'candomble': return ORISHA_CANDOMBLE;
        default: return ORISHA_YORUBA;
      }
    }

    // Identify an Odù from its binary marks
    function identifyOdu(marks) {
      for (const odu of PRINCIPAL_ODU) {
        if (marks.length === odu.binary.length &&
            marks.every((v, i) => v === odu.binary[i])) {
          return { ...odu };
        }
      }
      return null;
    }

    // Get composite Odù from two principal figures
    function compositeOdu(name1, name2) {
      const odu1 = PRINCIPAL_ODU.find(o => o.name === name1);
      const odu2 = PRINCIPAL_ODU.find(o => o.name === name2);
      if (!odu1 || !odu2) return null;

      // If both are the same, it's the principal Odù itself
      if (name1 === name2) {
        return { right: odu1, left: odu2, name: name1, isOmo: false };
      }

      return {
        right: odu1,
        left: odu2,
        name: name1 + '-' + name2,
        isOmo: true
      };
    }

    // Get ranking of an Odù
    function rank(name) {
      const odu = PRINCIPAL_ODU.find(o => o.name === name);
      if (!odu) return null;
      if (cfg.rankingLineage === 'alternate') {
        return ALTERNATE_RANKING[name] || odu.rank;
      }
      return odu.rank;
    }

    // Get Orisha for an Odù
    function orishaFor(name) {
      const map = getOrishaMap();
      return map[name] || [];
    }

    // Simulate palm nut (Ikin) casting — produces one mark (1 or 2)
    function ikinCast() {
      // 16 palm nuts, grab with right hand
      // If 1 remains → double mark (||, value 2)
      // If 2 remain → single mark (|, value 1)
      // Other results → recast
      const remaining = Math.random() < 0.5 ? 1 : 2;
      return remaining === 1 ? 2 : 1;
    }

    // Simulate Ikin method — 4 marks for a half-figure
    function ikinHalf() {
      return [ikinCast(), ikinCast(), ikinCast(), ikinCast()];
    }

    // Simulate Opele (divining chain) — 8 marks in one cast
    function opeleCast() {
      const marks = [];
      for (let i = 0; i < 8; i++) {
        marks.push(Math.random() < 0.5 ? 1 : 2);
      }
      return marks;
    }

    // Generate a full reading
    function cast() {
      if (cfg.castingMethod === 'ikin') {
        const right = ikinHalf();
        const left = ikinHalf();
        const rightOdu = identifyOdu(right);
        const leftOdu = identifyOdu(left);
        return {
          method: 'ikin',
          right: { marks: right, odu: rightOdu },
          left: { marks: left, odu: leftOdu },
          composite: rightOdu && leftOdu ? compositeOdu(rightOdu.name, leftOdu.name) : null
        };
      }

      if (cfg.castingMethod === 'opele') {
        const marks = opeleCast();
        const right = marks.slice(0, 4);
        const left = marks.slice(4, 8);
        const rightOdu = identifyOdu(right);
        const leftOdu = identifyOdu(left);
        return {
          method: 'opele',
          right: { marks: right, odu: rightOdu },
          left: { marks: left, odu: leftOdu },
          composite: rightOdu && leftOdu ? compositeOdu(rightOdu.name, leftOdu.name) : null
        };
      }

      // Manual input
      return null;
    }

    function numberMeaning(n) {
      if (n >= 1 && n <= 16) {
        const odu = PRINCIPAL_ODU.find(o => o.rank === n);
        if (odu) return { odu: odu.name, keywords: odu.keywords };
      }
      if (n === 256) return { description: 'Total composite Odù space: 16² = 256' };
      return null;
    }

    function analyze(input) {
      if (Array.isArray(input) && input.length === 4) {
        const odu = identifyOdu(input);
        if (odu) {
          return {
            odu: odu,
            rank: rank(odu.name),
            orisha: orishaFor(odu.name)
          };
        }
      }
      if (typeof input === 'string') {
        const odu = PRINCIPAL_ODU.find(o => o.name.toLowerCase() === input.toLowerCase());
        if (odu) {
          return {
            odu: odu,
            rank: rank(odu.name),
            orisha: orishaFor(odu.name)
          };
        }
      }
      return null;
    }

    return {
      identifyOdu,
      compositeOdu,
      rank,
      orishaFor,
      cast,
      numberMeaning,
      analyze
    };
  }

  return { create, DEFAULT_CONFIG, VARIANTS, PRINCIPAL_ODU };
})();

if (typeof module !== 'undefined') module.exports = YorubaIfa;
