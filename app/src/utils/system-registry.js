/**
 * System Registry — wraps all 18 numerology modules with unified metadata and routing.
 */

import Pythagorean from '@systems/pythagorean/pythagorean.js'
import HebrewGematria from '@systems/hebrew-gematria/hebrew-gematria.js'
import Chaldean from '@systems/chaldean/chaldean.js'
import VedicIndian from '@systems/vedic-indian/vedic-indian.js'
import GreekIsopsephy from '@systems/greek-isopsephy/greek-isopsephy.js'
import ArabicAbjad from '@systems/arabic-abjad/arabic-abjad.js'
import Hurufism from '@systems/hurufism/hurufism.js'
import Thelemic from '@systems/thelemic/thelemic.js'
import Tarot from '@systems/tarot/tarot.js'
import ChineseCosmological from '@systems/chinese-cosmological/chinese-cosmological.js'
import JapaneseShinto from '@systems/japanese-shinto/japanese-shinto.js'
import Mayan from '@systems/mayan/mayan.js'
import YorubaIfa from '@systems/yoruba-ifa/yoruba-ifa.js'
import NorseRunic from '@systems/norse-runic/norse-runic.js'
import CelticOgham from '@systems/celtic-ogham/celtic-ogham.js'
import Neoplatonic from '@systems/neoplatonic/neoplatonic.js'
import ChristianSymbolic from '@systems/christian-symbolic/christian-symbolic.js'
import Egyptian from '@systems/egyptian/egyptian.js'

export const SYSTEM_COLORS = {
  pythagorean: '#2563EB',
  'hebrew-gematria': '#7C3AED',
  chaldean: '#D97706',
  'vedic-indian': '#CA8A04',
  'greek-isopsephy': '#EA580C',
  'arabic-abjad': '#0891B2',
  hurufism: '#0D9488',
  thelemic: '#9333EA',
  tarot: '#8B5CF6',
  'chinese-cosmological': '#E11D48',
  'japanese-shinto': '#F43F5E',
  mayan: '#65A30D',
  'yoruba-ifa': '#059669',
  'norse-runic': '#6366F1',
  'celtic-ogham': '#16A34A',
  neoplatonic: '#6366F1',
  'christian-symbolic': '#DC2626',
  egyptian: '#B45309',
}

export const REGIONS = {
  western: { label: 'Western', icon: '◇' },
  abrahamic: { label: 'Abrahamic', icon: '✡' },
  eastern: { label: 'Eastern', icon: '☯' },
  african: { label: 'African', icon: '◈' },
  celtic_norse: { label: 'Celtic & Norse', icon: '᚛' },
  classical: { label: 'Classical', icon: '△' },
}

