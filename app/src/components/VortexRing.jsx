import { C, fonts } from '../utils/theme'

export default function VortexRing({ number, label, sublabel, size = 120, color = C.cyan }) {
  const ringSize = size
  const innerSize = size * 0.75

  return (
    <div style={{
      position: 'relative',
      width: ringSize,
      height: ringSize,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Outer rotating ring */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        border: `1px solid ${color}40`,
        animation: 'spinSlow 8s linear infinite',
      }} />

      {/* Middle ring */}
      <div style={{
        position: 'absolute',
        inset: size * 0.08,
        borderRadius: '50%',
        border: `1px solid ${color}25`,
        animation: 'spinSlow 12s linear infinite reverse',
      }} />

      {/* Glow aura */}
      <div style={{
        position: 'absolute',
        inset: size * 0.15,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
        animation: 'pulse 3s ease-in-out infinite',
      }} />

      {/* Center content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: fonts.mono,
          fontSize: size * 0.35,
          fontWeight: 300,
          color,
          lineHeight: 1,
          textShadow: `0 0 20px ${color}40`,
        }}>
          {number}
        </div>
        {label && (
          <div style={{
            fontFamily: fonts.serif,
            fontSize: size * 0.09,
            color: C.textDim,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginTop: 4,
          }}>
            {label}
          </div>
        )}
        {sublabel && (
          <div style={{
            fontFamily: fonts.serif,
            fontSize: size * 0.07,
            color: C.textMuted,
            marginTop: 2,
          }}>
            {sublabel}
          </div>
        )}
      </div>
    </div>
  )
}
