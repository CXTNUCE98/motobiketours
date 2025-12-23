<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
    images: string[];
    title: string;
}>();

const selectedIndex = ref(0);
const showLightbox = ref(false);
const isHovering = ref(false);
const isZoomed = ref(false);

const currentImage = computed(() => props.images[selectedIndex.value] || '');

const selectImage = (index: number) => {
    selectedIndex.value = index;
};

const openLightbox = (index?: number) => {
    if (index !== undefined) {
        selectedIndex.value = index;
    }
    showLightbox.value = true;
    document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
    showLightbox.value = false;
    isZoomed.value = false;
    document.body.style.overflow = '';
};

const nextImage = () => {
    selectedIndex.value = (selectedIndex.value + 1) % props.images.length;
};

const prevImage = () => {
    selectedIndex.value = (selectedIndex.value - 1 + props.images.length) % props.images.length;
};

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
    if (!showLightbox.value) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
};

// Auto-rotate
let rotateInterval: ReturnType<typeof setInterval> | null = null;

const startAutoRotate = () => {
    if (rotateInterval) return;
    rotateInterval = setInterval(() => {
        if (!isHovering.value && !showLightbox.value) {
            nextImage();
        }
    }, 4000);
};

const stopAutoRotate = () => {
    if (rotateInterval) {
        clearInterval(rotateInterval);
        rotateInterval = null;
    }
};

// Lifecycle
import { onMounted, onBeforeUnmount } from 'vue';

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
    startAutoRotate();
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown);
    stopAutoRotate();
    document.body.style.overflow = '';
});
</script>

<template>
    <div @mouseenter="isHovering = true" @mouseleave="isHovering = false" class="space-y-4">
        <!-- Main Image -->
        <div @click="openLightbox()" class="relative group cursor-pointer overflow-hidden rounded-2xl shadow-xl">
            <img :src="currentImage" :alt="title"
                class="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105" />

            <!-- Zoom Icon Overlay -->
            <div
                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div
                    class="bg-white/90 backdrop-blur-md rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    <svg class="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                </div>
            </div>

            <!-- Image Counter -->
            <div
                class="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold">
                {{ selectedIndex + 1 }} / {{ images.length }}
            </div>

            <!-- Navigation Arrows -->
            <button @click.stop="prevImage"
                class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md hover:bg-white text-gray-800 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button @click.stop="nextImage"
                class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md hover:bg-white text-gray-800 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>

        <!-- Thumbnail Grid -->
        <div class="grid grid-cols-6 gap-3">
            <div v-for="(image, index) in images" :key="index" @click="selectImage(index)"
                class="relative cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:scale-105"
                :class="index === selectedIndex ? 'ring-4 ring-blue-500 shadow-lg' : 'ring-2 ring-gray-200 hover:ring-gray-300'">
                <img :src="image" :alt="`${title} - ${index + 1}`" class="w-full h-20 object-cover" />
                <div v-if="index === selectedIndex"
                    class="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Lightbox Modal -->
        <ClientOnly>
            <Teleport to="body">
                <Transition name="lightbox">
                    <div v-if="showLightbox" @click="closeLightbox"
                        class="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">

                        <!-- Top Bar Actions -->
                        <div class="absolute top-6 right-6 flex items-center gap-4 z-20">
                            <!-- Zoom Toggle -->
                            <button @click.stop="isZoomed = !isZoomed"
                                class="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all duration-300 hover:scale-110"
                                :title="isZoomed ? 'Thu nhỏ' : 'Phóng to'">
                                <svg v-if="isZoomed" class="w-6 h-6" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                                </svg>
                                <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                </svg>
                            </button>

                            <!-- Download Button -->
                            <a :href="currentImage" download target="_blank" @click.stop
                                class="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all duration-300 hover:scale-110"
                                title="Tải ảnh">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </a>

                            <!-- Close Button -->
                            <button @click="closeLightbox"
                                class="bg-white/10 hover:bg-red-500/80 text-white rounded-full p-3 transition-all duration-300 hover:scale-110"
                                title="Đóng">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <!-- Image Counter -->
                        <div
                            class="absolute top-6 left-6 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full text-lg font-semibold z-10">
                            {{ selectedIndex + 1 }} / {{ images.length }}
                        </div>

                        <!-- Main Image -->
                        <div @click.stop
                            class="relative w-full h-full flex items-center justify-center overflow-hidden">
                            <img :src="currentImage" :alt="title" class="transition-transform duration-300 rounded-lg"
                                :class="isZoomed ? 'w-full h-auto object-cover max-h-none cursor-zoom-out' : 'max-w-full max-h-[90vh] object-contain cursor-zoom-in'"
                                @click="isZoomed = !isZoomed" />
                        </div>

                        <!-- Navigation Arrows -->
                        <button @click.stop="prevImage"
                            class="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 transition-all duration-300 hover:scale-110 group">
                            <svg class="w-8 h-8 group-hover:-translate-x-1 transition-transform" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                    d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button @click.stop="nextImage"
                            class="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 transition-all duration-300 hover:scale-110 group">
                            <svg class="w-8 h-8 group-hover:translate-x-1 transition-transform" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                    d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        <!-- Caption -->
                        <div class="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
                            <div class="inline-block bg-black/50 backdrop-blur-md text-white px-6 py-3 rounded-full">
                                <h3 class="text-lg font-medium">{{ title }}</h3>
                            </div>
                        </div>
                    </div>
                </Transition>
            </Teleport>
        </ClientOnly>
    </div>
</template>

<style scoped>
.lightbox-enter-active,
.lightbox-leave-active {
    transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
    opacity: 0;
}
</style>
