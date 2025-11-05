
<script setup>
// @ts-nocheck
import { useRoute } from 'vue-router';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { tours } from '../../composables/mockup';

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

function formatPrice(priceUsd) {
    // if (priceUsd === undefined || priceUsd === null) return 'Call';
    // return `${priceUsd?.toFixed(2)} USD`;
}

const activeTab = ref('overview');
const gallery = computed(() => [
    tour?.thumbnail || '/gallery.jpg',
    '/carousel/1.jpg',
    '/carousel/2.jpg',
    '/carousel/3.jpg',
    '/carousel/4.jpg',
    '/carousel/5.jpg',
]);

const selectedIndex = ref(0);
const galleryMain = computed(() => (gallery.value && gallery.value.length ? gallery.value[selectedIndex.value] : '/gallery.jpg'));
const galleryThumbs = computed(() => gallery.value || []);

// Auto-rotate gallery
const rotateMs = 4000;
let timerId = 0;
const isHovering = ref(false);

function startAutoRotate() {
    stopAutoRotate();
    timerId = window.setInterval(() => {
        if (isHovering.value) return;
        const total = galleryThumbs.value.length;
        if (!total) return;
        selectedIndex.value = (selectedIndex.value + 1) % total;
    }, rotateMs);
}

function stopAutoRotate() {
    if (timerId) {
        clearInterval(timerId);
        timerId = 0;
    }
}

onMounted(() => startAutoRotate());
onBeforeUnmount(() => stopAutoRotate());

function setActive(tab) {
    activeTab.value = tab;
}

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
    <li>Walk around Jun village where M’Nong minority people live to learn more about daily life and culture</li>
    <li>Option: Crossing Lak lake by boat or traveling on the back of elephant</li>
  </ul>
  <p class="mb-2">Heading down to the coast we will:</p>
  <ul class="list-disc pl-6 space-y-1">
    <li>Visit the E’de ethnic minority people villages</li>
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
    const head = (tour && tour.title ? tour.title.split(':')[0] : '') || '';
    const parts = head.split(' ');
    return parts[1] || '';
});

function selectThumb(i) {
    selectedIndex.value = i;
}
</script>

<template>
    <div class="container mx-auto px-4 py-6" v-if="isDepartFrom">
        <div class="mb-3">
            <NuxtLink to="/tour" class="text-[#0d6efd] hover:underline">← All tours</NuxtLink>
        </div>
        <h1 class="text-2xl font-semibold mb-2">Tour and Price</h1>
        <div class="text-green-700 font-medium mb-4">Depart from: <span class="font-semibold capitalize">{{ id.replace(/-/g, ' ') }}</span></div>

        <div class="flex flex-col gap-6">
            <div v-for="item in cityTours" :key="item.id" class="grid grid-cols-1 md:grid-cols-12 gap-4 border-b pb-6">
                <img :src="item.thumbnail" :alt="item.title" class="w-full h-[160px] object-cover rounded md:col-span-3" />
                <div class="md:col-span-9">
                    <NuxtLink :to="'/tour/' + item.id" class="text-[#0d6efd] hover:underline font-semibold">{{ item.title }}</NuxtLink>
                    <div class="mt-2 text-sm leading-7">
                        <div><span class="font-semibold">Duration</span> : {{ item.duration }}</div>
                        <div><span class="font-semibold">Routes</span> : {{ item.routes }}</div>
                        <div><span class="font-semibold">Type tour</span> : {{ item.type }}</div>
                    </div>
                    <div class="mt-2 flex items-center gap-6 text-sm">
                        <div>
                            <span class="font-semibold">Price:</span>
                            <span class="text-[#0d6efd]">{{ item.priceUsd }}</span>
                        </div>
                        <NuxtLink :to="'/tour/' + item.id" class="text-[#0d6efd] hover:underline">More details</NuxtLink>
                        <NuxtLink to="/contact" class="text-[#0d6efd] hover:underline">Book now</NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="container mx-auto px-4 py-6" v-else-if="tour">
        <div class="mb-4">
            <NuxtLink to="/tour" class="text-[#0d6efd] hover:underline">← Back to all tours</NuxtLink>
        </div>

        <h1 class="text-2xl font-semibold mb-2">{{ tour.title }}</h1>
        <div class="text-green-700 font-medium mb-4">Depart from: <span class="font-semibold">{{ tour.departFrom }}</span></div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div class="md:col-span-7" @mouseenter="isHovering=true" @mouseleave="isHovering=false">
                <img :src="galleryMain" :alt="tour.title" class="w-full h-[280px] md:h-[360px] object-cover rounded transition-opacity duration-300" />
                <div class="mt-2 grid grid-cols-6 gap-2">
                    <img
                        v-for="(g, i) in galleryThumbs"
                        :key="i"
                        :src="g"
                        @click="selectThumb(i)"
                        :class="['h-16 w-full object-cover rounded border cursor-pointer', i === selectedIndex ? 'ring-2 ring-green-600 border-green-600' : '']"
                    />
                </div>
            </div>

            <div class="text-sm leading-7 md:col-span-5">
                <div class="text-lg font-semibold text-[#0d6efd] mb-2">Tour {{ tourCode }}</div>
                <div><span class="font-semibold">Duration</span> : {{ tour.duration }}</div>
                <div><span class="font-semibold">Destinations</span> : </div>
                <div><span class="font-semibold">Routes</span> : {{ tour.routes }}</div>
                <div><span class="font-semibold">Type tour</span> : {{ tour.type }}</div>

                <div class="mt-4 flex items-center justify-between">
                    <div>
                        <span class="font-semibold">Price :</span>
                        <span class="text-[#d33] font-bold ml-1">{{ tour.priceUsd || '375 USD' }}</span>
                    </div>
                    <NuxtLink to="/contact" class="px-4 py-2 bg-[#28a745] text-white rounded hover:opacity-90">Book now</NuxtLink>
                </div>
            </div>
        </div>

        <div class="mt-6 border-b"></div>

        <div class="mt-4">
            <div class="flex gap-3 text-sm border-b">
                <button
                    :class="activeTab==='overview' ? 'px-4 py-2 -mb-px border-b-2 border-green-600 text-green-700' : 'px-4 py-2 -mb-px border-b-2 border-transparent'"
                    @click="setActive('overview')"
                >Overview</button>
                <button
                    :class="activeTab==='contact' ? 'px-4 py-2 -mb-px border-b-2 border-green-600 text-green-700' : 'px-4 py-2 -mb-px border-b-2 border-transparent'"
                    @click="setActive('contact')"
                >Contact us</button>
            </div>

            <div v-if="activeTab==='overview'" class="pt-4 leading-7" v-html="overviewHtml"></div>

            <div v-else class="pt-4 leading-7" v-html="contactHtml"></div>
        </div>
    </div>
    <div v-else class="container mx-auto px-4 py-6">
        <p class="text-red-600">Tour not found.</p>
        <NuxtLink to="/tour" class="text-[#0d6efd] hover:underline">Back to all tours</NuxtLink>
    </div>
</template>


<style scoped>

</style>