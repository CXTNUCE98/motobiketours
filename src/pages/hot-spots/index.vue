<script setup lang="ts">
import type { HotSpot, GetHotSpotsQuery } from '~/types/api';

const { t } = useI18n();

const filters = ref<GetHotSpotsQuery>({
    category: '',
    lat: undefined,
    lng: undefined,
});

const categories = [
    { label: t('hotSpots.categories.all'), value: '' },
    { label: t('hotSpots.categories.checkin'), value: 'Check-in' },
    { label: t('hotSpots.categories.nature'), value: 'Cảnh đẹp' },
    { label: t('hotSpots.categories.spiritual'), value: 'Vãn nhà' },
];

const selectedSpotId = ref<string | null>(null);
const isDetailOpen = ref(false);

const { data: spots, isLoading, refetch: refresh } = useHotSpotsQuery(filters);

const { coords, isSupported } = useGeolocation();

watchEffect(() => {
    if (coords.value && coords.value.latitude !== Infinity) {
        filters.value.lat = coords.value.latitude;
        filters.value.lng = coords.value.longitude;
    }
});

const selectSpot = (id: string) => {
    selectedSpotId.value = id;
    isDetailOpen.value = true;
};

const isMiniMap = ref(false);
const isMapView = ref(false);

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
                            Khám phá những địa điểm được yêu thích nhất và lên kế hoạch cho hành trình của bạn ngay hôm
                            nay.
                        </p>
                    </div>

                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-full">
                            <div class="flex items-center gap-2 px-3 py-1.5">
                                <UnoIcon i="i-ph-map-pin-fill" class="text-blue-500" />
                                <span class="text-xs font-bold text-zinc-400 uppercase tracking-widest">{{
                                    t('hotSpots.miniMap') }}</span>
                            </div>
                            <UToggle v-model="isMiniMap" />
                        </div>
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
                        <div class="flex items-center gap-3">
                            <span class="text-xs font-bold text-zinc-400 uppercase tracking-widest">{{
                                t('hotSpots.viewOnMap') }}</span>
                            <UToggle v-model="isMapView" />
                        </div>

                        <div
                            class="hidden sm:flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl text-xs font-bold text-zinc-400 border border-zinc-100 dark:border-zinc-800">
                            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            {{ isSupported ? 'Geolocation Active' : 'Location Fallback' }}
                        </div>
                    </div>
                </div>

                <!-- Grid Results -->
                <div v-if="isLoading" class="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <USkeleton v-for="i in 8" :key="i" class="h-80 w-full rounded-3xl" />
                </div>

                <div v-else-if="!spots || spots.length === 0"
                    class="mt-20 text-center py-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem]">
                    <UnoIcon i="i-ph-map-pin-slash" class="text-6xl text-zinc-300 dark:text-zinc-700" />
                    <h3 class="mt-4 text-xl font-bold text-zinc-400">Không tìm thấy địa điểm nào</h3>
                    <p class="text-sm text-zinc-500 mt-1">Thử thay đổi bộ lọc hoặc Refresh lại trang</p>
                    <button @click="refresh"
                        class="mt-6 px-6 py-2 bg-zinc-900 dark:bg-white dark:text-black text-white rounded-full font-bold">Thử
                        lại</button>
                </div>

                <div v-else class="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <HotSpotCard v-for="spot in spots" :key="spot.id" :spot="spot" @click="selectSpot(spot.id)"
                        class="cursor-pointer" />
                </div>

                <!-- Mini Footer / Social Section -->
                <div class="mt-20 pt-12 border-t border-zinc-100 dark:border-zinc-800">
                    <div class="flex items-center justify-between flex-wrap gap-4">
                        <h4 class="text-xl font-bold flex items-center gap-2">
                            Góc cộng đồng
                            <span
                                class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-[10px] rounded uppercase font-black tracking-tighter">New</span>
                        </h4>
                        <button class="text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                            <UnoIcon i="i-ph-x-bold" class="text-xl" />
                        </button>
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
                </div>
            </div>
        </div>

        <!-- Detail Modal -->
        <HotSpotDetailModal v-model="isDetailOpen" :spot-id="selectedSpotId" />
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
</style>
