<script setup lang="ts">
import { computed } from 'vue';
const { t } = useI18n();
import { useQuery } from '@tanstack/vue-query';
import type { Tour } from '@/types/api';
import { transformTourToCardProps } from '@/utils/tourHelpers';

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
</script>

<template>
    <section class="fade-in-section py-12 md:py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-4 md:px-6">
            <!-- Header Text -->
            <div class="text-center mb-8 md:mb-12">
                <p class="text-red-600 dark:text-red-400 text-sm md:text-base font-medium mb-2">
                    {{ t('home.topDestSubtitle') }}
                </p>
                <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#094174] dark:text-blue-400 mb-4">
                    {{ t('home.topDestTitle') }}
                </h2>
                <p class="text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-3xl mx-auto">
                    {{ t('home.topDestDesc') }}
                </p>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div v-for="i in 4" :key="i" class="bg-gray-200 dark:bg-gray-700 animate-pulse rounded-2xl h-96"></div>
            </div>

            <!-- Top Destinations Tours Grid -->
            <div v-else-if="topDestinationsTours.length > 0"
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <TourCard v-for="tour in topDestinationsTours" :key="tour.id" :tour="tour" />
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12">
                <p class="text-gray-600 dark:text-gray-400">{{ t('home.noHotTours') }}</p>
            </div>
        </div>
    </section>
</template>
