<script setup>
import { usePuzzleStore } from '@/stores/puzzle'
import { testPuzzle } from '../../backend/tempPuzzleObj'

const puzzle = usePuzzleStore.initialize(testPuzzle)
console.log(puzzle)
</script>

<template>
  <div>{{ puzzle.puzzle }}</div>
</template>
