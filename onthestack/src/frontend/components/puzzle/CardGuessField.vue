<!-- eslint-disable vue/no-mutating-props -->
<script setup>
import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settings';
import '@awesome.me/webawesome/dist/components/input/input.js';
import '@awesome.me/webawesome/dist/components/checkbox/checkbox.js';
import { useMetaStore } from '@/stores/meta';

const settingsStore = useSettingsStore()
const metaStore = useMetaStore()

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
const onChangeShowFirstLetter = (event) => {
  settingsStore.showFirstLetter = event.target.checked
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
            <wa-checkbox 
                size="small"
                :defaultChecked="settingsStore.showFirstLetter" 
                :checked="settingsStore.showFirstLetter" 
                @change="onChangeShowFirstLetter"
            >First Letter</wa-checkbox>
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
</style>