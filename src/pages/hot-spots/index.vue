<script setup lang="ts">
import type { HotSpot, GetHotSpotsQuery } from '~/types/api';

const { t } = useI18n();

const filters = ref<GetHotSpotsQuery>({
    category: '',
    lat: undefined,
    lng: undefined,
});

// Computed để nhãn danh mục cập nhật ngay khi đổi ngôn ngữ.
const categories = computed(() => [
    { label: t('hotSpots.categories.all'), value: '' },
    { label: t('hotSpots.categories.checkin'), value: 'Check-in' },
    { label: t('hotSpots.categories.nature'), value: 'Cảnh đẹp' },
    { label: t('hotSpots.categories.spiritual'), value: 'Vãn cảnh' },
    { label: t('hotSpots.categories.food'), value: 'Ẩm thực' },
]);

const selectedSpotId = ref<string | null>(null);
const isDetailOpen = ref(false);

const { data: spots, isLoading, isFetching, refetch: refresh } = useHotSpotsQuery(filters);

// Tìm kiếm tại chỗ trên danh sách đã tải, không gọi lại API.
const searchQuery = ref('');
const filteredSpots = computed(() => {
    const list: HotSpot[] = spots.value || [];
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) return list;
    return list.filter((spot) =>
        spot.name?.toLowerCase().includes(query) || spot.address?.toLowerCase().includes(query));
});

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

const isCustomTourOpen = ref(false);

const clearSearch = () => {
    searchQuery.value = '';
};

useHead({
    title: `${t('hotSpots.title')} | ANDAGO`,
});
</script>

<template>
    <div class="hot-spots-page">
        <UiPageHero :eyebrow="t('nav.hotSpots')" :title="t('hotSpots.title')" :intro="t('hotSpots.discoverMost')">
            <template #actions>
                <UiButton @click="isCustomTourOpen = true">{{ t('hotSpots.buildTrip') }}</UiButton>
            </template>
        </UiPageHero>

        <section class="shell hot-spots-layout" aria-labelledby="hot-spots-toolbar-title">
            <!-- Toolbar -->
            <div class="hs-toolbar">
                <div class="hs-toolbar__row">
                    <h2 id="hot-spots-toolbar-title" class="visually-hidden">{{ t('hotSpots.title') }}</h2>
                    <div class="hs-chips" role="group" :aria-label="t('common.category')">
                        <UiChip v-for="cat in categories" :key="cat.value" :active="filters.category === cat.value"
                            @click="filters.category = cat.value">
                            {{ cat.label }}
                        </UiChip>
                    </div>

                    <label class="visually-hidden" for="hs-search">{{ t('hotSpots.searchPlaceholder') }}</label>
                    <input id="hs-search" v-model="searchQuery" type="search" class="ui-control ui-control--pill hs-search"
                        :placeholder="t('hotSpots.searchPlaceholder')">
                </div>

                <div class="hs-toolbar__row hs-toolbar__row--secondary">
                    <div class="view-toggle" role="group" :aria-label="t('hotSpots.viewModeLabel')">
                        <button type="button" :aria-pressed="!isMapView" @click="isMapView = false">
                            {{ t('common.grid') }}
                        </button>
                        <button type="button" :aria-pressed="isMapView" @click="isMapView = true">
                            {{ t('hotSpots.map') }}
                        </button>
                    </div>

                    <button v-if="!isMapView" type="button" class="hs-minimap-toggle" :aria-pressed="isMiniMap"
                        @click="isMiniMap = !isMiniMap">
                        {{ t('hotSpots.miniMap') }}
                    </button>

                    <span class="hs-location-source">
                        {{ t('hotSpots.locationSource') }}: {{ isFallback ? 'IP' : 'GPS' }}
                    </span>
                </div>

                <p v-if="locationErrorMessage" class="hs-location-error" role="alert">{{ locationErrorMessage }}</p>
            </div>

            <!-- Mini map -->
            <div v-if="isMiniMap && !isMapView" class="hs-mini-map" role="region" :aria-label="t('hotSpots.miniMap')">
                <ClientOnly>
                    <LeafletMap :spots="filteredSpots" :selected-spot-id="selectedSpotId" @select-spot="selectSpot"
                        :center="filters.lat && filters.lng ? [filters.lat, filters.lng] : undefined" />
                </ClientOnly>
            </div>

            <!-- Loading -->
            <ul v-if="isLoading" class="hs-grid" role="list" aria-busy="true">
                <li v-for="i in 8" :key="i">
                    <UiSkeletonCard />
                </li>
            </ul>

            <!-- Empty -->
            <UiEmptyState v-else-if="!spots || spots.length === 0" :title="t('common.noLocationsFound')"
                :description="t('common.tryAgain')">
                <UiButton variant="outline" @click="() => refresh()">{{ t('common.reload') }}</UiButton>
            </UiEmptyState>

            <!-- Map view -->
            <div v-else-if="isMapView" class="hs-map-frame" role="region" :aria-label="t('hotSpots.mapRegionLabel')">
                <ClientOnly>
                    <LeafletMap :spots="filteredSpots" :selected-spot-id="selectedSpotId" @select-spot="selectSpot"
                        :center="filters.lat && filters.lng ? [filters.lat, filters.lng] : undefined" />
                </ClientOnly>
            </div>

            <!-- Grid view -->
            <template v-else>
                <ul v-if="filteredSpots.length > 0" class="hs-grid" role="list" :aria-busy="isFetching ? 'true' : 'false'">
                    <li v-for="spot in filteredSpots" :key="spot.id">
                        <HotSpotCard :spot="spot" :is-locating="isLocating" class="hs-grid__item" @click="selectSpot(spot.id)" />
                    </li>
                </ul>
                <UiEmptyState v-else :title="t('common.noLocationsFound')" :description="t('common.tryAgain')">
                    <UiButton variant="outline" @click="clearSearch">{{ t('hotSpots.clearFilters') }}</UiButton>
                </UiEmptyState>
            </template>
        </section>

        <!-- Detail Modal -->
        <HotSpotDetailModal v-model="isDetailOpen" :spot-id="selectedSpotId" @change-spot="selectedSpotId = $event" />

        <!-- Custom Tour Builder Dialog -->
        <el-dialog v-model="isCustomTourOpen" width="1200" align-center destroy-on-close :show-close="true"
            :lock-scroll="true" class="custom-tour-dialog">
            <CustomTourBuilder />
        </el-dialog>
    </div>
