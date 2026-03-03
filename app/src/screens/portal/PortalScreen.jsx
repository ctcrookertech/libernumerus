import { useState, useMemo } from 'react'
import { useApp, useEvaluations } from '../../stores/app-store'
import registry, { SYSTEM_COLORS } from '../../utils/system-registry'
import { C, fonts, glass } from '../../utils/theme'
import GlassCard from '../../components/GlassCard'
import VortexRing from '../../components/VortexRing'
import ResultsView from './ResultsView'
import SystemPicker from './SystemPicker'

const INPUT_MODES = [
  { id: 'name', label: 'NAME' },
  { id: 'date', label: 'DATE' },
  { id: 'number', label: 'NUMBER' },
  { id: 'divine', label: 'DIVINE' },
]

export default function PortalScreen() {
  const { state, dispatch } = useApp()
  const { addEvaluation } = useEvaluations()
  const [inputValue, setInputValue] = useState('')
  const [dateValue, setDateValue] = useState('')
  const [numberValue, setNumberValue] = useState('')
  const [results, setResults] = useState(null)
  const [showSystemPicker, setShowSystemPicker] = useState(false)
  const [evaluating, setEvaluating] = useState(false)

  const activeSys = registry.get(state.activeSystem)
  const isPremium = state.user.tier === 'premium'
  const inputMode = state.inputMode

  // Check if current system supports current input mode
  const compatible = activeSys?.inputTypes.includes(inputMode)
  const showDivine = activeSys?.hasDivination

  // Get letter values for real-time display in NAME mode
  const letterValues = useMemo(() => {
    if (inputMode !== 'name' || !inputValue) return []
    try {
      const instance = registry.getInstance(state.activeSystem)
      if (!instance.letterValue) return []
      return inputValue.split('').map(ch => {
        if (/\s/.test(ch)) return { char: ch, value: null }
        try {
          return { char: ch, value: instance.letterValue(ch) }
        } catch {
          return { char: ch, value: null }
        }
      })
    } catch {
      return []
    }
  }, [inputValue, inputMode, state.activeSystem])

  function handleEvaluate() {
    if (evaluating) return
    setEvaluating(true)

    try {
      let input
      if (inputMode === 'name') {
        input = inputValue.trim()
        if (!input) return
      } else if (inputMode === 'date') {
        if (!dateValue) return
        const parts = dateValue.split('-')
        input = new Date(+parts[0], +parts[1] - 1, +parts[2])
      } else if (inputMode === 'number') {
        input = parseInt(numberValue, 10)
        if (isNaN(input)) return
      } else {
        return
      }

      let evaluationResults
      if (isPremium) {
        evaluationResults = registry.evaluateAll(inputMode, input, state.systemPresets)
      } else {
        const result = registry.evaluate(state.activeSystem, input, state.systemPresets[state.activeSystem])
        evaluationResults = [result]
      }

      const evaluation = {
        inputType: inputMode,
        input: inputMode === 'date' ? dateValue : inputMode === 'number' ? numberValue : inputValue,
        results: evaluationResults,
        systems: evaluationResults.map(r => r.systemId),
        primarySystem: state.activeSystem,
      }

      addEvaluation(evaluation)
      setResults(evaluation)
    } catch (e) {
      console.error('Evaluation error:', e)
    } finally {
      setEvaluating(false)
    }
  }

  function handleModeChange(mode) {
    dispatch({ type: 'SET_INPUT_MODE', mode })
    setResults(null)
  }

  return (
    <div style={{ padding: '20px 16px 80px', maxWidth: 600, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          marginBottom: 6,
        }}>
          {/* Logo icon: inverted pentagon + 8-pointed star + inner triangle */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, position: 'relative', top: 1 }}>
            <polygon
              points={[0,1,2,3,4].map(i => {
                const a = (i * 72 + 90) * Math.PI / 180
                return `${12 + 10.5 * Math.cos(a)},${12 + 10.5 * Math.sin(a)}`
              }).join(' ')}
              fill="none" stroke={C.gold} strokeWidth="1" opacity="0.9"
            />
            <rect x={6.5} y={6.5} width={11} height={11}
              fill="none" stroke={C.gold} strokeWidth="0.8" opacity="0.9"
            />
            <rect x={6.5} y={6.5} width={11} height={11}
              fill="none" stroke={C.gold} strokeWidth="0.8" opacity="0.9"
              transform="rotate(45 12 12)"
            />
            <polygon
              points="12,7 16.33,14.5 7.67,14.5"
              fill={C.gold} fillOpacity="0.2" stroke={C.gold} strokeWidth="0.7" opacity="0.9"
            />
          </svg>
          <h1 style={{
            fontFamily: fonts.display,
            fontSize: 18,
            fontWeight: 700,
            color: C.gold,
            letterSpacing: '2px',
            margin: 0,
            textShadow: `0 0 12px rgba(245,230,190,0.5), 0 0 30px rgba(245,230,190,0.2)`,
          }}>
            Liber Numerus
          </h1>
        </div>
        <p style={{
          fontFamily: fonts.heading,
          fontSize: 11,
          fontWeight: 500,
          color: C.goldDim,
          opacity: 0.7,
          letterSpacing: '1.5px',
          margin: 0,
        }}>
          The Book of Numbers
        </p>
      </div>

      {/* System selector */}
      <button
        onClick={() => setShowSystemPicker(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          margin: '0 auto 16px',
          padding: '6px 16px',
          background: 'rgba(20, 16, 30, 0.6)',
          border: `1px solid ${SYSTEM_COLORS[state.activeSystem]}40`,
          borderRadius: 20,
          color: SYSTEM_COLORS[state.activeSystem],
          fontFamily: fonts.mono,
          fontSize: 11,
          letterSpacing: '0.5px',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
        }}
      >
        <span style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: SYSTEM_COLORS[state.activeSystem],
          boxShadow: `0 0 8px ${SYSTEM_COLORS[state.activeSystem]}60`,
        }} />
        {activeSys?.name}
        {!isPremium && <span style={{ color: C.textMuted }}>▾</span>}
      </button>

      {/* Input mode tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 4,
        marginBottom: 16,
      }}>
        {INPUT_MODES.filter(m => m.id !== 'divine' || showDivine).map(mode => (
          <button
            key={mode.id}
            onClick={() => handleModeChange(mode.id)}
            style={{
              padding: '6px 16px',
              background: inputMode === mode.id ? `${C.cyan}15` : 'transparent',
              border: `1px solid ${inputMode === mode.id ? C.cyan + '40' : C.border}`,
              borderRadius: 6,
              color: inputMode === mode.id ? C.cyan : C.textMuted,
              fontFamily: fonts.mono,
              fontSize: 10,
              letterSpacing: '1px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Input area */}
      <GlassCard style={{ marginBottom: 20 }}>
        {inputMode === 'name' && (
          <>
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleEvaluate()}
              placeholder="Enter a name or word..."
              style={{
                ...glass.input,
                width: '100%',
                padding: '12px 16px',
                fontSize: 18,
                fontFamily: fonts.serif,
                letterSpacing: '1px',
                outline: 'none',
              }}
            />
            {/* Real-time letter values */}
            {letterValues.length > 0 && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                marginTop: 12,
                justifyContent: 'center',
              }}>
                {letterValues.map((lv, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: 24,
                    padding: '4px 2px',
                  }}>
                    <span style={{
                      fontFamily: fonts.serif,
                      fontSize: 16,
                      color: C.textBright,
                    }}>
                      {lv.char === ' ' ? '\u00A0' : lv.char}
                    </span>
                    {lv.value !== null && (
                      <span style={{
                        fontFamily: fonts.mono,
                        fontSize: 10,
                        color: C.cyan,
                        opacity: 0.7,
                      }}>
                        {lv.value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {inputMode === 'date' && (
          <input
            type="date"
            value={dateValue}
            onChange={e => setDateValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleEvaluate()}
            style={{
              ...glass.input,
              width: '100%',
              padding: '12px 16px',
              fontSize: 16,
              fontFamily: fonts.mono,
              colorScheme: 'dark',
              outline: 'none',
            }}
          />
        )}

        {inputMode === 'number' && (
          <input
            type="number"
            value={numberValue}
            onChange={e => setNumberValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleEvaluate()}
            placeholder="Enter a number..."
            style={{
              ...glass.input,
              width: '100%',
              padding: '12px 16px',
              fontSize: 24,
              fontFamily: fonts.mono,
              letterSpacing: '2px',
              textAlign: 'center',
              outline: 'none',
            }}
          />
        )}

        {inputMode === 'divine' && (
          <div style={{
            textAlign: 'center',
            padding: '20px 0',
            color: C.textDim,
            fontFamily: fonts.serif,
            fontSize: 14,
          }}>
            Divination mode — tap Evaluate to enter the casting flow
          </div>
        )}

        {/* Incompatibility notice */}
        {!compatible && inputMode !== 'divine' && (
          <div style={{
            marginTop: 8,
            padding: '8px 12px',
            background: `${C.gold}10`,
            border: `1px solid ${C.gold}20`,
            borderRadius: 6,
            color: C.goldDim,
            fontSize: 12,
            fontFamily: fonts.serif,
          }}>
            {activeSys?.name} doesn't support {inputMode} input.{' '}
            <button
              onClick={() => setShowSystemPicker(true)}
              style={{
                background: 'none',
                border: 'none',
                color: C.cyan,
                cursor: 'pointer',
                fontFamily: fonts.serif,
                fontSize: 12,
                textDecoration: 'underline',
                padding: 0,
              }}
            >
              Switch system
            </button>
          </div>
        )}
      </GlassCard>

      {/* Evaluate button */}
      <button
        onClick={handleEvaluate}
        disabled={evaluating || (!compatible && inputMode !== 'divine')}
        style={{
          display: 'block',
          width: '100%',
          maxWidth: 280,
          margin: '0 auto 24px',
          padding: '12px 24px',
          background: `linear-gradient(135deg, ${C.cyan}20, ${C.green}15)`,
          border: `1px solid ${C.cyan}30`,
          borderRadius: 8,
          color: C.cyan,
          fontFamily: fonts.mono,
          fontSize: 12,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          cursor: evaluating ? 'wait' : 'pointer',
          opacity: evaluating || (!compatible && inputMode !== 'divine') ? 0.4 : 1,
          transition: 'all 0.2s',
          boxShadow: C.glowCyan,
        }}
      >
        {evaluating ? 'Evaluating...' : 'Evaluate'}
      </button>

      {/* Results */}
      {results && <ResultsView evaluation={results} isPremium={isPremium} />}

      {/* System Picker Modal */}
      {showSystemPicker && (
        <SystemPicker
          currentSystem={state.activeSystem}
          inputMode={inputMode}
          onSelect={(id) => {
            dispatch({ type: 'SET_ACTIVE_SYSTEM', systemId: id })
            setShowSystemPicker(false)
            setResults(null)
          }}
          onClose={() => setShowSystemPicker(false)}
        />
      )}
    </div>
  )
}
