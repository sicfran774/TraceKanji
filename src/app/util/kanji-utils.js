import moment from 'moment';

export function prepareKanji(kanji, meanings){
    return { 
        kanji: kanji, 
        meanings: meanings, 
        learningIndex: 0,
        learning: false,
        graduated: false,
        interval: "1m",
        due: moment().toISOString()
    }
}

export function defaultDeckSettings(){
    return [
        "RTK",
        {
            learningSteps: ["1m","10m","1d","3d"], //If user chooses Good, go up one. Easy --> up 2
            graduatingInterval: "4d", // If user hits good, it will graduate and be susceptible to ease.
            easyInterval: "7d", // Instantly graduate card.
            ease: "2", //Multiplier after graduating
            easy: "0.5", //Add to ease multiplier if user hits easy
            maxNewCards: 20,
            maxReviews: 200,
            newCardCount: 0,
            reviewCount: 0,
            dateReset: moment().toISOString(),
            sequential: true
        }
    ]
}