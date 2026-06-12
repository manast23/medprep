import { useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import questions from '../data/questions.json'
import styles from '../styles/Home.module.css'

export default function Home() {
  const router = useRouter()
  const [subject, setSubject] = useState(null)
  const [mode, setMode] = useState('untimed')
  const [count, setCount] = useState(20)

  const anatomy = questions.filter(q => q.subject === 'Anatomy').length
  const physiology = questions.filter(q => q.subject === 'Physiology').length
  const total = questions.length

  function startQuiz() {
    if (!subject) return
    router.push(`/quiz?subject=${subject}&mode=${mode}&count=${count}`)
  }

  return (
    <div>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.left}>
          <div className={styles.heroTag}>International medical students</div>
          <h1 className={styles.heroH1}>MCQ practice for international medical students</h1>
          <p className={styles.heroSub}>
            Clinical scenario-based questions with full textbook explanations.
            No past papers needed — just structured, exam-style practice.
          </p>

          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <div className={styles.statN}>{total}</div>
              <div className={styles.statL}>Questions</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statN}>2</div>
              <div className={styles.statL}>Subjects</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statN}>100%</div>
              <div className={styles.statL}>Explained</div>
            </div>
          </div>

          <div className={styles.sectionLabel}>Choose a subject</div>
          <div className={styles.subjectList}>
            {[
              { key: 'Anatomy', label: 'Anatomy', ref: "Gray's Anatomy · Snell's Clinical Anatomy", count: anatomy },
              { key: 'Physiology', label: 'Physiology', ref: "Guyton & Hall · Ganong's Review", count: physiology },
              { key: 'All', label: 'Mixed', ref: 'All subjects combined', count: total },
            ].map(s => (
              <div
                key={s.key}
                className={`${styles.subjectRow} ${subject === s.key ? styles.subjectRowActive : ''}`}
                onClick={() => setSubject(s.key)}
              >
                <div>
                  <div className={styles.subjectName}>{s.label}</div>
                  <div className={styles.subjectRef}>{s.ref}</div>
                </div>
                <span className={`${styles.pill} ${s.key === 'All' ? styles.pillGray : styles.pillTeal}`}>
                  {s.count} questions
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.sideCard}>
            <div className={styles.sideTitle}>Quiz settings</div>

            <div className={styles.sectionLabel}>Mode</div>
            <div className={styles.modeGrid}>
              {['untimed', 'timed'].map(m => (
                <div
                  key={m}
                  className={`${styles.modeCard} ${mode === m ? styles.modeCardActive : ''}`}
                  onClick={() => setMode(m)}
                >
                  <div className={styles.modeTitle}>{m === 'untimed' ? 'Untimed' : 'Timed'}</div>
                  <div className={styles.modeDesc}>{m === 'untimed' ? 'Study at your pace' : '90 sec per question'}</div>
                </div>
              ))}
            </div>

            <div className={styles.sectionLabel}>Questions per session</div>
            <div className={styles.countRow}>
              {[10, 20, 30].map(n => (
                <div
                  key={n}
                  className={`${styles.countBtn} ${count === n ? styles.countBtnActive : ''}`}
                  onClick={() => setCount(n)}
                >
                  {n}
                </div>
              ))}
            </div>

            <button
              className={styles.cta}
              onClick={startQuiz}
              disabled={!subject}
            >
              {subject ? `Start quiz` : 'Select a subject first'}
            </button>
          </div>

          <div className={styles.sideCard}>
            <div className={styles.sideTitle}>Why trust this?</div>
            <div className={styles.trustRow}>
              <span className={styles.trustIcon}>✓</span>
              <span>Built by an international graduate who studied in China</span>
            </div>
            <div className={styles.trustRow}>
              <span className={styles.trustIcon}>✓</span>
              <span>Referenced to Gray's, Guyton, Snell's, and Ganong's</span>
            </div>
            <div className={styles.trustRow}>
              <span className={styles.trustIcon}>✓</span>
              <span>Reviewed by qualified doctors and graduates</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
