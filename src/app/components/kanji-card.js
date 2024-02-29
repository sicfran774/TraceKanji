'use client'

import SVG from 'react-inlinesvg'
import styles from './css/kanji-card.module.css';
import { useContext, useState, useEffect, useRef } from "react";
import { SharedKanjiProvider } from './shared-kanji-provider';
import { selectedColor, selectedDarkModeColor, darkModeColor } from '../util/colors'

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
        if(containsKanji()){ // if this card is in the currently selected deck
            setSelected(true)
            changeCardBackground(selectedDarkModeColor, selectedColor) // highlight it
        }

        //Detect dark/light mode change
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) { 
            changeCardBackground(darkModeColor, 'white')
        })
    }, []);

    //Runs when selectedKanji is empty (ideally when user clicks save to reset all cards)
    useEffect(() => {
        if(selectedKanji.length === 0){
            setSelected(false)
            changeCardBackground(darkModeColor, 'white')  
        } else if(containsKanji()){
            setSelected(true)
            changeCardBackground(selectedDarkModeColor, selectedColor)
        }
    }, [selectedKanji])

    // if this card is in the currently selected deck
    function containsKanji(){
        return selectedKanji.some(obj => obj.kanji === kanji.kanji)
    }

    function onClick(){
        if(editingDeck){
            let arr
            if(!selected){
                setSelected(true)
                changeCardBackground(selectedDarkModeColor, selectedColor)
                const preparedKanji = {kanji: kanji.kanji, meanings: kanji.heisig_en, interval: []}
                console.log(preparedKanji)
                arr = [...selectedKanji, preparedKanji] //Add kanji to list
            } else {
                setSelected(false)
                changeCardBackground(darkModeColor, 'white')
                arr = selectedKanji.filter(item => item.kanji !== kanji.kanji) //Remove that kanji from list
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
        try{
            cardRef.current.style.backgroundColor = color
        } catch (e){

        }
    }

    function changeCardBackground(dark, light){
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setColor(dark)
        } else {
            setColor(light)
        }
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