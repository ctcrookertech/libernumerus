/**
 * Libernumerus — Celtic Ogham
 * 20 Ogham letters (4 aicme x 5), forfeda, Graves' tree calendar,
 * name analysis, divination draws, triad lookup
 */
const CelticOgham = (() => {
  // 20 core Ogham letters — 4 aicme of 5 letters each
  // Unicode Ogham block U+1681–U+1694
  // Tree associations from the Book of Ballymote (14th century)
  const OGHAM_LETTERS = [
    // Aicme 1 (Aicme Beithe)
    { character: '\u1681', name: 'Beith',    tree: 'Birch',      aicme: 1, posInAicme: 1, overall: 1  },
    { character: '\u1682', name: 'Luis',     tree: 'Rowan',      aicme: 1, posInAicme: 2, overall: 2  },
    { character: '\u1683', name: 'Fearn',    tree: 'Alder',      aicme: 1, posInAicme: 3, overall: 3  },
    { character: '\u1684', name: 'Sail',     tree: 'Willow',     aicme: 1, posInAicme: 4, overall: 4  },
    { character: '\u1685', name: 'Nion',     tree: 'Ash',        aicme: 1, posInAicme: 5, overall: 5  },
    // Aicme 2 (Aicme hÚatha)
    { character: '\u1686', name: 'Huath',    tree: 'Hawthorn',   aicme: 2, posInAicme: 1, overall: 6  },
    { character: '\u1687', name: 'Duir',     tree: 'Oak',        aicme: 2, posInAicme: 2, overall: 7  },
    { character: '\u1688', name: 'Tinne',    tree: 'Holly',      aicme: 2, posInAicme: 3, overall: 8  },
    { character: '\u1689', name: 'Coll',     tree: 'Hazel',      aicme: 2, posInAicme: 4, overall: 9  },
    { character: '\u168A', name: 'Quert',    tree: 'Apple',      aicme: 2, posInAicme: 5, overall: 10 },
    // Aicme 3 (Aicme Muine)
    { character: '\u168B', name: 'Muin',     tree: 'Vine',       aicme: 3, posInAicme: 1, overall: 11 },
    { character: '\u168C', name: 'Gort',     tree: 'Ivy',        aicme: 3, posInAicme: 2, overall: 12 },
    { character: '\u168D', name: 'nGéadal',  tree: 'Reed',       aicme: 3, posInAicme: 3, overall: 13 },
    { character: '\u168E', name: 'Straif',   tree: 'Blackthorn', aicme: 3, posInAicme: 4, overall: 14 },
    { character: '\u168F', name: 'Ruis',     tree: 'Elder',      aicme: 3, posInAicme: 5, overall: 15 },
    // Aicme 4 (Aicme Ailme)
    { character: '\u1690', name: 'Ailm',     tree: 'Pine/Fir',   aicme: 4, posInAicme: 1, overall: 16 },
    { character: '\u1691', name: 'Onn',      tree: 'Gorse',      aicme: 4, posInAicme: 2, overall: 17 },
    { character: '\u1692', name: 'Ur',       tree: 'Heather',    aicme: 4, posInAicme: 3, overall: 18 },
    { character: '\u1693', name: 'Eadhadh',  tree: 'Aspen',      aicme: 4, posInAicme: 4, overall: 19 },
    { character: '\u1694', name: 'Iodhadh',  tree: 'Yew',        aicme: 4, posInAicme: 5, overall: 20 }
  ];

  // 5 Forfeda — supplementary letters (later medieval additions)
  const FORFEDA = [
    { character: '\u1695', name: 'Éabhadh',  tree: 'Aspen/Grove',    overall: 21 },
    { character: '\u1696', name: 'Ór',       tree: 'Spindle',        overall: 22 },
    { character: '\u1697', name: 'Uilleann', tree: 'Honeysuckle',    overall: 23 },
    { character: '\u1698', name: 'Ifín',     tree: 'Gooseberry',     overall: 24 },
    { character: '\u1699', name: 'Eamhancholl', tree: 'Witch Hazel', overall: 25 }
  ];

  // Graves' 13-month tree calendar (The White Goddess, 1948)
  // NOTE: This is a modern literary construction, NOT attested in medieval sources.
  const GRAVES_CALENDAR = [
    { month: 1,  tree: 'Birch',      oghamName: 'Beith',    start: 'Dec 24',  end: 'Jan 20'  },
    { month: 2,  tree: 'Rowan',      oghamName: 'Luis',     start: 'Jan 21',  end: 'Feb 17'  },
    { month: 3,  tree: 'Ash',        oghamName: 'Nion',     start: 'Feb 18',  end: 'Mar 17'  },
    { month: 4,  tree: 'Alder',      oghamName: 'Fearn',    start: 'Mar 18',  end: 'Apr 14'  },
    { month: 5,  tree: 'Willow',     oghamName: 'Sail',     start: 'Apr 15',  end: 'May 12'  },
    { month: 6,  tree: 'Hawthorn',   oghamName: 'Huath',    start: 'May 13',  end: 'Jun 9'   },
    { month: 7,  tree: 'Oak',        oghamName: 'Duir',     start: 'Jun 10',  end: 'Jul 7'   },
    { month: 8,  tree: 'Holly',      oghamName: 'Tinne',    start: 'Jul 8',   end: 'Aug 4'   },
    { month: 9,  tree: 'Hazel',      oghamName: 'Coll',     start: 'Aug 5',   end: 'Sep 1'   },
    { month: 10, tree: 'Vine',       oghamName: 'Muin',     start: 'Sep 2',   end: 'Sep 29'  },
    { month: 11, tree: 'Ivy',        oghamName: 'Gort',     start: 'Sep 30',  end: 'Oct 27'  },
    { month: 12, tree: 'Reed',       oghamName: 'nGéadal',  start: 'Oct 28',  end: 'Nov 24'  },
    { month: 13, tree: 'Elder',      oghamName: 'Ruis',     start: 'Nov 25',  end: 'Dec 22'  }
  ];

  // Graves' additional tree associations (differ from Ballymote in some cases)
  const GRAVES_TREE_ASSOCIATIONS = {
    'Beith':    'Birch',
    'Luis':     'Rowan',
    'Nion':     'Ash',
    'Fearn':    'Alder',
    'Sail':     'Willow',
    'Huath':    'Hawthorn',
    'Duir':     'Oak',
    'Tinne':    'Holly',
    'Coll':     'Hazel',
    'Quert':    'Apple',
    'Muin':     'Vine',
    'Gort':     'Ivy',
    'nGéadal':  'Reed',
    'Straif':   'Blackthorn',
    'Ruis':     'Elder',
    'Ailm':     'Silver Fir',
    'Onn':      'Gorse',
    'Ur':       'Heather',
    'Eadhadh':  'White Poplar',
    'Iodhadh':  'Yew'
  };

  // Latin letter to Ogham name mapping for transliteration
  const LATIN_TO_OGHAM = {
    'B': 'Beith',
    'L': 'Luis',
    'F': 'Fearn',
    'S': 'Sail',
    'N': 'Nion',
    'H': 'Huath',
    'D': 'Duir',
    'T': 'Tinne',
    'C': 'Coll',
    'Q': 'Quert',
    'M': 'Muin',
    'G': 'Gort',
    'Z': 'nGéadal',
    'R': 'Ruis',
    'A': 'Ailm',
    'O': 'Onn',
    'U': 'Ur',
    'E': 'Eadhadh',
    'I': 'Iodhadh',
    // Additional mappings for common Latin letters not directly in Ogham
    'P': 'Beith',    // P → B (no native P in Old Irish)
    'W': 'Ur',       // W → U approximation
    'V': 'Fearn',    // V → F (lenited B/F)
    'X': 'Coll',     // X → C+S approximation
    'Y': 'Iodhadh',  // Y → I
    'J': 'Iodhadh',  // J → I
    'K': 'Coll'      // K → C
  };

  // Irish triadic sayings (Trecheng Breth Féne and other sources)
  const TRIADS = {
    3:  { irish: 'Trí ní nach tualaing athchur: briathar ríg, cloch a tailm, saigid a sreing.',
          english: 'Three things that cannot be taken back: the word of a king, a stone from a sling, an arrow from a bowstring.' },
    5:  { irish: 'Cóic doruis éicse: fis i n-écius, imbas i n-immasas, teinm laíde, dichetal di chennaib, dúas lánfhiled.',
          english: 'Five paths of poetry: knowledge through study, illumination through meditation, cracking open of verse, chanting from heads, the reward of a full poet.' },
    7:  { irish: 'Secht mbuada búanmesraigthe: búaid cruth, búaid gotho, búaid n-enig, búaid n-ergna, búaid gaíse, búaid gaisced, búaid sochraid.',
          english: 'Seven gifts of enduring temperance: beauty of form, beauty of voice, beauty of honour, beauty of wisdom, beauty of valour, beauty of arms, beauty of a host.' },
    9:  { irish: 'Noí n-ingena Flainn Fhina: Bé Find, Bé Chuille, Dían Cécht, Crédne, Goibniu, Luchta, Cairpre, Mac Cécht, Mac Gréine.',
          english: 'Nine elements of wisdom in the Irish tradition: the illumination of thought, the clarity of speech, the harmony of nature, the strength of intention, the patience of craft, the fire of inspiration, the depth of memory, the breadth of learning, the height of vision.' },
    12: { irish: 'Dá mí dhéag na bliana: dá ráithe is tríú ráithe is ceathrú ráithe.',
          english: 'Twelve months of the year: the four seasons turn as the wheel of the sky turns.' },
    13: { irish: 'Trí déag míosa na coille: gach crann lena ré féin.',
          english: 'Thirteen months of the grove: each tree with its own season. (Graves\' modern construction)' },
    17: { irish: 'Seacht ndéag fidh na craobh: is iad litreacha na coille iad.',
          english: 'Seventeen letters of the branch: they are the letters of the forest.' },
    20: { irish: 'Fiche fidh an oghaim: ceithre aicmí cúig fidh.',
          english: 'Twenty letters of the Ogham: four aicme of five letters.' }
  };

  const DEFAULT_CONFIG = {
    includeGraves: false,
    forfeda: false,
    treeAssociations: 'ballymote'
  };

  const PRESETS = {
    historical: {
      includeGraves: false,
      forfeda: false,
      treeAssociations: 'ballymote'
    },
    neopagan: {
      includeGraves: true,
      forfeda: true,
      treeAssociations: 'graves'
    },
    scholarly: {
      includeGraves: false,
      forfeda: true,
      treeAssociations: 'both'
    }
  };

  function create(config) {
    if (typeof config === 'string' && PRESETS[config]) {
      config = { ...PRESETS[config] };
    }
    const cfg = { ...DEFAULT_CONFIG, ...(config || {}) };

    /**
     * Get the active letter set based on configuration.
     */
    function getLetters() {
      let letters = OGHAM_LETTERS.map(l => ({ ...l }));

      // Augment tree associations based on config
      if (cfg.treeAssociations === 'graves') {
        letters = letters.map(l => {
          const gravesTree = GRAVES_TREE_ASSOCIATIONS[l.name];
          return { ...l, tree: gravesTree || l.tree };
        });
      } else if (cfg.treeAssociations === 'both') {
        letters = letters.map(l => {
          const gravesTree = GRAVES_TREE_ASSOCIATIONS[l.name];
          const result = { ...l, treeBallymote: l.tree };
          if (gravesTree && gravesTree !== l.tree) {
            result.treeGraves = gravesTree;
          }
          return result;
        });
      }

      if (cfg.forfeda) {
        const forfedaCopy = FORFEDA.map(f => ({ ...f }));
        letters = letters.concat(forfedaCopy);
      }

      return letters;
    }

    /**
     * Look up a letter by name. Returns position info and tree association.
     */
    function letterPosition(name) {
      const letter = OGHAM_LETTERS.find(
        l => l.name.toLowerCase() === name.toLowerCase()
      );
      if (!letter) {
        // Check forfeda if enabled
        if (cfg.forfeda) {
          const ff = FORFEDA.find(
            f => f.name.toLowerCase() === name.toLowerCase()
          );
          if (ff) {
            return { name: ff.name, character: ff.character, tree: ff.tree, overall: ff.overall, isForfeda: true };
          }
        }
        return null;
      }

      const result = {
        aicme: letter.aicme,
        posInAicme: letter.posInAicme,
        overall: letter.overall,
        tree: letter.tree,
        character: letter.character,
        name: letter.name
      };

      // Override tree if using Graves associations
      if (cfg.treeAssociations === 'graves') {
        const gravesTree = GRAVES_TREE_ASSOCIATIONS[letter.name];
        if (gravesTree) result.tree = gravesTree;
      } else if (cfg.treeAssociations === 'both') {
        result.treeBallymote = letter.tree;
        const gravesTree = GRAVES_TREE_ASSOCIATIONS[letter.name];
        if (gravesTree && gravesTree !== letter.tree) {
          result.treeGraves = gravesTree;
        }
      }

      return result;
    }

    /**
     * Get Graves' 13-month tree calendar.
     * Returns null with a warning if includeGraves is false.
     */
    function gravesCalendar() {
      if (!cfg.includeGraves) {
        return {
          warning: 'Graves\' tree calendar is disabled. Set includeGraves:true to access.',
          data: null
        };
      }
      return {
        warning: 'Graves\' tree calendar (1948) is a modern literary construction by Robert Graves, not attested in medieval Irish sources.',
        data: GRAVES_CALENDAR.map(m => ({ ...m }))
      };
    }

    /**
     * Transliterate a Latin name to Ogham and compute a positional sum.
     */
    function nameAnalysis(name) {
      if (typeof name !== 'string' || name.length === 0) return null;

      const upper = name.toUpperCase();
      const letters = [];
      let sum = 0;

      for (let i = 0; i < upper.length; i++) {
        const ch = upper[i];
        const oghamName = LATIN_TO_OGHAM[ch];
        if (oghamName) {
          const letter = OGHAM_LETTERS.find(l => l.name === oghamName);
          if (letter) {
            letters.push({
              latin: ch,
              oghamName: letter.name,
              oghamChar: letter.character,
              value: letter.overall
            });
            sum += letter.overall;
          }
        }
        // Skip characters not mappable (spaces, punctuation, etc.)
      }

      return {
        input: name,
        transliteration: letters,
        oghamString: letters.map(l => l.oghamChar).join(''),
        sum: sum,
        letterCount: letters.length
      };
    }

    /**
     * Divination draw — pull one or more fid (Ogham staves).
     */
    function divinationDraw(count) {
      count = count || 1;
      const pool = getLetters();
      const drawn = [];

      // Draw without replacement
      const available = pool.slice();
      const drawCount = Math.min(count, available.length);

      for (let i = 0; i < drawCount; i++) {
        const idx = Math.floor(Math.random() * available.length);
        drawn.push({ ...available[idx] });
        available.splice(idx, 1);
      }

      return {
        count: drawn.length,
        feda: drawn
      };
    }

    /**
     * Look up an Irish triadic saying by number.
     */
    function triad(n) {
      if (typeof n !== 'number') return null;
      const entry = TRIADS[n];
      if (!entry) return null;
      return {
        number: n,
        irish: entry.irish,
        english: entry.english
      };
    }

    /**
     * Get all available triad numbers.
     */
    function triadNumbers() {
      return Object.keys(TRIADS).map(Number).sort((a, b) => a - b);
    }

    /**
     * Return the current configuration.
     */
    function getConfig() {
      return { ...cfg };
    }

    return {
      getLetters,
      letterPosition,
      gravesCalendar,
      nameAnalysis,
      divinationDraw,
      triad,
      triadNumbers,
      getConfig
    };
  }

  return {
    create,
    DEFAULT_CONFIG,
    PRESETS,
    OGHAM_LETTERS,
    FORFEDA,
    GRAVES_CALENDAR,
    TRIADS
  };
})();

if (typeof module !== 'undefined') module.exports = CelticOgham;
