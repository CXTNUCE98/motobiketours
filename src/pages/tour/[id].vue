<script lang="ts" setup>
import { sanitizeHtml } from '~/utils/sanitize';

const route = useRoute();
const { t } = useI18n();
const { formatPrice } = useCurrency();
const localePath = useLocalePath();
const id = computed(() => String(route.params.id || ''));

// Fetch Tour Detail
const { data: tour, isLoading: isLoadingTour, error: tourError } = useTourByIdQuery(id);

// Fetch Reviews
const { data: reviews } = useTourReviewsQuery(id);

// Fetch City Tours (only if tour fetch fails and id is not a UUID)
const isUuid = computed(() => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id.value));
const formattedLocation = computed(() => id.value.replace(/-/g, ' '));
const { data: cityTours, isLoading: isLoadingCityTours } = useToursQuery(
    computed(() => ({ q: formattedLocation.value })),
    computed(() => !!tourError.value && !isUuid.value)
);

const isDepartFrom = computed(() => !!tourError.value && (cityTours.value as any)?.data && (cityTours.value as any).data.length > 0);
const isNotFound = computed(() => !!tourError.value && (!isUuid.value ? (!(cityTours.value as any)?.data || (cityTours.value as any).data.length === 0) : true) && !isLoadingCityTours.value);

const activeTab = ref('overview');

const gallery = computed(() => {
    if (!tour.value) return [];
    const images = tour.value.images || [];
    return [tour.value.thumbnail, ...images].filter(Boolean);
});

const overviewHtml = computed(() => tour.value?.content || '');

const contactHtml = `
  <div class="text-center">
    <p>Welcome to Danang</p>
    <p>Youth tourism & Service center</p>
    <p>ANDAGO'S TOUR</p>
    <p><strong>Add:</strong> 53 Phạm Ngọc Mậu, Thanh Khê, Đà Nẵng</p>
    <p><strong>Hand phone:</strong> 0854.242.357 (Mr An)</p>
    <p><strong>Email:</strong> contact.andago@gmail.com</p>
    <p>For further informations please call direct to me! Always at your service.</p>
  </div>
`;

const tourCode = computed(() => {
    if (!tour.value?.title) return '';
    const parts = tour.value.title.split(':');
    if (parts.length > 1) {
        return parts[0].replace('TOUR', '').trim();
    }
    return '';
});

const setActive = (tab: string) => {
    activeTab.value = tab;
};


// Related tours (same departure location)
const { data: relatedToursData } = useToursQuery(
    computed(() => ({ q: tour.value?.depart_from })),
    computed(() => !!tour.value?.depart_from)
);

const relatedTours = computed(() => {
    const data = (relatedToursData.value as any)?.data || [];
    if (!data.length || !tour.value) return [];
    return data
        .filter((t: any) => t.id !== (tour.value as any)?.id)
        .slice(0, 3);
});
</script>

