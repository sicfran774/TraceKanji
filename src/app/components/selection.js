import { getKanji } from "@/lib/mongodb/kanji"
import styles from './css/selection.module.css';
import Search from "./search";
import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default async function Selection(){
    const session = await getServerSession({
        providers:[
          GoogleProvider({
              clientId:process.env.OAUTH_CLIENT_ID,
              clientSecret: process.env.OAUTH_SECRET,
          }),
      ],
      secret: process.env.OAUTH_SECRET
    })
    console.log(JSON.stringify(session, null, 2))

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
            <Search kanjiAndSVG={kanjiAndSVG} />
        </div>
    )
}