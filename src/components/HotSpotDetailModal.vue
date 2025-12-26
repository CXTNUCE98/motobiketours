<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { HotSpot } from '~/types/api';
import { useHotSpotByIdQuery } from '~/composables/useHotSpotsQuery';
import TourGallery from '~/components/TourGallery.vue';

const props = defineProps<{
    spotId: string | null;
    modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'change-spot']);

const { t } = useI18n();

const { data: spot, isLoading } = useHotSpotByIdQuery(computed(() => props.spotId || ''));

const dialogVisible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});

const handleClose = () => {
    dialogVisible.value = false;
};

const openGoogleMaps = () => {
    if (spot.value?.lat && spot.value?.lng) {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${spot.value.lat},${spot.value.lng}`, '_blank');
    }
};

function contactUs() {
    console.log('running');

}
</script>

<template>
    <el-dialog v-model="dialogVisible" width="90%"
        class="hot-spot-detail-dialog max-w-5xl dark:bg-zinc-900 rounded-3xl overflow-hidden" :show-close="false"
        :lock-scroll="true" :before-close="handleClose" destroy-on-close align-center>
        <div v-if="isLoading" class="p-20 flex justify-center items-center h-96">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>

        <div v-else-if="spot"
            class="relative bg-white dark:bg-zinc-900 overflow-hidden flex flex-col h-[90vh] rounded-3xl">
            <!-- Header -->
            <div
                class="px-6 py-4 flex items-center justify-between bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 z-10">
                <div>
                    <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{{ spot.name }}</h2>
                    <div class="flex items-center gap-2 mt-1">
                        <el-rate v-model="spot.rating" disabled show-score text-color="#ff9900"
                            score-template="{value}" />
                        <span class="text-sm text-zinc-500">• {{ spot.category }}</span>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <button
                        class="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        <i class='bx bx-heart text-xl'></i>
                    </button>
                    <button @click="handleClose"
                        class="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        <i class='bx bx-x text-2xl'></i>
                    </button>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto p-6">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Left: Images -->
                    <div class="space-y-4">
                        <TourGallery :images="spot.images || []" :title="spot.name" />

                        <div
                            class="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <h4 class="font-bold flex items-center gap-2 mb-3 text-lg">
                                <i class='bx bx-info-circle text-blue-600'></i>
                                {{ t('hotSpots.description') || 'Mô tả chi tiết' }}
                            </h4>
                            <p class="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
                                {{ spot.description }}
                            </p>
                        </div>
                    </div>

                    <!-- Right: Info & Actions -->
                    <div class="space-y-6">
                        <!-- Info Cards Grid -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <!-- Opening Hours -->
                            <div
                                class="bg-green-50 dark:bg-green-900/10 p-4 rounded-2xl border border-green-100 dark:border-green-900/30">
                                <div class="flex items-center gap-3 mb-2">
                                    <div
                                        class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                                        <i class='bx bx-time-five text-lg'></i>
                                    </div>
                                    <span class="font-bold text-green-700 dark:text-green-400">{{
                                        t('common.openingHours') }}</span>
                                </div>
                                <p class="text-sm font-medium pl-11">{{ spot.opening_hours || t('common.updating') }}
                                </p>
                            </div>

                            <!-- Price -->
                            <div
                                class="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                                <div class="flex items-center gap-3 mb-2">
                                    <div
                                        class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                                        <i class='bx bx-money text-lg'></i>
                                    </div>
                                    <span class="font-bold text-blue-700 dark:text-blue-400">{{ t('common.priceInfo')
                                        }}</span>
                                </div>
                                <p class="text-sm font-medium pl-11">{{ spot.price_info || t('common.free') }}</p>
                            </div>
                        </div>

                        <!-- Address -->
                        <div
                            class="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-start gap-4">
                            <div
                                class="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 flex-shrink-0">
                                <i class='bx bx-map text-xl'></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-sm text-zinc-400 uppercase tracking-wider mb-1">{{
                                    t('common.address') }}</h4>
                                <p class="text-zinc-900 dark:text-zinc-100 font-medium">{{ spot.address }}</p>
                                <div class="mt-2 flex items-center gap-2 text-xs text-zinc-500">
                                    <span class="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">Lat: {{ spot.lat
                                        }}</span>
                                    <span class="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">Lng: {{ spot.lng
                                        }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Regulations -->
                        <div
                            class="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                            <h4
                                class="font-bold text-sm text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <i class='bx bx-notepad'></i>
                                {{ t('common.rules') }}
                            </h4>
                            <ul class="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                                <li class="flex items-start gap-2">
                                    <i class='bx bx-check text-green-500 mt-0.5'></i>
                                    <span>{{ t('common.maintainClean') }}</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <i class='bx bx-check text-green-500 mt-0.5'></i>
                                    <span>{{ t('common.adhereRegulations') }}</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <i class='bx bx-check text-green-500 mt-0.5'></i>
                                    <span>{{ t('common.touchExhibits') }}</span>
                                </li>
                            </ul>
                        </div>

                        <!-- Actions -->
                        <div class="pt-4 flex items-center gap-4">
                            <button @click="openGoogleMaps" size="large"
                                class="w-full py-4 bg-zinc-600 dark:bg-light-500 text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                                <i class='bx bxs-direction-right text-xl'></i>
                                {{ t('common.directions') }}
                            </button>
                            <el-tooltip content="Contact Us to custom your trip" placement="top">
                                <button @click="contactUs" size="large"
                                    class="w-full py-4 bg-blue-600 dark:bg-blue-500 text-white dark:text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                                    <i class='bx bxs-direction-right text-xl'></i>
                                    {{ t('common.contactUs') }}
                                </button>
                            </el-tooltip>
                        </div>
                    </div>
                </div>

                <!-- Nearby suggestions -->
                <div v-if="spot.nearby?.length" class="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                    <h4 class="text-xl font-bold mb-6 flex items-center justify-between">
                        <span>{{ t('hotSpots.nearbySuggestions') }}</span>
                    </h4>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        <div v-for="near in spot.nearby" :key="near.id" class="group cursor-pointer"
                            @click="emit('change-spot', near.id)">
                            <div
                                class="aspect-square rounded-2xl overflow-hidden mb-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 relative">
                                <img :src="near.images?.[0] || '/placeholder.jpg'"
                                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div
                                    class="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full">
                                    {{ Math.round(near.distance * 10) / 10 }}km
                                </div>
                            </div>
                            <h5
                                class="font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-blue-600 transition-colors">
                                {{ near.name }}</h5>
                            <p class="text-xs text-zinc-500">{{ near.category }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<style scoped>
.hot-spot-detail-dialog :deep(.el-dialog) {
    background: transparent !important;
    box-shadow: none !important;
    border: none !important;
}

.hot-spot-detail-dialog :deep(.el-dialog__header) {
    display: none;
}

.hot-spot-detail-dialog :deep(.el-dialog__body) {
    padding: 0;
    height: 100%;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
