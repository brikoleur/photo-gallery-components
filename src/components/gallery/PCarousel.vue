<template>
  <div style="position:absolute;top:10px;left:10px;width:100px;height:100px;z-index:999">
    <img v-for="image of galleryIndex" :key="image.filename" :alt="image.title" :src="getImagePath( image, false )" height="100px"/>
  </div>
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
    class="fill-screen"
    v-resize="onResize"
  >
    <v-icon v-if="closable"
        color="grey"
        icon="mdi-close"
        style="position:absolute;top:20px;right:20px;z-index:999"
        @click="$emit( 'close' )"
    />

    <v-btn
      v-if="isDev && !props.isEmbedded"
      type="fab"
      icon="mdi-pencil"
      style="position:absolute;top:10px;left:20px;z-index:1000"
      @click="showEditor = true"
    />
    <v-window
      v-model="current"
      hide-delimiters
      continuous
      :height="dimensions.height"
      :style="dimensions.width && `margin-left:auto;margin-right:auto;max-width: ${dimensions.width}px`"
    >
      <v-window-item
        v-for="image of galleryIndex"
        :key="image.filename"
      >
        <v-card class="fill-height">
          <v-row class="align-center">
            <v-col cols="1" class="text-center">
              <v-icon icon="mdi-chevron-left" @click="prev"/>
            </v-col>
            <v-col>
              <v-sheet :height="MARGIN_Y">
              </v-sheet>
              <v-sheet>
              <v-img eager contain :lazy-src="getImagePath( image, false )" :src="getImagePath( image, false )" :max-height="imgMaxHeight"/>
              </v-sheet>
              <v-sheet :height="MARGIN_Y" class="text-center">
                <div class="text-h5 mt-4 mb-1">{{ image.title }}</div>
                <div class="text-body-2">{{ image.description }}</div>
              </v-sheet>
            </v-col>
            <v-col cols="1" class="text-center">
              <v-icon icon="mdi-chevron-right" @click="next"/>
            </v-col>
          </v-row>
        </v-card>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useDisplay } from "vuetify";
import PGalleryEditor from "@/components/edit/PGalleryEditor.vue";
import useGallery from "@/composables/useGallery";
const { loadGallery, getImagePath } = useGallery();
const imgMaxHeight = ref( window.innerHeight - 400 );
const props = defineProps( {
    isEmbedded : Boolean,
    closable : Boolean,
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
defineEmits( [ "close" ] );
const isDev = import.meta.env.DEV;
const galleryIndex = ref( [] );
const showEditor = ref( false );
const current = ref( props.openTo );
const MARGIN_Y = 150;
const next = () => {
    current.value += 1;
    if( current.value === galleryIndex.value.length ) current.value = 0;
};
const prev = () =>
{
    current.value -= 1;
    if( current.value === -1 ) current.value = galleryIndex.value.length - 1;
};
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
const onResize = () => {
    if( dimensions.value.height ) imgMaxHeight.value = dimensions.value.height - 2 * MARGIN_Y
    else imgMaxHeight.value = window.innerHeight - 2 * MARGIN_Y;
};

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