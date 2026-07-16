import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import ECGWave from '../components/ECGWave'
import questions from '../data/questions.json'
import styles from '../styles/Home.module.css'

// Dynamic counts from questions.json
const SUBJECT_COUNTS = questions.reduce((acc, q) => {
  acc[q.subject] = (acc[q.subject] || 0) + 1
  return acc
}, {})

const TOTAL = questions.length
const SUBJECT_COUNT = Object.keys(SUBJECT_COUNTS).length

const SUBJECTS = [
  {
    key: 'Anatomy',
    title: 'Anatomy',
    references: "Gray's Anatomy · Snell's Clinical Anatomy",
    description: 'Comprehensive coverage of musculoskeletal, neural, and visceral systems with high-yield clinical correlations.',
    image: '/anatomy.jpg',
  },
  {
    key: 'Physiology',
    title: 'Physiology',
    references: "Guyton & Hall · Ganong's Review",
    description: 'Deep dive into homeostatic mechanisms, cellular signaling, and systemic function with clinical case integration.',
    image: '/physiology.jpg',
  },
  {
    key: 'Pathology',
    title: 'Pathology',
    references: "Robbins & Cotran Pathologic Basis of Disease",
    description: 'Cell injury, inflammation, neoplasia, and organ-system disease — from general principles to clinical pathological correlations.',
    image: '/pathology.jpg',
  },
  {
    key: 'Pharmacology',
    title: 'Pharmacology',
    references: "Katzung's Basic & Clinical Pharmacology · Goodman & Gilman",
    description: 'Drug mechanisms, receptor pharmacology, autonomic, CNS, cardiovascular, antimicrobials, and clinical toxicology.',
    image: '/pharmacology.jpg',
  },
  {
    key: 'Microbiology',
    title: 'Microbiology',
    references: "Jawetz, Melnick & Adelberg's Medical Microbiology",
    description: 'Bacteriology, virology, mycology, parasitology, and immunology — from microbial pathogenesis to clinical infectious disease.',
    image: '/microbiology.jpg',
  },
  {
    key: 'Biochemistry',
    title: 'Biochemistry',
    references: "Lippincott's Illustrated Reviews: Biochemistry · Harper's Illustrated Biochemistry",
    description: 'Metabolism, molecular biology, genetics, and clinical correlations — from enzyme kinetics to inborn errors of metabolism.',
    image: '/biochemistry.jpg',
  },
  {
    key: 'Community Medicine',
    title: 'Community Medicine',
    subtitle: 'Epidemiology & Biostatistics',
    references: "Park's Textbook of Preventive and Social Medicine",
    description: 'Disease surveillance, epidemiological study design, biostatistics, and public health principles for population-level medicine.',
    image: '/community-medicine.jpg',
  },
]

const COMING_SOON = ['Forensic Medicine']
const QUESTION_TYPES = [
  { key: 'All', label: 'All Types' },
  { key: 'factual', label: 'Factual' },
  { key: 'clinical', label: 'Clinical' },
]
const COUNT_OPTIONS = [5, 25, 50]

