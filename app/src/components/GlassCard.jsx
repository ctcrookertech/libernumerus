import { C, glass } from '../utils/theme'

export default function GlassCard({ children, style, glow, onClick, className }) {
  const glowStyle = glow ? {
    boxShadow: glow === 'cyan' ? C.glowCyan
      : glow === 'green' ? C.glowGreen
      : glow === 'gold' ? C.glowGold
      : glow === 'purple' ? C.glowPurple
      : glow,
  } : {}

  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        ...glass.card,
        padding: '16px 20px',
        ...glowStyle,
        ...(onClick ? { cursor: 'pointer' } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  )
}
