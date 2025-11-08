<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
const currentSlide = ref(0)
const isHovering = ref(false)

const route = useRoute()

// Tour locations submenu
const tourMenu = [
    { name: 'Sai Gon', path: '/tour/sai-gon' },
    { name: 'Mui ne', path: '/tour/mui-ne' },
    { name: 'Dalat', path: '/tour/dalat' },
    { name: 'Nha Trang', path: '/tour/nha-trang' },
    { name: 'Da Nang', path: '/tour/da-nang' },
    { name: 'Hoi An', path: '/tour/hoi-an' },
    { name: 'Hue', path: '/tour/hue' },
    { name: 'Dong Hoi', path: '/tour/dong-hoi' },
    { name: 'Ha Noi', path: '/tour/ha-noi' },
]

// Main menu items
const mainMenuItems = [
    { name: 'Home', path: '/' },
    { name: 'About us', path: '/about' },
    { name: 'Photos', path: '/photos' },
    { name: 'Video', path: '/video' },
    { name: 'Tour and Prices', path: '/tour', hasSubmenu: true },
    { name: 'News', path: '/news' },
    { name: 'Booking guide', path: '/booking' },
    { name: 'Contact us', path: '/contact' },
    { name: 'Links', path: '/links' },
]

const isTourMenuOpen = ref(false)
const isMobileMenuOpen = ref(false)
const activePath = computed(() => route.path)

const isActive = (path: string) => {
    if (path === '/tour') {
        return route.path.startsWith('/tour')
    }
    return route.path === path
}

const openTourMenu = () => {
    isTourMenuOpen.value = true
}

const closeTourMenu = () => {
    isTourMenuOpen.value = false
}

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
}

// Generate slides - hỗ trợ cả số bắt đầu từ 0 hoặc 1
// Nếu muốn bắt đầu từ 0.jpg, đặt startFrom = 0, nếu từ 1.jpg thì startFrom = 1
const startFrom = 1 // Thay đổi thành 0 nếu ảnh bắt đầu từ 0.jpg
const totalSlides = 8 // Số lượng ảnh hiện có (có thể tăng lên 16 khi có thêm ảnh)

const slides = Array.from({ length: totalSlides }, (_, i) => ({
    image: `/carousel/${i + startFrom}.jpg`,
    index: i
}))

const goToSlide = (index: number) => {
    if (index >= 0 && index < slides.length) {
        currentSlide.value = index
    }
}

const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % slides.length
}

const prevSlide = () => {
    currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}

// Auto-play (optional)
let autoPlayInterval: ReturnType<typeof setInterval> | null = null

// Keyboard navigation
const handleKeyDown = (event: any) => {
    if (event.key === 'ArrowLeft') {
        prevSlide()
    } else if (event.key === 'ArrowRight') {
        nextSlide()
    }
}

