import { useState, useMemo } from 'react'
import registry, { SYSTEM_COLORS } from '../../utils/system-registry'
import { C, fonts } from '../../utils/theme'

export default function NumberIndex() {
  const [search, setSearch] = useState('')
  const [expandedNumber, setExpandedNumber] = useState(null)

  // Collect all number meanings from all systems
  const entries = useMemo(() => {
    const numberMap = {}

    for (const sys of registry.all()) {
      try {
        const instance = registry.getInstance(sys.id)
        if (!instance.numberMeaning) continue

        // Check numbers 1-100 and some significant ones
        const numbers = [
          ...Array.from({ length: 52 }, (_, i) => i + 1),
          64, 72, 78, 93, 99, 108, 137, 144, 153, 216, 256, 260, 358, 365,
          418, 496, 666, 786, 888,
        ]

        for (const n of numbers) {
          try {
            const m = instance.numberMeaning(n)
            if (m && (m.name || m.title || m.theme || m.description || m.text)) {
              if (!numberMap[n]) numberMap[n] = { num: n, meanings: [] }
              const text = m.description || m.text || m.theme || ''
              if (text || m.name || m.title) {
                numberMap[n].meanings.push({
                  sys: sys.name,
                  sysId: sys.id,
                  name: m.name || m.title || '',
                  text,
                  keywords: m.keywords,
                })
              }
            }
          } catch { /* skip */ }
        }
      } catch { /* skip */ }
    }

    return Object.values(numberMap)
      .filter(e => e.meanings.length > 0)
      .sort((a, b) => a.num - b.num)
  }, [])

  const filtered = useMemo(() => {
    if (!search) return entries
    const q = search.toLowerCase()
    return entries.filter(e =>
      String(e.num).includes(q) ||
      e.meanings.some(m =>
        m.sys.toLowerCase().includes(q) ||
        m.name.toLowerCase().includes(q) ||
        m.text.toLowerCase().includes(q)
      )
    )
  }, [entries, search])

  return (
    <div>
      <input
        type="text"
        placeholder="Search by number, system, or keyword..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 14px',
          background: C.bgInput,
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          color: C.textBright,
          fontFamily: fonts.serif,
          fontSize: 13,
          outline: 'none',
          marginBottom: 16,
        }}
      />

      <div style={{
        fontFamily: fonts.mono,
        fontSize: 10,
        color: C.textMuted,
        marginBottom: 12,
      }}>
        {filtered.length} numbers · {filtered.reduce((a, e) => a + e.meanings.length, 0)} meanings
      </div>

      {filtered.map(entry => {
        const isExpanded = expandedNumber === entry.num
        return (
          <div key={entry.num} style={{ marginBottom: 2 }}>
            <button
              onClick={() => setExpandedNumber(isExpanded ? null : entry.num)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                padding: '10px 12px',
                background: isExpanded ? 'rgba(20, 16, 30, 0.4)' : 'transparent',
                border: 'none',
                borderLeft: `2px solid ${isExpanded ? C.goldDim : 'rgba(26, 24, 21, 0.5)'}`,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.12s',
              }}
            >
              <span style={{
                fontFamily: fonts.mono,
                fontSize: 22,
                fontWeight: 300,
                color: C.goldDim,
                minWidth: 50,
                textAlign: 'right',
              }}>
                {entry.num}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 4 }}>
                  {entry.meanings.map(m => (
                    <span key={m.sysId} style={{
                      fontFamily: fonts.mono,
                      fontSize: 8,
                      color: SYSTEM_COLORS[m.sysId] || C.textMuted,
                      background: `${SYSTEM_COLORS[m.sysId] || C.textMuted}15`,
                      border: `1px solid ${SYSTEM_COLORS[m.sysId] || C.textMuted}25`,
                      padding: '1px 5px',
                      borderRadius: 2,
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                    }}>
                      {m.sys}
                    </span>
                  ))}
                </div>
                {!isExpanded && (
                  <div style={{
                    fontFamily: fonts.serif,
                    fontSize: 12,
                    color: C.textDim,
                    lineHeight: 1.4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {entry.meanings[0].name || entry.meanings[0].text.slice(0, 100)}
                  </div>
                )}
                {isExpanded && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6 }}>
                    {entry.meanings.map(m => (
                      <div key={m.sysId}>
                        <div style={{
                          fontFamily: fonts.mono,
                          fontSize: 10,
                          color: SYSTEM_COLORS[m.sysId],
                          fontWeight: 500,
                          marginBottom: 3,
                        }}>
                          {m.sys}
                          {m.name && ` — ${m.name}`}
                        </div>
                        {m.keywords && (
                          <div style={{
                            fontFamily: fonts.serif,
                            fontSize: 11,
                            color: C.textMuted,
                            marginBottom: 2,
                          }}>
                            {typeof m.keywords === 'string' ? m.keywords : m.keywords?.join?.(', ')}
                          </div>
                        )}
                        <div style={{
                          fontFamily: fonts.serif,
                          fontSize: 12,
                          color: C.textBright,
                          lineHeight: 1.6,
                        }}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </button>
          </div>
        )
      })}
    </div>
  )
}
