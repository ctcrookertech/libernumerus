import { useState, useMemo } from 'react'
import registry, { SYSTEM_COLORS } from '../utils/system-registry'
import { C, fonts, glass } from '../utils/theme'
import ReductionUtils from '@shared/reduction-utils.js'

const LAYERS = [
  { id: 'reduction', label: 'Reduction Path' },
  { id: 'letters', label: 'Letter Mapping' },
  { id: 'meaning', label: 'System Meaning' },
  { id: 'math', label: 'Mathematical Properties' },
  { id: 'cross', label: 'Cross-System View', premium: true },
  { id: 'deep', label: 'Deep Dive' },
]

export default function DrillDownModal({ systemId, value, detail, onClose }) {
  const [expanded, setExpanded] = useState(new Set(['meaning']))
  const numericValue = typeof value === 'number' ? value : parseInt(value, 10)
  const isNumeric = !isNaN(numericValue) && numericValue > 0

  function toggleLayer(id) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const meaning = useMemo(() => {
    if (!isNumeric) return null
    try {
      const instance = registry.getInstance(systemId)
      return instance.numberMeaning?.(numericValue)
    } catch { return null }
  }, [systemId, numericValue, isNumeric])

  const mathProps = useMemo(() => {
    if (!isNumeric || numericValue <= 0) return null
    try {
      return {
        isPrime: ReductionUtils.isPrime(numericValue),
        isTriangular: ReductionUtils.isTriangular(numericValue),
        isPerfect: ReductionUtils.isPerfect(numericValue),
        isSquare: ReductionUtils.isSquare(numericValue),
        isCubic: ReductionUtils.isCubic(numericValue),
        isAbundant: ReductionUtils.isAbundant(numericValue),
        isDeficient: ReductionUtils.isDeficient(numericValue),
        factors: ReductionUtils.factors(numericValue),
        digitSum: ReductionUtils.digitSum(numericValue),
        reductionPath: ReductionUtils.reductionPath(numericValue),
      }
    } catch { return null }
  }, [numericValue, isNumeric])

  const crossSystem = useMemo(() => {
    if (!isNumeric) return []
    const results = []
    for (const sys of registry.all()) {
      if (sys.id === systemId) continue
      try {
        const instance = registry.getInstance(sys.id)
        const m = instance.numberMeaning?.(numericValue)
        if (m) results.push({ systemId: sys.id, name: sys.name, meaning: m })
      } catch { /* skip */ }
    }
    return results
  }, [systemId, numericValue, isNumeric])

  // Extract reduction path from detail if available
  const reductionPath = detail?.reductionPath || mathProps?.reductionPath || []

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(5, 3, 10, 0.9)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: 0,
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0d0b16',
          border: `1px solid ${C.border}`,
          borderRadius: '16px 16px 0 0',
          width: '100%',
          maxWidth: 480,
          maxHeight: '85vh',
          overflow: 'auto',
          padding: '24px 20px 40px',
          animation: 'slideUp 0.2s ease',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 20,
        }}>
          <div>
            <div style={{
              fontFamily: fonts.mono,
              fontSize: 36,
              fontWeight: 300,
              color: SYSTEM_COLORS[systemId] || C.cyan,
              lineHeight: 1,
            }}>
              {value}
            </div>
            <div style={{
              fontFamily: fonts.serif,
              fontSize: 12,
              color: C.textDim,
              marginTop: 4,
            }}>
              {registry.get(systemId)?.name}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: C.textMuted,
              fontSize: 20,
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Layers */}
        {LAYERS.map(layer => {
          const isExpanded = expanded.has(layer.id)

          return (
            <div key={layer.id} style={{
              marginBottom: 4,
              border: `1px solid ${isExpanded ? C.border : 'transparent'}`,
              borderRadius: 8,
              overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}>
              <button
                onClick={() => toggleLayer(layer.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  background: isExpanded ? `rgba(20, 16, 30, 0.5)` : 'transparent',
                  border: 'none',
                  color: isExpanded ? C.textBright : C.textDim,
                  fontFamily: fonts.mono,
                  fontSize: 10,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <span>{layer.label}</span>
                <span style={{ fontSize: 12, opacity: 0.5 }}>
                  {layer.premium && '⟡ '}
                  {isExpanded ? '−' : '+'}
                </span>
              </button>

              {isExpanded && (
                <div style={{ padding: '8px 12px 12px' }}>
                  {layer.id === 'reduction' && (
                    <ReductionPathView path={reductionPath} numericValue={numericValue} />
                  )}
                  {layer.id === 'letters' && (
                    <LetterMapView detail={detail} systemId={systemId} />
                  )}
                  {layer.id === 'meaning' && (
                    <MeaningView meaning={meaning} detail={detail} />
                  )}
                  {layer.id === 'math' && (
                    <MathView props={mathProps} />
                  )}
                  {layer.id === 'cross' && (
                    <CrossSystemView results={crossSystem} />
                  )}
                  {layer.id === 'deep' && (
                    <DeepDiveView detail={detail} systemId={systemId} />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ReductionPathView({ path, numericValue }) {
  if (!path || path.length === 0) {
    if (numericValue) {
      try {
        const p = ReductionUtils.reductionPath(numericValue)
        if (p.length > 1) {
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {p.map((step, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontFamily: fonts.mono,
                    fontSize: i === p.length - 1 ? 20 : 14,
                    color: i === p.length - 1 ? C.cyan : C.textDim,
                  }}>
                    {step}
                  </span>
                  {i < p.length - 1 && (
                    <span style={{ color: C.textMuted, fontSize: 12 }}>→</span>
                  )}
                </span>
              ))}
            </div>
          )
        }
      } catch { /* */ }
    }
    return <EmptyState text="No reduction steps" />
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      {path.map((step, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontFamily: fonts.mono,
            fontSize: i === path.length - 1 ? 20 : 14,
            color: i === path.length - 1 ? C.cyan : C.textDim,
          }}>
            {step}
          </span>
          {i < path.length - 1 && (
            <span style={{ color: C.textMuted, fontSize: 12 }}>→</span>
          )}
        </span>
      ))}
    </div>
  )
}

function LetterMapView({ detail, systemId }) {
  // Show letter breakdown if available
  if (detail?.letters || detail?.breakdown) {
    const items = detail.letters || detail.breakdown || []
    if (Array.isArray(items) && items.length > 0) {
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {items.map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '6px 8px',
              background: 'rgba(20, 16, 30, 0.4)',
              borderRadius: 4,
              minWidth: 32,
            }}>
              <span style={{ fontFamily: fonts.serif, fontSize: 14, color: C.textBright }}>
                {item.char || item.letter || item.rune}
              </span>
              <span style={{ fontFamily: fonts.mono, fontSize: 10, color: C.cyan }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )
    }
  }

  // Try to reconstruct from detail.total and detail.name
  if (detail?.total && detail?.name) {
    return (
      <div style={{ fontFamily: fonts.serif, fontSize: 13, color: C.textDim }}>
        "{detail.name}" = {detail.total}
      </div>
    )
  }

  return <EmptyState text="Letter mapping not available for this result type" />
}

function MeaningView({ meaning, detail }) {
  if (!meaning && !detail) return <EmptyState text="No meaning entry" />

  const m = meaning || {}
  return (
    <div style={{ fontFamily: fonts.serif, fontSize: 13, color: C.textBright, lineHeight: 1.7 }}>
      {m.name && (
        <div style={{
          fontWeight: 600,
          color: C.gold,
          fontSize: 14,
          marginBottom: 6,
        }}>
          {m.name || m.title}
        </div>
      )}
      {m.keywords && (
        <div style={{ color: C.textDim, fontSize: 12, marginBottom: 8 }}>
          {typeof m.keywords === 'string' ? m.keywords : m.keywords.join(', ')}
        </div>
      )}
      {m.description && <p style={{ margin: 0 }}>{m.description}</p>}
      {m.theme && <p style={{ margin: 0 }}>{m.theme}</p>}
      {m.text && <p style={{ margin: 0 }}>{m.text}</p>}
    </div>
  )
}

function MathView({ props }) {
  if (!props) return <EmptyState text="Enter a number to see properties" />

  const labels = []
  if (props.isPrime) labels.push({ text: 'Prime', color: C.cyan })
  if (props.isPerfect) labels.push({ text: 'Perfect', color: C.gold })
  if (props.isTriangular) labels.push({ text: 'Triangular', color: C.green })
  if (props.isSquare) labels.push({ text: 'Square', color: C.purple })
  if (props.isCubic) labels.push({ text: 'Cubic', color: '#EA580C' })
  if (props.isAbundant) labels.push({ text: 'Abundant', color: '#D97706' })
  if (props.isDeficient) labels.push({ text: 'Deficient', color: C.textDim })

  return (
    <div>
      {labels.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {labels.map(l => (
            <span key={l.text} style={{
              fontFamily: fonts.mono,
              fontSize: 9,
              color: l.color,
              background: `${l.color}15`,
              border: `1px solid ${l.color}30`,
              padding: '3px 8px',
              borderRadius: 4,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}>
              {l.text}
            </span>
          ))}
        </div>
      )}
      {props.factors && props.factors.length > 0 && (
        <div style={{
          fontFamily: fonts.mono,
          fontSize: 11,
          color: C.textDim,
        }}>
          Factors: {props.factors.join(', ')}
        </div>
      )}
      {props.digitSum !== undefined && (
        <div style={{
          fontFamily: fonts.mono,
          fontSize: 11,
          color: C.textDim,
          marginTop: 4,
        }}>
          Digit sum: {props.digitSum}
        </div>
      )}
    </div>
  )
}

function CrossSystemView({ results }) {
  if (results.length === 0) return <EmptyState text="No cross-system meanings found" />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {results.map(({ systemId, name, meaning }) => (
        <div key={systemId} style={{
          padding: '8px 10px',
          background: 'rgba(20, 16, 30, 0.3)',
          borderRadius: 6,
          borderLeft: `2px solid ${SYSTEM_COLORS[systemId] || C.textMuted}`,
        }}>
          <div style={{
            fontFamily: fonts.mono,
            fontSize: 9,
            color: SYSTEM_COLORS[systemId] || C.textDim,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}>
            {name}
          </div>
          <div style={{
            fontFamily: fonts.serif,
            fontSize: 12,
            color: C.textBright,
            lineHeight: 1.5,
          }}>
            {meaning.name || meaning.title || meaning.theme || meaning.description || JSON.stringify(meaning)}
          </div>
        </div>
      ))}
    </div>
  )
}

function DeepDiveView({ detail, systemId }) {
  if (!detail) return <EmptyState text="No additional details" />

  // Show raw detail data in a readable way
  const entries = Object.entries(detail).filter(([k, v]) =>
    v !== undefined && v !== null && k !== 'reductionPath' && k !== 'letters' && k !== 'breakdown'
  )

  if (entries.length === 0) return <EmptyState text="No additional details" />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {entries.map(([key, val]) => (
        <div key={key} style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
          padding: '4px 0',
          borderBottom: `1px solid ${C.border}`,
        }}>
          <span style={{
            fontFamily: fonts.mono,
            fontSize: 10,
            color: C.textMuted,
            textTransform: 'uppercase',
            flexShrink: 0,
          }}>
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </span>
          <span style={{
            fontFamily: fonts.serif,
            fontSize: 12,
            color: C.textBright,
            textAlign: 'right',
            wordBreak: 'break-word',
          }}>
            {typeof val === 'object' ? JSON.stringify(val) : String(val)}
          </span>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ text }) {
  return (
    <div style={{
      fontFamily: fonts.serif,
      fontSize: 12,
      color: C.textMuted,
      fontStyle: 'italic',
      padding: '8px 0',
    }}>
      {text}
    </div>
  )
}
