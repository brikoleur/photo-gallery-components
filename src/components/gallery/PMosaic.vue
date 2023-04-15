<template>
  <v-card
    v-if="showCarousel"
    ref="carousel"
    :class="`fill-screen carousel ${carouselClass} fill-height justify-center py-8 px-8`"
  >
    <v-icon
      color="grey"
      icon="mdi-close"
      class="float-right"
      @click="closeImage"
    />
    <v-responsive class="d-flex fill-height align-center">
      <PCarousel
        :gallery-name="galleryName"
        :is-embedded="true"
        :open-to="galleryIndex.indexOf( currentImage )"
        :lg-height="800"
      />
    </v-responsive>
  </v-card>
  <v-card
    v-else-if="showEditor"
    flat
    class="fill-screen"
  >
    <p-gallery-editor
      :gallery-index="galleryIndex"
      :gallery-name="galleryName"
      @close="closeEditor"
    />
  </v-card>
  <v-sheet
    v-else
    class="d-flex flex-wrap"
    :style="`maxWidth: ${props.maxWidth}`"
  >
    <v-btn
      v-if="isDev"
      type="fab"
      icon="mdi-pencil"
      style="position:absolute;z-index:1000;"
      class="ml-4 mt-4"
      @click="showEditor = true"
    />
    <v-img
      v-for="image of galleryIndex"
      :key="image.thumbnail"
      :src="image.thumbnail"
      :width="thumbnailWidth"
      style="cursor:pointer"
      @click="openImage( image )"
    />
  </v-sheet>
</template>

<script setup lang="ts">
import { loadGallery } from "../composables/useGallery";
import { computed, defineProps, onMounted, ref } from "vue";
import PCarousel from "./PCarousel.vue";
import { useDisplay } from "vuetify";
import PGalleryEditor from "./PGalleryEditor.vue";
const props = defineProps( {
    maxWidth : {
        type : Number,
        default : 1000
    },
    galleryName : {
        type : String,
        required : true
    }
} );
const galleryIndex = ref( [] );
const showCarousel = ref( false );
const showEditor = ref( false );
const currentImage = ref( undefined );
const carouselClass = ref( "o-0" );
const isDev = import.meta.env.DEV;
const closeEditor = () =>
{
    showEditor.value = false;
    loadGallery( props.galleryName ).then( data => galleryIndex.value = data );
};

const openImage = image =>
{
    currentImage.value = image;
    showCarousel.value = true;
    carouselClass.value = "o-1";
    document.body.classList.add( "p-photo-displayed" )
}
const thumbnailWidth = computed( () =>
{
    if( useDisplay().smAndDown.value )
    {
        return 150;
    }
    else
    {
        return 300;
    }
} );
const closeImage = () =>
{
    carouselClass.value = "o-0";
    document.body.classList.remove( "p-photo-displayed" )
    setTimeout( () => showCarousel.value = false, 200 );
}
onMounted( () =>
{
    loadGallery( props.galleryName ).then( gData => galleryIndex.value = gData );
} );

</script>

<style>
.o-0 {
    opacity: 0;
}
.o-1 {
    opacity: 1;
}
.carousel {
    transition: opacity 200ms;
}
.fill-screen {
    position:fixed !important;
    top:0;
    left:0;
    right:0;
    bottom:0;
    margin:0 !important;
    z-index:99999;
}
</style>