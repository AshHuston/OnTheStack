import { Puzzle } from './puzzle.js'
import { getFormattedDate, getFormattedTimeStamp, shuffledClone } from './helpers.js';
import edhRecTop10k from './cardPools/edhrecTop10k.json' with {type: 'json'}
import fs from 'fs/promises'


/**
 * Generates a Puzzle
 * @param {number} numOfCards - The number of cards to be included in the puzzle, including the visible first and last ones.
 * @param {Mtgcard[]} cardPool - The pool of card objects to construct the puzzle with.
 * @param {Mtgcard} [startCard] - The starting card.
 * @param {Mtgcard} [endCard] - The ending card.
 * @returns {puzzle} The puzzle object
 * @throws {notInCardpool} Thrown when the starting or ending card does not exist in the given cardpool.
 */
export function generatePuzzle(numOfCards, cardPool, startCard, endCard) {
  //IMPROVE vv
    // if ( startCard && !cardPool.includes(startCard) ) {
    //     throw new Error(`${startCard.cardname} not in cardpool`);
    // }
    // if ( endCard && !cardPool.includes(endCard) ) {
    //     throw new Error(`${endCard} not in cardpool`);
    // }

    let puzzle = new Puzzle({})

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

    while (puzzle.words.length < numOfCards) {
        const  shuffledCardPool = shuffledClone(cardPool).filter(e => !puzzle.words.some(p => p.cardname == e.cardname))
        let counter = 0
        let hasNotAddedACard = true
        while(counter > -1) {
            const lookingAt = shuffledCardPool[counter]
            counter++
            for (let i=0; i<lookingAt.startWords.length; i++) {
                if (prevWord.endWords.includes(lookingAt.startWords[i])) {
                    puzzle.addCard({
                        isFirstWord: false,
                        isLastWord: false,
                        topConnector: lookingAt.startWords[i],
                        cardname: ensureFrontFaceCardName(lookingAt.cardname),
                        bottomConnector: ""
                    })

                    prevWord = lookingAt
                    hasNotAddedACard = false
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
 * Checks if the most recently archived puzzle is up-to-date. If not, generates one and archives it.
 * @param {number} [numOfCards]
 * @param {MtgCard[]} [cardPool]
 */
export async function ensureCurrentDatePuzzleInStore(numOfCards = 7, cardPool = edhRecTop10k){
    const currentDate = getFormattedDate()
    const puzzleArchive = JSON.parse(
      await fs.readFile(
        new URL('./puzzleArchive.json', import.meta.url),
        'utf8'
      )
    );

    if (puzzleArchive.puzzles.at(-1)?.date === currentDate){ 
      console.log(`  Archive latest date: ${puzzleArchive.puzzles.at(-1).date}\n  Current date: ${currentDate}\nNo puzzle generated.`); 
      return;
    }

    const { length, words } = generatePuzzle(numOfCards, cardPool)
    const newPuzzle = { length, words, date: currentDate }
    puzzleArchive.puzzles.push(newPuzzle)
    puzzleArchive.length = puzzleArchive.puzzles.length
    archivePuzzle(puzzleArchive)
    savePuzzle(length, words)
}

// IMPROVE: Combine these with a setAsDailyPuzzle option maybe?
async function savePuzzle(length, words) {
  const data = JSON.stringify({ length, words }, null, 4)
  try {
    await fs.writeFile('./server/dailypuzzle.json', data, 'utf8')
    console.log('Puzzle saved successfully!')
  } catch (err) {
    console.error('Failed to save puzzle:', err)
  }
}

/**
 * Save the puzzle archive object to puzzleArchive.json asynchronously
 * @param {Object} puzzleArchive - The object to save
 */
async function archivePuzzle(puzzleArchive) {
  try {
    const data = JSON.stringify(puzzleArchive, null, 4)
    await fs.writeFile('./server/puzzleArchive.json', data, 'utf8')
    console.log('Puzzle archive saved successfully!')
    console.log('puzzle date:', puzzleArchive.puzzles.at(-1).date)
  } catch (err) {
    console.error('Failed to save puzzle archive:', err)
  }
}
