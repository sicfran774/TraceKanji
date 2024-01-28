import styles from './page.module.css';
import Selection from './components/selection';
import SignIn from './components/sign-in';
import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  title: 'Trace Kanji: Online japanese kanji tracer',
  description: 'Create your own decks and search for kanji',
}

export default async function App() {
  return (
      <div className={styles.main}>
        <div className={styles.header}>
          <div className={styles.title}>
            <h1>Trace Kanji</h1>
            <span>Kanji tracer and handwriting recognition</span>
          </div>
          <SignIn />
        </div>
        <div className={styles.body}>
          <Selection />
        </div>
        <Analytics />
      </div>
  )
}
