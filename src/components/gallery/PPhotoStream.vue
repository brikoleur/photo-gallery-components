<template>
  <v-card
      v-if="showCarousel"
      ref="carousel"
      :class="`fill-screen carousel ${carouselClass} fill-height justify-center py-8 px-8`"
  >

    <PCarousel
        :gallery-name="currentImage.gallery"
        :is-embedded="true"
        :open-to="galleryIndex.indexOf( currentImage )"
        closable
        @close="closeImage"
    />
  </v-card>
  <v-sheet
      v-else
      class="d-flex flex-wrap mx-auto"
      :max-width="props.maxWidth"
  >
    <v-img
        v-for="image of allImages"
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
import { computed, defineProps, onMounted, onUnmounted, ref } from "vue";
import PCarousel from "./PCarousel.vue";
import { useDisplay } from "vuetify";
import PGalleryEditor from "@/components/edit/PGalleryEditor.vue";
import useGallery from "@/composables/useGallery";

const { loadAllImages, allImages, getImagePath } = useGallery();
const props = defineProps( {
    maxWidth : {
        type : Number,
        default : 900
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
const galleryIndex = ref( [] );
const showCarousel = ref( false );
const currentImage = ref( undefined );
const carouselClass = ref( "o-0" );
const galleryName = ref( "" );
const openImage = image =>
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
onMounted( async () =>
{
    await loadAllImages();
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