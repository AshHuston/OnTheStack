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

const contentScale = ref(1)
const puzzleStore = usePuzzleStore()
const settingsStore = useSettingsStore()
const metaStore = useMetaStore()

const mobileNameStack = ref(null)
const currentlyGuessingCard = ref(null)
const nameCardRefs = ref([])

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

// May have to move this somewhere else. Probably cardguessfield
// const guessIsRealCard = async () => {
//     const url = "https://api.scryfall.com/cards/named?fuzzy=" + puzzleStore.guess
//     const response = await fetch(url);
//     return response.ok
// }

const solvedStates = computed(() => {
    return puzzleStore.puzzle.words.map((word, i, arr) => {
        const guessIsRight = () => { return sanitizeString(puzzleStore.guess) === sanitizeString(puzzleStore.puzzle.words[i].cardname) }
        const fullyHinted = () => { return puzzleStore.puzzle.words[i].cardname === puzzleStore.puzzle.words[i].blankMap }
        const prevSolved = i === 0 ? true : arr[i - 1].isSolved
        if (prevSolved && (guessIsRight() || fullyHinted()) ) { word.isSolved = true }
        return word.isSolved
    })
})

puzzleStore.isSolved = computed(() => {
    return !solvedStates.value.includes(false)
})

const currentlySolvingIndex = computed(() => {
    return solvedStates.value.findIndex(n => n == false)
})

function updatePuzzle() {
    if(puzzleStore.puzzle === null || puzzleStore.puzzle.value === null){ return }
    const lastSolvedWord = puzzleStore.puzzle.words[solvedStates.value.lastIndexOf(true)]
    metaStore.lastSolvedCard = lastSolvedWord
    const nextCard = puzzleStore.puzzle.words[solvedStates.value.lastIndexOf(true)+1]
    if ( !lastSolvedWord.isLastWord && settingsStore.highlight ) {
        puzzleStore.updateBlankMap(solvedStates.value.lastIndexOf(true)+1)
         puzzleStore.guess = nextCard.blankMap.slice(0, (nextCard.blankMap.indexOf('_') === -1 ? nextCard.blankMap.length : nextCard.blankMap.indexOf('_')))
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
            element.blankMap = element.blankMap.replace(/[a-z0-9]/gi, '_')
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

function setActiveRef(el, index) {
  nameCardRefs.value[index] = el
  if (index === currentlySolvingIndex.value) {
    currentlyGuessingCard.value = el
  }
}

function scrollToIndex(n) {
  try{
    const container = document.querySelector('.mobileNameStack')
    const targetEl = container.children[0].children[n]
    console.log(container)
    if (targetEl) {
      const top =
        targetEl.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        container.scrollTop -
        (1.1*parseFloat(getComputedStyle(document.documentElement).fontSize))
      container.scrollTo({ top: top, behavior: 'smooth' })
      console.log(top)
    }

  }catch(error){console.log('Scroll failed', error)}
}


watch(currentlySolvingIndex, (newIndex) => {
  currentlyGuessingCard.value = nameCardRefs.value[newIndex] || null
  if (newIndex > 0) scrollToIndex(newIndex)
})
</script>


<template>
    <div class="wa-stack wa-gap-m wa-align-items-center">
        <div
          class="wa-align-items-center"
          :class="{ 'wa-stack': metaStore.isOnMobile, 'wa-cluster': !metaStore.isOnMobile, }"
        >
            <div v-if="metaStore.isOnMobile" class="wa-cluster wa-gap-xs mobile hintButton">
                <button v-if="settingsStore.showGeneratePuzzleButton === true" @click="newPuzzle(7)">Generate Puzzle</button>
                <button type="button" @touchstart.prevent="giveHnt()">Hint</button>
            </div>
            <cardGuessField v-model:guess="puzzleStore.guess" :showCardSuggestions="settingsStore.autoComplete" />
            <div v-if="!metaStore.isOnMobile" class="wa-cluster">
                <button v-if="settingsStore.showGeneratePuzzleButton === true" @click="newPuzzle(7)">Generate Puzzle</button>
                <button @click="giveHnt()">Hint</button>
            </div>
        </div>

        <div v-if="!metaStore.isOnMobile" class="wa-stack card-name-stack">
            <div v-for="(cardData, index, key) in puzzleStore.puzzle.words" v-bind:key>
              <CardName
                  :index
                  :cardData
                  :isSolved="solvedStates[index]"
                  :class="{ 'card-name-card': index>0}"
                  :style="{'--contentScale': contentScale }"
              />
          </div>
        </div>
        <div v-else class="wa-stack card-name-stack mobile">
            <div class="card-stack">
                <CardImage
                    v-for="(cardData, index, key) in puzzleStore.puzzle.words.filter((_, index) => solvedStates[index])"
                    :key
                    :card-name="cardData.cardname"
                    is-solved="true"
                    class="stacked-card"
                    :index
                />
            </div>
            <div
              class="mobileNameStack"
              ref="mobileNameStack"
              :style="{'--totalCards': puzzleStore.puzzle.words.length}"
              >
              <div class="wa-stack wa-gap-l" style="height:2000px;">
              <br/>
              <CardName
                  v-for="(cardData, index, key) in puzzleStore.puzzle.words"
                  v-bind:key
                  :index
                  :cardData
                  :isSolved="solvedStates[index]"
                  :style="{'--contentScale': contentScale }"
                  :ref="el => setActiveRef(el, index)"
              />
          </div>
          hi
          </div>
        </div>
    </div>

    <!-- IMPROVE: Add score/time or some other kind of metric worth sharing. And add a share button too. -->
    <wa-dialog :open="puzzleStore.isSolved && doneLoading" label="Congratulations">
        You won!!! Come back in {{ metaStore.countdownToNextPuzzle }} for a new puzzle!
        <template v-slot:footer>
            <wa-button size="small" variant="brand" data-dialog="close">Close</wa-button>
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
    height: 10rem;
}
.stacked-card {
    position: absolute;
}

.card-name-card {
    margin-top: calc(-50px * var(--contentScale));
}

.mobileNameStack {
    height: calc(90px*var(--totalCards));
    overflow-y: auto;
    margin-top: -1.5rem;

    -webkit-mask-image: linear-gradient(
      to bottom,
      transparent,
      black 24px,
      black calc(100% - 24px),
      transparent
    );

    mask-image: linear-gradient(
      to bottom,
      transparent,
      black 24px,
      black calc(100% - 24px),
      transparent
    );
}
.mobileNameStack::-webkit-scrollbar { display: none; }
.page-padding{
    padding-bottom: 25rem;
}

.hintButton {
  user-select: none;
  touch-action: manipulation;
}

.hintButton.mobile {
    margin-top: -3rem;
    margin-left: auto;
}
</style>
