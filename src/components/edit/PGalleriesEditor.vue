<template>
  <v-dialog v-model="showImagePicker">
    <PImagePicker class="w-100" v-if="showImagePicker" :gallery="curGallery" @close="showImagePicker = false" @select="image => setGalleryImage( curGallery, image )"/>
  </v-dialog>
  <v-dialog v-model="showGalleryEditor">
    <PGalleryEditor v-if="showGalleryEditor" :gallery-name="curGallery" :gallery-index="curGalleryIndex" @close="showGalleryEditor = false"/>
  </v-dialog>
  <v-card class="w-100">
    <v-card-title class="d-flex">
      Edit Albums
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
              <td rowspan="2" v-if="element.initialized" style="width:240px;vertical-align: top">
                <PTitleImage :image-info="element.titleImage" @click="openGalleryEditor( element.id )" :editable="element.initialized && element.clean" @edit="openImagePicker( element.id )"/>
              </td>
              <td>
                <v-text-field density="compact" v-model="element.name" :disabled="!element.initialized" label="Name" @change="save"/>
              </td>
              <td rowspan="2">
                <v-btn v-if="!element.initialized" @click="initialize( element.id )">
                  Initialize
                </v-btn>
                <v-btn v-else @click="initialize( element.id )" :color="element.clean ? '' : 'warning'">
                  Update
                </v-btn>
              </td>
            </tr>
            <tr>
              <td>
                <v-textarea density="compact" v-model="element.description" :disabled="!element.initialized" label="Description" @change="save"/>
              </td>
            </tr>
            </tbody>
          </table>
        </v-card>
      </template>
    </draggable>
    <v-card v-if="showMessage" style="position:absolute;top:20px;right:20px;" :width="200" @click="showMessage = false" :color="messageColor" class="pa-4">{{ messageText }}</v-card>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import draggable from "vuedraggable";
import useGallery, { GalleryImage } from "@/composables/useGallery";
import PImagePicker from "@/components/edit/PImagePicker.vue";
import PGalleryEditor from "@/components/edit/PGalleryEditor.vue";
import PTitleImage from "@/components/gallery/PTitleImage.vue";
const { loadGallery } = useGallery();
const drag = ref( false );
const dragStyle = computed( () =>
{
    return drag.value ? "cursor:grabbing" : "cursor:grab"
} );
const galleries = ref( [] );
const curGallery = ref( "" );
const curGalleryIndex = ref( [] );
const showImagePicker = ref( false );
const showGalleryEditor = ref( false );
const showMessage = ref( false );
const messageColor = ref( "primary" );
const messageText = ref( "" );
const openImagePicker = ( galleryId : string ) =>
{
    curGallery.value = galleryId;
    showImagePicker.value = true;
};
const openGalleryEditor = async ( galleryId : string ) =>
{
    curGallery.value = galleryId;
    curGalleryIndex.value = await loadGallery( galleryId );
    showGalleryEditor.value = true;
}
const setGalleryImage = ( galleryId: string, image: GalleryImage ) =>
{
    const gallery = galleries.value.find( gallery => gallery.id === galleryId );
    if( !gallery ) throw new Error( `Gallery ${galleryId} not found!` );
    const imageClone = JSON.parse( JSON.stringify( image ) );
    imageClone.title = gallery.name;
    gallery.titleImage = imageClone;
    showImagePicker.value = false;
    save();
};
const initialize = async ( galleryId : string ) =>
{
    try
    {
        const resp = await fetch( "http://localhost:8080/initialize", {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify( { galleryName : galleryId } )
        } );
        const result = await resp.json();
        galleries.value.find( element => element.id === galleryId ).size = result.gallery.length;
        await save();
        messageText.value = "Album initialized.";
        messageColor.value = "primary";
        showMessage.value = true;
    }
    catch( e )
    {
        console.error( e );
        messageText.value = "Operation failed. Is the server on?";
        messageColor.value = "error";
        showMessage.value = true;
    }
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