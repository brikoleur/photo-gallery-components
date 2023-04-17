<template>
  <v-app>
    <v-main class="p-background">
      <v-sheet v-if="currentGallery" :max-width="1800" :height="275" class="mx-auto" color="transparent">
        <v-img cover :src="getImagePath( currentGallery.titleImage, false )" class="album-title-image"/>
        <div class="gallery-text text-white mx-auto pa-4 pt-6 pl-8" style="max-width:1800px">
          <div class="text-h6">{{ currentGallery.title }}</div>
          <div class="text-body-2">{{ currentGallery.description }}</div>
          <div style="position:absolute;bottom:20px;right:20px">
            {{ currentGallery.size }} photos
          </div>
        </div>
      </v-sheet>
      <v-row no-gutters v-else>
        <v-col cols="3">
          <v-img cover :src="randomImages[ 0 ]" height="275" class="image-class"/>
        </v-col>
        <v-col cols="3">
          <v-img cover :src="randomImages[ 1 ]" height="275" class="image-class"/>
        </v-col>
        <v-col cols="3">
          <v-img cover :src="randomImages[ 2 ]" height="275" class="image-class"/>
        </v-col>
        <v-col cols="3">
          <v-img cover :src="randomImages[ 3 ]" height="275" class="image-class"/>
        </v-col>
        <div class="gallery-text">
          <div class="text-white mx-auto" style="position:relative;height:100px;max-width:1800px;">
            <div>
              <v-avatar image="assets/profile.jpeg" :size="80" class="float-left ma-2"/>
              <div class="pt-8">
                <div class="text-h6">{{ aboutInfo?.name }}</div>
                <div class="text-body-2">{{ aboutInfo?.about }}</div>
              </div>
            </div>
            <div style="position:absolute;bottom:20px;right:20px">
              <span v-if="route.name === 'galleries'">
                {{ allGalleries.size }} albums
              </span>
              <span v-else>
                {{ allImages.length }} photos
              </span>
            </div>
          </div>
        </div>
      </v-row>
      <v-card :rounded="0" color="white">
        <v-toolbar v-if="route.name !== 'gallery'" class="mx-auto" style="max-width: 1800px" color="white" :height="40">
          <v-toolbar-items>
            <v-btn to="/">Photostream</v-btn>
            <v-btn to="/galleries">Albums</v-btn>
            <v-btn to="/editor" v-if="isDev">Editor</v-btn>
          </v-toolbar-items>
          <v-spacer/>
          <div style="padding-top:6px;margin-right:8px;">
            <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">
              <img alt="This work is licensed under a Creative Commons Attribution 4.0 International License"
                   style="border-width:0"
                   src="https://i.creativecommons.org/l/by/4.0/88x31.png"/></a>
          </div>
        </v-toolbar>
        <v-toolbar v-else class="mx-auto" style="max-width: 1800px" color="white" :height="40">
          <v-toolbar-items>
            <v-btn to="/galleries">
              <v-icon icon="mdi-arrow-left" class="mr-1"/>
              Back to Albums
            </v-btn>
          </v-toolbar-items>
          <v-spacer/>
          <div style="padding-top:6px;margin-right:8px;">
            <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">
              <img alt="This work is licensed under a Creative Commons Attribution 4.0 International License"
                   style="border-width:0"
                   src="https://i.creativecommons.org/l/by/4.0/88x31.png"/></a>
          </div>
        </v-toolbar>
      </v-card>
      <RouterView/>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { RouterView, useRouter, useRoute } from 'vue-router';
import useDev from "./composables/useDev";
import useGallery from "./composables/useGallery";
import { computed, onBeforeMount, ref } from "vue";
import { provide } from "vue";
import type { Gallery } from "@/index.d"; // How to use this directly from the photo-gallery-components module?
provide( "router", useRouter() );
const { initialize, allImages, allGalleries, getImagePath, galleryList } = useGallery();
const { isDev } = useDev();
const randomImages = ref<string[]>( [] );
const route = useRoute();
const aboutInfo = ref();
const currentGallery = computed( () =>
{
    const route = useRoute();
    if( route.name === "gallery" )
    {
        return galleryList.value.find( ( entity : Gallery ) => entity.id === route.query.gallery );
    }
    else
    {
        return undefined;
    }
} );
onBeforeMount( async() =>
{
    const resp = await fetch( '/about.json' );
    aboutInfo.value = await resp.json();
    await initialize( false );
    const indices = [ Math.floor( Math.random() * allImages.value.length ) ];
    while( indices.length < 6 && allImages.value.length >= 6 )
    {
        const idx = Math.floor( Math.random() * allImages.value.length );
        if( !indices.includes( idx ) ) indices.push( idx );
    }
    randomImages.value = indices.map( i => getImagePath( allImages.value[ i ], false ) );
} );
</script>

<style scoped>
.gallery-text {
    position: absolute;
    top: 175px;
    height: 100px;
    width: 100%;
    box-sizing: border-box;
    background: linear-gradient(0deg, rgba(0, 0, 0, 75%) 0%, rgba(0, 0, 0, 0) 100%);
}

.album-title-image {
    filter: blur(3px)
}


</style>
