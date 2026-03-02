import { useState } from 'react'
import registry, { SYSTEM_COLORS, REGIONS } from '../../utils/system-registry'
import { C, fonts } from '../../utils/theme'
import GlassCard from '../../components/GlassCard'
import SystemDetail from './SystemDetail'
import NumberIndex from './NumberIndex'
import DivinationGateway from './DivinationGateway'

const SEGMENTS = [
  { id: 'systems', label: 'Systems' },
  { id: 'numbers', label: 'Numbers' },
  { id: 'divination', label: 'Divination' },
]

export default function ExploreScreen() {
  const [segment, setSegment] = useState('systems')
  const [selectedSystem, setSelectedSystem] = useState(null)

  if (selectedSystem) {
    return <SystemDetail systemId={selectedSystem} onBack={() => setSelectedSystem(null)} />
  }

  return (
    <div style={{ padding: '20px 16px 80px', maxWidth: 600, margin: '0 auto' }}>
      {/* Header */}
      <h1 style={{
        fontFamily: fonts.serif,
        fontSize: 22,
        fontWeight: 300,
        color: C.gold,
        letterSpacing: '2px',
        textTransform: 'uppercase',
        margin: '0 0 16px',
      }}>
        Explore
      </h1>

      {/* Segment controls */}
      <div style={{
        display: 'flex',
        gap: 4,
        marginBottom: 20,
        background: 'rgba(10, 8, 18, 0.5)',
        borderRadius: 8,
        padding: 3,
      }}>
        {SEGMENTS.map(s => (
          <button
            key={s.id}
            onClick={() => setSegment(s.id)}
            style={{
              flex: 1,
              padding: '8px 12px',
              background: segment === s.id ? `${C.cyan}12` : 'transparent',
              border: `1px solid ${segment === s.id ? C.cyan + '30' : 'transparent'}`,
              borderRadius: 6,
              color: segment === s.id ? C.cyan : C.textMuted,
              fontFamily: fonts.mono,
              fontSize: 10,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {segment === 'systems' && (
        <SystemBrowser onSelect={setSelectedSystem} />
      )}
      {segment === 'numbers' && <NumberIndex />}
      {segment === 'divination' && <DivinationGateway />}
    </div>
  )
}

function SystemBrowser({ onSelect }) {
  const byRegion = registry.byRegion()

  return (
    <div>
      {Object.entries(byRegion).map(([regionId, systems]) => (
        <div key={regionId} style={{ marginBottom: 20 }}>
          <div style={{
            fontFamily: fonts.mono,
            fontSize: 9,
            color: C.textMuted,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginBottom: 8,
            padding: '0 4px',
          }}>
            {REGIONS[regionId]?.icon} {REGIONS[regionId]?.label}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {systems.map(sys => (
              <GlassCard
                key={sys.id}
                onClick={() => onSelect(sys.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  borderColor: `${SYSTEM_COLORS[sys.id]}15`,
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: `${SYSTEM_COLORS[sys.id]}15`,
                  border: `1px solid ${SYSTEM_COLORS[sys.id]}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: SYSTEM_COLORS[sys.id],
                  }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: fonts.serif,
                    fontSize: 15,
                    color: C.textBright,
                  }}>
                    {sys.name}
                  </div>
                  <div style={{
                    fontFamily: fonts.mono,
                    fontSize: 9,
                    color: C.textMuted,
                    marginTop: 2,
                  }}>
                    {sys.subtitle} · {sys.era}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 3 }}>
                  {sys.inputTypes.map(t => (
                    <span key={t} style={{
                      fontFamily: fonts.mono,
                      fontSize: 8,
                      color: C.textMuted,
                      background: 'rgba(20, 16, 30, 0.5)',
                      padding: '2px 5px',
                      borderRadius: 3,
                      textTransform: 'uppercase',
                    }}>
                      {t}
                    </span>
                  ))}
                  {sys.hasDivination && (
                    <span style={{
                      fontFamily: fonts.mono,
                      fontSize: 8,
                      color: C.purple,
                      background: `${C.purple}15`,
                      padding: '2px 5px',
                      borderRadius: 3,
                    }}>
                      DIV
                    </span>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
