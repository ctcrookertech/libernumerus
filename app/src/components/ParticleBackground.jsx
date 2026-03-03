import { useRef, useEffect } from 'react'

const PARTICLE_COUNT = 30
const CONNECTION_DISTANCE = 90

/* ─── Particle Canvas with Constellation Lines ─── */
function ParticleCanvas() {
  const canvasRef = useRef(null)
  const particles = useRef([])

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
        dx: (Math.random() - 0.5) * 0.105,
        dy: (Math.random() - 0.5) * 0.105,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.4 + 0.15,
        hue: Math.random() > 0.6 ? 160 : 180,
      }))
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const pts = particles.current
      for (const p of pts) {
        p.x += p.dx
        p.y += p.dy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue},100%,60%,${p.alpha})`
        ctx.fill()
      }

      // Constellation lines between nearby particles
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j]
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist < CONNECTION_DISTANCE) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(0,229,255,${0.12 * (1 - dist / CONNECTION_DISTANCE)})`
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    initParticles()
    animId = requestAnimationFrame(draw)

    const onResize = () => { resize(); initParticles() }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        pointerEvents: 'none',
      }}
    />
  )
}

/* ─── Metatron's Cube: 13 Fruit of Life circles + 78 lines + hexagram ─── */
function SacredGeometry() {
  const cx = 200, cy = 200, R = 48
  const innerPts = [0,1,2,3,4,5].map(i => {
    const a = (i * 60 - 90) * Math.PI / 180
    return [cx + R * Math.cos(a), cy + R * Math.sin(a)]
  })
  const outerPts = [0,1,2,3,4,5].map(i => {
    const a = (i * 60 - 90) * Math.PI / 180
    return [cx + R * 2 * Math.cos(a), cy + R * 2 * Math.sin(a)]
  })
  const allPts = [[cx, cy], ...innerPts, ...outerPts]

  return (
    <svg viewBox="0 0 400 400" style={{
      position: 'fixed',
      inset: 0,
      width: '100%',
      height: '100%',
      opacity: 0.07,
      pointerEvents: 'none',
      zIndex: 1,
    }}>
      {/* 78 connecting lines (13 choose 2) */}
      {allPts.map((a, i) =>
        allPts.slice(i + 1).map((b, j) => (
          <line key={`l${i}-${j}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
            stroke="#c0b0ff" strokeWidth="0.5" opacity="0.7" />
        ))
      )}
      {/* 13 Fruit of Life circles */}
      {allPts.map(([x, y], i) => (
        <circle key={`c${i}`} cx={x} cy={y} r={R * 0.95}
          fill="none" stroke="#c0b0ff" strokeWidth="0.6" opacity="0.8" />
      ))}
      {/* Double bounding circles */}
      <circle cx={cx} cy={cy} r={R * 3} fill="none" stroke="#c0b0ff" strokeWidth="0.5" opacity="0.5" />
      <circle cx={cx} cy={cy} r={R * 3.2} fill="none" stroke="#c0b0ff" strokeWidth="0.35" opacity="0.3" />
      {/* Hexagram (Star of David) */}
      {[0, 1].map(offset => {
        const pts = [0,1,2].map(i => {
          const a = ((i * 120 + offset * 60) - 90) * Math.PI / 180
          return `${cx + R * 2.2 * Math.cos(a)},${cy + R * 2.2 * Math.sin(a)}`
        }).join(' ')
        return <polygon key={`hex${offset}`} points={pts} fill="none" stroke="#c0b0ff" strokeWidth="0.55" opacity="0.6" />
      })}
    </svg>
  )
}

/* ─── Combined Background ─── */
export default function ParticleBackground() {
  return (
    <>
      <SacredGeometry />
      <ParticleCanvas />
    </>
  )
}
