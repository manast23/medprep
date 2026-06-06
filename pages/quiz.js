import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import allQuestions from '../data/questions.json'
import styles from '../styles/Quiz.module.css'

export default function Quiz() {
  const router = useRouter()
  const { subject, mode, count } = router.query

  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [timer, setTimer] = useState(90)
  const [answers, setAnswers] = useState([])

  useEffect(() => {
    if (!subject) return
    let pool = subject === 'All' ? allQuestions : allQuestions.filter(q => q.subject === subject)
    pool = [...pool].sort(() => Math.random() - 0.5).slice(0, parseInt(count) || 10)
    setQuestions(pool)
  }, [subject, count])

  useEffect(() => {
    if (mode !== 'timed' || submitted || !questions.length) return
    if (timer <= 0) {
      handleSubmit(true)
      return
    }
    const t = setTimeout(() => setTimer(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timer, mode, submitted, questions])

  useEffect(() => {
    setTimer(90)
  }, [current])

  if (!questions.length) return <div><Navbar /><div className={styles.loading}>Loading questions...</div></div>

  const q = questions[current]
  const progress = ((current) / questions.length) * 100

  function handleSelect(i) {
    if (submitted) return
    setSelected(i)
  }

  function handleSubmit(timedOut = false) {
    if (selected === null && !timedOut) return
    setSubmitted(true)
    const isCorrect = selected === q.correct
    if (isCorrect) setScore(s => s + 1)
    setAnswers(a => [...a, { questionId: q.id, topic: q.topic, correct: isCorrect }])
  }

  function handleNext() {
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1)
      setSelected(null)
      setSubmitted(false)
    } else {
      const finalAnswers = [...answers]
      const params = new URLSearchParams({
        subject,
        score: score + (selected === q.correct ? 1 : 0),
        total: questions.length,
        answers: JSON.stringify(finalAnswers)
      })
      router.push(`/results?${params.toString()}`)
    }
  }

  const optionClass = (i) => {
    if (!submitted) return selected === i ? styles.optSelected : styles.opt
    if (i === q.correct) return styles.optCorrect
    if (i === selected) return styles.optIncorrect
    return styles.opt
  }

  return (
    <div>
      <Navbar
        centerText={`${q.subject} · ${q.topic}`}
        rightText={`Q${current + 1} of ${questions.length}`}
      />
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      <main className={styles.main}>
        <div className={styles.left}>
          <div className={styles.qLabel}>Question {current + 1}</div>
          <div className={styles.qText}>{q.question}</div>

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
                <div className={`${styles.resultBadge} ${selected === q.correct ? styles.badgeCorrect : styles.badgeIncorrect}`}>
                  {selected === q.correct ? 'Correct' : 'Incorrect'}
                </div>
                {selected !== q.correct && (
                  <div className={styles.correctAnswer}>
                    Correct answer: {String.fromCharCode(65 + q.correct)} — {q.options[q.correct]}
                  </div>
                )}
                <div className={styles.expText}>{q.explanation}</div>
                <div className={styles.refText}>📖 {q.reference}</div>
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
