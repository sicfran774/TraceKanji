import styles from './page.module.css';
import Selection from './components/selection';
import SignIn from './components/sign-in';

export default async function App() {
  return (
      <div className={styles.main}>
        <div className={styles.header}>
          <h1>Trace Kanji</h1>
          <SignIn />
        </div>
        <div className={styles.body}>
          <Selection />
        </div>
      </div>
  )
}
