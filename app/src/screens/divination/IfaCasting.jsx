import { useState, useMemo } from 'react'
import registry, { SYSTEM_COLORS } from '../../utils/system-registry'
import { C, fonts } from '../../utils/theme'
import GlassCard from '../../components/GlassCard'

const color = SYSTEM_COLORS['yoruba-ifa']

export default function IfaCasting({ onBack }) {
  const [method, setMethod] = useState('opele')
  const [tradition, setTradition] = useState('yoruba')
  const [result, setResult] = useState(null)
  const [casting, setCasting] = useState(false)
  const [manualMarks, setManualMarks] = useState([null, null, null, null, null, null, null, null])

  const instance = useMemo(() => {
    return registry.createInstance('yoruba-ifa', { castingMethod: method, tradition })
  }, [method, tradition])

  function handleCast() {
    setCasting(true)
    setResult(null)
    setTimeout(() => {
      if (method === 'manual') {
        // Use manualMarks
        const marks = manualMarks.map(m => m || 1)
        const right = marks.slice(0, 4)
        const left = marks.slice(4, 8)
        const rightOdu = instance.identifyOdu(right)
        const leftOdu = instance.identifyOdu(left)
        const composite = rightOdu && leftOdu
          ? instance.compositeOdu(rightOdu.name, leftOdu.name)
          : null
        setResult({
          method: 'manual',
          right: { marks: right, odu: rightOdu },
          left: { marks: left, odu: leftOdu },
          composite,
        })
      } else {
        setResult(instance.cast())
      }
      setCasting(false)
    }, 1200)
  }

  function toggleManualMark(index) {
    setManualMarks(prev => {
      const next = [...prev]
      next[index] = next[index] === 2 ? 1 : 2
      return next
    })
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${C.bgDeep}, #120e08)`,
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
        Ifá Odù Casting
      </h2>
      <p style={{
        fontFamily: fonts.serif, fontSize: 12, color: C.textMuted,
        fontStyle: 'italic', margin: '0 0 20px',
      }}>
        256 Odù · {tradition.charAt(0).toUpperCase() + tradition.slice(1)} tradition
      </p>

      {/* Method selector */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {[
          { id: 'opele', label: 'Opele Chain' },
          { id: 'ikin', label: 'Ikin (Palm Nuts)' },
          { id: 'manual', label: 'Manual' },
        ].map(m => (
          <button key={m.id} onClick={() => { setMethod(m.id); setResult(null) }} style={{
            flex: 1, padding: '8px', background: method === m.id ? `${color}12` : 'transparent',
            border: `1px solid ${method === m.id ? color + '30' : C.border}`,
            borderRadius: 6, color: method === m.id ? color : C.textMuted,
            fontFamily: fonts.mono, fontSize: 9, cursor: 'pointer',
          }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Tradition selector */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {['yoruba', 'lukumi', 'candomble'].map(t => (
          <button key={t} onClick={() => setTradition(t)} style={{
            padding: '4px 10px', background: tradition === t ? `${color}10` : 'transparent',
            border: `1px solid ${tradition === t ? color + '20' : 'transparent'}`,
            borderRadius: 4, color: tradition === t ? color : C.textMuted,
            fontFamily: fonts.mono, fontSize: 9, cursor: 'pointer', textTransform: 'capitalize',
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* Manual input */}
      {method === 'manual' && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center',
          marginBottom: 20, padding: '16px 0',
        }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{ fontFamily: fonts.mono, fontSize: 9, color: C.textMuted, width: 40, textAlign: 'right', paddingTop: 4 }}>
              Right
            </div>
            {manualMarks.slice(0, 4).map((m, i) => (
              <button key={i} onClick={() => toggleManualMark(i)} style={{
                width: 36, height: 36, background: 'rgba(20, 16, 30, 0.5)',
                border: `1px solid ${C.border}`, borderRadius: 4,
                color: C.textBright, fontFamily: fonts.mono, fontSize: 16, cursor: 'pointer',
              }}>
                {(m || 1) === 1 ? '|' : '||'}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{ fontFamily: fonts.mono, fontSize: 9, color: C.textMuted, width: 40, textAlign: 'right', paddingTop: 4 }}>
              Left
            </div>
            {manualMarks.slice(4, 8).map((m, i) => (
              <button key={i + 4} onClick={() => toggleManualMark(i + 4)} style={{
                width: 36, height: 36, background: 'rgba(20, 16, 30, 0.5)',
                border: `1px solid ${C.border}`, borderRadius: 4,
                color: C.textBright, fontFamily: fonts.mono, fontSize: 16, cursor: 'pointer',
              }}>
                {(m || 1) === 1 ? '|' : '||'}
              </button>
            ))}
          </div>
        </div>
      )}

      <button onClick={handleCast} disabled={casting} style={{
        display: 'block', width: '100%', maxWidth: 240, margin: '0 auto 32px',
        padding: '14px 24px', background: `${color}15`, border: `1px solid ${color}30`,
        borderRadius: 8, color, fontFamily: fonts.mono, fontSize: 12,
        letterSpacing: '3px', textTransform: 'uppercase', cursor: casting ? 'wait' : 'pointer',
        opacity: casting ? 0.5 : 1,
      }}>
        {casting ? '...' : method === 'manual' ? 'Read' : 'Cast'}
      </button>

      {/* Results */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Composite */}
          {result.composite && (
            <GlassCard glow={`${color}30`} style={{
              textAlign: 'center', borderColor: `${color}30`,
            }}>
              <div style={{
                fontFamily: fonts.mono, fontSize: 9, color: C.textMuted,
                letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6,
              }}>
                Composite Odù
              </div>
              <div style={{
                fontFamily: fonts.serif, fontSize: 22, color: C.gold,
                marginBottom: 4, filter: `drop-shadow(0 0 8px ${C.gold}30)`,
              }}>
                {result.composite.name}
              </div>
              {result.composite.isOmo !== undefined && (
                <div style={{ fontFamily: fonts.mono, fontSize: 9, color: C.textMuted }}>
                  {result.composite.isOmo ? 'Omo (derivative)' : 'Meji (paired principal)'}
                </div>
              )}
            </GlassCard>
          )}

          {/* Right and Left legs */}
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { label: 'Right Leg', data: result.right },
              { label: 'Left Leg', data: result.left },
            ].map(leg => leg.data?.odu && (
              <GlassCard key={leg.label} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  fontFamily: fonts.mono, fontSize: 9, color: C.textMuted,
                  letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 6,
                }}>
                  {leg.label}
                </div>
                <div style={{ fontFamily: fonts.serif, fontSize: 16, color, marginBottom: 4 }}>
                  {leg.data.odu.name}
                </div>
                <div style={{
                  fontFamily: fonts.mono, fontSize: 14, color: C.textDim, marginBottom: 4,
                }}>
                  {leg.data.marks?.map(m => m === 1 ? '|' : '||').join(' ')}
                </div>
                {leg.data.odu.rank && (
                  <div style={{ fontFamily: fonts.mono, fontSize: 9, color: C.textMuted }}>
                    Rank {leg.data.odu.rank}
                  </div>
                )}
                {leg.data.odu.keywords && (
                  <div style={{
                    fontFamily: fonts.serif, fontSize: 11, color: C.textDim, marginTop: 6,
                  }}>
                    {Array.isArray(leg.data.odu.keywords) ? leg.data.odu.keywords.join(', ') : leg.data.odu.keywords}
                  </div>
                )}
              </GlassCard>
            ))}
          </div>

          {/* Orisha associations */}
          {result.right?.odu?.name && (() => {
            try {
              const orisha = instance.orishaFor(result.right.odu.name)
              if (orisha && orisha.length > 0) {
                return (
                  <GlassCard style={{ borderColor: `${color}15` }}>
                    <div style={{
                      fontFamily: fonts.mono, fontSize: 9, color: C.textMuted,
                      letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 6,
                    }}>
                      Orisha Associations
                    </div>
                    <div style={{
                      fontFamily: fonts.serif, fontSize: 13, color: C.textBright,
                    }}>
                      {orisha.map(o => typeof o === 'string' ? o : o.name).join(', ')}
                    </div>
                  </GlassCard>
                )
              }
            } catch { /* skip */ }
            return null
          })()}
        </div>
      )}
    </div>
  )
}