export default function Home() {
  const router = useRouter()
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [subtopic, setSubtopic] = useState('All')
  const [qtype, setQtype] = useState('All')
  const [mode, setMode] = useState('untimed')
  const [count, setCount] = useState(10)

  const subtopics = selectedSubject
    ? ['All', ...Array.from(new Set(
        questions.filter(q => q.subject === selectedSubject).map(q => q.subtopic)
      ))]
    : []

  useEffect(() => {
    setSubtopic('All')
    setQtype('All')
  }, [selectedSubject])

  const brainRef = useRef(null)
  useEffect(() => {
    const brain = brainRef.current
    if (!brain) return
    let ticking = false
    function apply() {
      const rotation = window.scrollY * 0.15
      brain.style.transform = `translateX(30px) perspective(1000px) rotateY(${rotation}deg)`
      ticking = false
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(apply)
        ticking = true
      }
    }
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Reveal-on-scroll for subject cards
  const cardRefs = useRef([])
  const [visibleCards, setVisibleCards] = useState({})
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.dataset.cardIndex)
          setVisibleCards((prev) => ({ ...prev, [idx]: entry.isIntersecting }))
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    cardRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  function cardRevealStyle(index) {
    const visible = !!visibleCards[index]
    return {
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(36px)',
      transition: 'opacity 0.6s ease, transform 0.6s ease',
      transitionDelay: visible ? `${(index % 4) * 90}ms` : '0ms',
    }
  }

  function startQuiz() {
    if (!selectedSubject) return
    const params = new URLSearchParams({ subject: selectedSubject, subtopic, qtype, mode, count })
    router.push(`/quiz?${params.toString()}`)
  }

  function handleExplore(subjectKey) {
    setSelectedSubject(subjectKey)
    setTimeout(() => {
      document.getElementById('quiz-settings')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>MedPrep | Master Medical Sciences Through Active Recall</title>
        <meta name="description" content="Professional medical MCQ practice platform with clinical vignette focus." />
      </Head>

      <Navbar />

      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <ECGWave />
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <div className={styles.heroTag}>Medical MCQ Practice</div>
              <h1 className={styles.heroTitle}>
                Master Medical Sciences
                <span className={styles.heroAccent}> Through Active Recall</span>
              </h1>
              <p className={styles.heroSubtext}>
                The clinical precision of a medical textbook combined with the efficiency of modern cognitive science. Designed for high-stakes clinical exams.
              </p>

              <div className={styles.statsRow}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{SUBJECT_COUNT}</span>
                  <span className={styles.statLabel}>Subjects</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{TOTAL}</span>
                  <span className={styles.statLabel}>Questions</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>100%</span>
                  <span className={styles.statLabel}>Explained</span>
                </div>
              </div>

              <div className={styles.heroCtas}>
                <button className={styles.btnPrimary} onClick={() => document.getElementById('subjects')?.scrollIntoView({ behavior: 'smooth' })}>
                  Start Practicing
                </button>
                <button className={styles.btnOutline} onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                  How It Works
                </button>
              </div>
            </div>

            <div className={styles.heroVisual}>
              <img
                ref={brainRef}
                src="/brain.png"
                alt="Brain anatomy visualization"
                className={styles.brainImage}
              />
            </div>
          </div>
        </section>

        {/* Subjects */}
        <section id="subjects" className={styles.subjectsSection}>
          <ECGWave />
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Choose Your Subject</h2>
            <p className={styles.sectionSubtitle}>Select a core module to begin your deep-dive preparation.</p>
          </div>

          <div className={styles.subjectGrid}>
            {SUBJECTS.map((subject, index) => (
              <div
                key={subject.key}
                ref={(el) => (cardRefs.current[index] = el)}
                data-card-index={index}
                className={`${styles.subjectCard} ${selectedSubject === subject.key ? styles.subjectCardActive : ''}`}
                onClick={() => handleExplore(subject.key)}
                style={cardRevealStyle(index)}
              >
                <div className={styles.cardImageWrapper}>
                  <img src={subject.image} alt={subject.title} className={styles.cardImage} />
                  <span className={styles.questionBadge}>{SUBJECT_COUNTS[subject.key] || 0} Questions</span>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>
                    {subject.title}
                    {subject.subtitle && <span className={styles.cardTitleSub}> ({subject.subtitle})</span>}
                  </h3>
                  <p className={styles.cardRefs}>{subject.references}</p>
                  <p className={styles.cardDescription}>{subject.description}</p>
                  <button className={styles.exploreBtn} onClick={(e) => { e.stopPropagation(); handleExplore(subject.key) }}>
                    Explore Module <span>→</span>
                  </button>
                </div>
              </div>
            ))}

            <div
              className={styles.comingSoonCard}
              ref={(el) => (cardRefs.current[SUBJECTS.length] = el)}
              data-card-index={SUBJECTS.length}
              style={cardRevealStyle(SUBJECTS.length)}
            >
              <div className={styles.comingSoonInner}>
                <div className={styles.comingSoonIcons}>
                  <span>🧪</span><span>💊</span><span>🔬</span>
                </div>
                <h3 className={styles.comingSoonTitle}>Expanding Curriculum</h3>
                <p className={styles.comingSoonText}>
                  Pathology, Pharmacology, and Microbiology modules are currently in peer-review.
                </p>
                <div className={styles.comingSoonTags}>
                  {COMING_SOON.map(s => <span key={s} className={styles.comingSoonTag}>{s}</span>)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quiz Settings Panel */}
        {selectedSubject && (
          <section id="quiz-settings" className={styles.settingsSection}>
            <div className={styles.settingsPanel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>{selectedSubject} — Quiz Settings</h2>
                <button className={styles.closeBtn} onClick={() => setSelectedSubject(null)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <div className={styles.settingsGrid}>
                {subtopics.length > 1 && (
                  <div className={styles.settingGroup}>
                    <label className={styles.settingLabel}>Subtopic</label>
                    <div className={styles.optionsWrap}>
                      {subtopics.map(st => (
                        <button key={st} className={`${styles.optionBtn} ${subtopic === st ? styles.optionBtnActive : ''}`} onClick={() => setSubtopic(st)}>{st}</button>
                      ))}
                    </div>
                  </div>
                )}
                <div className={styles.settingGroup}>
                  <label className={styles.settingLabel}>Question Type</label>
                  <div className={styles.optionsWrap}>
                    {QUESTION_TYPES.map(t => (
                      <button key={t.key} className={`${styles.optionBtn} ${qtype === t.key ? styles.optionBtnActive : ''}`} onClick={() => setQtype(t.key)}>{t.label}</button>
                    ))}
                  </div>
                </div>
                <div className={styles.settingGroup}>
                  <label className={styles.settingLabel}>Mode</label>
                  <div className={styles.modeWrap}>
                    {['untimed', 'timed'].map(m => (
                      <button key={m} className={`${styles.modeBtn} ${mode === m ? styles.modeBtnActive : ''}`} onClick={() => setMode(m)}>
                        <span className={styles.modeName}>{m === 'untimed' ? 'Untimed' : 'Timed'}</span>
                        <span className={styles.modeDesc}>{m === 'untimed' ? 'Study at your pace' : '90 sec / question'}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.settingGroup}>
                  <label className={styles.settingLabel}>Number of Questions</label>
                  <div className={styles.countWrap}>
                    {COUNT_OPTIONS.map(n => (
                      <button key={n} className={`${styles.countBtn} ${count === n ? styles.countBtnActive : ''}`} onClick={() => setCount(n)}>{n}</button>
                    ))}
                  </div>
                </div>
              </div>

              <button className={styles.startBtn} onClick={startQuiz}>Start Quiz →</button>
            </div>
          </section>
        )}

        {/* Features */}
        <section id="features" className={styles.featuresSection}>
          <div className={styles.featuresContainer}>
            <h2 className={styles.featuresHeading}>Engineered for Medical Excellence</h2>
            <p className={styles.featuresSub}>We don't just provide questions — we provide the definitive path to clinical mastery through structured pedagogy.</p>
            <div className={styles.featuresGrid}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                </div>
                <h4>Textbook Referenced</h4>
                <p>Every explanation is cross-referenced with Gray's, Guyton, Snell's, and Ganong for absolute accuracy.</p>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                </div>
                <h4>Clinical + Factual Mix</h4>
                <p>Balanced content including high-yield facts and complex multi-step clinical reasoning vignettes.</p>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
                  </svg>
                </div>
                <h4>Clinical Excellence</h4>
                <p>Designed by medical professionals to simulate the rigor of boards and real-world clinical practice.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaBanner}>
          <div className={styles.ctaContent}>
            <h3>Ready to elevate your study efficiency?</h3>
            <p>Master the clinical sciences with evidence-based questions and detailed textbook explanations.</p>
            <div className={styles.bannerCtas}>
              <button className={styles.btnPrimaryWhite} onClick={() => document.getElementById('subjects')?.scrollIntoView({ behavior: 'smooth' })}>
                Start Practicing
              </button>
              <button className={styles.btnOutlineWhite} onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                View Features
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>MedPrep</div>
            <p>Evidence-based clinical scenarios cited from Gray's Anatomy, Guyton & Hall Medical Physiology, and Snell's Clinical Anatomy.</p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.linkCol}>
              <h5>Platform</h5>
              <a href="#subjects">Subjects</a>
              <a href="#features">Features</a>
            </div>
            <div className={styles.linkCol}>
              <h5>Support</h5>
              <a href="#">Institutional Access</a>
              <a href="#">Contact Support</a>
            </div>
            <div className={styles.linkCol}>
              <h5>Legal</h5>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 MedPrep. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
