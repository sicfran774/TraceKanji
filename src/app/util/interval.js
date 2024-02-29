import moment from "moment"

export const sortByDueDate = (deck) => {
    const readDeck = deck.slice(2, deck.length)
    const dueKanji = readDeck.map(obj => {
        const now = new Date()
        const kanjiDueDate = new Date(obj.due)
        if(kanjiDueDate < now){
            return obj.kanji
        }
    })
    console.log(dueKanji)
    return dueKanji
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
    console.log("time: " + timeAmount + " type: " +  timeType)
    console.log("before:" + date.toISOString())

    switch(timeType){
        case 's':
            date = moment(date).add(timeAmount, 'seconds')
            break
        case 'm':
            date = moment(date).add(timeAmount, 'minutes')
            break
        case 'h':
            date = moment(date).add(timeAmount, 'hours')
            console.log("haour")
            break
        case 'd':
            date = moment(date).add(timeAmount, 'days')
            console.log("days")
            break
        case 'M':
            date = moment(date).add(timeAmount, 'months')
            console.log("months")
            break
        case 'y':
            date = moment(date).add(timeAmount, 'years')
            console.log("years")
            break
        default:
            console.log("Interval error")
    }

    console.log(date.toISOString())
    return date
}