import { useRef, useEffect } from 'react'
import { C } from '../utils/theme'

const PARTICLE_COUNT = 60
const GEOMETRY_OPACITY = 0.04

export default function ParticleBackground() {
  const canvasRef = useRef(null)
  const particles = useRef([])
  const frame = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    function initParticles() {
      particles.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        hue: Math.random() > 0.5 ? 180 : 160, // cyan-green range
      }))
    }

    function drawSacredGeometry(t) {
      const cx = canvas.width / 2
      const cy = canvas.height / 2
      const r = Math.min(canvas.width, canvas.height) * 0.3

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(t * 0.0001)
      ctx.strokeStyle = `rgba(139, 92, 246, ${GEOMETRY_OPACITY})`
      ctx.lineWidth = 0.5

      // Metatron's Cube — 7 circles + connecting lines
      const centers = [{ x: 0, y: 0 }]
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6
        centers.push({ x: Math.cos(angle) * r * 0.4, y: Math.sin(angle) * r * 0.4 })
      }

      // Draw circles
      for (const c of centers) {
        ctx.beginPath()
        ctx.arc(c.x, c.y, r * 0.4, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Connecting lines between all centers
      ctx.strokeStyle = `rgba(0, 229, 255, ${GEOMETRY_OPACITY * 0.5})`
      for (let i = 0; i < centers.length; i++) {
        for (let j = i + 1; j < centers.length; j++) {
          ctx.beginPath()
          ctx.moveTo(centers[i].x, centers[i].y)
          ctx.lineTo(centers[j].x, centers[j].y)
          ctx.stroke()
        }
      }

      ctx.restore()
    }

    function animate(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame.current = t

      // Sacred geometry
      drawSacredGeometry(t)

      // Particles
      for (const p of particles.current) {
        p.x += p.vx
        p.y += p.vy

        // Wrap around
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Slight parallax breathing
        const breathe = Math.sin(t * 0.001 + p.x * 0.01) * 0.15

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.opacity + breathe})`
        ctx.fill()
      }

      // Blurred curves
      ctx.save()
      ctx.globalAlpha = 0.03
      ctx.strokeStyle = C.cyan
      ctx.lineWidth = 80
      ctx.filter = 'blur(40px)'
      ctx.beginPath()
      ctx.moveTo(0, canvas.height * 0.6 + Math.sin(t * 0.0005) * 50)
      ctx.quadraticCurveTo(
        canvas.width * 0.5, canvas.height * 0.4 + Math.cos(t * 0.0003) * 80,
        canvas.width, canvas.height * 0.7 + Math.sin(t * 0.0004) * 60
      )
      ctx.stroke()
      ctx.strokeStyle = C.purple
      ctx.beginPath()
      ctx.moveTo(0, canvas.height * 0.3 + Math.cos(t * 0.0004) * 40)
      ctx.quadraticCurveTo(
        canvas.width * 0.5, canvas.height * 0.5 + Math.sin(t * 0.0006) * 60,
        canvas.width, canvas.height * 0.4 + Math.cos(t * 0.0005) * 50
      )
      ctx.stroke()
      ctx.restore()

      animId = requestAnimationFrame(animate)
    }

    resize()
    initParticles()
    animId = requestAnimationFrame(animate)

    window.addEventListener('resize', () => { resize(); initParticles() })
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
