<script setup lang="ts">
import type { TourItinerary } from '~/types/api';

// Các điểm dừng của lịch trình, lấy ảnh / giờ mở cửa / giá vé từ hot spot.
// Số thứ tự khớp với số trên pin bản đồ (InteractiveMap).
defineProps<{
    itineraries: TourItinerary[];
}>();

const { t } = useI18n();

// Ảnh hot spot tải lỗi thì thử ảnh kế tiếp, hết ảnh thì bỏ ô ảnh
const failedImages = ref(new Set<string>());
const markFailed = (src: string) => {
    failedImages.value = new Set(failedImages.value).add(src);
};
const imageOf = (item: TourItinerary) =>
    item.hotSpot?.images?.find((src) => src && !failedImages.value.has(src)) || '';

const formatDuration = (minutes?: number) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return [
        hours ? t('tour.hoursCount', { count: hours }, hours) : '',
        rest ? t('tour.minutesCount', { count: rest }, rest) : '',
    ].filter(Boolean).join(' ');
};

// Thời lượng · loại điểm đến · giờ mở cửa
const metaOf = (item: TourItinerary) =>
    [formatDuration(item.durationMinutes), item.hotSpot?.category, item.hotSpot?.openingHours]
        .filter(Boolean)
        .join(' · ');
</script>

<template>
    <ol class="tour-stops" role="list">
        <li v-for="(item, idx) in itineraries" :key="item.id" class="tour-stop"
            :class="{ 'tour-stop--no-media': !imageOf(item) }">
            <span class="tour-stop__number" aria-hidden="true">{{ idx + 1 }}</span>

            <div v-if="imageOf(item)" class="tour-stop__media">
                <img :src="imageOf(item)" alt="" loading="lazy" decoding="async" @error="markFailed(imageOf(item))" />
            </div>

            <div class="tour-stop__body">
                <h3 class="tour-stop__title">{{ item.hotSpot?.name }}</h3>
                <p v-if="metaOf(item)" class="tour-stop__meta">{{ metaOf(item) }}</p>
                <p v-if="item.activityDescription" class="tour-stop__desc">{{ item.activityDescription }}</p>
                <p v-if="item.hotSpot?.priceInfo" class="tour-stop__price">
                    {{ t('tour.stopTicket', { price: item.hotSpot.priceInfo }) }}
                </p>
            </div>
        </li>
    </ol>
</template>

<style scoped>
.tour-stops {
    display: grid;
}

.tour-stop {
    display: grid;
    grid-template-columns: 1.75rem 4.5rem minmax(0, 1fr);
    gap: var(--space-4);
    align-items: start;
    padding-block: var(--space-5);
    border-top: 1px solid var(--color-border);
}

.tour-stop:first-child {
    padding-top: 0;
    border-top: 0;
}

.tour-stop--no-media {
    grid-template-columns: 1.75rem minmax(0, 1fr);
}

@media (min-width: 40rem) {
    .tour-stop {
        grid-template-columns: 1.75rem 6rem minmax(0, 1fr);
    }

    .tour-stop--no-media {
        grid-template-columns: 1.75rem minmax(0, 1fr);
    }
}

.tour-stop__number {
    display: grid;
    place-items: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    background: var(--color-accent);
    color: var(--color-on-accent);
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
    font-variant-numeric: lining-nums tabular-nums;
}

.tour-stop__media {
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border-radius: var(--radius-sm);
    background: var(--color-bg-subtle);
}

.tour-stop__media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.tour-stop__title {
    font-family: var(--font-serif);
    font-size: var(--text-title);
    font-weight: var(--weight-regular);
    line-height: var(--leading-snug);
}

.tour-stop__meta {
    margin-top: 0.25rem;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.tour-stop__desc {
    margin-top: var(--space-2);
    line-height: var(--leading-body);
}

.tour-stop__price {
    display: inline-block;
    margin-top: var(--space-2);
    padding: 0.125rem var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-pill);
    background: var(--color-bg-subtle);
    color: var(--color-text-muted);
    font-size: var(--text-xs);
}
</style>
