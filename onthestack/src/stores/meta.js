import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMetaStore = defineStore('meta', () => {
  const isOnMobile = ref(null)
  const countdownToNextPuzzle = ref('')

  const init = () => {
      const media = window.matchMedia('(max-width: 768px)');

      const update = () => {
        console.log("cahnegs screen size")
        isOnMobile.value = media.matches;
      };

      update(); // initial value
      media.addEventListener('change', update);
    };

  return { 
    isOnMobile,
    countdownToNextPuzzle,
    init 
  }
})
