/**
 * Insights Engine — algorithmic pattern detection from evaluation history.
 *
 * Basic: number frequency, streak detection, Master Number / Karmic Debt alerts
 * Premium: cross-system convergence, planetary agreement, thematic clustering,
 *          system resonance, temporal cycles
 */

import registry from './system-registry'

/**
 * Extract all numeric results from an evaluation result object.
 */
function extractNumbers(result) {
  const nums = []
  if (!result) return nums

  // Check common fields
  const fields = [
    'lifePath', 'expression', 'soulUrge', 'personality',
    'psychicNumber', 'destinyNumber', 'nameNumber',
    'birthCard', 'yearCard',
    'nameVibration', 'birthNumber',
  ]

  for (const f of fields) {
    if (result[f]?.value !== undefined && typeof result[f].value === 'number') {
      nums.push(result[f].value)
    }
  }

  // Direct value fields
  if (typeof result.standard === 'number') nums.push(result.standard)
  if (typeof result.reduced === 'number') nums.push(result.reduced)
  if (typeof result.value === 'number') nums.push(result.value)
  if (typeof result.sum === 'number') nums.push(result.sum)
  if (typeof result.nameValue === 'number') nums.push(result.nameValue)
  if (typeof result.score === 'number') nums.push(result.score)
  if (typeof result.english === 'number') nums.push(result.english)
  if (typeof result.abjad === 'number') nums.push(result.abjad)
  if (typeof result.isopsephicValue === 'number') nums.push(result.isopsephicValue)

  return nums
}

/**
 * Compute all insights from evaluation history.
 */
