<script setup lang="ts">
import type { HotSpot, GetHotSpotsQuery } from '~/types/api';

const { t } = useI18n();
const { user } = useAuth();
const isAdmin = computed(() => user.value?.isAdmin);

const filters = ref<GetHotSpotsQuery>({
    category: '',
    lat: undefined,
    lng: undefined,
});

const categories = [
    { label: t('hotSpots.categories.all'), value: '' },
    { label: t('hotSpots.categories.checkin'), value: 'Check-in' },
    { label: t('hotSpots.categories.nature'), value: 'Cảnh đẹp' },
    { label: t('hotSpots.categories.spiritual'), value: 'Vãn cảnh' },
    { label: t('hotSpots.categories.food'), value: 'Ẩm thực' },
];

const selectedSpotId = ref<string | null>(null);
const isDetailOpen = ref(false);

const { data: spots, isLoading, isFetching, refetch: refresh } = useHotSpotsQuery(filters);

const { coords, isSupported, error: geoError, isLoading: isGeoLoading, isFallback } = useGeolocationStore();

const isLocationLoading = ref(true);
const locationErrorMessage = ref('');

watch(coords, (newCoords) => {
    console.log('📍 HotSpots: Nhận tọa độ mới', newCoords);

    if (newCoords &&
        newCoords.latitude !== Infinity &&
        newCoords.latitude !== 0 &&
        newCoords.latitude !== undefined) {

        const hasChanged = Math.abs((filters.value.lat || 0) - newCoords.latitude) > 0.0001 ||
            Math.abs((filters.value.lng || 0) - newCoords.longitude) > 0.0001;

        if (hasChanged) {
            filters.value.lat = newCoords.latitude;
            filters.value.lng = newCoords.longitude;
        }

        // Clear loading and errors on success
        isLocationLoading.value = false;
        locationErrorMessage.value = '';
    }
}, { immediate: true, deep: true });

const isLocating = computed(() => {
    // Nếu đã có tọa độ thì không còn đang xác định vị trí gốc nữa
    if (filters.value.lat !== undefined && filters.value.lng !== undefined) {
        return isFetching.value;
    }

    // Nếu có lỗi định vị nghiêm trọng (không có cả IP fallback)
    if (geoError.value && !filters.value.lat) return false;

    return isSupported.value && (isLocationLoading.value || isGeoLoading.value);
});

onMounted(() => {
    // Nếu store báo không hỗ trợ và không có tọa độ nào
    if (!isSupported.value && !coords.value) {
        isLocationLoading.value = false;
        locationErrorMessage.value = t('hotSpots.geoNotSupported');
        return;
    }

    // Nếu đã có tọa độ (từ cache hoặc IP load nhanh), không cần hiển thị loading
    if (coords.value) {
        isLocationLoading.value = false;
    }

    // Giảm timeout xuống vì đã có IP fallback nhanh
    setTimeout(() => {
        if (filters.value.lat === undefined && !geoError.value) {
            isLocationLoading.value = false;
            locationErrorMessage.value = t('hotSpots.geoTimeout');
        }
    }, 10000);
});

// Watch geo errors
watch(geoError, (err) => {
    if (err && !coords.value) {
        isLocationLoading.value = false;
        locationErrorMessage.value = t('hotSpots.geoDenied');
    } else if (coords.value) {
        locationErrorMessage.value = '';
    }
});

const selectSpot = (id: string) => {
    selectedSpotId.value = id;
    isDetailOpen.value = true;
};

const isMiniMap = ref(false);
const isMapView = ref(false);

watch(isMapView, (val) => {
    if (val) isMiniMap.value = false;
});

const isCreateDialogOpen = ref(false);
const isCustomTourOpen = ref(false);
const editingSpot = ref<HotSpot | null>(null);

const { mutateAsync: deleteHotSpot } = useDeleteHotSpot();

const handleCreate = () => {
    editingSpot.value = null;
    isCreateDialogOpen.value = true;
};

const handleEdit = (spot: HotSpot) => {
    editingSpot.value = spot;
    isCreateDialogOpen.value = true;
};

const handleDelete = async (id: string) => {
    try {
        await ElMessageBox.confirm(
            'Are you sure you want to delete this hot spot?',
            'Warning',
            {
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
                type: 'warning',
            }
        );
        await deleteHotSpot(id);
    } catch (error) {
        // Cancelled or error
    }
};

useHead({
    title: `${t('hotSpots.title')} | ANDAGO`,
});
</script>

