<script lang="ts" setup>
// @ts-nocheck
import { useRoute } from 'vue-router';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { tours } from '../../composables/mockup';
import TourGallery from '../../components/TourGallery.vue';
import BookingCard from '../../components/BookingCard.vue';

const route = useRoute();
const id = String(route.params.id || '');

function toSlug(input) {
    return String(input)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
}

const departFromSlugs = Array.from(new Set(tours.map((t) => toSlug(t.departFrom))));
const isDepartFrom = departFromSlugs.includes(id.toLowerCase());

const tour = tours.find((t) => t.id === id);
const cityTours = isDepartFrom ? tours.filter((t) => toSlug(t.departFrom) === id.toLowerCase()) : [];

const activeTab = ref('overview');
const gallery = computed(() => [
    tour?.thumbnail || '/gallery.jpg',
    '/carousel/1.jpg',
    '/carousel/2.jpg',
    '/carousel/3.jpg',
    '/carousel/4.jpg',
    '/carousel/5.jpg',
]);

const overviewHtml = `
  <h3 class="text-red-600 font-semibold mb-2">Highlights:</h3>
  <ul class="list-disc pl-6 space-y-1">
    <li>Cu Chi tunnels</li>
    <li>The landscapes alongside Ho Chi Minh trail</li>
    <li>Daily life of local people</li>
    <li>Dray Nur, Dray Sap waterfall - the biggest falls in the Central Highland</li>
    <li>Learn about different ethnic minority groups: Ede, M'Nong, K'Ho...</li>
    <li>Lak lake - the second biggest natural lake of Vietnam</li>
    <li>Ride through the jungle</li>
    <li>Fishing village</li>
  </ul>

  <h3 class="text-red-600 font-semibold mt-6 mb-2">Itinerary :</h3>

  <p class="italic font-semibold">1st day: Ride from Sai Gon to Dong Xoai</p>
  <p class="mb-2">Being ready at 8:00am, our guide(s) will pick you up at your hotel. Leaving the busy city, Sai Gon, we will ride head to the Cu Chi tunnel where you can learn many interesting stories about Vietnam history. We will spend a few hours and then ride to Dong Xoai (the beginning of the Ho Chi Minh trail from the South to the North). On the way, we will stop some places such as :</p>
  <ul class="list-disc pl-6 space-y-1">
    <li>Rubber tree plantations</li>
    <li>War Victory Monument</li>
    <li>Paddy field</li>
  </ul>
  <p>Arriving in Dong Xoai at 4:30pm and check in hotel.</p>

  <p class="italic font-semibold mt-4">2nd day: Ride from Dong Xoai to Dak Mil</p>
  <p class="mb-2">Today, we will ride following the Ho Chi Minh trail where you can:</p>
  <ul class="list-disc pl-6 space-y-1">
    <li>Enjoy its magnificent scenery</li>
    <li>Explore the rural life of the local people</li>
    <li>Learn more about the history of Vietnam</li>
    <li>Visit Soc Bom Bo village to understand S'tieng ethnic minority culture and traditions</li>
    <li>Learn how the locals make rice papers, noodles,…</li>
    <li>Arrive in Dak Mil (near Vietnam and Cambodia border) and check in hotel</li>
  </ul>

  <p class="italic font-semibold mt-4">3rd day: Ride from Dak Mil to Lak lake</p>
  <p class="mb-2">This is one of the best days of the tour.</p>
  <p class="mb-2">Following Ho Chi Minh trail, we will head to the national park where we will:</p>
  <ul class="list-disc pl-6 space-y-1">
    <li>Visit a local market to buy special foods for our picnic lunch</li>
    <li>Visit the Dray Sap and Dray Nur Waterfall – biggest ones in the Central Highland</li>
    <li>Swim in Fairy pool, take a water massage from waterfall</li>
    <li>Our guide will cook special foods for the lunch</li>
  </ul>
  <p class="mb-2">After that, we will get on the motorbike to ride to Lak lake, and stop at:</p>
  <ul class="list-disc pl-6 space-y-1">
    <li>Ede ethnic minority village where they still keep their tradition long house</li>
    <li>The Elephant rock mountain – trek to the top of it to have a look the views around</li>
  </ul>
  <p>Check-in at the long-stilt-house or Lak resort for over-night stay.</p>

  <p class="italic font-semibold mt-4">4th day: Ride from Lak lake to Nha Trang</p>
  <ul class="list-disc pl-6 space-y-1">
    <li>Walk around Jun village where M'Nong minority people live to learn more about daily life and culture</li>
    <li>Option: Crossing Lak lake by boat or traveling on the back of elephant</li>
  </ul>
  <p class="mb-2">Heading down to the coast we will:</p>
  <ul class="list-disc pl-6 space-y-1">
    <li>Visit the E'de ethnic minority people villages</li>
    <li>Enjoy more great countryside roads</li>
    <li>Enjoy the amazing pass named Phuong Hoang (Phoenix pass)</li>
    <li>Visit Cham tower</li>
    <li>Visit fishing village</li>
  </ul>
  <p>Finish the trip in Nha Trang around 4:30pm.</p>
`;

