import Head from 'next/head'
import Navbar from '../components/Navbar'
import styles from '../styles/Legal.module.css'

export default function Terms() {
  return (
    <div>
      <Head>
        <title>Terms of Service | MedPrep</title>
        <meta name="description" content="MedPrep's terms of service." />
      </Head>
      <Navbar />
      <main className={styles.wrap}>
        <h1 className={styles.title}>Terms of Service</h1>
        <p className={styles.updated}>Last updated: September 2026</p>

        <h2>What MedPrep is</h2>
        <p>MedPrep is a free, self-study quiz tool for medical students, offered as-is with no warranty. It is not affiliated with, endorsed by, or officially connected to any university, licensing board, or examination authority.</p>

        <h2>Educational use only</h2>
        <p>Content on MedPrep is intended for self-study and exam preparation. It is not medical advice, and it is not a substitute for your official course curriculum, textbooks, or instructor guidance. While questions are researched and referenced against standard medical texts, you should always cross-check against your own syllabus, particularly ahead of high-stakes exams.</p>

        <h2>No accuracy guarantee</h2>
        <p>We work to keep content accurate and up to date, but medical knowledge and curricula evolve, and mistakes are possible. If you spot an error, we'd rather know about it than have it stand — but we can't guarantee the content is error-free or complete.</p>

        <h2>Acceptable use</h2>
        <p>Please don't attempt to disrupt, scrape at scale, or misuse the service in ways that affect other users' access to it.</p>

        <h2>Changes</h2>
        <p>These terms may be updated as MedPrep evolves. Continued use of the site after changes means you accept the updated terms.</p>

        <h2>Limitation of liability</h2>
        <p>MedPrep is provided free of charge and "as is." To the fullest extent permitted by law, we are not liable for any outcomes — academic, professional, or otherwise — resulting from use of the site.</p>
      </main>
    </div>
  )
}
