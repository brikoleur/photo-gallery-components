<template>
<PMosaic :gallery-name="galleryId" :max-width="1800" class="mt-1" image-class="ma-1" :aspect-ratio="1" cover/>
</template>

<script setup lang="ts">
import PMosaic from "@/components/gallery/PMosaic.vue";
import { useRoute } from "vue-router";
const route = useRoute();
const galleryId = route.query.gallery;
</script>

<style scoped>

</style>