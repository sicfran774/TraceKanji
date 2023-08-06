'use client'

import styles from './css/deck-manager.module.css'

export default function DeckManager({decks}){

    return (
        <div className={styles.main}>
            <h2>Manage Decks</h2>
            <div className={styles.deckList}>

            </div>
        </div>
    )
}