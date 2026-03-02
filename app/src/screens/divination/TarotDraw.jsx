import { useState, useMemo } from 'react'
import registry, { SYSTEM_COLORS } from '../../utils/system-registry'
import { C, fonts } from '../../utils/theme'
import GlassCard from '../../components/GlassCard'

const color = SYSTEM_COLORS['tarot']

export default function TarotDraw({ onBack }) {
  const [mode, setMode] = useState('birth') // birth | year | daily | single | spread
  const [result, setResult] = useState(null)
  const [casting, setCasting] = useState(false)
  const [dateInput, setDateInput] = useState('')
  const [tradition, setTradition] = useState('waite')

  const instance = useMemo(() => {
    return registry.createInstance('tarot', { tradition })
  }, [tradition])

  function handleDraw() {
    setCasting(true)
    setResult(null)

    setTimeout(() => {
      try {
        if (mode === 'birth' || mode === 'year' || mode === 'daily') {
          const d = dateInput ? new Date(dateInput) : new Date()
          if (mode === 'birth') {
            setResult({ type: 'birth', data: instance.birthCard(d) })
          } else if (mode === 'year') {
            setResult({ type: 'year', data: instance.yearCard(d.getFullYear()) })
          } else {
            setResult({ type: 'daily', data: instance.dailyCard(d) })
          }
        } else if (mode === 'single') {
          const n = Math.floor(Math.random() * 22)
          const card = instance.getCard(n)
          setResult({ type: 'single', data: { value: n, card } })
        } else {
          // Three-card spread
          const drawn = new Set()
          const cards = []
          const positions = ['Past', 'Present', 'Future']
          while (cards.length < 3) {
            const n = Math.floor(Math.random() * 22)
            if (!drawn.has(n)) {
              drawn.add(n)
              cards.push({ position: positions[cards.length], value: n, card: instance.getCard(n) })
            }
          }
          setResult({ type: 'spread', data: cards })
        }
      } catch (e) {
        console.error('Tarot draw error:', e)
      }
      setCasting(false)
    }, 1000)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${C.bgDeep}, #0e0820)`,
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
        Tarot
      </h2>
      <p style={{
        fontFamily: fonts.serif, fontSize: 12, color: C.textMuted,
        fontStyle: 'italic', margin: '0 0 20px',
      }}>
        22 Major Arcana · {tradition.charAt(0).toUpperCase() + tradition.slice(1)} tradition
      </p>

      {/* Tradition selector */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
        {['waite', 'crowley', 'marseille', 'goldenDawn'].map(t => (
          <button key={t} onClick={() => setTradition(t)} style={{
            padding: '5px 10px', background: tradition === t ? `${color}12` : 'transparent',
            border: `1px solid ${tradition === t ? color + '25' : 'transparent'}`,
            borderRadius: 4, color: tradition === t ? color : C.textMuted,
            fontFamily: fonts.mono, fontSize: 9, cursor: 'pointer', textTransform: 'capitalize',
          }}>
            {t === 'goldenDawn' ? 'G.D.' : t}
          </button>
        ))}
      </div>

      {/* Mode selector */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { id: 'birth', label: 'Birth Card' },
          { id: 'year', label: 'Year Card' },
          { id: 'daily', label: 'Daily Card' },
          { id: 'single', label: 'Random Draw' },
          { id: 'spread', label: 'Three-Card' },
        ].map(m => (
          <button key={m.id} onClick={() => { setMode(m.id); setResult(null) }} style={{
            padding: '6px 12px', background: mode === m.id ? `${color}12` : 'transparent',
            border: `1px solid ${mode === m.id ? color + '30' : C.border}`,
            borderRadius: 6, color: mode === m.id ? color : C.textMuted,
            fontFamily: fonts.mono, fontSize: 10, cursor: 'pointer',
          }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Date input for birth/year/daily */}
      {['birth', 'year', 'daily'].includes(mode) && (
        <input type="date" value={dateInput}
          onChange={e => setDateInput(e.target.value)}
          style={{
            width: '100%', padding: '10px 14px', background: C.bgInput,
            border: `1px solid ${C.border}`, borderRadius: 6,
            color: C.textBright, fontFamily: fonts.mono, fontSize: 14,
            colorScheme: 'dark', outline: 'none', marginBottom: 16,
          }}
        />
      )}

      <button onClick={handleDraw} disabled={casting} style={{
        display: 'block', width: '100%', maxWidth: 240, margin: '0 auto 32px',
        padding: '14px 24px', background: `${color}15`, border: `1px solid ${color}30`,
        borderRadius: 8, color, fontFamily: fonts.mono, fontSize: 12,
        letterSpacing: '3px', textTransform: 'uppercase', cursor: casting ? 'wait' : 'pointer',
        opacity: casting ? 0.5 : 1,
      }}>
        {casting ? '...' : mode === 'spread' ? 'Spread' : 'Draw'}
      </button>

      {/* Results */}
      {result?.type === 'spread' && (
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          {result.data.map((item, i) => (
            <div key={i} style={{ flex: 1, maxWidth: 160 }}>
              <div style={{
                textAlign: 'center', fontFamily: fonts.mono, fontSize: 9,
                color: C.textMuted, letterSpacing: '1px', textTransform: 'uppercase',
                marginBottom: 6,
              }}>
                {item.position}
              </div>
              <TarotCard value={item.value} card={item.card} compact />
            </div>
          ))}
        </div>
      )}

      {result && result.type !== 'spread' && result.data && (
        <TarotCard
          value={result.data.value}
          card={result.data.card}
          reductionChain={result.data.reductionChain}
          linkedCards={result.data.linkedCards}
        />
      )}
    </div>
  )
}

function TarotCard({ value, card, reductionChain, linkedCards, compact }) {
  if (!card) return null

  return (
    <GlassCard glow={`${color}20`} style={{
      textAlign: 'center', borderColor: `${color}25`,
      padding: compact ? '14px 10px' : '24px 20px',
    }}>
      <div style={{
        fontFamily: fonts.mono, fontSize: compact ? 28 : 48,
        color, lineHeight: 1, marginBottom: 8,
        filter: `drop-shadow(0 0 12px ${color}40)`,
      }}>
        {typeof value === 'number' ? (value === 0 ? '0' : value) : value}
      </div>
      <div style={{
        fontFamily: fonts.serif, fontSize: compact ? 13 : 18,
        color: C.textBright, fontWeight: 500, marginBottom: 4,
      }}>
        {card.name}
      </div>
      {card.hebrewGD && (
        <div style={{
          fontFamily: fonts.mono, fontSize: 10, color: C.textDim, marginBottom: 4,
        }}>
          {card.hebrewGD} · {card.astro || ''}
        </div>
      )}
      {card.keywords && !compact && (
        <div style={{
          fontFamily: fonts.serif, fontSize: 12, color: C.textDim, lineHeight: 1.5,
        }}>
          {Array.isArray(card.keywords) ? card.keywords.join(', ') : card.keywords}
        </div>
      )}

      {/* Reduction chain */}
      {reductionChain && reductionChain.length > 1 && !compact && (
        <div style={{
          marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}`,
        }}>
          <div style={{
            fontFamily: fonts.mono, fontSize: 9, color: C.textMuted,
            letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 6,
          }}>
            Reduction Chain
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {reductionChain.map((link, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  fontFamily: fonts.mono, fontSize: 14, color: i === 0 ? color : C.textDim,
                }}>
                  {link.value || link.number || link}
                </span>
                {link.card && (
                  <span style={{ fontFamily: fonts.serif, fontSize: 10, color: C.textMuted }}>
                    {link.card.name || link.name}
                  </span>
                )}
                {i < reductionChain.length - 1 && (
                  <span style={{ color: C.textMuted }}>→</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  )
}
