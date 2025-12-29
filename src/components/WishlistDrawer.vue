<script setup lang="ts">
const { isWishlistDrawerVisible, closeDrawer } = useWishlistDrawer();

const { t } = useI18n();
const { data: wishlist, isLoading } = useWishlistQuery();
const { formatPrice } = useCurrency();
const localePath = useLocalePath();
const router = useRouter();
const toggleMutation = useToggleWishlistMutation();

const tours = computed(() => {
    return (wishlist.value || []).map(tour => ({
        id: tour.id,
        image: tour.thumbnail,
        title: tour.title,
        price: tour.priceUsd,
        duration: tour.duration,
        type: tour.type?.[0] || 'Adventure',
        rating: tour.ratingStats?.averageRating || 5,
        departFrom: tour.departFrom,
        routes: tour.routes
    }));
});

const handleRemove = async (tourId: string) => {
    try {
        await toggleMutation.mutateAsync(tourId);
        ElMessage.success(t('wishlist.removeSuccess'));
    } catch (error) {
        ElMessage.error(t('review.error'));
    }
};

const viewTour = (id: string) => {
    closeDrawer();
    router.push(localePath(`/tour/${id}`));
};
</script>

<template>
    <el-drawer v-model="isWishlistDrawerVisible" direction="rtl" :size="440" :show-close="false" class="wishlist-drawer"
        append-to-body>
        <template #header>
            <div class="flex items-center justify-between w-full px-2">
                <div class="flex items-center gap-4">
                    <div
                        class="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center shadow-inner">
                        <svg class="w-7 h-7 text-red-500 transition-transform hover:scale-110" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">{{
                            t('wishlist.myWishlist') }}</h2>
                        <div class="flex items-center gap-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            <p class="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize">{{ tours.length
                                }} {{ t('nav.tours') }}</p>
                        </div>
                    </div>
                </div>
                <button @click="closeDrawer"
                    class="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-all active:scale-95">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </template>

        <div class="flex flex-col h-full bg-[#FAFAFA] dark:bg-slate-950 overflow-hidden">
            <!-- Loading State -->
            <div v-if="isLoading" class="flex-1 p-6 space-y-4 overflow-y-auto">
                <div v-for="i in 4" :key="i"
                    class="flex gap-4 p-4 bg-white dark:bg-slate-900 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-800">
                    <div class="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800"></div>
                    <div class="flex-1 space-y-3 py-1">
                        <div class="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-3/4"></div>
                        <div class="h-3 bg-slate-50 dark:bg-slate-800/50 rounded-full w-1/2"></div>
                        <div class="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-1/4"></div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="tours.length === 0"
                class="flex-1 flex flex-col items-center justify-center p-10 text-center">
                <div class="relative mb-8">
                    <div
                        class="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center rotate-6 scale-95 shadow-xl">
                        <svg class="w-16 h-16 text-slate-200 dark:text-slate-700" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <div
                        class="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center -rotate-12 border-4 border-[#FAFAFA] dark:border-slate-950">
                        <span class="text-2xl">🔍</span>
                    </div>
                </div>
                <h3 class="text-xl font-black text-slate-900 dark:text-white mb-3">{{ t('wishlist.empty') }}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-10 max-w-[280px] leading-relaxed">
                    Đừng để danh sách này trống trơn. Hãy bắt đầu chọn những hành trình mà bạn yêu thích nhất!
                </p>
                <button @click="closeDrawer(); $router.push(localePath('/tour'))"
                    class="group px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold transition-all hover:shadow-2xl hover:shadow-slate-500/20 active:scale-95 flex items-center gap-3">
                    <span>{{ t('tour.readyTour') }}</span>
                    <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </button>
            </div>

            <!-- Wishlist Items -->
            <div v-else class="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                <div v-for="(tour, index) in tours" :key="tour.id"
                    class="group relative flex flex-col gap-4 p-5 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-500 hover:-translate-y-1"
                    :style="{ transitionDelay: `${index * 50}ms` }">
                    <div class="flex gap-5">
                        <!-- Thumbnail -->
                        <div
                            class="relative w-24 h-24 flex-shrink-0 group-hover:scale-102 transition-transform duration-500">
                            <NuxtImg :src="tour.image" class="w-full h-full object-cover rounded-2xl shadow-md"
                                loading="lazy" />
                            <div
                                class="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/50 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1">
                                <svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {{ tour.rating.toFixed(1) }}
                            </div>
                        </div>

                        <!-- Basic Info -->
                        <div class="flex-1 flex flex-col justify-between py-1">
                            <div>
                                <h4 @click="viewTour(tour.id)"
                                    class="text-base font-bold text-slate-800 dark:text-slate-100 line-clamp-2 hover:text-sky-500 cursor-pointer transition-colors leading-tight mb-2">
                                    {{ tour.title }}
                                </h4>
                                <div class="flex flex-wrap gap-2">
                                    <span
                                        class="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
                                        {{ tour.type }}
                                    </span>
                                    <span
                                        class="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/30 flex items-center gap-1">
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {{ tour.duration }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Extended Info -->
                    <div class="pt-3 border-t border-slate-50 dark:border-slate-800 space-y-2">
                        <div v-if="tour.departFrom"
                            class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <div
                                class="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <span class="font-medium">{{ t('tour.departFromLabel') }} {{ tour.departFrom }}</span>
                        </div>
                        <div v-if="tour.routes"
                            class="flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <div
                                class="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mt-0.5">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 01-1.447-.894L15 7m0 10V7" />
                                </svg>
                            </div>
                            <span class="line-clamp-1 flex-1">{{ tour.routes }}</span>
                        </div>
                    </div>

                    <div class="flex items-center justify-between mt-1">
                        <span
                            class="text-xl font-black bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                            {{ formatPrice(tour.price) }}
                        </span>
                        <div class="flex items-center gap-2">
                            <button @click="handleRemove(tour.id)"
                                class="p-2.5 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-90"
                                :title="t('common.remove')">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                            <button @click="viewTour(tour.id)"
                                class="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-all active:scale-95">
                                Chi tiết
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div v-if="tours.length > 0"
                class="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                <button @click="closeDrawer(); $router.push(localePath('/tour'))"
                    class="flex-1 py-4 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all transition-colors active:scale-95">
                    {{ t('tour.readyTour') }}
                </button>
                <button @click="closeDrawer()"
                    class="flex-1 py-4 bg-sky-500 text-white rounded-2xl font-bold shadow-lg shadow-sky-500/25 hover:bg-sky-600 transition-all active:scale-95">
                    Đóng
                </button>
            </div>
        </div>
    </el-drawer>
</template>

<style>
.wishlist-drawer {
    --el-drawer-padding-primary: 0;
    border-radius: 2rem 0 0 2rem;
    overflow: hidden;
}

.wishlist-drawer .el-drawer__header {
    margin-bottom: 0;
    padding: 1.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.dark .wishlist-drawer .el-drawer__header {
    border-color: rgba(255, 255, 255, 0.04);
    background-color: #020617;
}

.wishlist-drawer .el-drawer__body {
    padding: 0;
    display: flex !important;
    flex-direction: column !important;
    height: 100%;
}

/* Custom Scrollbar */
.wishlist-drawer .el-drawer__body::-webkit-scrollbar {
    width: 5px;
}

.wishlist-drawer .el-drawer__body::-webkit-scrollbar-track {
    background: transparent;
}

.wishlist-drawer .el-drawer__body::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
}

.dark .wishlist-drawer .el-drawer__body::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
}
</style>
