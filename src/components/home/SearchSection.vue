<script setup lang="ts">
import { ref } from 'vue';
import { locations } from '@/data/homeData';
import { logger } from '~/utils/logger';

const router = useRouter();
const searchForm = ref({
    keyword: '',
    location: 'all',
    duration: ''
});

const durationOptions = [
    { value: '', label: 'Số ngày' },
    { value: '1-3', label: '1-3 ngày' },
    { value: '4-7', label: '4-7 ngày' },
    { value: '8+', label: '8+ ngày' },
];

const handleSearch = () => {
    logger.log('Search:', searchForm.value);
    router.push({
        path: '/tour',
        query: {
            keyword: searchForm.value.keyword || undefined,
            location: searchForm.value.location !== 'all' ? searchForm.value.location : undefined,
            duration: searchForm.value.duration || undefined
        }
    });
};
</script>

<template>
    <section class="py-16 md:py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div class="max-w-6xl mx-auto px-4">
            <!-- Header Text -->
            <div class="text-center mb-10 md:mb-14">
                <p
                    class="text-red-600 dark:text-red-400 font-semibold mb-3 tracking-wide uppercase text-sm md:text-base">
                    Khám phá Việt Nam !!
                </p>
                <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    Tìm Kiếm Chuyến Đi <span class="text-blue-600 dark:text-blue-400">Tốt Nhất</span> Của Bạn
                </h2>
                <p class="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                    Trải nghiệm những hành trình thú vị và đáng nhớ cùng chúng tôi
                </p>
            </div>

            <!-- Search Bar Container -->
            <div
                class="bg-white dark:bg-gray-800 rounded-2xl md:rounded-full shadow-xl shadow-gray-200/50 dark:shadow-none p-2 border border-gray-100 dark:border-gray-700">
                <div
                    class="flex flex-col md:flex-row items-stretch divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700">

                    <!-- Keyword Input -->
                    <div class="flex-1 relative group px-2 md:px-4 py-2">
                        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 ml-9">Từ
                            khóa</label>
                        <div class="relative flex items-center">
                            <div class="absolute left-2 text-gray-400 transition-colors">
                                <i class="i-carbon-search text-xl"></i>
                            </div>
                            <input v-model="searchForm.keyword" type="text" placeholder="Bạn muốn đi đâu?"
                                class="w-full h-10 pl-10 pr-4 bg-transparent outline-none rounded-2 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-400 font-medium"
                                @keyup.enter="handleSearch" />
                        </div>
                    </div>

                    <!-- Location Dropdown -->
                    <div class="flex-1 relative group px-2 md:px-4 py-2">
                        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 ml-9">Điểm
                            đến</label>
                        <div class="relative flex items-center">
                            <div class="absolute left-2 text-gray-400 transition-colors">
                                <i class="i-carbon-map text-xl"></i>
                            </div>
                            <select v-model="searchForm.location"
                                class="w-full h-10 pl-10 pr-8 bg-transparent outline-none rounded-2 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white font-medium appearance-none cursor-pointer">
                                <option v-for="loc in locations" :key="loc.value" :value="loc.value"
                                    class="dark:bg-gray-800">
                                    {{ loc.label }}
                                </option>
                            </select>
                            <div class="absolute right-2 pointer-events-none text-gray-400">
                                <i class="i-carbon-chevron-down text-sm"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Duration Dropdown -->
                    <div class="flex-1 relative group px-2 md:px-4 py-2">
                        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 ml-9">Thời
                            gian</label>
                        <div class="relative flex items-center">
                            <div class="absolute left-2 text-gray-400 transition-colors">
                                <i class="i-carbon-calendar text-xl"></i>
                            </div>
                            <select v-model="searchForm.duration"
                                class="w-full h-10 pl-10 pr-8 bg-transparent outline-none rounded-2 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white font-medium appearance-none cursor-pointer">
                                <option v-for="option in durationOptions" :key="option.value" :value="option.value"
                                    class="dark:bg-gray-800">
                                    {{ option.label }}
                                </option>
                            </select>
                            <div class="absolute right-2 pointer-events-none text-gray-400">
                                <i class="i-carbon-chevron-down text-sm"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Search Button -->
                    <div class="p-1 pl-2 md:pl-4 flex items-center justify-center md:justify-end">
                        <button @click="handleSearch"
                            class="w-full md:w-auto h-12 md:h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl md:rounded-full font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2">
                            <i class="i-carbon-search text-xl"></i>
                            <span>Tìm kiếm</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
/* Remove default select arrows */
select::-ms-expand {
    display: none;
}
</style>
