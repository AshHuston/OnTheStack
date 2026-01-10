<script setup>
import { ref, onMounted, watch } from 'vue';
import Puzzle from './components/puzzle/Puzzle.vue'
import { useMetaStore } from '@/stores/meta';
import '@awesome.me/webawesome/dist/components/dialog/dialog.js';
import { getFormattedDate, getFormattedTimeStamp } from '@/helpers';

const showInfo = ref(false)
const metaStore = useMetaStore()

//document.otsIcon.classList.toggle('mobile', metaStore.isMobile);

onMounted(() => {
  document.title = 'On The Stack'
  metaStore.init()
})

watch(
  () => metaStore.isOnMobile,
  (isMobile) => {
    document.body.classList.toggle('mobile', isMobile);
    document.documentElement.classList.toggle('mobile', isMobile);
  },
  { immediate: true }
);

const onClick = () => {
  showInfo.value = true
}
const onClose = () => {
  showInfo.value = false
}

const infoText = "Welcome to OnTheStack! A daily puzzle is comprised of 7 cards from the EDHrec top 10,000 cards. Their names chain together so the end of one card is a hint for the beginning of the next one.\n\nThe checkboxes are settings that may make your game a bit easier.\n\n\nGood luck!\n-The Dev"
const wipText = "On The Stack is a work-in-progress. Thank you for being patient as I improve it!   -The Dev"


const now = new Date();
const numOfHours = 13.5
const hoursFromNow = `${getFormattedDate(new Date(now.getTime() + numOfHours*(60 * 60 * 1000)))} ----- ${getFormattedTimeStamp(new Date(now.getTime() + numOfHours*(60 * 60 * 1000)))}`

</script>

<template :class="{ mobile: metaStore.isOnMobile }">
  {{  hoursFromNow }}
  <div class="wa-cluster wa-align-items-start wa-gap-0">
    <img 
      src="../OnTheStack.png"
      class="logo"
      :class="{ mobile: metaStore.isOnMobile }"
      >

    <wa-button 
      variant="brand" 
      appearance="outlined"
      pill
      size="small"
      class="info-button"
      :class="{ mobile: metaStore.isOnMobile }"
      @click="onClick"
    >
      <wa-icon name="info" label="Info"></wa-icon>
    </wa-button>
  </div>
  <wa-dialog 
    :open="showInfo" 
    label="How to play:"
    @wa-after-hide="onClose"
  >
    {{ infoText }}
    <template v-slot:footer>
        <wa-button  variant="brand" data-dialog="close">Close</wa-button>
    </template>
  </wa-dialog>

  <!-- IMPROVE: Make this a callout or something less intrusive -->
    <wa-dialog 
    open="true" 
    label="Work in Progress"
  >
    {{ wipText }}
    <template v-slot:footer>
        <wa-button  variant="brand" data-dialog="close">Close</wa-button>
    </template>
  </wa-dialog>

  <Puzzle/>
</template>

<style>
html, body {
  font-size: 14pt;
}
body.mobile,
html.mobile {
  font-size: 12pt;
}

.info-button {
  font-size: 0.3rem;
  margin-top: .5rem;
}
.info-button.mobile {
  font-size: 0.5rem;
  margin-top: .5rem;
}

.logo {
  width: 5rem; 
  margin: .5rem;
}
.logo.mobile {
  width: 3rem; 
  margin: .5rem;
}
</style>
