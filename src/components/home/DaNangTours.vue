<script setup lang="ts">
import { tourDaNangTours } from '@/data/homeData';
</script>

<template>
    <section class="fade-in-section py-12 md:py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-4 md:px-6">
            <div class="text-center mb-8 md:mb-12">
                <h2 class="text-3xl md:text-4xl font-bold mb-2">
                    <span class="text-gray-800 dark:text-white">TOUR </span>
                    <span class="text-[#1A71C7] dark:text-blue-400">ĐÀ NẴNG</span>
                </h2>
                <p class="text-gray-600 dark:text-gray-300 text-lg">Tour ghép hàng ngày khởi hành từ TP Đà Nẵng giá rẻ
                </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <TourCard v-for="tour in tourDaNangTours" :key="tour.id" :id="tour.id" :image="tour.image"
                    :title="tour.title" :price="tour.price" :rating="tour.rating" :duration="tour.duration"
                    :people="tour.people" :badge="tour.badge" :show-peulis-label="tour.showPeulisLabel" :to="tour.to" />
            </div>
        </div>
    </section>
</template>
