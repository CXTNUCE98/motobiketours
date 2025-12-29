<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/vue-query';
import { Plus } from '@element-plus/icons-vue';
import { logger } from '~/utils/logger';

const route = useRoute();
const { t } = useI18n();
const { formatPrice } = useCurrency();
const localePath = useLocalePath();

const searchQuery = ref('');
const showFilters = ref(false);
const viewMode = ref('grid'); // 'grid' or 'list'
const sortBy = ref('default'); // 'default', 'price-low', 'price-high', 'duration'
const showCreateDialog = ref(false);
const selectedTour = ref<any | null>(null);

// Auth
const { user } = useAuth();
const isAdmin = computed(() => user.value?.isAdmin);

// Pagination state
const currentPage = ref(1);
const itemsPerPage = 6;

// Filter state
const activeFilters = ref<{
    searchQuery: string;
    duration: string;
    priceRange: { min: number; max: number };
    tourTypes: string[];
    departFrom: string;
}>({
    searchQuery: '',
    duration: '',
    priceRange: { min: 0, max: 2000 },
    tourTypes: [],
    departFrom: '',
});

watch(searchQuery, (newVal) => {
    activeFilters.value.searchQuery = newVal;
});

// Construct API filters
const apiFilters = computed(() => {
    const filters: any = {
        p: currentPage.value,
        r: itemsPerPage,
        q: searchQuery.value,
        departFrom: activeFilters.value.departFrom,
        priceMin: activeFilters.value.priceRange.min,
        priceMax: activeFilters.value.priceRange.max,
    };

    if (activeFilters.value.duration) {
        filters.durationRange = activeFilters.value.duration;
    }

    if (activeFilters.value.tourTypes.length > 0) {
        filters.type = activeFilters.value.tourTypes; // useToursQuery expects array for type if schema says so
    }

    return filters;
});

// Query
const { data, isLoading, isError, error, isFetching } = useToursQuery(apiFilters);

const tours = computed(() => (data.value as any)?.data || []);
const totalPages = computed(() => (data.value as any)?.totalPages || 1);

const getDurationDays = (durationStr: string): number => {
    if (!durationStr) return 0;
    if (durationStr.includes('1/2')) return 0.5;
    const match = durationStr.match(/(\d+)\s*day/);
    return match ? parseInt(match[1], 10) : 0;
};

const processedTours = computed(() => {
    let result = [...tours.value];

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
            const rangeA = a.durationRange || 0;
            const rangeB = b.durationRange || 0;
            return rangeA - rangeB;
        });
    }

    return result;
});

const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const handleApplyFilters = (filters: any) => {
    activeFilters.value = filters;
    if (filters.searchQuery !== undefined) {
        searchQuery.value = filters.searchQuery;
    }
    currentPage.value = 1; // Reset to first page on filter change
    showFilters.value = false;
};

const handleClearFilters = () => {
    activeFilters.value = {
        searchQuery: '',
        duration: '',
        priceRange: { min: 0, max: 2000 },
        tourTypes: [],
        departFrom: ''
    };
    searchQuery.value = '';
    currentPage.value = 1;
};

const handleCreateTour = () => {
    selectedTour.value = null;
    showCreateDialog.value = true;
};

const editTour = (tourId: string) => {
    const tour = tours.value.find((tourItem: any) => tourItem.id === tourId);
    if (tour) {
        selectedTour.value = tour;
        showCreateDialog.value = true;
    }
};

const handleCreateSuccess = () => {
    selectedTour.value = null;
};


const { mutate: deleteTourMutation, isPending: isDeleting } = useDeleteTourMutation();

