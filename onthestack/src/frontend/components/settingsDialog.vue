<script setup>
import '@awesome.me/webawesome/dist/components/dialog/dialog.js';
import '@awesome.me/webawesome/dist/components/checkbox/checkbox.js';
import { useSettingsStore } from '@/stores/settings';

const props = defineProps({
  open: Boolean,
})

const settingsStore = useSettingsStore()

const onChangeAutocomplete = (event) => {
  settingsStore.autoComplete = event.target.checked
}
const onChangeShowConnector = (event) => {
  settingsStore.showConnector = event.target.checked
}
const onChangeShowFirstLetter = (event) => {
  settingsStore.showFirstLetter = event.target.checked
}
</script>

<template>
    <wa-dialog
        :open="props.open"
        label="Settings"
    >
        <div class="wa-cluster">
            <wa-checkbox
                size="small"
                :checked="settingsStore.autoComplete"
                @change="onChangeAutocomplete"
            >Autocomplete</wa-checkbox>
            <wa-checkbox
                size="small"
                :defaultChecked="settingsStore.showConnector"
                :checked="settingsStore.showConnector"
                @change="onChangeShowConnector"
            >Show Connectors</wa-checkbox>
            <wa-checkbox
                size="small"
                :defaultChecked="settingsStore.showFirstLetter"
                :checked="settingsStore.showFirstLetter"
                @change="onChangeShowFirstLetter"
            >First Letter</wa-checkbox>
        </div>
        <template v-slot:footer>
            <wa-button  variant="brand" data-dialog="close">Close</wa-button>
        </template>
    </wa-dialog>
</template>

<style>

</style>
