import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePuzzleStore = defineStore('puzzle', () => {
  const puzzle = ref(null)

  function initialize(puzzleInstance) { puzzle.value = puzzleInstance }

  function updateBlankMap(index, isEnd = false) {
    const replaceStart = (target, replacement) => replacement + target.slice(replacement.length)
    const replaceEnd = (target, replacement) => target.slice(0, target.length - replacement.length) + replacement
    const operation = isEnd ? replaceEnd : replaceStart
    const connector = isEnd ? puzzle.value.words[index].bottomConnector : puzzle.value.words[index].topConnector
    puzzle.value.words[index].blankMap = operation(puzzle.value.words[index].blankMap, connector)
  }

  return {
    puzzle,
    initialize,
    updateBlankMap
  }
})
