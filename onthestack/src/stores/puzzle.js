import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePuzzleStore = defineStore('puzzle', () => {
  const puzzle = ref(null)

  function initialize(puzzleInstance) {
    puzzle.value = puzzleInstance
  }

  return {
    puzzle,
    initialize,
  }
})
