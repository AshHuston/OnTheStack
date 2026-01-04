<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { usePuzzleStore } from '../../../stores/puzzle.js'
import { testPuzzle } from '../../../backend/tempPuzzleObj.js'
import CardName from './CardName.vue'
import { sanitizeString } from '../../../helpers.js'
import { edhrecTopTwoTousand as cardPool } from "../../../edhrecTopTwoThousand.js";
import generatePuzzle from "../../../backend/generatePuzzle.js";
import '@awesome.me/webawesome/dist/components/input/input.js';
import cardGuessField from './CardGuessField.vue'

const guess = ref('')
const contentScale = ref(1)
const puzzleStore = usePuzzleStore()
const cardImageSrc = ref('https://m.media-amazon.com/images/I/61AGZ37D7eL.jpg')
let showCardSuggestions = true // Temporary flag. Probably will be controlled by a setting or difficulty.

puzzleStore.initialize(testPuzzle)


const solvedStates = computed(() => {
  return puzzleStore.puzzle.words.map((word, i, arr) => {
    const guessIsRight = () => { return sanitizeString(guess.value) === sanitizeString(puzzleStore.puzzle.words[i].cardname) }
    const prevSolved = i === 0 ? true : arr[i - 1].isSolved
    if (prevSolved && guessIsRight() ) { word.isSolved = true }
    return  word.isSolved
  })
})

const puzzleSolved = computed(() => {
    return !solvedStates.value.includes(false)
})

function updatePuzzle() {
    const lastSolvedWord = puzzleStore.puzzle.words[solvedStates.value.lastIndexOf(true)]
    const nextCard = puzzleStore.puzzle.words[solvedStates.value.lastIndexOf(true)+1]
    if ( !lastSolvedWord.isLastWord ) { 
        puzzleStore.updateBlankMap(solvedStates.value.lastIndexOf(true)+1)
        guess.value = nextCard.blankMap.slice(0, (nextCard.blankMap.indexOf('_') === -1 ? nextCard.blankMap.length : nextCard.blankMap.indexOf('_')))
    }
}

updatePuzzle()

watch(solvedStates, (newValue, oldValue) => {
    if ( !newValue.every((value, index) => value === oldValue[index]) ) {
        updatePuzzle()
    }
})

function newPuzzle(length = 5) {
  const puzzle = generatePuzzle(length, cardPool)
  console.log("PUZZLE", puzzle)
  puzzleStore.initialize(puzzle)
  puzzleStore.updateBlankMap(0)
  updatePuzzle()
}

function giveHnt() {
    puzzleStore.updateBlankMap(
        Math.min(solvedStates.value.lastIndexOf(true)+1, solvedStates.value.length-1),
        false,
        true
    )
    updatePuzzle()
}

async function findCardImage(cardname) {
   const url = "https://api.scryfall.com/cards/named?fuzzy=" + sanitizeString(cardname)
   const response = await fetch(url);
   const data = await response.json();
   cardImageSrc.value = data.image_uris.normal
}

</script>


<template>
    Solved: {{puzzleSolved}}<br/><br/>
    <div class="wa-stack wa-gap-0 wa-align-items-center">
        <div class="wa-stack card-name-stack">
            <CardName
                v-for="(cardData, index) in puzzleStore.puzzle.words"
                :index
                :cardData
                :isSolved="solvedStates[index]"
                :class="{ 'card-name-card': index>0}"
                :style="{'--contentScale': contentScale }"
            />
        </div>
        
        <br/><br/>
        
        <cardGuessField v-model:guess="guess" :showCardSuggestions />

        <div>
            <button @click="newPuzzle()">Generate Puzzle</button>
            <br/><br/>
        </div>
        <div>
            <button @click="giveHnt()">Hint</button>
            <br/><br/>
        </div>
    </div>
</template>

<style>
html, body {
    font-size: 18pt;
}
.card-name-stack {
    width: 50%;
}
.card-name-card {
    margin-top: calc(-50px * var(--contentScale));
}
</style>
