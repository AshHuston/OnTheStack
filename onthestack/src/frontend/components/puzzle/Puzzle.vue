<script setup>
import { onMounted, computed, watch } from 'vue'
import { usePuzzleStore } from '../../../stores/puzzle.js'
import { testPuzzle } from '../../../backend/tempPuzzleObj.js'
import CardName from './CardName.vue'
import { ref } from 'vue'
import { sanitizeString } from '../../../helpers.js'

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

updatePuzzle()

watch(solvedStates, (newValue, oldValue) => {
    if ( !newValue.every((value, index) => value === oldValue[index]) ) {
        updatePuzzle()
    }
})

function updatePuzzle() {
    const lastSolvedWord = puzzleStore.puzzle.words[solvedStates.value.lastIndexOf(true)]
    console.log(lastSolvedWord)
    if ( !lastSolvedWord.isLastWord ) { 
        guess.value = lastSolvedWord.bottomConnector
        puzzleStore.updateBlankMap(solvedStates.value.lastIndexOf(true)+1)
    }
}

</script>


<template>
  <CardName
    v-for="(cardData, index) in puzzleStore.puzzle.words"
    :index
    :cardData
    :isSolved="solvedStates[index]"
  />

  <input
    v-model="guess"
    type="text"
    placeholder="Type here..."
    />
</template>
