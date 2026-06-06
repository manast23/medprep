import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import styles from '../styles/Results.module.css'

export default function Results() {
  const router = useRouter()
  const { subject, score, total, answers } = router.query

  if (!score) return <div><Navbar /><div style={{padding:'2rem',color:'#6b6b6b'}}>Loading...</div></div>

  const pct = Math.round((parseInt(score) / parseInt(total)) * 100)
  const msg = pct >= 80 ? 'Excellent work!' : pct >= 60 ? 'Good effort — keep going.' : 'Keep practising.'

  let parsedAnswers = []
  try { parsedAnswers = JSON.parse(answers || '[]') } catch {}

  // Build topic breakdown
  const topicMap = {}
  parsedAnswers.forEach(a => {
    if (!topicMap[a.topic]) topicMap[a.topic] = { correct: 0, total: 0 }
    topicMap[a.topic].total++
    if (a.correct) topicMap[a.topic].correct++
  })
  const topics = Object.entries(topicMap)

  return (
    <div>
      <Navbar centerText="Session complete" />
      <main className={styles.main}>
        <div className={styles.topRow}>
          <div className={styles.scoreBlock}>
            <div className={styles.scorePct}>{pct}%</div>
            <div className={styles.scoreLabel}>{subject} · {total} questions</div>
          </div>
          <div className={styles.scoreDetails}>
            <div className={styles.scoreMsg}>{msg}</div>
            <div className={styles.statsRow}>
              <div className={styles.stat}>
                <div className={styles.statN} style={{ color: 'var(--correct)' }}>{score}</div>
                <div className={styles.statL}>Correct</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statN} style={{ color: 'var(--incorrect)' }}>{parseInt(total) - parseInt(score)}</div>
                <div className={styles.statL}>Incorrect</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statN}>{total}</div>
                <div className={styles.statL}>Total</div>
              </div>
            </div>
          </div>
        </div>

        {topics.length > 0 && (
          <>
            <div className={styles.sectionLabel}>Topic breakdown</div>
            <div className={styles.breakdownGrid}>
              {topics.map(([topic, data]) => {
                const topicPct = Math.round((data.correct / data.total) * 100)
                const isWeak = topicPct < 60
                return (
                  <div key={topic} className={styles.breakdownCard}>
                    <div className={styles.bcTopic}>{topic}</div>
                    <div className={styles.bcBarTrack}>
                      <div
                        className={styles.bcBarFill}
                        style={{
                          width: `${topicPct}%`,
                          background: isWeak ? 'var(--incorrect)' : 'var(--correct)'
                        }}
                      />
                    </div>
                    <div className={styles.bcRow}>
                      <span>{data.total} question{data.total !== 1 ? 's' : ''}</span>
                      <span style={{ fontWeight: 500, color: isWeak ? 'var(--incorrect)' : 'var(--correct)' }}>
                        {data.correct} / {data.total}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={() => router.push(`/quiz?subject=${subject}&mode=untimed&count=${total}`)}>
            Try again
          </button>
          <button className={styles.outlineBtn} onClick={() => router.push('/')}>
            Back to home
          </button>
        </div>
      </main>
    </div>
  )
}
