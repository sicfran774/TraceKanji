import styles from './page.module.css';
import DrawArea from './components/draw-area';
import Selection from './components/selection';

export default async function App() {
  return (
      <div className={styles.main}>
        <Selection />
        <DrawArea />
      </div>
  )
}
