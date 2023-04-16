<template>
  <v-dialog v-model="showImagePicker">
    <PImagePicker class="w-100" v-if="showImagePicker" :galleryId="curGallery" @close="showImagePicker = false" @select="image => setGalleryImage( curGallery, image )"/>
  </v-dialog>
  <v-dialog v-model="showGalleryEditor">
    <PGalleryEditor v-if="showGalleryEditor" :gallery-name="curGallery" @close="showGalleryEditor = false"/>
  </v-dialog>
  <v-sheet :max-width="900" class="mx-auto"  color="transparent">
    <v-card-title class="d-flex">
      Edit Albums
    </v-card-title>
    <draggable v-model="galleryList"
               item-key="id"
               :style="dragStyle"
               @start="drag = true"
               @end="onDragEnd">
      <template #item="{element}">
        <v-card class="pa-4 ma-1">
          <table class="gallery-item">
            <tbody>
            <tr>
              <td rowspan="2" v-if="element.initialized" style="width:240px;vertical-align: top">
                <PTitleImage :image-info="element.titleImage" @click="openGalleryEditor( element.id )" :editable="element.initialized && element.clean" @edit="openImagePicker( element.id )"/>
              </td>
              <td>
                <v-text-field density="compact" v-model="element.title" :disabled="!element.initialized" label="Name" @change="save"/>
              </td>
              <td rowspan="2">
                <v-btn v-if="!element.initialized" @click="initializeGallery( element.id )">
                  Initialize
                </v-btn>
                <v-btn v-else @click="initializeGallery( element.id )" :color="element.clean ? '' : 'warning'">
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
  </v-sheet>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import draggable from "vuedraggable";
import useGallery, { GalleryImage, Gallery } from "@/composables/useGallery";
import PImagePicker from "@/components/edit/PImagePicker.vue";
import PGalleryEditor from "@/components/edit/PGalleryEditor.vue";
import PTitleImage from "@/components/gallery/PTitleImage.vue";
const { allGalleries, galleryList, initialize } = useGallery();
const drag = ref( false );
const dragStyle = computed( () =>
{
    return drag.value ? "cursor:grabbing" : "cursor:grab"
} );
const curGallery = ref( "" );
const curGalleryIndex = ref( [] );
const showImagePicker = ref( false );
const showGalleryEditor = ref( false );
const showMessage = ref( false );
const messageColor = ref( "primary" );
const messageText = ref( "" );
const onDragEnd = async () =>
{
    drag.value = false;
    await save();
}
const openImagePicker = ( galleryId : string ) =>
{
    curGallery.value = galleryId;
    showImagePicker.value = true;
};
const openGalleryEditor = async ( galleryId : string ) =>
{
    curGallery.value = galleryId;
    showGalleryEditor.value = true;
}
const setGalleryImage = ( galleryId: string, image: GalleryImage ) =>
{
    const gallery = galleryList.value.find( ( entity: Gallery ) => entity.id === galleryId );
    if( !gallery ) throw new Error( `Gallery ${galleryId} not found!` );
    const imageClone = JSON.parse( JSON.stringify( image ) );
    gallery.titleImage = <GalleryImage> imageClone;
    showImagePicker.value = false;
    save();
};
const initializeGallery = async ( galleryId : string ) =>
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
        const galleryEnt = galleryList.value.find( element => element.id === galleryId );
        if( galleryEnt ) galleryEnt.size = result.gallery.length;
        await save();
        await initialize( true );
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
    galleryList.value.forEach( gallery =>
    {
        if( gallery.titleImage )
        {
            gallery.titleImage.title = gallery.title;
            gallery.titleImage.description = `${allGalleries.value.get( gallery.id ).length} photos`
        }
    } );
    const res = await fetch( "http://localhost:8080/update-index", {
        method : "POST",
        headers : {
            "content-type" : "application/json"
        },
        body : JSON.stringify( galleryList.value )
    } );
    const result = await res.json();
    if( result.result !== "success" )
    {
        console.error( "Error saving galleries:", result );
        alert( "An error occurred. Is the server running?" );
    }
}
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