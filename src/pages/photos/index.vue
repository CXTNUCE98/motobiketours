<script setup lang="ts">
import { photos as photosList } from '../../composables/mockup'

const photos = photosList
</script>

<template>
    <div>
        <!-- Page Header -->
        <div class="text-center mb-8">
            <h1 class="text-4xl font-bold mb-2">
                <span class="text-gray-800">PHOTO </span>
                <span class="text-[#1A71C7]">GALLERY</span>
            </h1>
            <p class="text-gray-600 text-lg">Explore the beauty of Vietnam through our lens</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <PhotoTile v-for="p in photos" :key="p.id" :id="p.id" :src="p.src || p.src[0]" :title="p.title" />
        </div>
    </div>
    
</template>


<style scoped></style>