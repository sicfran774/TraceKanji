import styles from './page.module.css';
import Selection from './components/selection';

export default async function App() {
  return (
      <div className={styles.main}>
        <div className={styles.header}>
                <h1>Trace Kanji</h1>
                <div className={styles.signIn}>
                    <button type="button" className='button'>Login</button>
                </div>
            </div>
        <div className={styles.body}>
          <Selection />
        </div>
      </div>
  )
}
