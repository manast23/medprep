import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import questions from '../data/questions.json'
import styles from '../styles/Home.module.css'

const SUBJECTS = [
  { key: 'Anatomy', label: 'Anatomy', ref: "Gray's Anatomy · Snell's Clinical Anatomy" },
  { key: 'Physiology', label: 'Physiology', ref: "Guyton & Hall · Ganong's Review" },
  { key: 'All', label: 'Mixed', ref: 'All subjects combined' },
]

const QUESTION_TYPES = [
  { key: 'All', label: 'All Types', desc: 'Factual + clinical mixed' },
  { key: 'factual', label: 'Factual', desc: 'Core knowledge recall' },
  { key: 'clinical', label: 'Clinical', desc: 'Scenario-based questions' },
]

export default function Home() {
  const router = useRouter()
  const [subject, setSubject] = useState(null)
  const [subtopic, setSubtopic] = useState('All')
  const [qtype, setQtype] = useState('All')
  const [mode, setMode] = useState('untimed')
  const [count, setCount] = useState(20)

  const total = questions.length

  // Get subtopics for selected subject
  const subtopics = subject && subject !== 'All'
    ? ['All', ...Array.from(new Set(
        questions
          .filter(q => q.subject === subject && q.subtopic)
          .map(q => q.subtopic)
      ))]
    : []

  // Reset subtopic when subject changes
  useEffect(() => { setSubtopic('All') }, [subject])

  // Count available questions for current filters
  const availableCount = questions.filter(q => {
    if (subject && subject !== 'All' && q.subject !== subject) return false
    if (subtopic && subtopic !== 'All' && q.subtopic !== subtopic) return false
    if (qtype && qtype !== 'All' && q.type !== qtype) return false
    return true
  }).length

  function getSubjectCount(key) {
    if (key === 'All') return total
    return questions.filter(q => q.subject === key).length
  }

  function startQuiz() {
    if (!subject) return
    const params = new URLSearchParams({
      subject,
      subtopic: subtopic || 'All',
      qtype: qtype || 'All',
      mode,
      count
    })
    router.push(`/quiz?${params.toString()}`)
  }

  const canStart = subject && availableCount > 0
  const actualCount = Math.min(count, availableCount)

  return (
    <div>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.left}>
          <div className={styles.heroTag}>Medical MCQ practice</div>
          <h1 className={styles.heroH1}>MCQ practice for medical students</h1>
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

          {/* Subject */}
          <div className={styles.sectionLabel}>Choose a subject</div>
          <div className={styles.subjectList}>
            {SUBJECTS.map(s => (
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
                  {getSubjectCount(s.key)} questions
                </span>
              </div>
            ))}
          </div>

          {/* Subtopic — only shown when a specific subject is selected */}
          {subtopics.length > 1 && (
            <>
              <div className={styles.sectionLabel} style={{ marginTop: '20px' }}>Choose a subtopic</div>
              <div className={styles.subjectList}>
                {subtopics.map(st => {
                  const stCount = st === 'All'
                    ? questions.filter(q => q.subject === subject).length
                    : questions.filter(q => q.subject === subject && q.subtopic === st).length
                  return (
                    <div
                      key={st}
                      className={`${styles.subjectRow} ${subtopic === st ? styles.subjectRowActive : ''}`}
                      onClick={() => setSubtopic(st)}
                    >
                      <div className={styles.subjectName}>{st}</div>
                      <span className={`${styles.pill} ${st === 'All' ? styles.pillGray : styles.pillTeal}`}>
                        {stCount} questions
                      </span>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* Question type */}
          <div className={styles.sectionLabel} style={{ marginTop: '20px' }}>Question type</div>
          <div className={styles.modeGrid} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {QUESTION_TYPES.map(t => (
              <div
                key={t.key}
                className={`${styles.modeCard} ${qtype === t.key ? styles.modeCardActive : ''}`}
                onClick={() => setQtype(t.key)}
              >
                <div className={styles.modeTitle}>{t.label}</div>
                <div className={styles.modeDesc}>{t.desc}</div>
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

            {subject && availableCount < count && (
              <div className={styles.availableNote}>
                Only {availableCount} question{availableCount !== 1 ? 's' : ''} available for this filter
              </div>
            )}

            <button
              className={styles.cta}
              onClick={startQuiz}
              disabled={!canStart}
            >
              {!subject
                ? 'Select a subject first'
                : availableCount === 0
                ? 'No questions match filters'
                : `Start ${actualCount}-question quiz`}
            </button>
          </div>

          <div className={styles.sideCard}>
            <div className={styles.sideTitle}>Why trust this?</div>
            <div className={styles.trustRow}>
              <span className={styles.trustIcon}>✓</span>
              <span>Built by a medical graduate who understands the struggle</span>
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
