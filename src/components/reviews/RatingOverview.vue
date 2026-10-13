<script setup lang="ts">
import type { RatingStats } from '~/types/api';

const props = defineProps<{
    stats?: RatingStats;
    size?: 'small' | 'large';
}>();

const { t } = useI18n();

const rateColors = ['var(--color-accent)', 'var(--color-accent)', 'var(--color-accent)'];

const getPercentage = (star: number) => {
    if (!props.stats?.totalReviews || !props.stats?.breakdown) return 0;
    const count = props.stats.breakdown[star] || 0;
    return Math.round((count / props.stats.totalReviews) * 100);
};
</script>

<template>
    <div class="rating-overview" :class="{ 'rating-overview--large': size === 'large' }">
        <div class="rating-overview__summary">
            <p class="rating-overview__average">{{ stats?.averageRating || 0 }}</p>
            <el-rate :model-value="stats?.averageRating || 0" disabled :colors="rateColors"
                void-color="var(--color-border)" size="large" />
            <p class="rating-overview__total">{{ t('review.total', { count: stats?.totalReviews || 0 }) }}</p>
        </div>

        <ul v-if="size === 'large'" class="rating-overview__breakdown" role="list">
            <li v-for="star in [5, 4, 3, 2, 1]" :key="star" :aria-label="t('review.starBreakdown', {
                star,
                percent: getPercentage(star)
            })">
                <span class="rating-overview__star-count" aria-hidden="true">{{ star }}</span>
                <span class="rating-overview__bar">
                    <span class="rating-overview__bar-fill" :style="{ width: `${getPercentage(star)}%` }"></span>
                </span>
                <span class="rating-overview__percent" aria-hidden="true">{{ getPercentage(star) }}%</span>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.rating-overview {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-fluid-lg);
    align-items: center;
}

.rating-overview--large {
    align-items: flex-start;
}

.rating-overview__summary {
    display: grid;
    gap: var(--space-2);
    min-width: 9rem;
}

.rating-overview__average {
    font-family: var(--font-serif);
    font-size: var(--text-display);
    line-height: 1;
}

.rating-overview__total {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.rating-overview__breakdown {
    display: grid;
    flex: 1 1 18rem;
    gap: var(--space-3);
    min-width: min(100%, 18rem);
}

.rating-overview__breakdown li {
    display: grid;
    grid-template-columns: 1.25rem 1fr 2.75rem;
    align-items: center;
    gap: var(--space-3);
}

.rating-overview__star-count {
    color: var(--color-text-muted);
    font-family: var(--font-serif);
    font-size: var(--text-lg);
    font-style: italic;
}

.rating-overview__bar {
    display: block;
    height: 4px;
    overflow: hidden;
    border-radius: var(--radius-pill);
    background: var(--color-bg-subtle);
}

.rating-overview__bar-fill {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--color-accent);
}

.rating-overview__percent {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    text-align: right;
}

:deep(.el-rate) {
    --el-rate-icon-size: 18px;
    height: auto;
}

:deep(.el-rate__item) {
    margin-right: 2px;
}
</style>
