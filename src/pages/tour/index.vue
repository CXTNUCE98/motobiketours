<script setup>
import { ref, computed } from 'vue';
import { tours } from '../../composables/mockup';
import TourFilter from '../../components/TourFilter.vue';

const searchQuery = ref('');
const showFilters = ref(false);
const viewMode = ref('grid'); // 'grid' or 'list'
const sortBy = ref('default'); // 'default', 'price-low', 'price-high', 'duration'

// Pagination state
const currentPage = ref(1);
const itemsPerPage = 6;

// Filter state
const activeFilters = ref({
    duration: [],
    priceRange: { min: 0, max: 2000 },
    tourTypes: [],
    departFrom: ''
});

// Helper to parse duration
const getDurationDays = (durationStr) => {
    if (!durationStr) return 0;
    if (durationStr.includes('1/2')) return 0.5;
    const match = durationStr.match(/(\d+)\s*day/);
    return match ? parseInt(match[1]) : 0;
};

// Helper to check tour type
const checkTourType = (tourTypeStr, selectedTypes) => {
    if (selectedTypes.length === 0) return true;
    const lowerType = tourTypeStr.toLowerCase();
    return selectedTypes.some(type => {
        if (type === 'adventure') return lowerType.includes('adventure') || lowerType.includes('trekking') || lowerType.includes('easy rider') || lowerType.includes('mountain pass');
        if (type === 'cultural') return lowerType.includes('culture') || lowerType.includes('heritage') || lowerType.includes('history') || lowerType.includes('food');
        if (type === 'beach') return lowerType.includes('beach') || lowerType.includes('island') || lowerType.includes('coastal') || lowerType.includes('sand dune');
        if (type === 'mountain') return lowerType.includes('mountain') || lowerType.includes('highland') || lowerType.includes('dalat') || lowerType.includes('sapa') || lowerType.includes('ha giang');
        if (type === 'city') return lowerType.includes('city') || lowerType.includes('saigon') || lowerType.includes('hanoi') || lowerType.includes('danang') || lowerType.includes('hue');
        return lowerType.includes(type);
    });
};

// Filtered and sorted tours
const filteredTours = computed(() => {
    let result = [...tours];

    // Search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(tour =>
            tour.title.toLowerCase().includes(query) ||
            tour.routes.toLowerCase().includes(query) ||
            tour.type.toLowerCase().includes(query)
        );
    }

    // Depart from filter
    if (activeFilters.value.departFrom) {
        const filterDepart = activeFilters.value.departFrom.replace(/-/g, ' ').toLowerCase();
        result = result.filter(tour =>
            tour.departFrom.toLowerCase().includes(filterDepart)
        );
    }

    // Duration filter
    if (activeFilters.value.duration.length > 0) {
        result = result.filter(tour => {
            const days = getDurationDays(tour.duration);
            return activeFilters.value.duration.some(range => {
                if (range === '1-3') return days >= 0 && days <= 3;
                if (range === '4-7') return days >= 4 && days <= 7;
                if (range === '8+') return days >= 8;
                return false;
            });
        });
    }

    // Price filter
    if (activeFilters.value.priceRange) {
        const { min, max } = activeFilters.value.priceRange;
        result = result.filter(tour => {
            const price = typeof tour.priceUsd === 'number' ? tour.priceUsd : 0;
            return price >= min && price <= max;
        });
    }

    // Tour Type filter
    if (activeFilters.value.tourTypes.length > 0) {
        result = result.filter(tour => checkTourType(tour.type, activeFilters.value.tourTypes));
    }

    // Sort
    if (sortBy.value === 'price-low') {
        result.sort((a, b) => {
            const priceA = typeof a.priceUsd === 'number' ? a.priceUsd : 0;
            const priceB = typeof b.priceUsd === 'number' ? b.priceUsd : 0;
            return priceA - priceB;
        });
    } else if (sortBy.value === 'price-high') {
        result.sort((a, b) => {
            const priceA = typeof a.priceUsd === 'number' ? a.priceUsd : 0;
            const priceB = typeof b.priceUsd === 'number' ? b.priceUsd : 0;
            return priceB - priceA;
        });
    } else if (sortBy.value === 'duration') {
        result.sort((a, b) => {
            const daysA = getDurationDays(a.duration);
            const daysB = getDurationDays(b.duration);
            return daysA - daysB;
        });
    }

    return result;
});

// Pagination
const totalPages = computed(() => Math.ceil(filteredTours.value.length / itemsPerPage));

const paginatedTours = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredTours.value.slice(start, end);
});

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const handleApplyFilters = (filters) => {
    activeFilters.value = filters;
    currentPage.value = 1; // Reset to first page on filter change
};

