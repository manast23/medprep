import { useRouter } from 'next/router'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import styles from '../styles/Results.module.css'

export default function Results() {
  const router = useRouter()
  const { subject, subtopic, qtype, mode, score, total, answers } = router.query

  if (!score) return <div><Navbar /><div style={{padding:'2rem',color:'#6b6b6b'}}>Loading...</div></div>

  const pct = Math.round((parseInt(score) / parseInt(total)) * 100)
  const correct = parseInt(score)
  const incorrect = parseInt(total) - correct

  let parsedAnswers = []
  try { parsedAnswers = JSON.parse(answers || '[]') } catch {}

  const topicMap = {}
  parsedAnswers.forEach(a => {
    const key = a.subtopic || a.topic || subject
    if (!topicMap[key]) topicMap[key] = { correct: 0, total: 0 }
    topicMap[key].total++
    if (a.correct) topicMap[key].correct++
  })
  const topics = Object.entries(topicMap)

  const filterLabel = [
    subject,
    subtopic && subtopic !== 'All' ? subtopic : null,
    qtype && qtype !== 'All' ? (qtype === 'clinical' ? 'Clinical' : 'Factual') : null
  ].filter(Boolean).join(' · ')

  function tryAgain() {
    const params = new URLSearchParams({ subject, subtopic: subtopic || 'All', qtype: qtype || 'All', mode: mode || 'untimed', count: total })
    router.push(`/quiz?${params.toString()}`)
  }

  const scoreColor = pct >= 80 ? '#0f6e56' : pct >= 60 ? '#d97706' : '#b91c1c'

  return (
    <div className={styles.container}>
      <Head><title>Results | MedPrep</title></Head>
      <Navbar />

      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <div>
            <span className={styles.kicker}>Quiz Complete</span>
            <h1 className={styles.title}>Performance Summary</h1>
            <p className={styles.subtitle}>{filterLabel} · {total} Questions</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.btnOutline} onClick={() => router.push('/')}>← Back to Home</button>
            <button className={styles.btnPrimary} onClick={tryAgain}>Try Again</button>
          </div>
        </header>

        {/* Score + Stats */}
        <section className={styles.topCards}>
          <div className={styles.scoreCard}>
            <div className={styles.scoreCircle} style={{ borderColor: scoreColor }}>
              <div className={styles.scoreValue} style={{ color: scoreColor }}>{pct}%</div>
              <div className={styles.scoreLabel}>Total Score</div>
            </div>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <div className={styles.statValue} style={{ color: '#0f6e56' }}>{correct}</div>
              <div className={styles.statLabel}>Correct</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statValue} style={{ color: '#b91c1c' }}>{incorrect}</div>
              <div className={styles.statLabel}>Incorrect</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statValue}>{total}</div>
              <div className={styles.statLabel}>Total</div>
            </div>
          </div>
        </section>

        {/* Topic breakdown */}
        {topics.length > 0 && (
          <section className={styles.performanceTable}>
            <div className={styles.tableHeader}>
              <h2>Topic Performance</h2>
            </div>
            <div className={styles.topicList}>
              {topics.map(([topic, data]) => {
                const tPct = Math.round((data.correct / data.total) * 100)
                const color = tPct >= 80 ? '#0f6e56' : tPct >= 60 ? '#d97706' : '#b91c1c'
                return (
                  <div key={topic} className={styles.topicRow}>
                    <div className={styles.topicInfo}>
                      <div className={styles.topicDot} style={{ background: color }} />
                      <span className={styles.topicName}>{topic}</span>
                    </div>
                    <div className={styles.topicProgress}>
                      <div className={styles.topicBar}>
                        <div className={styles.topicFill} style={{ width: `${tPct}%`, background: color }} />
                      </div>
                      <span className={styles.topicScore} style={{ color }}>{tPct}%</span>
                    </div>
                    <span className={styles.topicCount}>{data.correct}/{data.total}</span>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
