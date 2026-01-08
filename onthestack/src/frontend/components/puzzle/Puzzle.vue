<script setup>
import CardName from './CardName.vue'
import cardGuessField from './CardGuessField.vue'

const guess = ref('')
</script>


<template>
    <div style="border: 2px solid red">TEST PUZZLE COMPIENNT</div>
  <cardGuessField v-model:guess="guess" showCardSuggestions="false" />

  <CardName
        :cardData="{
            isFirstWord: false,
            isLastWord: false,
            topConnector: 'ger',
            cardname: 'geralf, visionary stitcher',
            bottomConnector: 'her',
            blankMap: '______, _________ ________',
            isSolved: false
            }"
        :isSolved="true"
    />
</template>

<style>
</style>
