import styles from './ECGWave.module.css'

// A guide path shaped like an ECG strip (3 heartbeats). The path itself is
// never drawn — only a short glowing "comet" travels along it left to right,
// fading in as it enters and fading out as it exits, then looping.
const UNIT = 'L150,100 L165,100 L175,90 L185,112 L197,45 L212,155 L227,100 L400,100'
const PATH = `M0,100 ${UNIT} ${UNIT.replace(/(\d+),/g, (_, n) => `${Number(n) + 400},`)} ${UNIT.replace(/(\d+),/g, (_, n) => `${Number(n) + 800},`)}`

export default function ECGWave({ style = {} }) {
  return (
    <div
      className={styles.wrap}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden', ...style }}
    >
      <svg
        className={styles.trace}
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={PATH} pathLength="1000" className={styles.comet} />
      </svg>
    </div>
  )
}
