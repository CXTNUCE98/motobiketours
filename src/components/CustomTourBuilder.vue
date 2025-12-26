<script setup lang="ts">
import draggable from 'vuedraggable';
import { useCustomTour } from '~/composables/useCustomTour';
import { useEstimateTour } from '~/composables/useEstimateTour';
import { useHotSpotsQuery } from '~/composables/useHotSpotsQuery';
import type { GetHotSpotsQuery } from '~/types/api';
import ContactPopup from '~/components/ContactPopup.vue';

const { t } = useI18n();
const {
    selectedSpots,
    selectedVehicle,
    addToTrip,
    removeFromTrip,
    isInTrip,
    reorderSpots
} = useCustomTour();

const showContactPopup = ref(false);
const contactSubject = ref('');
const contactMessage = ref('');

// Computed property for draggable to use (it needs a getter/setter or a bound array)
const draggableSpots = computed({
    get: () => selectedSpots.value,
    set: (val) => reorderSpots(val)
});

const { coords, isSupported, isLoading: isGeoLoading } = useGeolocationStore();
const filters = ref<GetHotSpotsQuery>({
    lat: undefined,
    lng: undefined
});

watch(coords, (newCoords) => {
    if (newCoords && newCoords.latitude !== Infinity && newCoords.latitude !== 0) {
        filters.value.lat = newCoords.latitude;
        filters.value.lng = newCoords.longitude;
    }
}, { immediate: true });

const { data: allSpots, isLoading: isLoadingSpots, isFetching } = useHotSpotsQuery(filters);
const { mutate: estimateRoute, data: estimate, isPending: isEstimating } = useEstimateTour();

const isLocating = computed(() => {
    if (filters.value.lat === undefined) return isSupported.value || isGeoLoading.value;
    return isFetching.value;
});

const activeTab = ref('spots');

// Watch for changes to update estimate
watch([selectedSpots, selectedVehicle], () => {
    if (selectedSpots.value.length >= 2 && selectedVehicle.value) {
        estimateRoute({
            hot_spot_ids: selectedSpots.value.map(s => s.id),
            vehicle_id: selectedVehicle.value.id
        });
    }
}, { deep: true });

const mapRef = ref();

watch(activeTab, (newTab) => {
    if (newTab === 'map') {
        // Delay to ensure DOM is updated and visible
        nextTick(() => {
            mapRef.value?.invalidateSize();
        });
    }
});

const contactUs = () => {
    const spotsList = selectedSpots.value.map((s, i) => `${i + 1}. ${s.name} (${s.address})`).join('\n');
    const vehicleInfo = selectedVehicle.value ? `\nVehicle: ${selectedVehicle.value.model}` : '';
    contactSubject.value = `Custom Tour Request: ${selectedSpots.value.length} stops`;
    contactMessage.value = `I would like to book a trip with the following itinerary:\n\n${spotsList}${vehicleInfo}\n\nTotal distance: ${estimate.value?.distance || 0} km\nEstimated Price: $${estimate.value?.price_estimate_usd || 0}`;
    showContactPopup.value = true;
};
</script>

