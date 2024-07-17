import styles from './css/study.module.css'
import { useEffect, useState, useContext } from 'react'
import { useSession } from 'next-auth/react';
import StudyButtons from './study-buttons'
import { SharedKanjiProvider } from '../shared-kanji-provider';
import SVG from 'react-inlinesvg'
import { sortByDueDate, cardCounts, updateDecksInDB, updateStatsInDB } from '@/app/util/interval';

export default function Study({ kanjiAndSVG, deck, setStudying, allDecks, setShowOverlay }){
    
    const [showAnswer, setShowAnswer] = useState(false);
    const [kanjiIndex, setKanjiIndex] = useState(2);
    const [dueKanji, setDueKanji] = useState([])
    let { setSharedKanji, sharedKanji, userSettings, userStats } = useContext(SharedKanjiProvider)
    const {data, status} = useSession() // data.user.email

    useEffect(() => {
        setDueKanji(sortByDueDate(deck, [], true))

        const handleKeyDown = (e) => {
            if(e.code === "Space"){
                answerTrue()
            }
        }
        
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [])

    useEffect(() => {
        updateDecksInDB(data.user.email, allDecks, "dueKanji useEffect")
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
        const svgIndex = kanjiAndSVG.findIndex(obj => obj.kanji === deck[kanjiIndex].kanji);
        //console.log(svgIndex)
        if(svgIndex >= 0){
            setSharedKanji({kanji: deck[kanjiIndex].kanji, svg: kanjiAndSVG[svgIndex].svg})
        }
        
    }, [kanjiIndex])
    
    useEffect(() => {
        updateStatsInDB(data.user.email, userStats, "userStats in study")
    }, [userStats])

    const endStudy = () => {
        setStudying(false)
    }

    const answerFalse = () => {
        setShowAnswer(false)
    }

    const answerTrue = () => {
        if(userSettings.autoShowTracing){
            setShowOverlay(true)
        }
        
        setShowAnswer(true)
    }

    const Hint = (kanjiInfo) => {
        return (
            <div className={styles.hint}>
                {<p>{kanjiInfo.kanjiInfo.meanings}</p>}
            </div>
        )
    }

    const Answer = () => {
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
            <div className={styles.cardCounts}>
                {!deck[kanjiIndex].learning && !deck[kanjiIndex].graduated ?
                    <span id="cardCountNew" style={{color: "lightblue", textDecoration: "underline"}}>{cardCounts(deck, userSettings.timeReset)[0]}</span> : 
                    <span id="cardCountNew" style={{color: "lightblue"}}>{cardCounts(deck, userSettings.timeReset)[0]}</span>
                }
                {deck[kanjiIndex].learning ? 
                    <span id="cardCountLearn" style={{color: "red", textDecoration: "underline"}}>{cardCounts(deck, userSettings.timeReset)[1]}</span> :
                    <span id="cardCountLearn" style={{color: "red"}}>{cardCounts(deck, userSettings.timeReset)[1]}</span>
                }
                {deck[kanjiIndex].graduated ?
                    <span id="cardCountGrad" style={{color: "green", textDecoration: "underline"}}>{cardCounts(deck, userSettings.timeReset)[2]}</span> :
                    <span id="cardCountGrad" style={{color: "green"}}>{cardCounts(deck, userSettings.timeReset)[2]}</span>
                }
            </div>
            {showAnswer ? 
                <StudyButtons
                    deck={deck}
                    setShowAnswer={setShowAnswer}
                    kanjiIndex={kanjiIndex}
                    endStudy={endStudy}
                    setDueKanji={setDueKanji}
                    dueKanji={dueKanji}
                    setShowOverlay={setShowOverlay}
                /> : 
                (<div className={styles.showAnswerDiv}>
                    <button onClick={() => answerTrue()}>Show Answer</button>
                </div>)
            }
        </div>
    )
}