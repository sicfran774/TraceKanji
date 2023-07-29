import clientPromise from ".";

let client, database, kanji

async function init(){
    //Already initialized
    if(database) return

    try{
        client = await clientPromise
        database = client.db('kanji')
        kanji = database.collection('kvg')
    } catch (e) {
        throw new Error('Failed to connect to database')
    }
}

;(async () => {
    await init()
})()

export async function getKanji(character) {
    try{
        if(!kanji) await init()

        const svg = await kanji.find({}).toArray()

        return svg
    } catch (e) {
        return {error: 'Failed to fetch kanji'}
    }
}