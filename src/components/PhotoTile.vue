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
    <div @click="navigateToPhoto(id)" class="flex flex-col items-center cursor-pointer">
        <div class="relative">
            <div class="border-4 border-[#e5e7eb] bg-white shadow-md rotate-[-1.5deg] inline-block p-1">
                <img :src="Array.isArray(src) ? src[0] : src" :alt="title" class="w-[220px] h-[150px] object-cover" />
            </div>
        </div>
        <div class="mt-2 text-[#1B7CCE] font-semibold text-center">
            {{ props.title }}
        </div>
    </div>

</template>

<style scoped></style>
