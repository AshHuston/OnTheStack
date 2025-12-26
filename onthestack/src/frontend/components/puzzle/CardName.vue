<script setup>
import { usePuzzleStore } from '@/stores/puzzle'

const props = defineProps({
  index: number,
})

const puzzle = usePuzzleStore.puzzle
</script>

<template>
  <div>{{index}}</div>
</template>
