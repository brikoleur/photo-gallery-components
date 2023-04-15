<template>
  <v-card
    flat
    style="position:fixed;top:5px;right:5px;z-index:999;width:100%"
    class="pa-1 d-flex"
  >
    <div class="px-8 text-h5">
      Edit gallery "{{ galleryName }}"
    </div>
    <v-spacer />
    <v-btn
      size="small"
      color="primary"
      class="mr-2"
      @click="updateGalleryIndex"
    >
      Save
    </v-btn>
    <v-btn
      size="small"
      @click="$emit( 'close' )"
    >
      Close
    </v-btn>
  </v-card>
  <v-card
    v-if="showErrorMessage"
    color="error"
    width="300"
    class="pa-4"
    style="position:fixed;top:20px;right:20px;z-index:99999999"
    @click="showErrorMessage = false"
  >
    An error occurred updating data - is
    the server on?
  </v-card>
  <v-card
    flat
    style="overflow-y:auto;width:100%;height:100%;"
    class="pa-4 mt-12"
  >
    <draggable
      v-model="galleryIndex"
      group="people"
      item-key="filename"
      :style="dragStyle"
      @start="drag = true"
      @end="drag = false"
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
                :src="element.thumbnail"
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
import { computed, ref } from "vue";

const props = defineProps( {
    galleryIndex : {
        type : Array,
        required : true
    },
    galleryName : {
        type : String,
        required : true
    },
    modelValue : Boolean
} );
const drag = ref( false );
const dragStyle = computed( () =>
{
    return drag.value ? "cursor:grabbing" : "cursor:grab"
} );
const emit = defineEmits( [ "close" ] );
const galleryIndex = ref( props.galleryIndex );
const showOkMessage = ref( false );
const showErrorMessage = ref( false );
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
        if( res.result === "success" )
        {
            emit( "close" );
        }
        else
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