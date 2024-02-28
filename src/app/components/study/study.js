import styles from './css/study.module.css'
import { useEffect, useState, useContext } from 'react'
import StudyButtons from './study-buttons'
import { SharedKanjiProvider } from '../shared-kanji-provider';
import { blue } from '@mui/material/colors';

export default function Study({ deck, setStudying }){

    const [showAnswer, setShowAnswer] = useState(false);
    const [kanjiIndex, setKanjiIndex] = useState(0);
    let { setSharedKanji, sharedKanji } = useContext(SharedKanjiProvider)

    useEffect(() => {
        setSharedKanji({kanji: deck[kanjiIndex].info.kanji, svg: deck[kanjiIndex].svg})
    }, [ , kanjiIndex])

    const endStudy = () => {
        setStudying(false)
    }

    const answerFalse = () => {
        setShowAnswer(false)
    }

    const answerTrue = () => {
        setShowAnswer(true)
    }

    return (
        <div className={styles.main}>
            <div className={styles.info}>
                <ul>
                {deck.map((item, index) => {
                    if(index == kanjiIndex){
                        return (<li style={{color: "blue"}} key={item.info.kanji}>{item.info.kanji}</li>)
                    } else {
                        return (<li key={item.info.kanji}>{item.info.kanji}</li>)
                    }
                    
                })}
                </ul>
                <button onClick={() => endStudy()}>End Study</button>
            </div>
            {showAnswer ? <StudyButtons 
                            deck={deck}
                            setShowAnswer={setShowAnswer}
                            kanjiIndex={kanjiIndex}
                            setKanjiIndex={setKanjiIndex}
                            endStudy={endStudy}
                        /> : 
            (<div className={styles.showAnswerDiv}>
                <button onClick={() => answerTrue()}>Show Answer</button>
            </div>)}
        </div>
    )
}