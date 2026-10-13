<script setup lang="ts">
import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import type { Tour } from '@/types/api';
import { transformTourToCardProps } from '@/utils/tourHelpers';
import { useWishlistBulkQuery } from '~/composables/useWishlist';

const { t } = useI18n();

// Fetch featured tours (hot tours)
const { data, isLoading } = useQuery({
  queryKey: ['tours', 'featured'],
  queryFn: async (): Promise<{ data: Tour[]; total: number }> => {
    const res = await $motobikertoursApi('/tours', {
      query: {
        r: 20, // Fetch more to filter featured ones
      },
    }) as { data: Tour[]; total: number };
    return res;
  },
  refetchOnWindowFocus: false,
});

// Filter featured tours and limit to 4
const featuredTours = computed(() => {
  const tours = (data.value?.data || []) as Tour[];
  return tours
    .filter((tour) => tour.isFeatured === true)
    .slice(0, 4)
    .map(transformTourToCardProps);
});

// Batch wishlist check for featured tours
const featuredTourIds = computed(() => featuredTours.value.map((t) => t.id).filter(Boolean));
const { data: wishlistStatus } = useWishlistBulkQuery(featuredTourIds);

const getWishlistStatus = (tourId: string) =>
    wishlistStatus.value?.[tourId] ?? false;
</script>

<template>
  <section class="hot-tours" aria-labelledby="hot-tours-title">
    <div class="shell">
      <UiSectionHeading id="hot-tours-title" :title="t('home.hotTours')" emphasis="HOT"
        :lead="t('home.hotToursDescription')" />

      <ul v-if="isLoading" class="hot-tours__grid" role="list" aria-busy="true">
        <li v-for="i in 4" :key="i">
          <UiSkeletonCard />
        </li>
      </ul>

      <ul v-else-if="featuredTours.length > 0" class="hot-tours__grid" role="list">
        <li v-for="tour in featuredTours" :key="tour.id">
          <TourCard :tour="tour" :is-wishlisted-override="getWishlistStatus(tour.id)" />
        </li>
      </ul>

      <UiEmptyState v-else :title="t('home.noHotTours')" />
    </div>
  </section>
</template>

<style scoped>
.hot-tours {
    padding-block: var(--section-space);
    background: var(--color-bg-subtle);
}

.hot-tours__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
    gap: var(--space-fluid-md) var(--space-fluid-sm);
    margin-top: var(--space-fluid-lg);
}
</style>
