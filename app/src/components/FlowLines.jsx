import { useRef, useEffect } from 'react'
import { C } from '../utils/theme'

/**
 * FlowLines — animated stroke-draw lines connecting letter tiles to result.
 * Used during the evaluation animation sequence.
 */
export default function FlowLines({ points, targetY, width, color = C.cyan }) {
  const canvasRef = useRef(null)
  const progressRef = useRef(0)
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !points || points.length === 0) return
    const ctx = canvas.getContext('2d')

    canvas.width = width * 2
    canvas.height = 120 * 2
    canvas.style.width = `${width}px`
    canvas.style.height = '120px'
    ctx.scale(2, 2)

    progressRef.current = 0
    const startTime = Date.now()
    const duration = 800

    function draw() {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic

      ctx.clearRect(0, 0, width, 120)

      for (let i = 0; i < points.length; i++) {
        const p = points[i]
        const lineProgress = Math.max(0, Math.min(1, (eased - i * 0.03) / (1 - points.length * 0.02)))

        if (lineProgress <= 0) continue

        const startX = p.x
        const startY = 0
        const endX = width / 2
        const endY = targetY || 100
        const ctrlY = 40

        ctx.beginPath()
        ctx.moveTo(startX, startY)

        // Quadratic curve to target
        const cx = (startX + endX) / 2
        const t = lineProgress

        // Draw partial path
        for (let s = 0; s <= t; s += 0.02) {
          const x = (1 - s) * (1 - s) * startX + 2 * (1 - s) * s * cx + s * s * endX
          const y = (1 - s) * (1 - s) * startY + 2 * (1 - s) * s * ctrlY + s * s * endY
          if (s === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }

        ctx.strokeStyle = `${color}${Math.round(lineProgress * 60).toString(16).padStart(2, '0')}`
        ctx.lineWidth = 1
        ctx.stroke()

        // Traveling glow particle
        if (lineProgress > 0.1 && lineProgress < 0.95) {
          const px = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * cx + t * t * endX
          const py = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * ctrlY + t * t * endY

          ctx.beginPath()
          ctx.arc(px, py, 2, 0, Math.PI * 2)
          ctx.fillStyle = color
          ctx.fill()

          // Glow
          const glow = ctx.createRadialGradient(px, py, 0, px, py, 8)
          glow.addColorStop(0, `${color}40`)
          glow.addColorStop(1, 'transparent')
          ctx.fillStyle = glow
          ctx.fillRect(px - 8, py - 8, 16, 16)
        }
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(draw)
      }
    }

    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [points, targetY, width, color])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: 120,
        pointerEvents: 'none',
      }}
    />
  )
}
