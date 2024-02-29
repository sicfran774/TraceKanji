import styles from './css/study-buttons.module.css'
import { useContext } from 'react'
import { SharedKanjiProvider } from '../shared-kanji-provider';
import { addToDate } from '@/app/util/interval';

export default function StudyButtons({ deck, setShowAnswer, kanjiIndex, setKanjiIndex, endStudy }){
    // Deck --> [title, settings, {kanji: ~, meanings: ~, interval: ~}]

    let { setSharedKanji, sharedKanji } = useContext(SharedKanjiProvider)

    const nextKanji = (choice) => {
        const interval = deck[1].interval
        addToDate(new Date("2024-02-29T05:58:37.503Z"), interval[choice])

        if(kanjiIndex < deck.length - 3){ //Ignore name and interval
            setKanjiIndex(kanjiIndex + 1)
            setShowAnswer(false)
        } else {
            endStudy()
        }
    }

    //console.log(deck)

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