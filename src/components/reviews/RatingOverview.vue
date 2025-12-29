<script setup lang="ts">
import type { RatingStats } from '~/types/api';
import { StarFilled } from '@element-plus/icons-vue';

const props = defineProps<{
    stats?: RatingStats;
    size?: 'small' | 'large';
}>();

const { t } = useI18n();

const getPercentage = (star: number) => {
    if (!props.stats?.total_reviews || !props.stats?.breakdown) return 0;
    const count = props.stats.breakdown[star] || 0;
    return Math.round((count / props.stats.total_reviews) * 100);
};
</script>

<template>
    <div class="rating-overview" :class="{ 'rating-overview--large': size === 'large' }">
        <div class="rating-overview__summary p-6 bg-gradient-to-br from-blue-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-2xl border border-blue-100 dark:border-zinc-700 shadow-sm"
            :class="size === 'large' ? 'min-w-[180px]' : ''">
            <div class="text-5xl font-black text-blue-600 dark:text-blue-400 leading-none mb-2">
                {{ stats?.average_rating || 0 }}
            </div>
            <el-rate :model-value="stats?.average_rating || 0" disabled disabled-void-color="#DCDFE6" size="large" />
            <div class="text-sm font-medium text-secondary mt-2">
                {{ t('review.total', { count: stats?.total_reviews || 0 }) }}
            </div>
        </div>

        <div v-if="size === 'large'" class="rating-overview__breakdown flex-grow space-y-3">
            <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="flex items-center gap-4 group">
                <div class="flex items-center gap-1 w-8">
                    <span class="text-sm font-bold text-gray-700 dark:text-gray-300">{{ star }}</span>
                    <el-icon size="14" color="#F7BA2A">
                        <StarFilled />
                    </el-icon>
                </div>
                <div class="flex-grow h-2.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-1000 ease-out"
                        :style="{ width: `${getPercentage(star)}%` }"></div>
                </div>
                <span class="text-sm font-medium text-secondary w-10 text-right">{{ getPercentage(star) }}%</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.rating-overview {
    display: flex;
    align-items: center;
    gap: 2.5rem;
    margin-bottom: 2rem;
}

.rating-overview__summary {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

@media (max-width: 640px) {
    .rating-overview {
        flex-direction: column;
        gap: 1.5rem;
        align-items: stretch;
    }

    .rating-overview__summary {
        min-width: unset !important;
    }
}

:deep(.el-rate) {
    --el-rate-icon-size: 20px;
    height: auto;
}

:deep(.el-rate__item) {
    margin-right: 2px;
}
</style>
