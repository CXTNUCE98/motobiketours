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
        class="group cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
        <div class="relative overflow-hidden h-56">
            <img :src="Array.isArray(src) ? src[0] : src" :alt="title" 
                class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p class="font-semibold text-sm">Click to view</p>
            </div>
        </div>
        <div class="p-4 bg-white border-t-2 border-[#FF6B35]">
            <h3 class="text-gray-800 font-bold text-center group-hover:text-[#FF6B35] transition-colors duration-300">
                {{ props.title }}
            </h3>
        </div>
    </div>

</template>

<style scoped></style>
