import moment from "moment"

export const cardCounts = (deck) => {
    let counts = [0, 0, 0]
    const dueKanji = dueKanjiFromList(deck)

    if(dueKanji[0]){
        dueKanji.forEach(kanji => {
            if(kanji.learning) counts[1]++
            else if(kanji.graduated) counts[2]++
            else counts[0]++
        })
    }

    return counts
}

export const sortByDueDate = (deck, previous = [], firstTime = false) => {
    let allNotNew = true
    const dueKanji = dueKanjiFromList(deck, firstTime).map(obj => {
        if(!obj.learning && !obj.graduated) allNotNew = false
        return {kanji: obj.kanji, date: moment(obj.due)}
    }).filter(kanji => kanji !== undefined)
    //console.log(dueKanji)

    //Sort by date so that you don't get repeats
    dueKanji.sort((a, b) => {
        return a.date.diff(b.date)
    })
    const sorted = dueKanji.map(item => item.kanji)
    //if(sorted && allNotNew) return shuffleArray(sorted)

    // Avoid repeats when current card is always the soonest due
    if(previous.length > 1 && sorted.length > 1 && sorted[0] === previous[0]){
        let t = sorted[0];
        sorted[0] = sorted[1];
        sorted[1] = t;
    }

    return sorted
}

const dueKanjiFromList = (deck, firstTime = false) => {
    const deckSettings = deck[1]
    let newCardCount = deckSettings.newCardCount, reviewCount = deckSettings.reviewCount

    const now = moment()
    const arr = deck.slice(2, deck.length)
    const tempDueKanji = []
    arr.some(obj => {
        if(newCardCount < deckSettings.maxNewCards && (!obj.learning && !obj.graduated)){ //If it's a new card
            const kanjiDueDate = moment(obj.due)
            if(kanjiDueDate.isBefore(now) || kanjiDueDate.isSame(now, 'day')){ // If the card is due today or in the past
                newCardCount++
                if(firstTime){
                    obj.due = now   
                    //This prevents cards repeating too much. If you say again,
                    //that card will appear before any other card because it's
                    //technically the most soonest card always.
                }
                tempDueKanji.push(obj)
            } else { // If here, amount of new cards/review cards have exceeded for today.
                tempDueKanji.push(undefined)
            }
        } else if (reviewCount < deckSettings.maxReviews && (obj.learning || obj.graduated)){
            const kanjiDueDate = moment(obj.due)
            if(kanjiDueDate.isBefore(now) || kanjiDueDate.isSame(now, 'day')){ // If the card is due today or in the past
                reviewCount++
                if(firstTime) obj.due = now
                tempDueKanji.push(obj)
            } else {
                tempDueKanji.push(undefined)
            }
        } else { //Can't add any more cards
            return true //"breaks" out of .some()
        }
    })
    const dueKanji = tempDueKanji.filter(kanji => kanji !== undefined)

    //console.log(dueKanji)

    return dueKanji
}

const shuffleArray = (array) => {
    let m = array.length, t, i;
  
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
  
    return array;
}

/**
 * Multiplies the interval ("1d", "2m", "1M")
 * For example, multiplyInterval("2d", 2) will return 4d.
 * @param {string} interval - Interval to be multiplied by.
 * @param {number} multipler - Multiplier.
 * @returns {string} The resulting interval.
 */
export const multiplyInterval = (interval, multiplier) => {
    const timeAmount = interval.slice(0, -1)
    const timeType = interval[interval.length - 1]
    //console.log("interval: " + interval + "multiplier: " + multiplier)

    const newTime = timeAmount * multiplier
    //console.log(`${newTime}${timeType}`)
    return `${newTime}${timeType}`
}

/**
 * Adds to date based on given time string
 * @param {Date} date - Date to be added to.
 * @param {string} time - Time amount string e.g. 10m for 10 minutes, 2d for 2 days, 3n for 3 months.
 * @returns {Date} The resulting date.
 */
export const addToDate = (date, time) => {
    const timeAmount = time.slice(0, -1)
    const timeType = time[time.length - 1]
    // console.log("time: " + timeAmount + " type: " +  timeType)
    // console.log("before:" + date.toISOString())

    try{
        date = moment(date).add(timeAmount, timeType)
    } catch (e){
        console.log(e)
    }

    //console.log(date.toISOString())
    return date
}

export const resetCard = (card) => {
    card.graduated = false
    card.learning = true
    card.learningIndex = 0
}

export const resetCardCounts = (deck) => {
    deck[1].newCardCount = 0
    deck[1].reviewCount = 0
}

/**
 * Updates decks into MongoDB.
 * @param {string} email - Email of user.
 * @param {Array} decks - Entire array of all of the user's decks
 * @returns {result} The resulting status.
 */
export const updateDecksInDB = async (email, decks, msg) => {
    try{
        const result = await fetch(`api/mongodb/${email}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                updatedDecks: decks
            })
        })
        return result
    } catch (e){
        console.error(e)
    }
}

export const updateSettingsInDB = async (email, settings, msg) => {
    try{
        const result = await fetch(`api/mongodb/settings/${email}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                updatedSettings: settings
            })
        })
        return result
    } catch (e){
        console.error(e)
    }
}

export const updateLogInDB = async (email, date, msg) => {
    try{
        const result = await fetch(`api/mongodb/settings/${email}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lastLoggedIn: date
            })
        })
        return result
    } catch (e){
        console.error(e)
    }
}