const contactHtml = `
  <div class="text-center">
    <p>Welcome to Danang</p>
    <p>Youth tourism & Service center</p>
    <p>NGUYỄN VĂN QUANG'S TOUR</p>
    <p><strong>Add:</strong> 14 Nguyễn Thị Thập St, Thanh Khê Pistris, Danang City</p>
    <p><strong>Hand phone:</strong> 0903.579094</p>
    <p><strong>Email:</strong> vietnammotorbikegroup@gmail.com</p>
    <p>For further informations please call direct to me! Always at your service.</p>
  </div>
`;

const tourCode = computed(() => {
    const head = (tour && tour?.title ? tour?.title?.split(':')[0] : '') || '';
    const parts = head.split(' ');
    return parts[1] || '';
});

const setActive = (tab) => {
    activeTab.value = tab;
};

// Related tours (same departure location)
const relatedTours = computed(() => {
    if (!tour) return [];
    return tours
        .filter(t => t.id !== tour.id && t.departFrom === tour.departFrom)
        .slice(0, 3);
});
</script>

<template>
    <!-- Depart From List View -->
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-pink-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 py-8"
        v-if="isDepartFrom">
        <div class="container mx-auto px-4">
            <!-- Breadcrumb -->
            <nav class="mb-6 flex items-center gap-2 text-sm">
                <NuxtLink to="/tour"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Tất cả tours
                </NuxtLink>
                <span class="text-gray-400">/</span>
                <span class="text-gray-700 dark:text-gray-300 font-medium capitalize">{{ id.replace(/-/g, ' ') }}</span>
            </nav>

            <!-- Header -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 transition-colors duration-300">
                <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-3">Tour và Giá</h1>
                <div class="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-medium">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clip-rule="evenodd" />
                    </svg>
                    <span>Khởi hành từ: <span class="font-bold capitalize">{{ id.replace(/-/g, ' ') }}</span></span>
                </div>
            </div>

            <!-- Tours List -->
            <div class="space-y-6">
                <div v-for="item in cityTours" :key="item.id"
                    class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700">
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
                        <div class="md:col-span-4">
                            <img :src="item?.thumbnail" :alt="item?.title"
                                class="w-full h-48 md:h-full object-cover rounded-xl" />
                        </div>
                        <div class="md:col-span-8 flex flex-col justify-between">
                            <div>
                                <NuxtLink :to="`/tour/${item?.id}`"
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
                                        <span><strong>Thời gian:</strong> {{ item?.duration }}</span>
                                    </div>
                                    <div class="flex items-start gap-2">
                                        <svg class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5"
                                            fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <span><strong>Lộ trình:</strong> {{ item?.routes }}</span>
                                    </div>
                                    <div class="flex items-start gap-2">
                                        <svg class="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5"
                                            fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                            <path fill-rule="evenodd"
                                                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <span><strong>Loại tour:</strong> {{ item?.type }}</span>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div
                                    class="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                                    {{ item?.price_usd }}
                                </div>
                                <div class="flex gap-3">
                                    <NuxtLink :to="`/tour/${item?.id}`"
                                        class="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                                        Chi tiết
                                    </NuxtLink>
                                    <NuxtLink to="/contact"
                                        class="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                                        Đặt ngay
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
                <NuxtLink to="/tour"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Tất cả tours
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
                        <span><strong>Khởi hành từ:</strong> {{ tour?.depart_from }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clip-rule="evenodd" />
                        </svg>
                        <span><strong>Thời gian:</strong> {{ tour?.duration }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="flex">
                            <svg v-for="i in 5" :key="i" class="w-5 h-5 text-yellow-400" fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                        <span class="font-semibold">5.0</span>
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
                                <div class="text-sm text-gray-600 dark:text-gray-400">Thời gian</div>
                                <div class="font-bold text-gray-800 dark:text-white">{{ tour?.duration }}</div>
                            </div>
                            <div
                                class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-4 text-center">
                                <svg class="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2"
                                    fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                </svg>
                                <div class="text-sm text-gray-600 dark:text-gray-400">Nhóm</div>
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
                                <div class="text-sm text-gray-600 dark:text-gray-400">Lộ trình</div>
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
                                <div class="text-sm text-gray-600 dark:text-gray-400">Mã tour</div>
                                <div class="font-bold text-gray-800 dark:text-white">{{ tourCode }}</div>
                            </div>
                        </div>

                        <!-- Tabs -->
                        <div class="border-b-2 border-gray-100 dark:border-gray-700 mb-6">
                            <div class="flex gap-8">
                                <button @click="setActive('overview')"
                                    class="relative pb-4 font-semibold transition-colors duration-300"
                                    :class="activeTab === 'overview' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'">
                                    Tổng quan
                                    <div v-if="activeTab === 'overview'"
                                        class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full">
                                    </div>
                                </button>
                                <button @click="setActive('contact')"
                                    class="relative pb-4 font-semibold transition-colors duration-300"
                                    :class="activeTab === 'contact' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'">
                                    Liên hệ
                                    <div v-if="activeTab === 'contact'"
                                        class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full">
                                    </div>
                                </button>
                            </div>
                        </div>

                        <!-- Tab Content -->
                        <div class="prose dark:prose-invert max-w-none">
                            <div v-if="activeTab === 'overview'" v-html="overviewHtml"
                                class="leading-relaxed text-gray-700 dark:text-gray-300"></div>
                            <div v-else v-html="contactHtml" class="leading-relaxed text-gray-700 dark:text-gray-300">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column - Booking Card -->
                <div class="lg:col-span-4">
                    <BookingCard :price="tour.priceUsd || 'Liên hệ'" :duration="tour.duration" groupSize="2-10 người"
                        difficulty="Trung bình" :tourId="tour.id" />
                </div>
            </div>

            <!-- Related Tours -->
            <div v-if="relatedTours.length > 0" class="mt-12">
                <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                    <span class="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        Tour liên quan
                    </span>
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <NuxtLink v-for="relatedTour in relatedTours" :key="relatedTour?.id"
                        :to="`/tour/${relatedTour?.id}`" class="block group">
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
                                        {{ relatedTour?.price_usd }}
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
    <div
        class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-pink-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-20 transition-colors duration-300">
        <div class="text-center">
            <div class="inline-block p-8 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
                <svg class="w-24 h-24 text-red-600 dark:text-red-400" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-4">Không tìm thấy tour</h2>
            <p class="text-gray-600 dark:text-gray-400 mb-8">Tour bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <NuxtLink to="/tour"
                class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform duration-300 shadow-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại danh sách tour
            </NuxtLink>

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
                        <span><strong>Khởi hành từ:</strong> {{ tour?.depart_from }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clip-rule="evenodd" />
                        </svg>
                        <span><strong>Thời gian:</strong> {{ tour?.duration }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="flex">
                            <svg v-for="i in 5" :key="i" class="w-5 h-5 text-yellow-400" fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                        <span class="font-semibold">5.0</span>
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
                                <div class="text-sm text-gray-600 dark:text-gray-400">Thời gian</div>
                                <div class="font-bold text-gray-800 dark:text-white">{{ tour?.duration }}</div>
                            </div>
                            <div
                                class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-4 text-center">
                                <svg class="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2"
                                    fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                </svg>
                                <div class="text-sm text-gray-600 dark:text-gray-400">Nhóm</div>
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
                                <div class="text-sm text-gray-600 dark:text-gray-400">Lộ trình</div>
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
                                <div class="text-sm text-gray-600 dark:text-gray-400">Mã tour</div>
                                <div class="font-bold text-gray-800 dark:text-white">{{ tourCode }}</div>
                            </div>
                        </div>

                        <!-- Tabs -->
                        <div class="border-b-2 border-gray-100 dark:border-gray-700 mb-6">
                            <div class="flex gap-8">
                                <button @click="setActive('overview')"
                                    class="relative pb-4 font-semibold transition-colors duration-300"
                                    :class="activeTab === 'overview' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'">
                                    Tổng quan
                                    <div v-if="activeTab === 'overview'"
                                        class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full">
                                    </div>
                                </button>
                                <button @click="setActive('contact')"
                                    class="relative pb-4 font-semibold transition-colors duration-300"
                                    :class="activeTab === 'contact' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'">
                                    Liên hệ
                                    <div v-if="activeTab === 'contact'"
                                        class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full">
                                    </div>
                                </button>
                            </div>
                        </div>

                        <!-- Tab Content -->
                        <div class="prose dark:prose-invert max-w-none">
                            <div v-if="activeTab === 'overview'" v-html="overviewHtml"
                                class="leading-relaxed text-gray-700 dark:text-gray-300"></div>
                            <div v-else v-html="contactHtml" class="leading-relaxed text-gray-700 dark:text-gray-300">
                            </div>
                        </div>
                        <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                            <span class="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                Tour liên quan
                            </span>
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <NuxtLink v-for="relatedTour in relatedTours" :key="relatedTour?.id"
                                :to="`/tour/${relatedTour?.id}`" class="block group">
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
                                            <span class="text-sm text-gray-600 dark:text-gray-400">{{
                                                relatedTour?.duration
                                            }}</span>
                                            <span
                                                class="text-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                                                {{ relatedTour?.price_usd }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
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