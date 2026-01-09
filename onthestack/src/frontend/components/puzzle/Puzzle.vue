<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { usePuzzleStore } from '../../../stores/puzzle.js'
import { useSettingsStore } from '../../../stores/settings.js'
import CardName from './CardName.vue'
import { sanitizeString } from '../../../helpers.js'

import '@awesome.me/webawesome/dist/components/input/input.js';
import cardGuessField from './CardGuessField.vue'

const dailyPuzzle = ref(null)


const guess = ref('')
const contentScale = ref(1)
const puzzleStore = usePuzzleStore()
const settingsStore = useSettingsStore()

puzzleStore.initialize({
  length: null,
  words: [{
      isFirstWord: true,
      isLastWord: false,
      topConnector: '',
      cardname: 'Cryptic Command',
      bottomConnector: 'and',
      blankMap: '______, ______ ______',
      isSolved: true
    },],
})

const solvedStates = computed(() => {
    return puzzleStore.puzzle.words.map((word, i, arr) => {
        const guessIsRight = () => { return sanitizeString(guess.value) === sanitizeString(puzzleStore.puzzle.words[i].cardname) }
        const prevSolved = i === 0 ? true : arr[i - 1].isSolved
        if (prevSolved && guessIsRight() ) { word.isSolved = true }
        return word.isSolved
    })
})

// const puzzleSolved = computed(() => {
//     return !solvedStates.value.includes(false)
// })

function updatePuzzle() {
    if(puzzleStore.puzzle === null || puzzleStore.puzzle.value === null){ return }
    const lastSolvedWord = puzzleStore.puzzle.words[solvedStates.value.lastIndexOf(true)]
    const nextCard = puzzleStore.puzzle.words[solvedStates.value.lastIndexOf(true)+1]
    if ( !lastSolvedWord.isLastWord ) { 
        puzzleStore.updateBlankMap(solvedStates.value.lastIndexOf(true)+1)
        guess.value = nextCard.blankMap.slice(0, (nextCard.blankMap.indexOf('_') === -1 ? nextCard.blankMap.length : nextCard.blankMap.indexOf('_')))
    }
}

watch(solvedStates, (newValue, oldValue) => {
    if ( !newValue.every((value, index) => value === oldValue[index]) ) {
        updatePuzzle()
    }
})

async function newPuzzle() {
    const res = await fetch('/api/generate-puzzle');
    const puzzle = await res.json();
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

const sequence = ['w', 'u', 'b', 'r', 'g']
let index = 0

const onKeyDown = (e) => {
    if (e.repeat) return
    const key = e.key.toLowerCase()
    console.log(index)
    if (key === sequence[index]) {
    index++
    if (index === sequence.length) {
        settingsStore.showGeneratePuzzleButton = true
        index = 0
    }
    } else {
    index = 0
    }
}

onMounted(async () => {
    window.addEventListener('keydown', onKeyDown);

    const response = await fetch('/api/get-daily-puzzle')
    if (!response.ok) {
        throw new Error('Failed to load dailyPuzzle.json')
    }
    dailyPuzzle.value = await response.json()
    puzzleStore.initialize(dailyPuzzle.value)
    updatePuzzle()
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>


<template>
    <div class="wa-stack wa-gap-m wa-align-items-center">
        <div class="wa-cluster" style="margin-top: -4rem;">
            <button v-if="settingsStore.showGeneratePuzzleButton === true" @click="newPuzzle(7)">Generate Puzzle</button>
            <button @click="giveHnt()">Hint</button>
        </div>

        <cardGuessField v-model:guess="guess" :showCardSuggestions="settingsStore.autoComplete" />

        <div class="wa-stack card-name-stack">
            <CardName
                v-for="(cardData, index, key) in puzzleStore.puzzle.words"
                v-bind:key
                :index
                :cardData
                :isSolved="solvedStates[index]"
                :class="{ 'card-name-card': index>0}"
                :style="{'--contentScale': contentScale }"
            />
        </div>
    </div>
</template>

<style>
.card-name-stack {
    width: 50%;
}
.card-name-card {
    margin-top: calc(-50px * var(--contentScale));
}
</style>