onMounted(() => {
    autoPlayInterval = setInterval(() => {
        if (!isHovering.value) {
            nextSlide()
        }
    }, 5000)

    globalThis.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval)
    }
    globalThis.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
    <!-- Modern Navigation Bar -->
    <nav class="bg-white shadow-md w-full sticky top-0 z-50 border-b border-gray-100">
        <div class="container mx-auto px-4 max-w-7xl">
            <!-- Desktop Menu -->
            <div class="hidden lg:flex items-center justify-between py-4">
                <!-- Logo -->
                <NuxtLink to="/" class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-adventure-500 rounded-lg flex items-center justify-center">
                        <i class='bx bx-trip text-white text-2xl'></i>
                    </div>
                    <div>
                        <div class="font-display font-bold text-xl text-secondary-800">Vietnam Adventures</div>
                        <div class="text-xs text-secondary-500">Motorbike Tours</div>
                    </div>
                </NuxtLink>

                <!-- Main Navigation -->
                <ul class="flex items-center gap-1">
                    <li v-for="(item, index) in mainMenuItems" :key="index" class="relative group"
                        @mouseenter="item.hasSubmenu ? openTourMenu() : null"
                        @mouseleave="item.hasSubmenu ? closeTourMenu() : null">
                        <NuxtLink :to="item.hasSubmenu ? '#' : item.path" :class="[
                            'flex items-center gap-1 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg',
                            isActive(item.path)
                                ? 'text-primary-600 bg-primary-50'
                                : 'text-secondary-700 hover:text-primary-600 hover:bg-gray-50'
                        ]">
                            <span>{{ item.name }}</span>
                            <i v-if="item.hasSubmenu" class='bx bx-chevron-down text-sm transition-transform group-hover:rotate-180'></i>
                        </NuxtLink>

                        <!-- Submenu for Tour and Prices -->
                        <div v-if="item.hasSubmenu && isTourMenuOpen"
                            class="absolute left-0 top-full bg-white min-w-[220px] shadow-lg rounded-lg mt-2 border border-gray-100 overflow-hidden"
                            @mouseenter="openTourMenu()" @mouseleave="closeTourMenu()">
                            <ul class="py-2">
                                <li v-for="(tour, tourIndex) in tourMenu" :key="tourIndex">
                                    <NuxtLink :to="tour.path" :class="[
                                        'flex items-center gap-2 px-4 py-2.5 text-sm text-secondary-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200',
                                        route.path === tour.path ? 'bg-primary-50 text-primary-600 font-medium' : ''
                                    ]">
                                        <i class='bx bx-map-pin text-xs'></i>
                                        <span>{{ tour.name }}</span>
                                    </NuxtLink>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>

            <!-- Mobile Menu -->
            <div class="lg:hidden flex items-center justify-between py-3">
                <NuxtLink to="/" class="flex items-center gap-2">
                    <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-adventure-500 rounded-lg flex items-center justify-center">
                        <i class='bx bx-trip text-white text-xl'></i>
                    </div>
                    <div class="font-display font-bold text-lg text-secondary-800">Vietnam Adventures</div>
                </NuxtLink>

                <button @click="toggleMobileMenu" class="p-2 text-secondary-700 hover:bg-gray-100 rounded-lg">
                    <i :class="isMobileMenuOpen ? 'bx bx-x' : 'bx bx-menu'" class="text-2xl"></i>
                </button>
            </div>

            <transition name="slide-down">
                <div v-if="isMobileMenuOpen" class="lg:hidden pb-4 border-t border-gray-100 mt-2">
                    <ul class="space-y-1 pt-2">
                        <li v-for="(item, index) in mainMenuItems" :key="index">
                            <NuxtLink :to="item.path" @click="closeMobileMenu" :class="[
                                'flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                                isActive(item.path) ? 'bg-primary-50 text-primary-600' : 'text-secondary-700 hover:bg-gray-50'
                            ]">
                                <span>{{ item.name }}</span>
                                <i v-if="item.hasSubmenu" class='bx bx-chevron-right text-sm'></i>
                            </NuxtLink>

                            <!-- Tour submenu items on mobile -->
                            <div v-if="item.hasSubmenu && isActive(item.path)" class="ml-4 mt-1 space-y-1">
                                <NuxtLink v-for="(tour, tourIndex) in tourMenu" :key="tourIndex" :to="tour.path" @click="closeMobileMenu" :class="[
                                    'flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all duration-200',
                                    route.path === tour.path ? 'bg-primary-50 text-primary-600 font-medium' : 'text-secondary-600 hover:bg-gray-50'
                                ]">
                                    <i class='bx bx-map-pin text-xs'></i>
                                    <span>{{ tour.name }}</span>
                                </NuxtLink>
                            </div>
                        </li>
                    </ul>
                    <NuxtLink to="/contact" @click="closeMobileMenu" class="mt-4 block w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-adventure-500 text-white font-semibold rounded-lg text-center hover:shadow-lg transition-all duration-200">
                        Book Now
                    </NuxtLink>
                </div>
            </transition>
        </div>
    </nav>

    <!-- Hero Carousel Header -->
    <header class="bg-secondary-900 w-full max-w-7xl mx-auto">
        <!-- Carousel -->
        <div class="relative w-full" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
            <!-- Main Image Container -->
            <div class="relative w-full h-[450px] md:h-[550px] lg:h-[650px] overflow-hidden">
                <!-- Slide Images with Overlay -->
                <div class="absolute inset-0 transition-transform duration-700 ease-in-out"
                    :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
                    <div v-for="(slide, index) in slides" :key="index" class="absolute inset-0 w-full h-full"
                        :style="{ left: `${index * 100}%` }">
                        <img :src="slide.image" :alt="`Slide ${index + 1}`" class="w-full h-full object-cover"
                            @error="(e) => { e.target.style.display = 'none' }" />
                        <!-- Gradient Overlay -->
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    </div>
                </div>

                <!-- Hero Content Overlay -->
                <div class="absolute inset-0 flex items-center justify-center text-center px-4 z-10">
                    <div class="max-w-4xl">
                        <h1 class="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-4 drop-shadow-lg">
                            Discover Vietnam by Motorbike
                        </h1>
                        <p class="text-lg md:text-xl text-white/90 mb-8 drop-shadow-md">
                            Authentic adventures through breathtaking landscapes and hidden gems
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4 justify-center">
                            <NuxtLink to="/tour" class="px-8 py-3.5 bg-gradient-to-r from-primary-500 to-adventure-500 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                                Explore Tours
                            </NuxtLink>
                            <NuxtLink to="/contact" class="px-8 py-3.5 bg-white text-secondary-800 font-semibold rounded-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                                Contact Us
                            </NuxtLink>
                        </div>
                    </div>
                </div>

                <!-- Navigation Buttons -->
                <button @click="prevSlide"
                    class="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100"
                    aria-label="Previous slide">
                    <i class='bx bx-chevron-left text-3xl'></i>
                </button>

                <button @click="nextSlide"
                    class="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100"
                    aria-label="Next slide">
                    <i class='bx bx-chevron-right text-3xl'></i>
                </button>
            </div>

            <!-- Pagination Indicators -->
            <div class="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-2 z-20">
                <button v-for="(slide, index) in slides" :key="index" @click="goToSlide(index)" :class="[
                    'transition-all duration-300 rounded-full',
                    currentSlide === index
                        ? 'w-8 h-2 bg-white'
                        : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                ]" :aria-label="`Go to slide ${index + 1}`">
                </button>
            </div>
        </div>
    </header>
    
    <!-- Depart From Section -->
    <div class="bg-gradient-to-r from-primary-500 to-adventure-500 w-full max-w-7xl mx-auto">
        <div class="container mx-auto px-4">
            <div class="hidden md:flex justify-center items-center gap-2 py-4 text-#334155 text-sm font-medium flex-wrap">
                <span class="font-semibold">DEPART FROM:</span>
                <NuxtLink v-for="(item, index) in tourMenu" :key="index" :to="item.path" :class="[
                    'px-3 py-1.5 rounded-lg transition-all duration-200',
                    route.path === item.path 
                        ? 'bg-white text-primary-600 font-semibold' 
                        : 'hover:bg-white/20'
                ]">
                    {{ item.name }}
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    max-width: 1200px;
}

.quang-easyrider {
    font-family: 'Dancing Script', cursive;
    font-weight: 700;
    letter-spacing: 0.02em;
}

.box-color {
    background: rgba(48, 47, 47, 0.7);
}

/* Slide down animation for mobile menu */
.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.3s ease;
    max-height: 1000px;
    overflow: hidden;
}

.slide-down-enter-from {
    max-height: 0;
    opacity: 0;
}

.slide-down-enter-to {
    max-height: 1000px;
    opacity: 1;
}

.slide-down-leave-from {
    max-height: 1000px;
    opacity: 1;
}

.slide-down-leave-to {
    max-height: 0;
    opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 640px) {
    .container {
        padding-left: 1rem;
        padding-right: 1rem;
    }
}

@media (min-width: 641px) and (max-width: 1024px) {
    .container {
        padding-left: 2rem;
        padding-right: 2rem;
    }
}

@media (min-width: 1025px) {
    .container {
        padding-left: 3rem;
        padding-right: 3rem;
    }
}
</style>