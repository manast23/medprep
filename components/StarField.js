import { useEffect, useRef } from 'react'

export default function StarField({ style = {} }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Generate stars: grid-aligned with jitter + random brightness
    const SPACING = 28
    const stars = []

    const buildStars = () => {
      stars.length = 0
      const cols = Math.ceil(canvas.width / SPACING) + 1
      const rows = Math.ceil(canvas.height / SPACING) + 1
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          stars.push({
            x: c * SPACING + (Math.random() - 0.5) * 6,
            y: r * SPACING + (Math.random() - 0.5) * 6,
            // each star has its own blink phase & speed
            phase: Math.random() * Math.PI * 2,
            speed: 0.4 + Math.random() * 1.2,
            // star arms length: most tiny, some bigger
            size: Math.random() < 0.15 ? 2.2 + Math.random() * 1.4 : 0.8 + Math.random() * 0.8,
            bright: Math.random() < 0.12, // occasional bright twinklers
          })
        }
      }
    }
    buildStars()
    window.addEventListener('resize', buildStars)

    let raf
    let t = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t += 0.016

      for (const s of stars) {
        const alpha = 0.08 + 0.5 * (0.5 + 0.5 * Math.sin(s.phase + t * s.speed))
        const a = s.bright ? Math.min(alpha * 2.2, 1) : alpha

        ctx.save()
        ctx.translate(s.x, s.y)
        ctx.globalAlpha = a

        if (s.size > 1.8) {
          // Draw a 4-point star (cross) for larger ones
          const L = s.size * 2.8
          const w = s.size * 0.35
          ctx.fillStyle = s.bright ? '#a7f3d0' : '#ffffff'
          // vertical arm
          ctx.fillRect(-w, -L, w * 2, L * 2)
          // horizontal arm
          ctx.fillRect(-L, -w, L * 2, w * 2)
          // diagonal tiny glow dot
          ctx.globalAlpha = a * 0.5
          ctx.beginPath()
          ctx.arc(0, 0, s.size * 0.6, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Small dot for grid density
          ctx.fillStyle = '#ffffff'
          ctx.beginPath()
          ctx.arc(0, 0, s.size * 0.7, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      }

      raf = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('resize', buildStars)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        ...style,
      }}
    />
  )
}
