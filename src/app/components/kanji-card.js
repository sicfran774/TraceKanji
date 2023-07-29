'use client'

import SVG from 'react-inlinesvg'
import styles from './css/kanji-card.module.css';
import { useContext, useEffect, useRef, useState} from "react";
import { SharedKanjiProvider } from './svg-provider';

export default function KanjiCard({svg, overlay}){

    let { setSharedKanji } = useContext(SharedKanjiProvider)

    function onClick(){
        setSharedKanji(svg)

        window.scrollTo(0,0)
    }

    return(
        <div className={styles.card}>
            <SVG src={svg} onClick={onClick}/>
        </div>
    )
}