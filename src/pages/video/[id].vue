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
        <!-- Page Header -->
        <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ video?.title }}</h1>
            <div class="h-1 w-20 bg-gradient-to-r from-[#FF6B35] to-[#1A71C7]"></div>
        </div>

        <div v-if="video" class="max-w-5xl">
            <div class="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
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

            <div class="mt-4 bg-white rounded-lg shadow-md p-5">
                <div class="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <i class="bx bx-calendar text-[#FFA726]"></i>
                    <span>{{ video.date }}</span>
                </div>
                <div class="text-gray-700 leading-relaxed">{{ video.excerpt }}</div>

                <div class="mt-4 flex gap-3 justify-end">
                    <button @click="share" 
                        class="inline-flex items-center gap-2 bg-gradient-to-r from-[#4267B2] to-[#365899] hover:from-[#365899] hover:to-[#4267B2] text-white px-5 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                        <i class="bx bxl-facebook-circle"></i>
                        Share
                    </button>
                </div>
            </div>
        </div>
        
        <div class="mt-10">
            <div class="flex items-center gap-2 mb-6">
                <i class="bx bx-video text-[#1A71C7] text-2xl"></i>
                <h2 class="text-2xl font-bold text-gray-800">Related Videos</h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <router-link
                    v-for="rv in relatedVideos"
                    :key="rv.id"
                    :to="`/video/${rv.id}`"
                    class="group block rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                    <div class="relative">
                        <img :src="rv.thumbnail" :alt="rv.title" class="w-full h-[160px] object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div class="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <i class="bx bx-play-circle text-white text-5xl"></i>
                        </div>
                        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-sm px-3 py-3 font-semibold">
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