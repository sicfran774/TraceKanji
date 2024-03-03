import styles from './css/edit-deck.module.css'

export default function EditDeckScreen( { toggleScreen } ){

    return (
        <div className={styles.main}>
            <div className={styles.title}>
                <h2>Deck Settings</h2>
            </div>
            
            <div className={styles.settings}>
                {/* <div className={styles.hintDiv}>
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
                </div> */}
            </div>
            
            <div className={styles.importantButtons}>
                <button className={styles.importantButtonsButton} onClick={() => toggleScreen()}>Save Changes</button>
            </div>
            
        </div>
    )
}