const handleClearFilters = () => {
    activeFilters.value = {
        duration: [],
        priceRange: { min: 0, max: 2000 },
        tourTypes: [],
        departFrom: ''
    };
    searchQuery.value = '';
    currentPage.value = 1;
};
</script>

<template>
    <div
        class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-pink-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <!-- Hero Section -->
        <div
            class="relative bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 dark:from-blue-900 dark:via-cyan-900 dark:to-blue-900 text-white py-20 overflow-hidden">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-10">
                <div class="absolute inset-0"
                    style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');">
                </div>
            </div>

            <div class="container mx-auto px-4 relative z-10">
                <div class="max-w-4xl mx-auto text-center">
                    <h1 class="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                        <span class="block">Khám Phá</span>
                        <span class="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                            Tour Du Lịch Xe Máy
                        </span>
                    </h1>
                    <p class="text-xl md:text-2xl mb-8 text-blue-100 dark:text-blue-200">
                        Trải nghiệm Việt Nam theo cách đặc biệt nhất
                    </p>

                    <!-- Search Bar -->
                    <div class="max-w-2xl mx-auto">
                        <div class="relative">
                            <input v-model="searchQuery" type="text"
                                placeholder="Tìm kiếm tour theo tên, địa điểm, loại hình..."
                                class="w-full px-6 py-5 pr-14 rounded-2xl text-gray-800 dark:text-white bg-white dark:bg-gray-800 text-lg shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/50 dark:focus:ring-gray-600/50 transition-all duration-300 placeholder-gray-400" />
                            <button
                                class="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-red-600 to-pink-600 text-white p-3 rounded-xl hover:scale-110 transition-transform duration-300 shadow-lg">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Quick Stats -->
                    <div class="grid grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
                        <div class="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                            <div class="text-3xl font-bold">{{ tours.length }}+</div>
                            <div class="text-sm text-blue-100">Tours</div>
                        </div>
                        <div class="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                            <div class="text-3xl font-bold">1000+</div>
                            <div class="text-sm text-blue-100">Khách hàng</div>
                        </div>
                        <div class="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                            <div class="text-3xl font-bold">5.0</div>
                            <div class="text-sm text-blue-100">Đánh giá</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Wave Divider -->
            <div class="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
                    <path
                        d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                        class="fill-gray-50 dark:fill-gray-900 transition-colors duration-300" />
                </svg>
            </div>
        </div>

        <!-- Main Content -->
        <div class="container mx-auto px-4 py-12">
            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Sidebar Filter (Desktop) -->
                <div class="hidden lg:block lg:w-80 flex-shrink-0">
                    <TourFilter @apply="handleApplyFilters" @clear="handleClearFilters" />
                </div>

                <!-- Tours Content -->
                <div class="flex-1">
                    <!-- Toolbar -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-8 flex flex-wrap items-center justify-between gap-4 transition-colors duration-300">
                        <div class="flex items-center gap-3">
                            <span class="text-gray-700 dark:text-gray-300 font-semibold">
                                {{ filteredTours.length }} tours
                            </span>
                            <span class="text-gray-400">|</span>
                            <button @click="showFilters = !showFilters"
                                class="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-300 font-medium">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                Bộ lọc
                            </button>
                        </div>

                        <div class="flex items-center gap-3">
                            <!-- Sort Dropdown -->
                            <select v-model="sortBy"
                                class="px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all duration-300 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 cursor-pointer">
                                <option value="default">Mặc định</option>
                                <option value="price-low">Giá thấp đến cao</option>
                                <option value="price-high">Giá cao đến thấp</option>
                                <option value="duration">Thời gian</option>
                            </select>

                            <!-- View Mode Toggle -->
                            <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                <button @click="viewMode = 'grid'" class="p-2 rounded transition-all duration-300"
                                    :class="viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-md text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                                <button @click="viewMode = 'list'" class="p-2 rounded transition-all duration-300"
                                    :class="viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-md text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Tours Grid/List -->
                    <div v-if="filteredTours.length > 0">
                        <div
                            :class="viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-6'">
                            <div v-for="(tour, index) in paginatedTours" :key="tour.id" class="animate-fade-in"
                                :style="{ animationDelay: `${index * 0.1}s` }">
                                <!-- Grid View -->
                                <NuxtLink v-if="viewMode === 'grid'" :to="`/tour/${tour.id}`" class="block group">
                                    <div
                                        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                                        <!-- Image -->
                                        <div class="relative h-56 overflow-hidden">
                                            <img :src="tour.thumbnail" :alt="tour.title"
                                                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div
                                                class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500">
                                            </div>

                                            <!-- Duration Badge -->
                                            <div
                                                class="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg flex items-center gap-2">
                                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                                {{ tour.duration }}
                                            </div>
                                        </div>

                                        <!-- Content -->
                                        <div class="p-5">
                                            <h3
                                                class="text-lg font-bold text-gray-800 dark:text-white mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                                {{ tour.title }}
                                            </h3>

                                            <div class="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
                                                <div class="flex items-center gap-2">
                                                    <svg class="w-4 h-4 text-orange-500" fill="currentColor"
                                                        viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd"
                                                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                            clip-rule="evenodd" />
                                                    </svg>
                                                    <span class="line-clamp-1">{{ tour.departFrom }}</span>
                                                </div>
                                                <div class="flex items-center gap-2">
                                                    <svg class="w-4 h-4 text-green-500" fill="currentColor"
                                                        viewBox="0 0 20 20">
                                                        <path
                                                            d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                                    </svg>
                                                    <span class="line-clamp-1">{{ tour.routes }}</span>
                                                </div>
                                            </div>

                                            <div
                                                class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                                <div
                                                    class="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                                                    ${{ tour.priceUsd }}
                                                </div>
                                                <button
                                                    class="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform duration-300 shadow-md">
                                                    Xem chi tiết
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </NuxtLink>

                                <!-- List View -->
                                <NuxtLink v-else :to="`/tour/${tour.id}`" class="block group">
                                    <div
                                        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl border border-gray-100 dark:border-gray-700">
                                        <div class="flex flex-col md:flex-row">
                                            <!-- Image -->
                                            <div class="relative md:w-80 h-56 md:h-auto overflow-hidden flex-shrink-0">
                                                <img :src="tour.thumbnail" :alt="tour.title"
                                                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                <div
                                                    class="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg flex items-center gap-2">
                                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                            clip-rule="evenodd" />
                                                    </svg>
                                                    {{ tour.duration }}
                                                </div>
                                            </div>

                                            <!-- Content -->
                                            <div class="flex-1 p-6 flex flex-col justify-between">
                                                <div>
                                                    <h3
                                                        class="text-2xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                                        {{ tour.title }}
                                                    </h3>

                                                    <div class="space-y-2 mb-4 text-gray-600 dark:text-gray-300">
                                                        <div class="flex items-center gap-2">
                                                            <svg class="w-5 h-5 text-orange-500" fill="currentColor"
                                                                viewBox="0 0 20 20">
                                                                <path fill-rule="evenodd"
                                                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                                    clip-rule="evenodd" />
                                                            </svg>
                                                            <span><strong>Khởi hành:</strong> {{ tour.departFrom
                                                            }}</span>
                                                        </div>
                                                        <div class="flex items-start gap-2">
                                                            <svg class="w-5 h-5 text-green-500 mt-0.5"
                                                                fill="currentColor" viewBox="0 0 20 20">
                                                                <path fill-rule="evenodd"
                                                                    d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z"
                                                                    clip-rule="evenodd" />
                                                            </svg>
                                                            <span><strong>Lộ trình:</strong> {{ tour.routes }}</span>
                                                        </div>
                                                        <div class="flex items-start gap-2">
                                                            <svg class="w-5 h-5 text-purple-500 mt-0.5"
                                                                fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                                                <path fill-rule="evenodd"
                                                                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                                                                    clip-rule="evenodd" />
                                                            </svg>
                                                            <span class="line-clamp-2"><strong>Loại:</strong> {{
                                                                tour.type
                                                            }}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div
                                                    class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                                    <div
                                                        class="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                                                        ${{ tour.priceUsd }}
                                                    </div>
                                                    <button
                                                        class="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:scale-105 transition-transform duration-300 shadow-lg flex items-center gap-2">
                                                        <span>Xem chi tiết</span>
                                                        <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                                            viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                                stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </NuxtLink>
                            </div>
                        </div>

                        <!-- Pagination -->
                        <div v-if="totalPages > 1" class="flex justify-center mt-12 gap-2">
                            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                                class="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 text-gray-600 dark:text-gray-300">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <button v-for="page in totalPages" :key="page" @click="changePage(page)"
                                class="w-10 h-10 rounded-lg font-medium transition-all duration-300"
                                :class="currentPage === page
                                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-110'
                                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'">
                                {{ page }}
                            </button>

                            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                                class="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 text-gray-600 dark:text-gray-300">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-else class="text-center py-20">
                        <div class="inline-block p-8 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
                            <svg class="w-24 h-24 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Không tìm thấy tour nào</h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-6">Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm của bạn
                        </p>
                        <button @click="handleClearFilters"
                            class="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform duration-300 shadow-lg">
                            Xóa bộ lọc
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.6s ease-out forwards;
    opacity: 0;
}

.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>