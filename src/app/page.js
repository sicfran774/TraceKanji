import styles from './page.module.css';
import DrawArea from './components/draw-area';
import KanjiList from './components/kanji-list';

export default async function App() {
  return (
    <div className={styles.main}>
      <DrawArea />
      <KanjiList />
    </div>
  )
}
