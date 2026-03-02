import registry, { SYSTEM_COLORS, REGIONS } from '../../utils/system-registry'
import { C, fonts } from '../../utils/theme'

export default function SystemPicker({ currentSystem, inputMode, onSelect, onClose }) {
  const allSystems = registry.all()
  const byRegion = registry.byRegion()

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(5, 3, 10, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0f0d18',
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          maxWidth: 420,
          width: '100%',
          maxHeight: '80vh',
          overflow: 'auto',
          padding: '24px 20px',
        }}
      >
        <h2 style={{
          fontFamily: fonts.serif,
          fontSize: 18,
          fontWeight: 400,
          color: C.gold,
          letterSpacing: '1px',
          margin: '0 0 16px',
        }}>
          Choose System
        </h2>

        {Object.entries(byRegion).map(([regionId, systems]) => (
          <div key={regionId} style={{ marginBottom: 16 }}>
            <div style={{
              fontFamily: fonts.mono,
              fontSize: 9,
              color: C.textMuted,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginBottom: 8,
              padding: '0 4px',
            }}>
              {REGIONS[regionId]?.icon} {REGIONS[regionId]?.label}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {systems.map(sys => {
                const active = currentSystem === sys.id
                const compatible = sys.inputTypes.includes(inputMode)
                const color = SYSTEM_COLORS[sys.id]

                return (
                  <button
                    key={sys.id}
                    onClick={() => onSelect(sys.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      background: active ? `${color}15` : 'transparent',
                      border: `1px solid ${active ? color + '40' : 'transparent'}`,
                      borderRadius: 8,
                      cursor: 'pointer',
                      textAlign: 'left',
                      opacity: compatible ? 1 : 0.4,
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: color,
                      flexShrink: 0,
                      boxShadow: active ? `0 0 8px ${color}60` : 'none',
                    }} />
                    <div>
                      <div style={{
                        fontFamily: fonts.serif,
                        fontSize: 14,
                        color: active ? color : C.textBright,
                      }}>
                        {sys.name}
                      </div>
                      <div style={{
                        fontFamily: fonts.mono,
                        fontSize: 9,
                        color: C.textMuted,
                      }}>
                        {sys.era}
                        {!compatible && ` · no ${inputMode} support`}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
