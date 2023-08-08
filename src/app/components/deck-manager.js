'use client'

import styles from './css/deck-manager.module.css'
import { useState, useContext, useEffect } from "react";

export default function DeckManager({fetchedDecks}){

    const [deckName, setDeckName] = useState()
    const [decks, setDecks] = useState(fetchedDecks)

    const createDeck = () => {
        if(deckName){
            var newDecks = [...decks, [deckName]]
            setDecks(newDecks)
            document.getElementById('deckName').value = "";
        }
    }

    const removeFromDeck = (index) => {
        const arr = decks.slice(0, index).concat(decks.slice(index + 1))
        setDecks(arr)
    }

    return (
        <div className={styles.main}>
            <h2>Manage Decks</h2>
            <div className={styles.createDeck}>
                <input type="text" id="deckName" name="deckName" placeholder="Type deck name here" onChange={e => setDeckName(e.target.value)}></input>
                <button type="button" className='button' onClick={() => createDeck()}>Create New Deck</button>
            </div>
            <div className={styles.deckList}>
                <ul>
                    {decks.map((deck, index) => (
                        <li key={index}>
                            {deck[0]}
                            <div className={styles.editDeck}>
                                <button type="button" className='button' >Rename</button>
                                <button type="button" className='button' onClick={() => removeFromDeck(index)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}