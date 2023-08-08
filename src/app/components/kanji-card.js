'use client'

import SVG from 'react-inlinesvg'
import styles from './css/kanji-card.module.css';
import { useContext, useState, useEffect, useRef } from "react";
import { SharedKanjiProvider } from './shared-kanji-provider';

const selectedColor = "#59ff83"

export default function KanjiCard({kanji, svg}){
    const [kanjiSVG, setKanjiSVG] = useState(false)
    const [selected, setSelected] = useState(false)
    const cardRef = useRef()

    let { setSharedKanji, editingDeck, selectedKanji, setSelectedKanji } = useContext(SharedKanjiProvider)
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
        if(selectedKanji.includes(kanji.kanji)){
            setSelected(true)
            setColor(selectedColor)
        }
    }, []);

    //Runs when selectedKanji is empty (ideally when user clicks save to reset all cards)
    useEffect(() => {
        if(selectedKanji.length === 0){
            setSelected(false)
            setColor('white')
        } else if(selectedKanji.includes(kanji.kanji)){
            setSelected(true)
            setColor(selectedColor)
        }
    }, [selectedKanji])

    function onClick(){
        if(editingDeck){
            let arr
            if(!selected){
                setSelected(true)
                setColor(selectedColor)
                arr = [...selectedKanji, kanji.kanji] //Add kanji to list
            } else {
                setSelected(false)
                setColor('white')
                arr = selectedKanji.filter(item => item !== kanji.kanji) //Remove that kanji from list
            }
            setSelectedKanji(arr)
        } else {
            window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
            })
        }
        setSharedKanji({kanji: kanji, svg: svg})
    }

    function setColor(color){
        cardRef.current.style.backgroundColor = color
        
    }

    function removeStrokeOrder(){
        //Find "StrokeNumber" section and skip printing it from the SVG file
        let index = svg.indexOf("<g id=\"kvg:StrokeN")
        let svgNoStrokeOrder = svg.substring(0, index)
        svgNoStrokeOrder += "</svg>"
        setKanjiSVG(svgNoStrokeOrder)
    }

    return(
        <div className={styles.card} ref={cardRef} onClick={() => onClick()} id="card">
            <div className={styles.kanji}>
                <SVG src={kanjiSVG}/>
            </div>
            <div>
                <p>{meanings}</p>
            </div>
        </div>
    )
}