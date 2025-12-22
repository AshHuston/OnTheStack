import englishWords from "an-array-of-english-words" with { type: "json" };

export class MtgCard {
    constructor(cardname = "") {
        this.cardname = cardname.toLowerCase();

        this.startWords = this._initStartWords();
        this.endWords = this._initEndWords();
        console.log("START WORDS", this.startWords)
        console.log("END WORDS", this.endWords)
    }

    _findFirstWords(firstWord) {
        let words = englishWords
        const legalFirstWords = []
        for (let i=0; i<firstWord.length; i++){
            words = words.filter(d => d[i] === firstWord[i])
            for (let n=0; n<words.length; n++) {
                if (words[n].length === i+1) (legalFirstWords.push(words[n]))
            }
        }
        return legalFirstWords
    }

     _findLastWords(lastWord) {
        let words = englishWords
        const legaLastWords = []
        for (let i=1; i<=lastWord.length; i++){
            words = words.filter(d => d.slice(-i) === lastWord.slice(-i)); 
            for (let n=0; n<words.length; n++) {
                if (words[n].length === i) {legaLastWords.push(words[n])}
            }
        }
        return legaLastWords
    }

    _initStartWords() {
        const firstWord = 
            this.cardname
            .trim()
            .split(/\s+/)[0]
            // .split("'")[0]
            // .split("'s")[0]
            // .split(",")[0]
            ;

        return this._findFirstWords(firstWord)
    }

    _initEndWords() {
         const lastWord = 
            this.cardname
            .trim()
            .split(/\s+/).at(-1)
            // .split("'")[0]
            // .split("'s")[0]
            // .split(",")[0]
            ;
        return this._findLastWords(lastWord)
    }
}