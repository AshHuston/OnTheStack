import englishWords from "an-array-of-english-words" with { type: "json" };
import { wordBlacklist } from "./lists.js"

export class MtgCard {
    constructor(cardname = "") {
        this.cardname = cardname.toLowerCase().split("//")[0].trim();

        this.startWords = this._initStartWords();
        this.endWords = this._initEndWords();
        
        for (const item of this.startWords) {
            if (this.endWords.has(item)) {
                this.startWords.delete(item)
                this.endWords.delete(item)
            }
        }
    }

    // IMPROVE: Collapse these two functions into one with a toggle variable
    _findFirstWords(firstWord, minlength = 3) {
        let words = englishWords
        const legalFirstWords = new Set([firstWord])
        for (let i=0; i<firstWord.length; i++){
            words = words.filter(d => d[i] === firstWord[i])
            for (let n=0; n<words.length; n++) {
                if (
                    words[n].length === i+1  
                    && words[n].length >= minlength
                    && !wordBlacklist.includes(words[n])
                ) {
                    legalFirstWords.add(words[n])
                }
            }
        }
        return legalFirstWords
    }

    _findLastWords(lastWord, minlength = 3) {
        let words = englishWords
        const legaLastWords = new Set([lastWord])
        for (let i=1; i<=lastWord.length; i++){
            words = words.filter(d => d.slice(-i) === lastWord.slice(-i)); 
            for (let n=0; n<words.length; n++) {
                if (
                    words[n].length === i 
                    && words[n].length >= minlength
                    && !wordBlacklist.includes(words[n])
                ) {
                    legaLastWords.add(words[n])
                }
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