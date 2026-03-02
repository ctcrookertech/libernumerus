import { useMemo } from 'react'
import registry, { SYSTEM_COLORS } from '../utils/system-registry'
import { C, fonts } from '../utils/theme'

/**
 * QuickMeaning — lightweight bottom sheet showing cross-system meanings for a number.
 * Triggered by long-press on any number display.
 */
export default function QuickMeaning({ number, onClose }) {
  const meanings = useMemo(() => {
    if (!number || typeof number !== 'number') return []
    const results = []
    for (const sys of registry.all()) {
      try {
        const instance = registry.getInstance(sys.id)
        const m = instance.numberMeaning?.(number)
        if (m && (m.name || m.title || m.theme || m.description || m.text)) {
          results.push({
            systemId: sys.id,
            name: sys.name,
            meaning: m,
          })
        }
      } catch { /* skip */ }
    }
    return results
  }, [number])

  if (!number) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 150,
        background: 'rgba(5, 3, 10, 0.7)',
        display: 'flex',
        alignItems: 'flex-end',
        animation: 'fadeIn 0.1s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          margin: '0 auto',
          maxHeight: '50vh',
          overflow: 'auto',
          background: '#0d0b16',
          borderRadius: '16px 16px 0 0',
          border: `1px solid ${C.border}`,
          borderBottom: 'none',
          padding: '20px 16px 32px',
          animation: 'slideUp 0.15s ease',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{
              fontFamily: fonts.mono,
              fontSize: 28,
              fontWeight: 300,
              color: C.gold,
            }}>
              {number}
            </span>
            <span style={{
              fontFamily: fonts.serif,
              fontSize: 12,
              color: C.textMuted,
            }}>
              across {meanings.length} tradition{meanings.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: C.textMuted,
            fontSize: 18, cursor: 'pointer',
          }}>
            ✕
          </button>
        </div>

        {/* Meanings */}
        {meanings.length === 0 ? (
          <div style={{
            fontFamily: fonts.serif,
            fontSize: 13,
            color: C.textMuted,
            fontStyle: 'italic',
          }}>
            No specific meaning entries found for this number.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {meanings.map(({ systemId, name, meaning }) => (
              <div key={systemId} style={{
                padding: '8px 10px',
                borderLeft: `2px solid ${SYSTEM_COLORS[systemId] || C.textMuted}`,
                background: 'rgba(20, 16, 30, 0.3)',
                borderRadius: '0 6px 6px 0',
              }}>
                <div style={{
                  fontFamily: fonts.mono,
                  fontSize: 9,
                  color: SYSTEM_COLORS[systemId],
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  marginBottom: 3,
                }}>
                  {name}
                  {(meaning.name || meaning.title) && (
                    <span style={{ color: C.textDim }}> — {meaning.name || meaning.title}</span>
                  )}
                </div>
                <div style={{
                  fontFamily: fonts.serif,
                  fontSize: 12,
                  color: C.textBright,
                  lineHeight: 1.5,
                }}>
                  {meaning.description || meaning.text || meaning.theme || meaning.keywords || ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
