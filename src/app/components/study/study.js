import styles from './css/study.module.css'
import { useEffect, useState, useContext } from 'react'
import { useSession } from 'next-auth/react';
import StudyButtons from './study-buttons'
import EditCardScreen from '../draw-area/deck-manager/edit-card';
import moment from 'moment';
import SVG from 'react-inlinesvg'
import { SharedKanjiProvider } from '../shared-kanji-provider';
import { sortByDueDate, cardCounts, updateDecksInDB, updateStatsInDB, addToDate } from '@/app/util/interval';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles'

export default function Study({ kanjiAndSVG, deck, setStudying, allDecks, setShowOverlay }){
    
    const [showAnswer, setShowAnswer] = useState(false);
    const [kanjiIndex, setKanjiIndex] = useState(2);
    const [dueKanji, setDueKanji] = useState([])
    const [firstLoad, setFirstLoad] = useState(false)
    const [lastKanji, setLastKanji] = useState({})
    const [startTime, setStartTime] = useState(moment())
    const [timeTaken, setTimeTaken] = useState(moment.duration(0).asMilliseconds());

    let { setSharedKanji, sharedKanji, userSettings, userStats, theme } = useContext(SharedKanjiProvider)
    const {data, status} = useSession() // data.user.email

    const [openDialog, setOpenDialog] = useState(false)

    const handleKeyDown = (e) => {
        if(e.code === "Space" && !openDialog){
            e.preventDefault();
            answerTrue()
        }
    }

    useEffect(() => {
        setDueKanji(sortByDueDate(deck, [], true, userSettings.timeReset))
        setFirstLoad(true)
    }, [])

    useEffect(() => {
        updateDecksInDB(data.user.email, allDecks, "dueKanji useEffect")
        if(dueKanji.length > 0){ //If there are due kanji
            //Look for it in deck
            const index = deck.findIndex(obj => obj.kanji === dueKanji[0]);
            //console.log("current: " + deck[index].meanings)
            setKanjiIndex(index)
        } else if (firstLoad) {
            endStudy()
        }
    }, [dueKanji])

    useEffect(() => {
        const svgIndex = kanjiAndSVG.findIndex(obj => obj.kanji === deck[kanjiIndex].kanji);

        if(svgIndex >= 0){
            setSharedKanji({kanji: deck[kanjiIndex].kanji, svg: kanjiAndSVG[svgIndex].svg})
        }
        
        answerFalse()
    }, [kanjiIndex])

    useEffect(() => {        
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [kanjiIndex, openDialog])
    
    useEffect(() => {
        updateStatsInDB(data.user.email, userStats, "userStats in study")
    }, [userStats])

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

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

        // Set maximum time taken to 60000 (will be editable later)
        setTimeTaken(Math.min(60000, moment.duration(moment().diff(startTime)).asMilliseconds()))
        setStartTime(moment())
        setShowAnswer(true)
    }

    const undoKanji = () => {
        addToDeckCount(-1)
        deck[lastKanji.index] = lastKanji.kanji
        setKanjiIndex(lastKanji.index)
    }

    const buryKanji = () => {
        setLastKanji({
            kanji: JSON.parse(JSON.stringify(deck[kanjiIndex])),
            index: kanjiIndex
        })

        setShowAnswer(false)

        const newDate = addToDate(moment(), "1d") // Add one day to card
        deck[kanjiIndex].due = newDate
        
        addToDeckCount(1)
        setDueKanji(sortByDueDate(deck, dueKanji, false, userSettings.timeReset))

        handleCloseDialog()
    }

    const addToDeckCount = (num) => {
        // If a new card
        if(!lastKanji.kanji.learning && !lastKanji.kanji.graduated) deck[1].newCardCount += num;
        // If a review card
        else if(lastKanji.kanji.learning) deck[1].reviewCount += num;
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

    const CardDialog = () => {
        return (
            <ThemeProvider theme={theme}>
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Kanji Options</DialogTitle>
                    <DialogContent>
                        {deck[kanjiIndex] && 
                        <div className={styles.optionsScreen}>
                            <div className={styles.editCardScreenButtons}>
                                <button className={styles.quitButton} onClick={() => undoKanji()} disabled={!lastKanji.kanji || deck[kanjiIndex].kanji === lastKanji.kanji.kanji}>Undo Last Card</button>
                                <button className={styles.quitButton} onClick={() => buryKanji()}>Bury Card</button>
                            </div>
                            <div className={styles.editCardScreen}>
                                <EditCardScreen
                                    kanji={deck[kanjiIndex]} 
                                    startLearnStep={deck[1].learningSteps[0]}
                                    setOpenEditCardScreen={setOpenDialog}
                                    email={data.user.email} 
                                    allDecks={allDecks}
                                />
                            </div>
                        </div>}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </ThemeProvider>
        )
    }

    return (
        <div className={styles.main}>
            <div className={styles.quitDiv}>
                <button className={styles.quitButton} onClick={(e) => {
                    handleOpenDialog();
                }}>Options</button>
                <button className={styles.quitButton} onClick={() => endStudy()}>Quit</button>
            </div>
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
                    setLastKanji={setLastKanji}
                    timeTaken={timeTaken}
                /> : 
                (<div className={styles.showAnswerDiv}>
                    <button onClick={() => answerTrue()}>Show Answer</button>
                </div>)
            }
            <CardDialog/>
        </div>
    )
}