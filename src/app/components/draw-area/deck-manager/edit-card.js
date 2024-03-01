import { updateDecksInDB } from "@/app/util/interval"
import { useState } from "react"
import moment from "moment"
import styles from "./css/edit-card.module.css"

export default function EditCardScreen({ kanji, startLearnStep, setOpenEditCardScreen, email, allDecks }){

    const originalMeaning = kanji.meanings
    let hintInput = kanji.meanings

    const resetCard = () => {
        kanji.graduated = false
        kanji.learning = true
        kanji.learningIndex = 0
        kanji.interval = startLearnStep
        kanji.due = moment()
    }

    const changeHint = () => {
        kanji.meanings = hintInput
    }

    const resetToDefaultHint = () => {
        hintInput = originalMeaning
        document.getElementById("hintInput").value = hintInput
        changeHint()
    }

    const saveAndQuit = () => {
        changeHint()
        updateDecksInDB(email, allDecks)
        setOpenEditCardScreen(false)
    }

    return(
        <div>
            <h2>Kanji Settings</h2>
            <h1>{kanji.kanji}</h1>
            <div>
                <input type="text" id="hintInput" className={styles.hintInput} defaultValue={kanji.meanings} name="hintInput" placeholder="Hint" onChange={e => hintInput = e.target.value}></input>
                <button type="button" className={styles.deckNameButton} onClick={() => resetToDefaultHint()}>Undo</button>
            </div>
            
            <div>
                <button onClick={() => resetCard()}>Reset Interval</button>
                <button onClick={() => saveAndQuit()}>Save Changes</button>
            </div>
            
        </div>
    )
}