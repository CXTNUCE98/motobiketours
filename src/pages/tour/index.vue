<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const { t } = useI18n();

const searchQuery = ref('');
const showFilters = ref(false);
const viewMode = ref<'grid' | 'list'>('grid');
const sortBy = ref('default'); // 'default', 'price-low', 'price-high', 'duration'

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

watch(sortBy, () => {
    currentPage.value = 1;
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

    // Map UI sort values to API sort params
    if (sortBy.value === 'price-low') {
        filters.sortBy = 'priceUsd';
        filters.sortOrder = 'ASC';
    } else if (sortBy.value === 'price-high') {
        filters.sortBy = 'priceUsd';
        filters.sortOrder = 'DESC';
    } else if (sortBy.value === 'duration') {
        filters.sortBy = 'durationRange';
        filters.sortOrder = 'ASC';
    }
    // 'default' → no sortBy/sortOrder (use API defaults)

    return filters;
});

// Query
const { data, isLoading, isFetching } = useToursQuery(apiFilters);

const tours = computed(() => (data.value as any)?.data || []);
const totalPages = computed(() => (data.value as any)?.totalPages || 1);
const totalTours = computed(() => (data.value as any)?.total || 0);

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

const sortOptions = computed(() => [
    { label: t('tour.filter.sortOptions.default'), value: 'default' },
    { label: t('tour.filter.sortOptions.priceLow'), value: 'price-low' },
    { label: t('tour.filter.sortOptions.priceHigh'), value: 'price-high' },
    { label: t('tour.filter.sortOptions.duration'), value: 'duration' }
]);

// Khóa cuộn trang khi bộ lọc mobile đang mở
watch(showFilters, (open) => {
    document.body.style.overflow = open ? 'hidden' : '';
});

