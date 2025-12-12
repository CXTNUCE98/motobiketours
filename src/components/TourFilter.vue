<script setup lang="ts">
import { ref, computed, watch } from 'vue';

type FilterOptions = {
    searchQuery?: string;
    duration: string;
    priceRange: { min: number; max: number };
    tourTypes: string[];
    departFrom: string;
};

const emit = defineEmits<{
    (e: 'apply', filters: FilterOptions): void;
    (e: 'clear'): void;
}>();

const props = defineProps<{
    showMobile?: boolean;
    initialFilters?: FilterOptions;
}>();

// Filter state
const searchQuery = ref(props.initialFilters?.searchQuery || '');
const selectedDuration = ref<string>(props.initialFilters?.duration || '');
const priceMin = ref(props.initialFilters?.priceRange?.min || 0);
const priceMax = ref(props.initialFilters?.priceRange?.max || 2000);
const selectedTypes = ref<string[]>(props.initialFilters?.tourTypes || []);
const selectedDepartFrom = ref(props.initialFilters?.departFrom || 'all');

watch(() => props.initialFilters, (newFilters) => {
    if (newFilters) {
        searchQuery.value = newFilters.searchQuery || '';
        selectedDuration.value = newFilters.duration || '';
        priceMin.value = newFilters.priceRange?.min || 0;
        priceMax.value = newFilters.priceRange?.max || 2000;
        selectedTypes.value = newFilters.tourTypes || [];
        selectedDepartFrom.value = newFilters.departFrom || 'all';
    }
}, { deep: true });


// Options
const durationOptions = [
    { value: '1-3', label: '1-3 ngày' },
    { value: '4-7', label: '4-7 ngày' },
    { value: '8+', label: '8+ ngày' },
];

const tourTypeOptions = [
    { value: 'Adventure', label: 'Adventure' },
    { value: 'Culture', label: 'Culture' },
    { value: 'Nature', label: 'Nature' },
    { value: 'Food', label: 'Food' },
];

const departFromOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'Sài Gòn', label: 'Sài Gòn' },
    { value: 'Hà Nội', label: 'Hà Nội' },
    { value: 'Đà Nẵng', label: 'Đà Nẵng' },
    { value: 'Huế', label: 'Huế' },
    { value: 'Hội An', label: 'Hội An' },
    { value: 'Đà Lạt', label: 'Đà Lạt' },
    { value: 'Nha Trang', label: 'Nha Trang' },
    { value: 'Mũi Né', label: 'Mũi Né' },
    { value: 'Hà Giang', label: 'Hà Giang' },
    { value: 'Sapa', label: 'Sapa' },
    { value: 'Phú Quốc', label: 'Phú Quốc' },
];

const activeFilterCount = computed(() => {
    let count = 0;
    if (selectedDuration.value) count++;
    if (priceMin.value > 0 || priceMax.value < 2000) count++;
    if (selectedTypes.value.length > 0) count++;
    if (selectedDepartFrom.value) count++;
    return count;
});

const toggleDuration = (value: string) => {
    // Toggle: nếu đã chọn thì bỏ chọn, nếu chưa thì chọn
    if (selectedDuration.value === value) {
        selectedDuration.value = '';
    } else {
        selectedDuration.value = value;
    }
    // Tự động apply filters khi duration thay đổi
    applyFilters();
};

const applyFilters = () => {
    emit('apply', {
        searchQuery: searchQuery.value,
        duration: selectedDuration.value,
        priceRange: { min: priceMin.value, max: priceMax.value },
        tourTypes: selectedTypes.value,
        departFrom: selectedDepartFrom.value !== 'all' ? selectedDepartFrom.value : '',
    });
};

const clearFilters = () => {
    searchQuery.value = '';
    selectedDuration.value = '';
    priceMin.value = 0;
    priceMax.value = 2000;
    selectedTypes.value = [];
    selectedDepartFrom.value = '';
    emit('clear');
};
</script>

