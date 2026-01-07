<script setup>
import { ref, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings';
import '@awesome.me/webawesome/dist/components/input/input.js';
import '@awesome.me/webawesome/dist/components/checkbox/checkbox.js';

const settingsStore = useSettingsStore()

const props = defineProps({
  guess: String,
  showCardSuggestions: {type: Boolean, default: false},
})

const potentialCardNames = ref([])
const isFocused = ref(false)

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

const onChangeAutocomplete = (event) => {
  settingsStore.autoComplete = event.target.checked
}
const onChangeHighlight = (event) => {
  settingsStore.highlight = event.target.checked
}

</script>

<template>
    <div class="container wa-stack">
        <div class="wa-cluster">
            <wa-checkbox 
                size="small" 
                :checked="settingsStore.autoComplete" 
                @change="onChangeAutocomplete"
            >Autocomplete</wa-checkbox>
            <wa-checkbox 
                size="small"
                :defaultChecked="settingsStore.highlight" 
                :checked="settingsStore.highlight" 
                @change="onChangeHighlight"
            >Highlight</wa-checkbox>
        </div>
        <wa-input
            :value="props.guess"
            @input="e => onInput(e.target.value)"
            @focus="isFocused = true"
            @blur="isFocused = false"
            type="text"
            placeholder="Type here..."
        />
        
        <!-- IMPROVE: This is not working right... I want to make it wait if thers already a call. TBD how to do that.  -->
        <ul v-if="showCardSuggestions && isFocused" class="list">
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
    list-style: none;       /* removes the bullets */
    padding: 0;             /* remove default padding */
    margin: 0,;              /* remove default margin */
    border: 3px solid #ddd; /* optional: add border */
    border-radius: 10px;     /* optional: rounded corners */
    position: absolute;   /* removes from layout */
    top: 100%;
    z-index: 9999;        /* above everything */ 
    background: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}





.autocomplete {
        /* directly below input */
  left: 0;
  width: 100%;
  
 
  border: 1px solid #ccc;
 
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