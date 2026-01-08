import { Puzzle } from './puzzle.js'
import { getFormattedDate, getFormattedTimeStamp, shuffledClone } from '../helpers.js';
import { usePuzzleStore } from '../stores/puzzle.js';
// import puzzleArchive from '../../dist/puzzleArchive.json' with {type: 'json'}
// import edhRecTop10k from '../../dist/cardPools/edhRecTop10k.json' with {type: 'json'}
import fs from 'fs/promises'
import { MtgCard } from './cardData.js';
import path from 'path'

// let jsonPath = path.resolve('./src/backend/cardPools/edhrecTop10k.json')
// let fileContents = await fs.readFile(jsonPath, 'utf8')
// const edhRecTop10k = JSON.parse(fileContents)

const response = await fetch('/backend/cardPools/edhrecTop10k.json')
if (!response.ok) {
  throw new Error('Failed to load edhrecTop10k.json')
}
const edhRecTop10k = await response.json()

// jsonPath = path.resolve('./src/backend/puzzleArchive.json')
// fileContents = await fs.readFile(jsonPath, 'utf8')
// const puzzleArchive = JSON.parse(fileContents)
const resp = await fetch('/backend/puzzleArchive.json')
if (!response.ok) {
  throw new Error('Failed to load puzzleArchive.json')
}
const puzzleArchive = await resp.json()


/**
 * Generates a Puzzle
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
    // if ( endCard && !cardPool.includes(endCard) ) {
    //     throw new Error(`${endCard} not in cardpool`);
    // }

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

    // Find all cards that have any matching start words to that end word
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
                        cardname: ensureFrontFaceCardName(lookingAt.cardname),
                        bottomConnector: ""
                    })

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

    console.log(`${getFormattedTimeStamp()}: Generated a Puzzle`)
    return puzzle
}

function ensureFrontFaceCardName(card) {
    return card.split(" // ")[0]
}

/**
 * Checks if the most recently archived puzzle is up-to-date. If not, generates a new one with the passed cardPool and numOfCards and archives it.
 * @param {number} [numOfCards]
 * @param {MtgCard[]} [cardPool]
 */
export function ensureCurrentDatePuzzleInStore(numOfCards = 7, cardPool = edhRecTop10k){
    const currentDate = getFormattedDate()
    if (puzzleArchive.puzzles.at(-1).date === currentDate){ return }

    const { length, words } = generatePuzzle(numOfCards, cardPool)
    const newPuzzle = { length, words, date: currentDate }
    puzzleArchive.puzzles.push(newPuzzle)
    puzzleArchive.length = puzzleArchive.puzzles.length
    archivePuzzle(puzzleArchive)
    savePuzzle(length, words)
}



async function savePuzzle(length, words) {
  const data = JSON.stringify({ length, words }, null, 4)

  try {
    await fs.writeFile('src/backend/dailypuzzle.json', data, 'utf8')
    console.log(getFormattedTimeStamp(), 'Puzzle saved successfully!')
  } catch (err) {
    console.error(getFormattedTimeStamp(), 'Failed to save puzzle:', err)
  }
}

/**
 * Save the puzzle archive object to puzzleArchive.json asynchronously
 * @param {Object} puzzleArchive - The object to save
 */
async function archivePuzzle(puzzleArchive) {
  try {
    const data = JSON.stringify(puzzleArchive, null, 4)
    await fs.writeFile('src/backend/puzzleArchive.json', data, 'utf8')
    console.log(getFormattedTimeStamp(), 'Puzzle archive saved successfully!')
  } catch (err) {
    console.error(getFormattedTimeStamp(), 'Failed to save puzzle archive:', err)
  }
}
