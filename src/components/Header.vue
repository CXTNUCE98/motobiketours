<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isScrolled = ref(false)

// Handle scroll event with throttling
let scrollTimeout: ReturnType<typeof setTimeout> | null = null

const handleScroll = () => {
    if (process.client) {
        // Clear existing timeout
        if (scrollTimeout) {
            clearTimeout(scrollTimeout)
        }

        // Throttle scroll event
        scrollTimeout = setTimeout(() => {
            isScrolled.value = window.scrollY > 10
        }, 10)
    }
}

// Menu items với tiếng Việt
const menuItems = [
    { name: 'TRANG CHỦ', path: '/', icon: '' },
    { name: 'GIỚI THIỆU', path: '/about', icon: '' },
    { name: 'TOUR DU LỊCH', path: '/tour', hasDropdown: true, icon: '' },
    { name: 'DỊCH VỤ', path: '/services', hasDropdown: true, icon: '' },
    { name: 'TIN TỨC', path: '/news', hasDropdown: true, icon: '' },
    { name: 'THƯ VIỆN', path: '/photos', hasDropdown: true, icon: '' },
    { name: 'LIÊN HỆ', path: '/contact', icon: '' },
]

const cartCount = ref(0)
const showMobileMenu = ref(false)

// Carousel
const currentSlide = ref(0)
const totalSlides = 3
const isHovering = ref(false)

const slides = [
    {
        title: 'Tìm Chuyến Tham Quan Hoàn Hảo Của Bạn Tại Trekeel',
        subtitle: 'Khám Phá Thế Giới',
        description: 'Địa điểm độc đáo cả trong và ngoài nước. Mạng đến sự đa dạng để khách hàng thoải mái lựa chọn chuyến đi cho riêng mình.',
        image: '/carousel/1.jpg',
        videoThumb: '/carousel/2.jpg'
    },
    {
        title: 'Khám Phá Vẻ Đẹp Việt Nam',
        subtitle: 'Du Lịch Trọn Vẹn',
        description: 'Trải nghiệm những điểm đến tuyệt vời nhất tại Việt Nam cùng đội ngũ hướng dẫn viên chuyên nghiệp.',
        image: '/carousel/3.jpg',
        videoThumb: '/carousel/4.jpg'
    },
    {
        title: 'Hành Trình Đáng Nhớ',
        subtitle: 'Kỷ Niệm Khó Quên',
        description: 'Tạo nên những kỷ niệm đẹp cùng gia đình và bạn bè trong những chuyến đi khó quên.',
        image: '/carousel/5.jpg',
        videoThumb: '/carousel/6.jpg'
    }
]

const isActive = (path: string) => {
    if (path === '/') {
        return route.path === '/'
    }
    return route.path.startsWith(path)
}

const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % totalSlides
}

const prevSlide = () => {
    currentSlide.value = (currentSlide.value - 1 + totalSlides) % totalSlides
}

const goToSlide = (index: number) => {
    currentSlide.value = index
}

// Auto-play carousel
let autoPlayInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
    // Setup scroll listener
    if (process.client) {
        window.addEventListener('scroll', handleScroll)
        handleScroll() // Check initial scroll position
    }

    // Setup carousel auto-play
    autoPlayInterval = setInterval(() => {
        if (!isHovering.value) {
            nextSlide()
        }
    }, 5000)
})

onBeforeUnmount(() => {
    // Cleanup scroll listener
    if (process.client) {
        window.removeEventListener('scroll', handleScroll)
        if (scrollTimeout) {
            clearTimeout(scrollTimeout)
        }
    }

    // Cleanup carousel interval
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval)
    }
})
</script>

