import { useState } from 'react'
import registry from '../../utils/system-registry'
import { C, fonts } from '../../utils/theme'
import GlassCard from '../../components/GlassCard'
import RuneDraw from '../divination/RuneDraw'
import OghamDraw from '../divination/OghamDraw'
import TarotDraw from '../divination/TarotDraw'
import IfaCasting from '../divination/IfaCasting'
import IChing from '../divination/IChing'

const DIVINATION_INFO = {
  'norse-runic': {
    icon: 'ᚱ',
    title: 'Rune Draw',
    desc: 'Draw from the Elder Futhark. Single rune or three-rune spread (Past, Present, Future).',
    ambient: 'Aurora borealis · Snowflake particles',
    Component: RuneDraw,
  },
  'celtic-ogham': {
    icon: 'ᚋ',
    title: 'Ogham Stave Draw',
    desc: 'Draw from the 20 ogham feda. Single, three-fid, or five-fid spreads.',
    ambient: 'Forest atmosphere · Drifting leaves',
    Component: OghamDraw,
  },
  'tarot': {
    icon: '⚜',
    title: 'Tarot Card Draw',
    desc: 'Birth Card, Year Card, Daily Card, or random Major Arcana draw.',
    ambient: 'Starfield · Golden mandorla',
    Component: TarotDraw,
  },
  'yoruba-ifa': {
    icon: '◎',
    title: 'Ifá Odù Casting',
    desc: 'Cast through Opele chain or Ikin palm nuts. 256 possible Odù.',
    ambient: 'Earth tones · Drum-pattern pulses',
    Component: IfaCasting,
  },
  'chinese-cosmological': {
    icon: '☰',
    title: 'I Ching Hexagram',
    desc: 'Generate hexagrams through three-coin toss or yarrow stalk method.',
    ambient: 'Ink-wash mountains · Calligraphic strokes',
    Component: IChing,
  },
}

export default function DivinationGateway() {
  const [activeDivination, setActiveDivination] = useState(null)

  if (activeDivination) {
    const info = DIVINATION_INFO[activeDivination]
    if (info?.Component) {
      return <info.Component onBack={() => setActiveDivination(null)} />
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p style={{
        fontFamily: fonts.serif,
        fontSize: 13,
        color: C.textDim,
        fontStyle: 'italic',
        margin: '0 0 8px',
        lineHeight: 1.6,
      }}>
        Five traditions offer divination — oracular methods that go beyond calculation
        into the realm of casting, drawing, and ritual inquiry.
      </p>

      {Object.entries(DIVINATION_INFO).map(([sysId, info]) => (
        <GlassCard
          key={sysId}
          onClick={() => setActiveDivination(sysId)}
          style={{
            display: 'flex',
            gap: 14,
            alignItems: 'center',
            borderColor: `${registry.color(sysId)}15`,
          }}
        >
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: `${registry.color(sysId)}10`,
            border: `1px solid ${registry.color(sysId)}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            flexShrink: 0,
          }}>
            {info.icon}
          </div>
          <div>
            <div style={{
              fontFamily: fonts.serif,
              fontSize: 15,
              color: C.textBright,
              marginBottom: 3,
            }}>
              {info.title}
            </div>
            <div style={{
              fontFamily: fonts.serif,
              fontSize: 11,
              color: C.textDim,
              lineHeight: 1.5,
            }}>
              {info.desc}
            </div>
            <div style={{
              fontFamily: fonts.mono,
              fontSize: 8,
              color: C.textMuted,
              marginTop: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {info.ambient}
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}
