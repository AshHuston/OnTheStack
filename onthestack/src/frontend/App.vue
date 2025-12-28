<script setup>

import { usePuzzleStore } from '@/stores/puzzle'
import Puzzle from './components/puzzle/Puzzle.vue'


const puzzleStore = usePuzzleStore()


</script>

<template>
  <h1>Puzzle</h1>
  <div>
    <Puzzle/>
  </div>
</template>

<style scoped></style>