const deleteTour = (tourId: string) => {
    const tour = tours.value.find((tourItem: any) => tourItem.id === tourId);
    const tourTitle = tour?.title || t('tour.thisTour');

    ElMessageBox.confirm(
        t('tour.message.deleteConfirm', { title: tourTitle }),
        t('tour.message.deleteTitle'),
        {
            confirmButtonText: t('tour.message.deleteBtn'),
            cancelButtonText: t('common.cancel'),
            type: 'warning',
            confirmButtonClass: 'el-button--danger'
        }
    ).then(() => {
        deleteTourMutation(tourId, {
            onSuccess: () => {
                ElMessage.success(t('tour.message.deleteSuccess'));
            },
            onError: (error: unknown) => {
                logger.error('Error deleting tour:', error);
                let errorMessage = t('tour.message.deleteError');
                if (error && typeof error === 'object') {
                    const apiError = error as { message?: string; response?: { data?: { message?: string } } };
                    errorMessage = apiError?.message || apiError?.response?.data?.message || errorMessage;
                }
                ElMessage.error(errorMessage);
            }
        });
    }).catch(() => {
        // User cancelled, do nothing
    });
};

const optionFilterPrice = computed(() => {
    const opts = (t as any)('tour.filter.sortOptions', { returnObjects: true });
    return [
        { label: opts.default, value: 'default' },
        { label: opts.priceLow, value: 'price-low' },
        { label: opts.priceHigh, value: 'price-high' },
        { label: opts.duration, value: 'duration' }
    ];
});

onMounted(() => {
    if (route.query.keyword) {
        searchQuery.value = route.query.keyword as string;
    }
    if (route.query.location && route.query.location !== 'all') {
        activeFilters.value.departFrom = route.query.location as string;
    }
    if (route.query.duration) {
        activeFilters.value.duration = route.query.duration as string;
    } else if (route.query.brand) {
        // Fallback for old link if any, though we changed SearchSection
        activeFilters.value.duration = route.query.brand as string;
    }
});
</script>