export function computeInsights(evaluations, isPremium) {
  const insights = []
  if (!evaluations || evaluations.length < 1) return insights

  // Collect all numbers across all evaluations
  const allNumbers = []
  const systemUsage = {}
  const dateNumbers = {}

  for (const e of evaluations) {
    if (!e.results) continue
    const date = new Date(e.timestamp)
    const dayOfWeek = date.getDay()

    for (const r of e.results) {
      if (!r.result) continue
      const nums = extractNumbers(r.result)
      allNumbers.push(...nums)

      // Track system usage
      systemUsage[r.systemId] = (systemUsage[r.systemId] || 0) + 1

      // Track numbers by day of week
      for (const n of nums) {
        if (n >= 1 && n <= 9) {
          if (!dateNumbers[dayOfWeek]) dateNumbers[dayOfWeek] = {}
          dateNumbers[dayOfWeek][n] = (dateNumbers[dayOfWeek][n] || 0) + 1
        }
      }
    }
  }

  // === BASIC INSIGHTS ===

  // 1. Number frequency (digits 1-9)
  const digitFreq = {}
  for (const n of allNumbers) {
    if (n >= 1 && n <= 9) {
      digitFreq[n] = (digitFreq[n] || 0) + 1
    }
  }
  const sortedDigits = Object.entries(digitFreq).sort((a, b) => b[1] - a[1])
  if (sortedDigits.length > 0) {
    const [topDigit, topCount] = sortedDigits[0]
    insights.push({
      type: 'frequency',
      tier: 'basic',
      color: 'cyan',
      title: `${topDigit} is your most frequent number`,
      body: `Appearing ${topCount} time${topCount !== 1 ? 's' : ''} across your evaluations. ${sortedDigits.length > 1 ? `Followed by ${sortedDigits[1][0]} (${sortedDigits[1][1]} times).` : ''}`,
      relatedNumbers: [parseInt(topDigit)],
    })
  }

  // 2. Streak detection (same number in consecutive evaluations)
  const recentPrimaries = []
  for (const e of evaluations.slice(0, 10)) {
    if (!e.results?.[0]?.result) continue
    const nums = extractNumbers(e.results[0].result)
    const reduced = nums.find(n => n >= 1 && n <= 9)
    if (reduced) recentPrimaries.push(reduced)
  }

  let maxStreak = 1
  let streakNum = recentPrimaries[0]
  let currentStreak = 1
  for (let i = 1; i < recentPrimaries.length; i++) {
    if (recentPrimaries[i] === recentPrimaries[i - 1]) {
      currentStreak++
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak
        streakNum = recentPrimaries[i]
      }
    } else {
      currentStreak = 1
    }
  }

  if (maxStreak >= 3) {
    insights.push({
      type: 'streak',
      tier: 'basic',
      color: 'green',
      title: `${streakNum} appeared ${maxStreak} times consecutively`,
      body: `The number ${streakNum} has appeared as a primary result in ${maxStreak} consecutive evaluations. This sustained pattern may indicate a dominant current theme.`,
      relatedNumbers: [streakNum],
    })
  }

  // 3. Master Number detection
  const masterNumbers = [11, 22, 33]
  for (const n of allNumbers) {
    if (masterNumbers.includes(n)) {
      insights.push({
        type: 'master',
        tier: 'basic',
        color: 'gold',
        title: `Master Number ${n} detected`,
        body: n === 11
          ? 'The Illuminator — heightened intuition, spiritual insight, and visionary idealism.'
          : n === 22
          ? 'The Master Builder — capacity to manifest ambitious visions on a massive scale.'
          : 'The Master Teacher — selfless service, spiritual uplift, the rarest Master Number.',
        relatedNumbers: [n],
      })
      break // Only show one
    }
  }

  // 4. Karmic Debt detection
  const karmicDebtNums = [13, 14, 16, 19]
  for (const n of allNumbers) {
    if (karmicDebtNums.includes(n)) {
      insights.push({
        type: 'karmic',
        tier: 'basic',
        color: 'gold',
        title: `Karmic Debt ${n} present`,
        body: `This number carries lessons from prior cycles that must be addressed in this lifetime.`,
        relatedNumbers: [n],
      })
      break
    }
  }

  // === PREMIUM INSIGHTS ===

  if (!isPremium) return insights

  // 5. Cross-system convergence
  const systemNumberMap = {}
  for (const e of evaluations) {
    if (!e.results) continue
    for (const r of e.results) {
      if (!r.result) continue
      const nums = extractNumbers(r.result)
      for (const n of nums) {
        if (n >= 1 && n <= 9) {
          const key = n
          if (!systemNumberMap[key]) systemNumberMap[key] = new Set()
          systemNumberMap[key].add(r.systemId)
        }
      }
    }
  }

  for (const [num, systems] of Object.entries(systemNumberMap)) {
    if (systems.size >= 3) {
      const sysNames = Array.from(systems).map(id => registry.get(id)?.name).filter(Boolean)
      insights.push({
        type: 'convergence',
        tier: 'premium',
        color: 'gold',
        title: `${systems.size} systems converge on ${num}`,
        body: `${sysNames.join(', ')} all produce ${num} as a result. Cross-traditional agreement strengthens the significance.`,
        relatedNumbers: [parseInt(num)],
        relatedSystems: Array.from(systems),
      })
    }
  }

  // 6. System resonance (based on usage frequency)
  const sortedSystems = Object.entries(systemUsage)
    .sort((a, b) => b[1] - a[1])

  if (sortedSystems.length >= 3) {
    const [topSys, topCount] = sortedSystems[0]
    const topName = registry.get(topSys)?.name || topSys
    insights.push({
      type: 'resonance',
      tier: 'premium',
      color: 'purple',
      title: `Strongest resonance: ${topName}`,
      body: `With ${topCount} evaluations, ${topName} is your most-used tradition. ${sortedSystems.length > 1 ? `Followed by ${registry.get(sortedSystems[1][0])?.name} (${sortedSystems[1][1]}).` : ''}`,
      relatedSystems: [topSys],
    })
  }

  // 7. Temporal cycles (day-of-week patterns)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  for (const [day, nums] of Object.entries(dateNumbers)) {
    const sorted = Object.entries(nums).sort((a, b) => b[1] - a[1])
    if (sorted[0] && sorted[0][1] >= 3) {
      insights.push({
        type: 'temporal',
        tier: 'premium',
        color: 'cyan',
        title: `${sorted[0][0]} recurs on ${dayNames[day]}s`,
        body: `The number ${sorted[0][0]} has appeared ${sorted[0][1]} times in evaluations performed on ${dayNames[day]}s. This may suggest a day-of-week resonance.`,
        relatedNumbers: [parseInt(sorted[0][0])],
      })
    }
  }

  return insights
}

/**
 * Compute system resonance scores for the Insights tab.
 */
export function computeSystemResonance(evaluations) {
  const resonance = {}

  for (const sys of registry.all()) {
    resonance[sys.id] = {
      name: sys.name,
      evaluations: 0,
      drilldowns: 0,
      stars: 0,
      score: 0,
    }
  }

  for (const e of evaluations) {
    if (!e.results) continue
    for (const r of e.results) {
      if (resonance[r.systemId]) {
        resonance[r.systemId].evaluations++
      }
    }
    if (e.starred && e.primarySystem && resonance[e.primarySystem]) {
      resonance[e.primarySystem].stars++
    }
  }

  // Compute weighted score
  for (const sys of Object.values(resonance)) {
    sys.score = sys.evaluations * 1 + sys.stars * 3 + sys.drilldowns * 0.5
  }

  const sorted = Object.entries(resonance)
    .filter(([, v]) => v.score > 0)
    .sort((a, b) => b[1].score - a[1].score)

  return {
    all: resonance,
    top: sorted.slice(0, 5).map(([id, data]) => ({ systemId: id, ...data })),
    emerging: sorted.filter(([, v]) => v.score > 0 && v.score < 3).slice(0, 3).map(([id, data]) => ({ systemId: id, ...data })),
    dormant: Object.entries(resonance).filter(([, v]) => v.score === 0).map(([id, data]) => ({ systemId: id, ...data })),
  }
}
