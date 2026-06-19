import { useRouter } from 'next/router'
import styles from './Navbar.module.css'

export default function Navbar({ centerText, rightText, onCancel, onRestart }) {
  const router = useRouter()
  const isHome = router.pathname === '/'

  return (
    <nav className={styles.nav}>
      <div className={styles.logo} onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
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
      ) : isHome ? (
        <div className={styles.homeLinks}>
          <a href="#subjects" className={styles.navLink}>Subjects</a>
          <a href="#features" className={styles.navLink}>Features</a>
        </div>
      ) : (
        rightText && <div className={styles.right}>{rightText}</div>
      )}
    </nav>
  )
}
