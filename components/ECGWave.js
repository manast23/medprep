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

// Lightning bolts: each is a fast flash-sweep across the wave, then a long
// invisible pause before repeating. Different durations/offsets per bolt
// mean they drift out of sync with each other, so flashes feel occasional
// and semi-random rather than one predictable repeating scan.
const BOLTS = [
  { dur: 8, begin: 0 },
  { dur: 11, begin: 2.5 },
  { dur: 14, begin: 5.5 },
]

export default function ECGWave({ style = {} }) {
  const uid = useId().replace(/:/g, '')
  const waveId = `ecg-wave-${uid}`
  const glowId = `ecg-glow-${uid}`
  const maskId = `ecg-scan-${uid}`
  const fadeId = `ecg-fade-${uid}`
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
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden', ...style }}
    >
      <svg
        className={styles.trace}
        viewBox="0 0 1600 450"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <path id={waveId} d={PATH} />

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

          <mask id={maskId}>
            <linearGradient id={fadeId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="black" />
              <stop offset="20%" stopColor="#222" />
              <stop offset="45%" stopColor="#777" />
              <stop offset="75%" stopColor="white" />
              <stop offset="100%" stopColor="white" />
            </linearGradient>
            {BOLTS.map((b, i) => (
              <rect key={i} x="-260" y="0" width="260" height="450" fill={`url(#${fadeId})`}>
                <animate
                  attributeName="x"
                  values="-260;1600;1600"
                  keyTimes="0;0.12;1"
                  dur={`${b.dur}s`}
                  begin={`${b.begin}s`}
                  repeatCount="indefinite"
                />
              </rect>
            ))}
          </mask>
        </defs>

        <rect width="100%" height="100%" fill={`url(#ecg-bg-${uid})`} />

        {LAYERS.map((l) => (
          <use
            key={l.color}
            href={`#${waveId}`}
            stroke={l.color}
            strokeWidth={l.width}
            opacity={l.opacity}
            fill="none"
            filter={`url(#${glowId})`}
            mask={`url(#${maskId})`}
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
          mask={`url(#${maskId})`}
        />

        {/* Electrical energy core */}
        <use
          href={`#${waveId}`}
          stroke={`url(#${coreId})`}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          mask={`url(#${maskId})`}
        />
      </svg>
    </div>
  )
}
