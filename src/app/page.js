import styles from './page.module.css';
import Selection from './components/selection';
import { Analytics } from '@vercel/analytics/react'
import Header from './components/header/header';
import Footer from './components/footer/footer';

export const metadata = {
  title: 'Trace Kanji: Kanji recognition and learning tool',
  description: 'Handwritten kanji recognizer. Learn stroke orders, discover words and info about the kanji in a mobile-friendly environment. Sign-in to create kanji decks.',
}

export default async function App() {

  return (
      <div className={styles.main}>
        <Header />
        <div className={styles.body} id="mainBody">
          <Selection />
        </div>
        <Footer />
        <Analytics />
      </div>
  )
}
