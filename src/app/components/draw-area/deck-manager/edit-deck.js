import styles from './css/edit-deck.module.css'
import DeckInfoDialog from './deck-info'
import { updateDecksInDB, validInterval } from "@/app/util/interval"
import { useEffect, useState } from "react"
import { defaultDeckSettings } from '@/app/util/kanji-utils'

export default function EditDeckScreen( { toggleScreen, deck, allDecks, email } ){

    const originals = [deck[0], deck[1].learningSteps.toString(), deck[1].graduatingInterval, deck[1].easyInterval, deck[1].ease, deck[1].easy, deck[1].maxNewCards, deck[1].maxReviews, deck[1].sequential]
    const inputs = [deck[0], deck[1].learningSteps.toString(), deck[1].graduatingInterval, deck[1].easyInterval, deck[1].ease, deck[1].easy, deck[1].maxNewCards, deck[1].maxReviews, deck[1].sequential]
    const elements = []

    const [openDialog, setOpenDialog] = useState(false);
    const [infoIndex, setInfoIndex] = useState(0);
    const [allValidated, setAllValidated] = useState(true);

    useEffect(() => {
        pushInputElements()
    }, [])

    const pushInputElements = () => {
        elements.length = 0
        elements.push(
            document.getElementById("deckNameInput"),
            document.getElementById("intervalInput"),
            document.getElementById("gradInput"),
            document.getElementById("easyInput"),
            document.getElementById("easeInput"),
            document.getElementById("easyAddInput"),
            document.getElementById("maxCardsInput"),
            document.getElementById("maxReviewsInput"),
        )
    }

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

    const changeInput = (index, input) => {
        if (elements.length < 1){
            pushInputElements()
        }

        if(validateInput(index, input)){
            inputs[index] = input
        }
        
    }

    const validateInput = (index, input) => {
        if(index >= 1 && index <= 3 && !validInterval(input)){ //Interval inputs
            elements[index].style.borderColor = "red"
            return false
        } else if ([4, 5].includes(index) && isNaN(input)){ // Decimal inputs
            elements[index].style.borderColor = "red"
            return false
        } else if ([6, 7].includes(index) && !Number.isInteger(Number(input))){ // Integer inputs
            elements[index].style.borderColor = "red"
            return false
        }

        elements[index].style.borderColor = ""
        return true
    }

    const validateAllInputs = () => {
        if(elements.length < 1){
            pushInputElements()
        }
        

        for(let index = 0; index < elements.length; index++){
            const input = elements[index].value
            
            if(!validateInput(index, input)){
                return false
            }
        }

        return true
    }

    const undoInput = (index) => {
        inputs[index] = originals[index]
        elements[index].value = originals[index]
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
        if(validateAllInputs()){
            setAllValidated(true)
            saveInputs()
            updateDecksInDB(email, allDecks, "edit deck saveAndQuit")
            quit()
        } else {
            setAllValidated(false)
        }
    }

    const quit = () => {
        toggleScreen()
    }

    const resetDeckSettings = () => {
        const defaultDeck = defaultDeckSettings()
        inputs[0] = defaultDeck[0]
        inputs[1] = defaultDeck[1].learningSteps.toString()
        inputs[2] = defaultDeck[1].graduatingInterval
        inputs[3] = defaultDeck[1].easyInterval
        inputs[4] = defaultDeck[1].ease
        inputs[5] = defaultDeck[1].easy
        inputs[6] = defaultDeck[1].maxNewCards
        inputs[7] = defaultDeck[1].maxReviews
        inputs[8] = defaultDeck[1].sequential
        for(let i = 0; i < inputs.length - 1; i++){
            elements[i].value = inputs[i]
        }
    }

    return (
        <div className={styles.main}>
            <div className={styles.title}>
                <h2>Deck Settings</h2>
            </div>
            
            <div className={styles.settings}>
                <div className={styles.hintDiv}>
                    <button type="button" className={styles.deckNameButton} onClick={() => resetDeckSettings()}>Reset Deck Settings</button>
                </div>
                <div className={styles.hintDiv}>
                    <p className={styles.hintText}>Deck name</p>
                    <input type="text" id="deckNameInput" className={styles.hintInput} defaultValue={originals[0]} name="deckNameInput" placeholder="Name" onChange={e => changeInput(0, e.target.value)}></input>
                    <button type="button" className={styles.deckNameButton} onClick={() => undoInput(0)}>Undo</button>
                </div>
                <div className={styles.hintDiv}>
                    <p className={styles.hintText}>Card insertion order</p>
                    <div className={styles.titleDiv}>
                        <select name="insertionSelect" id="insertionSelect" defaultValue={(originals[8]) ? "Sequential" : "Random"} onChange={e => changeInput(8, e.target.value)}>
                            <option value="Sequential">Sequential</option>
                            <option value="Random">Random</option>
                        </select>
                        <p onClick={() => handleOpenDialog(7)}>ⓘ</p>
                    </div>
                </div>
                <div className={styles.hintDiv}>
                    <p className={styles.hintText}>New cards/day</p>
                    <div className={styles.titleDiv}>
                        <input type="text" id="maxCardsInput" className={styles.hintInput} defaultValue={originals[6]} name="maxCardsInput" placeholder="Number e.g. 20" onChange={e => changeInput(6, e.target.value)}></input>
                        <button type="button" className={styles.deckNameButton} onClick={() => undoInput(6)}>Undo</button>
                        <p onClick={() => handleOpenDialog(5)}>ⓘ</p>
                    </div>
                </div>
                <div className={styles.hintDiv}>
                    <p className={styles.hintText}>Max reviews/day</p>
                    <div className={styles.titleDiv}>
                        <input type="text" id="maxReviewsInput" className={styles.hintInput} defaultValue={originals[7]} name="maxReviewsInput" placeholder="Number e.g. 200" onChange={e => changeInput(7, e.target.value)}></input>
                        <button type="button" className={styles.deckNameButton} onClick={() => undoInput(7)}>Undo</button>
                        <p onClick={() => handleOpenDialog(6)}>ⓘ</p>
                    </div>
                </div>
                <div className={styles.hintDiv}>
                    <p className={styles.hintText}>Learning interval</p>
                    <div className={styles.titleDiv}>
                        <input type="text" id="intervalInput" className={styles.hintInput} defaultValue={originals[1]} name="intervalInput" placeholder="e.g. 1m,10m,1d,3d" onChange={e => changeInput(1, e.target.value)}></input>
                        <button type="button" className={styles.deckNameButton} onClick={() => undoInput(1)}>Undo</button>
                        <p onClick={() => handleOpenDialog(0)}>ⓘ</p>
                    </div>
                </div>
                <div className={styles.hintDiv}>
                    <p className={styles.hintText}>Graduating interval</p>
                    <div className={styles.titleDiv}>
                        <input type="text" id="gradInput" className={styles.hintInput} defaultValue={originals[2]} name="gradInput" placeholder="e.g. 4d" onChange={e => changeInput(2, e.target.value)}></input>
                        <button type="button" className={styles.deckNameButton} onClick={() => undoInput(2)}>Undo</button>
                        <p onClick={() => handleOpenDialog(1)}>ⓘ</p>
                    </div>
                </div>
                <div className={styles.hintDiv}>
                    <p className={styles.hintText}>Easy interval</p>
                    <div className={styles.titleDiv}>
                        <input type="text" id="easyInput" className={styles.hintInput} defaultValue={originals[3]} name="easyInput" placeholder="e.g. 7d" onChange={e => changeInput(3, e.target.value)}></input>
                        <button type="button" className={styles.deckNameButton} onClick={() => undoInput(3)}>Undo</button>
                        <p onClick={() => handleOpenDialog(2)}>ⓘ</p>
                    </div>
                </div>
                <div className={styles.hintDiv}>
                    <p className={styles.hintText}>Ease</p>
                    <div className={styles.titleDiv}>
                        <input type="text" id="easeInput" className={styles.hintInput} defaultValue={originals[4]} name="easeInput" placeholder="Number e.g. 2" onChange={e => changeInput(4, e.target.value)}></input>
                        <button type="button" className={styles.deckNameButton} onClick={() => undoInput(4)}>Undo</button>
                        <p onClick={() => handleOpenDialog(3)}>ⓘ</p>
                    </div>
                </div>
                <div className={styles.hintDiv}>
                    <p className={styles.hintText}>Easy factor</p>
                    <div className={styles.titleDiv}>
                        <input type="text" id="easyAddInput" className={styles.hintInput} defaultValue={originals[5]} name="easyAddInput" placeholder="Number e.g. 0.5" onChange={e => changeInput(5, e.target.value)}></input>
                        <button type="button" className={styles.deckNameButton} onClick={() => undoInput(5)}>Undo</button>
                        <p onClick={() => handleOpenDialog(4)}>ⓘ</p>
                    </div>
                </div>
            </div>
            
            <div className={styles.importantButtons}>
                <button className={styles.importantButtonsButton} onClick={() => quit()}>Cancel</button>
                <div className={styles.saveChanges}>
                    <button className={styles.importantButtonsButton} onClick={() => saveAndQuit()}>Save Changes</button>
                    {!allValidated && <span className={styles.saveChangesTooltip}>Please fix all errors in the settings above before saving</span>}
                </div>
            </div>
            <DeckInfoDialog open={openDialog} onClose={handleCloseDialog} section={infoIndex} />
        </div>
    )
}