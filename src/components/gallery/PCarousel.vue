<template>
  <v-card
    v-if="showEditor"
    flat
    class="fill-screen"
  >
    <p-gallery-editor
      :gallery-index="props.galleryIndex"
      :gallery-name="galleryName"
      @close="closeEditor"
    />
  </v-card>
  <v-card
    v-else
    flat
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
      class="mx-auto fill-height"
      :height="dimensions.height"
      :style="dimensions.width && `max-width: ${dimensions.width}px`"
    >
      <v-window-item
        v-for="image of props.galleryIndex"
        :key="image.filename"
        style="overflow:hidden"
        class="fill-height"
      >
        <v-row class="align-center fill-height" no-gutters>
          <v-col cols="1" class="text-right pa-1">
            <v-icon icon="mdi-chevron-left" @click="prev"/>
          </v-col>
          <v-col class="justify-center text-center pa-1">
            <div :style="`height:${MARGIN_Y}px;margin-top:-22px;`">
              <div style="visibility: hidden">
                <!-- Preload adjacent thumbnails -->
                <img width="1" height="1" :src="adjacentThumbnail( image, -1 )" alt =""/>
                <img width="1" height="1" :src="adjacentThumbnail( image, 1 )" alt=""/>
              </div>
            </div>
            <v-img eager contain :lazy-src="getImagePath( image, true )" :src="getImagePath( image, false )" :max-height="imgMaxHeight"/>
            <div :style="`height:${MARGIN_Y}px;margin-top:-16px;`" class="text-center pt-8">
              <div class="text-h6 mb-1">{{ image.title }}</div>
              <div class="text-body-2">{{ image.description }}</div>
            </div>
          </v-col>
          <v-col cols="1" class="text-left pa-1">
            <v-icon icon="mdi-chevron-right" @click="next"/>
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useDisplay } from "vuetify";
import PGalleryEditor from "../edit/PGalleryEditor.vue";
import useGallery from "../../composables/useGallery";
const { getImagePath } = useGallery();
const imgMaxHeight = ref( window.innerHeight - 400 );
const props = defineProps( {
    isEmbedded : Boolean,
    closable : Boolean,
    openTo : {
        type : Number,
        default : 0
    },
    galleryIndex : {
        type : Array,
        required : true
    },
    galleryName : {
        type : String,
        required : false
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
    },
    showText : {
        type : Boolean,
        default : true
    }
} );
defineEmits( [ "close" ] );
const isDev = import.meta.env.DEV;
const showEditor = ref( false );
const current = ref( props.openTo );
const MARGIN_Y = props.showText ? 150 : 0;
const adjacentThumbnail = ( image, d ) =>
{
    const c = props.galleryIndex.indexOf( image );
    let i = c + d;
    if( i < 0 ) i = props.galleryIndex.length - 1;
    if( i === props.galleryIndex.length ) i = 0;
    return getImagePath( props.galleryIndex[ i ], true );
}
const next = () => {
    current.value += 1;
    if( current.value === props.galleryIndex.length ) current.value = 0;
};
const prev = () =>
{
    current.value -= 1;
    if( current.value === -1 ) current.value = props.galleryIndex.length - 1;
};
const closeEditor = () =>
{
    showEditor.value = false;
};
const galleryName = computed( () => props.galleryIndex[ current.value ].gallery )
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