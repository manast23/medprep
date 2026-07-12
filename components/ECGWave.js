import { useId, useEffect, useState } from 'react'
import styles from './ECGWave.module.css'

// Guide path shaped like a continuous ECG strip — each beat starts right
// where the last one ends (minimal flat baseline between beats).
const UNIT = 'L20,100 L35,100 L45,90 L55,112 L67,45 L82,155 L97,100 L120,100'
const PATH = `M0,100 ${UNIT} ${UNIT.replace(/(\d+),/g, (_, n) => `${Number(n) + 120},`)} ${UNIT.replace(/(\d+),/g, (_, n) => `${Number(n) + 240},`)} ${UNIT.replace(/(\d+),/g, (_, n) => `${Number(n) + 360},`)} ${UNIT.replace(/(\d+),/g, (_, n) => `${Number(n) + 480},`)} ${UNIT.replace(/(\d+),/g, (_, n) => `${Number(n) + 600},`)}`

// Stacked glow layers: color, stroke width, opacity — scaled down from a
// 1600-wide reference canvas to our 720-wide viewBox (factor ~0.45), so the
// same relative "heaviness" of glow is preserved at our smaller scale.
const LAYERS = [
  { color: '#0F1522', width: 11.7, opacity: 0.08 },
  { color: '#1B2338', width: 9.9, opacity: 0.12 },
  { color: '#233A63', width: 8.1, opacity: 0.18 },
  { color: '#355D8C', width: 6.3, opacity: 0.28 },
  { color: '#4F7FB6', width: 4.5, opacity: 0.45 },
  { color: '#6B9BD1', width: 3.15, opacity: 0.70 },
  { color: '#8EB9E6', width: 2.25, opacity: 0.90 },
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
        viewBox="0 0 720 200"
        preserveAspectRatio="xMidYMid slice"
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
            <feGaussianBlur stdDeviation="7" result="blur" />
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
            <rect x="-120" y="0" width="120" height="200" fill={`url(#${fadeId})`}>
              <animate attributeName="x" from="-120" to="720" dur="16s" repeatCount="indefinite" />
            </rect>
          </mask>
        </defs>

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
          strokeWidth={1.71}
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
          strokeWidth={0.9}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          mask={`url(#${maskId})`}
        />
      </svg>
    </div>
  )
}
