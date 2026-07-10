import styles from './ECGWave.module.css'

// Guide path shaped like a continuous ECG strip — each beat starts right
// where the last one ends (minimal flat baseline between beats). The path
// itself is never drawn — only a layered glowing comet travels along it left
// to right (bright white-hot core with a coral/orange trail behind it),
// fading in as it enters and out as it exits, then looping.
const UNIT = 'L20,100 L35,100 L45,90 L55,112 L67,45 L82,155 L97,100 L120,100'
const PATH = `M0,100 ${UNIT} ${UNIT.replace(/(\d+),/g, (_, n) => `${Number(n) + 120},`)} ${UNIT.replace(/(\d+),/g, (_, n) => `${Number(n) + 240},`)} ${UNIT.replace(/(\d+),/g, (_, n) => `${Number(n) + 360},`)} ${UNIT.replace(/(\d+),/g, (_, n) => `${Number(n) + 480},`)} ${UNIT.replace(/(\d+),/g, (_, n) => `${Number(n) + 600},`)}`

const LAYERS = [
  { cls: 'deepCoral' },
  { cls: 'warmOrange' },
  { cls: 'coral' },
  { cls: 'softPeach' },
  { cls: 'core' },
]

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
        {LAYERS.map(({ cls }) => (
          <path key={cls} d={PATH} pathLength="1000" className={styles[cls]} />
        ))}
      </svg>
    </div>
  )
}
