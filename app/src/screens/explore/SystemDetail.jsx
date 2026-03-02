import { useState, useMemo } from 'react'
import registry, { SYSTEM_COLORS } from '../../utils/system-registry'
import { C, fonts } from '../../utils/theme'
import GlassCard from '../../components/GlassCard'

export default function SystemDetail({ systemId, onBack }) {
  const sys = registry.get(systemId)
  const color = SYSTEM_COLORS[systemId]
  const [expandedNumber, setExpandedNumber] = useState(null)

  // Get number meanings 1-22
  const meanings = useMemo(() => {
    const instance = registry.getInstance(systemId)
    const results = []
    for (let n = 1; n <= 22; n++) {
      try {
        const m = instance.numberMeaning?.(n)
        if (m) results.push({ number: n, ...m })
      } catch { /* skip */ }
    }
    return results
  }, [systemId])

  // Get presets
  const variants = sys?.module?.VARIANTS || {}
  const presetNames = Object.keys(variants)

  if (!sys) return null

  return (
    <div style={{ padding: '20px 16px 80px', maxWidth: 600, margin: '0 auto' }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: C.textDim,
          fontFamily: fonts.serif,
          fontSize: 13,
          cursor: 'pointer',
          padding: '4px 0',
          marginBottom: 16,
        }}
      >
        ← Back to Systems
      </button>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 8,
        }}>
          <span style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 12px ${color}40`,
          }} />
          <h1 style={{
            fontFamily: fonts.serif,
            fontSize: 24,
            fontWeight: 300,
            color,
            margin: 0,
          }}>
            {sys.name}
          </h1>
        </div>
        <p style={{
          fontFamily: fonts.mono,
          fontSize: 10,
          color: C.textMuted,
          margin: '0 0 8px',
        }}>
          {sys.subtitle} · {sys.era}
        </p>
        <p style={{
          fontFamily: fonts.serif,
          fontSize: 14,
          color: C.textDim,
          lineHeight: 1.6,
          margin: 0,
        }}>
          {sys.description}
        </p>
      </div>

      {/* Input types */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontFamily: fonts.mono,
          fontSize: 9,
          color: C.textMuted,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginBottom: 6,
        }}>
          Supported Inputs
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {sys.inputTypes.map(t => (
            <span key={t} style={{
              fontFamily: fonts.mono,
              fontSize: 10,
              color,
              background: `${color}15`,
              border: `1px solid ${color}25`,
              padding: '4px 10px',
              borderRadius: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {t}
            </span>
          ))}
          {sys.hasDivination && (
            <span style={{
              fontFamily: fonts.mono,
              fontSize: 10,
              color: C.purple,
              background: `${C.purple}15`,
              border: `1px solid ${C.purple}25`,
              padding: '4px 10px',
              borderRadius: 4,
              textTransform: 'uppercase',
            }}>
              Divination
            </span>
          )}
        </div>
      </div>

      {/* Presets */}
      {presetNames.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontFamily: fonts.mono,
            fontSize: 9,
            color: C.textMuted,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}>
            Presets
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {presetNames.map(name => (
              <span key={name} style={{
                fontFamily: fonts.mono,
                fontSize: 10,
                color: C.textDim,
                background: 'rgba(20, 16, 30, 0.5)',
                border: `1px solid ${C.border}`,
                padding: '4px 10px',
                borderRadius: 4,
              }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Number meanings */}
      {meanings.length > 0 && (
        <div>
          <div style={{
            fontFamily: fonts.mono,
            fontSize: 9,
            color: C.textMuted,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            Number Meanings
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {meanings.map(m => {
              const isExpanded = expandedNumber === m.number
              return (
                <GlassCard
                  key={m.number}
                  onClick={() => setExpandedNumber(isExpanded ? null : m.number)}
                  style={{
                    padding: '10px 14px',
                    borderColor: isExpanded ? `${color}25` : 'transparent',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <span style={{
                      fontFamily: fonts.mono,
                      fontSize: 18,
                      fontWeight: 300,
                      color,
                      minWidth: 28,
                      textAlign: 'right',
                    }}>
                      {m.number}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: fonts.serif,
                        fontSize: 13,
                        color: C.textBright,
                        fontWeight: 500,
                      }}>
                        {m.name || m.title || ''}
                      </div>
                      {isExpanded && (
                        <div style={{
                          fontFamily: fonts.serif,
                          fontSize: 12,
                          color: C.textDim,
                          lineHeight: 1.6,
                          marginTop: 6,
                        }}>
                          {m.keywords && (
                            <div style={{ color: C.textMuted, marginBottom: 4, fontSize: 11 }}>
                              {typeof m.keywords === 'string' ? m.keywords : m.keywords?.join?.(', ')}
                            </div>
                          )}
                          {m.description || m.text || m.theme || ''}
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
