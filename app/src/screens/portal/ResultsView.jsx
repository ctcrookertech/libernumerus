import { useState } from 'react'
import registry, { SYSTEM_COLORS } from '../../utils/system-registry'
import { C, fonts } from '../../utils/theme'
import GlassCard from '../../components/GlassCard'
import VortexRing from '../../components/VortexRing'
import DrillDownModal from '../../components/DrillDownModal'

/**
 * Extract displayable result items from a system's analyze() output.
 */
function extractResults(systemId, result) {
  if (!result || result.error) return []
  const items = []

  // Pythagorean
  if (result.lifePath) {
    items.push({ label: 'Life Path', value: result.lifePath.value, primary: true, detail: result.lifePath })
  }
  if (result.expression) {
    items.push({ label: 'Expression', value: result.expression.value, primary: !result.lifePath, detail: result.expression })
  }
  if (result.soulUrge) {
    items.push({ label: 'Soul Urge', value: result.soulUrge.value, detail: result.soulUrge })
  }
  if (result.personality) {
    items.push({ label: 'Personality', value: result.personality.value, detail: result.personality })
  }
  if (result.pinnacles) {
    items.push({ label: 'Pinnacles', value: result.pinnacles.map(p => p.value).join(' · '), detail: result.pinnacles })
  }
  if (result.challenges) {
    items.push({ label: 'Challenges', value: result.challenges.map(c => c.value).join(' · '), detail: result.challenges })
  }

  // Hebrew Gematria
  if (result.standard !== undefined) {
    items.push({ label: 'Standard', value: result.standard, primary: true, detail: result })
    if (result.katan !== undefined) items.push({ label: 'Katan', value: result.katan, detail: result })
    if (result.ordinal !== undefined) items.push({ label: 'Ordinal', value: result.ordinal, detail: result })
    if (result.kolel !== undefined) items.push({ label: 'Kolel', value: result.kolel, detail: result })
    if (result.gadol) items.push({ label: 'Gadol', value: result.gadol, detail: result })
  }

  // Chaldean
  if (result.nameVibration) {
    items.push({ label: 'Name Vibration', value: result.nameVibration.reduced, primary: true, detail: result.nameVibration })
    if (result.nameVibration.compound) {
      items.push({ label: 'Compound', value: result.nameVibration.compound, detail: result.nameVibration })
    }
  }
  if (result.birthNumber) {
    items.push({ label: 'Birth Number', value: result.birthNumber.value, primary: true, detail: result.birthNumber })
  }

  // Vedic
  if (result.psychicNumber) {
    items.push({ label: 'Psychic Number', value: result.psychicNumber.value, primary: true, detail: result.psychicNumber })
  }
  if (result.destinyNumber) {
    items.push({ label: 'Destiny Number', value: result.destinyNumber.value, primary: true, detail: result.destinyNumber })
  }
  if (result.nameNumber) {
    items.push({ label: 'Name Number', value: result.nameNumber.value, primary: true, detail: result.nameNumber })
  }

  // Tarot
  if (result.birthCard) {
    items.push({ label: 'Birth Card', value: `${result.birthCard.value} · ${result.birthCard.card?.name}`, primary: true, detail: result.birthCard })
  }
  if (result.yearCard) {
    items.push({ label: 'Year Card', value: `${result.yearCard.value} · ${result.yearCard.card?.name}`, detail: result.yearCard })
  }

  // Chinese
  if (result.score !== undefined) {
    items.push({ label: 'Auspiciousness', value: result.auspiciousness || result.score, primary: true, detail: result })
  }

  // Mayan
  if (result.longCount) {
    items.push({ label: 'Long Count', value: result.longCount, primary: true, detail: result })
  }
  if (result.tzolkin) {
    items.push({ label: 'Tzolkin', value: `${result.tzolkin.number} ${result.tzolkin.sign?.name || result.tzolkin.signName}`, detail: result.tzolkin })
  }
  if (result.haab) {
    items.push({ label: 'Haab', value: `${result.haab.day} ${result.haab.monthName}`, detail: result.haab })
  }

  // Norse Runic
  if (result.nameValue !== undefined) {
    items.push({ label: 'Name Value', value: result.nameValue, primary: true, detail: result })
  }
  if (result.rune) {
    items.push({ label: 'Rune', value: `${result.rune.char} ${result.rune.name}`, primary: true, detail: result.rune })
  }

  // Celtic Ogham
  if (result.sum !== undefined && result.oghamString !== undefined) {
    items.push({ label: 'Ogham Value', value: result.sum, primary: true, detail: result })
  }

  // Japanese
  if (result.seimei) {
    items.push({ label: 'Seimei Handan', value: result.seimei?.totalLuck?.value || '', primary: true, detail: result.seimei })
  }

  // Neoplatonic
  if (result.decadPrinciple) {
    items.push({ label: 'Decad Principle', value: result.decadPrinciple.name, primary: true, detail: result })
  }
  if (result.properties) {
    const props = []
    if (result.properties.isPrime) props.push('Prime')
    if (result.properties.isPerfect) props.push('Perfect')
    if (result.properties.isTriangular) props.push('Triangular')
    if (props.length) items.push({ label: 'Properties', value: props.join(', '), detail: result.properties })
  }

  // Christian
  if (result.meaning) {
    items.push({ label: 'Biblical Meaning', value: result.meaning.theme || String(result.meaning.number), primary: true, detail: result })
  }
  if (result.augustinian) {
    items.push({ label: 'Augustinian', value: result.augustinian.type || '', detail: result.augustinian })
  }

  // Egyptian
  if (result.hieroglyphic) {
    items.push({ label: 'Hieroglyphic', value: result.hieroglyphic, primary: true, detail: result })
  }
  if (result.meaning && typeof result.meaning === 'object' && result.meaning.deity) {
    items.push({ label: 'Meaning', value: result.meaning.deity || result.meaning.theme, primary: true, detail: result.meaning })
  }

  // Thelemic
  if (result.english) {
    items.push({ label: 'English Qabalah', value: result.english, primary: true, detail: result })
  }
  if (result.hebrew !== undefined && typeof result.hebrew === 'number') {
    items.push({ label: 'Hebrew Value', value: result.hebrew, detail: result })
  }

  // Arabic Abjad
  if (result.abjad !== undefined) {
    items.push({ label: 'Abjad Value', value: result.abjad, primary: true, detail: result })
  }

  // Greek Isopsephy
  if (result.isopsephicValue !== undefined) {
    items.push({ label: 'Isopsephic Value', value: result.isopsephicValue, primary: true, detail: result })
  }

  // Hurufism
  if (result.value !== undefined && systemId === 'hurufism') {
    items.push({ label: 'Letter Value', value: result.value, primary: true, detail: result })
  }

  // Yoruba
  if (result.odu) {
    items.push({ label: 'Odù', value: result.odu.name, primary: true, detail: result })
  }

  // Generic fallback — reduced/meaning
  if (items.length === 0 && result.reduced !== undefined) {
    items.push({ label: 'Reduced', value: result.reduced, primary: true, detail: result })
  }
  if (items.length === 0 && result.value !== undefined) {
    items.push({ label: 'Value', value: result.value, primary: true, detail: result })
  }
  if (items.length === 0 && result.meaning) {
    const val = typeof result.meaning === 'string' ? result.meaning : result.meaning.name || result.meaning.theme || JSON.stringify(result.meaning)
    items.push({ label: 'Meaning', value: val, primary: true, detail: result })
  }

  return items
}

