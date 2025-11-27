<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'


import { useAuth } from '@/composables/useAuth'
import LoginPopup from '@/components/LoginPopup.vue'

const route = useRoute()
const router = useRouter()
const { theme, toggleTheme } = useTheme()
const { isAuthenticated, user, logout } = useAuth()
const isScrolled = ref(false)
const showLoginPopup = ref(false)
const handleLogout = () => {
    ElMessageBox.confirm(
        'Are you sure you want to log out?',
        'Warning',
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
            center: true,
        }
    )
        .then(() => {
            logout()
            router.push('/')

            ElMessage({
                type: 'success',
                message: 'Logout successfully!',
            })
        })

}

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
    { name: 'DỊCH VỤ', path: '/service', hasDropdown: true, icon: '' },
    { name: 'TIN TỨC', path: '/news', hasDropdown: true, icon: '' },
    { name: 'BLOG', path: '/blog', hasDropdown: true, icon: '' },
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

function formLogin() {
    showLoginPopup.value = true
}
</script>

<template>
    <!-- Main Header - Fixed at top -->
    <header
        class="fixed top-0 left-0 right-0 z-[999] border-b border-slate-200 dark:border-slate-700 transition-all duration-300 bg-white dark:bg-slate-900"
        :class="isScrolled ? 'shadow-lg' : 'shadow-sm'" style="will-change: transform;">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex items-center justify-between h-16 md:h-20">
                <!-- Logo -->
                <NuxtLink to="/" class="flex items-center">
                    <div class="text-2xl md:text-3xl font-bold">
                        <span class="text-slate-800 dark:text-white">AN</span><span
                            class="text-sky-500 dark:text-cyan-400">DAGO</span>
                    </div>
                </NuxtLink>

                <!-- Desktop Navigation -->
                <nav class="hidden lg:flex items-center space-x-1">
                    <NuxtLink v-for="item in menuItems" :key="item.path" :to="item.path" :class="[
                        'px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1',
                        isActive(item.path)
                            ? 'text-sky-500 dark:text-cyan-400'
                            : 'text-slate-700 dark:text-slate-300 hover:text-sky-500 dark:hover:text-cyan-400'
                    ]">
                        {{ item.name }}
                    </NuxtLink>
                </nav>

                <!-- Right Icons -->
                <div class="flex items-center gap-3 md:gap-4">
                    <!-- Search Icon -->
                    <button
                        class="text-slate-700 dark:text-slate-300 hover:text-sky-500 dark:hover:text-cyan-400 transition-colors">
                        <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>

                    <!-- User Icon / Profile Menu -->
                    <div class="relative">
                        <button v-if="!isAuthenticated" @click="formLogin"
                            class="text-slate-700 dark:text-slate-300 hover:text-sky-500 dark:hover:text-cyan-400 transition-colors">
                            <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </button>

                        <!-- Authenticated User Dropdown -->
                        <div v-else class="group relative">
                            <button
                                class="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-sky-500 dark:hover:text-cyan-400 transition-colors">
                                <div
                                    class="w-8 h-8 rounded-full bg-sky-100 dark:bg-slate-700 flex items-center justify-center text-sky-600 dark:text-cyan-400 font-bold text-sm">
                                    <img class="w-full h-full rounded-full object-cover border border-gray-200 [image-rendering:-webkit-optimize-contrast] image-crisp"
                                        :src="user?.avatar" alt="avatar">
                                </div>
                                <span class="hidden md:block font-medium text-sm max-w-[100px] truncate">
                                    {{ user?.userName || 'User' }}
                                </span>
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <!-- Dropdown Menu -->
                            <div
                                class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                                <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                                    <p class="text-sm font-medium text-slate-900 dark:text-white truncate">{{
                                        user?.userName
                                        }}</p>
                                    <p class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ user?.email }}</p>
                                </div>

                                <NuxtLink to="/profile"
                                    class="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-sky-500 dark:hover:text-cyan-400 transition-colors">
                                    Profile Settings
                                </NuxtLink>

                                <button @click="handleLogout"
                                    class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Cart Icon with Badge -->
                    <button
                        class="relative text-slate-700 dark:text-slate-300 hover:text-sky-500 dark:hover:text-cyan-400 transition-colors">
                        <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span
                            class="absolute -top-2 -right-2 bg-gradient-to-r from-sky-500 to-blue-600 dark:from-cyan-500 dark:to-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {{ cartCount }}
                        </span>
                    </button>

                    <!-- Language Selector -->
                    <button
                        class="hidden md:flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-sky-500 dark:hover:text-cyan-400 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                    </button>

                    <!-- Dark | Light theme -->
                    <button @click="toggleTheme"
                        class="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300">
                        <!-- Sun icon for light mode -->
                        <svg v-if="theme === 'dark'" class="w-5 h-5" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <!-- Moon icon for dark mode -->
                        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    </button>


                    <!-- Mobile Menu Toggle -->
                    <button @click="showMobileMenu = !showMobileMenu"
                        class="lg:hidden text-slate-700 dark:text-slate-300 hover:text-sky-500 dark:hover:text-cyan-400">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Mobile Menu -->
            <div v-if="showMobileMenu" class="lg:hidden pb-4 bg-white dark:bg-slate-900">
                <nav class="flex flex-col space-y-2">
                    <NuxtLink v-for="item in menuItems" :key="item.path" :to="item.path" @click="showMobileMenu = false"
                        :class="[
                            'px-4 py-2 text-sm font-medium transition-colors duration-200',
                            isActive(item.path)

                                ? 'text-sky-500 dark:text-cyan-400 bg-sky-50 dark:bg-slate-800'
                                : 'text-slate-700 dark:text-slate-300 hover:text-sky-500 dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        ]">
                        {{ item.name }}
                    </NuxtLink>
                </nav>
            </div>
        </div>
        <LoginPopup v-model="showLoginPopup" />
    </header>
</template>

<style scoped>
/* Custom scrollbar for dropdowns */
select {
    scrollbar-width: thin;
    scrollbar-color: #1A71C7 #f1f1f1;
}

select::-webkit-scrollbar {
    width: 8px;
}

select::-webkit-scrollbar-track {
    background: #f1f1f1;
}

select::-webkit-scrollbar-thumb {
    background: #1A71C7;
    border-radius: 4px;
}

select::-webkit-scrollbar-thumb:hover {
    background: #C2185B;
}

.image-crisp {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    image-rendering: high-quality;
}
</style>
