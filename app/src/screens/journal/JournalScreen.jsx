import { useState, useMemo } from 'react'
import { useApp, useEvaluations } from '../../stores/app-store'
import registry, { SYSTEM_COLORS } from '../../utils/system-registry'
import { C, fonts } from '../../utils/theme'
import GlassCard from '../../components/GlassCard'

const SEGMENTS = [
  { id: 'history', label: 'History' },
  { id: 'starred', label: 'Starred' },
]

export default function JournalScreen() {
  const { evaluations, starredIds, toggleStar, isStarred } = useEvaluations()
  const [segment, setSegment] = useState('history')
  const [filterSystem, setFilterSystem] = useState(null)
  const [filterType, setFilterType] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = segment === 'starred'
      ? evaluations.filter(e => starredIds.has(e.id))
      : evaluations

    if (filterSystem) {
      list = list.filter(e => e.systems?.includes(filterSystem) || e.primarySystem === filterSystem)
    }
    if (filterType) {
      list = list.filter(e => e.inputType === filterType)
    }
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(e =>
        String(e.input).toLowerCase().includes(q)
      )
    }
    return list
  }, [evaluations, segment, filterSystem, filterType, search, starredIds])

  return (
    <div style={{ padding: '20px 16px 80px', maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{
        fontFamily: fonts.serif, fontSize: 22, fontWeight: 300,
        color: C.gold, letterSpacing: '2px', textTransform: 'uppercase',
        margin: '0 0 16px',
      }}>
        Journal
      </h1>

      {/* Segment controls */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 16,
        background: 'rgba(10, 8, 18, 0.5)', borderRadius: 8, padding: 3,
      }}>
        {SEGMENTS.map(s => (
          <button key={s.id} onClick={() => setSegment(s.id)} style={{
            flex: 1, padding: '8px', background: segment === s.id ? `${C.cyan}12` : 'transparent',
            border: `1px solid ${segment === s.id ? C.cyan + '30' : 'transparent'}`,
            borderRadius: 6, color: segment === s.id ? C.cyan : C.textMuted,
            fontFamily: fonts.mono, fontSize: 10, letterSpacing: '0.5px',
            textTransform: 'uppercase', cursor: 'pointer',
          }}>
            {s.label}
            {s.id === 'starred' && (
              <span style={{ marginLeft: 4, opacity: 0.5 }}>
                ({evaluations.filter(e => starredIds.has(e.id)).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search evaluations..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%', padding: '8px 12px', background: C.bgInput,
          border: `1px solid ${C.border}`, borderRadius: 6,
          color: C.textBright, fontFamily: fonts.serif, fontSize: 13,
          outline: 'none', marginBottom: 8,
        }}
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'wrap' }}>
        {['name', 'date', 'number'].map(t => (
          <button key={t} onClick={() => setFilterType(filterType === t ? null : t)} style={{
            padding: '4px 10px', background: filterType === t ? `${C.cyan}12` : 'transparent',
            border: `1px solid ${filterType === t ? C.cyan + '25' : C.border}`,
            borderRadius: 4, color: filterType === t ? C.cyan : C.textMuted,
            fontFamily: fonts.mono, fontSize: 9, cursor: 'pointer', textTransform: 'uppercase',
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div style={{
        fontFamily: fonts.mono, fontSize: 10, color: C.textMuted, marginBottom: 12,
      }}>
        {filtered.length} evaluation{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* Evaluation list */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '40px 20px',
          fontFamily: fonts.serif, fontSize: 14, color: C.textMuted,
          fontStyle: 'italic',
        }}>
          {segment === 'starred' ? 'No starred evaluations yet' : 'No evaluations yet. Try the Portal tab.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map(evaluation => {
            const starred = isStarred(evaluation.id)
            const primarySystem = evaluation.primarySystem || evaluation.systems?.[0]
            const sysColor = SYSTEM_COLORS[primarySystem] || C.textDim

            return (
              <GlassCard key={evaluation.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                borderColor: `${sysColor}15`,
              }}>
                {/* Star toggle */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleStar(evaluation.id) }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 16, padding: 0, color: starred ? C.gold : C.textMuted,
                    transition: 'color 0.2s',
                  }}
                >
                  {starred ? '★' : '☆'}
                </button>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      fontFamily: fonts.serif, fontSize: 15, color: C.textBright,
                    }}>
                      {evaluation.input}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, marginTop: 4,
                  }}>
                    <span style={{
                      fontFamily: fonts.mono, fontSize: 9, color: sysColor,
                      textTransform: 'uppercase',
                    }}>
                      {registry.get(primarySystem)?.name || primarySystem}
                    </span>
                    <span style={{
                      fontFamily: fonts.mono, fontSize: 8, color: C.textMuted,
                    }}>
                      {evaluation.inputType}
                    </span>
                    <span style={{
                      fontFamily: fonts.mono, fontSize: 8, color: C.textMuted,
                      marginLeft: 'auto',
                    }}>
                      {new Date(evaluation.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* System count badge for multi-system */}
                {evaluation.systems?.length > 1 && (
                  <span style={{
                    fontFamily: fonts.mono, fontSize: 10, color: C.purple,
                    background: `${C.purple}15`, border: `1px solid ${C.purple}20`,
                    padding: '2px 6px', borderRadius: 4,
                  }}>
                    ×{evaluation.systems.length}
                  </span>
                )}
              </GlassCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
