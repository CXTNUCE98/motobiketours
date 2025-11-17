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

const isActive = (path: string) => {
    if (path === '/') {
        return route.path === '/'
    }
    return route.path.startsWith(path)
}

onMounted(() => {
    // Setup scroll listener
    if (process.client) {
        window.addEventListener('scroll', handleScroll)
        handleScroll() // Check initial scroll position
    }
})

onBeforeUnmount(() => {
    // Cleanup scroll listener
    if (process.client) {
        window.removeEventListener('scroll', handleScroll)
        if (scrollTimeout) {
            clearTimeout(scrollTimeout)
        }
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
                        <span class="text-gray-800">THE</span><span class="text-[#E91E63]">AN</span>
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
</template>

<style scoped>
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
</style>
