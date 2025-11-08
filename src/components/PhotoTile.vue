 <script setup lang="ts">
 import { useRouter } from 'vue-router'
 
 interface Props {
     id: string
     src: string | string[]
     title: string
 }
 
 const props = defineProps<Props>()
 
 const router = useRouter()
function navigateToPhoto(id: string) {
    router.push(`/photos/${id}`)
}
</script>

<template>
    <div @click="navigateToPhoto(id)" 
        class="group relative bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-strong transition-all duration-300 cursor-pointer hover:-translate-y-2">
        <div class="relative h-64 overflow-hidden">
            <img :src="Array.isArray(src) ? src[0] : src" :alt="title" 
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div class="flex items-center justify-between text-white">
                    <span class="font-semibold">View Gallery</span>
                    <i class='bx bx-right-arrow-alt text-2xl'></i>
                </div>
            </div>
        </div>
        <div class="p-4">
            <h3 class="font-semibold text-secondary-800 group-hover:text-primary-600 transition-colors duration-200 text-center">
                {{ props.title }}
            </h3>
        </div>
    </div>
</template>

<style scoped></style>
