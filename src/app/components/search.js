'use client'

import styles from './css/search.module.css';
import {useState, useEffect} from "react";
import KanjiCard from './kanji-card';
import DrawArea from './draw-area';

const KANJIAPI_URL = "https://kanjiapi.dev/v1"
const ITEMS_PER_FETCH = 24;
const ITEMS_PER_PAGE = 24;

export default function Search({kanjiAndSVG}){
    //kanjiAPI consists of two objects
    // - info: this holds kanji info like meanings, grade, jlpt, readings
    // - svg: contains svg string that shows stroke orders

    const [kanjiAPI, setKanjiAPI] = useState(null)
    const [filter, setFilter] = useState("")
    const [kanjiInfo, setKanjiInfo] = useState([]) //TODO: initialize this to kanjiAPI
    const [doneLoading, setDoneLoading] = useState(false)
    const [page, setPage] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            await fetchDataInBatches()
        }

        fetchData().catch(console.error)
    }, [])

    useEffect(() => {
        getKanjiBasedOnFilter()
        setKanjiPerPage()
    }, [kanjiAPI])

    useEffect(() => {
        getKanjiBasedOnFilter()
    }, [filter])

    let kanjiList = kanjiInfo;

    const getKanjiBasedOnFilter = () => {
        if(!kanjiAPI) return
        setDoneLoading(false)

        const lowercase = filter.toLowerCase()
        //Go through each kanji, look at their meanings and see if it starts with filter
        const sameMeanings = kanjiAPI.filter(kanji => (kanji.info.meanings.some((meaning) => meaning.startsWith(lowercase)) || lowercase === ''))
        //Same for kun readings
        const sameKun = kanjiAPI.filter(kanji => (kanji.info.kun_readings.some((meaning) => meaning.startsWith(lowercase))))
        //Same for on readings
        const sameOn = kanjiAPI.filter(kanji => (kanji.info.on_readings.some((meaning) => meaning.startsWith(lowercase))))
        //Grade
        const sameGrade = kanjiAPI.filter(kanji => (`grade:${kanji.info.grade}` === lowercase))
        //JLPT
        const sameJLPT = kanjiAPI.filter(kanji => (`jlpt:${kanji.info.jlpt}` === lowercase))
        //Kanji
        const sameKanji = kanjiAPI.filter(kanji => (kanji.info.kanji === lowercase))

        if(sameKanji.length > 0){
            kanjiList = sameKanji
        } else if(sameKun.length > 0){
            kanjiList = sameKun
        } else if(sameOn.length > 0){
            kanjiList = sameOn
        } else if(sameGrade.length > 0){
            kanjiList = sameGrade
        } else if(sameJLPT.length > 0){
            kanjiList = sameJLPT
        } else{
            kanjiList = sameMeanings
        }

        setKanjiPerPage()
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

    const fetchDataInBatches = async () => {
        let kanjiJson = []
        
        for (let i = 0; i < kanjiAndSVG.length; i += ITEMS_PER_FETCH) {
            const batchKanjis = kanjiAndSVG.slice(i, i + ITEMS_PER_FETCH);
            const batchPromises = batchKanjis.map(kanji => 
                fetch(`${KANJIAPI_URL}/kanji/${kanji.kanji}`)
                .then(result => result.json()))
        
            const batchResults = await Promise.all(batchPromises);
            kanjiJson.push(...batchResults);
            
            // Send the accumulated data after each batch
            formatKanjiAPI(kanjiJson, kanjiAndSVG);
        }
    
        formatKanjiAPI(kanjiJson, kanjiAndSVG);
    }

    //This combines the KanjiAPI info with the SVG from MongoDB
    const formatKanjiAPI = (kanjiJson, kanjiAndSVG) => {
        let arr = []
        for(let i in kanjiJson){
            arr.push({info: kanjiJson[i], svg: kanjiAndSVG[i].svg})
        }
        kanjiList = arr;
        setKanjiAPI(arr)
    }

    const setKanjiPerPage = () => {
        let arr = []
        for(let i = 0; i < kanjiList.length; i += ITEMS_PER_PAGE){
            const chunk = kanjiList.slice(i, i + ITEMS_PER_PAGE)
            arr.push(chunk)
        }
        if(page > arr.length - 1) setPage(0)
        setKanjiInfo(arr)
        setDoneLoading(true)
    }

    return(
        <div className={styles.main}>
            <div className={styles.listAndDrawArea}>
                <DrawArea />
                <div className={styles.kanjiList}>
                    <div className={styles.searchBox}>
                        <div className={styles.searchText}>Search</div>
                        <input type="text" id="filter" name="filter" onChange={e => setFilter(e.target.value)}></input>
                        <div className={styles.deckSelector}>
                            <select name="decks" id="decks">
                                <option value="default">All Kanji</option>
                            </select>
                        </div>
                        <div className={styles.pageButtons}>
                            <button type="button" onClick={() => changePage(-1)} className='button'>Prev</button>
                            <div>Page {page + 1}/{kanjiInfo.length}</div>
                            <button type="button" onClick={() => changePage(1)} className='button'>Next</button>
                        </div>
                    </div>
                    <ul>
                        {doneLoading && kanjiInfo.length > 0 && kanjiInfo[page].map(item => (
                            <li key={item.info.kanji}>
                                <KanjiCard kanji={item.info} svg={item.svg}/>
                            </li>
                        ))}
                    </ul>
                    {!doneLoading && (<>Loading...</>)}
                </div>
            </div>
        </div>
    )
}