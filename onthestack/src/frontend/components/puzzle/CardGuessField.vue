<script setup>
import { ref, watch } from 'vue'
import '@awesome.me/webawesome/dist/components/input/input.js';

const props = defineProps({
  guess: String,
  showCardSuggestions: {type: Boolean, default: false},
})

const potentialCardNames = ref([])

async function updateList() {
    const url = "https://api.scryfall.com/cards/autocomplete?q=" + props.guess
    const response = await fetch(url);
    const data = await response.json();
    potentialCardNames.value = data.data
}

const emit = defineEmits(['update:guess'])
async function onInput(text) {
    emit('update:guess', props.guess = text)
    await updateList()
}

async function onClickResult(text) {
    emit('update:guess', props.guess = text); 
    await updateList()
}
</script>

<template>
    <div class="container">
        <wa-input
            :value="props.guess"
            @input="e => onInput(e.target.value)"
            type="text"
            placeholder="Type here..."
            class="inputBox"
        />

        <!-- IMPROVE: This is not working right... I want to make it wait if thers already a call. TBD how to do that.  -->
        <ul v-if="showCardSuggestions" class="list">
            <li 
                v-for="o in potentialCardNames" 
                :key="o" 
                @click="onClickResult(o)"
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
}

.inputBox {
    display: inline-block;
    width: 75%;
}

.list {
    display: inline-block;
    list-style: none;       /* removes the bullets */
    padding: 0;             /* remove default padding */
    margin: 0,;              /* remove default margin */
    border: 3px solid #ddd; /* optional: add border */
    border-radius: 10px;     /* optional: rounded corners */
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
</style>