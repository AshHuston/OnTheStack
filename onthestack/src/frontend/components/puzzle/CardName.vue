<script setup>
import { usePuzzleStore } from '@/stores/puzzle'
import HighlightedCardname from './HighlightedString.vue'

const puzzleStore = usePuzzleStore()
const props = defineProps({
  index: Number,
  cardData: Object,
  isSolved: Boolean
})

import { ref } from 'vue'

const text = ref('')

const {
        cardname,
        blankMap,
        isFirstWord,
        isLastWord,
        bottomConnector,
        topConnector
    } = props.cardData

</script>

<template>
  <HighlightedCardname 
    :text="isSolved ? cardname : blankMap"
    :start="topConnector"
    :end="bottomConnector"
  />
</template>
