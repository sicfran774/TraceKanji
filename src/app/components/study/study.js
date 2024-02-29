import styles from './css/study.module.css'
import { useEffect, useState, useContext } from 'react'
import StudyButtons from './study-buttons'
import { SharedKanjiProvider } from '../shared-kanji-provider';
import SVG from 'react-inlinesvg'

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

    const Hint = (kanjiInfo) => {
        return (
            <div className={styles.hint}>
                {<h1>{kanjiInfo.kanjiInfo.info.heisig_en}</h1>}
            </div>
        )
    }

    const Answer = (kanjiInfo) => {
        return (
            <div className={styles.answer}>
                {<SVG src={kanjiInfo.kanjiInfo.svg} className={styles.kanji}/>}
            </div>
        )
    }

    return (
        <div className={styles.main}>
            <button onClick={() => endStudy()}>End Study</button>
            <div className={styles.info}>
                <Hint kanjiInfo={deck[kanjiIndex]} />
                {showAnswer && <Answer kanjiInfo={deck[kanjiIndex]}/>}
            </div>
            {showAnswer ? 
                <StudyButtons 
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