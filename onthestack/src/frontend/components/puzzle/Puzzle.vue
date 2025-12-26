<script setup>
import { onMounted, computed } from 'vue'
import { usePuzzleStore } from '../../../stores/puzzle.js'
import { testPuzzle } from '../../../backend/tempPuzzleObj.js'
import CardName from './CardName.vue'
import { ref } from 'vue'

const guess = ref('')
const puzzleStore = usePuzzleStore()


//onMounted(() => {
  puzzleStore.initialize(testPuzzle)
  console.log("TEST", puzzleStore.puzzle)
//})

const solvedStates = computed(() => {
  return puzzleStore.puzzle.words.map((word, i, arr) => {
    const prevSolved = i === 0 ? true : arr[i - 1].isSolved
    if (prevSolved && guess.value.toLowerCase() == puzzleStore.puzzle.words[i].cardname.toLowerCase()) { word.isSolved = true }
    return  word.isSolved
  })
})

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
/>{{guess}}
</template>
