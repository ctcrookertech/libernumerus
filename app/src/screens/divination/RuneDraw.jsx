import { useState, useMemo } from 'react'
import registry, { SYSTEM_COLORS } from '../../utils/system-registry'
import { C, fonts } from '../../utils/theme'
import GlassCard from '../../components/GlassCard'

const color = SYSTEM_COLORS['norse-runic']

export default function RuneDraw({ onBack }) {
  const [mode, setMode] = useState('single') // 'single' | 'spread'
  const [result, setResult] = useState(null)
  const [casting, setCasting] = useState(false)
  const [config, setConfig] = useState({ blankRune: false, reversals: false })

  const instance = useMemo(() => {
    return registry.createInstance('norse-runic', {
      blankRune: config.blankRune,
      reversals: config.reversals,
    })
  }, [config])

  function handleDraw() {
    setCasting(true)
    setResult(null)

    setTimeout(() => {
      if (mode === 'single') {
        setResult({ type: 'single', rune: instance.drawRune() })
      } else {
        setResult({ type: 'spread', runes: instance.threeRuneSpread() })
      }
      setCasting(false)
    }, 800)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${C.bgDeep}, #0a0818)`,
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
        color, margin: '0 0 4px', letterSpacing: '1px',
      }}>
        Rune Draw
      </h2>
      <p style={{
        fontFamily: fonts.serif, fontSize: 12, color: C.textMuted,
        fontStyle: 'italic', margin: '0 0 24px',
      }}>
        Elder Futhark · 24 runes of the Norse tradition
      </p>

      {/* Mode selector */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {[
          { id: 'single', label: 'Single Rune' },
          { id: 'spread', label: 'Three-Rune Spread' },
        ].map(m => (
          <button key={m.id} onClick={() => { setMode(m.id); setResult(null) }} style={{
            flex: 1, padding: '8px', background: mode === m.id ? `${color}12` : 'transparent',
            border: `1px solid ${mode === m.id ? color + '30' : C.border}`,
            borderRadius: 6, color: mode === m.id ? color : C.textMuted,
            fontFamily: fonts.mono, fontSize: 10, cursor: 'pointer',
          }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Config toggles */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <label style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: fonts.mono, fontSize: 10, color: C.textDim, cursor: 'pointer',
        }}>
          <input type="checkbox" checked={config.reversals}
            onChange={e => setConfig(c => ({ ...c, reversals: e.target.checked }))}
          />
          Reversals
        </label>
        <label style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: fonts.mono, fontSize: 10, color: C.textDim, cursor: 'pointer',
        }}>
          <input type="checkbox" checked={config.blankRune}
            onChange={e => setConfig(c => ({ ...c, blankRune: e.target.checked }))}
          />
          Blank rune
          <span style={{ fontSize: 8, color: C.textMuted }}>(non-historical)</span>
        </label>
      </div>

      {/* Draw button */}
      <button onClick={handleDraw} disabled={casting} style={{
        display: 'block', width: '100%', maxWidth: 240, margin: '0 auto 32px',
        padding: '14px 24px', background: `${color}15`, border: `1px solid ${color}30`,
        borderRadius: 8, color, fontFamily: fonts.mono, fontSize: 12,
        letterSpacing: '3px', textTransform: 'uppercase', cursor: casting ? 'wait' : 'pointer',
        opacity: casting ? 0.5 : 1, boxShadow: `0 0 20px ${color}15`,
      }}>
        {casting ? '...' : mode === 'single' ? 'Draw' : 'Spread'}
      </button>

      {/* Results */}
      {result?.type === 'single' && result.rune && (
        <RuneCard rune={result.rune} large />
      )}

      {result?.type === 'spread' && result.runes && (
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          {result.runes.map((item, i) => (
            <div key={i} style={{ flex: 1, maxWidth: 160 }}>
              <div style={{
                textAlign: 'center', fontFamily: fonts.mono, fontSize: 9,
                color: C.textMuted, letterSpacing: '1px', textTransform: 'uppercase',
                marginBottom: 6,
              }}>
                {item.position}
              </div>
              <RuneCard rune={item.rune || item} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function RuneCard({ rune, large }) {
  if (!rune) return null
  const r = rune.rune || rune

  return (
    <GlassCard glow={`${color}20`} style={{
      textAlign: 'center',
      borderColor: `${color}25`,
      padding: large ? '24px 20px' : '16px 12px',
    }}>
      <div style={{
        fontSize: large ? 56 : 36,
        color,
        lineHeight: 1,
        marginBottom: 8,
        transform: rune.reversed ? 'rotate(180deg)' : 'none',
        filter: `drop-shadow(0 0 12px ${color}40)`,
      }}>
        {r.char || r.character || '?'}
      </div>
      <div style={{
        fontFamily: fonts.serif, fontSize: large ? 16 : 13,
        color: C.textBright, marginBottom: 4,
      }}>
        {r.name}
        {rune.reversed && (
          <span style={{ color: C.textMuted, fontSize: 11 }}> (reversed)</span>
        )}
      </div>
      {r.keywords && (
        <div style={{
          fontFamily: fonts.serif, fontSize: 11, color: C.textDim, marginBottom: 6,
        }}>
          {Array.isArray(r.keywords) ? r.keywords.join(', ') : r.keywords}
        </div>
      )}
      {r.meaning && (
        <div style={{
          fontFamily: fonts.serif, fontSize: 12, color: C.textBright, lineHeight: 1.6,
        }}>
          {typeof r.meaning === 'string' ? r.meaning : r.meaning.upright || r.meaning.text || ''}
        </div>
      )}
    </GlassCard>
  )
}
