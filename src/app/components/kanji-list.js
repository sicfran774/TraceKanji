import { getKanji } from "@/lib/mongodb/kanji"
import KanjiCard from "./kanji-card"

async function fetchKanji(){
    //Call async func to get kanji from db
    const kanji = await getKanji()
    if(!kanji) throw new Error('Failed to fetch kanji')

    return kanji
}

export default async function KanjiList({}){
    const kanji = await fetchKanji()

    return(
        <div>
            <ul>
                {kanji.map(k => (
                    <li key={k.kanji}>
                        <KanjiCard svg={k.svg}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}