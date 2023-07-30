'use client'

import SVG from 'react-inlinesvg'
import styles from './css/kanji-card.module.css';
import { useContext, useState, useEffect } from "react";
import { SharedKanjiProvider } from './svg-provider';

export default function KanjiCard({kanji, svg}){
    const [kanjiSVG, setKanjiSVG] = useState(false);

    let { setSharedKanji } = useContext(SharedKanjiProvider)
    let meanings = ""

    for(let i in kanji.meanings){
        if(i < kanji.meanings.length - 1){
            meanings += kanji.meanings[i] + ", "
        } else{
            meanings += kanji.meanings[i]
        }
    }

    useEffect(() => {
        removeStrokeOrder();
    }, []);

    function onClick(){
        setSharedKanji({kanji: kanji, svg: svg})
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    }

    function removeStrokeOrder(){
        //Find "StrokeNumber" section and remove it from the SVG file
        let index = svg.indexOf("<g id=\"kvg:StrokeN")
        let svgNoStrokeOrder = svg.substring(0, index)
        svgNoStrokeOrder += "</svg>"
        setKanjiSVG(svgNoStrokeOrder)
    }

    return(
        <div className={styles.card} onClick={onClick}>
            <div className={styles.kanji}>
                <SVG src={kanjiSVG}/>
            </div>
            <div>
                <p>{meanings}</p>
            </div>
        </div>
    )
}