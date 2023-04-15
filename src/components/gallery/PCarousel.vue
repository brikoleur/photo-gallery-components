<template>
  <v-card
    v-if="showEditor"
    flat
    class="fill-screen"
  >
    <p-gallery-editor
      :gallery-index="galleryIndex"
      :gallery-name="galleryName"
      @close="closeEditor"
    />
  </v-card>
  <v-card
    v-else
    flat
  >
    <v-btn
      v-if="isDev && !props.isEmbedded"
      type="fab"
      icon="mdi-pencil"
      style="position:absolute;top:10px;left:20px;z-index:1000"
      @click="showEditor = true"
    />
    <v-carousel
      v-model="current"
      hide-delimiters
      continuous
      :height="dimensions.height"
      :style="dimensions.width && `margin-left:auto;margin-right:auto;max-width: ${dimensions.width}px`"
    >
      <v-carousel-item
        v-for="image of galleryIndex"
        :key="image.filename"
        :src="image.filename"
      />
    </v-carousel>
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useDisplay } from "vuetify";
import { loadGallery } from "../composables/useGallery";
import PGalleryEditor from "./PGalleryEditor.vue";
const props = defineProps( {
    isEmbedded : Boolean,
    openTo : {
        type : Number,
        default : 0
    },
    galleryName : {
        type : String,
        required : true
    },
    lgHeight : {
        type : Number,
        required : false
    },
    lgWidth : {
        type : Number,
        required : false
    },
    smHeight : {
        type : Number,
        required : false
    },
    smWidth : {
        type : Number,
        required : false
    }
} );
const isDev = import.meta.env.DEV;
const galleryIndex = ref( [] );
const showEditor = ref( false );
const closeEditor = () =>
{
    showEditor.value = false;
    loadGallery( props.galleryName ).then( data => galleryIndex.value = data );
};

const dimensions = computed( () =>
{
    const dims = {};
    if( useDisplay().smAndDown.value )
    {
        if( props.smHeight ) dims.height = props.smHeight;
        if( props.smWidth ) dims.width = props.smWidth;
    }
    else
    {
        if( props.lgHeight ) dims.height = props.lgHeight;
        if( props.lgWidth ) dims.width = props.lgWidth;
    }
    return dims;
} );
const current = ref( props.openTo );
onMounted( () =>
{
    loadGallery( props.galleryName ).then( data => galleryIndex.value = data );
} );
</script>

<style scoped>
 .fill-screen {
     position:fixed;
     top:0;
     left:0;
     right:0;
     bottom:0;
     z-index:99999;
 }
</style>