import moment from "moment";
import clientPromise from ".";
import { defaultDeckSettings, prepareKanji } from "@/app/util/kanji-utils";
import { kanaDict } from "@/app/util/kanji-utils";
import { resetCardCounts } from "@/app/util/interval";

let client, database, kanji, accounts, backup, premade, resetLogs, websiteStats

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
        resetLogs = database.collection('reset-logs')
        websiteStats = database.collection('website-stats')
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
        dateCreated: moment().toISOString(),
        settings: {
            penWidth: 10,
            autoShowTracing: true,
            subscribed: true,
            timeReset: 0
        },
        stats: {
            dayStreak: 0,
            studied: [],
        }
    }
    const result = await accounts.insertOne(newAccount)
    return result;
}

export async function createPremadeDeck(){
    try{
        if(!premade) await init()
        //Kanji list goes here
        const kanjiList = "一二三四五六七八九十百千万円時日本人月火水木金土曜上下中半山川元気私今田女男見行食飲天東西南北口出右左分先生大学外国京子小会社父母高校毎語文帰入員新聞作仕事電車休言読思次何午後前名白雨書友間家話少古知来住正年売買町長道雪立自夜朝持手紙好近明病院映画歌市所勉強有旅昔々神早起牛使働連別度赤青色"

        const appendKanjis = async () => {
            
            const deckList = defaultDeckSettings()
            Array.from(kanjiList).forEach(char => {
                if(char != " "){
                    try{
                        fetch(`https://kanjiapi.dev/v1/kanji/${char}`)
                            .then(result => {
                                if(result.ok){
                                    return result.json()
                                } else {
                                    return {
                                        "heisig_en": kanaDict().get(char)[0],
                                        "kanji": char,
                                    }
                                }
                            })
                            .then(info => prepareKanji(info.kanji, info.heisig_en))
                            .then(prepared => {
                                console.log(prepared)
                                deckList.push(prepared)
                            })
                        // deckList.push(prepareKanji(char, kanaDict().get(char)[0]))
                    } catch(e){
                        console.error("Error: Failed to create premade deck")
                    }
                }
            })
            return deckList
        }
        await appendKanjis().then((deckList) => (premade.insertOne({name: "Genki I: 3rd Edition", deck: deckList}).then((result) => console.log(result)).then(() => console.log(deckList + "too fast"))))
        
        
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

export async function getStats(email){
    try{
        if(!accounts) await init()

        let stats = await accounts.findOne({email: email})

        //create new document if email doesn't exist in DB
        if(!stats) throw new Error("New account.")

        return stats
    } catch (e) {
        console.log(e)
        return {error: 'Failed to fetch user stats' + e}
    }
}

export async function updateStats(updatedStats, email){
    try{
        if(!accounts) await init()

        const result = await accounts.updateOne({email: email}, {$set:{stats: updatedStats}})
        return result

    } catch (e) {
        console.log(e)
        return {error: 'Failed to save stats'}
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
            date: moment().toISOString(),
            data: data
        }

        const result = await backup.insertOne(newBackup)

        return result
    } catch (e) {
        console.log(e)
        return {error: 'Failed to backup account data.'}
    }
}

export async function dailyResets(){
    try{
        if(!accounts || !resetLogs) await init()

        const data = await accounts.find().toArray()
        let log = ""

        for(let i in data){
            const account = data[i]
            // if(account.decks){
            //     for(let j in account.decks){
            //         const deck = account.decks[j]
            //         const timeReset = account.settings.timeReset ? account.settings.timeReset : 0
            //         if (typeof deck[1].dateReset !== 'string'){
            //             console.log(`Invalid date at ${account.email}: ${deck[0]}. Setting to now.`)
            //             log += `Invalid date at ${account.email}: ${deck[0]}. Setting to now.\n`
            //             deck[1].dateReset = moment().toISOString()
            //             resetCardCounts(deck)
            //         } else if (moment().isAfter(deck[1].dateReset)){
            //             resetCardCounts(deck)
            //             deck[1].dateReset = moment().add(1,"day").hour(timeReset).minute(0).second(0).toISOString()
            //             console.log(`Reset ${deck[0]} for ${account.email}`)
            //             log += `Reset ${deck[0]} for ${account.email}\n`
            //         }
            //     }
            //     await updateDecks(account.decks, account.email)
            // }
            
            // If NOT studied yesterday
            if( account.stats &&
                !account.stats.studied.some(element => element.date === moment().subtract(1, "day").format("L"))
            ){
                console.log(`${account.email} lost streak!`)
                log += `${account.email} lost streak!\n`
                account.stats.dayStreak = 0
                await updateStats(account.stats, account.email)
            }
        }

        const newLog = {
            date: moment().toISOString(),
            data: log
        }

        const result = await resetLogs.insertOne(newLog)

        return result
    } catch (e) {
        console.log(e)

        const newLog = {
            date: moment().toISOString(),
            data: `ERROR: Log failed: ${e}`
        }

        const result = await resetLogs.insertOne(newLog)

        return {error: `Failed to reset daily deck counts and streaks: ${result}`}
    }
}

export async function incrementRecognitionTimes(){
    try{
        if(!websiteStats) await init()

        const result = await websiteStats.updateOne(
            { name: "Stats" },
            { $inc: { count: 1} }
        )

        return result
    } catch (e) {
        console.log(e)
        return {error: 'Failed to increment recognition count data.'}
    }
}