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

const tabs = ['spots', 'vehicle', 'map'] as const;
const activeTab = ref<typeof tabs[number]>('spots');

// Watch for changes to update estimate
watch([selectedSpots, selectedVehicle], () => {
    if (selectedSpots.value.length >= 2 && selectedVehicle.value) {
        estimateRoute({
            hotSpotIds: selectedSpots.value.map(s => s.id),
            vehicleId: selectedVehicle.value.id
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
    contactMessage.value = `I would like to book a trip with the following itinerary:\n\n${spotsList}${vehicleInfo}\n\nTotal distance: ${estimate.value?.distance || 0} km\nEstimated Price: $${estimate.value?.priceEstimateUsd || 0}`;
    showContactPopup.value = true;
};
</script>

<template>
    <div class="tour-builder">
        <header class="tour-builder__head">
            <h1 class="tour-builder__title">{{ t('customTour.title') }}</h1>
            <p class="tour-builder__subtitle">{{ t('customTour.subtitle') }}</p>
        </header>

        <div class="tour-builder__layout">
            <!-- Left: Selection Area -->
            <div class="tour-builder__main">
                <div class="tour-tabs" role="tablist" :aria-label="t('customTour.tabsLabel')">
                    <button v-for="tab in tabs" :id="`tour-tab-${tab}`" :key="tab" type="button" role="tab"
                        :aria-selected="activeTab === tab" :aria-controls="`tour-panel-${tab}`"
                        :tabindex="activeTab === tab ? 0 : -1" @click="activeTab = tab">
                        {{ t(`customTour.tabs.${tab}`) }}
                    </button>
                </div>

                <div v-show="activeTab === 'spots'" id="tour-panel-spots" role="tabpanel"
                    aria-labelledby="tour-tab-spots">
                    <ul v-loading="isLoadingSpots" class="tour-spot-grid" role="list">
                        <li v-for="spot in allSpots" :key="spot.id">
                            <HotSpotCard :spot="spot" :is-show-add="true" :is-locating="isLocating"
                                :is-in-trip="isInTrip(spot.id)" @add-to-trip="addToTrip"
                                @remove-from-trip="removeFromTrip" />
                        </li>
                    </ul>
                </div>

                <div v-show="activeTab === 'vehicle'" id="tour-panel-vehicle" role="tabpanel"
                    aria-labelledby="tour-tab-vehicle">
                    <VehicleSelector />
                </div>

                <div v-show="activeTab === 'map'" id="tour-panel-map" class="tour-map-frame" role="tabpanel"
                    aria-labelledby="tour-tab-map">
                    <ClientOnly>
                        <LeafletMap ref="mapRef" :spots="selectedSpots" :route-geometry="estimate?.geometry" />
                    </ClientOnly>
                </div>
            </div>

            <!-- Right: Itinerary & Summary -->
            <div class="tour-builder__side">
                <section class="tour-itinerary" aria-labelledby="tour-itinerary-title">
                    <div class="tour-itinerary__head">
                        <h2 id="tour-itinerary-title">{{ t('customTour.myItinerary') }}</h2>
                        <span class="tour-itinerary__count">{{ selectedSpots.length }} {{ t('customTour.stops') }}</span>
                    </div>

                    <UiEmptyState v-if="selectedSpots.length === 0" :title="t('customTour.emptyItinerary')" />

                    <draggable v-else v-model="draggableSpots" item-key="id" handle=".drag-handle" tag="ol"
                        ghost-class="ghost-spot" class="tour-itinerary__list" role="list">
                        <template #item="{ element: spot, index }">
                            <li class="tour-itinerary__item">
                                <button type="button" class="drag-handle" :aria-label="t('customTour.dragHandle')">
                                    <i class='bx bx-dots-vertical-rounded' aria-hidden="true"></i>
                                </button>
                                <span class="tour-itinerary__number" aria-hidden="true">{{ index + 1 }}</span>
                                <span class="tour-itinerary__body">
                                    <strong>{{ spot.name }}</strong>
                                    <span>{{ spot.address }}</span>
                                </span>
                                <button type="button" class="tour-itinerary__remove" @click="removeFromTrip(spot.id)">
                                    {{ t('customTour.removeStop') }}
                                </button>
                            </li>
                        </template>
                    </draggable>
                </section>

                <section class="tour-summary" aria-labelledby="tour-summary-title">
                    <h2 id="tour-summary-title">{{ t('customTour.summary') }}</h2>

                    <dl class="tour-summary__facts">
                        <div>
                            <dt>{{ t('customTour.totalDistance') }}</dt>
                            <dd>
                                <span v-if="isEstimating">…</span>
                                <span v-else>{{ t('customTour.distanceValue', { value: estimate?.distance || 0 }) }}</span>
                            </dd>
                        </div>
                        <div>
                            <dt>{{ t('customTour.travelTime') }}</dt>
                            <dd>
                                <span v-if="isEstimating">…</span>
                                <span v-else>{{ t('customTour.durationValue', { value: estimate?.duration || 0 }) }}</span>
                            </dd>
                        </div>
                        <div>
                            <dt>{{ t('customTour.vehicle') }}</dt>
                            <dd>{{ selectedVehicle?.model || t('common.none') }}</dd>
                        </div>
                    </dl>

                    <div class="tour-summary__price">
                        <p>{{ t('customTour.estimatedPrice') }}</p>
                        <p class="tour-summary__price-value">
                            ${{ estimate?.priceEstimateUsd || 0 }} <span>USD</span>
                        </p>
                    </div>

                    <UiButton variant="ink" block :disabled="selectedSpots.length < 2 || !selectedVehicle"
                        @click="contactUs">
                        {{ t('common.contactUs') }}
                    </UiButton>
                </section>
            </div>
        </div>

        <ContactPopup v-model="showContactPopup" :subject="contactSubject" :message="contactMessage" />
    </div>
</template>

<style scoped>
.tour-builder {
    max-height: 85vh;
    overflow-y: auto;
    padding: var(--space-fluid-md);
    background: var(--color-bg);
    color: var(--color-text);
}

.tour-builder__head {
    margin-bottom: var(--space-fluid-md);
}

.tour-builder__title {
    font-family: var(--font-serif);
    font-size: var(--text-h3);
    font-weight: var(--weight-regular);
}

.tour-builder__subtitle {
    margin-top: var(--space-2);
    color: var(--color-text-muted);
}

.tour-builder__layout {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
    gap: var(--space-fluid-xl);
    align-items: start;
}

@media (min-width: 64rem) {
    .tour-builder__layout {
        grid-template-columns: 2fr 1fr;
    }
}

.tour-builder__main {
    min-width: 0;
}

/* Tabs */
.tour-tabs {
    display: inline-flex;
    flex-wrap: wrap;
    padding: 3px;
    margin-bottom: var(--space-fluid-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-pill);
}

.tour-tabs button {
    min-height: 2.25rem;
    padding: 0 var(--space-4);
    border-radius: var(--radius-pill);
    color: var(--color-text-muted);
    font-size: var(--text-md);
    font-weight: var(--weight-medium);
}

.tour-tabs button:hover {
    color: var(--color-text);
}

.tour-tabs button[aria-selected='true'] {
    background: var(--color-text);
    color: var(--color-bg);
}

.tour-spot-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr));
    gap: var(--space-fluid-md) var(--space-fluid-sm);
}

.tour-map-frame {
    height: min(65vh, 560px);
}

/* Itinerary */
.tour-itinerary {
    padding-bottom: var(--space-fluid-sm);
    margin-bottom: var(--space-fluid-md);
    border-bottom: 1px solid var(--color-border-strong);
}

.tour-itinerary__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-3);
    padding-bottom: var(--space-4);
    margin-bottom: var(--space-2);
    border-bottom: 1px solid var(--color-border-strong);
}

