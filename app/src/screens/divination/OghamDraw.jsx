import { useState, useMemo } from 'react'
import registry, { SYSTEM_COLORS } from '../../utils/system-registry'
import { C, fonts } from '../../utils/theme'
import GlassCard from '../../components/GlassCard'

const color = SYSTEM_COLORS['celtic-ogham']

export default function OghamDraw({ onBack }) {
  const [count, setCount] = useState(1)
  const [result, setResult] = useState(null)
  const [casting, setCasting] = useState(false)
  const [forfeda, setForfeda] = useState(false)

  const instance = useMemo(() => {
    return registry.createInstance('celtic-ogham', { forfeda })
  }, [forfeda])

  const positions = count === 1
    ? ['']
    : count === 3
    ? ['Situation', 'Challenge', 'Outcome']
    : ['North', 'East', 'Center', 'West', 'South']

  function handleDraw() {
    setCasting(true)
    setResult(null)
    setTimeout(() => {
      const drawn = instance.divinationDraw(count)
      setResult(drawn)
      setCasting(false)
    }, 800)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${C.bgDeep}, #081208)`,
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
        Ogham Stave Draw
      </h2>
      <p style={{
        fontFamily: fonts.serif, fontSize: 12, color: C.textMuted,
        fontStyle: 'italic', margin: '0 0 24px',
      }}>
        Draw from the {forfeda ? 25 : 20} feda of the tree alphabet
      </p>

      {/* Count selector */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {[1, 3, 5].map(n => (
          <button key={n} onClick={() => { setCount(n); setResult(null) }} style={{
            flex: 1, padding: '8px', background: count === n ? `${color}12` : 'transparent',
            border: `1px solid ${count === n ? color + '30' : C.border}`,
            borderRadius: 6, color: count === n ? color : C.textMuted,
            fontFamily: fonts.mono, fontSize: 10, cursor: 'pointer',
          }}>
            {n === 1 ? 'Single' : n === 3 ? 'Three Fid' : 'Five Fid'}
          </button>
        ))}
      </div>

      <label style={{
        display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20,
        fontFamily: fonts.mono, fontSize: 10, color: C.textDim, cursor: 'pointer',
      }}>
        <input type="checkbox" checked={forfeda}
          onChange={e => setForfeda(e.target.checked)}
        />
        Include forfeda (5 supplementary letters)
      </label>

      <button onClick={handleDraw} disabled={casting} style={{
        display: 'block', width: '100%', maxWidth: 240, margin: '0 auto 32px',
        padding: '14px 24px', background: `${color}15`, border: `1px solid ${color}30`,
        borderRadius: 8, color, fontFamily: fonts.mono, fontSize: 12,
        letterSpacing: '3px', textTransform: 'uppercase', cursor: casting ? 'wait' : 'pointer',
        opacity: casting ? 0.5 : 1,
      }}>
        {casting ? '...' : 'Draw'}
      </button>

      {result?.feda && (
        <div style={{
          display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap',
        }}>
          {result.feda.map((letter, i) => (
            <div key={i} style={{ width: count === 1 ? '100%' : count === 3 ? '30%' : '18%', maxWidth: 180 }}>
              {positions[i] && (
                <div style={{
                  textAlign: 'center', fontFamily: fonts.mono, fontSize: 9,
                  color: C.textMuted, letterSpacing: '1px', textTransform: 'uppercase',
                  marginBottom: 6,
                }}>
                  {positions[i]}
                </div>
              )}
              <GlassCard glow={`${color}20`} style={{
                textAlign: 'center', borderColor: `${color}25`,
                padding: count === 1 ? '24px 20px' : '14px 10px',
              }}>
                <div style={{
                  fontSize: count === 1 ? 42 : 28, color, lineHeight: 1, marginBottom: 8,
                  filter: `drop-shadow(0 0 8px ${color}40)`,
                }}>
                  {letter.character || letter.char || '᚛'}
                </div>
                <div style={{
                  fontFamily: fonts.serif, fontSize: count === 1 ? 16 : 12,
                  color: C.textBright, marginBottom: 2,
                }}>
                  {letter.name}
                </div>
                <div style={{
                  fontFamily: fonts.serif, fontSize: 11, color: C.textDim,
                }}>
                  {letter.tree}
                </div>
                {letter.aicme !== undefined && (
                  <div style={{
                    fontFamily: fonts.mono, fontSize: 9, color: C.textMuted, marginTop: 4,
                  }}>
                    Aicme {letter.aicme + 1}, pos {letter.posInAicme + 1}
                  </div>
                )}
              </GlassCard>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
