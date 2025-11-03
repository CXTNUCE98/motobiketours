<script setup lang="ts">
import Collection1 from "@/public/colection_1.jpg"
import Collection2 from "@/public/colection_2.jpg"
import Collection3 from "@/public/colection_3.jpg"
import Collection4 from "@/public/colection_4.jpg"

const collections = [
    {
        title: 'Title',
        subtitle: 'Subtitle / Subtitle',
        image: Collection1,
        css: 'rounded-tr-80px'
    },
    {
        title: 'Title',
        subtitle: 'Subtitle / Subtitle',
        image: Collection2,
        css: 'rounded-tl-80px'
    },
    {
        title: 'Title',
        subtitle: 'Subtitle / Subtitle',
        image: Collection3,
        css: 'rounded-br-80px'
    },
    {
        title: 'Title',
        subtitle: 'Subtitle / Subtitle',
        image: Collection4,
        css: 'rounded-bl-80px'
    },
]
</script>
<template>
    <section class="max-w-6xl mx-auto px-4 py-10">
        <div class="text-center mb-10">
            <h2 class="text-32px md:text-50px mb-2 playfair-display">Bộ sưu tập</h2>
            <p class="text-gray-500 text-base md:text-22px max-w-737px mx-auto py-4">
                It is a long established fact that a reader will be distracted by the of readable content of page
                lookings at its layouts points.
            </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            <div v-for="(item, index) in collections" :key="index"
                class="bg-white overflow-hidden group  transition-all duration-300">
                <div class="overflow-hidden">
                    <img :src="item.image" alt="collection image"
                        class="w-full h-525px object-cover transform transition duration-300"
                        :class="item.css" />
                </div>
                <div class="flex justify-between items-center">
                    <div class="p-4">
                        <h3 class="text-gray-800 playfair-display text-18px md:text-25px">{{ item.title }}</h3>
                        <p class=" text-gray-500 text-14px md:text-22px">{{ item.subtitle }}</p>
                    </div>
                    <div class="flex justify-end">
                        <button
                            class="w-70px h-70px rounded-full bg-#F4F0EC  flex items-center justify-center transition">
                            <i class='bx bx-chevron-right text-30px text-#292F36'></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.playfair-display {
    font-family: "Playfair Display", serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
}
</style>