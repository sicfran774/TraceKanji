'use client';

import styles from './css/kanji-info.module.css';
import SVG from 'react-inlinesvg'
import { useState, useContext, useEffect, useRef } from "react";
import { useSession } from 'next-auth/react';
import { SharedKanjiProvider } from './shared-kanji-provider';
import DrawArea from './draw-area';
import DeckManager from './deck-manager';

export default function KanjiInfo({decks, setDecks, setSelectedDeck, recognizeKanji, setRecognizeKanji, setRecKanjiList}){
    const { sharedKanji, setEditingDeck, setSelectedKanji } = useContext(SharedKanjiProvider)
    const [openDeckManager, setOpenDeckManager] = useState(false)
    
    const [deckManagerMsg, setDeckManagerMsg] = useState("Open Deck Manager")
    const [recKanjiMsg, setRecKanjiMsg] = useState("Enable Kanji Recognition")
    const {data, status} = useSession()
    const deckSelector = useRef()

    useEffect(() => {
        const fetchData = async () => {
            await fetchDecks()
        }

        fetchData().catch(console.error)
    }, [status])

    useEffect(() => {
        closeDeckManager()
    }, [recognizeKanji])

    const formatList = (arr) => {
        let str = ""
        for(let i in arr){
          if(i < arr.length - 1){
              str += arr[i] + ", "
          } else{
              str += arr[i]
          }
        }
        return str
    }

    const fetchDecks = async () => {
        if(status === 'authenticated'){
            try{
                let decks = (await fetch(`api/mongodb/${data.user.email}`).then(result => result.json())).decks
                if(!decks) decks = []
                console.log(decks)
                setDecks(decks)
            } catch (e){
                console.error(e)
            }
        } else {
            console.log("Not logged in")
        }
    }

    const changeDeck = (e) => {
        setSelectedDeck(e.target.value)
    }

    const toggleDeckManager = () => {
        if(openDeckManager){
            closeDeckManager()
        } else {
            setOpenDeckManager(true)
            setDeckManagerMsg("Close Deck Manager")
        }
    }

    const closeDeckManager = () => {
        setOpenDeckManager(false)
        setEditingDeck(false)
        setSelectedKanji([])
        setDeckManagerMsg("Open Deck Manager")
    }

    const toggleRecognizeKanji = () => {
        if(recognizeKanji){
            setRecognizeKanji(false)
            setSelectedKanji([])
            setRecKanjiMsg("Enable Kanji Recognition")
        } else {
            setRecognizeKanji(true)
            setRecKanjiMsg("Disable Kanji Recognition")
        }
    }

    return(
        <div className={styles.main}>
            {status === 'authenticated' && (<div className={styles.deckManager}>
                <div className={styles.deckManagerButtons}>
                    <button type="button" className='button' onClick={() => toggleDeckManager()}>{deckManagerMsg}</button>
                    <div className={styles.deckSelector}>
                        <select name="decks" id="decks" ref={deckSelector} onChange={e => changeDeck(e)}>
                            <option value="default">All Kanji</option>
                            {decks.map((deck, index) => (
                                <option key={index} value={index}>{deck[0]}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <button type="button" className='button' onClick={() => toggleRecognizeKanji()}>{recKanjiMsg}</button>
            </div>)}
            {status !== 'authenticated' && (<div className={styles.notSignedIn}>
                <span>Sign in to create your own Kanji decks!</span>
                <button type="button" className='button' onClick={() => toggleRecognizeKanji()}>{recKanjiMsg}</button>
            </div>)}
            {openDeckManager && <DeckManager decks={decks} setDecks={setDecks} email={data.user.email} deckSelector={deckSelector} setSelectedDeck={setSelectedDeck}/>}
            {!openDeckManager && <DrawArea enableRecognition={recognizeKanji} setRecKanjiList={setRecKanjiList}/>}
            <div className={styles.kanjiInfo}>
                <div className={styles.kanji}>
                    <SVG src={sharedKanji.svg}/>
                </div>
                <div>
                    <p>Kanji: {sharedKanji.kanji.kanji}</p>
                    <p>Meanings: {formatList(sharedKanji.kanji.meanings)}</p>
                    <p>Kunyomi: {formatList(sharedKanji.kanji.kun_readings)}</p>
                    <p>Onyomi: {formatList(sharedKanji.kanji.on_readings)}</p>
                    <p>Grade: {sharedKanji.kanji.grade}</p>
                    <p>JLPT: {sharedKanji.kanji.jlpt}</p>
                    <a href={"https://kai.kanjiapi.dev/#!/" + sharedKanji.kanji.kanji} target="_blank">List of words that use this kanji</a>
                </div>
            </div>
            <div className={styles.myInfo}>
                <p>Created by <a href={"https://github.com/sicfran774"} target="_blank">sicfran</a> 🤓</p>
            </div>
        </div>
    )
}