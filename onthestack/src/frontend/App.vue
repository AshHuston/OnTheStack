<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import Puzzle from './components/puzzle/Puzzle.vue'
import { useMetaStore } from '@/stores/meta';
import '@awesome.me/webawesome/dist/components/dialog/dialog.js';
import '@awesome.me/webawesome/dist/components/callout/callout.js';
import '@awesome.me/webawesome/dist/components/icon/icon.js';
import { usePuzzleStore } from '@/stores/puzzle';
import SettingsDialog from './components/settingsDialog.vue';
import Markdown from './components/markdown.vue';
import { getFormattedDate } from '@/helpers';
import PuzzleDate from './components/puzzle/PuzzleDate.vue';

const showInfo = ref(false)
const metaStore = useMetaStore()
const puzzleStore = usePuzzleStore()
const showSettings = ref(false)

const now = ref(new Date());
const tonight = new Date();
tonight.setHours(24, 1, 0, 0); // 12:01 AM tonight
let timer;

onMounted(() => {
  document.title = 'On The Stack'
  metaStore.init()

  timer = setInterval(() => {
    if(puzzleStore.isSolved){now.value = new Date()};
  }, 1000);
})

onUnmounted(() => {
  clearInterval(timer);
});

metaStore.countdownToNextPuzzle = computed(() => {
  const diff = tonight - now.value;

  if (diff <= 0) return '00:00:00';

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:` +
         `${minutes.toString().padStart(2, '0')}:` +
         `${seconds.toString().padStart(2, '0')}`;
});

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

const infoText = `${metaStore.isOnMobile? (getFormattedDate()+'\n\n') : ''}Welcome to OnTheStack! A daily puzzle game that tests your knowledge of Magic: the Gathering cards.\n\nA puzzle is comprised of 7 cards from the given card pool(currently the top 10k edhrec cards). Their names chain together so the end of one card is a hint for the beginning of the next one.\n\nCheck out the settings to find the gamemode that best suits you.\n\n\nGood luck!\n\n-The Dev`
const wipText = "On The Stack is still a work-in-progress. If you know how to reach me, feedback is very welcome!\n\nThank you for being patient as I improve it!\n\n-The Dev"
</script>

<template :class="{ mobile: metaStore.isOnMobile }">
  <div class="wa-cluster wa-align-items-start wa-gap-0">
    <img 
      src="../OnTheStack.png"
      class="logo"
      :class="{ mobile: metaStore.isOnMobile }"
      >

    <div class="wa-gap-0" :class="{'wa-stack': !metaStore.isOnMobile, 'wa-cluster': metaStore.isOnMobile}">
      <wa-icon 
        name="circle-info" 
        label="Info"
        variant="brand" 
        class="info-button"
        :class="{ mobile: metaStore.isOnMobile }"
        @click="onClick"
      ></wa-icon>

      <wa-icon 
        name="gear" 
        label="Info"
        variant="brand" 
        class="info-button"
        :class="{ mobile: metaStore.isOnMobile }"
        @click="showSettings = !showSettings"
      ></wa-icon>
    </div>

  </div>

  <SettingsDialog :open="showSettings" />

  <wa-dialog 
    :open="showInfo" 
    label="How to play:"
    @wa-after-hide="onClose"
    light-dismiss
  >
    <Markdown :content="infoText"/>
    <template v-slot:footer>
        <wa-button  variant="brand" data-dialog="close">Close</wa-button>
    </template>
  </wa-dialog>

    <wa-dialog 
      open="true" 
      label="Work in Progress"
      light-dismiss
    >
    <Markdown :content="wipText" />
    <template v-slot:footer>
        <wa-button  variant="brand" data-dialog="close">Close</wa-button>
    </template>
  </wa-dialog>

  <PuzzleDate v-if="!metaStore.isOnMobile" class="dateline"/>
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
  font-size: 1.2rem;
  color: var(--wa-color-brand-on-normal);
  margin: 0.25rem 0;
  cursor: pointer;
}
.info-button.mobile {
  font-size: 1.75rem;
  /* margin-top: 1.5rem; */
}

.logo {
  width: 5rem; 
  margin: .5rem;
}
.logo.mobile {
  width: 3rem; 
  margin: .5rem;
}

.dateline {
  text-align: center;
  margin: -3rem 0 1rem 0;
}
.logo.mobile {
  
}
</style>
