<template>
  <v-card
      v-if="showCarousel"
      ref="carousel"
      :class="`fill-screen carousel ${carouselClass} fill-height align-center py-8 px-8`"
  >
    <v-row align="center" class="fill-height">
      <PCarousel
          :gallery-index="props.galleryIndex"
          :is-embedded="true"
          :open-to="props.galleryIndex.indexOf( currentImage )"
          closable
          class="fill-screen"
          @close="closeImage"
      />
    </v-row>
  </v-card>
  <v-card
      v-else-if="showEditor"
      flat
      class="fill-screen"
  >
    <p-gallery-editor
        :gallery-index="props.galleryIndex"
        :gallery-name="props.galleryName"
        @close="closeEditor"
    />
  </v-card>
  <v-sheet
      v-else
      class="d-flex flex-wrap mx-auto"
      color="transparent"
      :max-width="props.maxWidth"
  >
    <v-btn
        v-if="isDev && props.galleryName"
        type="fab"
        icon="mdi-pencil"
        style="position:absolute;z-index:1000;"
        class="ml-4 mt-4"
        @click="showEditor = true"
    />
    <v-img
        v-for="image of props.galleryIndex"
        :aspect-ratio="props.aspectRatio"
        :key="image.thumbnail"
        :src="getImagePath( image, true )"
        :width="thumbnailWidth"
        :max-height="thumbnailWidth * 1.5"
        :class="props.imageClass"
        :cover="props.cover"
        style="cursor:pointer"
        @click="openImage( image )"
    />
  </v-sheet>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import PCarousel from "./PCarousel.vue";
import { useDisplay } from "vuetify";
import PGalleryEditor from "../edit/PGalleryEditor.vue";
import useGallery from "../../composables/useGallery";
import type { GalleryImage } from "../../index.d";
const { getImagePath } = useGallery();
const props = defineProps( {
    maxWidth : {
        type : Number,
        default : 900
    },
    galleryIndex : {
        type : Array,
        required : true
    },
    galleryName : {
        type : String,
        required : false
    },
    imageClass : {
        type : String,
        default : ""
    },
    aspectRatio : {
        type : Number,
        required : false
    },
    thumbnailWidths : {
        type : Array,
        default : () => [ 300, 250, 200, 150 ]
    },
    cover : Boolean
} );
const showCarousel = ref( false );
const showEditor = ref( false );
const currentImage = ref();
const carouselClass = ref( "o-0" );
const isDev = import.meta.env.DEV;
const closeEditor = () =>
{
    showEditor.value = false;
};

const openImage = ( image: GalleryImage ) =>
{
    currentImage.value = image;
    showCarousel.value = true;
    carouselClass.value = "o-1";
    document.body.classList.add( "p-photo-displayed" )
}
const disp = useDisplay();
const thumbnailWidth = computed( () =>
{
    if( disp.xlAndUp.value ) return props.thumbnailWidths[ 0 ];
    if( disp.mdAndUp.value ) return props.thumbnailWidths[ 1 ];
    if( disp.smAndUp.value ) return props.thumbnailWidths[ 2 ];
    else return props.thumbnailWidths[ 3 ];
} );
const closeImage = () =>
{
    carouselClass.value = "o-0";
    document.body.classList.remove( "p-photo-displayed" )
    setTimeout( () => showCarousel.value = false, 200 );
}
const onKeyDown = ( evt : KeyboardEvent ) =>
{
    if( evt.key === "Escape" ) closeImage()
}
onMounted( () =>
{
    window.addEventListener( "keydown", onKeyDown );
} );
onUnmounted( () => window.removeEventListener( "keydown", onKeyDown ) )

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
    position: fixed !important;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0 !important;
    z-index: 99999;
}
</style>