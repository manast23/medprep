import { useId, useEffect, useState } from 'react'
import styles from './ECGWave.module.css'

// A single isolated P-QRS-T complex, centered in an 800-wide viewBox (100px
// of empty baseline padding on each side so the shape reads as one centered
// emblem rather than a repeating strip).
const PATH = `
  M100 225
  L200 225

  Q225 225 240 212
  Q255 198 270 225

  L320 225

  L340 245
  L358 90
  L376 330
  L398 185

  L440 225

  Q475 225 505 180
  Q540 160 575 225

  L700 225
`

// Stacked glow layers: color, stroke width, opacity — thinner than before.
const LAYERS = [
  { color: '#0F1522', width: 21, opacity: 0.08 },
  { color: '#1B2338', width: 18, opacity: 0.12 },
  { color: '#233A63', width: 14, opacity: 0.18 },
  { color: '#355D8C', width: 11, opacity: 0.28 },
  { color: '#4F7FB6', width: 8, opacity: 0.45 },
  { color: '#6B9BD1', width: 5.5, opacity: 0.70 },
  { color: '#8EB9E6', width: 4, opacity: 0.90 },
]

export default function ECGWave({ style = {} }) {
  const uid = useId().replace(/:/g, '')
  const waveId = `ecg-wave-${uid}`
  const glowId = `ecg-glow-${uid}`
  const coreId = `ecg-core-${uid}`

  const [reducedMotion, setReducedMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  if (reducedMotion) {
    return <div className={styles.wrap} style={{ position: 'absolute', inset: 0, ...style }} />
  }

  return (
    <div
      className={styles.wrap}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <svg
        className={styles.trace}
        viewBox="0 0 800 450"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <path id={waveId} d={PATH} />

          <linearGradient id={coreId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#DCEFFF" />
            <stop offset="15%" stopColor="#B7D8F8" />
            <stop offset="30%" stopColor="#8EB9E6" />
            <stop offset="45%" stopColor="#6B9BD1" />
            <stop offset="60%" stopColor="#4F7FB6" />
            <stop offset="72%" stopColor="#FFF5F2" />
            <stop offset="84%" stopColor="#FFD2C5" />
            <stop offset="92%" stopColor="#FF9C87" />
            <stop offset="97%" stopColor="#FF7B5D" />
            <stop offset="100%" stopColor="#F15E4E" />
          </linearGradient>

          <filter id={glowId} x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className={styles.strike}>
          {LAYERS.map((l) => (
            <use
              key={l.color}
              href={`#${waveId}`}
              stroke={l.color}
              strokeWidth={l.width}
              opacity={l.opacity}
              fill="none"
              filter={`url(#${glowId})`}
            />
          ))}
          {/* Bright edge */}
          <use
            href={`#${waveId}`}
            stroke="#DCEFFF"
            strokeWidth={3}
            opacity={1}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Electrical energy core */}
          <use
            href={`#${waveId}`}
            stroke={`url(#${coreId})`}
            strokeWidth={1.6}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  )
}
