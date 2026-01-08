<script setup>
import CardName from './CardName.vue'
import cardGuessField from './CardGuessField.vue'
import { ref } from 'vue'
import CardImage from './CardImage.vue';

const guess = ref('')
</script>


<template>
    <div style="border: 2px solid red">TEST PUZZLE COMPIENNT</div>
  <CardImage :isSolved="true" card-name="Time Walk" />
</template>

<style>
</style>
