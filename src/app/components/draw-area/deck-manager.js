'use client'

import styles from './css/deck-manager.module.css'
import { useState, useContext, useEffect } from "react";
import { SharedKanjiProvider } from '../shared-kanji-provider';
import { selectedDarkModeColor } from '@/app/util/colors';

export default function DeckManager({decks, setDecks, email, deckSelector, setSelectedDeck, studying, setStudying, deckIndex, setDeckIndex, closeDeckManager, openDeckManager, disableRecognizeKanji}){

    let deckName = "" //Text input when creating new deck
    const [openDeck, setOpenDeck] = useState(false)

    const [confirmDeleteScreen, setConfirmDeleteScreen] = useState(false)
    const [deckManagerTitle, setDeckManagerTitle] = useState("Manage Decks")

    //editingDeck is a bool when program in "edit mode", selectedKanji is what's shown in kanji info box below
    let { editingDeck, setEditingDeck, selectedKanji, setSelectedKanji } = useContext(SharedKanjiProvider)

    useEffect(() => {
        updateDecksInDB()
    }, [decks])

    useEffect(() => {
        studying ? closeDeckManager() : openDeckManager()
    }, [studying])

    const createDeck = () => {
        if(deckName){
            var newDecks = [...decks, [deckName]]
            setDecks(newDecks)
            deckName = ""
            document.getElementById('deckName').value = "";
        }
    }

    const deleteDeck = (index) => {
        // [0, 1, 2, REMOVE, 4, 5]
        setOpenDeck(false)
        setConfirmDeleteScreen(false)
        const arr = decks.slice(0, index).concat(decks.slice(index + 1))
        setDecks(arr)
        setSelectedDeck("default")
        setSelectedKanji([])
        deckSelector.current.value = "default"
    }

    const toggleOpenDeck = (index) => {
        if(!openDeck){
            setOpenDeck(true)
            setDeckIndex(index)
            if(decks[index].length > 1){
                setSelectedKanji(decks[index].slice(1, decks[index].length))
            }
        } else {
            setOpenDeck(false)
            setSelectedKanji([])
        }
    }

    const toggleEditingDeck = () => {
        if(!editingDeck){
            setEditingDeck(true)
        } else {
            setEditingDeck(false)
            //Find the deck we were editing in the decks array, then overwrite it with selectedKanji
            const arr = decks.map((item, index) => {
                if(index === deckIndex){
                    let temp = [item[0]]
                    return temp.concat(selectedKanji)
                } else {
                    return item
                }
            })
            setDecks(arr)
        }
    }

    const toggleConfirmDeleteScreen = () => {
        setConfirmDeleteScreen(!confirmDeleteScreen)
    }

    const updateDecksInDB = async () => {
        try{
            const result = await fetch(`api/mongodb/${email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    updatedDecks: decks
                })
            })
            return result
        } catch (e){
            console.error(e)
        }
    }

    const startStudy = (index) => {
        setStudying(true)
        setDeckManagerTitle(decks[index][0])
        setDeckIndex(index)
        setSelectedDeck(index)
        disableRecognizeKanji()
    }

    // const endStudy = (index) => {
    //     setStudying(false)
    //     setDeckManagerTitle("Manage Decks")
    // }

    const DeckEditor = () => {
        return (
            <table className={styles.editingDeck}>
                <thead>
                    <tr>
                        <td valign='top' height={30}><h2>{decks[deckIndex][0]}</h2></td>
                    </tr>
                </thead>
                <tbody>
                    {editingDeck && (<tr><td valign='top'><EditingKanji/></td></tr>)}
                    {confirmDeleteScreen && (<tr><td valign='top' colSpan="2"><ConfirmDelete/></td></tr>)}
                    {!confirmDeleteScreen && !editingDeck && (<tr>
                        <td align='left' height={20}><button type="button" className={styles.deckButton} onClick={() => toggleEditingDeck()}>Add/Remove Kanji</button></td>
                        {/* <td align='right' height={20}><button type="button" className={styles.deckButton} onClick={() => toggleEditingDeck()}>Rename Deck</button></td> */}
                    </tr>)}
                    <tr>
                        {!confirmDeleteScreen && (<td height={20} colSpan="2" className={styles.selectedKanji}>
                            {!editingDeck ? (<ul className={styles.kanjiInDeckList}>
                                {selectedKanji.map((kanji, index) => (
                                    <li key={index}>
                                        <div className={styles.editDeck}>
                                            {kanji}
                                            <button type="button" className='button' >Edit Kanji</button>      
                                        </div>
                                    </li>
                                ))}
                            </ul>) :
                            <>{selectedKanji}</>
                            }
                        </td>)}
                    </tr>
                    <tr>
                        {!confirmDeleteScreen && !editingDeck && (<>
                            <td valign='bottom' align='left'>
                                <button type="button" className={styles.deckButton} onClick={() => toggleConfirmDeleteScreen()}>Delete Deck</button>
                            </td>
                            <td valign='bottom' align='right'>
                                <button type="button" className={styles.deckButton} onClick={() => toggleOpenDeck()}>Save Deck</button>
                            </td>
                            </>
                        )}
                    </tr>
                </tbody>
            </table>
        )
    }

    const EditingKanji = () => {
        return (
            <div>
                <button type="button" className={styles.deckButton} onClick={() => toggleEditingDeck()}>Save Deck</button>
                <h2>Editing Mode</h2>
                <p className={styles.tooltip}>Select Kanji from the list to add/remove it from the deck. </p>
                <p className={styles.tooltip}>They will be <span style={{color: `${selectedDarkModeColor}`}}>highlighted</span> if they are found in the deck. </p>
                <p className={styles.tooltip}>Click &quot;Save Deck&quot; when done</p>
            </div>
        )
    }

    const ConfirmDelete = () => {
        return (
            <div>
                <p>Are you sure you want to delete &quot;{decks[deckIndex][0]}&quot;?</p>
                <div className={styles.deleteButtons}>
                    <button type="button" className={styles.deckButton} onClick={() => toggleConfirmDeleteScreen()}>Cancel</button>
                    <button type="button" className={styles.deckButton} onClick={() => deleteDeck(deckIndex)}>Delete Deck</button>
                </div>                
            </div>
        )
    }

    const DeckScreen = () => {
        return (
            <>
            {!openDeck && (<div className={styles.createDeck}>
                <input type="text" id="deckName" name="deckName" placeholder="Type deck name here" onChange={e => deckName = e.target.value}></input>
                <button type="button" className='button' onClick={() => createDeck()}>Create New Deck</button>
            </div>)}
            {openDeck && <DeckEditor/>}
            {!openDeck && (<div className={styles.deckList}>
                <ul>
                    {decks.map((deck, index) => (
                        <li key={index}>
                            {deck[0]}
                            <div className={styles.editDeck}>
                                <div className={styles.deckNumbers}>
                                    <span style={{color: "lightblue"}}>{deck.length - 1}</span>
                                    <span style={{color: "red"}}>0</span>
                                    <span style={{color: "green"}}>0</span>
                                </div>
                                <button type="button" className='button' onClick={() => startStudy(index)}>Start Study</button>
                                <button type="button" className='button' onClick={() => toggleOpenDeck(index)}>Edit Deck</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>)}
            </>
        )
    }

    return (
        <div className={styles.main}>
            <h2>{deckManagerTitle}</h2>
            <div className={styles.interchangable}>
                <DeckScreen/>
            </div>
        </div>
    )
}