const SYSTEM_DEFS = [
  {
    id: 'pythagorean',
    name: 'Pythagorean',
    subtitle: 'Western Numerology',
    era: '6th c. BCE → modern',
    region: 'western',
    module: Pythagorean,
    inputTypes: ['name', 'date', 'number'],
    hasDivination: false,
    description: 'Life Path, Expression, Soul Urge, Personality. Master Numbers and Karmic Debt.',
  },
  {
    id: 'hebrew-gematria',
    name: 'Hebrew Gematria',
    subtitle: 'Kabbalah',
    era: '~2nd c. BCE onward',
    region: 'abrahamic',
    module: HebrewGematria,
    inputTypes: ['name', 'number'],
    hasDivination: false,
    description: 'Standard, Katan, Gadol, Kolel, Ordinal, AIQ BKR methods. Sefirot and Tree of Life.',
  },
  {
    id: 'chaldean',
    name: 'Chaldean',
    subtitle: 'Babylonian',
    era: '~4000–500 BCE',
    region: 'western',
    module: Chaldean,
    inputTypes: ['name', 'date', 'number'],
    hasDivination: false,
    description: 'Non-sequential letter mapping, compound numbers 10–52, planetary attributions.',
  },
  {
    id: 'vedic-indian',
    name: 'Vedic Indian',
    subtitle: 'Jyotish Numerology',
    era: '~1500 BCE onward',
    region: 'eastern',
    module: VedicIndian,
    inputTypes: ['name', 'date', 'number'],
    hasDivination: false,
    description: 'Psychic, Destiny, and Name Numbers. Navagraha planets, Katapayadi cipher.',
  },
  {
    id: 'greek-isopsephy',
    name: 'Greek Isopsephy',
    subtitle: 'Hellenistic',
    era: '~5th c. BCE onward',
    region: 'classical',
    module: GreekIsopsephy,
    inputTypes: ['name', 'number'],
    hasDivination: false,
    description: 'Classical letter values, archaic numerals (Digamma, Qoppa, Sampi), optional reduction.',
  },
  {
    id: 'arabic-abjad',
    name: 'Arabic Abjad',
    subtitle: 'Ilm al-Huruf',
    era: '~7th c. CE onward',
    region: 'abrahamic',
    module: ArabicAbjad,
    inputTypes: ['name', 'number'],
    hasDivination: false,
    description: 'Abjad values, Hisab al-Saghir, chronograms, elemental and planetary attributions.',
  },
  {
    id: 'hurufism',
    name: 'Hurufism',
    subtitle: 'Sufi Letter Mysticism',
    era: '14th c. CE onward',
    region: 'abrahamic',
    module: Hurufism,
    inputTypes: ['name', 'number'],
    hasDivination: false,
    description: 'Extends Arabic Abjad — facial lines, prophetic cycles, teeth map, body correspondences.',
  },
  {
    id: 'thelemic',
    name: 'Thelemic',
    subtitle: 'English Qabalah',
    era: 'Early 20th c.',
    region: 'western',
    module: Thelemic,
    inputTypes: ['name', 'number'],
    hasDivination: false,
    description: 'ALW/NAEQ ciphers, Tree of Life, 93 Current, Temurah permutations.',
  },
  {
    id: 'tarot',
    name: 'Tarot',
    subtitle: 'Major & Minor Arcana',
    era: '15th c. CE onward',
    region: 'western',
    module: Tarot,
    inputTypes: ['date', 'number'],
    hasDivination: true,
    description: 'Birth Cards, Year Cards, Daily Cards. Waite, Crowley, Marseille, Golden Dawn traditions.',
  },
  {
    id: 'chinese-cosmological',
    name: 'Chinese Cosmological',
    subtitle: 'Phonetic & I Ching',
    era: '~3000 BCE onward',
    region: 'eastern',
    module: ChineseCosmological,
    inputTypes: ['name', 'number'],
    hasDivination: true,
    description: 'Phonetic homophony, Wuxing, Luo Shu, I Ching (64 hexagrams).',
  },
  {
    id: 'japanese-shinto',
    name: 'Japanese Shinto',
    subtitle: 'Seimei Handan',
    era: 'Traditional → modern',
    region: 'eastern',
    module: JapaneseShinto,
    inputTypes: ['name', 'date', 'number'],
    hasDivination: false,
    description: 'Name stroke analysis (Seimei Handan), Rokuyō calendar, gift amount evaluation.',
  },
  {
    id: 'mayan',
    name: 'Mayan',
    subtitle: 'Mesoamerican Calendar',
    era: '~2000 BCE – 16th c.',
    region: 'western',
    module: Mayan,
    inputTypes: ['date', 'number'],
    hasDivination: false,
    description: 'Vigesimal system, Tzolkin, Haab, Long Count, Calendar Round.',
  },
  {
    id: 'yoruba-ifa',
    name: 'Yoruba Ifá',
    subtitle: '256 Odù',
    era: 'Ancient → present',
    region: 'african',
    module: YorubaIfa,
    inputTypes: ['number'],
    hasDivination: true,
    description: '256 Odù, Ikin/Opele casting, Orisha associations. UNESCO heritage.',
  },
  {
    id: 'norse-runic',
    name: 'Norse Runic',
    subtitle: 'Elder Futhark',
    era: '~2nd c. CE onward',
    region: 'celtic_norse',
    module: NorseRunic,
    inputTypes: ['name', 'number'],
    hasDivination: true,
    description: 'Elder/Younger Futhark, ættir system, ætt cipher, rune drawing.',
  },
  {
    id: 'celtic-ogham',
    name: 'Celtic Ogham',
    subtitle: 'Tree Alphabet',
    era: '~4th c. CE onward',
    region: 'celtic_norse',
    module: CelticOgham,
    inputTypes: ['name'],
    hasDivination: true,
    description: '20+5 letters, 4 aicme, tree associations, Graves calendar, stave drawing.',
  },
  {
    id: 'neoplatonic',
    name: 'Neoplatonic',
    subtitle: 'Iamblichus & the Decad',
    era: '3rd–6th c. CE',
    region: 'classical',
    module: Neoplatonic,
    inputTypes: ['number'],
    hasDivination: false,
    description: 'Decad principles, mathematical properties, Tetractys, ratio analysis.',
  },
  {
    id: 'christian-symbolic',
    name: 'Christian Symbolic',
    subtitle: 'Biblical Numerology',
    era: '1st c. CE onward',
    region: 'abrahamic',
    module: ChristianSymbolic,
    inputTypes: ['name', 'number'],
    hasDivination: false,
    description: 'Biblical numbers, Augustinian factorization, typological pairs.',
  },
  {
    id: 'egyptian',
    name: 'Egyptian',
    subtitle: 'Hieroglyphic Numerals',
    era: '~3100–30 BCE',
    region: 'classical',
    module: Egyptian,
    inputTypes: ['number'],
    hasDivination: false,
    description: 'Hieroglyphic numerals, decans, ritual repetition, mythological meaning.',
  },
]