<template>
    <!-- Loading State -->
    <div v-if="isLoadingTour && !isDepartFrom"
        class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
    </div>
    <!-- Depart From List View -->
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-pink-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 py-8"
        v-else-if="isDepartFrom">
        <div class="container mx-auto px-4">
            <!-- Breadcrumb -->
            <nav class="mb-6 flex items-center gap-2 text-sm">
                <NuxtLink :to="localePath('/tour')"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    {{ t('tour.allTours') }}
                </NuxtLink>
                <span class="text-gray-400">/</span>
                <span class="text-gray-700 dark:text-gray-300 font-medium capitalize">{{ formattedLocation }}</span>
            </nav>

            <!-- Header -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 transition-colors duration-300">
                <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-3">{{ t('tour.title') }}</h1>
                <div class="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-medium">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clip-rule="evenodd" />
                    </svg>
                    <span>{{ t('tour.departingFrom') }}: <span class="font-bold capitalize">{{ formattedLocation
                            }}</span></span>
                </div>
            </div>
            <!-- Tours List -->
            <div class="space-y-6">
                <div v-for="item in cityTours?.data" :key="item.id"
                    class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700">
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
                        <div class="md:col-span-4">
                            <img :src="item?.thumbnail" :alt="item?.title"
                                class="w-full h-48 md:h-full object-cover rounded-xl" />
                        </div>
                        <div class="md:col-span-8 flex flex-col justify-between">
                            <div>
                                <NuxtLink :to="localePath(`/tour/${item?.id}`)"
                                    class="text-2xl font-bold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 block mb-4">
                                    {{ item?.title }}
                                </NuxtLink>
                                <div class="space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                                    <div class="flex items-center gap-2">
                                        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <span><strong>{{ t('tour.departingFrom') }}:</strong> {{ item?.depart_from
                                            }}</span>
                                    </div>
                                    <div class="flex items-start gap-2">
                                        <svg class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5"
                                            fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <span><strong>{{ t('tour.route') }}:</strong> {{ item?.routes }}</span>
                                    </div>
                                    <div class="flex items-start gap-2">
                                        <svg class="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5"
                                            fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                            <path fill-rule="evenodd"
                                                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <span><strong>{{ t('tour.type') }}:</strong> {{ item?.type }}</span>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div
                                    class="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                                    {{ formatPrice(item?.price_usd) }}
                                </div>
                                <div class="flex gap-3">
                                    <NuxtLink :to="localePath(`/tour/${item?.id}`)"
                                        class="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                                        {{ t('tour.detail') }}
                                    </NuxtLink>
                                    <NuxtLink :to="localePath('/contact')"
                                        class="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                                        {{ t('tour.bookTourNow') }}
                                    </NuxtLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Tour Detail View -->
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-pink-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 py-8"
        v-else-if="tour">
        <div class="container mx-auto px-4">
            <!-- Breadcrumb -->
            <nav class="mb-6 flex items-center gap-2 text-sm">
                <NuxtLink :to="localePath('/tour')"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    {{ t('tour.allTours') }}
                </NuxtLink>
                <span class="text-gray-400">/</span>
                <span class="text-gray-700 dark:text-gray-300 font-medium">{{ tour?.title?.substring(0, 50) }}...</span>
            </nav>

            <!-- Title Section -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 transition-colors duration-300">
                <h1 class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">{{ tour?.title }}</h1>
                <div class="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-300">
                    <div class="flex items-center gap-2">
                        <svg class="w-5 h-5 text-orange-600 dark:text-orange-400" fill="currentColor"
                            viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clip-rule="evenodd" />
                        </svg>
                        <span><strong>{{ t('tour.departFrom') }}:</strong> {{ tour?.depart_from }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clip-rule="evenodd" />
                        </svg>
                        <span><strong>{{ t('tour.duration') }}:</strong> {{ tour?.duration }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="flex">
                            <el-rate :model-value="tour?.rating_stats?.average_rating || 0" disabled
                                disabled-void-color="#DCDFE6" size="small" />
                        </div>
                        <span class="font-semibold">{{ tour?.rating_stats?.average_rating || 0 }}</span>
                        <span class="text-secondary text-sm">({{ tour?.rating_stats?.total_reviews || 0 }})</span>
                    </div>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <!-- Left Column - Gallery & Details -->
                <div class="lg:col-span-8 space-y-8">
                    <!-- Gallery -->
                    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors duration-300">
                        <TourGallery :images="gallery" :title="tour?.title" />
                    </div>

                    <!-- Tour Info -->
                    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors duration-300">
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div
                                class="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl p-4 text-center">
                                <svg class="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                        clip-rule="evenodd" />
                                </svg>
                                <div class="text-sm text-gray-600 dark:text-gray-400">{{ t('tour.time') }}</div>
                                <div class="font-bold text-gray-800 dark:text-white">{{ tour?.duration }}</div>
                            </div>
                            <div
                                class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-4 text-center">
                                <svg class="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2"
                                    fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                </svg>
                                <div class="text-sm text-gray-600 dark:text-gray-400">{{ t('tour.group') }}</div>
                                <div class="font-bold text-gray-800 dark:text-white">2-10 người</div>
                            </div>
                            <div
                                class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl p-4 text-center">
                                <svg class="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z"
                                        clip-rule="evenodd" />
                                </svg>
                                <div class="text-sm text-gray-600 dark:text-gray-400">{{ t('tour.route') }}</div>
                                <div class="font-bold text-gray-800 dark:text-white text-xs">{{
                                    tour?.routes?.substring(0,
                                        15) }}...</div>
                            </div>
                            <div
                                class="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 rounded-xl p-4 text-center">
                                <svg class="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-2"
                                    fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fill-rule="evenodd"
                                        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                                        clip-rule="evenodd" />
                                </svg>
                                <div class="text-sm text-gray-600 dark:text-gray-400">{{ t('tour.tourCode') }}</div>
                                <div class="font-bold text-gray-800 dark:text-white">{{ tourCode || 'N/A' }}</div>
                            </div>
                        </div>

                        <!-- Tabs -->
                        <div class="border-b-2 border-gray-100 dark:border-gray-700 mb-6">
                            <div class="flex gap-6 overflow-x-auto pb-0.5 scrollbar-hide">
                                <button v-for="tab in ['overview', 'itinerary', 'reviews', 'contact']" :key="tab"
                                    @click="setActive(tab)"
                                    class="relative pb-4 font-semibold transition-colors duration-300 whitespace-nowrap"
                                    :class="activeTab === tab ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'">
                                    {{ t(`tour.${tab}`) }}
                                    <div v-if="activeTab === tab"
                                        class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full">
                                    </div>
                                </button>
                            </div>
                        </div>

                        <!-- Tab Content -->
                        <div class="prose dark:prose-invert max-w-none">
                            <div v-if="activeTab === 'overview'" v-html="sanitizeHtml(overviewHtml)"
                                class="leading-relaxed text-gray-700 dark:text-gray-300"></div>

                            <div v-else-if="activeTab === 'itinerary'" class="space-y-6">
                                <template v-if="tour?.itineraries && tour.itineraries.length > 0">
                                    <div
                                        class="h-[400px] w-full rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-800">
                                        <InteractiveMap :itineraries="tour.itineraries" />
                                    </div>
                                    <div class="space-y-4">
                                        <div v-for="(item, idx) in tour.itineraries" :key="item.id" class="flex gap-4">
                                            <div class="flex flex-col items-center">
                                                <div
                                                    class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                                                    {{ idx + 1 }}
                                                </div>
                                                <div v-if="idx < tour.itineraries.length - 1"
                                                    class="w-0.5 flex-grow bg-blue-100 dark:bg-blue-900/30 my-1"></div>
                                            </div>
                                            <div class="pb-6">
                                                <h4 class="font-bold text-primary-text">{{ item.hot_spot?.name }}</h4>
                                                <p class="text-sm text-secondary mt-1">{{ item.activity_description }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <div v-else class="py-12 text-center bg-gray-50 dark:bg-zinc-900/50 rounded-3xl">
                                    <el-empty
                                        :description="t('tour.noItinerary') || 'Chưa có lịch trình cho tour này'" />
                                </div>
                            </div>

                            <div v-else-if="activeTab === 'reviews'" class="space-y-8">
                                <RatingOverview :stats="tour.rating_stats" size="large" />
                                <ReviewForm :tour-id="tour.id" />
                                <ReviewList :reviews="reviews || []" />
                            </div>

                            <div v-else-if="activeTab === 'contact'" v-html="sanitizeHtml(contactHtml)"
                                class="leading-relaxed text-gray-700 dark:text-gray-300">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column - Booking Card -->
                <div class="lg:col-span-4">
                    <BookingCard :price="tour.price_usd || 'Liên hệ'" :duration="tour.duration" groupSize="2-10 người"
                        difficulty="Trung bình" :tourId="tour.id" />
                </div>
            </div>

            <!-- Related Tours -->
            <div v-if="relatedTours.length > 0" class="mt-12">
                <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                    <span class="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        {{ t('tour.relatedTours') }}
                    </span>
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <NuxtLink v-for="relatedTour in relatedTours" :key="relatedTour?.id"
                        :to="localePath(`/tour/${relatedTour?.id}`)" class="block group">
                        <div
                            class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                            <div class="relative h-48 overflow-hidden">
                                <img :src="relatedTour?.thumbnail" :alt="relatedTour?.title"
                                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div
                                    class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500">
                                </div>
                            </div>
                            <div class="p-5">
                                <h3
                                    class="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                    {{ relatedTour?.title }}
                                </h3>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ relatedTour?.duration
                                    }}</span>
                                    <span
                                        class="text-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                                        {{ formatPrice(relatedTour?.price_usd) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>

    <!-- Not Found -->
    <div v-else-if="isNotFound"
        class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-pink-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-20 transition-colors duration-300">
        <div class="text-center">
            <div class="inline-block p-8 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
                <svg class="w-24 h-24 text-red-600 dark:text-red-400" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-4">{{ t('tour.notFoundTour') }}</h2>
            <p class="text-gray-600 dark:text-gray-400 mb-8">{{ t('tour.notFoundTourDesc') }}</p>
            <NuxtLink :to="localePath('/tour')"
                class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform duration-300 shadow-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {{ t('tour.goBackTourList') }}
            </NuxtLink>
        </div>
    </div>
</template>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.prose {
    color: #374151;
}

:global(.dark) .prose {
    color: #d1d5db;
}

.prose h3 {
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
}

.prose ul {
    margin-top: 0.5rem;
    margin-bottom: 1rem;
}

.prose p {
    margin-bottom: 0.75rem;
}
</style>