<script setup lang="ts">
import { ref, computed } from 'vue';

type FilterOptions = {
    duration: string[];
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
}>();

// Filter state
const selectedDuration = ref<string[]>([]);
const priceMin = ref(0);
const priceMax = ref(2000);
const selectedTypes = ref<string[]>([]);
const selectedDepartFrom = ref('');

// Options
const durationOptions = [
    { value: '1-3', label: '1-3 ngày' },
    { value: '4-7', label: '4-7 ngày' },
    { value: '8+', label: '8+ ngày' }
];

const tourTypeOptions = [
    { value: 'adventure', label: 'Phiêu lưu' },
    { value: 'cultural', label: 'Văn hóa' },
    { value: 'beach', label: 'Biển' },
    { value: 'mountain', label: 'Núi' },
    { value: 'city', label: 'Thành phố' }
];

const departFromOptions = [
    { value: '', label: 'Tất cả' },
    { value: 'sai-gon', label: 'Sài Gòn' },
    { value: 'ha-noi', label: 'Hà Nội' },
    { value: 'da-nang', label: 'Đà Nẵng' },
    { value: 'hue', label: 'Huế' },
    { value: 'hoi-an', label: 'Hội An' },
    { value: 'da-lat', label: 'Đà Lạt' },
    { value: 'nha-trang', label: 'Nha Trang' },
    { value: 'mui-ne', label: 'Mũi Né' },
    { value: 'ha-giang', label: 'Hà Giang' },
    { value: 'sapa', label: 'Sapa' },
    { value: 'phu-quoc', label: 'Phú Quốc' }
];

const activeFilterCount = computed(() => {
    let count = 0;
    if (selectedDuration.value.length > 0) count++;
    if (priceMin.value > 0 || priceMax.value < 2000) count++;
    if (selectedTypes.value.length > 0) count++;
    if (selectedDepartFrom.value) count++;
    return count;
});

const toggleDuration = (value: string) => {
    const index = selectedDuration.value.indexOf(value);
    if (index > -1) {
        selectedDuration.value.splice(index, 1);
    } else {
        selectedDuration.value.push(value);
    }
};

const toggleType = (value: string) => {
    const index = selectedTypes.value.indexOf(value);
    if (index > -1) {
        selectedTypes.value.splice(index, 1);
    } else {
        selectedTypes.value.push(value);
    }
};

const applyFilters = () => {
    emit('apply', {
        duration: selectedDuration.value,
        priceRange: { min: priceMin.value, max: priceMax.value },
        tourTypes: selectedTypes.value,
        departFrom: selectedDepartFrom.value
    });
};

const clearFilters = () => {
    selectedDuration.value = [];
    priceMin.value = 0;
    priceMax.value = 2000;
    selectedTypes.value = [];
    selectedDepartFrom.value = '';
    emit('clear');
};


</script>

<template>
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
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

        <!-- Duration Filter -->
        <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Thời gian</label>
            <div class="space-y-2">
                <button v-for="option in durationOptions" :key="option.value" @click="toggleDuration(option.value)"
                    class="w-full px-4 py-3 rounded-xl text-left text-sm font-medium transition-all duration-300 flex items-center justify-between"
                    :class="selectedDuration.includes(option.value)
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'">
                    <span>{{ option.label }}</span>
                    <svg v-if="selectedDuration.includes(option.value)" class="w-5 h-5" fill="currentColor"
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
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Khoảng giá (USD)</label>
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
            <div class="space-y-2">
                <label v-for="option in tourTypeOptions" :key="option.value"
                    class="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input type="checkbox" :value="option.value" v-model="selectedTypes"
                        class="w-5 h-5 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 cursor-pointer bg-white dark:bg-gray-700" />
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ option.label }}</span>
                </label>
            </div>
        </div>

        <!-- Depart From Filter -->
        <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Khởi hành từ</label>
            <select v-model="selectedDepartFrom"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-sm font-medium cursor-pointer">
                <option v-for="option in departFromOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                </option>
            </select>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
            <button @click="applyFilters"
                class="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Áp dụng bộ lọc
            </button>
            <button @click="clearFilters"
                class="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Xóa bộ lọc
            </button>
        </div>
    </div>
</template>

<style scoped>
/* Custom range slider styling */
input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
    transition: all 0.3s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
}

input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
    transition: all 0.3s ease;
    border: none;
}

input[type="range"]::-moz-range-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
}
</style>
