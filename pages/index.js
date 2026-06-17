import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import questions from '../data/questions.json'
import styles from '../styles/Home.module.css'

// Calculate question counts per subject
const SUBJECT_QUESTION_COUNTS = questions.reduce((acc, q) => {
  acc[q.subject] = (acc[q.subject] || 0) + 1;
  return acc;
}, {});

const SUBJECTS = [
  { 
    key: 'Anatomy', 
    label: 'Anatomy', 
    ref: "Gray's Anatomy · Snell's Clinical Anatomy",
    color: '#0f6e56',
    gradient: 'linear-gradient(135deg, #0f6e56 0%, #1d9e75 100%)',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="20" r="8" stroke="white" strokeWidth="2" opacity="0.9"/>
        <path d="M32 28v16M24 36h16M20 44h24" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
        <ellipse cx="32" cy="52" rx="12" ry="6" stroke="white" strokeWidth="2" opacity="0.5"/>
      </svg>
    )
  },
  { 
    key: 'Physiology', 
    label: 'Physiology', 
    ref: "Guyton & Hall · Ganong's Review",
    color: '#1d9e75',
    gradient: 'linear-gradient(135deg, #1d9e75 0%, #2ecc71 100%)',
    image: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=400&q=80',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 32c4-8 8-12 12-8s8 16 12 16 8-12 12-16 8 0 12 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
        <circle cx="20" cy="28" r="3" fill="white" opacity="0.6"/>
        <circle cx="44" cy="28" r="3" fill="white" opacity="0.6"/>
      </svg>
    )
  },
  { 
    key: 'Pathology', 
    label: 'Pathology', 
    ref: "Robbins Pathology",
    color: '#e24b4a',
    gradient: 'linear-gradient(135deg, #e24b4a 0%, #ff6b6b 100%)',
    comingSoon: true,
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&q=80',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="28" r="10" stroke="white" strokeWidth="2" opacity="0.7"/>
        <circle cx="40" cy="28" r="10" stroke="white" strokeWidth="2" opacity="0.7"/>
        <circle cx="32" cy="44" r="10" stroke="white" strokeWidth="2" opacity="0.7"/>
        <path d="M28 24l8 8M36 24l-8 8" stroke="white" strokeWidth="1.5" opacity="0.5"/>
      </svg>
    )
  },
  { 
    key: 'Pharmacology', 
    label: 'Pharmacology', 
    ref: "Katzung · Goodman & Gilman",
    color: '#9b59b6',
    gradient: 'linear-gradient(135deg, #9b59b6 0%, #be93d4 100%)',
    comingSoon: true,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="18" width="24" height="28" rx="4" stroke="white" strokeWidth="2" opacity="0.8"/>
        <line x1="20" y1="32" x2="44" y2="32" stroke="white" strokeWidth="2" opacity="0.6"/>
        <circle cx="32" cy="25" r="3" stroke="white" strokeWidth="1.5" opacity="0.7"/>
        <circle cx="32" cy="39" r="3" stroke="white" strokeWidth="1.5" opacity="0.7"/>
      </svg>
    )
  },
]

const QUESTION_TYPES = [
  { key: 'All', label: 'All Types', desc: 'Factual + clinical mixed' },
  { key: 'factual', label: 'Factual', desc: 'Core knowledge recall' },
  { key: 'clinical', label: 'Clinical', desc: 'Scenario-based questions' },
]

const COUNT_OPTIONS = [10, 25, 50, 100]

