import { getKanji } from "@/lib/mongodb/kanji";

async function fetchKanji(){
    const kanji = await getKanji()
    if(!kanji) throw new Error('Failed to fetch kanji')

    return kanji
}

export default async function KanjiList(){
    const kanji = await fetchKanji()

    return(
        <div>
            <ul>
                {kanji.map(k => (
                    <li key={k.kanji}>{k.kanji}</li>
                ))}
            </ul>
        </div>
    )
}