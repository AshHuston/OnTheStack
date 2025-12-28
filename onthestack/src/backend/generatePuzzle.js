import { Puzzle } from './puzzle.js'
import { shuffledClone } from '../helpers.js';

/**
 * Generates 
 * @param {number} numOfCards - The number of cards to be included in the puzzle, including the visible first and last ones.
 * @param {Mtgcard[]} cardPool - The pool of card objects to construct the puzzle with.
 * @param {Mtgcard} [startCard] - The starting card.
 * @param {Mtgcard} [endCard] - The ending card.
 * @returns {puzzle} The puzzle object
 * @throws {notInCardpool} Thrown when the starting or ending card does not exist in the given cardpool.
 */
export default function generatePuzzle(numOfCards, cardPool, startCard, endCard) {
    // if ( startCard && !cardPool.includes(startCard) ) {
    //     throw new Error(`${startCard.cardname} not in cardpool`);
    // }
    if ( endCard && !cardPool.includes(endCard) ) {
        throw new Error(`${endCard} not in cardpool`);
    }

    let puzzle = new Puzzle({}) // Still need to finish refactoring this logic and that in puzzle.js to get it to work with an object rather than an array

    const firstWord = startCard ?? cardPool.length
        ? cardPool[Math.floor(Math.random() * cardPool.length)]
        : undefined;
    let prevWord = firstWord

    puzzle.addCard({
        isFirstWord: true,
        isLastWord: false,
        topConnector: "",
        cardname: firstWord.cardname,
        bottomConnector: ""
    })

    // find all cards that have any matching start words to that end word
    while (puzzle.words.length < numOfCards) {
        const  shuffledCardPool = shuffledClone(cardPool).filter(e => !puzzle.words.some(p => p.cardname == e.cardname))
        let counter = 0
        let hasNotAddedACard = true
        while(counter > -1) {
            const lookingAt = shuffledCardPool[counter]
            counter++
            for (let i=0; i<lookingAt.startWords.length; i++) {
                if (prevWord.endWords.includes(lookingAt.startWords[i])) {
                    // Add next step
                    puzzle.addCard({
                        isFirstWord: false,
                        isLastWord: false,
                        topConnector: lookingAt.startWords[i],
                        cardname: lookingAt.cardname,
                        bottomConnector: ""
                    })

                    // IMPROVE: Have this audit happen in the Puzzle object automatiaclly. DONE!
                    // Audit previous word
                    // puzzle.at(-2).bottomConnector = puzzle.at(-1).topConnector

                    // Set as prevCard
                    prevWord = lookingAt

                    // Note that we added a card
                    hasNotAddedACard = false

                    //Exit while loop #2
                    counter = -1
                }
            }

            if (counter >= shuffledCardPool.length-1) { counter = -1 }
        }
        //IMPROVE: Should include some kind of safeguard for retries.
        if (puzzle.words.length < numOfCards && hasNotAddedACard) { 
            //console.log('recursing...'); 
            return generatePuzzle(numOfCards, cardPool, startCard, endCard) }
    }
    puzzle.words.at(-1).isLastWord = true

    return puzzle
}