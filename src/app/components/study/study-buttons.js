import styles from './css/study-buttons.module.css'
import { useContext, useEffect } from 'react'
import { SharedKanjiProvider } from '../shared-kanji-provider';
import { addToDate, multiplyInterval, sortByDueDate, resetCard } from '@/app/util/interval';
import moment from "moment"

export default function StudyButtons({ deck, setShowAnswer, kanjiIndex, endStudy, setDueKanji}){
    // Deck --> [title, settings, {kanji: ~, meanings: ~, interval: ~}]

    let { setSharedKanji, sharedKanji } = useContext(SharedKanjiProvider)
    const deckSettings = deck[1]
    const learningSteps = [...deckSettings.learningSteps]

    let goodLabel = "", easyLabel = ""

    //console.log(deck[kanjiIndex].learningIndex + " length: " + learningSteps.length)
    if(!deck[kanjiIndex].graduated){
        if(deck[kanjiIndex].learningIndex >= learningSteps.length - 1){
            goodLabel = deckSettings.graduatingInterval
        } else {
            goodLabel = learningSteps[deck[kanjiIndex].learningIndex + 1]
        }
        easyLabel = deckSettings.easyInterval
    } else {
        goodLabel = multiplyInterval(deck[kanjiIndex].interval, (Number(deckSettings.ease)))
        easyLabel = multiplyInterval(deck[kanjiIndex].interval, (Number(deckSettings.ease) + Number(deckSettings.easy)))
    }

    const nextKanji = (choice) => {

        setShowAnswer(false)

        // console.log("learningSteps:" + learningSteps)
        let newInterval = deck[kanjiIndex].interval // This is what we add to the date

        // New card to learning (I did this for "New Card" tracking)
        if(!deck[kanjiIndex].graduated && !deck[kanjiIndex].learning) deck[kanjiIndex].learning = true
        if(deck[kanjiIndex].learning){
            // Clamp to at least 0 (if said "Again" on first step, don't go to a "negative" step)
            const learningIndex = Math.max(0, choice + deck[kanjiIndex].learningIndex)
            
            // console.log("learningIndex: " + learningIndex)
            if(choice < 0){
                newInterval = learningSteps[0]
                deck[kanjiIndex].learningIndex = 0
            } else if(choice < 2 && learningIndex < learningSteps.length){ // If still within step length
                newInterval = learningSteps[learningIndex]
                deck[kanjiIndex].learningIndex = learningIndex
            } else {
                console.log("graduated")
                deck[kanjiIndex].learningIndex = learningIndex
                deck[kanjiIndex].learning = false;
                deck[kanjiIndex].graduated = true;
                newInterval = (choice == 1) ? deckSettings.graduatingInterval : deckSettings.easyInterval
            }
        } else if(deck[kanjiIndex].graduated){
            if(choice > 0){ //If user picked "Good" or "Easy"
                let multiplier = Number(deckSettings.ease)
                if(choice == 2){ //If user chose "Easy"
                    multiplier += Number(deckSettings.easy) // Add easy multiplier
                }
                newInterval = multiplyInterval(newInterval, multiplier)
                
            } else if(choice < 0){
                resetCard(deck[kanjiIndex])
                newInterval = deckSettings.learningSteps[0]
            }
        }

        deck[kanjiIndex].interval = newInterval // Update new interval to card info
        deck[kanjiIndex].due = addToDate(moment(), newInterval) // Update new due date

        const updatedDueDeck = sortByDueDate(deck)
        setDueKanji(updatedDueDeck)
        

        if(updatedDueDeck.length === 0){
            endStudy()
        }
        // console.log("Calculated next step:" + newInterval)
        // console.log(deck)
    }

    //console.log(deck)

    return (
        <div className={styles.main}>
            <div className={styles.buttonDiv}>
                <button onClick={() => nextKanji(-1)}>Again</button>
                <p>&lt;{learningSteps[0]}</p>
            </div>
            <div className={styles.buttonDiv}>
                <button onClick={() => nextKanji(0)}>Hard</button>
                <p>{deck[kanjiIndex].interval}</p>
            </div>
            <div className={styles.buttonDiv}>
                <button onClick={() => nextKanji(1)}>Good</button>
                <p>{goodLabel}</p>
            </div>
            <div className={styles.buttonDiv}>
                <button onClick={() => nextKanji(2)}>Easy</button>
                <p>{easyLabel}</p>
            </div>
        </div>
    )
}