<template>
  <v-dialog v-model="showImagePicker">
    <PImagePicker class="w-100" v-if="showImagePicker" :gallery="curGallery" @close="showImagePicker = false" @select="image => setGalleryImage( curGallery, image )"/>
  </v-dialog>
  <v-card class="w-100">
    <v-card-title class="d-flex">
      <h2>Galleries Editor</h2>
      <v-spacer/>
      <v-btn @click="save">Save</v-btn>
    </v-card-title>
    <draggable v-model="galleries"
               item-key="id"
               :style="dragStyle"
               @start="drag = true"
               @end="drag = false">
      <template #item="{element}">
        <v-card class="pa-4 ma-1">
          <table class="gallery-item">
            <tbody>
            <tr>
              <td rowspan="2" v-if="element.initialized" style="width:240px">
                <v-img :key="`title_${element.titleImage?.filename}`" :src="getImagePath( element.titleImage, true )" @click="openImagePicker( element.id )" style="cursor:pointer;border:1px solid grey;"
                       width="200" height="200"/>
              </td>
              <td>
                <v-text-field v-model="element.name" :disabled="!element.initialized" label="Name"/>
              </td>
              <td rowspan="2" v-if="!element.clean || !element.initialized">
                <v-btn v-if="!element.initialized" @click="initialize( element.id )">
                  Initialize
                </v-btn>
                <v-btn v-else-if="!element.clean" @click="initialize( element.id )">
                  Update
                </v-btn>
              </td>
            </tr>
            <tr>
              <td>
                <v-text-field v-model="element.description" :disabled="!element.initialized" label="Description"/>
              </td>
            </tr>
            </tbody>
          </table>
        </v-card>
      </template>
    </draggable>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import draggable from "vuedraggable";
import useGallery, { GalleryImage } from "@/composables/useGallery";
import PImagePicker from "@/components/edit/PImagePicker.vue";
const { getImagePath } = useGallery();
const drag = ref( false );
const dragStyle = computed( () =>
{
    return drag.value ? "cursor:grabbing" : "cursor:grab"
} );
const galleries = ref( [] );
const curGallery = ref( "" );
const showImagePicker = ref( false );
const openImagePicker = ( galleryId : string ) =>
{
    curGallery.value = galleryId;
    showImagePicker.value = true;
};
const setGalleryImage = ( galleryId: string, image: GalleryImage ) =>
{
    const gallery = galleries.value.find( gallery => gallery.id === galleryId );
    if( !gallery ) throw new Error( `Gallery ${galleryId} not found!` );
    gallery.titleImage = image;
    showImagePicker.value = false;
};
const initialize = async ( galleryId : string ) =>
{
    await fetch( "http://localhost:8080/initialize", {
        method : "POST",
        headers : {
            "content-type" : "application/json"
        },
        body : JSON.stringify( { galleryName : galleryId } )
    } );
    await fetchGalleries();
};
const save = async() =>
{
    const res = await fetch( "http://localhost:8080/update-index", {
        method : "POST",
        headers : {
            "content-type" : "application/json"
        },
        body : JSON.stringify( galleries.value )
    } );
    const result = await res.json();
    if( result.result !== "success" )
    {
        console.error( "Error saving galleries:", result );
        alert( "An error occurred. Is the server running?" );
    }
}
const fetchGalleries = async() =>
{
    const res = await fetch( "http://localhost:8080/galleries" );
    const result = await res.json();
    if( result.result === "success" )
    {
        galleries.value = result.galleries;
    }
    else
    {
        console.error( "Error loading galleries:", result );
        alert( "An error occurred. Is the server running?" );
    }
}
onMounted( () =>
{
    fetchGalleries();
} );
</script>

<style scoped>
.gallery-item {
    width: 100%;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
}

.gallery-item td {
    padding-right: 12px;
}
</style>