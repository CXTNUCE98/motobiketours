<script setup lang="ts">
import HeroImage from "@/public/hero_header.png"

const props = defineProps<{
    title: string
    subTitle: boolean
}>()

</script>

<template>
    <section class="relative h-64 md:h-436px bg-cover bg-center mb-16">
        <img :src="HeroImage" alt="Interior design" class="w-full h-full object-cover" />
        <div class="absolute inset-0 flex items-end justify-center">
            <div
                class="bg-white min-w-330px md:min-w-500px rounded-t-37px bg-opacity-90 py-4 md:py-8 px-12 text-center animate-on-scroll opacity-0 translate-y-5 transition-all duration-700">
                <h1 class="text-28px md:text-50px font-light mb-1 playfair-display font-normal">{{ title }}</h1>
                <p class="text-12px md:text-22px text-gray-600 ">{{ subTitle }}</p>
            </div>
        </div>
    </section>
</template>



<style scoped>
@media (prefers-reduced-motion: reduce) {
    .animate-on-scroll {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition: none !important;
    }
}

.delay-100 {
    transition-delay: 0.1s;
}

.playfair-display {
    font-family: 'Playfair Display', serif;
    font-optical-sizing: auto;
    font-weight: 500;
}
</style>