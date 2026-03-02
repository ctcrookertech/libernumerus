import { useState } from 'react'
import { useApp } from '../../stores/app-store'
import registry, { SYSTEM_COLORS } from '../../utils/system-registry'
import { C, fonts } from '../../utils/theme'
import GlassCard from '../../components/GlassCard'

export default function SettingsScreen() {
  const { state, dispatch } = useApp()
  const [exportStatus, setExportStatus] = useState(null)

  function handleExport() {
    const data = {
      user: state.user,
      evaluations: state.evaluations,
      starredIds: Array.from(state.starredIds),
      systemPresets: state.systemPresets,
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `libernumerus-export-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    setExportStatus('Exported successfully')
    setTimeout(() => setExportStatus(null), 2000)
  }

  return (
    <div style={{ padding: '20px 16px 80px', maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{
        fontFamily: fonts.serif, fontSize: 22, fontWeight: 300,
        color: C.gold, letterSpacing: '2px', textTransform: 'uppercase',
        margin: '0 0 24px',
      }}>
        Settings
      </h1>

      {/* Profile */}
      <Section title="Profile">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={labelStyle}>Name</label>
            <input
              type="text"
              value={state.user.name}
              onChange={e => dispatch({ type: 'SET_USER', data: { name: e.target.value } })}
              placeholder="Your name..."
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Birth Date</label>
            <input
              type="date"
              value={state.user.birthDate || ''}
              onChange={e => dispatch({ type: 'SET_USER', data: { birthDate: e.target.value } })}
              style={{ ...inputStyle, colorScheme: 'dark' }}
            />
          </div>
        </div>
      </Section>

      {/* Mode */}
      <Section title="Mode">
        <div style={{ display: 'flex', gap: 8 }}>
          {['basic', 'premium'].map(tier => (
            <button
              key={tier}
              onClick={() => dispatch({ type: 'SET_TIER', tier })}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: state.user.tier === tier
                  ? tier === 'premium' ? `${C.gold}12` : `${C.cyan}12`
                  : 'transparent',
                border: `1px solid ${state.user.tier === tier
                  ? tier === 'premium' ? C.gold + '30' : C.cyan + '30'
                  : C.border}`,
                borderRadius: 8,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{
                fontFamily: fonts.serif,
                fontSize: 15,
                color: state.user.tier === tier
                  ? tier === 'premium' ? C.gold : C.cyan
                  : C.textDim,
                marginBottom: 4,
              }}>
                {tier === 'basic' ? 'Basic' : 'Premium'}
              </div>
              <div style={{
                fontFamily: fonts.serif,
                fontSize: 11,
                color: C.textMuted,
                lineHeight: 1.5,
              }}>
                {tier === 'basic'
                  ? 'One system at a time. Full depth per system.'
                  : 'All systems in parallel. Convergence, snapshots, AI analysis.'}
              </div>
            </button>
          ))}
        </div>
      </Section>

      {/* Credits (Premium) */}
      {state.user.tier === 'premium' && (
        <Section title="Credits">
          <GlassCard style={{ borderColor: `${C.gold}15` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{
                  fontFamily: fonts.mono, fontSize: 28, color: C.gold, fontWeight: 300,
                }}>
                  {state.user.credits}
                </div>
                <div style={{
                  fontFamily: fonts.serif, fontSize: 11, color: C.textMuted,
                }}>
                  credits available
                </div>
              </div>
              <button
                onClick={() => dispatch({ type: 'ADD_CREDITS', amount: 10 })}
                style={{
                  padding: '8px 16px', background: `${C.gold}12`,
                  border: `1px solid ${C.gold}25`, borderRadius: 6,
                  color: C.gold, fontFamily: fonts.mono, fontSize: 10,
                  cursor: 'pointer',
                }}
              >
                + Add 10 (demo)
              </button>
            </div>
          </GlassCard>
        </Section>
      )}

      {/* System Presets */}
      <Section title="System Presets">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {registry.all().map(sys => {
            const variants = sys.module?.VARIANTS || sys.module?.PRESETS || {}
            const presetNames = Object.keys(variants)
            if (presetNames.length === 0) return null

            const currentPreset = state.systemPresets[sys.id] || ''
            const color = SYSTEM_COLORS[sys.id]

            return (
              <div key={sys.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0',
                borderBottom: `1px solid ${C.border}`,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: fonts.serif, fontSize: 13, color: C.textBright,
                  flex: 1, minWidth: 0,
                }}>
                  {sys.name}
                </span>
                <select
                  value={currentPreset}
                  onChange={e => dispatch({
                    type: 'SET_SYSTEM_PRESET',
                    systemId: sys.id,
                    preset: e.target.value || undefined,
                  })}
                  style={{
                    background: C.bgInput,
                    border: `1px solid ${C.border}`,
                    borderRadius: 4,
                    color: C.textBright,
                    fontFamily: fonts.mono,
                    fontSize: 10,
                    padding: '4px 8px',
                    outline: 'none',
                  }}
                >
                  <option value="">Default</option>
                  {presetNames.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            )
          }).filter(Boolean)}
        </div>
      </Section>

      {/* Data Export */}
      <Section title="Data">
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleExport}
            style={{
              padding: '10px 16px', background: `${C.cyan}10`,
              border: `1px solid ${C.cyan}20`, borderRadius: 6,
              color: C.cyan, fontFamily: fonts.mono, fontSize: 11,
              cursor: 'pointer',
            }}
          >
            Export JSON
          </button>
          <button
            onClick={() => {
              if (confirm('Clear all evaluation history?')) {
                dispatch({ type: 'CLEAR_HISTORY' })
              }
            }}
            style={{
              padding: '10px 16px', background: `${C.red}10`,
              border: `1px solid ${C.red}20`, borderRadius: 6,
              color: C.red, fontFamily: fonts.mono, fontSize: 11,
              cursor: 'pointer',
            }}
          >
            Clear History
          </button>
        </div>
        {exportStatus && (
          <div style={{
            fontFamily: fonts.serif, fontSize: 12, color: C.green, marginTop: 8,
          }}>
            {exportStatus}
          </div>
        )}
      </Section>

      {/* About */}
      <Section title="About">
        <div style={{
          fontFamily: fonts.serif, fontSize: 13, color: C.textDim, lineHeight: 1.7,
        }}>
          <strong style={{ color: C.gold }}>Libernumerus</strong> — 18 numerology traditions
          implemented in vanilla JavaScript. Pythagorean, Hebrew Gematria, Chaldean, Vedic,
          Greek Isopsephy, Arabic Abjad, Hurufism, Thelemic, Tarot, Chinese Cosmological,
          Japanese Shinto, Mayan, Yoruba Ifá, Norse Runic, Celtic Ogham, Neoplatonic,
          Christian Symbolic, and Egyptian.
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        fontFamily: fonts.mono, fontSize: 9, color: C.textMuted,
        letterSpacing: '1.5px', textTransform: 'uppercase',
        marginBottom: 10, padding: '0 2px',
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontFamily: fonts.serif,
  fontSize: 12,
  color: C.textDim,
  marginBottom: 4,
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  background: C.bgInput,
  border: `1px solid ${C.border}`,
  borderRadius: 6,
  color: C.textBright,
  fontFamily: fonts.serif,
  fontSize: 15,
  outline: 'none',
}