function getMeaning(systemId, value) {
  try {
    const instance = registry.getInstance(systemId)
    if (instance.numberMeaning && typeof value === 'number') {
      return instance.numberMeaning(value)
    }
  } catch { /* */ }
  return null
}

export default function ResultsView({ evaluation, isPremium }) {
  const [drillTarget, setDrillTarget] = useState(null)

  if (!evaluation?.results) return null

  const successResults = evaluation.results.filter(r => !r.error)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Premium convergence summary */}
      {isPremium && successResults.length > 1 && (
        <ConvergenceSummary results={successResults} />
      )}

      {successResults.map(({ systemId, result }) => {
        const sys = registry.get(systemId)
        const color = SYSTEM_COLORS[systemId]
        const items = extractResults(systemId, result)
        if (items.length === 0) return null

        const primary = items.find(i => i.primary)
        const secondary = items.filter(i => !i.primary)

        return (
          <div key={systemId}>
            {/* System header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 8,
              padding: '0 4px',
            }}>
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: color,
              }} />
              <span style={{
                fontFamily: fonts.serif,
                fontSize: 14,
                color,
              }}>
                {sys?.name}
              </span>
              <span style={{
                fontFamily: fonts.mono,
                fontSize: 9,
                color: C.textMuted,
              }}>
                {sys?.era}
              </span>
            </div>

            {/* Primary result with VortexRing */}
            {primary && (
              <GlassCard
                glow={color + '20'}
                onClick={() => setDrillTarget({ systemId, value: primary.value, detail: primary.detail })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  marginBottom: 8,
                  borderColor: `${color}25`,
                }}
              >
                {typeof primary.value === 'number' && (
                  <VortexRing number={primary.value} size={72} color={color} />
                )}
                <div>
                  <div style={{
                    fontFamily: fonts.mono,
                    fontSize: 10,
                    color: C.textMuted,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    marginBottom: 4,
                  }}>
                    {primary.label}
                  </div>
                  <div style={{
                    fontFamily: typeof primary.value === 'number' ? fonts.mono : fonts.serif,
                    fontSize: typeof primary.value === 'number' ? 28 : 18,
                    fontWeight: 300,
                    color: C.textBright,
                  }}>
                    {typeof primary.value === 'number' ? '' : primary.value}
                  </div>
                  {typeof primary.value === 'number' && (() => {
                    const meaning = getMeaning(systemId, primary.value)
                    if (!meaning) return null
                    return (
                      <div style={{
                        fontFamily: fonts.serif,
                        fontSize: 12,
                        color: C.textDim,
                        marginTop: 4,
                      }}>
                        {meaning.name || meaning.title || meaning.theme || ''}
                      </div>
                    )
                  })()}
                </div>
              </GlassCard>
            )}

            {/* Secondary result cards */}
            {secondary.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {secondary.map((item, i) => (
                  <GlassCard
                    key={i}
                    onClick={() => setDrillTarget({ systemId, value: item.value, detail: item.detail })}
                    style={{ padding: '10px 16px' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        fontFamily: fonts.mono,
                        fontSize: 10,
                        color: C.textMuted,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                      }}>
                        {item.label}
                      </span>
                      <span style={{
                        fontFamily: typeof item.value === 'number' ? fonts.mono : fonts.serif,
                        fontSize: 16,
                        color: C.textBright,
                      }}>
                        {item.value}
                      </span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        )
      })}

      {/* Premium upsell for Basic */}
      {!isPremium && evaluation.inputType !== 'divine' && (
        <GlassCard style={{
          borderColor: `${C.purple}20`,
          textAlign: 'center',
          padding: '20px 16px',
        }}>
          <p style={{
            fontFamily: fonts.serif,
            fontSize: 13,
            color: C.textDim,
            margin: '0 0 8px',
          }}>
            See what {registry.forInputType(evaluation.inputType).length - 1} other systems say
          </p>
          <div style={{
            display: 'flex',
            gap: 4,
            justifyContent: 'center',
            flexWrap: 'wrap',
            opacity: 0.4,
          }}>
            {registry.forInputType(evaluation.inputType)
              .filter(s => s.id !== evaluation.primarySystem)
              .slice(0, 8)
              .map(s => (
                <span key={s.id} style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: SYSTEM_COLORS[s.id],
                }} />
              ))}
          </div>
        </GlassCard>
      )}

      {/* DrillDown Modal */}
      {drillTarget && (
        <DrillDownModal
          systemId={drillTarget.systemId}
          value={drillTarget.value}
          detail={drillTarget.detail}
          onClose={() => setDrillTarget(null)}
        />
      )}
    </div>
  )
}