<template>
    <div class="bg-zinc-50 dark:bg-black h-full overflow-y-auto p-4 md:p-8">
        <el-scrollbar>
            <div class="max-w-[1600px] mx-auto">
                <!-- Header -->
                <div class="mb-8">
                    <h1 class="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">
                        {{ t('customTour.title') }}
                    </h1>
                    <p class="text-zinc-500 dark:text-zinc-400">
                        {{ t('customTour.subtitle') }}
                    </p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <!-- Left Section: Selection Area -->
                    <div class="lg:col-span-8 space-y-8">
                        <!-- Tabs & Actions -->
                        <div class="flex flex-wrap items-center justify-between gap-4">
                            <div class="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl w-fit">
                                <button v-for="tab in ['spots', 'vehicle', 'map']" :key="tab" @click="activeTab = tab"
                                    class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
                                    :class="activeTab === tab ? 'bg-white dark:bg-zinc-700 text-blue-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'">
                                    {{ t(`customTour.tabs.${tab}`) }}
                                </button>
                            </div>
                        </div>

                        <div v-show="activeTab === 'spots'">
                            <div v-loading="isLoadingSpots" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <HotSpotCard v-for="spot in allSpots" :key="spot.id" :spot="spot" :isShowAdd="true"
                                    :is-locating="isLocating" :isInTrip="isInTrip(spot.id)" @addToTrip="addToTrip"
                                    @removeFromTrip="removeFromTrip" />
                            </div>
                        </div>

                        <div v-show="activeTab === 'vehicle'">
                            <VehicleSelector />
                        </div>

                        <div v-show="activeTab === 'map'"
                            class="h-[600px] rounded-[2.5rem] overflow-hidden border border-zinc-200 dark:border-zinc-800">
                            <ClientOnly>
                                <LeafletMap ref="mapRef" :spots="selectedSpots" :route-geometry="estimate?.geometry" />
                            </ClientOnly>
                        </div>
                    </div>

                    <!-- Right Section: Itinerary & Summary -->
                    <div class="lg:col-span-4 space-y-6">
                        <!-- Itinerary -->
                        <div
                            class="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-6 shadow-sm">
                            <h3 class="text-xl font-bold mb-6 dark:text-white flex items-center justify-between">
                                <span>{{ t('customTour.myItinerary') }}</span>
                                <span class="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">{{
                                    selectedSpots.length }} {{ t('customTour.stops') }}</span>
                            </h3>

                            <div v-if="selectedSpots.length === 0" class="py-12 text-center">
                                <i class='bx bx-map-pin text-4xl text-zinc-300 mb-2'></i>
                                <p class="text-zinc-400 text-sm">{{ t('customTour.emptyItinerary') }}</p>
                            </div>

                            <div v-else>
                                <draggable v-model="draggableSpots" item-key="id" handle=".drag-handle"
                                    ghost-class="ghost-spot" class="space-y-4">
                                    <template #item="{ element: spot, index }">
                                        <div
                                            class="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl group border border-transparent hover:border-blue-100 dark:hover:border-blue-500/30 transition-all">
                                            <div
                                                class="drag-handle cursor-grab active:cursor-grabbing text-zinc-300 hover:text-blue-500 transition-colors">
                                                <i class='bx bx-dots-vertical-rounded text-xl'></i>
                                            </div>
                                            <div
                                                class="w-7 h-7 flex-shrink-0 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                                                {{ index + 1 }}
                                            </div>
                                            <div class="flex-grow min-w-0">
                                                <h4 class="font-bold text-sm dark:text-white truncate">{{ spot.name }}
                                                </h4>
                                                <p class="text-[10px] text-zinc-400 truncate">{{ spot.address }}</p>
                                            </div>
                                            <div
                                                class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button @click="removeFromTrip(spot.id)"
                                                    class="text-zinc-400 hover:text-red-500 p-1">
                                                    <i class='bx bx-trash text-lg'></i>
                                                </button>
                                            </div>
                                        </div>
                                    </template>
                                </draggable>
                            </div>
                        </div>

                        <!-- Summary & Price -->
                        <div
                            class="bg-blue-600 text-white rounded-[2.5rem] p-8 shadow-xl shadow-blue-500/20 relative overflow-hidden">
                            <!-- Decorative bg -->
                            <div
                                class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl">
                            </div>

                            <h3 class="text-xl font-bold mb-6">{{ t('customTour.summary') }}</h3>

                            <div class="space-y-4 mb-8">
                                <div class="flex justify-between items-center py-2 border-b border-white/10">
                                    <span class="text-white/60 text-sm">{{ t('customTour.totalDistance') }}</span>
                                    <span v-if="isEstimating" class="animate-pulse">...</span>
                                    <span v-else class="font-bold">{{ estimate?.distance || 0 }} km</span>
                                </div>
                                <div class="flex justify-between items-center py-2 border-b border-white/10">
                                    <span class="text-white/60 text-sm">{{ t('customTour.travelTime') }}</span>
                                    <span v-if="isEstimating" class="animate-pulse">...</span>
                                    <span v-else class="font-bold">{{ estimate?.duration || 0 }} min</span>
                                </div>
                                <div
                                    class="flex justify-between items-center py-2  hover:bg-white/5 rounded-lg px-2 -mx-2 transition-colors">
                                    <span class="text-white/60 text-sm">{{ t('customTour.vehicle') }}</span>
                                    <div class="flex items-center gap-2">
                                        <span class="font-bold">{{ selectedVehicle?.model || t('common.none') }}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p class="text-white/60 text-xs mb-1">{{ t('customTour.estimatedPrice') }}</p>
                                <div class="flex items-baseline gap-2">
                                    <span class="text-4xl font-black">${{ estimate?.price_estimate_usd || 0 }}</span>
                                    <span class="text-sm font-medium">USD</span>
                                </div>
                            </div>

                            <button @click="contactUs"
                                class="w-full mt-8 py-4 bg-white text-blue-600 rounded-2xl font-black hover:bg-zinc-100 transition-colors shadow-lg active:scale-95 disabled:opacity-50"
                                :disabled="selectedSpots.length < 2 || !selectedVehicle">
                                {{ t('common.contactUs') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </el-scrollbar>

        <ContactPopup v-model="showContactPopup" :subject="contactSubject" :message="contactMessage" />
    </div>
</template>

<style scoped>
.ghost-spot {
    opacity: 0.5;
    background: #ebf5ff !important;
    border: 2px dashed #3b82f6 !important;
}
</style>
