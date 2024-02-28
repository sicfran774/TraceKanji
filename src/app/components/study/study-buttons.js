import styles from './css/study-buttons.module.css'
import { useContext } from 'react'
import { SharedKanjiProvider } from '../shared-kanji-provider';

export default function StudyButtons({ deck, setShowAnswer, kanjiIndex, setKanjiIndex, endStudy }){

    let { setSharedKanji, sharedKanji } = useContext(SharedKanjiProvider)

    const nextKanji = (choice) => {
        if(kanjiIndex < deck.length - 1){
            setKanjiIndex(kanjiIndex + 1)
            setShowAnswer(false)
        } else {
            endStudy()
        }
    }

    return (
        <div className={styles.main}>
            <div className={styles.buttonDiv}>
                <button onClick={() => nextKanji(0)}>Again</button>
                <p>Time</p>
            </div>
            <div className={styles.buttonDiv}>
                <button onClick={() => nextKanji(1)}>Hard</button>
                <p>Time</p>
            </div>
            <div className={styles.buttonDiv}>
                <button onClick={() => nextKanji(2)}>Good</button>
                <p>Time</p>
            </div>
            <div className={styles.buttonDiv}>
                <button onClick={() => nextKanji(3)}>Easy</button>
                <p>Time</p>
            </div>
        </div>
    )
}