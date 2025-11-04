<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { videos } from '../../composables/mockup'

const route = useRoute()
const id = computed(() => String(route.params.id))
const video = computed(() => videos.find(v => v.id === id.value))
const relatedVideos = computed(() => videos.filter(v => v.id !== id.value).slice(0, 6))

function share() {
    const w = globalThis
    const url = encodeURIComponent(w.location?.href || '')
    const text = encodeURIComponent(video.value?.title || 'Video')
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`
    if (typeof w.open === 'function') w.open(shareUrl, '_blank')
}
</script>
<template>
    <div>
        <div class="text-22px font-bold text-#02964C mb-2">Video » {{ video?.title }}</div>
        <div class="h-1 bg-[#02964C] mb-4"></div>

        <div v-if="video" class="max-w-5xl">
            <div class="relative w-full aspect-video bg-black rounded-md overflow-hidden">
                <iframe
                    v-if="video"
                    class="w-full h-full"
                    :src="`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1&playsinline=1`"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                ></iframe>
            </div>

            <div class="mt-3 text-12px text-gray-500">{{ video.date }}</div>
            <div class="mt-1 text-14px">{{ video.excerpt }}</div>

            <div class="mt-4 flex gap-2 justify-end">
                <button @click="share" class="bg-[#4267B2] text-white px-3 py-1 rounded">Share</button>
            </div>
        </div>
        
        <div class="mt-8">
            <div class="text-16px font-bold text-#02964C uppercase mb-2">Video khác</div>
            <div class="h-1 bg-[#02964C] mb-4"></div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <router-link
                    v-for="rv in relatedVideos"
                    :key="rv.id"
                    :to="`/video/${rv.id}`"
                    class="group block rounded-md overflow-hidden shadow-sm hover:shadow-md transition bg-white"
                >
                    <div class="relative">
                        <img :src="rv.thumbnail" :alt="rv.title" class="w-full h-[160px] object-cover" />
                    <div class="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition"></div>
                    <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-14px px-3 py-2">
                            {{ rv.title }}
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>

</template>
<style scoped>

</style>