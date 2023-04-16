<template>
  <v-card max-width="900" class="mx-auto">
    <v-card-title class="d-flex">
      Pick an image
      <v-spacer/>
      <v-icon icon="mdi-close" @click="$emit( 'close' )"/>
    </v-card-title>
    <div class="d-flex flex-wrap">
      <v-img width="200" height="200" class="ma-2" style="cursor:pointer;" v-for="image of galleryIndex" :key="image.filename"
             :src="getImagePath( image, true )"
             @click="$emit( 'select', image )"/>

    </div>
  </v-card>
</template>

<script setup lang="ts">
import useGallery from "../../composables/useGallery";
import { computed } from "vue";

const { getImagePath, allGalleries } = useGallery();
defineEmits( [ "close", "select" ] );
const props = defineProps( {
    galleryId : {
        type : String,
        required : true
    }
} );
const galleryIndex = computed( () => allGalleries.value.get( props.galleryId ))

</script>

<style scoped>

</style>