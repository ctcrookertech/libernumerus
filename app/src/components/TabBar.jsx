import { useTab } from '../stores/app-store'
import { C, fonts } from '../utils/theme'

const TABS = [
  { id: 'portal', icon: '◎', label: 'Portal' },
  { id: 'explore', icon: '◇', label: 'Explore' },
  { id: 'insights', icon: '◈', label: 'Insights' },
  { id: 'journal', icon: '▤', label: 'Journal' },
  { id: 'settings', icon: '⚙', label: 'Settings' },
]

export default function TabBar() {
  const { activeTab, setTab } = useTab()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: 64,
      background: 'rgba(6, 4, 14, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop: `1px solid ${C.border}`,
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      {TABS.map(tab => {
        const active = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 12px',
              color: active ? C.cyan : C.textMuted,
              transition: 'color 0.2s',
              position: 'relative',
            }}
          >
            <span style={{
              fontSize: 20,
              lineHeight: 1,
              filter: active ? `drop-shadow(${C.glowCyan})` : 'none',
              transition: 'filter 0.2s',
            }}>
              {tab.icon}
            </span>
            <span style={{
              fontSize: 9,
              fontFamily: fonts.mono,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}>
              {tab.label}
            </span>
            {active && (
              <span style={{
                position: 'absolute',
                top: -1,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 20,
                height: 2,
                background: C.cyan,
                borderRadius: 1,
                boxShadow: C.glowCyan,
              }} />
            )}
          </button>
        )
      })}
    </nav>
  )
}
