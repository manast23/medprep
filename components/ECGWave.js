import styles from './ECGWave.module.css'

// Single ECG trace, tiled 3x and swept left continuously — no draw/reset jump.
// One repeat unit is 400 wide; container is 1200 (3 units), translated by
// exactly one unit width (-33.3333%) so the loop is seamless.
const UNIT = 'L150,100 L165,100 L175,90 L185,112 L197,45 L212,155 L227,100 L400,100'
const PATH = `M0,100 ${UNIT} ${UNIT.replace(/(\d+),/g, (_, n) => `${Number(n) + 400},`)} ${UNIT.replace(/(\d+),/g, (_, n) => `${Number(n) + 800},`)}`
const PEAK_X = [197, 597, 997]

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
        <path d={PATH} className={styles.line} />
        {PEAK_X.map((x, i) => (
          <circle
            key={x}
            cx={x}
            cy={45}
            r={5}
            className={styles.peak}
            style={{ animationDelay: `${i * -2}s` }}
          />
        ))}
      </svg>
    </div>
  )
}
