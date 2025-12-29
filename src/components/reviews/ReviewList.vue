<script setup lang="ts">
import type { Review } from '~/types/api';
import dayjs from 'dayjs';

const props = defineProps<{
    reviews: Review[];
}>();

const { t } = useI18n();
</script>

<template>
    <div class="review-list mt-8">
        <div v-if="reviews.length === 0" class="text-center py-12 bg-gray-50 dark:bg-zinc-900/50 rounded-3xl">
            <el-empty :description="t('review.noReviews')" />
        </div>

        <div v-else class="space-y-6">
            <div v-for="review in reviews" :key="review.id"
                class="group p-6 bg-white dark:bg-zinc-900/50 rounded-2xl border border-gray-100 dark:border-zinc-800">
                <div class="flex items-start gap-5">
                    <div class="relative">
                        <el-avatar :size="56" :src="review.user?.avatar"
                            class="shadow-md border-2 border-white dark:border-zinc-800">
                            {{ review.user?.userName?.charAt(0).toUpperCase() }}
                        </el-avatar>
                        <div class="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-800"
                            title="Verified User"></div>
                    </div>

                    <div class="flex-grow">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                            <div>
                                <h4
                                    class="text-base font-bold text-gray-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {{ review.user?.userName }}
                                </h4>
                                <div class="flex items-center gap-2 mt-0.5">
                                    <el-rate :model-value="review.rating" disabled size="small" />
                                    <span class="text-xs font-bold text-yellow-600">{{ review.rating }}</span>
                                </div>
                            </div>
                            <time class="text-xs font-medium text-gray-400 dark:text-zinc-500 flex items-center gap-1">
                                <el-icon>
                                    <Calendar />
                                </el-icon>
                                {{ dayjs(review.created_at).format('DD MMM YYYY') }}
                            </time>
                        </div>

                        <p class="text-sm text-gray-600 dark:text-zinc-400 mt-3 leading-relaxed">
                            {{ review.content }}
                        </p>

                        <div v-if="review.images?.length" class="flex flex-wrap gap-3 mt-5">
                            <el-image v-for="(img, idx) in review.images" :key="idx" :src="img"
                                class="w-24 h-auto [&_.el-image\_\_inner]:m-0 hover:opacity-80"
                                :preview-src-list="review.images" :initial-index="idx" fit="cover" preview-teleported
                                hide-on-click-modal />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
:deep(.el-rate) {
    --el-rate-icon-size: 14px;
    height: auto;
}

:deep(.el-rate__item) {
    margin-right: 1px;
}
</style>
