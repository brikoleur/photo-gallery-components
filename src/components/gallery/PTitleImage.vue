<template>
  <v-card class="gallery-title" :width="props.width" :height="props.height" :rounded="0">
    <v-img cover :src="imageSource" :max-height="props.height" :aspect-ratio="1"/>
    <v-btn type="fab" variant="outlined" v-if="props.editable" color="white" icon="mdi-file-image" @click="$emit( 'edit' )" @click.stop style="position:absolute;top:20px;right:20px;"/>
    <div class="gallery-text text-white pa-4 pt-8">
      <div class="text-h6">{{ props.imageInfo.title }}</div>
      <div class="text-body-2">{{ galleryIndex.length }} photos</div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import useGallery from "@/composables/useGallery";
import { computed, onMounted } from "vue";
const props = defineProps( {
    imageInfo : {
        type : Object,
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
const { getImagePath, loadGallery, galleryIndex } = useGallery();
const imageSource = computed( () => getImagePath( props.imageInfo, true ) );
onMounted( () => loadGallery( props.imageInfo.gallery ) )
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