<template>
    <!-- Main Header - Fixed at top -->
    <header class="fixed top-0 left-0 right-0 z-[999] border-b border-gray-200 transition-all duration-300 bg-white"
        :class="isScrolled ? 'shadow-lg' : 'shadow-sm'" style="will-change: transform;">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex items-center justify-between h-16 md:h-20">
                <!-- Logo -->
                <NuxtLink to="/" class="flex items-center">
                    <div class="text-2xl md:text-3xl font-bold">
                        <span class="text-gray-800">TREK</span><span class="text-[#E91E63]">EEL</span>
                    </div>
                </NuxtLink>

                <!-- Desktop Navigation -->
                <nav class="hidden lg:flex items-center space-x-1">
                    <NuxtLink v-for="item in menuItems" :key="item.path" :to="item.path" :class="[
                        'px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1',
                        isActive(item.path)
                            ? 'text-[#E91E63]'
                            : 'text-gray-700 hover:text-[#E91E63]'
                    ]">
                        {{ item.name }}
                        <svg v-if="item.hasDropdown" class="w-3 h-3" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </NuxtLink>
                </nav>

                <!-- Right Icons -->
                <div class="flex items-center gap-3 md:gap-4">
                    <!-- Search Icon -->
                    <button class="text-gray-700 hover:text-[#E91E63] transition-colors">
                        <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>

                    <!-- User Icon -->
                    <button class="text-gray-700 hover:text-[#E91E63] transition-colors">
                        <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </button>

                    <!-- Cart Icon with Badge -->
                    <button class="relative text-gray-700 hover:text-[#E91E63] transition-colors">
                        <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span
                            class="absolute -top-2 -right-2 bg-[#E91E63] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {{ cartCount }}
                        </span>
                    </button>

                    <!-- Language Selector -->
                    <button
                        class="hidden md:flex items-center gap-1 text-gray-700 hover:text-[#E91E63] transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                    </button>

                    <!-- Red Circle Button (notification or menu) -->
                    <button
                        class="w-8 h-8 md:w-9 md:h-9 bg-[#E91E63] rounded-full flex items-center justify-center text-white hover:bg-[#C2185B] transition-colors shadow-md">
                        <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>

                    <!-- Mobile Menu Toggle -->
                    <button @click="showMobileMenu = !showMobileMenu"
                        class="lg:hidden text-gray-700 hover:text-[#E91E63]">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Mobile Menu -->
            <div v-if="showMobileMenu" class="lg:hidden pb-4">
                <nav class="flex flex-col space-y-2">
                    <NuxtLink v-for="item in menuItems" :key="item.path" :to="item.path" @click="showMobileMenu = false"
                        :class="[
                            'px-4 py-2 text-sm font-medium transition-colors duration-200',
                            isActive(item.path)
                                ? 'text-[#E91E63] bg-pink-50'
                                : 'text-gray-700 hover:text-[#E91E63] hover:bg-gray-50'
                        ]">
                        {{ item.name }}
                    </NuxtLink>
                </nav>
            </div>
        </div>
    </header>

    <!-- Spacer for fixed header - matches header height -->
    <div class="h-16 md:h-20 w-full"></div>

    <div class="w-full bg-white">
        <!-- Hero Carousel Section -->
        <div class="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden bg-map"
            style="z-index: 1;">
            <div class="max-w-7xl mx-auto px-4 py-12 md:py-20">
                <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-12" @mouseenter="isHovering = true"
                    @mouseleave="isHovering = false">
                    <!-- Left Content -->
                    <div class="flex-1 text-center lg:text-left space-y-6 z-10">
                        <transition name="fade" mode="out-in">
                            <div :key="currentSlide">
                                <p class="text-gray-600 text-sm md:text-base font-medium mb-2">
                                    {{ slides[currentSlide].subtitle }}
                                </p>
                                <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-#094174 leading-tight mb-4">
                                    {{ slides[currentSlide].title }}
                                </h1>
                                <p
                                    class="text-gray-600 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                                    {{ slides[currentSlide].description }}
                                </p>
                                <NuxtLink to="/booking"
                                    class="inline-block bg-[#E91E63] hover:bg-[#C2185B] text-white px-8 py-3 md:px-10 md:py-4 rounded-lg font-bold text-sm md:text-base uppercase tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                    ĐẶT BÂY GIỜ
                                </NuxtLink>
                            </div>
                        </transition>
                    </div>

                    <!-- Right Image - Circular Design -->
                    <div class="flex-1 relative flex items-center justify-center">
                        <transition name="fade" mode="out-in">
                            <div :key="currentSlide" class="relative">
                                <!-- Main circular image -->
                                <div
                                    class="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]">
                                    <!-- Background decorative circles -->
                                    <div
                                        class="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl">
                                    </div>

                                    <!-- Main image circle -->
                                    <div
                                        class="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-8 border-white">
                                        <img :src="slides[currentSlide].image" :alt="slides[currentSlide].title"
                                            class="w-full h-full object-cover" />
                                    </div>

                                    <!-- Video thumbnail overlay (top left) -->
                                    <div
                                        class="absolute -top-4 -left-4 md:-top-8 md:-left-8 w-32 h-24 md:w-48 md:h-36 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white transform hover:scale-105 transition-transform duration-300">
                                        <img :src="slides[currentSlide].videoThumb" alt="Video"
                                            class="w-full h-full object-cover" />
                                        <!-- Play button -->
                                        <div class="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <button
                                                class="w-12 h-12 md:w-16 md:h-16 bg-[#E91E63] rounded-full flex items-center justify-center shadow-lg hover:bg-[#C2185B] transition-colors">
                                                <svg class="w-5 h-5 md:w-7 md:h-7 text-white ml-1" fill="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Airplane icon (bottom right) -->
                                    <!-- <div class="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-20 h-20 md:w-24 md:h-24 bg-white rounded-full shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                    <svg class="w-10 h-10 md:w-12 md:h-12 text-[#E91E63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                    </svg>
                  </div> -->
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>

                <!-- Carousel Indicators -->
                <div class="flex justify-center items-center gap-2 mt-8 lg:mt-12">
                    <button v-for="index in totalSlides" :key="index" @click="goToSlide(index - 1)" :class="[
                        'transition-all duration-300',
                        currentSlide === index - 1
                            ? 'w-8 h-2 bg-[#E91E63] rounded-full'
                            : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400'
                    ]"></button>
                </div>
            </div>

            <!-- Decorative elements -->
            <div class="absolute top-10 right-10 w-20 h-20 bg-blue-200/20 rounded-full blur-2xl"></div>
            <div class="absolute bottom-20 left-20 w-32 h-32 bg-purple-200/20 rounded-full blur-3xl"></div>
        </div>
    </div>
</template>

<style scoped>
/* Fade transition for carousel */
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

/* Custom scrollbar for dropdowns */
select {
    scrollbar-width: thin;
    scrollbar-color: #E91E63 #f1f1f1;
}

select::-webkit-scrollbar {
    width: 8px;
}

select::-webkit-scrollbar-track {
    background: #f1f1f1;
}

select::-webkit-scrollbar-thumb {
    background: #E91E63;
    border-radius: 4px;
}

select::-webkit-scrollbar-thumb:hover {
    background: #C2185B;
}

.bg-map {
    background-image: url('/map.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-blend-mode: overlay;
}
</style>
