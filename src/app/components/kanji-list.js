import KanjiCard from "./kanji-card"
import styles from './css/kanji-list.module.css';

export default async function KanjiList(){
    return(
        <div className={styles.kanjiList}>
            <ul>
                {kanjiInfo.map((item, index) => (
                    <li key={index}>
                        <KanjiCard kanji={kanjiInfo[index]} svg={item.svg}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}