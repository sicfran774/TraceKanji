'use client';

import styles from './css/kanji-info.module.css';
import SVG from 'react-inlinesvg'
import { useState, useContext, useEffect, useRef } from "react";
import { useSession } from 'next-auth/react';
import { SharedKanjiProvider } from '../shared-kanji-provider';
import DrawArea from './draw-area';
import DeckManager from './deck-manager/deck-manager';
import Snackbar from '@mui/material/Snackbar';

export default function KanjiInfo({decks, setDecks, setSelectedDeck, deckSelector, recognizeKanji, setRecognizeKanji, setRecKanjiList, studying, setStudying, deckIndex, setDeckIndex, showOverlay, setShowOverlay}){
    const { sharedKanji, setEditingDeck, setSelectedKanji } = useContext(SharedKanjiProvider)
    const [openDeckManager, setOpenDeckManager] = useState(false)
    
    const [deckManagerMsg, setDeckManagerMsg] = useState("Start Studying")
    const [recKanjiMsg, setRecKanjiMsg] = useState("Kanji Recognition Disabled")

    const [userEmail, setUserEmail] = useState("")

    const [open, setOpen] = useState(false)
    const [recognizeSnack, setRecognizeSnack] = useState(false)
    const {data, status} = useSession()

    useEffect(() => {
        document.getElementById("toggleRecognize").className = ""
    }, [])

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
                const decks = (await fetch(`api/mongodb/${data.user.email}`).then(result => result.json())).decks
                //if(!decks) decks = [] (This line ERASES DATA. BAD BAD!)
                if(decks){
                    setDecks(decks)
                } else {
                    throw new Error("Failed to load decks for user, trying again")
                }
                setUserEmail(data.user.email)
            } catch (e){
                console.error(e)
                await fetchDecks()
            }
        } else if (status === 'loading'){
            console.log("Loading decks...")
        } else {
            console.log("Sign in to create your own kanji decks!")
        }
    }

    const toggleDeckManager = () => {
        if(openDeckManager){
            closeDeckManager()
        } else {
            openDeckManagerFunc()
        }
    }

    const closeDeckManager = () => {
        setOpenDeckManager(false)
        setEditingDeck(false)
        setSelectedKanji([])
        setDeckManagerMsg("Start Studying")
    }

    const openDeckManagerFunc = () => {
        setOpenDeckManager(true)
        setDeckManagerMsg("Close Deck Manager")
    }

    const toggleRecognizeKanji = () => {
        if(recognizeKanji){
            disableRecognizeKanji()
            document.getElementById("toggleRecognize").className = ""
        } else {
            enableRecognizeKanji() 
            if (window.matchMedia && !window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.getElementById("toggleRecognize").className = styles.recognitionTextLight
            } else {
                document.getElementById("toggleRecognize").className = styles.recognitionText
            }
            
        }
    }

    const enableRecognizeKanji = () => {
        setRecognizeKanji(true)
        setRecKanjiMsg("Kanji Recognition Enabled!")
    }

    const disableRecognizeKanji = () => {
        setRecognizeKanji(false)
        setSelectedKanji([])
        setRecKanjiMsg("Kanji Recognition Disabled")
    }

    const copyKanji = () => {
        setOpen(true)
        navigator.clipboard.writeText(sharedKanji.kanji.kanji)
    }

    const handleCloseSnack = (event, reason) => {
        if (reason === "clickaway") {
          return;
        }
        setOpen(false);
    };

    const handleRecognizeSnack = (event, reason) => {
        if (reason === "clickaway") {
          return;
        }
        setRecognizeSnack(false);
    };

    return(
        <div className={styles.main}>
            {!studying && (<div className={styles.deckManager}>
                <div className={styles.deckManagerButtons}>
                    <button className={styles.toggleDeckManagerButton} type="button" id="openDeckManagerButton" onClick={() => toggleDeckManager()}>{deckManagerMsg}</button>
                </div>
                <button type="button" className={styles.toggleRecognizeButton} onClick={() => toggleRecognizeKanji()}><p id="toggleRecognize">{recKanjiMsg}</p></button>
                <Snackbar
                    open={recognizeSnack}
                    autoHideDuration={6000}
                    onClose={handleRecognizeSnack}
                    message="We are currently migrating servers, sorry for the inconvenience!"
                />
            </div>)}
            
            {openDeckManager && <DeckManager decks={decks} setDecks={setDecks} email={userEmail} 
                                    deckSelector={deckSelector} setSelectedDeck={setSelectedDeck}
                                    studying={studying} setStudying={setStudying}
                                    deckIndex={deckIndex} setDeckIndex={setDeckIndex}
                                    closeDeckManager={closeDeckManager} openDeckManager={openDeckManagerFunc}
                                    disableRecognizeKanji={disableRecognizeKanji}/>}
            {!openDeckManager && <DrawArea 
                                    enableRecognition={recognizeKanji} 
                                    setRecKanjiList={setRecKanjiList} 
                                    studying={studying}
                                    showOverlay={showOverlay}
                                    setShowOverlay={setShowOverlay}
                                    />}
            {!studying && (<div className={styles.kanjiInfo}>
                <div className={styles.kanji}>
                    <SVG src={sharedKanji.svg}/>
                </div>
                <div>
                    <p>Kanji: {sharedKanji.kanji.kanji} {sharedKanji.kanji ? (<button type="button" className='button' onClick={() => copyKanji()}>Copy</button>) : (<></>)}</p>
                    <p>Meanings: {formatList(sharedKanji.kanji.meanings)}</p>
                    <p>Heisig: {sharedKanji.kanji.heisig_en}</p>
                    <p>Kun: {formatList(sharedKanji.kanji.kun_readings)}</p>
                    <p>On: {formatList(sharedKanji.kanji.on_readings)}</p>
                    <p>Grade: {sharedKanji.kanji.grade}</p>
                    <p>JLPT: {sharedKanji.kanji.jlpt}</p>
                    <p><a href={"https://jisho.org/search/" + sharedKanji.kanji.kanji} target="_blank">Jisho</a></p>
                    <p><a href={"https://kai.kanjiapi.dev/#!/" + sharedKanji.kanji.kanji} target="_blank">kanjikai</a></p>
                </div>
            </div>)}
            <Snackbar
                open={open}
                onClose={handleCloseSnack}
                autoHideDuration={1000}
                message={`${sharedKanji.kanji.kanji} copied to clipboard`}
                anchorOrigin={{
                    horizontal: "left",
                    vertical: "bottom",
                }}
            />
        </div>
    )
}