<template>
    <div class="min-h-screen bg-zinc-50 dark:bg-black pt-24 pb-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <!-- Spotlight Header -->
            <div
                class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-zinc-100 dark:border-zinc-800">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 class="text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                            {{ t('hotSpots.title') }}
                        </h1>
                        <p class="mt-3 text-zinc-500 dark:text-zinc-400 font-medium max-w-lg">
                            {{ t('hotSpots.discoverMost') }}
                        </p>
                        <div v-if="locationErrorMessage"
                            class="mt-4 flex items-center gap-2 text-red-500 text-sm font-medium">
                            <i class='bx bx-error-circle'></i>
                            <span>{{ locationErrorMessage }}</span>
                        </div>
                    </div>

                    <div class="flex items-center gap-4">
                        <!-- Custom Switch for Mini Map (Only show in Grid mode) -->
                        <el-tooltip class="box-item" :content="t('hotSpots.miniMap')" placement="top">
                            <transition enter-active-class="transition duration-300 ease-out"
                                enter-from-class="opacity-0 translate-x-4" enter-to-class="opacity-100 translate-x-0"
                                leave-active-class="transition duration-200 ease-in"
                                leave-from-class="opacity-100 translate-x-0" leave-to-class="opacity-0 translate-x-4">
                                <button v-if="!isMapView" @click="isMiniMap = !isMiniMap"
                                    class="group flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-full transition-all duration-300 hover:ring-2 hover:ring-blue-500/20"
                                    :class="{ 'ring-2 ring-blue-500/30 bg-blue-50/50 dark:bg-blue-900/10': isMiniMap }">
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500"
                                        :class="isMiniMap ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white dark:bg-zinc-700 text-zinc-400'">
                                        <i class='bx bxs-map-pin' :class="{ 'animate-bounce': isMiniMap }"></i>
                                    </div>
                                </button>
                            </transition>
                        </el-tooltip>

                        <!-- Custom Tour Builder Button -->
                        <el-tooltip class="box-item" :content="t('customTour.title')" placement="top">
                            <button @click="isCustomTourOpen = true"
                                class="h-11 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full hover:shadow-lg hover:scale-105 active:scale-95 transition-all text-sm flex items-center gap-2">
                                <i class='bx bxs-car'></i>
                            </button>
                        </el-tooltip>

                        <!-- Create hot spot (Admin only) -->
                        <el-tooltip class="box-item" :content="t('common.create')" placement="top">
                            <button v-if="isAdmin" @click="handleCreate"
                                class="h-11 flex items-center justify-center px-6 bg-zinc-900 dark:bg-zinc-800 text-white font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg text-sm">
                                <i class='bx bx-plus-circle'></i>
                            </button>
                        </el-tooltip>
                    </div>
                </div>

                <!-- Filter Bar -->
                <div class="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div class="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
                        <button v-for="cat in categories" :key="cat.value" @click="filters.category = cat.value"
                            class="px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap shadow-sm border"
                            :class="filters.category === cat.value
                                ? 'bg-blue-600 border-blue-600 text-white shadow-blue-200 dark:shadow-none'
                                : 'bg-white dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-400'">
                            {{ cat.label }}
                        </button>
                    </div>

                    <div class="flex items-center gap-6 w-full sm:w-auto justify-end">
                        <!-- View mode switcher -->
                        <div class="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl">
                            <button @click="isMapView = false"
                                class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                                :class="!isMapView ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'">
                                <i class='bx bxs-grid-alt'></i>
                                {{ t('common.grid') || 'Lưới' }}
                            </button>
                            <button @click="isMapView = true"
                                class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                                :class="isMapView ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'">
                                <i class='bx bxs-map'></i>
                                {{ t('hotSpots.map') || 'Bản đồ' }}
                            </button>
                        </div>

                        <div
                            class="hidden lg:flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl text-xs font-bold text-zinc-400 border border-zinc-100 dark:border-zinc-800">
                            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            {{ isFallback ? 'IP' : 'GPS' }}
                        </div>
                    </div>
                </div>

                <!-- Mini Map Section -->
                <transition enter-active-class="transition duration-500 ease-out"
                    enter-from-class="transform scale-95 opacity-0 -translate-y-4"
                    enter-to-class="transform scale-100 opacity-100 translate-y-0"
                    leave-active-class="transition duration-300 ease-in"
                    leave-from-class="transform scale-100 opacity-100 translate-y-0"
                    leave-to-class="transform scale-95 opacity-0 -translate-y-4">
                    <div v-if="isMiniMap" class="mt-12 h-64 md:h-80 relative group">
                        <ClientOnly>
                            <LeafletMap :spots="spots || []" :selected-spot-id="selectedSpotId"
                                @select-spot="selectSpot"
                                :center="filters.lat && filters.lng ? [filters.lat, filters.lng] : undefined" />
                        </ClientOnly>
                        <!-- Overlay gradient for depth -->
                        <div
                            class="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-black/5 dark:ring-white/5 shadow-inner">
                        </div>
                    </div>
                </transition>

                <!-- Grid/Map Results -->
                <div v-if="isLoading" class="mt-20 flex flex-col items-center justify-center py-20">
                    <div class="relative">
                        <div class="w-16 h-16 border-4 border-blue-100 dark:border-blue-900/30 rounded-full"></div>
                        <div
                            class="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin">
                        </div>
                    </div>
                    <p class="mt-6 text-zinc-500 dark:text-zinc-400 font-bold animate-pulse">
                        {{ t('common.loadingData') }}...
                    </p>
                </div>

                <div v-else-if="!spots || spots.length === 0"
                    class="mt-20 text-center py-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem]">
                    <i class='bx bxs-map-pin text-6xl text-zinc-300 dark:text-zinc-700'></i>
                    <h3 class="mt-4 text-xl font-bold text-zinc-400">{{ t('common.noLocationsFound') }}</h3>
                    <p class="text-sm text-zinc-500 mt-1">{{ t('common.tryAgain') }}</p>
                    <el-button @click="() => refresh()"
                        class="mt-6 px-6 py-2 bg-zinc-900 dark:bg-white dark:text-black text-white rounded-full font-bold">{{
                            t('common.reload') }}</el-button>
                </div>

                <!-- Main View Toggle -->
                <div v-else class="mt-12">
                    <transition name="fade-slide" mode="out-in">
                        <div v-if="isMapView" key="map-view"
                            class="h-[600px] rounded-[2.5rem] overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm relative group">
                            <ClientOnly>
                                <LeafletMap :spots="spots" :selected-spot-id="selectedSpotId" @select-spot="selectSpot"
                                    :center="filters.lat && filters.lng ? [filters.lat, filters.lng] : undefined" />
                            </ClientOnly>
                            <!-- Decorative corner accent -->
                            <div class="absolute top-6 left-6 z-[1000] pointer-events-none">
                                <div
                                    class="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white/20 dark:border-white/5 flex items-center gap-3">
                                    <div class="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
                                    <span
                                        class="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Live
                                        Exploration</span>
                                </div>
                            </div>
                        </div>
                        <div v-else key="grid-view" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            <HotSpotCard v-for="spot in spots" :key="spot.id" :spot="spot" :is-locating="isLocating"
                                @click="selectSpot(spot.id)" @edit="handleEdit" @delete="handleDelete"
                                class="cursor-pointer" />
                        </div>
                    </transition>
                </div>

                <!-- Mini Footer / Social Section -->
                <!-- <div class="mt-20 pt-12 border-t border-zinc-100 dark:border-zinc-800">
                    <div class="flex items-center justify-between flex-wrap gap-4">
                        <h4 class="text-xl font-bold flex items-center gap-2">
                            {{ t('common.communityCorner') }}
                            <span
                                class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-[10px] rounded uppercase font-black tracking-tighter">New</span>
                        </h4>
                    </div>

                    <div class="mt-6 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        <div v-for="i in 8" :key="i" class="flex-shrink-0 flex flex-col items-center gap-2">
                            <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500/20 p-0.5">
                                <img :src="`https://i.pravatar.cc/150?u=${i}`"
                                    class="w-full h-full rounded-full grayscale hover:grayscale-0 transition-all cursor-pointer" />
                            </div>
                            <span class="text-[10px] font-bold text-zinc-400">@user_{{ i }}</span>
                        </div>
                    </div>
                </div> -->
            </div>
        </div>

        <!-- Detail Modal -->
        <HotSpotDetailModal v-model="isDetailOpen" :spot-id="selectedSpotId" @change-spot="selectedSpotId = $event" />

        <!-- Create/Edit Dialog -->
        <CreateHotSpotDialog v-model="isCreateDialogOpen" :spot-data="editingSpot" @success="refresh" />

        <!-- Custom Tour Builder Dialog -->
        <el-dialog v-model="isCustomTourOpen" width="1200" align-center destroy-on-close :show-close="true"
            :lock-scroll="true" class="custom-tour-dialog dark:bg-zinc-900">
            <CustomTourBuilder />
        </el-dialog>
    </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}
</style>
