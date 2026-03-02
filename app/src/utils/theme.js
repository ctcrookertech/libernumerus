/**
 * Mystic Tech theme — color system, typography, glassmorphism tokens.
 * Extracted from the design prototype (numerology-insight.jsx).
 */

export const C = {
  // Base backgrounds
  bg: '#0a0a12',
  bgDeep: '#060212',
  bgCard: 'rgba(12, 10, 20, 0.7)',
  bgCardHover: 'rgba(18, 14, 30, 0.8)',
  bgGlass: 'rgba(20, 16, 30, 0.55)',
  bgInput: 'rgba(10, 8, 18, 0.8)',

  // Primary accent colors
  cyan: '#00e5ff',
  green: '#00ffa3',
  gold: '#f5e6be',
  goldDim: '#c9a96e',
  purple: '#8B5CF6',
  red: '#DC2626',

  // Text
  textBright: '#e8e4f0',
  textDim: '#8a8098',
  textMuted: '#5a5070',
  textGold: '#c9a96e',

  // Borders
  border: 'rgba(120, 100, 160, 0.15)',
  borderFocus: 'rgba(0, 229, 255, 0.4)',
  borderGold: 'rgba(201, 169, 110, 0.3)',

  // Glow effects
  glowCyan: '0 0 20px rgba(0, 229, 255, 0.15)',
  glowGreen: '0 0 20px rgba(0, 255, 163, 0.15)',
  glowGold: '0 0 20px rgba(245, 230, 190, 0.15)',
  glowPurple: '0 0 20px rgba(139, 92, 246, 0.15)',

  // Insight card glows
  insightCyan: 'rgba(0, 229, 255, 0.12)',
  insightGreen: 'rgba(0, 255, 163, 0.12)',
  insightGold: 'rgba(245, 230, 190, 0.12)',
  insightPurple: 'rgba(139, 92, 246, 0.12)',
}

export const glass = {
  card: {
    background: C.bgGlass,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: `1px solid ${C.border}`,
    borderRadius: '12px',
  },
  cardHover: {
    background: C.bgCardHover,
    border: `1px solid rgba(120, 100, 160, 0.25)`,
  },
  input: {
    background: C.bgInput,
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: `1px solid ${C.border}`,
    borderRadius: '8px',
    color: C.textBright,
  },
}

export const fonts = {
  serif: "'Cormorant Garamond', 'Garamond', 'Georgia', serif",
  mono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
  system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
}

export const fontImport = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=JetBrains+Mono:wght@300;400;500&display=swap"
