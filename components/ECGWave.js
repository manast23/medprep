import { useId, useEffect, useState } from 'react'
import styles from './ECGWave.module.css'

const PATH = `
  M80 225
  L180 225

  Q205 225 220 212
  Q235 198 250 225

  L300 225

  L320 245
  L338 90
  L356 330
  L378 185

  L420 225

  Q455 225 485 180
  Q520 160 555 225

  L680 225

  Q705 225 720 212
  Q735 198 750 225

  L800 225

  L820 245
  L838 90
  L856 330
  L878 185

  L920 225

  Q955 225 985 180
  Q1020 160 1055 225

  L1180 225

  Q1205 225 1220 212
  Q1235 198 1250 225

  L1300 225

  L1320 245
  L1338 90
  L1356 330
  L1378 185

  L1420 225

  Q1455 225 1485 180
  Q1520 160 1560 225
`

// Stacked glow layers: color, stroke width, opacity.
const LAYERS = [
  { color: '#0F1522', width: 26, opacity: 0.08 },
  { color: '#1B2338', width: 22, opacity: 0.12 },
  { color: '#233A63', width: 18, opacity: 0.18 },
  { color: '#355D8C', width: 14, opacity: 0.28 },
  { color: '#4F7FB6', width: 10, opacity: 0.45 },
  { color: '#6B9BD1', width: 7, opacity: 0.70 },
  { color: '#8EB9E6', width: 5, opacity: 0.90 },
]

// Lightning strikes: each is a FIXED segment of the wave (no positional
// animation at all — nothing slides or travels) that flickers in/out of
// visibility like a real lightning bolt. Different durations/delays per
// strike mean they fire independently, so it reads as occasional random
// strikes rather than one repeating scan.
const STRIKES = [
  { dashoffset: 0, duration: 9, delay: 0 },
  { dashoffset: -330, duration: 13, delay: 3 },
  { dashoffset: -660, duration: 17, delay: 6.5 },
]
const SEGMENT_LENGTH = 220 // out of a normalized pathLength of 1000

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
    return (
      <div
        className={styles.wrap}
        style={{ position: 'absolute', top: '-25%', left: 0, right: 0, height: '150%', ...style }}
      />
    )
  }

  return (
    <div
      className={styles.wrap}
      style={{
        position: 'absolute',
        top: '-25%',
        left: 0,
        right: 0,
        height: '150%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        ...style,
      }}
    >
      <svg
        className={styles.trace}
        viewBox="0 0 1600 450"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <path id={waveId} d={PATH} pathLength="1000" />

          <linearGradient id={`ecg-bg-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#062D23" />
            <stop offset="100%" stopColor="#022C22" />
          </linearGradient>

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
            <feGaussianBlur stdDeviation="16" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="100%" height="100%" fill={`url(#ecg-bg-${uid})`} />

        {STRIKES.map((s, i) => (
          <g
            key={i}
            className={styles.strike}
            style={{ animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s` }}
          >
            {LAYERS.map((l) => (
              <use
                key={l.color}
                href={`#${waveId}`}
                stroke={l.color}
                strokeWidth={l.width}
                opacity={l.opacity}
                fill="none"
                filter={`url(#${glowId})`}
                strokeDasharray={`${SEGMENT_LENGTH} 1000`}
                strokeDashoffset={s.dashoffset}
              />
            ))}
            {/* Bright edge */}
            <use
              href={`#${waveId}`}
              stroke="#DCEFFF"
              strokeWidth={3.8}
              opacity={1}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={`${SEGMENT_LENGTH} 1000`}
              strokeDashoffset={s.dashoffset}
            />
            {/* Electrical energy core */}
            <use
              href={`#${waveId}`}
              stroke={`url(#${coreId})`}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={`${SEGMENT_LENGTH} 1000`}
              strokeDashoffset={s.dashoffset}
            />
          </g>
        ))}
      </svg>
    </div>
  )
}
