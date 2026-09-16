import Head from 'next/head'
import Navbar from '../components/Navbar'
import styles from '../styles/Legal.module.css'

export default function Privacy() {
  return (
    <div>
      <Head>
        <title>Privacy Policy | MedPrep</title>
        <meta name="description" content="MedPrep's privacy policy — what data is and isn't collected." />
      </Head>
      <Navbar />
      <main className={styles.wrap}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: September 2026</p>

        <p>MedPrep is a free study tool for medical students. This page explains, plainly, what happens to your data when you use it.</p>

        <h2>No accounts, no sign-up</h2>
        <p>MedPrep doesn't have user accounts. You don't create a profile, and we don't ask for your name, email, or any other personal information to use the site.</p>

        <h2>Quiz data isn't stored on a server</h2>
        <p>When you take a quiz, your question selection, answers, and score are handled entirely in your browser and passed through the page's URL to show you your results. Nothing is saved to a database — once you close the tab, that session's data is gone. We don't keep a history of quizzes you've taken.</p>

        <h2>Analytics</h2>
        <p>MedPrep uses Vercel Web Analytics to understand aggregate traffic — things like how many people visit and which pages are popular. This analytics service doesn't use cookies and doesn't track you individually across sites; it can't identify who you are.</p>

        <h2>No ads, no data sale</h2>
        <p>MedPrep doesn't show ads, doesn't use ad-tracking scripts, and doesn't sell or share any data with third parties. There's no data to sell in the first place, since nothing personal is collected.</p>

        <h2>No payments</h2>
        <p>MedPrep is currently free to use, and no payment information is collected or processed.</p>

        <h2>Changes to this policy</h2>
        <p>If MedPrep's data practices change as the platform grows (for example, if accounts are introduced in the future), this page will be updated to reflect that.</p>
      </main>
    </div>
  )
}
