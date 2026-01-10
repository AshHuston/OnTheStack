import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMetaStore = defineStore('meta', () => {
  const isOnMobile = ref(null)

  return { isOnMobile }
})