onBeforeUnmount(() => {
    document.body.style.overflow = '';
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
    <div class="tour-page">
        <UiPageHero :eyebrow="t('tour.journeyOfDiscovery')" :title="t('tour.experience')"
            :emphasis="t('tour.peakTour')" :intro="t('tour.peakTourDesc')" />

        <section class="shell tour-layout" aria-labelledby="tour-results-title">
            <!-- Sidebar Filter (Desktop) -->
            <aside class="tour-layout__sidebar">
                <TourFilter :initial-filters="activeFilters" @apply="handleApplyFilters" @clear="handleClearFilters" />
            </aside>

            <div class="tour-layout__results">
                <!-- Toolbar -->
                <div class="tour-toolbar">
                    <h2 id="tour-results-title" class="tour-toolbar__count">
                        {{ t('tour.count', { count: totalTours }, totalTours) }}
                    </h2>

                    <div class="tour-toolbar__controls">
                        <UiButton class="tour-toolbar__filter" variant="outline" size="sm" aria-controls="tour-filter-sheet"
                            :aria-expanded="showFilters" @click="showFilters = true">
                            {{ t('tour.filterBtn') }}
                        </UiButton>

                        <label class="visually-hidden" for="tour-sort">{{ t('tour.filter.sortBy') }}</label>
                        <select id="tour-sort" v-model="sortBy" class="ui-control ui-control--pill tour-toolbar__sort">
                            <option v-for="item in sortOptions" :key="item.value" :value="item.value">
                                {{ item.label }}
                            </option>
                        </select>

                        <div class="view-toggle" role="group" :aria-label="t('tour.viewMode')">
                            <button type="button" :aria-pressed="viewMode === 'grid'" @click="viewMode = 'grid'">
                                {{ t('tour.viewGrid') }}
                            </button>
                            <button type="button" :aria-pressed="viewMode === 'list'" @click="viewMode = 'list'">
                                {{ t('tour.viewList') }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Skeleton Loading -->
                <ul v-if="isLoading" class="tour-grid" role="list" aria-busy="true">
                    <li v-for="i in itemsPerPage" :key="i">
                        <UiSkeletonCard />
                    </li>
                </ul>

                <!-- Tours Grid/List -->
                <template v-else-if="tours.length > 0">
                    <ul :class="viewMode === 'grid' ? 'tour-grid' : 'tour-list'" role="list"
                        :aria-busy="isFetching ? 'true' : 'false'">
                        <li v-for="tour in tours" :key="tour.id">
                            <TourListingCard :tour="tour" :layout="viewMode" />
                        </li>
                    </ul>

                    <UiPagination class="tour-pagination" :page="currentPage" :total-pages="totalPages"
                        @update:page="changePage" />
                </template>

                <!-- Empty State -->
                <UiEmptyState v-else :title="t('tour.list.emptyTitle')" :description="t('tour.list.emptyDesc')">
                    <UiButton variant="outline" @click="handleClearFilters">{{ t('tour.list.clearFilters') }}</UiButton>
                </UiEmptyState>
            </div>
        </section>

        <!-- Mobile Filter Sheet -->
        <Transition name="sheet">
            <div v-if="showFilters" class="filter-sheet" role="dialog" aria-modal="true"
                aria-labelledby="tour-filter-sheet-title">
                <div class="filter-sheet__backdrop" @click="showFilters = false" />
                <div id="tour-filter-sheet" class="filter-sheet__panel">
                    <div class="filter-sheet__head">
                        <h2 id="tour-filter-sheet-title">{{ t('tour.filter.title') }}</h2>
                        <button type="button" class="filter-sheet__close" @click="showFilters = false">
                            {{ t('common.close') }}
                        </button>
                    </div>
                    <TourFilter :initial-filters="activeFilters" :show-mobile="true" @apply="handleApplyFilters"
                        @clear="handleClearFilters" />
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.tour-layout {
    display: grid;
    gap: var(--space-fluid-lg);
    align-items: start;
    padding-bottom: var(--section-space);
}

.tour-layout__sidebar {
    display: none;
}

@media (min-width: 64rem) {
    .tour-layout {
        grid-template-columns: minmax(15rem, 1fr) 3fr;
    }

    .tour-layout__sidebar {
        display: block;
    }

    .tour-toolbar__filter {
        display: none !important;
    }
}

/* Toolbar */
.tour-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    padding-bottom: var(--space-4);
    margin-bottom: var(--space-fluid-md);
    border-bottom: 1px solid var(--color-border-strong);
}

.tour-toolbar__count {
    font-family: var(--font-serif);
    font-size: var(--text-3xl);
    font-weight: var(--weight-regular);
}

.tour-toolbar__controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.625rem;
}

.tour-toolbar__sort {
    width: auto;
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

.view-toggle button:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}

/* Kết quả */
.tour-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
    gap: var(--space-fluid-md) var(--space-fluid-sm);
    transition: opacity var(--transition-base);
}

.tour-list {
    border-bottom: 1px solid var(--color-border);
    transition: opacity var(--transition-base);
}

.tour-list > li:first-child :deep(.tour-card--list) {
    border-top: 0;
    padding-top: 0;
}

[aria-busy='true'] {
    opacity: 0.55;
}

.tour-pagination {
    margin-top: var(--space-fluid-lg);
}

/* Bộ lọc dạng bottom sheet trên mobile */
.filter-sheet {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: flex-end;
    justify-content: center;
}

.filter-sheet__backdrop {
    position: absolute;
    inset: 0;
    background: var(--color-backdrop);
}

.filter-sheet__panel {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 36rem;
    max-height: 90vh;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    background: var(--color-bg);
    color: var(--color-text);
}

.filter-sheet__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4) var(--gutter);
    border-bottom: 1px solid var(--color-border);
}

.filter-sheet__head h2 {
    font-family: var(--font-serif);
    font-size: var(--text-3xl);
    font-weight: var(--weight-regular);
}

.filter-sheet__close {
    min-height: 2.5rem;
    color: var(--color-text);
    font-weight: var(--weight-medium);
    text-decoration: underline;
    text-decoration-color: var(--color-accent);
    text-underline-offset: 0.35em;
}

.sheet-enter-active,
.sheet-leave-active {
    transition: opacity var(--transition-base);
}

.sheet-enter-active .filter-sheet__panel,
.sheet-leave-active .filter-sheet__panel {
    transition: transform var(--transition-base);
}

.sheet-enter-from,
.sheet-leave-to {
    opacity: 0;
}

.sheet-enter-from .filter-sheet__panel,
.sheet-leave-to .filter-sheet__panel {
    transform: translateY(100%);
}
</style>
