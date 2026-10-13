<script setup lang="ts">
import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import type { Tour } from '@/types/api';
import { transformTourToCardProps } from '@/utils/tourHelpers';
import { useWishlistBulkQuery } from '~/composables/useWishlist';

// Ghi chú: trước đây file này import `tourDaNangTours` từ `@/data/homeData`, nhưng export đó
// không tồn tại (lỗi có sẵn) — component bị comment trong src/pages/index.vue nên chưa ai phát
// hiện. Sửa lại theo đúng pattern của TopDestinations/HotTours: lấy tour khởi hành từ Đà Nẵng
// qua API, để sẵn sàng dùng khi component được bật lại.
const { t } = useI18n();

const { data, isLoading } = useQuery({
    queryKey: ['tours', 'da-nang'],
    queryFn: async () => {
        const res = await $motobikertoursApi('/tours', {
            query: {
                r: 3,
                departFrom: 'Đà Nẵng',
            },
        });
        return res as { data: Tour[]; total: number };
    },
    refetchOnWindowFocus: false,
});

const daNangTours = computed(() => {
    const tours = (data.value?.data || []) as Tour[];
    return tours.map(transformTourToCardProps);
});

const tourIds = computed(() => daNangTours.value.map((t) => t.id).filter(Boolean));
const { data: wishlistStatus } = useWishlistBulkQuery(tourIds);

const getWishlistStatus = (tourId: string) =>
    wishlistStatus.value?.[tourId] ?? false;
</script>

<template>
    <section class="da-nang-tours" aria-labelledby="da-nang-tours-title">
        <div class="shell">
            <UiSectionHeading id="da-nang-tours-title" :title="t('home.daNangTourTitle')"
                :lead="t('home.daNangTourDesc')" />

            <ul v-if="isLoading" class="da-nang-tours__grid" role="list" aria-busy="true">
                <li v-for="i in 3" :key="i">
                    <UiSkeletonCard />
                </li>
            </ul>

            <ul v-else-if="daNangTours.length > 0" class="da-nang-tours__grid" role="list">
                <li v-for="tour in daNangTours" :key="tour.id">
                    <TourCard :tour="tour" :is-wishlisted-override="getWishlistStatus(tour.id)" />
                </li>
            </ul>

            <UiEmptyState v-else :title="t('home.noHotTours')" />
        </div>
    </section>
</template>

<style scoped>
.da-nang-tours {
    padding-block: var(--section-space);
}

.da-nang-tours__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
    gap: var(--space-fluid-md) var(--space-fluid-sm);
    margin-top: var(--space-fluid-lg);
}
</style>
