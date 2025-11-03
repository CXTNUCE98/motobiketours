<script lang="ts" setup>
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
let autoPlayInterval: NodeJS.Timeout | null = null

// Keyboard navigation
const handleKeyDown = (event: KeyboardEvent) => {
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

    window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval)
    }
    window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
    <!-- Menu bar -->
    <nav class="bg-[#02964c] w-full max-w-6xl mx-auto relative z-50">
        <div class="container mx-auto px-4">
            <!-- Desktop Menu -->
            <div class="hidden md:flex items-center justify-center">
                <ul class="flex items-center gap-0 flex-wrap justify-center">
                    <li v-for="(item, index) in mainMenuItems" :key="index" class="relative group"
                        @mouseenter="item.hasSubmenu ? openTourMenu() : null"
                        @mouseleave="item.hasSubmenu ? closeTourMenu() : null">
                        <NuxtLink :to="item.hasSubmenu ? '#' : item.path" :class="[
                            'flex items-center gap-1 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base font-medium transition-all duration-200',
                            isActive(item.path)
                                ? 'text-[#FFFF00]'
                                : 'text-white hover:bg-[#c7b6b680]'
                        ]">
                            <span class="text-xs md:text-sm">▸</span>
                            <span>{{ item.name }}</span>
                        </NuxtLink>

                        <!-- Submenu for Tour and Prices -->
                        <div v-if="item.hasSubmenu && isTourMenuOpen"
                            class="absolute left-0 top-full bg-[#02964c] min-w-[200px] shadow-lg z-50 mt-0"
                            @mouseenter="openTourMenu()" @mouseleave="closeTourMenu()">
                            <ul class="py-2">
                                <li v-for="(tour, tourIndex) in tourMenu" :key="tourIndex">
                                    <NuxtLink :to="tour.path" :class="[
                                        'flex items-center gap-1 px-4 py-2 text-sm md:text-base text-[#FFFF00] hover:bg-[#6b7d47] transition-all duration-200',
                                        route.path === tour.path ? 'bg-[#6b7d47]' : ''
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
                    class="w-full flex items-center justify-between px-4 py-3 text-white font-medium">
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
                    <div v-if="isMobileMenuOpen" class="bg-[#027a3d]">
                        <ul class="py-2">
                            <li v-for="(item, index) in mainMenuItems" :key="index">
                                <NuxtLink :to="item.path" @click="closeMobileMenu" :class="[
                                    'flex items-center gap-1 px-4 py-2 text-sm text-white hover:bg-[#6b7d47] hover:text-[#FFFF00] transition-all duration-200',
                                    isActive(item.path) ? 'bg-[#6b7d47] text-[#FFFF00]' : ''
                                ]">
                                    <span class="text-xs">▸</span>
                                    <span>{{ item.name }}</span>
                                </NuxtLink>

                                <!-- Tour submenu items on mobile -->
                                <div v-if="item.hasSubmenu && isActive(item.path)" class="bg-[#025d2e] pl-8">
                                    <ul>
                                        <li v-for="(tour, tourIndex) in tourMenu" :key="tourIndex">
                                            <NuxtLink :to="tour.path" @click="closeMobileMenu" :class="[
                                                'flex items-center gap-1 px-4 py-2 text-sm text-[#FFFF00] hover:bg-[#6b7d47] transition-all duration-200',
                                                route.path === tour.path ? 'bg-[#6b7d47]' : ''
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

    <header class="bg-[#202C3A] w-full max-w-6xl mx-auto">
        <div class="container">
            <div class="flex items-center justify-end">
                <!-- Right side - Motorcycle image -->
                <div class="flex-shrink-0 ml-8">
                    <img src="/logo_bg.jpg" alt="Motorcycle" class="h-24 md:h-32 lg:h-40 object-contain" />
                </div>
            </div>
        </div>
        <!-- Carousel -->
        <div class="relative w-full" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
            <!-- Main Image Container -->
            <div class="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
                <!-- Slide Images -->
                <div class="absolute inset-0 transition-transform duration-500 ease-in-out"
                    :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
                    <div v-for="(slide, index) in slides" :key="index" class="absolute inset-0 w-full h-full"
                        :style="{ left: `${index * 100}%` }">
                        <img :src="slide.image" :alt="`Slide ${index + 1}`" class="w-full h-full object-cover"
                            @error="(e: any) => { e.target.style.display = 'none' }" />
                    </div>
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
            <div
                class="absolute bottom-0 left-0 right-0 flex justify-center items-center gap-1.5 md:gap-2 py-4 bg-transparent flex-wrap px-4 w-full">
                <button v-for="(slide, index) in slides" :key="index" @click="goToSlide(index)" :class="[
                    'min-w-[36px] md:min-w-[44px] h-9 md:h-11 px-2 md:px-3 text-sm md:text-base font-semibold transition-all duration-300 rounded-sm',
                    currentSlide === index
                        ? 'bg-white text-[#202C3A] shadow-md scale-105'
                        : 'box-color text-white hover:bg-[#2a3540] hover:scale-105'
                ]">
                    {{ index }}
                </button>
            </div>
        </div>
    </header>
    <!-- Depart from -->
    <div
        class="hidden md:flex justify-center items-center gap-2 md:gap-4 py-2 bg-[#02964c] relative max-w-6xl mx-auto text-white text-sm md:text-base font-semibold flex-wrap px-4">
        <span>DEPART FROM:</span>
        <NuxtLink v-for="(item, index) in tourMenu" :key="index" :to="item.path" :class="[
            'px-2 md:px-3 transition-colors duration-200',
            route.path === item.path ? 'text-[#FFFF00]' : 'text-white hover:text-[#FFFF00]'
        ]">
            {{ item.name }}
        </NuxtLink>
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