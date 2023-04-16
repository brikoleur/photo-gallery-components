<template>
  <v-app>
    <v-main>
      <v-row no-gutters v-if="headerContent === 'header-images'">
        <v-col cols="3">
          <v-img cover :src="randomImages[ 0 ]" height="250" class="image-class"/>
        </v-col>
        <v-col cols="3">
          <v-img cover :src="randomImages[ 1 ]" height="250" class="image-class"/>
        </v-col>
        <v-col cols="3">
          <v-img cover :src="randomImages[ 2 ]" height="250" class="image-class"/>
        </v-col>
        <v-col cols="3">
          <v-img cover :src="randomImages[ 3 ]" height="250" class="image-class"/>
        </v-col>
        <div class="gallery-text"/>
      </v-row>
      <v-sheet v-else :max-width="1800" :height="250" cover class="mx-auto">
        <v-img cover :src="getImagePath( currentGallery?.titleImage, false )"/>
        <div class="gallery-text text-white mx-auto pa-4" style="max-width:1800px">
          <div class="text-h5">{{ currentGallery.name }}</div>
          <div class="text-body-1">{{ currentGallery.description }}</div>
          <div style="position:absolute;bottom:20px;right:20px">
            {{ currentGallery.size }} photos
          </div>
        </div>
      </v-sheet>
      <v-toolbar>
        <v-toolbar-items style="max-width:1800px" class="mx-auto text-left">
          <v-btn to="/">Home</v-btn>
          <v-btn to="/galleries">Albums</v-btn>
          <v-btn to="/editor" v-if="isDev">Editor</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import useDev from "@/composables/useDev"
import useGallery from "@/composables/useGallery";
import { computed, onBeforeMount, ref } from "vue";
const { loadAllImages, allImages, getImagePath, loadGalleries, currentGallery, galleryList } = useGallery();
const { isDev } = useDev();
const randomImages = ref( [] );
const route = useRoute();
const headerContent = computed( () =>
{

    console.log( "check header content", route.name )

    if( route.name === "gallery" )
    {
        return "gallery-image";
    }
    else
    {
        return "header-images";
    }
} );
const currentGalleryTitleImage = computed( () =>
{
    return getImagePath( currentGallery.value?.titleImage, false );
} );
onBeforeMount( async () =>
{
    await loadGalleries();
    await loadAllImages();
    const indices = [ Math.floor( Math.random() * allImages.value.length ) ];
    let idx = Math.random() * allImages.value.length;
    while( indices.length < 6 )
    {
        idx = Math.floor( Math.random() * allImages.value.length );
        if( !indices.includes( idx ) ) indices.push( idx );
    }
    randomImages.value = indices.map( i => getImagePath( allImages.value[ i ], false ) );
    console.log( "ITS", indices, randomImages.value )
} )
</script>

<style scoped>
.gallery-text {
       position: absolute;
       top: 150px;
       left: 0;
       right: 0;
       height: 100px;
       box-sizing:border-box;
       background: linear-gradient(0deg, rgba(0, 0, 0, 75%) 0%, rgba(0, 0, 0, 0) 100%);
   }
.image-class {
    /*filter:grayscale( 75% )*/
}

</style>
