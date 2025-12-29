<script setup lang="ts">

const { t } = useI18n();
const localePath = useLocalePath();
const { data: wishlist, isLoading } = useWishlistQuery();

const tours = computed(() => {
    return (wishlist.value || []).map(tour => ({
        id: tour.id,
        image: tour.thumbnail,
        title: tour.title,
        price: tour.price_usd,
        duration: tour.duration,
        people: '2-4',
        tags: tour.type || [],
        rating: tour.rating_stats?.average_rating || 5
    }));
});
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12">
        <div class="container mx-auto px-4">
            <!-- Header -->
            <!-- <div class="mb-10">
                <NuxtLink :to="localePath('/profile')"
                    class="text-secondary hover:text-primary flex items-center gap-2 mb-4 transition-colors">
                    <el-icon>
                        <ArrowLeft />
                    </el-icon>
                    {{ t('auth.profile') }}
                </NuxtLink>
                <h1 class="text-3xl font-bold text-primary-text">{{ t('wishlist.myWishlist') }}</h1>
            </div> -->

            <!-- Loading State -->
            <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div v-for="i in 3" :key="i" class="h-96 rounded-2xl bg-gray-200 dark:bg-zinc-800 animate-pulse"></div>
            </div>

            <!-- Empty State -->
            <div v-else-if="tours.length === 0"
                class="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center shadow-sm">
                <el-empty :description="t('wishlist.empty')">
                    <el-button type="primary" @click="$router.push(localePath('/tour'))">
                        {{ t('tour.readyTour') }}
                    </el-button>
                </el-empty>
            </div>

            <!-- Tour Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <TourCard v-for="tour in tours" :key="tour.id" :tour="tour" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    max-width: 1200px;
}
</style>
