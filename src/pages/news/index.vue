<script setup lang="ts">
// @ts-nocheck
import { news } from '../../composables/mockup'
</script>

<template>
    <div>
        <div class="text-22px font-bold text-#02964C mb-2">News</div>
        <div class="h-1 bg-[#02964C] mb-4"></div>

        <div class="flex flex-col gap-4">
            <div
                v-for="n in news"
                :key="n.id"
                class="flex gap-3 p-3 rounded-md shadow-sm border border-gray/20 hover:shadow-md transition bg-white"
            >
                <router-link :to="`/news/${n.id}`" class="shrink-0">
                    <img :src="n.thumbnail" :alt="n.title" class="w-[160px] h-[100px] object-cover rounded-sm" />
                </router-link>

                <div class="flex-1 min-w-0">
                    <router-link :to="`/news/${n.id}`" class="block text-[#02964C] font-semibold hover:underline">
                        {{ n.title }}
                    </router-link>
                    <div class="text-12px text-gray-500 mt-1">{{ n.date }}</div>
                    <div class="text-14px text-gray-800 mt-1 line-clamp-2">{{ n.excerpt }}</div>
                </div>

                <div class="self-center">
                    <router-link :to="`/news/${n.id}`" class="text-12px bg-[#02964C] text-white px-3 py-1 rounded hover:opacity-90">
                        More detail »
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped></style>