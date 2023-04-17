<template>
  <v-card
    v-if="showErrorMessage"
    color="error"
    width="300"
    class="pa-4"
    style="position:fixed;top:20px;right:20px;z-index:99999999"
    @click="showErrorMessage = false"
  >
    An error occurred connecting to the development server - is it running?
  </v-card>
  <v-card
    flat
    style="overflow-y:auto;width:100%;height:100%;"
    class="pa-4 mt-12"
  >
    <v-card-title class="d-flex">Edit album <v-spacer/><v-icon @click="updateAndClose" icon="mdi-close"></v-icon></v-card-title>
    <draggable
      v-model="galleryIndex"
      group="people"
      item-key="filename"
      :style="dragStyle"
      @start="drag = true"
      @end="onEndDrag"
    >
      <template #item="{element}">
        <v-card
          class="pa-4 ma-1"
        >
          <v-row
            no-gutters
          >
            <v-col cols="4">
              <v-img
                :src="getImagePath( element, true )"
                style="max-height:300px"
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model="element.title"
                label="Title"
              />
              <v-textarea
                v-model="element.description"
                label="Description"
              />
            </v-col>
          </v-row>
        </v-card>
      </template>
    </draggable>
  </v-card>
</template>

<script setup>
import draggable from "vuedraggable";
import { computed, onMounted, ref } from "vue";
import useGallery from "../../composables/useGallery";
import useDev from "../../composables/useDev";

const props = defineProps( {
    galleryName : {
        type : String,
        required : true
    },
    modelValue : Boolean
} );
const { getImagePath, allGalleries, initialize } = useGallery();
const { serverRunning } = useDev();
const drag = ref( false );
const dragStyle = computed( () =>
{
    return drag.value ? "cursor:grabbing" : "cursor:grab"
} );
const emit = defineEmits( [ "close" ] );
const galleryIndex = ref( allGalleries.value.get( props.galleryName ) );
const showErrorMessage = ref( false );
onMounted( async () =>
{
    if( !( await serverRunning() ) )
    {
        showErrorMessage.value = true;
    }
} );
const onEndDrag = () =>
{
    drag.value = false;
}
const updateAndClose = async () =>
{
    await updateGalleryIndex();
    await initialize( true );
    emit( "close" );
};
const updateGalleryIndex = async () =>
{
    try
    {
        const resp = await fetch( "http://localhost:8080/update", {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify( {
                galleryName : props.galleryName,
                galleryIndex : galleryIndex.value
            } )
        } );

        const res = await resp.json();
        if( res.result !== "success" )
        {
            console.error( res );
            showErrorMessage.value = true;
        }
    }
    catch( e )
    {
        console.error( e );
        showErrorMessage.value = true;
    }
};
</script>

<style scoped>

</style>