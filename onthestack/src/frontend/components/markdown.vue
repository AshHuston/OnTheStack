<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="markdown" v-html="html"></div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

const html = computed(() => marked.parse(props.content))
</script>
