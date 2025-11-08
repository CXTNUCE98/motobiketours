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
    <!-- Top Bar with Contact Info -->
    <div class="bg-white border-b border-gray-200 w-full max-w-6xl mx-auto">
        <div class="container mx-auto px-4 py-2 flex justify-between items-center text-sm">
            <div class="flex items-center gap-4 text-gray-600">
                <span class="font-semibold">HOTLINE:</span>
                <a href="tel:+84903579094" class="text-[#FF6B35] font-bold hover:text-[#E91E63] transition-colors">
                    +84 903 579 094
                </a>
            </div>
            <div class="flex items-center gap-3">
                <a href="#" class="text-gray-500 hover:text-[#FF6B35] transition-colors">
                    <i class="bx bxl-facebook-circle text-xl"></i>
                </a>
                <a href="#" class="text-gray-500 hover:text-[#25D366] transition-colors">
                    <i class="bx bxl-whatsapp text-xl"></i>
                </a>
                <a href="#" class="text-gray-500 hover:text-[#0088cc] transition-colors">
                    <i class="bx bxl-telegram text-xl"></i>
                </a>
            </div>
        </div>
    </div>

    <!-- Menu bar -->
    <nav class="bg-white w-full max-w-6xl mx-auto relative z-50 shadow-md border-b-2 border-[#FF6B35]">
        <div class="container mx-auto px-4">
            <!-- Desktop Menu -->
            <div class="hidden md:flex items-center justify-center">
                <ul class="flex items-center gap-0 flex-wrap justify-center">
                    <li v-for="(item, index) in mainMenuItems" :key="index" class="relative group"
                        @mouseenter="item.hasSubmenu ? openTourMenu() : null"
                        @mouseleave="item.hasSubmenu ? closeTourMenu() : null">
                        <NuxtLink :to="item.hasSubmenu ? '#' : item.path" :class="[
                            'flex items-center gap-1 px-3 md:px-4 py-3 md:py-4 text-sm md:text-base font-semibold transition-all duration-300 relative',
                            isActive(item.path)
                                ? 'text-[#FF6B35] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-[#FF6B35] after:to-[#E91E63]'
                                : 'text-gray-700 hover:text-[#FF6B35]'
                        ]">
                            <span class="text-xs md:text-sm">▸</span>
                            <span>{{ item.name }}</span>
                        </NuxtLink>

                        <!-- Submenu for Tour and Prices -->
                        <div v-if="item.hasSubmenu && isTourMenuOpen"
                            class="absolute left-0 top-full bg-white min-w-[220px] shadow-2xl z-50 mt-0 border-t-2 border-[#FF6B35] rounded-b-lg"
                            @mouseenter="openTourMenu()" @mouseleave="closeTourMenu()">
                            <ul class="py-2">
                                <li v-for="(tour, tourIndex) in tourMenu" :key="tourIndex">
                                    <NuxtLink :to="tour.path" :class="[
                                        'flex items-center gap-2 px-4 py-3 text-sm md:text-base font-medium text-gray-700 hover:bg-gradient-to-r hover:from-[#FFF5F0] hover:to-[#FFE8E0] hover:text-[#FF6B35] transition-all duration-300',
                                        route.path === tour.path ? 'bg-gradient-to-r from-[#FFF5F0] to-[#FFE8E0] text-[#FF6B35]' : ''
                                    ]">
                                        <span class="text-xs">▸</span>
                                        <span>{{ tour.name }}</span>
                                    </NuxtLink>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>

            <!-- Mobile Menu -->
            <div class="md:hidden">
                <button @click="toggleMobileMenu"
                    class="w-full flex items-center justify-between px-4 py-3 text-gray-700 font-medium">
                    <span class="flex items-center gap-1">
                        <span class="text-xs">▸</span>
                        <span>Menu</span>
                    </span>
                    <svg class="w-5 h-5 transition-transform duration-200" :class="{ 'rotate-180': isMobileMenuOpen }"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <transition name="slide-down">
                    <div v-if="isMobileMenuOpen" class="bg-gray-50">
                        <ul class="py-2">
                            <li v-for="(item, index) in mainMenuItems" :key="index">
                                <NuxtLink :to="item.path" @click="closeMobileMenu" :class="[
                                    'flex items-center gap-1 px-4 py-3 text-sm text-gray-700 hover:bg-[#FFF5F0] hover:text-[#FF6B35] transition-all duration-300',
                                    isActive(item.path) ? 'bg-[#FFF5F0] text-[#FF6B35] font-semibold' : ''
                                ]">
                                    <span class="text-xs">▸</span>
                                    <span>{{ item.name }}</span>
                                </NuxtLink>

                                <!-- Tour submenu items on mobile -->
                                <div v-if="item.hasSubmenu && isActive(item.path)" class="bg-white pl-8">
                                    <ul>
                                        <li v-for="(tour, tourIndex) in tourMenu" :key="tourIndex">
                                            <NuxtLink :to="tour.path" @click="closeMobileMenu" :class="[
                                                'flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:bg-[#FFF5F0] hover:text-[#FF6B35] transition-all duration-300',
                                                route.path === tour.path ? 'bg-[#FFF5F0] text-[#FF6B35]' : ''
                                            ]">
                                                <span class="text-xs">▸</span>
                                                <span>{{ tour.name }}</span>
                                            </NuxtLink>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </transition>
            </div>
        </div>
    </nav>

    <!-- Hero Carousel -->
    <header class="relative w-full max-w-6xl mx-auto overflow-hidden">
        <div class="relative w-full" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
            <!-- Main Image Container -->
            <div class="relative w-full h-[450px] md:h-[550px] lg:h-[650px] overflow-hidden">
                <!-- Slide Images -->
                <div class="absolute inset-0 transition-transform duration-700 ease-in-out"
                    :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
                    <div v-for="(slide, index) in slides" :key="index" class="absolute inset-0 w-full h-full"
                        :style="{ left: `${index * 100}%` }">
                        <img :src="slide.image" :alt="`Slide ${index + 1}`" class="w-full h-full object-cover brightness-90"
                            @error="(e) => { e.target.style.display = 'none' }" />
                        <!-- Dark Overlay -->
                        <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50"></div>
                    </div>
                </div>

                <!-- Hero Content Overlay -->
                <div class="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
                    <h1 class="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-2xl">
                        VIETNAM MOTORBIKE TOURS
                    </h1>
                    <p class="text-white text-lg md:text-xl lg:text-2xl mb-2 italic drop-shadow-lg">
                        Khám phá vẻ đẹp vô tận của Việt Nam
                    </p>
                    <p class="text-white/90 text-base md:text-lg mb-8 drop-shadow-lg font-light italic">
                        Discover the endless beauty of Vietnam
                    </p>
                    <NuxtLink to="/tour" 
                        class="bg-gradient-to-r from-[#FF6B35] to-[#FF5722] hover:from-[#FF5722] hover:to-[#E91E63] text-white px-10 py-4 rounded-full font-bold text-lg shadow-2xl transform hover:scale-110 transition-all duration-300 uppercase tracking-wider">
                        BOOK TOUR
                    </NuxtLink>
                </div>

                <!-- Navigation Buttons (only visible on hover) -->
                <button v-if="isHovering" @click="prevSlide"
                    class="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300"
                    aria-label="Previous slide">
                    <svg class="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button v-if="isHovering" @click="nextSlide"
                    class="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300"
                    aria-label="Next slide">
                    <svg class="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <!-- Pagination Indicators -->
            <div class="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-2 z-20">
                <button v-for="(slide, index) in slides" :key="index" @click="goToSlide(index)" :class="[
                    'transition-all duration-300 rounded-full',
                    currentSlide === index
                        ? 'w-12 h-3 bg-gradient-to-r from-[#FF6B35] to-[#E91E63]'
                        : 'w-3 h-3 bg-white/60 hover:bg-white'
                ]">
                </button>
            </div>
        </div>
    </header>
    <!-- Depart from - Quick Links -->
    <div class="hidden md:block bg-white border-t border-gray-200 relative max-w-6xl mx-auto shadow-sm">
        <div class="container mx-auto px-4 py-4">
            <div class="flex justify-center items-center gap-4 flex-wrap">
                <span class="text-gray-700 font-bold text-sm uppercase tracking-wide">Depart From:</span>
                <NuxtLink v-for="(item, index) in tourMenu" :key="index" :to="item.path" :class="[
                    'px-4 py-2 text-sm font-medium rounded-full transition-all duration-300',
                    route.path === item.path 
                        ? 'bg-gradient-to-r from-[#FF6B35] to-[#E91E63] text-white shadow-md' 
                        : 'text-gray-600 hover:text-[#FF6B35] hover:bg-[#FFF5F0]'
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