// Input compatibility matrix
const INPUT_COMPATIBILITY = {
  name: [
    'pythagorean', 'hebrew-gematria', 'chaldean', 'vedic-indian',
    'greek-isopsephy', 'arabic-abjad', 'hurufism', 'thelemic',
    'norse-runic', 'celtic-ogham', 'japanese-shinto', 'chinese-cosmological',
    'christian-symbolic',
  ],
  date: [
    'pythagorean', 'chaldean', 'vedic-indian', 'mayan',
    'tarot', 'japanese-shinto', 'chinese-cosmological',
  ],
  number: [
    'pythagorean', 'hebrew-gematria', 'chaldean', 'vedic-indian',
    'greek-isopsephy', 'arabic-abjad', 'hurufism', 'thelemic',
    'tarot', 'chinese-cosmological', 'japanese-shinto', 'mayan',
    'yoruba-ifa', 'norse-runic', 'celtic-ogham', 'neoplatonic',
    'christian-symbolic', 'egyptian',
  ],
  divine: [
    'norse-runic', 'celtic-ogham', 'tarot',
    'yoruba-ifa', 'chinese-cosmological',
  ],
}

const DIVINATION_SYSTEMS = [
  { id: 'norse-runic', name: 'Rune Draw', icon: 'ᚱ', description: 'Draw runes from the Elder Futhark' },
  { id: 'celtic-ogham', name: 'Ogham Stave', icon: 'ᚋ', description: 'Draw staves from the Ogham alphabet' },
  { id: 'tarot', name: 'Tarot Cards', icon: '⚜', description: 'Draw from the Major Arcana' },
  { id: 'yoruba-ifa', name: 'Ifá Casting', icon: '◎', description: 'Cast Odù through Opele or Ikin' },
  { id: 'chinese-cosmological', name: 'I Ching', icon: '☰', description: 'Generate hexagrams through coins or yarrow' },
]

class SystemRegistry {
  constructor() {
    this.systems = new Map()
    this.instances = new Map()

    for (const def of SYSTEM_DEFS) {
      this.systems.set(def.id, def)
    }
  }

  get(id) {
    return this.systems.get(id)
  }

  all() {
    return Array.from(this.systems.values())
  }

  byRegion() {
    const grouped = {}
    for (const sys of this.systems.values()) {
      if (!grouped[sys.region]) grouped[sys.region] = []
      grouped[sys.region].push(sys)
    }
    return grouped
  }

  forInputType(inputType) {
    const ids = INPUT_COMPATIBILITY[inputType] || []
    return ids.map(id => this.systems.get(id)).filter(Boolean)
  }

  divinationSystems() {
    return DIVINATION_SYSTEMS
  }

  /**
   * Get or create an instance of a system with a given preset/config.
   */
  createInstance(systemId, config) {
    const def = this.systems.get(systemId)
    if (!def) throw new Error(`Unknown system: ${systemId}`)
    return def.module.create(config)
  }

  /**
   * Get a cached default instance.
   */
  getInstance(systemId) {
    if (!this.instances.has(systemId)) {
      this.instances.set(systemId, this.createInstance(systemId))
    }
    return this.instances.get(systemId)
  }

  /**
   * Clear the cached instance (e.g., when preset changes).
   */
  clearInstance(systemId) {
    this.instances.delete(systemId)
  }

  /**
   * Run evaluation on a single system.
   */
  evaluate(systemId, input, config) {
    const instance = config
      ? this.createInstance(systemId, config)
      : this.getInstance(systemId)
    return {
      systemId,
      result: instance.analyze(input),
      timestamp: Date.now(),
    }
  }

  /**
   * Run evaluation on all compatible systems for an input type (Premium).
   */
  evaluateAll(inputType, input, presets = {}) {
    const compatible = this.forInputType(inputType)
    return compatible.map(sys => {
      try {
        const config = presets[sys.id]
        const instance = config
          ? this.createInstance(sys.id, config)
          : this.getInstance(sys.id)
        return {
          systemId: sys.id,
          result: instance.analyze(input),
          timestamp: Date.now(),
        }
      } catch (e) {
        return {
          systemId: sys.id,
          error: e.message,
          timestamp: Date.now(),
        }
      }
    })
  }

  color(systemId) {
    return SYSTEM_COLORS[systemId] || '#71717A'
  }
}

export const registry = new SystemRegistry()
export default registry
