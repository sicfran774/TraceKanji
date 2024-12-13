import moment from 'moment';

export const kanaDict = () => {
    const map = new Map()
    map.set("あ", ["a", "hiragana"]); map.set("ア", ["a", "katakana"]);
    map.set("い", ["i", "hiragana"]); map.set("イ", ["i", "katakana"]);
    map.set("う", ["u", "hiragana"]); map.set("ウ", ["u", "katakana"]);
    map.set("え", ["e", "hiragana"]); map.set("エ", ["e", "katakana"]);
    map.set("お", ["o", "hiragana"]); map.set("オ", ["o", "katakana"]);
    map.set("か", ["ka", "hiragana"]); map.set("カ", ["ka", "katakana"]);
    map.set("き", ["ki", "hiragana"]); map.set("キ", ["ki", "katakana"]);
    map.set("く", ["ku", "hiragana"]); map.set("ク", ["ku", "katakana"]);
    map.set("け", ["ke", "hiragana"]); map.set("ケ", ["ke", "katakana"]);
    map.set("こ", ["ko", "hiragana"]); map.set("コ", ["ko", "katakana"]);
    map.set("さ", ["sa", "hiragana"]); map.set("サ", ["sa", "katakana"]);
    map.set("し", ["shi", "hiragana"]); map.set("シ", ["shi", "katakana"]);
    map.set("す", ["su", "hiragana"]); map.set("ス", ["su", "katakana"]);
    map.set("せ", ["se", "hiragana"]); map.set("セ", ["se", "katakana"]);
    map.set("そ", ["so", "hiragana"]); map.set("ソ", ["so", "katakana"]);
    map.set("た", ["ta", "hiragana"]); map.set("タ", ["ta", "katakana"]); 
    map.set("ち", ["chi", "hiragana"]); map.set("チ", ["chi", "katakana"]);
    map.set("つ", ["tsu", "hiragana"]); map.set("ツ", ["tsu", "katakana"]);
    map.set("て", ["te", "hiragana"]); map.set("テ", ["te", "katakana"]);
    map.set("と", ["to", "hiragana"]); map.set("ト", ["to", "katakana"]);
    map.set("な", ["na", "hiragana"]); map.set("ナ", ["na", "katakana"]);
    map.set("に", ["ni", "hiragana"]); map.set("ニ", ["ni", "katakana"]);
    map.set("ぬ", ["nu", "hiragana"]); map.set("ヌ", ["nu", "katakana"]);
    map.set("ね", ["ne", "hiragana"]); map.set("ネ", ["ne", "katakana"]);
    map.set("の", ["no", "hiragana"]); map.set("ノ", ["no", "katakana"]);
    map.set("は", ["ha", "hiragana"]); map.set("ハ", ["ha", "katakana"]);
    map.set("ひ", ["hi", "hiragana"]); map.set("ヒ", ["hi", "katakana"]);
    map.set("ふ", ["fu", "hiragana"]); map.set("フ", ["fu", "katakana"]);
    map.set("へ", ["he", "hiragana"]); map.set("ヘ", ["he", "katakana"]);
    map.set("ほ", ["ho", "hiragana"]); map.set("ホ", ["ho", "katakana"]);
    map.set("ま", ["ma", "hiragana"]); map.set("マ", ["ma", "katakana"]);
    map.set("み", ["mi", "hiragana"]); map.set("ミ", ["mi", "katakana"]);
    map.set("む", ["mu", "hiragana"]); map.set("ム", ["mu", "katakana"]);
    map.set("め", ["me", "hiragana"]); map.set("メ", ["me", "katakana"]);
    map.set("も", ["mo", "hiragana"]); map.set("モ", ["mo", "katakana"]);
    map.set("や", ["ya", "hiragana"]); map.set("ヤ", ["ya", "katakana"]);
    map.set("ゆ", ["yu", "hiragana"]); map.set("ユ", ["yu", "katakana"]);
    map.set("よ", ["yo", "hiragana"]); map.set("ヨ", ["yo", "katakana"]);
    map.set("ら", ["ra", "hiragana"]); map.set("ラ", ["ra", "katakana"]);
    map.set("り", ["ri", "hiragana"]); map.set("リ", ["ri", "katakana"]);
    map.set("る", ["ru", "hiragana"]); map.set("ル", ["ru", "katakana"]);
    map.set("れ", ["re", "hiragana"]); map.set("レ", ["re", "katakana"]);
    map.set("ろ", ["ro", "hiragana"]); map.set("ロ", ["ro", "katakana"]);
    map.set("わ", ["wa", "hiragana"]); map.set("ワ", ["wa", "katakana"]);
    map.set("を", ["wo", "hiragana"]); map.set("ヲ", ["wo", "katakana"]);
    map.set("ん", ["n", "hiragana"]); map.set("ン", ["n", "katakana"]);
    return map
}

export function prepareKanji(kanji, meanings){
    return { 
        kanji: kanji, 
        meanings: meanings, 
        learningIndex: 0,
        learning: false,
        graduated: false,
        interval: "1m",
        reviews: [],
        due: moment().toISOString()
    }
}

export function defaultDeckSettings(){
    return [
        "Deck Name",
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