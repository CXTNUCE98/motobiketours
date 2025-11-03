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
        <div class="text-22px font-bold text-#02964C mb-2">Photos » {{ photoItem?.title }}</div>
        <div class="h-1 bg-[#02964C] mb-4"></div>

        <div v-if="images.length" class="w-full max-w-5xl">
            <div v-if="!hasMultiple" class="w-full">
                <img :src="images[0]" :alt="photoItem?.title" class="w-full h-auto object-contain" />
            </div>

            <div v-else class="relative" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
                <div class="relative w-full overflow-hidden">
                    <div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
                        <div v-for="(img, i) in images" :key="i" class="min-w-full">
                            <img :src="img" :alt="`${photoItem?.title} ${i+1}`" class="w-full h-auto object-contain" />
                        </div>
                    </div>
                </div>

                <button v-if="isHovering" @click="prev" class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full flex items-center justify-center">‹</button>
                <button v-if="isHovering" @click="next" class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full flex items-center justify-center">›</button>

                <div class="mt-2 flex gap-2 overflow-x-auto pb-1">
                    <button v-for="(img, i) in images" :key="i" @click="goTo(i)" :class="['border-2 p-0.5 rounded-sm', currentIndex === i ? 'border-[#02964C]' : 'border-transparent']">
                        <img :src="img" :alt="`${photoItem?.title} ${i+1}`" class="w-[100px] h-[70px] object-cover" />
                    </button>
                </div>
            </div>

            <div class="mt-4 flex gap-2 justify-end">
                <button @click="like" class="bg-[#1877F2] text-white px-3 py-1 rounded">Like</button>
                <button @click="share" class="bg-[#4267B2] text-white px-3 py-1 rounded">Share</button>
            </div>
        </div>
    </div>
</template>
<style scoped>
</style>