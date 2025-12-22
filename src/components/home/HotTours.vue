<script setup lang="ts">
import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import type { Tour } from '@/types/api';
import { transformTourToCardProps } from '@/utils/tourHelpers';

// Fetch featured tours (hot tours)
const { data, isLoading } = useQuery({
  queryKey: ['tours', 'featured'],
  queryFn: async () => {
    const res = await $motobikertoursApi('/tours', {
      query: {
        r: 20, // Fetch more to filter featured ones
      },
    });
    return res;
  },
});

// Filter featured tours and limit to 4
const featuredTours = computed(() => {
  const tours = (data.value?.data || []) as Tour[];
  return tours
    .filter((tour) => tour.is_featured === true)
    .slice(0, 4)
    .map(transformTourToCardProps);
});
</script>

<template>
  <section class="fade-in-section py-12 md:py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 md:px-6">
      <div class="text-center mb-8 md:mb-12">
        <h2 class="text-3xl md:text-4xl font-bold mb-2">
          <span class="text-gray-800 dark:text-white">TOUR </span>
          <span class="text-[#1A71C7] dark:text-blue-400">HOT</span>
        </h2>
        <p class="text-gray-600 dark:text-gray-300 text-lg">Tour được nhiều khách lựa chọn nhất</p>
      </div>

      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="bg-gray-200 dark:bg-gray-700 animate-pulse rounded-2xl h-96"></div>
      </div>

      <div v-else-if="featuredTours.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <TourCard v-for="tour in featuredTours" :key="tour.id" :tour="tour" />
      </div>

      <div v-else class="text-center py-12">
        <p class="text-gray-600 dark:text-gray-400">Chưa có tour hot nào</p>
      </div>
    </div>
  </section>
</template>
