<script setup lang="ts">
import { computed } from 'vue';
const { t } = useI18n();
import { useQuery } from '@tanstack/vue-query';
import type { Tour } from '@/types/api';
import { transformTourToCardProps } from '@/utils/tourHelpers';
import { useWishlistBulkQuery } from '~/composables/useWishlist';

// Fetch top destination tours
const { data, isLoading } = useQuery({
    queryKey: ['tours', 'top-destinations'],
    queryFn: async () => {
        const res = await $motobikertoursApi('/tours', {
            query: {
                r: 4, // Limit to 4 tours
            },
        });
        return res;
    },
    refetchOnWindowFocus: false,
});

// Transform tours for display
const topDestinationsTours = computed(() => {
    const tours = (data.value?.data || []) as Tour[];
    return tours.map(transformTourToCardProps);
});

// Batch wishlist check
const topDestTourIds = computed(() => topDestinationsTours.value.map((t) => t.id).filter(Boolean));
const { data: wishlistStatus } = useWishlistBulkQuery(topDestTourIds);

const getWishlistStatus = (tourId: string) =>
    wishlistStatus.value?.[tourId] ?? false;
</script>

<template>
    <section class="top-destinations" aria-labelledby="top-destinations-title">
        <div class="shell">
            <UiSectionHeading id="top-destinations-title" :eyebrow="t('home.topDestSubtitle')"
                :title="t('home.topDestTitle')" :lead="t('home.topDestDesc')" />

            <ul v-if="isLoading" class="top-destinations__grid" role="list" aria-busy="true">
                <li v-for="i in 4" :key="i">
                    <UiSkeletonCard />
                </li>
            </ul>

            <ul v-else-if="topDestinationsTours.length > 0" class="top-destinations__grid" role="list">
                <li v-for="tour in topDestinationsTours" :key="tour.id">
                    <TourCard :tour="tour" :is-wishlisted-override="getWishlistStatus(tour.id)" />
                </li>
            </ul>

            <UiEmptyState v-else :title="t('home.noHotTours')" />
        </div>
    </section>
</template>

<style scoped>
.top-destinations {
    padding-block: var(--section-space);
}

.top-destinations__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
    gap: var(--space-fluid-md) var(--space-fluid-sm);
    margin-top: var(--space-fluid-lg);
}
</style>
