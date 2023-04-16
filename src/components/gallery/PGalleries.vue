<template>
  <v-sheet>
    <div class="d-flex flex-wrap pa-2">
      <PTitleImage v-for="galleryInfo of galleryList" :key="galleryInfo.id" :image-info="galleryInfo.titleImage" class="ma-2"
                     @click="openGallery( galleryInfo )"/>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import useGallery from "@/composables/useGallery";
import { onMounted } from "vue";
import PTitleImage from "@/components/gallery/PTitleImage.vue";
import { useRouter } from "vue-router";
const { loadGalleries, galleryList, currentGallery } = useGallery();
onMounted( () => loadGalleries() );
const router = useRouter();
const openGallery = ( galleryInfo : Object ) =>
{
    router.push( {
        name : "gallery",
        query : { gallery : galleryInfo.id }
    } );
};
</script>

<style scoped>

</style>