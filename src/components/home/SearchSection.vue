<script setup lang="ts">
import { ref } from 'vue';
import { locations } from '@/data/homeData';
import { logger } from '~/utils/logger';

const router = useRouter();
const searchForm = ref({
    keyword: '',
    location: 'all',
    duration: '' // Renamed from brand
});

const durationOptions = [
    { value: '', label: 'Số ngày' },
    { value: '1-3', label: '1-3 ngày' },
    { value: '4-7', label: '4-7 ngày' },
    { value: '8+', label: '8+ ngày' },
];

const handleSearch = () => {
    logger.log('Search:', searchForm.value);
    router.push(`/tour?keyword=${searchForm.value.keyword}&location=${searchForm.value.location}&duration=${searchForm.value.duration}`);
};
</script>

<template>
    <section class="fade-in-section py-12 md:py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div class="max-w-6xl mx-auto px-4">
            <!-- Header Text -->
            <div class="text-center mb-8 md:mb-12">
                <p class="text-red-600 dark:text-red-400 text-sm md:text-base font-medium mb-2">
                    Tìm Chuyến Tham Quan Hoàn Hảo Theo Sở Thích Của Bạn !!
                </p>
                <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#094174] dark:text-blue-400">
                    Tìm Kiếm Chuyến Đi Tốt Nhất Của Bạn
                </h2>
            </div>

            <!-- Search Bar Container -->
            <div
                class="bg-white dark:bg-gray-800 rounded-16px md:rounded-full shadow-xl p-2 md:p-3 flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0 transition-colors duration-300">
                <!-- Keyword Input -->
                <div class="flex-1 md:flex-[2]">
                    <input v-model="searchForm.keyword" type="text" placeholder="Nhập từ khóa......"
                        class="w-full h-12 md:h-14 px-4 md:px-6 rounded-full md:rounded-l-full md:rounded-r-none border border-gray-200 dark:border-gray-700 focus:outline-none text-sm md:text-base bg-transparent dark:text-white placeholder-gray-400" />
                </div>

                <!-- Location Dropdown -->
                <div class="flex-1 relative">
                    <select v-model="searchForm.location"
                        class="w-full h-12 md:h-14 px-4 md:px-6 rounded-full md:rounded-none border border-gray-200 dark:border-gray-700 border-l-0 focus:outline-none appearance-none bg-white dark:bg-gray-800 text-sm md:text-base cursor-pointer dark:text-white">
                        <option v-for="loc in locations" :key="loc.value" :value="loc.value">
                            {{ loc.label }}
                        </option>
                    </select>
                    <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                <!-- Duration Dropdown -->
                <div class="flex-1 relative">
                    <select v-model="searchForm.duration" placeholder="Chọn số ngày"
                        class="w-full h-12 md:h-14 px-4 md:px-6 rounded-full md:rounded-none border border-gray-200 dark:border-gray-700 border-l-0  focus:outline-none appearance-none bg-white dark:bg-gray-800 text-sm md:text-base cursor-pointer dark:text-white">
                        <option v-for="option in durationOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </option>
                    </select>
                    <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                <!-- Search Button -->
                <button @click="handleSearch"
                    class="w-full md:w-14 h-12 md:h-14 bg-[#1A71C7] hover:bg-[#C2185B] text-white rounded-full md:rounded-r-full md:rounded-l-none flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex-shrink-0">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    </section>
</template>