<template>
    <div :class="[
        'bg-white dark:bg-gray-800 transition-colors duration-300',
        props.showMobile ? 'flex-1 w-full flex flex-col min-h-0' : 'rounded-2xl shadow-lg p-6 sticky top-24'
    ]">
        <!-- Header -->
        <div v-if="!props.showMobile" class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Bộ lọc
            </h3>
            <span v-if="activeFilterCount > 0"
                class="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold rounded-full">
                {{ activeFilterCount }}
            </span>
        </div>

        <!-- Scrollable Content -->
        <div :class="props.showMobile ? 'flex-1 overflow-y-auto p-4' : ''">
            <!-- Search -->
            <div class="mb-6">
                <div class="relative">
                    <input v-model="searchQuery" type="text"
                        placeholder="Tìm kiếm tour theo tên, địa điểm, loại hình..."
                        class="w-full px-4 py-3 pr-12 rounded-xl text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 placeholder-gray-400" />
                    <button @click="applyFilters"
                        class="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-2 rounded-lg hover:scale-105 transition-transform duration-300 shadow-md">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Duration Filter -->
            <div class="mb-6">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Thời gian</label>
                <div class="space-y-0 flex flex-wrap justify-between gap-1 md:space-y-2">
                    <button v-for="option in durationOptions" :key="option.value" @click="toggleDuration(option.value)"
                        class="w-3/10 md:w-full px-4 py-3 rounded-xl text-left text-sm font-medium transition-all duration-300 flex items-center justify-between"
                        :class="selectedDuration === option.value
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                            : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                            ">
                        <span>{{ option.label }}</span>
                        <svg v-if="selectedDuration === option.value" class="w-5 h-5" fill="currentColor"
                            viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Price Range Filter -->
            <div class="mb-6">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Khoảng giá
                    (USD)</label>
                <div class="space-y-4">
                    <div>
                        <label class="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Từ</label>
                        <input v-model.number="priceMin" type="range" min="0" max="2000" step="50"
                            class="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                        <div class="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">${{ priceMin }}</div>
                    </div>
                    <div>
                        <label class="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Đến</label>
                        <input v-model.number="priceMax" type="range" min="0" max="2000" step="50"
                            class="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                        <div class="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">${{ priceMax }}</div>
                    </div>
                </div>
            </div>

            <!-- Tour Type Filter -->
            <div class="mb-6">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Loại tour</label>
                <div class="space-y-0 flex flex-wrap gap-2 md:space-y-2">
                    <label v-for="option in tourTypeOptions" :key="option.value"
                        class="flex items-center w-130px gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <input type="checkbox" :value="option.value" v-model="selectedTypes"
                            class="w-5 h-5 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 cursor-pointer bg-white dark:bg-gray-700" />
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ option.label }}</span>
                    </label>
                </div>
            </div>

            <!-- Depart From Filter -->
            <div class="mb-6">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 ">Khởi
                    hành từ</label>
                <el-select v-model="selectedDepartFrom" placeholder="Select"
                    class="w-full [&_.el-select\_\_wrapper]:dark:bg-gray-800 ">
                    <el-option v-for="item in departFromOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>

            </div>
        </div>

        <!-- Action Buttons -->
        <div :class="props.showMobile
            ? 'p-4 border-t border-gray-100 dark:border-gray-700 flex gap-3'
            : 'space-y-3'">
            <button @click="applyFilters"
                class="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span v-if="props.showMobile">Áp dụng</span>
                <span v-else>Áp dụng bộ lọc</span>
            </button>
            <button @click="clearFilters"
                class="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span v-if="props.showMobile">Xóa</span>
                <span v-else>Xóa bộ lọc</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
/* Custom range slider styling */
input[type='range']::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
    transition: all 0.3s ease;
}

input[type='range']::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
}

input[type='range']::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
    transition: all 0.3s ease;
    border: none;
}

input[type='range']::-moz-range-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
}
</style>
