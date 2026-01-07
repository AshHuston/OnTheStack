import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', () => {
    const autoComplete = ref(false)
    const highlight = ref(true)
    const showGeneratePuzzleButton = ref(false)

    return {
    autoComplete,
    highlight,
    showGeneratePuzzleButton
    }
})