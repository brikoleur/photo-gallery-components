<template>
  <PMosaic :gallery-index="allImages" :max-width="1800" :aspect-ratio="1" cover/>
</template>

<script setup lang="ts">
import PMosaic from "@/components/gallery/PMosaic.vue";
import useGallery from "@/composables/useGallery";
const { allImages } = useGallery();
</script>

<style scoped>

</style>