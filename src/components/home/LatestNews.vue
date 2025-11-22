<script setup lang="ts">
import { latestNews } from '@/data/homeData';
</script>

<template>
    <section class="fade-in-section py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
        <div class="max-w-7xl mx-auto px-4 md:px-6">
            <!-- Header Text -->
            <div class="text-center mb-8 md:mb-12">
                <p class="text-red-600 dark:text-red-400 text-sm md:text-base font-medium mb-2">
                    Tin Tức
                </p>
                <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#094174] dark:text-blue-400">
                    Bài Viết Mới Nhất
                </h2>
            </div>

            <!-- News Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <NewsCard v-for="newsItem in latestNews" :key="newsItem.id" :id="newsItem.id" :image="newsItem.image"
                    :title="newsItem.title" :date="newsItem.date" :views="newsItem.views"
                    :description="newsItem.description" :to="newsItem.to" />
            </div>
        </div>
    </section>
</template>