function ConvergenceSummary({ results }) {
  // Find numbers that appear across multiple systems
  const numberMap = {}
  for (const { systemId, result } of results) {
    const items = extractResults(systemId, result)
    for (const item of items) {
      if (typeof item.value === 'number') {
        if (!numberMap[item.value]) numberMap[item.value] = []
        numberMap[item.value].push(systemId)
      }
    }
  }

  const convergences = Object.entries(numberMap)
    .filter(([, systems]) => systems.length >= 3)
    .sort((a, b) => b[1].length - a[1].length)

  if (convergences.length === 0) return null

  return (
    <GlassCard glow="gold" style={{ borderColor: `${C.gold}20` }}>
      <div style={{
        fontFamily: fonts.mono,
        fontSize: 9,
        color: C.goldDim,
        letterSpacing: '1px',
        textTransform: 'uppercase',
        marginBottom: 8,
      }}>
        Convergence
      </div>
      {convergences.map(([num, systems]) => (
        <div key={num} style={{
          fontFamily: fonts.serif,
          fontSize: 13,
          color: C.textBright,
          marginBottom: 4,
        }}>
          <span style={{ color: C.gold, fontFamily: fonts.mono }}>{num}</span>
          {' — '}
          {systems.length} systems agree
          <span style={{ color: C.textMuted, fontSize: 11 }}>
            {' '}({systems.map(id => registry.get(id)?.name).join(', ')})
          </span>
        </div>
      ))}
    </GlassCard>
  )
}
