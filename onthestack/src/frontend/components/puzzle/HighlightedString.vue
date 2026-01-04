<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: String,
  start: String,
  end: String,
})

const parts = computed(() => {
  const startIndex = props.text.indexOf(props.start)
  if (startIndex === -1) {
    return [{ text: props.text, part: null }]
  }

  const from = startIndex + props.start.length
  const endIndex = props.end === "" ? props.text.length : props.text.indexOf(props.end, from)

  return [
    { text: props.text.slice(0, from), part: 'start' },
    { text: props.text.slice(from, endIndex), part: 'middle' },
    { text: props.text.slice(endIndex), part: 'end' },
  ]
})
</script>

<template>
  
    <template v-for="(part, i) in parts" :key="i">
      <span :class="part.part">
        {{ part.text }}
      </span>
    </template>
  
</template>

<style scoped>
.start {
  background-color: cyan;
}

.end {
  background-color: rgb(4, 179, 179);
}
</style>
