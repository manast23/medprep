import styles from './Navbar.module.css'

export default function Navbar({ centerText, rightText }) {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <span className={styles.dot}></span>
        <span className={styles.name}>MedPrep</span>
      </div>
      {centerText && <div className={styles.center}>{centerText}</div>}
      {rightText && <div className={styles.right}>{rightText}</div>}
    </nav>
  )
}
