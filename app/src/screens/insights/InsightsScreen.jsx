import { useMemo } from 'react'
import { useApp } from '../../stores/app-store'
import registry, { SYSTEM_COLORS } from '../../utils/system-registry'
import { C, fonts } from '../../utils/theme'
import GlassCard from '../../components/GlassCard'

export default function InsightsScreen() {
  const { state } = useApp()
  const evaluations = state.evaluations
  const isPremium = state.user.tier === 'premium'

  const insights = useMemo(() => {
    return computeInsights(evaluations, isPremium)
  }, [evaluations, isPremium])

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

          {/* Insight cards */}
          {insights.map((insight, i) => (
            <InsightCard key={i} insight={insight} isPremium={isPremium} />
          ))}

          {/* Premium teasers */}
          {!isPremium && (
            <>
              <GlassCard style={{
                borderColor: `${C.purple}15`,
                padding: '16px 20px',
                position: 'relative',
                overflow: 'hidden',
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
                  Premium insight analyzes usage, drill-downs, stars, and view time.
                </div>
              </GlassCard>

              <GlassCard style={{
                borderColor: `${C.gold}15`,
                padding: '16px 20px',
                position: 'relative',
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
                  Discover when three or more traditions produce the same primary number
                  for your input — a strong signal across independent systems.
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
        // Extract numbers from results
        const nums = extractNumbers(r.result)
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

function extractNumbers(result) {
  const nums = []
  const extract = (obj) => {
    if (typeof obj === 'number' && obj > 0 && obj < 100) nums.push(obj)
    if (typeof obj === 'object' && obj) {
      for (const key of ['value', 'reduced', 'final', 'lifePath', 'expression', 'soulUrge', 'personality']) {
        if (obj[key]?.value !== undefined) nums.push(obj[key].value)
        else if (typeof obj[key] === 'number') nums.push(obj[key])
      }
    }
  }
  extract(result)
  return nums
}

function computeInsights(evaluations, isPremium) {
  const insights = []

  if (evaluations.length < 2) return insights

  // Streak detection
  const recentValues = []
  for (const e of evaluations.slice(0, 10)) {
    if (!e.results) continue
    for (const r of e.results) {
      const nums = extractNumbers(r.result)
      recentValues.push(...nums.filter(n => n >= 1 && n <= 9))
    }
  }

  const valueCounts = {}
  for (const v of recentValues) {
    valueCounts[v] = (valueCounts[v] || 0) + 1
  }

  // Most frequent
  const sorted = Object.entries(valueCounts).sort((a, b) => b[1] - a[1])
  if (sorted.length > 0 && sorted[0][1] >= 3) {
    insights.push({
      type: 'streak',
      color: C.green,
      title: `${sorted[0][0]} appears ${sorted[0][1]} times`,
      body: `The number ${sorted[0][0]} is recurring across your recent evaluations. This may indicate a dominant theme.`,
    })
  }

  // Master Number detection
  for (const e of evaluations.slice(0, 5)) {
    if (!e.results) continue
    for (const r of e.results) {
      const result = r.result
      if (result?.lifePath?.value && [11, 22, 33].includes(result.lifePath.value)) {
        insights.push({
          type: 'master',
          color: C.gold,
          title: `Master Number ${result.lifePath.value} detected`,
          body: `Your Life Path contains Master Number ${result.lifePath.value}. This carries heightened potential and responsibility.`,
        })
        break
      }
    }
  }

  // System diversity
  const systemsUsed = new Set()
  for (const e of evaluations) {
    if (e.systems) e.systems.forEach(s => systemsUsed.add(s))
    if (e.primarySystem) systemsUsed.add(e.primarySystem)
  }

  if (systemsUsed.size >= 5) {
    insights.push({
      type: 'frequency',
      color: C.cyan,
      title: `${systemsUsed.size} systems explored`,
      body: `You've worked with ${systemsUsed.size} of 18 available traditions. Each offers a unique lens on the same inquiry.`,
    })
  }

  return insights
}

function InsightCard({ insight, isPremium }) {
  return (
    <GlassCard style={{
      borderLeft: `3px solid ${insight.color}`,
      borderColor: `${insight.color}20`,
      padding: '14px 16px',
    }}>
      <div style={{
        fontFamily: fonts.mono, fontSize: 9, color: insight.color,
        letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6,
      }}>
        {insight.type === 'streak' ? 'Pattern' : insight.type === 'master' ? 'Alert' : 'Frequency'}
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
