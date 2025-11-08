
<script setup>
import { tours } from '../../composables/mockup';

function formatPrice(priceUsd) {
    // if (priceUsd === undefined || priceUsd === null) return 'Call';
    // return `${priceUsd.toFixed(2)} USD`;
}
</script>

<template>
    <div class="container mx-auto px-4 py-6">
        <!-- Page Header -->
        <div class="text-center mb-8">
            <h1 class="text-4xl font-bold mb-2">
                <span class="text-gray-800">ALL </span>
                <span class="text-[#E91E63]">TOURS</span>
            </h1>
            <p class="text-gray-600 text-lg">Discover amazing motorcycle tours across Vietnam</p>
        </div>

        <!-- Tours Grid -->
        <div class="grid grid-cols-1 gap-6">
            <div
                v-for="tour in tours"
                :key="tour.id"
                class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
                <div class="grid grid-cols-1 md:grid-cols-12 gap-0">
                    <!-- Image -->
                    <div class="md:col-span-4 relative overflow-hidden h-64 md:h-auto">
                        <img :src="tour.thumbnail" :alt="tour.title" 
                            class="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500" />
                        <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 font-semibold shadow-lg">
                            <i class="bx bx-time-five text-[#FF6B35]"></i>
                            <span class="text-sm text-gray-700">{{ tour.duration }}</span>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="md:col-span-8 p-6">
                        <NuxtLink :to="'/tour/' + tour.id" 
                            class="text-2xl font-bold text-gray-800 hover:text-[#FF6B35] transition-colors duration-300 block mb-3">
                            {{ tour.title }}
                        </NuxtLink>

                        <div class="space-y-2 text-gray-700 mb-4">
                            <div class="flex items-start gap-2">
                                <i class="bx bx-time text-[#FF6B35] mt-0.5"></i>
                                <span class="text-gray-600 font-semibold min-w-[80px]">Duration:</span>
                                <span>{{ tour.duration }}</span>
                            </div>
                            <div class="flex items-start gap-2">
                                <i class="bx bx-map text-[#FF6B35] mt-0.5"></i>
                                <span class="text-gray-600 font-semibold min-w-[80px]">Routes:</span>
                                <span class="line-clamp-2">{{ tour.routes }}</span>
                            </div>
                            <div class="flex items-start gap-2">
                                <i class="bx bx-category text-[#FF6B35] mt-0.5"></i>
                                <span class="text-gray-600 font-semibold min-w-[80px]">Type:</span>
                                <span class="line-clamp-2">{{ tour.type }}</span>
                            </div>
                        </div>

                        <div class="border-t pt-4 flex flex-wrap items-center gap-4">
                            <div class="text-lg flex items-center gap-2">
                                <i class="bx bx-dollar-circle text-[#FF6B35] text-2xl"></i>
                                <span class="text-gray-600 font-semibold">Price:</span>
                                <span class="text-[#FF6B35] font-bold text-xl">{{ tour?.priceUsd }}</span>
                            </div>
                            <div class="flex gap-3 ml-auto">
                                <NuxtLink :to="'/tour/' + tour.id" 
                                    class="bg-gradient-to-r from-[#FF6B35] to-[#E91E63] hover:from-[#E91E63] hover:to-[#FF6B35] text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg font-bold uppercase text-sm tracking-wide">
                                    View Details
                                </NuxtLink>
                                <NuxtLink to="/contact" 
                                    class="bg-gradient-to-r from-[#FFA726] to-[#FF9800] hover:from-[#FF9800] hover:to-[#FFA726] text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg font-bold uppercase text-sm tracking-wide">
                                    Book Now
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>

</style>