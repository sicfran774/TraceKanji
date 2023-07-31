'use client'

import styles from './css/search.module.css';
import {useState, useEffect} from "react";
import KanjiCard from './kanji-card';

export default function Search({kanjiAPI}){

    const [filter, setFilter] = useState("")
    const [kanjiInfo, setKanjiInfo] = useState(kanjiAPI)

    //console.log(kanjiInfoSVG)

    useEffect(() => {
        getKanjiBasedOnFilter()
    }, [filter])

    const getKanjiBasedOnFilter = () => {
        const lowercase = filter.toLowerCase()
        //Go through each kanji, look at their meanings and see if it starts with filter
        const sameMeanings = kanjiAPI.filter(kanji => (kanji.info.meanings.some((meaning) => meaning.startsWith(lowercase)) || lowercase === ''))
        //Same for kun readings
        const sameKun = kanjiAPI.filter(kanji => (kanji.info.kun_readings.some((meaning) => meaning.startsWith(lowercase)) || lowercase === ''))
        //Same for on readings
        const sameOn = kanjiAPI.filter(kanji => (kanji.info.on_readings.some((meaning) => meaning.startsWith(lowercase)) || lowercase === ''))

        if(sameKun.length > 0){
            setKanjiInfo(sameKun)
        } else if(sameOn.length > 0){
            setKanjiInfo(sameOn)
        } else{
            setKanjiInfo(sameMeanings)
        }
    }

    return(
        <div className={styles.main}>
            <div className={styles.searchBox}>
                <input type="text" id="filter" name="filter" onChange={e => setFilter(e.target.value)}></input>
                {/* <button type="button" onClick={getKanjiBasedOnMeaning} className='button'>Enter</button> */}
            </div>
            <div className={styles.kanjiList}>
                <ul>
                    {kanjiInfo.map(item => (
                        <li key={item.info.kanji}>
                            <KanjiCard kanji={item.info} svg={item.svg}/>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}