import { useRef, useEffect, useMemo } from 'react'
import registry, { SYSTEM_COLORS } from '../utils/system-registry'
import { C, fonts } from '../utils/theme'

/**
 * ConstellationView — visual mandala of multi-system results.
 * Each system that produced a result is a glowing node.
 * Nodes sharing the same primary number are linked with bright lines.
 */
export default function ConstellationView({ results, onNodeClick }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  // Extract primary numbers per system
  const nodes = useMemo(() => {
    return results
      .filter(r => !r.error && r.result)
      .map(r => {
        const primaryValue = extractPrimaryNumber(r.result)
        return {
          systemId: r.systemId,
          name: registry.get(r.systemId)?.name || r.systemId,
          color: SYSTEM_COLORS[r.systemId] || '#888',
          primaryValue,
        }
      })
  }, [results])

  // Find connections (shared primary numbers)
  const connections = useMemo(() => {
    const conns = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].primaryValue !== null &&
            nodes[j].primaryValue !== null &&
            nodes[i].primaryValue === nodes[j].primaryValue) {
          conns.push({ from: i, to: j, value: nodes[i].primaryValue })
        }
      }
    }
    return conns
  }, [nodes])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || nodes.length === 0) return
    const ctx = canvas.getContext('2d')

    const W = 360
    const H = 360
    canvas.width = W * 2  // Retina
    canvas.height = H * 2
    canvas.style.width = `${W}px`
    canvas.style.height = `${H}px`
    ctx.scale(2, 2)

    const cx = W / 2
    const cy = H / 2
    const radius = Math.min(W, H) * 0.35

    // Position nodes in a circle
    const positions = nodes.map((_, i) => {
      const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2
      return {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
      }
    })

    function draw(t) {
      ctx.clearRect(0, 0, W, H)

      // Center glow
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.4)
      gradient.addColorStop(0, 'rgba(139, 92, 246, 0.06)')
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, W, H)

      // Draw connections
      for (const conn of connections) {
        const from = positions[conn.from]
        const to = positions[conn.to]
        const pulse = 0.5 + Math.sin(t * 0.002 + conn.value) * 0.3

        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.strokeStyle = `rgba(245, 230, 190, ${0.15 + pulse * 0.15})`
        ctx.lineWidth = 1
        ctx.stroke()

        // Connection value label at midpoint
        const mx = (from.x + to.x) / 2
        const my = (from.y + to.y) / 2
        ctx.font = '9px JetBrains Mono, monospace'
        ctx.fillStyle = `rgba(201, 169, 110, ${0.4 + pulse * 0.2})`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(conn.value, mx, my)
      }

      // Draw orbital ring
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(120, 100, 160, 0.08)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw nodes
      nodes.forEach((node, i) => {
        const pos = positions[i]
        const breathe = Math.sin(t * 0.001 + i * 0.5) * 2

        // Node glow
        const glow = ctx.createRadialGradient(
          pos.x, pos.y, 0, pos.x, pos.y, 14 + breathe
        )
        glow.addColorStop(0, node.color + '40')
        glow.addColorStop(1, 'transparent')
        ctx.fillStyle = glow
        ctx.fillRect(pos.x - 20, pos.y - 20, 40, 40)

        // Node circle
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.fill()

        // Node border
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, 7, 0, Math.PI * 2)
        ctx.strokeStyle = node.color + '40'
        ctx.lineWidth = 1
        ctx.stroke()

        // System name
        const labelAngle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2
        const labelRadius = radius + 22
        const lx = cx + Math.cos(labelAngle) * labelRadius
        const ly = cy + Math.sin(labelAngle) * labelRadius

        ctx.font = '8px JetBrains Mono, monospace'
        ctx.fillStyle = node.color + 'BB'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // Rotate text for readability
        ctx.save()
        ctx.translate(lx, ly)
        const displayAngle = labelAngle + Math.PI / 2
        if (displayAngle > Math.PI / 2 && displayAngle < Math.PI * 1.5) {
          ctx.rotate(displayAngle + Math.PI)
        } else {
          ctx.rotate(displayAngle)
        }
        ctx.fillText(node.name, 0, 0)
        ctx.restore()

        // Primary value near node
        if (node.primaryValue !== null) {
          ctx.font = '11px JetBrains Mono, monospace'
          ctx.fillStyle = node.color
          ctx.textAlign = 'center'
          ctx.fillText(node.primaryValue, pos.x, pos.y - 14)
        }
      })

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [nodes, connections])

  if (nodes.length === 0) return null

  return (
    <div style={{ textAlign: 'center', marginBottom: 16 }}>
      <canvas
        ref={canvasRef}
        style={{ maxWidth: '100%', cursor: 'pointer' }}
        onClick={(e) => {
          // Hit-test nodes
          const rect = e.currentTarget.getBoundingClientRect()
          const x = (e.clientX - rect.left) / rect.width * 360
          const y = (e.clientY - rect.top) / rect.height * 360
          const cx = 180
          const cy = 180
          const radius = 360 * 0.35

          for (let i = 0; i < nodes.length; i++) {
            const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2
            const nx = cx + Math.cos(angle) * radius
            const ny = cy + Math.sin(angle) * radius
            const dist = Math.sqrt((x - nx) ** 2 + (y - ny) ** 2)
            if (dist < 15) {
              onNodeClick?.(nodes[i].systemId)
              return
            }
          }
        }}
      />

      {/* System pills */}
      <div style={{
        display: 'flex',
        gap: 4,
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: 8,
      }}>
        {nodes.map(node => (
          <button
            key={node.systemId}
            onClick={() => onNodeClick?.(node.systemId)}
            style={{
              padding: '3px 8px',
              background: `${node.color}12`,
              border: `1px solid ${node.color}25`,
              borderRadius: 10,
              color: node.color,
              fontFamily: fonts.mono,
              fontSize: 8,
              cursor: 'pointer',
              letterSpacing: '0.3px',
            }}
          >
            {node.name}
          </button>
        ))}
      </div>
    </div>
  )
}

function extractPrimaryNumber(result) {
  if (!result) return null
  // Check common primary result fields
  if (result.lifePath?.value) return result.lifePath.value
  if (result.expression?.value) return result.expression.value
  if (result.standard !== undefined) return result.standard
  if (result.nameVibration?.reduced) return result.nameVibration.reduced
  if (result.psychicNumber?.value) return result.psychicNumber.value
  if (result.destinyNumber?.value) return result.destinyNumber.value
  if (result.birthCard?.value) return result.birthCard.value
  if (result.nameValue !== undefined) return result.nameValue
  if (result.sum !== undefined) return result.sum
  if (result.reduced !== undefined) return result.reduced
  if (result.value !== undefined && typeof result.value === 'number') return result.value
  if (result.score !== undefined) return result.score
  return null
}
