import { getKanji } from "@/lib/mongodb/kanji"
import styles from './css/kanji-list.module.css';
import Search from "./search";

const KANJIAPI_URL = "https://kanjiapi.dev/v1"

export default async function Selection(){

    //Get all kanji found in Database
    const kanjiDB = await getKanji([])
    //Put all the kanjis into an array w/o the svg
    const kanjis = await kanjiDB.map(character => character.kanji)
    //Search KanjiAPI for each kanji info and put that into a json
    const kanjiJson = await Promise.all(
        kanjis.map(kanji => (
            fetch(`${KANJIAPI_URL}/kanji/${kanji}`)
            .then(result => result.json())
            )
    ))
    let kanjiAPI = []
    for(let i in kanjiJson){
        kanjiAPI.push({info: kanjiJson[i], svg: kanjiDB[i].svg})
    }

    return(
        <div className={styles.main}>
            <Search kanjiAPI={kanjiAPI} />
        </div>
    )
}