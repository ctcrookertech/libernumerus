import { useState, useMemo } from 'react'
import registry, { SYSTEM_COLORS } from '../../utils/system-registry'
import { C, fonts } from '../../utils/theme'
import GlassCard from '../../components/GlassCard'

const color = SYSTEM_COLORS['chinese-cosmological']

const LINE_TYPES = {
  6: { name: 'Old Yin', yin: true, changing: true, symbol: '⚋×' },
  7: { name: 'Young Yang', yin: false, changing: false, symbol: '⚊' },
  8: { name: 'Young Yin', yin: true, changing: false, symbol: '⚋' },
  9: { name: 'Old Yang', yin: false, changing: true, symbol: '⚊○' },
}

export default function IChing({ onBack }) {
  const [method, setMethod] = useState('coins')
  const [result, setResult] = useState(null)
  const [casting, setCasting] = useState(false)

  const instance = useMemo(() => {
    return registry.createInstance('chinese-cosmological', { iChingMethod: method })
  }, [method])

  function handleCast() {
    setCasting(true)
    setResult(null)
    setTimeout(() => {
      const hex = instance.generateHexagram()
      setResult(hex)
      setCasting(false)
    }, 1500)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${C.bgDeep}, #140810)`,
      padding: '20px 16px 80px',
      maxWidth: 600,
      margin: '0 auto',
    }}>
      <button onClick={onBack} style={{
        background: 'none', border: 'none', color: C.textDim,
        fontFamily: fonts.serif, fontSize: 13, cursor: 'pointer', padding: '4px 0', marginBottom: 16,
      }}>
        ← Back
      </button>

      <h2 style={{
        fontFamily: fonts.serif, fontSize: 22, fontWeight: 300,
        color, margin: '0 0 4px',
      }}>
        I Ching
      </h2>
      <p style={{
        fontFamily: fonts.serif, fontSize: 12, color: C.textMuted,
        fontStyle: 'italic', margin: '0 0 20px',
      }}>
        64 hexagrams · {method === 'coins' ? 'Three-coin' : 'Yarrow stalk'} method
      </p>

      {/* Method selector */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        <button onClick={() => setMethod('coins')} style={{
          flex: 1, padding: '8px', background: method === 'coins' ? `${color}12` : 'transparent',
          border: `1px solid ${method === 'coins' ? color + '30' : C.border}`,
          borderRadius: 6, color: method === 'coins' ? color : C.textMuted,
          fontFamily: fonts.mono, fontSize: 10, cursor: 'pointer',
        }}>
          Three Coins
        </button>
        <button onClick={() => setMethod('yarrow')} style={{
          flex: 1, padding: '8px', background: method === 'yarrow' ? `${color}12` : 'transparent',
          border: `1px solid ${method === 'yarrow' ? color + '30' : C.border}`,
          borderRadius: 6, color: method === 'yarrow' ? color : C.textMuted,
          fontFamily: fonts.mono, fontSize: 10, cursor: 'pointer',
        }}>
          Yarrow Stalks
        </button>
      </div>

      {method === 'yarrow' && (
        <div style={{
          padding: '8px 12px', background: `${C.gold}08`, border: `1px solid ${C.gold}15`,
          borderRadius: 6, marginBottom: 16,
          fontFamily: fonts.serif, fontSize: 11, color: C.textDim, lineHeight: 1.5,
        }}>
          The yarrow stalk method produces a different probability distribution than coins.
          Changing yin (old yin) is rarer, reflecting the difficulty of initiating change from stillness.
        </div>
      )}

      <button onClick={handleCast} disabled={casting} style={{
        display: 'block', width: '100%', maxWidth: 240, margin: '0 auto 32px',
        padding: '14px 24px', background: `${color}15`, border: `1px solid ${color}30`,
        borderRadius: 8, color, fontFamily: fonts.mono, fontSize: 12,
        letterSpacing: '3px', textTransform: 'uppercase', cursor: casting ? 'wait' : 'pointer',
        opacity: casting ? 0.5 : 1,
      }}>
        {casting ? '...' : 'Cast'}
      </button>

      {/* Results */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Primary hexagram */}
          <HexagramDisplay
            label="Primary Hexagram"
            hexagram={result.hexagram || result.primary}
            lines={result.lines}
            hexagramId={result.hexagramId}
            instance={instance}
          />

          {/* Changing lines info */}
          {result.changingLines && result.changingLines.length > 0 && (
            <GlassCard style={{ borderColor: `${C.gold}20` }}>
              <div style={{
                fontFamily: fonts.mono, fontSize: 9, color: C.goldDim,
                letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 6,
              }}>
                Changing Lines
              </div>
              {result.changingLines.map((lineIdx, i) => (
                <div key={i} style={{
                  fontFamily: fonts.serif, fontSize: 12, color: C.textBright, marginBottom: 4,
                }}>
                  Line {lineIdx + 1} (from bottom): {result.lines[lineIdx]?.type === 6 ? 'Old Yin → Young Yang' : 'Old Yang → Young Yin'}
                </div>
              ))}
            </GlassCard>
          )}

          {/* Relating hexagram */}
          {result.relatingHexagram && (
            <>
              <div style={{
                textAlign: 'center', fontFamily: fonts.mono, fontSize: 14, color: C.textMuted,
              }}>
                ↓ transforms into ↓
              </div>
              <HexagramDisplay
                label="Relating Hexagram"
                hexagram={result.relatingHexagram}
                instance={instance}
              />
            </>
          )}
        </div>
      )}
    </div>
  )
}

