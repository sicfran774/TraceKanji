'use client'

import SVG from 'react-inlinesvg'
import styles from './css/kanji-card.module.css';
import { useContext, useState, useEffect } from "react";
import { SharedKanjiProvider } from './svg-provider';

export default function KanjiCard({svg}){
    const [kanji, setKanji] = useState(false);

    let { setSharedKanji } = useContext(SharedKanjiProvider)

    useEffect(() => {
        removeStrokeOrder();
    }, []);

    function onClick(){
        setSharedKanji(svg)
        window.scrollTo(0,0)
    }

    function removeStrokeOrder(){
        //Find "StrokeNumber" section and remove it from the SVG file
        let index = svg.indexOf("<g id=\"kvg:StrokeN")
        let svgNoStrokeOrder = svg.substring(0, index)
        svgNoStrokeOrder += "</svg>"
        setKanji(svgNoStrokeOrder)
    }

    return(
        <div className={styles.card}>
            <SVG src={kanji} onClick={onClick}/>
        </div>
    )
}