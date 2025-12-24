<script setup lang="ts">
import type { HotSpot } from '~/types/api';

defineProps<{
    spot: HotSpot;
}>();

const { t } = useI18n();
</script>

<template>
    <div
        class="spot-card group bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-100 dark:border-zinc-800">
        <!-- Image -->
        <div class="relative aspect-[4/3] overflow-hidden">
            <img :src="spot.images[0] || '/placeholder-spot.jpg'" :alt="spot.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />

            <!-- Badge if hot -->
            <div v-if="spot.is_hot"
                class="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <span class="text-[10px]">#1</span>
                <span>Thất</span>
            </div>

            <!-- Quick Action Overlay -->
            <div
                class="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                <button
                    class="w-10 h-10 bg-white/90 backdrop-blur-sm text-zinc-900 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                    <UnoIcon i="i-ph-heart" class="text-lg" />
                </button>
                <button
                    class="w-10 h-10 bg-white/90 backdrop-blur-sm text-zinc-900 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                    <UnoIcon i="i-ph-map-pin" class="text-lg" />
                </button>
            </div>
        </div>

        <!-- Content -->
        <div class="p-5">
            <h3
                class="text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-blue-600 transition-colors">
                {{ spot.name }}
            </h3>

            <div class="mt-2 flex items-center gap-2">
                <div class="flex items-center text-yellow-500">
                    <UnoIcon i="i-ph-star-fill" v-for="i in 3" :key="i" class="text-xs" />
                    <UnoIcon i="i-ph-star" v-for="i in 2" :key="i + 3" class="text-xs" />
                </div>
                <span class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{{ spot.rating }}</span>
            </div>

            <div class="mt-3 flex items-center justify-between">
                <div class="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                    <UnoIcon i="i-ph-navigation-arrow-fill" class="text-sm text-blue-500" />
                    <span class="text-sm">{{ t('hotSpots.distance', { distance: spot.distance || 0 }) }}</span>
                </div>

                <div class="flex items-center gap-1">
                    <UnoIcon i="i-ph-heart" class="text-zinc-300 hover:text-red-500 transition-colors cursor-pointer" />
                    <UnoIcon i="i-ph-map-trifold"
                        class="text-zinc-300 hover:text-blue-500 transition-colors cursor-pointer" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.spot-card {
    /* Dynamic shadow color for dark mode */
}
</style>
