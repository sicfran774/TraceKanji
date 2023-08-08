'use client'

import styles from './css/deck-manager.module.css'
import { useState, useContext, useEffect } from "react";
import { SharedKanjiProvider } from './shared-kanji-provider';

export default function DeckManager({decks, setDecks, email}){

    const [deckName, setDeckName] = useState() //Text input when creating new deck
    const [editingDeckIndex, setEditingDeckIndex] = useState() //Index is saved on what deck is being edited

    //editingDeck is a bool when program in "edit mode", selectedKanji is what's shown in kanji info box below
    let { editingDeck, setEditingDeck, selectedKanji, setSelectedKanji } = useContext(SharedKanjiProvider)

    useEffect(() => {
        const saveData = async () => {
            await updateDecksInDB()
        }

        saveData().catch(console.error)
    }, [decks])

    const createDeck = () => {
        if(deckName){
            var newDecks = [...decks, [deckName]]
            setDecks(newDecks)
            setDeckName(null)
            document.getElementById('deckName').value = "";
        }
    }

    const removeFromDeck = (index) => {
        const arr = decks.slice(0, index).concat(decks.slice(index + 1))
        setDecks(arr)
    }

    const toggleEditingDeck = (index) => {
        if(!editingDeck){
            setEditingDeckIndex(index)
            if(decks[index].length > 1){
                setSelectedKanji(decks[index].slice(1, decks[index].length))
            }
            setEditingDeck(true)
        } else {
            setEditingDeck(false)
            //Find the deck we were editing in the decks array, then overwrite it with selectedKanji
            const arr = decks.map((item, index) => {
                if(index === editingDeckIndex){
                    let temp = [item[0]]
                    return temp.concat(selectedKanji)
                } else {
                    return item
                }
            })
            console.log(arr)
            setDecks(arr)
            setSelectedKanji([])
        }
    }

    const updateDecksInDB = async () => {
        try{
            console.log(decks)
            const result = await fetch(`api/mongodb/${email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    updatedDecks: decks
                })
            })
            console.log(result)
        } catch (e){
            console.error(e)
        }
    }

    return (
        <div className={styles.main}>
            <h2>Manage Decks</h2>
            <div className={styles.interchangable}>
                {!editingDeck && (<div className={styles.createDeck}>
                    <input type="text" id="deckName" name="deckName" placeholder="Type deck name here" onChange={e => setDeckName(e.target.value)}></input>
                    <button type="button" className='button' onClick={() => createDeck()}>Create New Deck</button>
                </div>)}
                {editingDeck && (<div className={styles.editingDeck}>
                    <p>Editing deck: {decks[editingDeckIndex][0]}</p>
                    <p className={styles.tooltip}>Select Kanji from the right to add/remove it from the deck. Click "Save Deck" when done</p>
                    <button type="button" onClick={() => toggleEditingDeck()}>Save Deck</button>
                    <div className={styles.selectedKanji}>
                        {selectedKanji}
                    </div>
                </div>)}
                {!editingDeck && (<div className={styles.deckList}>
                    <ul>
                        {decks.map((deck, index) => (
                            <li key={index}>
                                {deck[0]}
                                <div className={styles.editDeck}>
                                    <button type="button" className='button' onClick={() => toggleEditingDeck(index)}>Edit Deck</button>
                                    <button type="button" className='button' onClick={() => removeFromDeck(index)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>)}
            </div>
        </div>
    )
}