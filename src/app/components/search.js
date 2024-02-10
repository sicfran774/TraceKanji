'use client'

import styles from './css/search.module.css';
import {useState, useEffect} from "react";
import KanjiCard from './kanji-card';
import KanjiInfo from './draw-area/kanji-info';
import { CircularProgress } from '@mui/material';

const KANJIAPI_URL = "https://kanjiapi.dev/v1"
const ITEMS_PER_FETCH = 100;
const ITEMS_PER_PAGE = 24;

let abortController = null

export default function Search({kanjiAndSVG}){

    //fetchedKanji consists of two objects
    // - info: this holds kanji info like kanji itself, meanings, grade, jlpt, readings
    // - svg: contains svg string that shows stroke orders
    const [fetchedKanji, setFetchedKanji] = useState(null)
    const [filteredList, setFilteredList] = useState([]) // If filter is applied, this will take from fetchedKanji
    const [kanjiInfo, setKanjiInfo] = useState([]) // [[Page 1 Kanji], [Page 2 Kanji], [...], ...]

    const [filter, setFilter] = useState("")
    
    const [doneLoading, setDoneLoading] = useState(false)
    const [doneLoadingKanji, setDoneLoadingKanji] = useState(false)

    const [page, setPage] = useState(0);

    const [decks, setDecks] = useState([])
    const [selectedDeck, setSelectedDeck] = useState("default")

    const [recognizeKanji, setRecognizeKanji] = useState(false)
    const [recKanjiList, setRecKanjiList] = useState([])

    useEffect(() => {
        /*  A new AbortController is created everytime a deck is selected.
            If there is already an abort controller, we abort it to cancel
            any existing fetches going on (look below in "fetchDataInBatches()")
        */  
        if(abortController){
            abortController.abort()
        }
        abortController = new AbortController()
        getKanjiBasedOnArray()
    }, [ , selectedDeck, recKanjiList, recognizeKanji])

    useEffect(() => {
        getKanjiBasedOnFilter()
    }, [fetchedKanji, filter])

    useEffect(() => {
        setSelectedDeck("default")
        if(doneLoading && decks.length > 0) document.getElementById("decks").selectedIndex = 0
    }, [recKanjiList])

    useEffect(() => {
        setKanjiPerPage()
        //console.log(filteredList)
    }, [filteredList])

    const getKanjiBasedOnFilter = () => {
        if(!fetchedKanji) return
        setDoneLoading(false)

        const lowercase = filter.toLowerCase()
        //Go through each kanji, look at their meanings and see if it starts with filter
        const sameMeanings = fetchedKanji.filter(kanji => (kanji.info.meanings.some((meaning) => meaning.startsWith(lowercase)) || lowercase === ''))
        //Same for kun readings
        const sameKun = fetchedKanji.filter(kanji => (kanji.info.kun_readings.some((meaning) => meaning.startsWith(lowercase))))
        //Same for on readings
        const sameOn = fetchedKanji.filter(kanji => (kanji.info.on_readings.some((meaning) => meaning.startsWith(lowercase))))
        //Grade
        const sameGrade = fetchedKanji.filter(kanji => (`grade:${kanji.info.grade}` === lowercase))
        //JLPT
        const sameJLPT = fetchedKanji.filter(kanji => (`jlpt:${kanji.info.jlpt}` === lowercase))
        //Kanji
        const sameKanji = fetchedKanji.filter(kanji => (kanji.info.kanji === lowercase))

        if (filter.length == 0){
            setFilteredList(fetchedKanji)
        } else if(sameKanji.length > 0){
            setFilteredList(sameKanji)
        } else if(sameKun.length > 0){
            setFilteredList(sameKun)
        } else if(sameOn.length > 0){
            setFilteredList(sameOn)
        } else if(sameGrade.length > 0){
            setFilteredList(sameGrade)
        } else if(sameJLPT.length > 0){
            setFilteredList(sameJLPT)
        } else{
            setFilteredList(sameMeanings)
        }
    }
    
    const changePage = (delta) => {
        let diff
        if((delta < 0 && page > 0) || (delta > 0 && page < kanjiInfo.length - 1))
            diff = page + delta
        else {
            diff = page
        }
        setPage(diff)
    }

    // Fetches Kanji info from KanjiAPI
    const fetchDataInBatches = async (kanjiAndSVG, originalOrder = []) => {
        let kanjiJson = []
        setDoneLoadingKanji(false)
        for (let i = 0; i < kanjiAndSVG.length; i += ITEMS_PER_FETCH) {
            try{
                /*
                For signal in fetch:
                If another call of this function is made while a current one is running, stop the fetches
                i.e. when the deck is changed, we don't want the default deck to keep loading
                */
                const batchKanjis = kanjiAndSVG.slice(i, i + ITEMS_PER_FETCH);
                const batchPromises = batchKanjis.map(kanji => 
                fetch(`${KANJIAPI_URL}/kanji/${kanji.kanji}`, {signal: abortController.signal}) 
                .then(result => result.json()))
        
                const batchResults = await Promise.all(batchPromises);

                kanjiJson.push(...batchResults);
                
                // Send the accumulated data after each batch
                combineKanjiAPIandSVG(kanjiJson, kanjiAndSVG, originalOrder);
            } catch (err) {
                //We reached here possibly because the signal threw an AbortSignal error, so just return nothing
                return
            }
        }
    
        setDoneLoadingKanji(true)
        combineKanjiAPIandSVG(kanjiJson, kanjiAndSVG, originalOrder);
    }

    //This combines the KanjiAPI info with the SVG from MongoDB
    const combineKanjiAPIandSVG = (kanjiJson, kanjiAndSVG, originalOrder = []) => {
        let arr = []
        for(let i in kanjiJson){
            arr.push({info: kanjiJson[i], svg: kanjiAndSVG[i].svg})
        }
        if(originalOrder.length > 0){
            arr.sort((a, b) => {
                const indexA = originalOrder.indexOf(a.info.kanji)
                const indexB = originalOrder.indexOf(b.info.kanji)

                const defaultIndex = originalOrder.length;

                return indexA === -1 ? defaultIndex : indexA - (indexB === -1 ? defaultIndex : indexB);
            })            
        }
        setFetchedKanji(arr)
    }

    const setKanjiPerPage = () => {
        if(filteredList){
            let arr = []
            for(let i = 0; i < filteredList.length; i += ITEMS_PER_PAGE){
                const chunk = filteredList.slice(i, i + ITEMS_PER_PAGE)
                arr.push(chunk)
            }
            if(page > arr.length - 1) setPage(0)
            setKanjiInfo(arr)
            setDoneLoading(true)
        }
    }

    const getKanjiBasedOnArray = () => {
        if(selectedDeck !== "default"){
            //Get currently selected deck
            const arr = decks[selectedDeck]
            const deck = arr.slice(1, arr.length)
            //Extract the SVG from the original kanjiAndSVG array
            const deckKanjiWithSVG = kanjiAndSVG.filter(item => deck.includes(item.kanji))
            //Send it to be loaded on page
            fetchDataInBatches(deckKanjiWithSVG)
        } else if (recognizeKanji){
            const recognizedKanjiWithSVG = kanjiAndSVG.filter(item => recKanjiList.includes(item.kanji))
            //recognizedKanjiWithSVG.sort((a, b) => recKanjiList.indexOf(a.kanji) - recKanjiList.indexOf(b.kanji))
            fetchDataInBatches(recognizedKanjiWithSVG, recKanjiList)
        } else {
            fetchDataInBatches(kanjiAndSVG)
        }
    }

    return(
        <div className={styles.main}>
            <div className={styles.listAndDrawArea}>
                <KanjiInfo 
                    decks={decks} 
                    setDecks={setDecks} 
                    selectedDeck={selectedDeck} 
                    setSelectedDeck={setSelectedDeck} 
                    recognizeKanji={recognizeKanji} 
                    setRecognizeKanji={setRecognizeKanji}
                    setRecKanjiList={setRecKanjiList}
                />
                <div className={styles.kanjiList}>
                    <div className={styles.searchBox}>
                        <div className={styles.searchText}>
                            <p>Search</p>
                            <input type="text" id="filter" name="filter" onChange={e => setFilter(e.target.value)}
                                placeholder="jlpt:1, grade:4, kana" />
                        </div>
                        <div className={styles.pageButtons}>
                            <button type="button" onClick={() => changePage(-1)} className='button'>Prev</button>
                            <div>Page {page + 1}/{kanjiInfo.length}</div>
                            <button type="button" onClick={() => changePage(1)} className='button'>Next</button>
                            {!doneLoadingKanji && (<div className={styles.loading}>Loading Kanji... <CircularProgress size="15px"/></div>)}
                        </div>
                    </div>
                    {kanjiInfo.length > 0 ? 
                    (<div className={styles.kanjiListGrid}>
                        <ul>
                            {kanjiInfo.length > 0 && kanjiInfo[page].map(item => { 
                                return (
                                    <li key={item.info.kanji}>
                                        <KanjiCard kanji={item.info} svg={item.svg}/>
                                    </li>
                            )})}
                        </ul>
                    </div>) : 
                    (<div className={styles.noKanjiFound}>
                        {recognizeKanji ? 
                            (<>Start drawing to populate this list!</>) : 
                            (decks.length > 0 && !document.getElementById('filter').value ? <>
                                No kanji found! Select &quot;All Kanji&quot; in the deck list and Open Deck Manager to add Kanji to this deck</> : 
                                (doneLoading ? <>No kanji found!</> : <></>))
                        }
                    </div>)}
                    {kanjiInfo.length <= 0 && !doneLoading && (<CircularProgress/>)}
                </div>
            </div>
        </div>
    )
}