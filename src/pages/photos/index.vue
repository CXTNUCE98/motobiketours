<script setup lang="ts">
import { photos as photosList } from '../../composables/mockup'

const photos = photosList
</script>

<template>
    <div>
        <div class="mb-8">
            <h1 class="font-display font-bold text-3xl md:text-4xl text-secondary-800 mb-2">Photo Gallery</h1>
            <p class="text-gray-600">Explore stunning images from our motorbike adventures across Vietnam</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <PhotoTile v-for="p in photos" :key="p.id" :id="p.id" :src="p.src || p.src[0]" :title="p.title" />
        </div>
    </div>
    
</template>


<style scoped></style>