<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { usePuzzleStore } from '../../../stores/puzzle.js'
import { useSettingsStore } from '../../../stores/settings.js'
import CardName from './CardName.vue'
import { sanitizeString } from '../../../helpers.js'
// import cardPool from '../../../../dist/cardPools/edhrecTop10k.json' with {type: 'json'}
// import dailyPuzzle from '../../../../dist/dailyPuzzle.json' with {type: 'json'}
import generatePuzzle from "../../../backend/generatePuzzle.js";
import '@awesome.me/webawesome/dist/components/input/input.js';
import cardGuessField from './CardGuessField.vue'
import fs from 'fs/promises'
import path from 'path'

// let jsonPath = path.resolve('./src/backend/cardPools/edhrecTop10k.json')
// let fileContents = await fs.readFile(jsonPath, 'utf8')
// const cardPool = JSON.parse(fileContents)
// jsonPath = path.resolve('./src/backend/dailyPuzzle.json')
// fileContents = await fs.readFile(jsonPath, 'utf8')
// const dailyPuzzle = JSON.parse(fileContents)

const response = await fetch('/backend/cardPools/edhrecTop10k.json')
if (!response.ok) {
  throw new Error('Failed to load edhrecTop10k.json')
}
const cardPool = await response.json()

const resp = await fetch('/backend/dailyPuzzle.json')
if (!response.ok) {
  throw new Error('Failed to load dailyPuzzle.json')
}
const dailyPuzzle = await resp.json()


const guess = ref('')
const contentScale = ref(1)
const puzzleStore = usePuzzleStore()
const settingsStore = useSettingsStore()

puzzleStore.initialize(dailyPuzzle)

const solvedStates = computed(() => {
  return puzzleStore.puzzle.words.map((word, i, arr) => {
    const guessIsRight = () => { return sanitizeString(guess.value) === sanitizeString(puzzleStore.puzzle.words[i].cardname) }
    const prevSolved = i === 0 ? true : arr[i - 1].isSolved
    if (prevSolved && guessIsRight() ) { word.isSolved = true }
    return word.isSolved
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

// async function findCardImage(cardname) {
//    const url = "https://api.scryfall.com/cards/named?fuzzy=" + sanitizeString(cardname)
//    const response = await fetch(url);
//    const data = await response.json();
//    cardImageSrc.value = data.image_uris.normal
// }


// From here down is just the WUBRG easter egg to generate puzzles.
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

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
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
                v-for="(cardData, index) in puzzleStore.puzzle.words"
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
