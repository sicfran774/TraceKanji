import styles from './css/study.module.css'
import { useEffect, useState, useContext } from 'react'
import { useSession } from 'next-auth/react';
import StudyButtons from './study-buttons'
import { SharedKanjiProvider } from '../shared-kanji-provider';
import SVG from 'react-inlinesvg'
import { sortByDueDate, updateDecksInDB } from '@/app/util/interval';

export default function Study({ kanjiAndSVG, deck, setStudying, allDecks }){
    
    const [showAnswer, setShowAnswer] = useState(false);
    const [kanjiIndex, setKanjiIndex] = useState(2);
    const [dueKanji, setDueKanji] = useState([])
    let { setSharedKanji, sharedKanji } = useContext(SharedKanjiProvider)
    const {data, status} = useSession() // data.user.email

    useEffect(() => {
        //console.log(deckSettings.maxNewCards)
        setDueKanji(sortByDueDate(deck))
        //console.log(kanjiAndSVG)
    }, [])

    useEffect(() => {
        updateDecksInDB(data.user.email, allDecks)
        if(dueKanji.length > 0){ //If there are due kanji
            //Look for it in deck
            const index = deck.findIndex(obj => obj.kanji === dueKanji[0]);
            //console.log("current: " + deck[index].meanings)
            setKanjiIndex(index)
        } else {
            //endStudy()
        }
    }, [dueKanji])

    useEffect(() => {
        //console.log(deck[kanjiIndex])
        const svgIndex = kanjiAndSVG.findIndex(obj => obj.info.kanji === deck[kanjiIndex].kanji);
        //console.log(svgIndex)
        if(svgIndex >= 0){
            setSharedKanji({kanji: deck[kanjiIndex].kanji, svg: kanjiAndSVG[svgIndex].svg})
        }
        
    }, [kanjiIndex])

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
                {<SVG src={sharedKanji.svg} className={styles.kanji}/>}
            </div>
        )
    }

    return (
        <div className={styles.main}>
            <div className={styles.quitDiv}><button className={styles.quitButton} onClick={() => endStudy()}>Quit</button></div>
            <div className={styles.info}>
                {/* Sends MongoDB info for deck */}
                <Hint kanjiInfo={deck[kanjiIndex]} />
                {/* Sends SVG info */}
                {showAnswer && <Answer/>}
            </div>
            {showAnswer ? 
                <StudyButtons
                    deck={deck}
                    setShowAnswer={setShowAnswer}
                    kanjiIndex={kanjiIndex}
                    endStudy={endStudy}
                    setDueKanji={setDueKanji}
                    dueKanji={dueKanji}
                /> : 
                (<div className={styles.showAnswerDiv}>
                    <button onClick={() => answerTrue()}>Show Answer</button>
                </div>)}
            
        </div>
    )
}