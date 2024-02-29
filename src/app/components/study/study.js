import styles from './css/study.module.css'
import { useEffect, useState, useContext } from 'react'
import StudyButtons from './study-buttons'
import { SharedKanjiProvider } from '../shared-kanji-provider';
import SVG from 'react-inlinesvg'
import { sortByDueDate } from '@/app/util/interval';

export default function Study({ kanjiAndSVG, deck, setStudying }){

    const [showAnswer, setShowAnswer] = useState(false);
    const [kanjiIndex, setKanjiIndex] = useState(0);
    let { setSharedKanji, sharedKanji } = useContext(SharedKanjiProvider)

    useEffect(() => {
        sortByDueDate(deck)
        setSharedKanji({kanji: kanjiAndSVG[kanjiIndex].info.kanji, svg: kanjiAndSVG[kanjiIndex].svg})
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
        console.log()
        return (
            <div className={styles.hint}>
                {<h1>{kanjiInfo.kanjiInfo.meanings}</h1>}
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
                {/* Sends MongoDB info for deck */}
                <Hint kanjiInfo={deck[kanjiIndex + 2]} /> 
                {/* Sends SVG info */}
                {showAnswer && <Answer kanjiInfo={kanjiAndSVG[kanjiIndex]}/>}
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