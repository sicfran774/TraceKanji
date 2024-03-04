import { getKanji } from "@/lib/mongodb/kanji"
import styles from './css/selection.module.css';
import Search from "./search";

//                       -------------Search-----------------------------
//                      /                                                \
//            KanjiInfo (left side)                                  Kanji Card List
//          /                     \                                      |
// Deck Manager/Draw Area   Info about kanji (under draw area)       Kanji Card
//          |
//     Deck Editor

export default async function Selection(){
    //Get all kanji found in Database
    const kanjiDB = await getKanji([], [])
    //Put all the kanjis into an array w/o the svg
    const kanjis = await kanjiDB.map(character => character.kanji)
    //Search KanjiAPI for each kanji info and put that into a json
    let kanjiAndSVG = []
    for(let i in kanjis){
        kanjiAndSVG.push({kanji: kanjis[i], svg: kanjiDB[i].svg})
    }

    return(
        <div className={styles.main}>
            <Search kanjiAndSVG={kanjiAndSVG}/>
        </div>
    )
}