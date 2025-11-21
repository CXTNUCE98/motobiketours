<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { slides } from '@/data/homeData';

const currentSlide = ref(0);
const totalSlides = slides.length;
const isHovering = ref(false);
let heroAutoPlayInterval: ReturnType<typeof setInterval> | null = null;

const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % totalSlides;
};

const goToSlide = (index: number) => {
    currentSlide.value = index;
};

const startCarousel = () => {
    if (heroAutoPlayInterval) clearInterval(heroAutoPlayInterval);
    heroAutoPlayInterval = setInterval(() => {
        if (!isHovering.value) {
            nextSlide();
        }
    }, 5000);
};

onMounted(() => {
    startCarousel();
});

onUnmounted(() => {
    if (heroAutoPlayInterval) {
        clearInterval(heroAutoPlayInterval);
        heroAutoPlayInterval = null;
    }
});
</script>

<template>
    <div class="w-full bg-white">
        <div class="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden bg-map"
            style="z-index: 1;">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
                <div class="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12"
                    @mouseenter="isHovering = true" @mouseleave="isHovering = false">
                    <!-- Left Content -->
                    <div class="flex-1 text-center lg:text-left space-y-4 sm:space-y-6 z-10 w-full">
                        <transition name="fade" mode="out-in">
                            <div :key="currentSlide">
                                <p class="text-gray-600 text-xs sm:text-sm md:text-base font-medium mb-2">
                                    {{ slides[currentSlide].subtitle }}
                                </p>
                                <h1
                                    class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#094174] leading-tight mb-3 sm:mb-4">
                                    {{ slides[currentSlide].title }}
                                </h1>
                                <p
                                    class="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0">
                                    {{ slides[currentSlide].description }}
                                </p>
                                <NuxtLink to="/booking"
                                    class="inline-block bg-[#1A71C7] hover:bg-[#C2185B] text-white px-6 py-2.5 sm:px-8 sm:py-3 md:px-10 md:py-4 rounded-lg font-bold text-xs sm:text-sm md:text-base uppercase tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                    ĐẶT BÂY GIỜ
                                </NuxtLink>
                            </div>
                        </transition>
                    </div>

                    <!-- Right Image - Circular Design -->
                    <div class="flex-1 relative flex items-center justify-center w-full lg:w-auto">
                        <transition name="fade" mode="out-in">
                            <div :key="currentSlide" class="relative w-full max-w-[500px]">
                                <!-- Main circular image -->
                                <div
                                    class="relative w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] mx-auto">
                                    <!-- Background decorative circles -->
                                    <div
                                        class="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl">
                                    </div>

                                    <!-- Main image circle -->
                                    <div
                                        class="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-4 sm:border-6 md:border-8 border-white">
                                        <img :src="slides[currentSlide].image" :alt="slides[currentSlide].title"
                                            class="w-full h-full object-cover" />
                                    </div>

                                    <!-- Video thumbnail overlay (top left) -->
                                    <div
                                        class="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 md:-top-8 md:-left-8 w-24 h-18 sm:w-32 sm:h-24 md:w-48 md:h-36 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border-2 sm:border-4 border-white bg-white transform hover:scale-105 transition-transform duration-300">
                                        <img :src="slides[currentSlide].videoThumb" alt="Video"
                                            class="w-full h-full object-cover" />
                                        <!-- Play button -->
                                        <div class="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <button
                                                class="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-[#1A71C7] rounded-full flex items-center justify-center shadow-lg hover:bg-[#C2185B] transition-colors">
                                                <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 text-white ml-0.5 sm:ml-1"
                                                    fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>

                <!-- Carousel Indicators -->
                <div class="flex justify-center items-center gap-2 mt-6 sm:mt-8 lg:mt-12">
                    <button v-for="index in totalSlides" :key="index" @click="goToSlide(index - 1)" :class="[
                        'transition-all duration-300',
                        currentSlide === index - 1
                            ? 'w-8 h-2 bg-[#1A71C7] rounded-full'
                            : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400'
                    ]" :aria-label="`Go to slide ${index}`"></button>
                </div>
            </div>

            <!-- Decorative elements -->
            <div class="absolute top-10 right-10 w-20 h-20 bg-blue-200/20 rounded-full blur-2xl"></div>
            <div class="absolute bottom-20 left-20 w-32 h-32 bg-purple-200/20 rounded-full blur-3xl"></div>
        </div>
    </div>
</template>

<style scoped>
.bg-map {
    background-image: url('/map.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-blend-mode: overlay;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: translateX(-20px);
}

.fade-leave-to {
    opacity: 0;
    transform: translateX(20px);
}
</style>
