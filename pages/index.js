import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import questions from '../data/questions.json'
import styles from '../styles/Home.module.css'

const SUBJECT_QUESTION_COUNTS = questions.reduce((acc, q) => {
  acc[q.subject] = (acc[q.subject] || 0) + 1
  return acc
}, {})

const SUBJECTS = [
  {
    key: 'Anatomy',
    label: 'Anatomy',
    ref: "Gray's Anatomy · Snell's Clinical Anatomy",
    desc: 'Master spatial relationships and clinical landmarks through regional and systemic reviews.',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80',
  },
  {
    key: 'Physiology',
    label: 'Physiology',
    ref: "Guyton & Hall · Ganong's Review",
    desc: 'Deep dive into cellular mechanisms and organ systems integration.',
    image: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=600&q=80',
  },
]

const COMING_SOON = ['Pathology', 'Pharmacology', 'Microbiology']

const QUESTION_TYPES = [
  { key: 'All', label: 'All Types' },
  { key: 'factual', label: 'Factual' },
  { key: 'clinical', label: 'Clinical' },
]

const COUNT_OPTIONS = [10, 25, 50, 100]

export default function Home() {
  const router = useRouter()
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [subtopic, setSubtopic] = useState('All')
  const [qtype, setQtype] = useState('All')
  const [mode, setMode] = useState('untimed')
  const [count, setCount] = useState(10)

  const subtopics = selectedSubject
    ? ['All', ...Array.from(new Set(
        questions.filter(q => q.subject === selectedSubject && q.subtopic).map(q => q.subtopic)
      ))]
    : []

  useEffect(() => {
    setSubtopic('All')
    setQtype('All')
  }, [selectedSubject])

  function startQuiz() {
    if (!selectedSubject) return
    const params = new URLSearchParams({ subject: selectedSubject, subtopic: subtopic || 'All', qtype: qtype || 'All', mode, count })
    router.push(`/quiz?${params.toString()}`)
  }

  return (
    <div className={styles.page}>
      <Navbar />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>Medical MCQ Practice</div>
          <h1 className={styles.heroH1}>Master Medical Sciences<br />Through Active Recall</h1>
          <p className={styles.heroSub}>
            Professional scenario-based practice with evidence-based explanations.
            Designed for the high-efficiency medical student who demands clinical precision.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.heroCta} onClick={() => { document.getElementById('subjects')?.scrollIntoView({ behavior: 'smooth' }) }}>
              Start Practicing <span>→</span>
            </button>
          </div>
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
        </div>
      </section>

      {/* Subjects */}
      <section id="subjects" className={styles.subjectsSection}>
        <h2 className={styles.sectionTitle}>Choose Your Subject</h2>
        <div className={styles.cardsGrid}>
          {SUBJECTS.map(subject => (
            <div
              key={subject.key}
              className={`${styles.card} ${selectedSubject === subject.key ? styles.cardSelected : ''}`}
              onClick={() => setSelectedSubject(subject.key === selectedSubject ? null : subject.key)}
            >
              <div className={styles.cardImg} style={{ backgroundImage: `url(${subject.image})` }}>
                <div className={styles.cardBadge}>{SUBJECT_QUESTION_COUNTS[subject.key] || 0} Questions</div>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{subject.label}</h3>
                <p className={styles.cardRef}>{subject.ref}</p>
                <p className={styles.cardDesc}>{subject.desc}</p>
                <span className={styles.exploreLink}>EXPLORE MODULE ›</span>
              </div>
            </div>
          ))}
        </div>

        {/* Expanding Curriculum */}
        <div className={styles.expandingCard}>
          <div className={styles.expandingLeft}>
            <h3 className={styles.expandingTitle}>Expanding Curriculum</h3>
            <p className={styles.expandingDesc}>Pathology, Pharmacology, and Microbiology modules are currently in peer-review.</p>
          </div>
          <div className={styles.expandingTags}>
            {COMING_SOON.map(s => (
              <span key={s} className={styles.comingTag}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Settings Panel */}
      {selectedSubject && (
        <section className={styles.settingsPanelWrap}>
          <div className={styles.settingsPanel}>
            <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>{selectedSubject} Quiz Settings</h2>
            <button className={styles.closeBtn} onClick={() => setSelectedSubject(null)}>
              <svg viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
          <div className={styles.settingsGrid}>
            {subtopics.length > 1 && (
              <div className={styles.settingGroup}>
                <label className={styles.settingLabel}>Subtopic</label>
                <div className={styles.optionsGrid}>
                  {subtopics.map(st => (
                    <button key={st} className={`${styles.optionBtn} ${subtopic === st ? styles.optionBtnActive : ''}`} onClick={() => setSubtopic(st)}>{st}</button>
                  ))}
                </div>
              </div>
            )}
            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Question Type</label>
              <div className={styles.optionsGrid}>
                {QUESTION_TYPES.map(t => (
                  <button key={t.key} className={`${styles.optionBtn} ${qtype === t.key ? styles.optionBtnActive : ''}`} onClick={() => setQtype(t.key)}>{t.label}</button>
                ))}
              </div>
            </div>
            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Mode</label>
              <div className={styles.modeOptions}>
                {['untimed', 'timed'].map(m => (
                  <button key={m} className={`${styles.modeBtn} ${mode === m ? styles.modeBtnActive : ''}`} onClick={() => setMode(m)}>
                    <span className={styles.modeBtnTitle}>{m === 'untimed' ? 'Untimed' : 'Timed'}</span>
                    <span className={styles.modeBtnDesc}>{m === 'untimed' ? 'Study at your pace' : '90 sec/question'}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Number of Questions</label>
              <div className={styles.countOptions}>
                {COUNT_OPTIONS.map(n => (
                  <button key={n} className={`${styles.countBtn} ${count === n ? styles.countBtnActive : ''}`} onClick={() => setCount(n)}>{n}</button>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.panelFooter}>
            <button className={styles.startBtn} onClick={startQuiz}>Start Quiz →</button>
          </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section id="features" className={styles.featuresSection}>
        <div className={styles.featuresGrid}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
            <h3 className={styles.featureTitle}>Textbook Referenced</h3>
            <p className={styles.featureDesc}>Every single explanation cites gold-standard texts including Gray's, Guyton, Snell's, and Ganong for authoritative study.</p>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <h3 className={styles.featureTitle}>Clinical + Factual Mix</h3>
            <p className={styles.featureDesc}>Engage with scenarios modelled on professional clinical practice. We bridge the gap between rote memorization and diagnostic application.</p>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
            </div>
            <h3 className={styles.featureTitle}>Clinical Excellence</h3>
            <p className={styles.featureDesc}>Designed for the highest standard of medical science preparation, ensuring you don't just pass exams, but understand the human body.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ready to elevate your study efficiency?</h2>
        <p className={styles.ctaSub}>Join thousands of medical students mastering clinical sciences through the MedPrep evidence-based methodology.</p>
        <div className={styles.ctaActions}>
          <button className={styles.ctaPrimary} onClick={() => { document.getElementById('subjects')?.scrollIntoView({ behavior: 'smooth' }) }}>
            Start Practicing
          </button>
          <button className={styles.ctaSecondary} onClick={() => { document.getElementById('subjects')?.scrollIntoView({ behavior: 'smooth' }) }}>
            View Subjects
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <div className={styles.footerLogo}>
            <span className={styles.footerDot} />
            MedPrep
          </div>
          <p className={styles.footerCopy}>
            © 2024 MedPrep. Evidence-based clinical scenarios cited from Gray's Anatomy, Guyton & Hall Medical Physiology, and Snell's Clinical Anatomy.
          </p>
        </div>
        <div className={styles.footerLinks}>
          <div className={styles.footerCol}>
            <div className={styles.footerColTitle}>Legal</div>
            <a className={styles.footerLink} href="#">Terms of Service</a>
            <a className={styles.footerLink} href="#">Privacy Policy</a>
          </div>
          <div className={styles.footerCol}>
            <div className={styles.footerColTitle}>Support</div>
            <a className={styles.footerLink} href="#">Institutional Access</a>
            <a className={styles.footerLink} href="#">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
