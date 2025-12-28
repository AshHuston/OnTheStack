<script setup>
import { onMounted, computed, watch } from 'vue'
import { usePuzzleStore } from '../../../stores/puzzle.js'
import { testPuzzle } from '../../../backend/tempPuzzleObj.js'
import CardName from './CardName.vue'
import { ref } from 'vue'
import { sanitizeString } from '../../../helpers.js'
import { edhrecTopTwoTousand as cardPool } from "../../../edhrecTopTwoThousand.js";
import generatePuzzle from "../../../backend/generatePuzzle.js";

const guess = ref('')
const puzzleStore = usePuzzleStore()

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

updatePuzzle()

watch(solvedStates, (newValue, oldValue) => {
    if ( !newValue.every((value, index) => value === oldValue[index]) ) {
        updatePuzzle()
    }
})

function updatePuzzle() {
    const lastSolvedWord = puzzleStore.puzzle.words[solvedStates.value.lastIndexOf(true)]
    const nextCard = puzzleStore.puzzle.words[solvedStates.value.lastIndexOf(true)+1]
    if ( !lastSolvedWord.isLastWord ) { 
        puzzleStore.updateBlankMap(solvedStates.value.lastIndexOf(true)+1)
        guess.value = nextCard.blankMap.slice(0, (nextCard.blankMap.indexOf('_') === -1 ? nextCard.blankMap.length : nextCard.blankMap.indexOf('_')))
    }
}

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

</script>


<template>
    <div>
        <CardName
            v-for="(cardData, index) in puzzleStore.puzzle.words"
            :index
            :cardData
            :isSolved="solvedStates[index]"
        />
    </div>
    
    <br/><br/>
    
    <div>
        <input
            v-model="guess"
            type="text"
            placeholder="Type here..."
        />
        <br/><br/>
    </div>
    <div>
        <button @click="newPuzzle()">Generate Puzzle</button>
        <br/><br/>
    </div>
    <div>
        <button @click="giveHnt()">Hint</button>
        <br/><br/>
    </div>
    Puzzle solved: {{puzzleSolved}}
</template>
