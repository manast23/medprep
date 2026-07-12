import styles from './ECGWave.module.css'

// Guide path shaped like a continuous ECG strip — each beat starts right
// where the last one ends (minimal flat baseline between beats). The path
// itself is never drawn — only a glowing comet travels along it left to
// right. Its color is a gradient across the whole trace (blue -> orange
// neural core), so the comet appears to shift from cool blue to warm
// coral/orange as it travels. Fades in as it enters and out as it exits,
// then loops.
const UNIT = 'L20,100 L35,100 L45,90 L55,112 L67,45 L82,155 L97,100 L120,100'
const PATH = `M0,100 ${UNIT} ${UNIT.replace(/(\d+),/g, (_, n) => `${Number(n) + 120},`)} ${UNIT.replace(/(\d+),/g, (_, n) => `${Number(n) + 240},`)} ${UNIT.replace(/(\d+),/g, (_, n) => `${Number(n) + 360},`)} ${UNIT.replace(/(\d+),/g, (_, n) => `${Number(n) + 480},`)} ${UNIT.replace(/(\d+),/g, (_, n) => `${Number(n) + 600},`)}`

export default function ECGWave({ style = {} }) {
  return (
    <div
      className={styles.wrap}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden', ...style }}
    >
      <svg
        className={styles.trace}
        viewBox="0 0 720 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ecgCoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
          <filter id="ecgGlow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="1.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d={PATH}
          pathLength="1000"
          className={styles.comet}
          stroke="url(#ecgCoreGradient)"
          filter="url(#ecgGlow)"
        />
      </svg>
    </div>
  )
}
