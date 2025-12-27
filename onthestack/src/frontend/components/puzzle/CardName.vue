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

</script>

<template>
  <HighlightedCardname 
    :text="isSolved ? props.cardData.cardname : props.cardData.blankMap"
    :start="props.cardData.topConnector"
    :end="props.cardData.bottomConnector"
  />
</template>
