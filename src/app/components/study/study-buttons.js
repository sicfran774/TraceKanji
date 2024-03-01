import styles from './css/study-buttons.module.css'
import { useContext, useEffect } from 'react'
import { SharedKanjiProvider } from '../shared-kanji-provider';
import { addToDate, multiplyInterval, sortByDueDate } from '@/app/util/interval';
import moment from "moment"

export default function StudyButtons({ deck, setShowAnswer, kanjiIndex, endStudy, setDueKanji}){
    // Deck --> [title, settings, {kanji: ~, meanings: ~, interval: ~}]

    let { setSharedKanji, sharedKanji } = useContext(SharedKanjiProvider)
    const deckSettings = deck[1]
    const learningSteps = [...deckSettings.learningSteps, deckSettings.graduatingInterval]

    const resetCard = (index) => {
        deck[index].graduated = false
        deck[index].learning = true
        deck[index].learningIndex = 0
    }

    const nextKanji = (choice) => {

        setShowAnswer(false)

        // console.log("learningSteps:" + learningSteps)
        const offsetIndex = kanjiIndex
        let newInterval = deck[offsetIndex].interval // This is what we add to the date

        // New card to learning (I did this for "New Card" tracking)
        if(!deck[offsetIndex].graduated && !deck[offsetIndex].learning) deck[offsetIndex].learning = true
        if(deck[offsetIndex].learning){
            // Clamp to at least 0 (if said "Again" on first step, don't go to a "negative" step)
            const learningIndex = Math.max(0, choice + deck[offsetIndex].learningIndex)
            
            // console.log("learningIndex: " + learningIndex)
            if(choice < 0){
                newInterval = learningSteps[0]
                deck[offsetIndex].learningIndex = 0
            } else if(learningIndex < learningSteps.length){ // If still within step length
                newInterval = learningSteps[learningIndex]
                deck[offsetIndex].learningIndex = learningIndex
            } else { // Graduate the card (which will go into next "if" block below)
                console.log("graduated")
                deck[offsetIndex].learning = false;
                deck[offsetIndex].graduated = true;
                // Go straight to last step
                newInterval = deckSettings.graduatingInterval
            }
        }
        if(deck[offsetIndex].graduated){
            if(choice > 0){ //If user picked "Good" or "Easy"
                let multiplier = deckSettings.ease
                if(choice == 2){ //If user chose "Easy"
                    multiplier += deckSettings.easy // Add easy multiplier
                }
                newInterval = multiplyInterval(newInterval, multiplier)
            } else if(choice < 0){
                resetCard(offsetIndex)
                newInterval = deckSettings.learningSteps[0]
            }
        }

        deck[offsetIndex].interval = newInterval // Update new interval to card info
        deck[offsetIndex].due = addToDate(moment(), newInterval) // Update new due date

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
                <p>{learningSteps[0]}</p>
            </div>
            <div className={styles.buttonDiv}>
                <button onClick={() => nextKanji(0)}>Hard</button>
                <p>{learningSteps[deck[kanjiIndex].learningIndex]}</p>
            </div>
            <div className={styles.buttonDiv}>
                <button onClick={() => nextKanji(1)}>Good</button>
                <p>{learningSteps[deck[kanjiIndex].learningIndex + 1]}</p>
            </div>
            <div className={styles.buttonDiv}>
                <button onClick={() => nextKanji(2)}>Easy</button>
                <p>{learningSteps[deck[kanjiIndex].learningIndex + 2]}</p>
            </div>
        </div>
    )
}