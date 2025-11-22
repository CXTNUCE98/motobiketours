<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { photos as photosList } from '../../composables/mockup'

const route = useRoute()
const id = computed(() => String(route.params.id))

const photoItem = computed(() => photosList.find(p => p.id === id.value))

const images = computed<string[]>(() => {
    if (!photoItem.value) return []
    return Array.isArray(photoItem.value.src) ? photoItem.value.src : [photoItem.value.src]
})

const currentIndex = ref(0)
const isHovering = ref(false)

const hasMultiple = computed(() => images.value.length > 1)

const goTo = (index: number) => {
    if (index >= 0 && index < images.value.length) currentIndex.value = index
}

const prev = () => {
    currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length
}

const next = () => {
    currentIndex.value = (currentIndex.value + 1) % images.value.length
}

let autoplay: any = null
onMounted(() => {
    autoplay = globalThis.setInterval(() => {
        if (hasMultiple.value && !isHovering.value) next()
    }, 4000)
})

onBeforeUnmount(() => {
    if (autoplay) globalThis.clearInterval(autoplay)
})

function like() {
    console.log('like')
}

function share() {
    const w = globalThis as any
    const url = encodeURIComponent(w.location?.href || '')
    const text = encodeURIComponent(photoItem.value?.title || 'Photo')
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`
    if (typeof w.open === 'function') w.open(shareUrl, '_blank')
}
</script>
<template>
    <div>
        <!-- Page Header -->
        <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ photoItem?.title }}</h1>
            <div class="h-1 w-20 bg-gradient-to-r from-[#FF6B35] to-[#1A71C7]"></div>
        </div>

        <div v-if="images.length" class="w-full max-w-5xl">
            <div v-if="!hasMultiple"
                class="w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-transparent dark:border-gray-700">
                <img :src="images[0]" :alt="photoItem?.title" class="w-full h-auto object-contain" />
            </div>

            <div v-else
                class="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-transparent dark:border-gray-700"
                @mouseenter="isHovering = true" @mouseleave="isHovering = false">
                <div class="relative w-full overflow-hidden">
                    <div class="flex transition-transform duration-500 ease-in-out"
                        :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
                        <div v-for="(img, i) in images" :key="i" class="min-w-full">
                            <img :src="img" :alt="`${photoItem?.title} ${i + 1}`"
                                class="w-full h-auto object-contain" />
                        </div>
                    </div>
                </div>

                <button v-if="isHovering" @click="prev"
                    class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg">
                    <i class="bx bx-chevron-left text-2xl"></i>
                </button>
                <button v-if="isHovering" @click="next"
                    class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg">
                    <i class="bx bx-chevron-right text-2xl"></i>
                </button>

                <div class="p-4 bg-gray-50 dark:bg-gray-900 flex gap-2 overflow-x-auto">
                    <button v-for="(img, i) in images" :key="i" @click="goTo(i)"
                        :class="['border-3 p-1 rounded-lg transition-all duration-300 hover:scale-105',
                            currentIndex === i ? 'border-[#FF6B35] shadow-lg' : 'border-gray-300 dark:border-gray-600 opacity-70']">
                        <img :src="img" :alt="`${photoItem?.title} ${i + 1}`"
                            class="w-[100px] h-[70px] object-cover rounded" />
                    </button>
                </div>
            </div>

            <div class="mt-6 flex gap-3 justify-end">
                <button @click="like"
                    class="inline-flex items-center gap-2 bg-gradient-to-r from-[#1877F2] to-[#166fe5] hover:from-[#166fe5] hover:to-[#1877F2] text-white px-5 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                    <i class="bx bx-like"></i>
                    Like
                </button>
                <button @click="share"
                    class="inline-flex items-center gap-2 bg-gradient-to-r from-[#4267B2] to-[#365899] hover:from-[#365899] hover:to-[#4267B2] text-white px-5 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                    <i class="bx bxl-facebook-circle"></i>
                    Share
                </button>
            </div>
        </div>
    </div>
</template>
<style scoped></style>