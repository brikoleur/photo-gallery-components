<template>
  <v-sheet class="position-relative" color="transparent" :width="props.width" :height="props.height" :rounded="0">
    <v-img cover :src="imageSource" :max-height="props.height" :aspect-ratio="1"/>
    <v-btn type="fab" variant="outlined" v-if="props.editable" color="white" icon="mdi-file-image" @click="$emit( 'edit' )" @click.stop style="position:absolute;top:20px;right:20px;"/>
    <div class="gallery-text content-text text-white pa-4 pt-8">
      <div class="text-h6">{{ props.imageInfo.title }}</div>
      <div class="text-body-2">{{ props.imageInfo.description }}</div>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import useGallery from "../../composables/useGallery";
import type { GalleryImage } from "../../index.d";
import { computed, PropType } from "vue";
const props = defineProps( {
    imageInfo : {
        type : Object as PropType<GalleryImage>,
        required : true
    },
    editable : {
        type : Boolean,
        default : false
    },
    width : {
        type : Number,
        default : 300
    },
    height : {
        type : Number,
        default : 300
    }
} );
defineEmits( [ "edit" ] );
const { getImagePath } = useGallery();
const imageSource = computed( () => getImagePath( props.imageInfo, true ) );
</script>

<style scoped>
.gallery-text {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    box-sizing:border-box;
    background: linear-gradient(0deg, rgba(0, 0, 0, 75%) 0%, rgba(0, 0, 0, 0) 100%);
}
</style>