function HexagramDisplay({ label, hexagram, lines, hexagramId, instance }) {
  if (!hexagram) return null

  const name = hexagram.name || ''
  const upper = hexagram.upper || hexagram.upperTrigram
  const lower = hexagram.lower || hexagram.lowerTrigram

  return (
    <GlassCard glow={`${color}20`} style={{
      textAlign: 'center', borderColor: `${color}25`,
    }}>
      <div style={{
        fontFamily: fonts.mono, fontSize: 9, color: C.textMuted,
        letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8,
      }}>
        {label}
      </div>

      <div style={{
        fontFamily: fonts.serif, fontSize: 22, color,
        marginBottom: 4, filter: `drop-shadow(0 0 8px ${color}30)`,
      }}>
        {name}
      </div>

      {hexagramId && (
        <div style={{
          fontFamily: fonts.mono, fontSize: 11, color: C.textDim, marginBottom: 12,
        }}>
          #{hexagramId}
        </div>
      )}

      {/* Visual hexagram lines */}
      {lines && (
        <div style={{
          display: 'flex', flexDirection: 'column-reverse', gap: 4,
          alignItems: 'center', margin: '12px 0',
        }}>
          {lines.map((line, i) => {
            const val = line.value || line.type || line
            const lineInfo = LINE_TYPES[val] || { yin: val % 2 === 0, changing: false }

            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 4, position: 'relative',
              }}>
                {/* Line number */}
                <span style={{
                  fontFamily: fonts.mono, fontSize: 8, color: C.textMuted, width: 12,
                  textAlign: 'right',
                }}>
                  {i + 1}
                </span>

                {/* Line visual */}
                {lineInfo.yin ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{
                      width: 40, height: 4, borderRadius: 2,
                      background: lineInfo.changing ? C.gold : C.textDim,
                    }} />
                    <div style={{
                      width: 40, height: 4, borderRadius: 2,
                      background: lineInfo.changing ? C.gold : C.textDim,
                    }} />
                  </div>
                ) : (
                  <div style={{
                    width: 88, height: 4, borderRadius: 2,
                    background: lineInfo.changing ? C.gold : C.textBright,
                  }} />
                )}

                {/* Changing indicator */}
                {lineInfo.changing && (
                  <span style={{
                    fontFamily: fonts.mono, fontSize: 9, color: C.gold,
                  }}>
                    {lineInfo.yin ? '×' : '○'}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Trigram info */}
      {upper && lower && (
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8,
        }}>
          <div style={{ fontFamily: fonts.serif, fontSize: 12, color: C.textDim }}>
            {upper.symbol || ''} {upper.name || ''} above
          </div>
          <div style={{ fontFamily: fonts.serif, fontSize: 12, color: C.textDim }}>
            {lower.symbol || ''} {lower.name || ''} below
          </div>
        </div>
      )}
    </GlassCard>
  )
}
