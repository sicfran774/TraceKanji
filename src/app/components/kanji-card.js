'use client'

import SVG from 'react-inlinesvg'
import styles from './css/kanji-card.module.css';
import { useContext, useState, useEffect, useRef } from "react";
import { SharedKanjiProvider } from './svg-provider';

export default function KanjiCard({kanji, svg}){
    const [kanjiSVG, setKanjiSVG] = useState(false)
    const [selected, setSelected] = useState(false)
    const cardRef = useRef()

    let { setSharedKanji, editingDeck } = useContext(SharedKanjiProvider)
    let meanings = ""

    if(kanji){
        for(let i in kanji.meanings){
            if(i < kanji.meanings.length - 1){
                meanings += kanji.meanings[i] + ", "
            } else{
                meanings += kanji.meanings[i]
            }
        }
    }
    

    useEffect(() => {
        removeStrokeOrder();
    }, []);

    function onClick(cardRef){
        if(editingDeck){
            if(!selected){
                console.log(`Selected ${kanji.kanji}`)
                setSelected(true)
                cardRef.current.style.borderColor = 'green'
            } else {
                console.log(`Deselected ${kanji.kanji}`)
                setSelected(false)
                cardRef.current.style.borderColor = 'black'
            }
        } else {
            window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
            })
        }
        setSharedKanji({kanji: kanji, svg: svg})
    }

    function removeStrokeOrder(){
        //Find "StrokeNumber" section and skip printing it from the SVG file
        let index = svg.indexOf("<g id=\"kvg:StrokeN")
        let svgNoStrokeOrder = svg.substring(0, index)
        svgNoStrokeOrder += "</svg>"
        setKanjiSVG(svgNoStrokeOrder)
    }

    return(
        <div className={styles.card} ref={cardRef} onClick={() => onClick(cardRef)} id="card">
            <div className={styles.kanji}>
                <SVG src={kanjiSVG}/>
            </div>
            <div>
                <p>{meanings}</p>
            </div>
        </div>
    )
}