.tour-itinerary__head h2 {
    font-family: var(--font-serif);
    font-size: var(--text-title);
    font-weight: var(--weight-regular);
}

.tour-itinerary__count {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.tour-itinerary__list {
    border-bottom: 1px solid var(--color-border);
}

.tour-itinerary__item {
    display: grid;
    grid-template-columns: auto auto 1fr auto;
    align-items: center;
    gap: var(--space-3);
    padding-block: var(--space-3);
    border-top: 1px solid var(--color-border);
}

.drag-handle {
    color: var(--color-text-muted);
    cursor: grab;
}

.drag-handle:active {
    cursor: grabbing;
}

.drag-handle:hover {
    color: var(--color-accent);
}

.tour-itinerary__number {
    color: var(--color-accent);
    font-family: var(--font-serif);
    font-size: var(--text-2xl);
    font-style: italic;
    font-variant-numeric: lining-nums tabular-nums;
}

.tour-itinerary__body {
    display: grid;
    gap: 0.125rem;
    min-width: 0;
}

.tour-itinerary__body strong {
    overflow: hidden;
    font-weight: var(--weight-medium);
    text-overflow: ellipsis;
    white-space: nowrap;
}

.tour-itinerary__body span {
    overflow: hidden;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    text-overflow: ellipsis;
    white-space: nowrap;
}

.tour-itinerary__remove {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    text-decoration: underline;
    text-underline-offset: 0.25em;
}

.tour-itinerary__remove:hover {
    color: var(--color-danger);
}

.ghost-spot {
    border: 1px dashed var(--color-accent);
    background: var(--color-bg-subtle);
    opacity: 0.6;
}

/* Summary */
.tour-summary {
    padding: var(--space-panel);
    border-radius: var(--radius-lg);
    background: var(--color-accent);
    color: var(--color-on-accent);
    --focus-color: var(--color-on-accent);
}

.tour-summary h2 {
    margin-bottom: var(--space-5);
    font-family: var(--font-serif);
    font-size: var(--text-title);
    font-weight: var(--weight-regular);
}

.tour-summary__facts {
    display: grid;
    gap: var(--space-3);
    margin-bottom: var(--space-6);
}

.tour-summary__facts > div {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-3);
    padding-bottom: var(--space-3);
    border-bottom: 1px solid color-mix(in srgb, currentColor 35%, transparent);
}

.tour-summary__facts dt {
    opacity: 0.75;
    font-size: var(--text-sm);
}

.tour-summary__facts dd {
    font-weight: var(--weight-semibold);
}

.tour-summary__price {
    margin-bottom: var(--space-6);
}

.tour-summary__price > p:first-child {
    margin-bottom: 0.25rem;
    opacity: 0.75;
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.tour-summary__price-value {
    font-family: var(--font-serif);
    font-size: var(--text-h3);
}

.tour-summary__price-value span {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
}

.tour-builder button:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}
</style>
