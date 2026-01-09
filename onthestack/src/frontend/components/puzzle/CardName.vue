<!-- eslint-disable vue/no-mutating-props -->
<script setup>
import HighlightedCardname from './HighlightedString.vue'
import '@awesome.me/webawesome/dist/components/card/card.js';
import CardImage from './CardImage.vue';

const props = defineProps({
  index: Number,
  cardData: Object,
  isSolved: Boolean
})

</script>

<template>
  <div :class="{'wa-flank:end': index%2 == 1, 'wa-flank': index%2 == 0}">
    <CardImage v-if="index%2 == 0" :isSolved="isSolved" :card-name="props.cardData.cardname" />
    <wa-card>
      <HighlightedCardname 
        :text="isSolved ? props.cardData.cardname : props.cardData.blankMap"
        :start="props.cardData.topConnector"
        :end="props.cardData.bottomConnector"
      />
      
    </wa-card>
    <CardImage v-if="index%2 == 1" :isSolved="isSolved" :card-name="props.cardData.cardname" />
  </div>
</template>

<style>
wa-card {
  text-align: center;
  --spacing: var(--wa-space-s);
}
</style>