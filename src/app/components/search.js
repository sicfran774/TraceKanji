'use client'

import styles from './css/search.module.css';
import {useState, useEffect} from "react";
import KanjiCard from './kanji-card';
import DrawArea from './draw-area';

const ITEMS_PER_PAGE = 24;

export default function Search({kanjiAPI}){
    //kanjiAPI consists of two objects
    // - info: this holds kanji info like meanings, grade, jlpt, readings
    // - svg: contains svg string that shows stroke orders

    const [filter, setFilter] = useState("")
    const [kanjiInfo, setKanjiInfo] = useState(kanjiAPI)
    const [doneLoading, setDoneLoading] = useState(false)
    const [page, setPage] = useState(0);

    let kanjiList = kanjiInfo;

    useEffect(() => {
        setKanjiPerPage()
    }, [])

    useEffect(() => {
        getKanjiBasedOnFilter()
    }, [filter])

    const getKanjiBasedOnFilter = () => {
        setPage(0)
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

    const setKanjiPerPage = () => {
        let arr = []
        for(let i = 0; i < kanjiList.length; i += ITEMS_PER_PAGE){
            const chunk = kanjiList.slice(i, i + ITEMS_PER_PAGE)
            arr.push(chunk)
        }
        setKanjiInfo(arr)
        setDoneLoading(true)
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

    return(
        <div className={styles.main}>
            <div className={styles.searchBox}>
                <div className={styles.searchText}>Search</div>
                <input type="text" id="filter" name="filter" onChange={e => setFilter(e.target.value)}></input>
                <div className={styles.deckSelector}>
                    <select name="decks" id="decks">
                        <option value="default">Default Deck (WIP)</option>
                    </select>
                </div>
                <div className={styles.pageButtons}>
                    <button type="button" onClick={() => changePage(-1)} className='button'>Prev</button>
                    <div>Page {page + 1}/{kanjiInfo.length}</div>
                    <button type="button" onClick={() => changePage(1)} className='button'>Next</button>
                </div>
            </div>
            <div className={styles.listAndDrawArea}>
                <div className={styles.kanjiList}>
                    <ul>
                        {doneLoading && kanjiInfo.length > 0 && kanjiInfo[page].map(item => (
                            <li key={item.info.kanji}>
                                <KanjiCard kanji={item.info} svg={item.svg}/>
                            </li>
                        ))}
                    </ul>
                    {!doneLoading && (<>Loading...</>)}
                </div>
                <DrawArea />
            </div>
        </div>
    )
}