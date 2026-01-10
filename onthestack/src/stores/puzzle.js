import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePuzzleStore = defineStore('puzzle', () => {
  const puzzle = ref(null)
  const isSolved = ref(null)
  function initialize(puzzleInstance) { puzzle.value = puzzleInstance }

  function updateBlankMap(index, isEnd = false, hint = false) {
    const replaceStart = (target, replacement) => replacement + target.slice(replacement.length)
    const replaceEnd = (target, replacement) => target.slice(0, target.length - replacement.length) + replacement
    const operation = isEnd ? replaceEnd : replaceStart
    const connector = isEnd 
      ? puzzle.value.words[index].bottomConnector 
      : puzzle.value.words[index].topConnector

    const newChars = hint 
      ? isEnd
        ? puzzle.value.words[index].cardname.slice(puzzle.value.words[index].blankMap.lastIndexOf('_')) // This has not been tested lol.
        : puzzle.value.words[index].cardname.slice(0, puzzle.value.words[index].blankMap.indexOf('_')+1)
      : connector

    puzzle.value.words[index].blankMap = operation(puzzle.value.words[index].blankMap, newChars)
  }

  return {
    puzzle,
    isSolved,
    initialize,
    updateBlankMap
  }
})
