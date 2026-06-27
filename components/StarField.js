import styles from './StarField.module.css'

export default function StarField({ style = {} }) {
  // Pure CSS blinking dot grid — zero canvas, zero rAF
  const COLS = 24
  const ROWS = 16
  const dots = []

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const delay = ((r * COLS + c) * 0.07 + Math.random() * 3).toFixed(2)
      const dur   = (2.5 + Math.random() * 3).toFixed(2)
      dots.push(
        <span
          key={`${r}-${c}`}
          className={styles.dot}
          style={{ animationDelay: `${delay}s`, animationDuration: `${dur}s` }}
        />
      )
    }
  }

  return (
    <div
      className={styles.grid}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, ...style }}
    >
      {dots}
    </div>
  )
}
