<script setup lang="ts">
import type { Review } from '~/types/api';
import dayjs from 'dayjs';

const props = defineProps<{
    reviews: Review[];
}>();

const { t } = useI18n();

const rateColors = ['var(--color-accent)', 'var(--color-accent)', 'var(--color-accent)'];
</script>

<template>
    <div class="review-list">
        <UiEmptyState v-if="reviews.length === 0" :title="t('review.noReviews')" />

        <ul v-else class="review-list__items" role="list">
            <li v-for="review in reviews" :key="review.id" class="review-item">
                <el-avatar :size="48" :src="review.user?.avatar" class="review-item__avatar">
                    {{ review.user?.userName?.charAt(0).toUpperCase() }}
                </el-avatar>

                <div class="review-item__body">
                    <div class="review-item__head">
                        <div>
                            <p class="review-item__name">{{ review.user?.userName }}</p>
                            <div class="review-item__rating">
                                <el-rate :model-value="review.rating" disabled size="small" :colors="rateColors"
                                    void-color="var(--color-border)" />
                                <span>{{ review.rating }}</span>
                            </div>
                        </div>
                        <time class="review-item__date">{{ dayjs(review.createdAt).format('DD MMM YYYY') }}</time>
                    </div>

                    <p class="review-item__content">{{ review.content }}</p>

                    <div v-if="review.images?.length" class="review-item__images">
                        <el-image v-for="(img, idx) in review.images" :key="idx" :src="img"
                            class="review-item__image" :preview-src-list="review.images" :initial-index="idx"
                            fit="cover" preview-teleported hide-on-click-modal>
                            <template #error>
                                <span class="review-item__image-error">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                                        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <rect x="3.5" y="5" width="17" height="14" rx="2" />
                                        <circle cx="9" cy="10" r="1.6" />
                                        <path d="M4 17l5-4.5 4 3.5 3-2.5 4 3.5" />
                                    </svg>
                                    {{ t('review.imageUnavailable') }}
                                </span>
                            </template>
                        </el-image>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.review-list__items {
    border-top: 1px solid var(--color-border-strong);
}

.review-item {
    display: flex;
    gap: var(--space-4);
    padding-block: var(--space-6);
    border-bottom: 1px solid var(--color-border);
}

.review-item__avatar {
    flex-shrink: 0;
    border: 1px solid var(--color-border);
}

.review-item__body {
    flex: 1;
    min-width: 0;
}

.review-item__head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-2) var(--space-4);
}

.review-item__name {
    font-family: var(--font-serif);
    font-size: var(--text-lg);
}

.review-item__rating {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-top: 0.25rem;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.review-item__date {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.review-item__content {
    margin-top: var(--space-3);
    color: var(--color-text-muted);
    line-height: var(--leading-body);
}

.review-item__images {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin-top: var(--space-4);
}

.review-item__image {
    width: 5.5rem;
    height: 5.5rem;
    border-radius: var(--radius-sm);
}

/* Ảnh review tải lỗi (vd. đã bị xoá trên Cloudinary) */
.review-item__image-error {
    display: grid;
    place-items: center;
    align-content: center;
    gap: var(--space-1);
    width: 100%;
    height: 100%;
    padding: var(--space-2);
    border: 1px dashed var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-bg-subtle);
    color: var(--color-text-muted);
    font-size: var(--text-micro);
    line-height: var(--leading-snug);
    text-align: center;
}

.review-item__image-error svg {
    width: 1.25rem;
    height: 1.25rem;
}

:deep(.el-rate) {
    --el-rate-icon-size: 14px;
    height: auto;
}

:deep(.el-rate__item) {
    margin-right: 1px;
}
</style>
