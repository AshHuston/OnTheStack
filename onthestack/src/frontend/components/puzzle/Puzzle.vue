<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { usePuzzleStore } from '../../../stores/puzzle.js'
import { useSettingsStore } from '../../../stores/settings.js'
import { useMetaStore } from '@/stores/meta.js'
import CardName from './CardName.vue'
import { sanitizeString } from '../../../helpers.js'
import '@awesome.me/webawesome/dist/components/dialog/dialog.js';
import '@awesome.me/webawesome/dist/components/input/input.js';
import cardGuessField from './CardGuessField.vue'
import CardImage from './CardImage.vue'

const dailyPuzzle = ref(null)
const doneLoading = ref(false)

const guess = ref('')
const contentScale = ref(1)
const puzzleStore = usePuzzleStore()
const settingsStore = useSettingsStore()
const metaStore = useMetaStore()

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

puzzleStore.isSolved = computed(() => {
    return !solvedStates.value.includes(false)
})

function updatePuzzle() {
    if(puzzleStore.puzzle === null || puzzleStore.puzzle.value === null){ return }
    const lastSolvedWord = puzzleStore.puzzle.words[solvedStates.value.lastIndexOf(true)]
    metaStore.lastSolvedCard = lastSolvedWord
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

watch(settingsStore, () => {
    puzzleStore.puzzle.words.forEach(element => {
        if (settingsStore.showFirstLetter === true){
            element.blankMap = element.cardname[0] + element.blankMap.slice(1)
        }
        else if (!element.isSolved){
            element.blankMap = '_' + element.blankMap.slice(1)
        }
    });
  updatePuzzle()
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
    doneLoading.value = true
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>


<template>
    <div class="wa-stack wa-gap-m wa-align-items-center">
        <div class="inputStuff wa-stack wa-align-items-center" :class="{ mobile: metaStore.isOnMobile}">
            <div v-if="metaStore.isOnMobile" class="wa-cluster wa-gap-xs mobile hintButton">
                <button v-if="settingsStore.showGeneratePuzzleButton === true" @click="newPuzzle(7)">Generate Puzzle</button>
                <button @click="giveHnt()">Hint</button>
            </div>
            <cardGuessField v-model:guess="guess" :showCardSuggestions="settingsStore.autoComplete" />
            <div v-if="!metaStore.isOnMobile" class="wa-cluster">
                <button v-if="settingsStore.showGeneratePuzzleButton === true" @click="newPuzzle(7)">Generate Puzzle</button>
                <button @click="giveHnt()">Hint</button>
            </div>
        </div>

        <div v-if="!metaStore.isOnMobile" class="wa-stack card-name-stack">
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
        <div v-else class="wa-stack card-name-stack mobile">
            <div class="card-stack">
                <!-- <CardImage
                    v-for="(cardData, index, key) in puzzleStore.puzzle.words.filter((_, index) => solvedStates[index])"
                    :key
                    :card-name="cardData.cardname"
                    is-solved="true"
                    class="stacked-card"
                /> -->
                <CardImage :card-name="metaStore.lastSolvedCard.cardname" is-solved="true" />
            </div>
            <CardName
                v-for="(cardData, index, key) in puzzleStore.puzzle.words"
                v-bind:key
                :index
                :cardData
                :isSolved="solvedStates[index]"
                
                :style="{'--contentScale': contentScale }"
            />
        </div>
    </div>

    <wa-dialog :open="puzzleStore.isSolved && doneLoading" label="Congratulations">
        You won!!! Come back in {{ metaStore.countdownToNextPuzzle }} for a new puzzle!
        <template v-slot:footer>
            <wa-button  variant="brand" data-dialog="close">Close</wa-button>
        </template>
    </wa-dialog>

    <div class="page-padding"></div>
</template>

<style>
.card-name-stack {
    width: 60%;
}
.card-name-stack.mobile {
    width: 90%;
}

.card-stack {
    position: relative;
    width: 200px;   /* card width */
}
.stacked-card {
    position: absolute;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.card-name-card {
    margin-top: calc(-50px * var(--contentScale));
}
.page-padding{
    padding-bottom: 25rem;
}

.inputStuff {
    margin-top: -4rem;
    /* margin-left: auto; */
}
.inputStuff.mobile {
    margin-top: 0;
    
}

.hintButton {

}
.hintButton.mobile {
    margin-top: -3rem;
    margin-left: auto;
}
</style>
