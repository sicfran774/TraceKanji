import clientPromise from ".";

let client, database, kanji, accounts

async function init(){
    //Already initialized
    if(database) return

    try{
        client = await clientPromise
        database = client.db('trace-kanji')
        kanji = database.collection('kvg-v1')
        accounts = database.collection('accounts')
    } catch (e) {
        throw new Error('Failed to connect to database')
    }
}

;(async () => {
    await init()
})()

export async function getDecks(email){
    try{
        if(!accounts) await init()

        let deckList = await accounts.findOne({email: email})

        //create new document if email doesn't exist in DB
        if(!deckList) deckList = await createAccount(email)

        return deckList
    } catch (e) {
        console.log(e)
        return {error: 'Failed to fetch decks'}
    }
}

async function createAccount(email){
    const newAccount = {
        email: email,
        decks: [],
        subscribed: true
    }
    const result = await accounts.insertOne(newAccount)
    return result;
}

export async function updateDecks(updatedDecks, email){
    const result = await accounts.updateOne({email: email}, {$set:{decks: updatedDecks}})
    return result
}

export async function getKanji(characters) {
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

export async function getAllSubscribedEmails(){
    try{
        if(!accounts) await init()

        const emails = await accounts.find()
        const subbed = emails.map(account => {
            if(account.subscribed) return account
        })

        console.log(subbed)
        return deckList
    } catch (e) {
        console.log(e)
        return {error: 'Failed to fetch emails'}
    }
}