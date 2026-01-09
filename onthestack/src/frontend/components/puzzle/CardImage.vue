<script setup>
import '@awesome.me/webawesome/dist/components/card/card.js';
import { sanitizeString } from '@/helpers';
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  cardName: Object,
  isSolved: Boolean
})

async function setCardImageUrl(cardname) {
    const url = "https://api.scryfall.com/cards/named?fuzzy=" + sanitizeString(cardname)
    const response = await fetch(url);
    const data = await response.json();

    imageUrlBack.value = null
    twoSided.value = false
    
    if(data.card_faces){
        imageUrl.value = data.card_faces[0].image_uris.large
        imageUrlBack.value = data.card_faces[1].image_uris.large
        twoSided.value = true
    }
    else{ imageUrl.value = data.image_uris.normal }
}

function getImageSize(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      })
    }
    img.onerror = reject
    img.src = url
  })
}

const cardBackUrl = "https://m.media-amazon.com/images/I/61AGZ37D7eL.jpg"

const imageUrl = ref(null);
const imageUrlBack = ref(null);
const twoSided = ref(false);
const loading = ref(true);
const error = ref(false);
const isHovering = ref(false)
const hoveredImg = ref(null)

const mouseX = ref(0)
const mouseY = ref(0)

const onMouseMove = async (e) => {
    mouseX.value = e.clientX
    mouseY.value = e.clientY

    // IMPROVE: Extract this logic so we arent running it every frame.
    let idealImageWidth = null
    await getImageSize(hoveredImg.value.firstElementChild.src).then(size => {
        idealImageWidth = hoveredImg.value.firstElementChild.height * (size.width / size.height)
    })  

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    // IMPROVE Its still jittery... :(
    // Right edge
    if (mouseX.value+idealImageWidth > window.innerWidth-scrollbarWidth) {
        mouseX.value -= idealImageWidth
    }

    // IMPROVE Add logic for the bottom edge.
    // Bottom edge
    // if(mouseY.value > ...){
    //     mouseY.value -= idealRect.value.height
    // }
}

onMounted(async () => {
  try {
    setCardImageUrl(props.cardName)
  } catch (e) {
    error.value = true;
    console.log(e)
  } finally {
    loading.value = false;
  }
});

watch(
    () => props.cardName,
    (newVal) => {
        setCardImageUrl(newVal)
    }
);

function onImageError(){
    console.log('Failed image load')
}
</script>

<template>
    <div v-if="isSolved">
        <div v-if="loading">Loading image…</div>
        <div v-else-if="error">Failed to load image</div>
        <img 
            v-else 
            :src="imageUrl" 
            alt="Result image"
            class="card-image"
            @mouseenter="isHovering = true"
            @mouseleave="isHovering = false"
            @mousemove="onMouseMove"
            @error="onImageError"
        />
    </div>
    <div v-else>
        <img  
            :src="cardBackUrl" 
            alt="Result image"
            class="card-image"
            @error="onImageError"
        />
    </div>
    <div
        v-show="isHovering" 
        class="hover-container"
        ref="hoveredImg"
        :style="{
            left: mouseX + 'px',
            top: mouseY + 'px'
    }">
        <img  
            :src="imageUrl" 
            alt="Result image"
            class="hover-blowup"
            @error="onImageError"
        />
        <img  
            v-if="twoSided"
            :src="imageUrlBack" 
            alt="Result image"
            class="hover-blowup"
            @error="onImageError"
        />
    </div>
</template>

<style>
.card-image {
    height: 8rem;
}
.hover-container {
    position: fixed;
    pointer-events: none;
    z-index: 9999;
}
.hover-blowup {
    height: 18rem;
}
</style>