<template>
    <div
        class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-pink-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 overflow-x-hidden">
        <!-- Hero Section -->
        <div class="relative py-24 md:py-32 overflow-hidden">
            <!-- Background Elements -->
            <div class="absolute inset-0 bg-[#0f172a]">
                <!-- Animated Mesh Gradient -->
                <div class="absolute inset-0 opacity-40">
                    <div
                        class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600 blur-[120px] animate-pulse">
                    </div>
                    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600 blur-[120px] animate-pulse"
                        style="animation-delay: 2s"></div>
                    <div class="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-cyan-500 blur-[100px] animate-pulse"
                        style="animation-delay: 4s"></div>
                </div>
                <!-- Grid Pattern -->
                <div class="absolute inset-0 opacity-10"
                    style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 40px 40px;">
                </div>
            </div>

            <div class="container mx-auto px-4 relative z-10">
                <div class="max-w-4xl mx-auto text-center">
                    <div
                        class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-300 text-sm font-bold mb-8 animate-fade-in">
                        <span class="relative flex h-2 w-2">
                            <span
                                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        {{ t('tour.journeyOfDiscovery') }}
                    </div>

                    <h1 class="text-5xl md:text-7xl font-black mb-8 leading-tight animate-fade-in"
                        style="animation-delay: 0.2s">
                        <span class="block text-white">{{ t('tour.experience') }}</span>
                        <span
                            class="block bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent filter drop-shadow-sm">
                            {{ t('tour.peakTour') }}
                        </span>
                    </h1>

                    <p class="text-xl md:text-2xl mb-12 text-blue-100/80 max-w-2xl mx-auto leading-relaxed animate-fade-in"
                        style="animation-delay: 0.4s">
                        {{ t('tour.peakTourDesc') }}
                    </p>

                    <!-- Stats Cards -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto animate-fade-in"
                        style="animation-delay: 0.6s">
                        <div
                            class="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
                            <div
                                class="text-4xl font-black text-white mb-1 group-hover:text-blue-400 transition-colors">
                                {{ data?.total || 0 }}+</div>
                            <div class="text-sm font-bold text-blue-200/60 uppercase tracking-widest">{{
                                t('tour.readyTour') }}</div>
                        </div>
                        <div
                            class="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
                            <div
                                class="text-4xl font-black text-white mb-1 group-hover:text-cyan-400 transition-colors">
                                1.2k+</div>
                            <div class="text-sm font-bold text-blue-200/60 uppercase tracking-widest">{{
                                t('tour.customers') }}</div>
                        </div>
                        <div
                            class="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
                            <div
                                class="text-4xl font-black text-white mb-1 group-hover:text-indigo-400 transition-colors">
                                4.9/5</div>
                            <div class="text-sm font-bold text-blue-200/60 uppercase tracking-widest">{{
                                t('tour.evaluate') }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Decorative Bottom Wave -->
            <div class="absolute bottom-0 left-0 right-0 pointer-events-none">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
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
                    <TourFilter :initial-filters="activeFilters" @apply="handleApplyFilters"
                        @clear="handleClearFilters" />
                </div>

                <!-- Tours Content -->
                <div class="flex-1">
                    <!-- Toolbar -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-8 transition-all duration-300 sticky top-20 z-30 border border-gray-100 dark:border-gray-700">
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <!-- Left: Count & Mobile Filter -->
                            <div class="flex items-center justify-between md:justify-start gap-4">
                                <div class="flex items-center gap-2">
                                    <span class="text-gray-700 dark:text-gray-300 font-bold text-lg">
                                        {{ data?.total || 0 }} tours
                                    </span>
                                    <span class="hidden md:inline text-gray-300 dark:text-gray-600">|</span>
                                </div>

                                <button @click="showFilters = !showFilters"
                                    class="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-300 font-medium">
                                    <i class="bx bx-filter-alt text-lg"></i>
                                    {{ t('tour.filterBtn') }}
                                </button>
                            </div>

                            <!-- Right: Actions -->
                            <div class="flex items-center justify-end gap-3 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                                <!-- Sort Dropdown -->
                                <el-select v-model="sortBy" :placeholder="t('tour.filter.sortBy')" size="large"
                                    class="!w-40 md:!w-48 [&_.el-select\_\_wrapper]:!rounded-xl [&_.el-select\_\_wrapper]:!shadow-none [&_.el-select\_\_wrapper]:bg-gray-50 [&_.el-select\_\_wrapper]:dark:bg-gray-700 [&_.el-select\_\_wrapper]:border-0">
                                    <template #prefix>
                                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path>
                                        </svg>
                                    </template>
                                    <el-option v-for="item in optionFilterPrice" :key="item.value" :label="item.label"
                                        :value="item.value" />
                                </el-select>

                                <!-- View Mode Toggle -->
                                <div class="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 shrink-0">
                                    <button @click="viewMode = 'grid'"
                                        class="p-2 rounded-lg transition-all duration-300"
                                        :class="viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'">
                                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                    </button>
                                    <button @click="viewMode = 'list'"
                                        class="p-2 rounded-lg transition-all duration-300"
                                        :class="viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'">
                                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                                <el-tooltip class="box-item" effect="dark" :content="t('tour.createBtn')"
                                    placement="top">
                                    <el-button v-if="isAdmin" type="primary" @click="handleCreateTour"
                                        class="!rounded-xl !px-4 !py-2 !h-[40px] !font-bold !bg-gradient-to-r !from-blue-600 !to-cyan-600 !border-none hover:opacity-80 transition-transform duration-300 shadow-lg shrink-0">
                                        <el-icon>
                                            <Plus />
                                        </el-icon>
                                    </el-button>
                                </el-tooltip>
                            </div>
                        </div>
                    </div>

                    <!-- Tours Grid/List -->
                    <div v-loading="isFetching" v-if="processedTours.length > 0">
                        <div
                            :class="viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-6'">
                            <div v-for="(tour, index) in processedTours" :key="tour.id" class="animate-fade-in"
                                :style="{ animationDelay: `${index * 0.1}s` }">
                                <!-- Grid View -->
                                <NuxtLink v-if="viewMode === 'grid'" :to="localePath(`/tour/${tour.id}`)"
                                    class="block group">
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

                                            <div v-if="isAdmin" @click.prevent="deleteTour(tour.id)"
                                                class="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold bg-red-500 text-white shadow-lg flex items-center gap-2 cursor-pointer">
                                                x
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
                                                    {{ formatPrice(tour.priceUsd) }}
                                                </div>
                                                <div class="flex gap-1">
                                                    <el-tooltip class="box-item" effect="dark"
                                                        :content="t('tour.list.details')" placement="top">
                                                        <button
                                                            class="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform duration-300 shadow-md">
                                                            <i class='bx bxs-detail'></i>
                                                        </button>
                                                    </el-tooltip>
                                                    <el-tooltip v-if="isAdmin" class="box-item" effect="dark"
                                                        :content="t('tour.edit')" placement="top">
                                                        <button @click.prevent="editTour(tour.id)"
                                                            class="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform duration-300 shadow-md">
                                                            <i class='bx bx-edit-alt'></i>
                                                        </button>
                                                    </el-tooltip>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </NuxtLink>

                                <!-- List View -->
                                <NuxtLink v-else :to="localePath(`/tour/${tour.id}`)" class="block group">
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

                                                <div v-if="isAdmin" @click.prevent="deleteTour(tour.id)"
                                                    class="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold bg-red-500 text-white shadow-lg flex items-center gap-2 cursor-pointer">
                                                    x
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
                                                            <span><strong>{{ t('tour.list.departure') }}:</strong> {{
                                                                tour.departFrom
                                                                }}</span>
                                                        </div>
                                                        <div class="flex items-start gap-2">
                                                            <svg class="w-5 h-5 text-green-500 mt-0.5"
                                                                fill="currentColor" viewBox="0 0 20 20">
                                                                <path fill-rule="evenodd"
                                                                    d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z"
                                                                    clip-rule="evenodd" />
                                                            </svg>
                                                            <span><strong>{{ t('tour.list.route') }}:</strong> {{
                                                                tour.routes }}</span>
                                                        </div>
                                                        <div class="flex items-start gap-2">
                                                            <svg class="w-5 h-5 text-purple-500 mt-0.5"
                                                                fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                                                <path fill-rule="evenodd"
                                                                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                                                                    clip-rule="evenodd" />
                                                            </svg>
                                                            <span class="line-clamp-2"><strong>{{ t('tour.list.type')
                                                            }}:</strong> {{
                                                                        tour.type }}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div
                                                    class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                                    <div
                                                        class="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                                                        {{ formatPrice(tour.priceUsd) }}
                                                    </div>
                                                    <button
                                                        class="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:scale-105 transition-transform duration-300 shadow-lg flex items-center gap-2">
                                                        <span>{{ t('tour.list.details') }}</span>
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
                        <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">{{ t('tour.list.emptyTitle')
                            }}</h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-6">{{ t('tour.list.emptyDesc') }}
                        </p>
                        <button @click="handleClearFilters"
                            class="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform duration-300 shadow-lg">
                            {{ t('tour.list.clearFilters') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create Tour Dialog -->
        <LazyCreateTourDialog v-model:visible="showCreateDialog" :tour-data="selectedTour"
            @success="handleCreateSuccess" />
    </div>
    <!-- Mobile Filter Dialog -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="translate-y-full opacity-0"
        enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-full opacity-0">
        <div v-if="showFilters" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
            <!-- Backdrop -->
            <div @click="showFilters = false" class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity">
            </div>

            <!-- Content -->
            <div
                class="relative w-full top--30px md:top-6 max-w-lg bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                <!-- Header -->
                <div
                    class="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl z-10">
                    <h3 class="text-xl font-black text-gray-900 dark:text-white">{{ t('tour.filter.title') }}</h3>
                    <button @click="showFilters = false"
                        class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- TourFilter Component -->
                <TourFilter :initial-filters="activeFilters" :show-mobile="true" @apply="handleApplyFilters"
                    @clear="handleClearFilters" />

            </div>
        </div>
    </Transition>
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