</template>

<style scoped>
.hot-spots-layout {
    padding-bottom: var(--section-space);
}

/* Toolbar */
.hs-toolbar {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    padding-bottom: var(--space-5);
    margin-bottom: var(--space-fluid-md);
    border-bottom: 1px solid var(--color-border-strong);
}

.hs-toolbar__row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
}

.hs-chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
}

.hs-search {
    flex: 1 1 14rem;
    max-width: 20rem;
    min-height: 2.5rem;
    padding-block: var(--space-2);
    font-size: var(--text-md);
}

.view-toggle {
    display: inline-flex;
    padding: 3px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-pill);
}

.view-toggle button {
    min-height: 2.125rem;
    padding: 0 0.875rem;
    border-radius: var(--radius-pill);
    color: var(--color-text-muted);
    font-size: var(--text-md);
}

.view-toggle button:hover {
    color: var(--color-text);
}

.view-toggle button[aria-pressed='true'] {
    background: var(--color-text);
    color: var(--color-bg);
}

.hs-minimap-toggle {
    min-height: 2.125rem;
    padding: 0 var(--space-4);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-pill);
    color: var(--color-text-muted);
    font-size: var(--text-md);
    transition: border-color var(--transition-base), color var(--transition-base), background-color var(--transition-base);
}

.hs-minimap-toggle:hover {
    border-color: var(--color-text);
    color: var(--color-text);
}

.hs-minimap-toggle[aria-pressed='true'] {
    border-color: var(--color-text);
    background: var(--color-text);
    color: var(--color-bg);
}

.hs-location-source {
    margin-left: auto;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.hs-location-error {
    color: var(--color-danger);
    font-size: var(--text-sm);
}

.view-toggle button:focus-visible,
.hs-minimap-toggle:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}

/* Kết quả */
.hs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
    gap: var(--space-fluid-md) var(--space-fluid-sm);
    transition: opacity var(--transition-base);
}

.hs-grid :deep(.hs-grid__item) {
    cursor: pointer;
}

[aria-busy='true'] {
    opacity: 0.55;
}

.hs-map-frame {
    height: min(70vh, 640px);
}

.hs-mini-map {
    height: min(40vh, 320px);
    margin-bottom: var(--space-fluid-md);
}
</style>
