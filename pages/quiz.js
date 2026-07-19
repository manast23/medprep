import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import allQuestions from '../data/questions.json'
import styles from '../styles/Quiz.module.css'

// Section 6a cognitive-level target ratios per subject (recall / understanding / applying)
const SUBJECT_RATIOS = {
  'Anatomy': { recall: 0.50, understanding: 0.38, applying: 0.12 },
  'Physiology': { recall: 0.50, understanding: 0.38, applying: 0.12 },
  'Biochemistry': { recall: 0.50, understanding: 0.38, applying: 0.12 },
  'Pathology': { recall: 0.35, understanding: 0.42, applying: 0.23 },
  'Pharmacology': { recall: 0.35, understanding: 0.42, applying: 0.23 },
  'Microbiology': { recall: 0.35, understanding: 0.42, applying: 0.23 },
  'Community Medicine': { recall: 0.32, understanding: 0.43, applying: 0.25 },
  'Forensic Medicine': { recall: 0.32, understanding: 0.43, applying: 0.25 },
}
// Blended fallback used for "All subjects" quizzes or any unlisted subject
const DEFAULT_RATIOS = { recall: 0.40, understanding: 0.40, applying: 0.20 }

function getRatios(subject) {
  if (subject && subject !== 'All' && SUBJECT_RATIOS[subject]) return SUBJECT_RATIOS[subject]
  return DEFAULT_RATIOS
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

// Draws proportionally from each cognitive_level pool instead of pure random sampling.
// Falls back gracefully (redistributing shortfall) when a level is under-represented
// in a narrow filtered pool (e.g. a single subtopic).
function proportionalSample(pool, n, ratios) {
  const byLevel = { recall: [], understanding: [], applying: [] }
  pool.forEach(q => {
    const lvl = byLevel[q.cognitive_level] ? q.cognitive_level : 'recall'
    byLevel[lvl].push(q)
  })
  Object.keys(byLevel).forEach(k => { byLevel[k] = shuffle(byLevel[k]) })

  const target = {
    recall: Math.round(n * ratios.recall),
    understanding: Math.round(n * ratios.understanding),
    applying: Math.round(n * ratios.applying),
  }
  const roundingDiff = n - (target.recall + target.understanding + target.applying)
  target.recall += roundingDiff

  const picked = []
  const used = { recall: 0, understanding: 0, applying: 0 }
  let shortfall = 0
  ;['recall', 'understanding', 'applying'].forEach(lvl => {
    const take = Math.min(target[lvl], byLevel[lvl].length)
    picked.push(...byLevel[lvl].slice(0, take))
    used[lvl] = take
    shortfall += target[lvl] - take
  })

  if (shortfall > 0) {
    const leftovers = []
    ;['recall', 'understanding', 'applying'].forEach(lvl => {
      leftovers.push(...byLevel[lvl].slice(used[lvl]))
    })
    picked.push(...shuffle(leftovers).slice(0, shortfall))
  }

  return shuffle(picked).slice(0, n)
}

function buildQuizPool(subject, subtopic, qtype, count) {
  let pool = allQuestions
  if (subject !== 'All') pool = pool.filter(q => q.subject === subject)
  if (subtopic && subtopic !== 'All') pool = pool.filter(q => q.subtopic === subtopic)
  if (qtype && qtype !== 'All') pool = pool.filter(q => q.type === qtype)
  return proportionalSample(pool, parseInt(count) || 10, getRatios(subject))
}

export default function Quiz() {
  const router = useRouter()
  const { subject, subtopic, qtype, mode, count } = router.query

  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [timer, setTimer] = useState(90)
  const [answers, setAnswers] = useState([])
  const [showConfirm, setShowConfirm] = useState(null) // 'cancel' | 'restart'

  useEffect(() => {
    if (!subject) return
    setQuestions(buildQuizPool(subject, subtopic, qtype, count))
  }, [subject, subtopic, qtype, count])

  useEffect(() => {
    if (mode !== 'timed' || submitted || !questions.length) return
    if (timer <= 0) { handleSubmit(true); return }
    const t = setTimeout(() => setTimer(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timer, mode, submitted, questions])

  useEffect(() => { setTimer(90) }, [current])

  if (!questions.length) return <div><Navbar /><div className={styles.loading}>Loading questions...</div></div>

  const q = questions[current]
  const progress = (current / questions.length) * 100

  function handleSelect(i) {
    if (submitted) return
    setSelected(i)
  }

  function handleSubmit(timedOut = false) {
    if (selected === null && !timedOut) return
    setSubmitted(true)
    const isCorrect = selected === q.correct
    if (isCorrect) setScore(s => s + 1)
    setAnswers(a => [...a, { questionId: q.id, topic: q.topic, subtopic: q.subtopic, correct: isCorrect }])
  }

  function handleNext() {
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1)
      setSelected(null)
      setSubmitted(false)
    } else {
      const finalScore = score + (selected === q.correct ? 1 : 0)
      const params = new URLSearchParams({
        subject, subtopic: subtopic || 'All', qtype: qtype || 'All',
        mode: mode || 'untimed', score: finalScore,
        total: questions.length, answers: JSON.stringify(answers)
      })
      router.push(`/results?${params.toString()}`)
    }
  }

  function handleRestart() {
    setCurrent(0)
    setSelected(null)
    setSubmitted(false)
    setScore(0)
    setTimer(90)
    setAnswers([])
    setShowConfirm(null)
    // Re-shuffle questions (still drawn proportionally from cognitive_level pools)
    setQuestions(buildQuizPool(subject, subtopic, qtype, count))
  }

  const optionClass = (i) => {
    if (!submitted) return selected === i ? styles.optSelected : styles.opt
    if (i === q.correct) return styles.optCorrect
    if (i === selected) return styles.optIncorrect
    return styles.opt
  }

  const navLabel = [
    q.subject,
    q.subtopic && q.subtopic !== q.subject ? q.subtopic : null,
    q.type === 'clinical' ? 'Clinical' : q.type === 'factual' ? 'Factual' : null
  ].filter(Boolean).join(' · ')

  const pills = navLabel.split(' · ')

  return (
    <div>
      <nav className={styles.quizNav}>
        <div className={styles.navLeft}>
          <button className={styles.navBtn} onClick={() => setShowConfirm('cancel')}>✕ Cancel</button>
          <div className={styles.pills}>
            {pills.map((p, i) => (
              <span key={i} className={i === 0 ? styles.pillGreen : styles.pillGray}>{p}</span>
            ))}
          </div>
        </div>
        <div className={styles.navCenter}>
          <div className={styles.qCounter}>Q {current + 1} / {questions.length}</div>
          <div className={styles.progressBar} style={{width:'200px'}}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className={styles.navRight}>
          <button className={styles.navBtn} onClick={() => setShowConfirm('restart')}>↺ Restart</button>
        </div>
      </nav>

      {/* Confirm dialog */}
      {showConfirm && (
        <div className={styles.overlay}>
          <div className={styles.confirmBox}>
            <div className={styles.confirmTitle}>
              {showConfirm === 'cancel' ? 'Cancel quiz?' : 'Restart quiz?'}
            </div>
            <div className={styles.confirmDesc}>
              {showConfirm === 'cancel'
                ? 'Your progress will be lost and you\'ll return to the home screen.'
                : 'This will reset your progress and shuffle new questions.'}
            </div>
            <div className={styles.confirmActions}>
              <button className={styles.confirmSecondary} onClick={() => setShowConfirm(null)}>
                Keep going
              </button>
              <button
                className={styles.confirmPrimary}
                onClick={showConfirm === 'cancel' ? () => router.push('/') : handleRestart}
              >
                {showConfirm === 'cancel' ? 'Yes, cancel' : 'Yes, restart'}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className={styles.main}>
        <div className={styles.left}>
          <div className={styles.questionCard}>
            <span className={styles.qType}>{q.type === 'clinical' ? 'Clinical Scenario' : 'Factual'}</span>
            <div className={styles.qText}>{q.question}</div>
          </div>

          <div className={styles.options}>
            {q.options.map((opt, i) => (
              <div key={i} className={optionClass(i)} onClick={() => handleSelect(i)}>
                <div className={styles.optCircle}>{String.fromCharCode(65 + i)}</div>
                <div className={styles.optText}>{opt}</div>
              </div>
            ))}
          </div>

          {!submitted && (
            <button
              className={styles.submitBtn}
              onClick={() => handleSubmit()}
              disabled={selected === null}
            >
              Submit Answer
            </button>
          )}
        </div>

        <div className={styles.right}>
          {mode === 'timed' && !submitted && (
            <div className={styles.timerCard}>
              <div className={styles.timerLabel}>Time remaining</div>
              <div className={`${styles.timerBig} ${timer <= 20 ? styles.timerWarn : ''}`}>
                {String(Math.floor(timer / 60)).padStart(2, '0')}:{String(timer % 60).padStart(2, '0')}
              </div>
            </div>
          )}

          {submitted && (
            <>
              <div className={styles.expBox}>
                <div className={styles.expHeader}>Explanation</div>
                <div className={`${styles.resultBadge} ${selected === q.correct ? styles.badgeCorrect : styles.badgeIncorrect}`}>
                  {selected === q.correct ? 'Correct' : 'Incorrect'}
                </div>
                {selected !== q.correct && (
                  <div className={styles.correctAnswer}>
                    Correct answer: {String.fromCharCode(65 + q.correct)} — {q.options[q.correct]}
                  </div>
                )}
                <div className={styles.expText}>{q.explanation}</div>
                <div className={styles.refText}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0, marginTop:'1px'}}>
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                  {q.reference}
                  {q.reference_url && (
                    <a href={q.reference_url} target="_blank" rel="noopener noreferrer" className={styles.refLink}>Read Article ↗</a>
                  )}
                </div>
              </div>
              <button className={styles.nextBtn} onClick={handleNext}>
                {current + 1 < questions.length ? 'Next question →' : 'See results'}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
