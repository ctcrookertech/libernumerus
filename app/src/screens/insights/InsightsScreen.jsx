import { useMemo } from 'react'
import { useApp } from '../../stores/app-store'
import registry, { SYSTEM_COLORS } from '../../utils/system-registry'
import { C, fonts } from '../../utils/theme'
import GlassCard from '../../components/GlassCard'
import { computeInsights, computeSystemResonance } from '../../utils/insights-engine'

const INSIGHT_COLORS = {
  cyan: C.cyan,
  green: C.green,
  gold: C.gold,
  purple: C.purple,
}

const INSIGHT_LABELS = {
  frequency: 'Frequency',
  streak: 'Pattern',
  master: 'Master Number',
  karmic: 'Karmic Debt',
  convergence: 'Convergence',
  resonance: 'Resonance',
  temporal: 'Temporal Cycle',
}

export default function InsightsScreen() {
  const { state } = useApp()
  const evaluations = state.evaluations
  const isPremium = state.user.tier === 'premium'

  const insights = useMemo(() => computeInsights(evaluations, isPremium), [evaluations, isPremium])
  const resonance = useMemo(() => isPremium ? computeSystemResonance(evaluations) : null, [evaluations, isPremium])

  return (
    <div style={{ padding: '20px 16px 80px', maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{
        fontFamily: fonts.serif, fontSize: 22, fontWeight: 300,
        color: C.gold, letterSpacing: '2px', textTransform: 'uppercase',
        margin: '0 0 4px',
      }}>
        Insights
      </h1>
      <p style={{
        fontFamily: fonts.serif, fontSize: 12, color: C.textMuted,
        fontStyle: 'italic', margin: '0 0 24px',
      }}>
        Patterns emerging from {evaluations.length} evaluation{evaluations.length !== 1 ? 's' : ''}
      </p>

      {evaluations.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          fontFamily: fonts.serif, fontSize: 14, color: C.textMuted,
          fontStyle: 'italic',
        }}>
          Run some evaluations in the Portal to see insights here.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Number frequency chart */}
          <FrequencyChart evaluations={evaluations} />

          {/* System resonance (Premium) */}
          {isPremium && resonance?.top.length > 0 && (
            <GlassCard glow="purple" style={{ borderColor: `${C.purple}15` }}>
              <div style={{
                fontFamily: fonts.mono, fontSize: 9, color: C.purple,
                letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 10,
              }}>
                System Resonance
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {resonance.top.map(sys => {
                  const maxScore = resonance.top[0]?.score || 1
                  const barWidth = (sys.score / maxScore) * 100
                  return (
                    <div key={sys.systemId} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: SYSTEM_COLORS[sys.systemId],
                        flexShrink: 0,
                      }} />
                      <span style={{
                        fontFamily: fonts.serif, fontSize: 12, color: C.textBright,
                        width: 100, flexShrink: 0,
                      }}>
                        {sys.name}
                      </span>
                      <div style={{ flex: 1, height: 4, background: 'rgba(20, 16, 30, 0.5)', borderRadius: 2 }}>
                        <div style={{
                          width: `${barWidth}%`, height: '100%',
                          background: SYSTEM_COLORS[sys.systemId],
                          borderRadius: 2, transition: 'width 0.3s',
                        }} />
                      </div>
                      <span style={{
                        fontFamily: fonts.mono, fontSize: 9, color: C.textMuted,
                        width: 20, textAlign: 'right',
                      }}>
                        {sys.evaluations}
                      </span>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          )}

          {/* Insight cards */}
          {insights.map((insight, i) => (
            <InsightCard key={i} insight={insight} />
          ))}

          {/* Premium teasers for Basic */}
          {!isPremium && (
            <>
              <GlassCard style={{
                borderColor: `${C.purple}15`,
                padding: '16px 20px',
              }}>
                <div style={{
                  fontFamily: fonts.mono, fontSize: 9, color: C.purple,
                  letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6,
                }}>
                  ⟡ System Resonance
                </div>
                <div style={{
                  fontFamily: fonts.serif, fontSize: 13, color: C.textDim,
                  filter: 'blur(3px)', lineHeight: 1.6,
                }}>
                  Track which traditions resonate most with your inquiries over time.
                  Premium analyzes usage, drill-downs, stars, and view time.
                </div>
              </GlassCard>

              <GlassCard style={{
                borderColor: `${C.gold}15`,
                padding: '16px 20px',
              }}>
                <div style={{
                  fontFamily: fonts.mono, fontSize: 9, color: C.goldDim,
                  letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6,
                }}>
                  ⟡ Cross-System Convergence
                </div>
                <div style={{
                  fontFamily: fonts.serif, fontSize: 13, color: C.textDim,
                  filter: 'blur(3px)', lineHeight: 1.6,
                }}>
                  Discover when three or more traditions produce the same primary
                  number — a strong signal across independent systems.
                </div>
              </GlassCard>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function FrequencyChart({ evaluations }) {
  const freq = useMemo(() => {
    const counts = {}
    for (const e of evaluations) {
      if (!e.results) continue
      for (const r of e.results) {
        if (!r.result) continue
        const nums = extractAllNums(r.result)
        for (const n of nums) {
          if (n >= 1 && n <= 9) {
            counts[n] = (counts[n] || 0) + 1
          }
        }
      }
    }
    return counts
  }, [evaluations])

  const max = Math.max(...Object.values(freq), 1)

  if (Object.keys(freq).length === 0) return null

  return (
    <GlassCard glow="cyan" style={{ borderColor: `${C.cyan}15` }}>
      <div style={{
        fontFamily: fonts.mono, fontSize: 9, color: C.cyan,
        letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12,
      }}>
        Number Frequency (1–9)
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80 }}>
        {Array.from({ length: 9 }, (_, i) => i + 1).map(n => {
          const count = freq[n] || 0
          const height = max > 0 ? (count / max) * 64 : 0
          return (
            <div key={n} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4,
            }}>
              <div style={{
                width: '100%', maxWidth: 20, height,
                background: `linear-gradient(180deg, ${C.cyan}, ${C.cyan}40)`,
                borderRadius: '2px 2px 0 0',
                transition: 'height 0.3s',
              }} />
              <span style={{
                fontFamily: fonts.mono, fontSize: 10,
                color: count > 0 ? C.textBright : C.textMuted,
              }}>
                {n}
              </span>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}

function extractAllNums(result) {
  const nums = []
  if (!result) return nums
  const fields = ['lifePath', 'expression', 'soulUrge', 'personality', 'psychicNumber', 'destinyNumber', 'nameNumber', 'birthCard', 'yearCard', 'nameVibration', 'birthNumber']
  for (const f of fields) {
    if (result[f]?.value !== undefined && typeof result[f].value === 'number') nums.push(result[f].value)
  }
  if (typeof result.standard === 'number') nums.push(result.standard)
  if (typeof result.reduced === 'number') nums.push(result.reduced)
  if (typeof result.value === 'number') nums.push(result.value)
  if (typeof result.sum === 'number') nums.push(result.sum)
  return nums
}

function InsightCard({ insight }) {
  const color = INSIGHT_COLORS[insight.color] || C.textDim
  const label = INSIGHT_LABELS[insight.type] || insight.type

  return (
    <GlassCard style={{
      borderLeft: `3px solid ${color}`,
      borderColor: `${color}20`,
      padding: '14px 16px',
    }}>
      <div style={{
        fontFamily: fonts.mono, fontSize: 9, color,
        letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6,
      }}>
        {label}
        {insight.tier === 'premium' && ' ⟡'}
      </div>
      <div style={{
        fontFamily: fonts.serif, fontSize: 14, color: C.textBright, marginBottom: 4,
      }}>
        {insight.title}
      </div>
      <div style={{
        fontFamily: fonts.serif, fontSize: 12, color: C.textDim, lineHeight: 1.6,
      }}>
        {insight.body}
      </div>
    </GlassCard>
  )
}
