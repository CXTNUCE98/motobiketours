<script setup>
import { videos } from '../../composables/mockup'
</script>

<template>
    <div>
        <!-- Page Header -->
        <div class="text-center mb-8">
            <h1 class="text-4xl font-bold mb-2">
                <span class="text-gray-800">VIDEO </span>
                <span class="text-[#1A71C7]">GALLERY</span>
            </h1>
            <p class="text-gray-600 text-lg">Watch our Vietnam adventure videos</p>
        </div>

        <div class="grid grid-cols-1 gap-6">
            <div
                v-for="v in videos"
                :key="v.id"
                class="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border-l-4 border-[#1A71C7]"
            >
                <div class="flex flex-col md:flex-row gap-0">
                    <router-link :to="`/video/${v.id}`" class="shrink-0 overflow-hidden relative">
                        <img :src="v.thumbnail" :alt="v.title" 
                            class="w-full md:w-[200px] h-[200px] object-cover group-hover:scale-110 transition-transform duration-500" />
                        <!-- Play icon overlay -->
                        <div class="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                            <i class="bx bx-play-circle text-white text-6xl group-hover:scale-110 transition-transform"></i>
                        </div>
                    </router-link>

                    <div class="flex-1 p-5 flex flex-col justify-between">
                        <div>
                            <router-link :to="`/video/${v.id}`" 
                                class="block text-gray-800 text-xl font-bold hover:text-[#1A71C7] transition-colors duration-300 mb-2">
                                {{ v.title }}
                            </router-link>
                            <div class="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                <i class="bx bx-calendar text-[#FFA726]"></i>
                                <span>{{ v.date }}</span>
                            </div>
                            <div class="text-gray-700 line-clamp-2">{{ v.excerpt }}</div>
                        </div>

                        <div class="mt-4">
                            <router-link :to="`/video/${v.id}`" 
                                class="inline-flex items-center gap-2 bg-gradient-to-r from-[#1A71C7] to-[#D81B60] hover:from-[#D81B60] hover:to-[#1A71C7] text-white px-5 py-2 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                <i class="bx bx-play"></i>
                                Watch Video
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped></style>