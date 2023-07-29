import { getKanji } from "@/lib/mongodb/kanji"
import KanjiCard from "./kanji-card"

const KANJIAPI_URL = "https://kanjiapi.dev/v1"

async function fetchKanji(){
    //Call async func to get kanji from db
    const kanji = await getKanji()
    if(!kanji) throw new Error('Failed to fetch kanji')

    return kanji
}

async function fetchKanjiInfo(kanjiJson){
    const kanjiInfo = await Promise.all(
        kanjiJson.map(character => (
            fetch(`${KANJIAPI_URL}/kanji/${character.kanji}`)
            .then(result => result.json())
            )
        )
    )
    return kanjiInfo
}

export default async function KanjiList({}){
    const kanjiJson = await fetchKanji()
    const kanjiInfo = await fetchKanjiInfo(kanjiJson)

    return(
        <div>
            <ul>
                {kanjiJson.map((item, index) => (
                    <li key={index}>
                        <KanjiCard kanji={kanjiInfo[index]} svg={item.svg}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}