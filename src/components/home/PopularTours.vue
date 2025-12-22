<script setup lang="ts">
const { t } = useI18n();

const categories = computed(() => [
    { title: t('home.categories.north'), image: '/carousel/1.jpg' },
    { title: t('home.categories.central'), image: '/carousel/2.jpg' },
    { title: t('home.categories.south'), image: '/carousel/3.jpg' },
    { title: t('home.categories.asia'), image: '/carousel/4.jpg' },
    { title: t('home.categories.europe'), image: '/carousel/5.jpg' },
]);
</script>

<template>
    <section class="fade-in-section py-12 md:py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-4">
            <!-- Header Text -->
            <div class="text-center mb-8 md:mb-12">
                <p class="text-red-600 dark:text-red-400 text-sm md:text-base font-medium mb-2">
                    {{ t('home.popularSubtitle') }}
                </p>
                <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#094174] dark:text-blue-400">
                    {{ t('home.popularTitle') }}
                </h2>
            </div>

            <!-- Popular Tours Grid -->
            <div class="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-10">
                <div v-for="(cat, index) in categories" :key="index"
                    class="flex flex-col items-center group cursor-pointer">
                    <div
                        class="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 mb-4 border-4 border-white dark:border-gray-800">
                        <img :src="cat.image" :alt="cat.title" loading="lazy"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3
                        class="text-[#094174] dark:text-blue-300 font-semibold text-sm md:text-base lg:text-lg text-center">
                        {{ cat.title }}
                    </h3>
                </div>
            </div>
        </div>
    </section>
</template>
