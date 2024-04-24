import moment from "moment";
import clientPromise from ".";
import { defaultDeckSettings, prepareKanji } from "@/app/util/kanji-utils";

let client, database, kanji, accounts, backup, premade

async function init(){
    //Already initialized
    if(database) return

    try{
        client = await clientPromise
        database = client.db('trace-kanji')
        kanji = database.collection('kvg-v1')
        accounts = database.collection('accounts')
        backup = database.collection('backup')
        premade = database.collection('premade')
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

// ACCOUNT DEFAULT VALUES
async function createAccount(email){
    const newAccount = {
        email: email,
        decks: [],
        lastLoggedIn: moment(),
        dateRecord: [],
        settings: {
            penWidth: 10,
            autoShowTracing: true,
            subscribed: true
        }
    }
    const result = await accounts.insertOne(newAccount)
    return result;
}

export async function createPremadeDeck(){
    try{
        if(!premade) await init()
        //Kanji list goes here
        const kanjiList = ""
        const deckList = defaultDeckSettings()

        const appendKanjis = async () => Array.from(kanjiList).forEach(char => {
                try{
                    if(char != " "){
                        fetch(`https://kanjiapi.dev/v1/kanji/${char}`)
                            .then(result => result.json())
                            .then(info => prepareKanji(info.kanji, info.heisig_en))
                            .then(prepared => {
                                deckList.push(prepared)
                            })
                    }
                    
                } catch(e){
                    console.error("Error: Failed to create premade deck")
                }
            }
        )
        await appendKanjis().then(() => premade.insertOne({name: "test", deck: deckList})).then(result => console.log(result))
        
    } catch (e) {
        console.log(e)
        return {error: 'Failed to create premade deck'}
    }
}

export async function getPremadeDeck(deckName){
    try{
        if(!premade) await init()

        const deck = await premade.findOne({name: deckName})

        if(!deck) 
            throw new Error("Deck not found.")
        else 
            return deck.deck
        
    } catch (e) {
        console.log(e)
        return {error: 'Failed to get premade deck'}
    }
}

export async function addPremadeToAccount(deck, email){
    try{
        if(!accounts) await init()

        const result = await accounts.updateOne({email: email}, {$push:{decks: deck}})

        return result
    } catch (e) {
        console.log(e)
        return {error: 'Failed to push premade deck to account'}
    }
}

export async function updateDecks(updatedDecks, email){
    try{
        if(!accounts) await init()

        const result = await accounts.updateOne({email: email}, {$set:{decks: updatedDecks}})
        return result

    } catch (e) {
        console.log(e)
        return {error: 'Failed to save decks'}
    }
}

export async function getSettings(email){
    try{
        if(!accounts) await init()

        let settings = await accounts.findOne({email: email})

        //create new document if email doesn't exist in DB
        if(!settings) throw new Error("New account. Creating settings.")

        return settings
    } catch (e) {
        console.log(e)
        return {error: 'Failed to fetch user settings' + e}
    }
}

export async function updateSettings(updatedSettings, email){
    try{
        if(!accounts) await init()

        const result = await accounts.updateOne({email: email}, {$set:{settings: updatedSettings}})
        return result

    } catch (e) {
        console.log(e)
        return {error: 'Failed to save settings'}
    }
}

export async function updateLastLoggedIn(date, email){
    try{
        if(!accounts) await init()

        const result = await accounts.updateOne({email: email}, {$set:{lastLoggedIn: date}})
        const result2 = await accounts.updateOne({email: email}, {$push:{dateRecord: date}})
        return result

    } catch (e) {
        console.log(e)
        return {error: 'Failed to save date'}
    }
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

        const emails = await accounts.find({ subscribed: true }).toArray()
        
        return emails
    } catch (e) {
        console.log(e)
        return {error: 'Failed to fetch emails'}
    }
}

export async function backupAccountData(){
    try{
        if(!accounts || !backup) await init()

        const data = await accounts.find().toArray()

        const newBackup = {
            date: moment(),
            data: data
        }

        const result = await backup.insertOne(newBackup)

        return result
    } catch (e) {
        console.log(e)
        return {error: 'Failed to backup account data.'}
    }
}