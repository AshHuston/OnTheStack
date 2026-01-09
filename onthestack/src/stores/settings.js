import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', () => {
    const autoComplete = ref(false)
    const highlight = ref(false)
    const showGeneratePuzzleButton = ref(false)
    const showFirstLetter = ref(false)

    return {
        autoComplete,
        highlight,
        showGeneratePuzzleButton,
        showFirstLetter
    }
})