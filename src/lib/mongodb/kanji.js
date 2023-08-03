import clientPromise from ".";

let client, database, kanji

async function init(){
    //Already initialized
    if(database) return

    try{
        client = await clientPromise
        database = client.db('trace-kanji')
        kanji = database.collection('kvg-v1')
    } catch (e) {
        throw new Error('Failed to connect to database')
    }
}

;(async () => {
    await init()
})()

export async function getKanji(currentList, characters) {
    try{
        if(!kanji) await init()

        let kanjiList

        if(characters.length > 0){
            kanjiList = await kanji.find({kanji: {$in: characters}}).toArray()
        } else {
            kanjiList = await kanji.find({}).toArray()
        }

        return kanjiList
    } catch (e) {
        console.log(e)
        return {error: 'Failed to fetch kanji'}
    }
}