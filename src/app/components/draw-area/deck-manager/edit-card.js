import { updateDecksInDB } from "@/app/util/interval"
import { useState } from "react"
import moment from "moment"
import styles from "./css/edit-card.module.css"

export default function EditCardScreen({ kanji, startLearnStep, setOpenEditCardScreen, email, allDecks }){

    const [areYouSure, setAreYouSure] = useState(false)
 
    const originalMeaning = kanji.meanings
    let hintInput = kanji.meanings

    const resetCard = () => {
        kanji.graduated = false
        kanji.learning = true
        kanji.learningIndex = 0
        kanji.interval = startLearnStep
        kanji.due = moment()
        setAreYouSure(false)
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
        updateDecksInDB(email, allDecks, "editcard saveAndQuit")
        setOpenEditCardScreen(false)
    }

    const typeOfCard = () => {
        if(kanji.graduated){
            return <span style={{color: "green"}}>Graduated</span>
        } else if(kanji.learning){
            return <span style={{color: "red"}}>Learning</span>
        } else {
            return <span style={{color: "lightblue"}}>New</span>
        }
    }

    return(
        <div className={styles.main}>
            <div className={styles.title}>
                <h2>Kanji Settings</h2>
                <i><h4>Due <span style={{color: "gold"}}>{moment(kanji.due).format("ddd, MMM DD, YYYY")}</span></h4></i>
            </div>
            
            <h1 className={styles.kanjiAndMeaning}>{kanji.kanji}</h1>
            <h3>{kanji.meanings}</h3>
            <div className={styles.settings}>
                <div className={styles.hintDiv}>
                    <p className={styles.hintText}>Hint</p>
                    <input type="text" id="hintInput" className={styles.hintInput} defaultValue={kanji.meanings} name="hintInput" placeholder="Hint" onChange={e => hintInput = e.target.value}></input>
                    <button type="button" className={styles.deckNameButton} onClick={() => resetToDefaultHint()}>Undo</button>
                </div>
                <div className={styles.hintDiv}>
                    <p className={styles.hintText}>Type of card</p>
                    <p>{typeOfCard()}</p>
                </div>
                <div className={styles.hintDiv}>
                    <p className={styles.hintText}>Current interval</p>
                    <p>{kanji.interval}</p>
                </div>
            </div>

            <div className={styles.area}></div>
            
            <div className={styles.importantButtons}>
                {areYouSure && 
                    <div>
                        <p>Reset this card&apos;s interval?</p>
                        <button className={styles.sureButton} onClick={() => setAreYouSure(false)}>Cancel</button>
                        <button className={styles.sureButton} onClick={() => resetCard()}>Yes</button>
                    </div>}
                {!areYouSure && <button className={styles.importantButtonsButton} onClick={() => setAreYouSure(true)}>Reset Interval</button>}
                <button className={styles.importantButtonsButton} onClick={() => saveAndQuit()}>Save Changes</button>
            </div>
            
        </div>
    )
}