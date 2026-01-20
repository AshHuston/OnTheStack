<!-- eslint-disable vue/no-mutating-props -->
<script setup>
import { ref, nextTick } from 'vue'
import '@awesome.me/webawesome/dist/components/input/input.js';
import '@awesome.me/webawesome/dist/components/checkbox/checkbox.js';
import { usePuzzleStore } from '@/stores/puzzle';
import { useSettingsStore } from '@/stores/settings';
import { sanitizeString } from '../../../helpers.js'

const props = defineProps({
  cardname: String,
})

const potentialCardNames = ref([])
const isFocused = ref(false)
const puzzleStore = usePuzzleStore()
const settingsStore = useSettingsStore()
const isWrong = ref(false)

const wrongSound = new Audio('src/errSound.mp3')
wrongSound.preload = 'auto'
wrongSound.volume = 0.3

async function updateList() {
    const url = "https://api.scryfall.com/cards/autocomplete?q=" + puzzleStore.guess
    const response = await fetch(url);
    const data = await response.json();
    potentialCardNames.value = data.data
}

const guessIsRight = () => { return sanitizeString(puzzleStore.guess) === sanitizeString(props.cardname) }

async function runWrongAnswerFeedback() {
  isWrong.value = false        // reset so animation can re-trigger
  await nextTick()
  isWrong.value = true

  wrongSound.currentTime = 0
  wrongSound.play()

  setTimeout(() => {
    isWrong.value = false
  }, 1000)
}

async function onInput(text) {
    puzzleStore.guess = text
    if ( !guessIsRight() && await guessIsRealCard() ) { runWrongAnswerFeedback() }
    await updateList()
}

async function onClickResult(text) {
    await onInput(text)
}

const guessIsRealCard = async () => {
    const url = "https://api.scryfall.com/cards/named?exact=" + puzzleStore.guess.replace(' ', '+')
    const response = await fetch(url);

    if (!response.ok){ return false }

    const json = await response.json()
    const blacklist = [
      'fj25',
      'fjmp',
      'fj22'
    ]

    if ( blacklist.includes(json.set) ) { return false }

    return true
}
</script>

<template>
    <div class="container wa-stack">
        <wa-input
            :value="puzzleStore.guess"
            @input="e => onInput(e.target.value)"
            @focus="isFocused = true"
            @blur="isFocused = false"
            type="text"
            placeholder="Guess here..."
            class="inputBar"
            :class="{ 'is-wrong': isWrong }"
            with-clear
        />

        <!-- IMPROVE: This is not working right... I want to make it wait if theres already a call. TBD how to do that.  -->
        <ul v-if="settingsStore.autoComplete && isFocused" class="list">
            <li
                v-for="o in potentialCardNames"
                :key="o"
                @mousedown="onClickResult(o)"
                class="list-item"
            >
            {{ o }}
            </li>
        </ul>
    </div>
</template>

<style>
.container {
    text-align: center;
    position: relative; /* anchor for dropdown */
}

.list {
    display: inline-block;
    list-style: none;
    padding: 0;
    margin: 0,;
    border: 3px solid #ddd;
    border-radius: 10px;
    position: absolute;
    top: 100%;
    z-index: 9999;
    background: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.list-item {
    padding: 8px 12px;       /* spacing inside each item */
    cursor: pointer;          /* hand cursor */
    transition: background 0.2s;
}

.list-item:hover {
    background-color: #f0f0f0; /* hover effect */
}

.list-item + .list-item {
    border-top: 1px solid #eee; /* subtle line between items */
}

/* Shake animation */
@keyframes shake {
  0%   { transform: translateX(0); }
  20%  { transform: translateX(-4px); }
  40%  { transform: translateX(4px); }
  60%  { transform: translateX(-4px); }
  80%  { transform: translateX(4px); }
  100% { transform: translateX(0); }
}

.inputBar {
  outline: none;
}

.inputBar.is-wrong {
  outline: 5px solid red;
  outline-offset: 2px;
  border-radius: 6px;
  animation: shake 0.3s;
}
</style>
