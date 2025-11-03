<script setup lang="ts">
import { photos as photosList } from '../../composables/mockup'

const photos = photosList
</script>

<template>
    <div>
        <div class="text-22px font-bold text-#02964C mb-2">Photos</div>
        <div class="h-1 bg-[#02964C] mb-4"></div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            <PhotoTile v-for="p in photos" :key="p.id" :id="p.id" :src="p.src || p.src[0]" :title="p.title" />
        </div>
    </div>
    
</template>


<style scoped></style>