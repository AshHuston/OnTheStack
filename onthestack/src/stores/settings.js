import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', () => {
    const autoComplete = ref(false)
    const showConnector = ref(false)
    const showGeneratePuzzleButton = ref(false)
    const showFirstLetter = ref(false)

    return {
        autoComplete,
        showConnector,
        showGeneratePuzzleButton,
        showFirstLetter
    }
})