export default function Home() {
  const router = useRouter()
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [subtopic, setSubtopic] = useState('All')
  const [qtype, setQtype] = useState('All')
  const [mode, setMode] = useState('untimed')
  const [count, setCount] = useState(10)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const heroRef = useRef(null)

  const subtopics = selectedSubject && !SUBJECTS.find(s => s.key === selectedSubject)?.comingSoon
    ? ['All', ...Array.from(new Set(
        questions
          .filter(q => q.subject === selectedSubject && q.subtopic)
          .map(q => q.subtopic)
      ))]
    : []

  useEffect(() => {
    setSubtopic('All')
    setQtype('All')
  }, [selectedSubject])

  // Mouse tracking for hero glow effect
  useEffect(() => {
    function handleMouseMove(e) {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  function startQuiz() {
    if (!selectedSubject) return
    const params = new URLSearchParams({
      subject: selectedSubject,
      subtopic: subtopic || 'All',
      qtype: qtype || 'All',
      mode,
      count
    })
    router.push(`/quiz?${params.toString()}`)
  }

  const canStart = selectedSubject && !SUBJECTS.find(s => s.key === selectedSubject)?.comingSoon

  return (
    <div>
      <Navbar />
      <main className={styles.main}>
        {/* Hero Section */}
        <section 
          ref={heroRef}
          className={styles.hero}
          style={{
            '--mouse-x': `${mousePos.x}px`,
            '--mouse-y': `${mousePos.y}px`
          }}
        >
          <div className={styles.heroBg}></div>
          
          <div className={styles.heroContent}>
            <div className={styles.heroTag}>Medical MCQ Practice</div>
            <h1 className={styles.heroH1}>Master Medical Sciences<br/>Through Active Recall</h1>
            <p className={styles.heroSub}>
              Clinical scenario-based questions with detailed textbook explanations. 
              Built for medical students who want structured, exam-style practice.
            </p>
            
            <div className={styles.statsRow}>
              <div className={styles.stat}>
                <div className={styles.statN}>{Object.keys(SUBJECT_QUESTION_COUNTS).length}</div>
                <div className={styles.statL}>Subjects</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statN}>{questions.length}</div>
                <div className={styles.statL}>Questions</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statN}>100%</div>
                <div className={styles.statL}>Explained</div>
              </div>
            </div>

            <button 
              className={styles.heroCta}
              onClick={() => {
                const firstAvailable = SUBJECTS.find(s => !s.comingSoon)
                if (firstAvailable) setSelectedSubject(firstAvailable.key)
              }}
            >
              Start Practicing
              <svg className={styles.ctaArrow} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </section>

        {/* Subject Cards */}
        <section className={styles.subjectsSection}>
          <h2 className={styles.sectionTitle}>Choose Your Subject</h2>
          <div className={styles.cardsGrid}>
            {SUBJECTS.filter(s => !s.comingSoon).map(subject => (
              <div
                key={subject.key}
                className={`${styles.card} ${selectedSubject === subject.key ? styles.cardSelected : ''}`}
                onClick={() => setSelectedSubject(subject.key === selectedSubject ? null : subject.key)}
                style={{ '--card-color': subject.color }}
              >
                <div className={styles.cardImage} style={{ backgroundImage: `url(${subject.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div className={styles.cardImageOverlay}></div>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{subject.label}</h3>
                  <p className={styles.cardRef}>{subject.ref}</p>
                  <div className={styles.questionCount}>
                    {SUBJECT_QUESTION_COUNTS[subject.key] || 0} Questions
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', marginTop: '12px' }}>
            Pathology, Pharmacology & more coming soon
          </p>
        </section>

        {/* Settings Panel - Shows when subject is selected */}
        {selectedSubject && (
          <section className={styles.settingsPanel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>
                {SUBJECTS.find(s => s.key === selectedSubject)?.label} Quiz Settings
              </h2>
              <button 
                className={styles.closeBtn}
                onClick={() => setSelectedSubject(null)}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className={styles.settingsGrid}>
              {/* Subtopic */}
              {subtopics.length > 1 && (
                <div className={styles.settingGroup}>
                  <label className={styles.settingLabel}>Subtopic</label>
                  <div className={styles.optionsGrid}>
                    {subtopics.map(st => (
                      <button
                        key={st}
                        className={`${styles.optionBtn} ${subtopic === st ? styles.optionBtnActive : ''}`}
                        onClick={() => setSubtopic(st)}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Question Type */}
              <div className={styles.settingGroup}>
                <label className={styles.settingLabel}>Question Type</label>
                <div className={styles.optionsGrid}>
                  {QUESTION_TYPES.map(t => (
                    <button
                      key={t.key}
                      className={`${styles.optionBtn} ${qtype === t.key ? styles.optionBtnActive : ''}`}
                      onClick={() => setQtype(t.key)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode */}
              <div className={styles.settingGroup}>
                <label className={styles.settingLabel}>Mode</label>
                <div className={styles.modeOptions}>
                  {['untimed', 'timed'].map(m => (
                    <button
                      key={m}
                      className={`${styles.modeBtn} ${mode === m ? styles.modeBtnActive : ''}`}
                      onClick={() => setMode(m)}
                    >
                      <span className={styles.modeBtnTitle}>{m === 'untimed' ? 'Untimed' : 'Timed'}</span>
                      <span className={styles.modeBtnDesc}>{m === 'untimed' ? 'Study at your pace' : '90 sec/question'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Count */}
              <div className={styles.settingGroup}>
                <label className={styles.settingLabel}>Number of Questions</label>
                <div className={styles.countOptions}>
                  {COUNT_OPTIONS.map(n => (
                    <button
                      key={n}
                      className={`${styles.countBtn} ${count === n ? styles.countBtnActive : ''}`}
                      onClick={() => setCount(n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.panelFooter}>
              <button
                className={styles.startBtn}
                onClick={startQuiz}
                disabled={!canStart}
              >
                {!canStart 
                  ? 'Select options above'
                  : 'Start Quiz →'}
              </button>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>📖</div>
              <h3 className={styles.featureTitle}>Textbook Referenced</h3>
              <p className={styles.featureDesc}>Every explanation cites Gray's, Guyton, Snell's, Robbins, and Katzung.</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🩺</div>
              <h3 className={styles.featureTitle}>Clinical + Factual Mix</h3>
              <p className={styles.featureDesc}>Scenario-based and recall questions modelled on real NRE exam style.</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🎯</div>
              <h3 className={styles.featureTitle}>Built for NRE/NLE</h3>
              <p className={styles.featureDesc}>Topics mapped directly to the PM&DC NRE 2023 syllabus.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
