import { useRouter } from 'next/router'
import styles from './Navbar.module.css'

export default function Navbar({ centerText, rightText, onCancel, onRestart }) {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <span className={styles.dot}></span>
        <span className={styles.name}>MedPrep</span>
      </div>
      {centerText && <div className={styles.center}>{centerText}</div>}
      {(onCancel || onRestart) ? (
        <div className={styles.quizActions}>
          {onRestart && (
            <button className={styles.navBtn} onClick={onRestart}>↺ Restart</button>
          )}
          {onCancel && (
            <button className={styles.navBtnDanger} onClick={onCancel}>✕ Cancel</button>
          )}
        </div>
      ) : (
        rightText && <div className={styles.right}>{rightText}</div>
      )}
    </nav>
  )
}
