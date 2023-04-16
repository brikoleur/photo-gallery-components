<template>
  <v-sheet class="d-flex flex-wrap pa-2" color="transparent">
    <v-card v-for="galleryInfo of galleryList" :key="galleryInfo.id" class="ma-2 pa-2">
      <PTitleImage :image-info="galleryInfo.titleImage" style="cursor:pointer"
                     @click="openGallery( galleryInfo )"/>
    </v-card>
  </v-sheet>
</template>

<script setup lang="ts">
import useGallery, { Gallery } from "@/composables/useGallery";
import PTitleImage from "@/components/gallery/PTitleImage.vue";
import { useRouter } from "vue-router";
const { galleryList } = useGallery();
const router = useRouter();
const openGallery = ( galleryInfo : Gallery ) =>
{
    router.push( {
        name : "gallery",
        query : { gallery : galleryInfo.id }
    } );
};
</script>

<style scoped>

</style>