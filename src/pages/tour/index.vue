
<script setup>
import { tours } from '../../composables/mockup';

function formatPrice(priceUsd) {
    // if (priceUsd === undefined || priceUsd === null) return 'Call';
    // return `${priceUsd.toFixed(2)} USD`;
}
</script>

<template>
    <div class="container mx-auto px-4 py-6">
        <div class="text-green-700 font-medium mb-2">
            All tours
        </div>

        <div class="flex flex-col gap-6">
            <div
                v-for="tour in tours"
                :key="tour.id"
                class="grid grid-cols-1 md:grid-cols-12 gap-4 border-b pb-6"
            >
                <img :src="tour.thumbnail" :alt="tour.title" class="w-full h-[160px] object-cover rounded md:col-span-3" />

                <div class="md:col-span-9">
                    <NuxtLink :to="'/tour/' + tour.id" class="text-[#0d6efd] hover:underline font-semibold">
                        {{ tour.title }}
                    </NuxtLink>

                    <div class="mt-2 text-sm leading-7">
                        <div><span class="font-semibold">Duration</span> : {{ tour.duration }}</div>
                        <div><span class="font-semibold">Routes</span> : {{ tour.routes }}</div>
                        <div><span class="font-semibold">Type tour</span> : {{ tour.type }}</div>
                    </div>

                    <div class="mt-2 flex items-center gap-6 text-sm">
                        <div>
                            <span class="font-semibold">Price:</span>
                            <span class="text-[#0d6efd]">{{ tour?.priceUsd }}</span>
                        </div>
                        <NuxtLink :to="'/tour/' + tour.id" class="text-[#0d6efd] hover:underline">More details</NuxtLink>
                        <NuxtLink to="/contact" class="text-[#0d6efd] hover:underline">Book now</NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>

</style>