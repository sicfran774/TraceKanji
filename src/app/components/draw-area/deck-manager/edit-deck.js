import styles from './css/edit-deck.module.css'
import DeckInfoDialog from './deck-info'
import { updateDecksInDB } from "@/app/util/interval"
import { useState } from "react"

export default function EditDeckScreen( { toggleScreen, deck, allDecks, email } ){

    const originals = [deck[0], deck[1].learningSteps.toString(), deck[1].graduatingInterval, deck[1].easyInterval, deck[1].ease, deck[1].easy, deck[1].maxNewCards, deck[1].maxReviews, deck[1].sequential]
    const inputs = [deck[0], deck[1].learningSteps.toString(), deck[1].graduatingInterval, deck[1].easyInterval, deck[1].ease, deck[1].easy, deck[1].maxNewCards, deck[1].maxReviews, deck[1].sequential]

    const [openDialog, setOpenDialog] = useState(false);
    const [infoIndex, setInfoIndex] = useState(0);

    const handleOpenDialog = (index) => {
        setInfoIndex(index)
        setOpenDialog(true);
    };
    
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const processDeckInterval = (str) => {
        return str.split(",")
    }

    const undoInput = (index, element) => {
        inputs[index] = originals[index]
        element.value = originals[index]
    }

    const saveInputs = () => {
        deck[0] = inputs[0]
        deck[1].learningSteps = processDeckInterval(inputs[1])
        deck[1].graduatingInterval = inputs[2]
        deck[1].easyInterval = inputs[3]
        deck[1].ease = inputs[4]
        deck[1].easy = inputs[5]
        deck[1].maxNewCards = Number(inputs[6])
        deck[1].maxReviews = Number(inputs[7])
        deck[1].sequential = inputs[8]
    }

    const saveAndQuit = () => {
        saveInputs()
        updateDecksInDB(email, allDecks, "edit deck saveAndQuit")
        toggleScreen()
    }

    return (
        <div className={styles.main}>
            <div className={styles.title}>
                <h2>Deck Settings</h2>
            </div>
            
            <div className={styles.settings}>
                <div className={styles.hintDiv}>
                    <p className={styles.hintText}>Deck name</p>
                    <input type="text" id="deckNameInput" className={styles.hintInput} defaultValue={originals[0]} name="deckNameInput" placeholder="Name" onChange={e => inputs[0] = e.target.value}></input>
                    <button type="button" className={styles.deckNameButton} onClick={() => undoInput(0, document.getElementById("deckNameInput"))}>Undo</button>
                </div>
                <div className={styles.hintDiv}>
                    <p className={styles.hintText}>Card insertion order</p>
                    <div className={styles.titleDiv}>
                        <select name="insertionSelect" id="insertionSelect" defaultValue={(originals[8]) ? "Sequential" : "Random"} onChange={e => inputs[8] = (e.target.value === "Sequential")}>
                            <option value="Sequential">Sequential</option>
                            <option value="Random">Random</option>
                        </select>
                        <p onClick={() => handleOpenDialog(7)}>ⓘ</p>
                    </div>
                </div>
                <div className={styles.hintDiv}>
                    <p className={styles.hintText}>New cards/day</p>
                    <div className={styles.titleDiv}>
                        <input type="text" id="maxCardsInput" className={styles.hintInput} defaultValue={originals[6]} name="maxCardsInput" placeholder="Cards" onChange={e => inputs[6] = e.target.value}></input>
                        <button type="button" className={styles.deckNameButton} onClick={() => undoInput(6, document.getElementById("maxCardsInput"))}>Undo</button>
                        <p onClick={() => handleOpenDialog(5)}>ⓘ</p>
                    </div>
                </div>
                <div className={styles.hintDiv}>
                    <p className={styles.hintText}>Max reviews/day</p>
                    <div className={styles.titleDiv}>
                        <input type="text" id="maxReviewsInput" className={styles.hintInput} defaultValue={originals[7]} name="maxReviewsInput" placeholder="Cards" onChange={e => inputs[7] = e.target.value}></input>
                        <button type="button" className={styles.deckNameButton} onClick={() => undoInput(7, document.getElementById("maxReviewsInput"))}>Undo</button>
                        <p onClick={() => handleOpenDialog(6)}>ⓘ</p>
                    </div>
                </div>
                <div className={styles.hintDiv}>
                    <p className={styles.hintText}>Learning interval</p>
                    <div className={styles.titleDiv}>
                        <input type="text" id="intervalInput" className={styles.hintInput} defaultValue={originals[1]} name="intervalInput" placeholder="Interval" onChange={e => inputs[1] = e.target.value}></input>
                        <button type="button" className={styles.deckNameButton} onClick={() => undoInput(1, document.getElementById("intervalInput"))}>Undo</button>
                        <p onClick={() => handleOpenDialog(0)}>ⓘ</p>
                    </div>
                </div>
                <div className={styles.hintDiv}>
                    <p className={styles.hintText}>Graduating interval</p>
                    <div className={styles.titleDiv}>
                        <input type="text" id="gradInput" className={styles.hintInput} defaultValue={originals[2]} name="gradInput" placeholder="Graduating interval" onChange={e => inputs[2] = e.target.value}></input>
                        <button type="button" className={styles.deckNameButton} onClick={() => undoInput(2, document.getElementById("gradInput"))}>Undo</button>
                        <p onClick={() => handleOpenDialog(1)}>ⓘ</p>
                    </div>
                </div>
                <div className={styles.hintDiv}>
                    <p className={styles.hintText}>Easy interval</p>
                    <div className={styles.titleDiv}>
                        <input type="text" id="easyInput" className={styles.hintInput} defaultValue={originals[3]} name="easyInput" placeholder="Easy interval" onChange={e => inputs[3] = e.target.value}></input>
                        <button type="button" className={styles.deckNameButton} onClick={() => undoInput(3, document.getElementById("easyInput"))}>Undo</button>
                        <p onClick={() => handleOpenDialog(2)}>ⓘ</p>
                    </div>
                </div>
                <div className={styles.hintDiv}>
                    <p className={styles.hintText}>Ease</p>
                    <div className={styles.titleDiv}>
                        <input type="text" id="easeInput" className={styles.hintInput} defaultValue={originals[4]} name="easeInput" placeholder="Ease" onChange={e => inputs[4] = e.target.value}></input>
                        <button type="button" className={styles.deckNameButton} onClick={() => undoInput(4, document.getElementById("easeInput"))}>Undo</button>
                        <p onClick={() => handleOpenDialog(3)}>ⓘ</p>
                    </div>
                </div>
                <div className={styles.hintDiv}>
                    <p className={styles.hintText}>Easy factor</p>
                    <div className={styles.titleDiv}>
                        <input type="text" id="easyAddInput" className={styles.hintInput} defaultValue={originals[5]} name="easyAddInput" placeholder="Easy contributor" onChange={e => inputs[5] = e.target.value}></input>
                        <button type="button" className={styles.deckNameButton} onClick={() => undoInput(5, document.getElementById("easyAddInput"))}>Undo</button>
                        <p onClick={() => handleOpenDialog(4)}>ⓘ</p>
                    </div>
                </div>
            </div>
            
            <div className={styles.importantButtons}>
                <button className={styles.importantButtonsButton} onClick={() => saveAndQuit()}>Save Changes</button>
            </div>
            <DeckInfoDialog open={openDialog} onClose={handleCloseDialog} section={infoIndex} />
        </div>
    )
}