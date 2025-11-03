<script setup lang="ts">
import HeroImage from "../public/hero_header.png"

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const slides = [
    {
        image: HeroImage,
        title: 'B Design',
        subtitle: 'Dù bạn đang tìm kiếm một bộ trang phục trình diễn, đồng phục nhóm hay phong cách cá nhân độc đáo – chúng tôi giúp bạn biến điều đó thành hiện thực.',
        cta: 'Liên hệ'
    },

];

const swiperOptions = {
    modules: [Autoplay, EffectFade, Navigation, Pagination],
    effect: 'fade',
    speed: 1000,
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    }
};
</script>

<template>
    <section class="relative h-[420px] md:h-screen overflow-hidden">
        <Swiper v-bind="swiperOptions" class="h-full">
            <SwiperSlide v-for="(slide, index) in slides" :key="index" class="relative">
                <!-- Overlay -->
                <div class="absolute inset-0   to-transparent z-10"></div>

                <!-- Background Image -->
                <img :src="slide.image" :alt="slide.title"
                    class="absolute inset-0 w-full h-full object-cover object-center rounded-bl-[100px] md:rounded-bl-[291px] opacity-80">

                <!-- Content -->
                <div class="relative z-20 h-full container mx-auto px-4 flex items-center">
                    <div class="max-w-2xl md:max-w-3xl lg:max-w-4xl">
                        <h1 class="text-32px md:text-75px md:leading-120% font-bold mb-4 md:mb-6 playfair-display
                            transform transition-all duration-700 translate-y-0 opacity-100 text-#292F36">
                            {{ slide.title }}
                        </h1>
                        <p class="text-base leading-200% md:text-xl mb-6 md:mb-8  font-400
                            transform transition-all duration-700 delay-200 translate-y-0 opacity-100 text-#444444">
                            {{ slide.subtitle }}
                        </p>
                        <div class="bg-#292F36 text-#FFFFFF w-200px md:w-220px h-48px md:h-75px px-48px py-26px rounded-12px 
                            hover:bg-black hover:text-white transition-all duration-300 
                            transform hover:scale-105 flex items-center justify-center gap-2 font-semibold text-18px">
                            {{ slide.cta }}
                            <i class='bx bx-right-arrow-alt text-#CDA274 text-32px'></i>
                        </div>
                    </div>
                </div>
            </SwiperSlide>

            <!-- Pagination -->
            <div class="swiper-pagination !bottom-8"></div>
        </Swiper>
    </section>
</template>

<style scoped>
.container {
    max-width: 1200px;
    padding-left: 1rem;
    padding-right: 1rem;
}

@media (min-width: 640px) {
    .container {
        padding-left: 2rem;
        padding-right: 2rem;
    }
}

@media (min-width: 1024px) {
    .container {
        padding-left: 3rem;
        padding-right: 3rem;
    }
}

/* Custom Swiper Styles */
:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
    width: 3rem;
    height: 3rem;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(4px);
    border-radius: 50%;
    transition: all 0.3s ease;
}

:deep(.swiper-button-prev:hover),
:deep(.swiper-button-next:hover) {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
}

:deep(.swiper-pagination-bullet) {
    width: 0.75rem;
    height: 0.75rem;
    background: rgba(255, 255, 255, 0.5);
    transition: all 0.3s ease;
}

:deep(.swiper-pagination-bullet-active) {
    background: #fff;
    transform: scale(1.25);
}

/* Transform utilities */
.translate-y-0 {
    transform: translateY(0);
}

/* Hover animations */
.hover\:scale-105:hover {
    transform: scale(1.05);
}

/* Z-index utilities */
.z-10 {
    z-index: 10;
}

.z-20 {
    z-index: 20;
}

/* Gradient overlay */
.from-black\/50 {
    --tw-gradient-from: rgb(0 0 0 / 0.5);
    --tw-gradient-to: rgb(0 0 0 / 0);
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.playfair-display {
    font-family: "Playfair Display", serif;
    font-optical-sizing: auto;
    font-weight: 700;
    font-style: normal;
}

/* Responsive adjustments */
@media (max-width: 640px) {
    .max-w-2xl {
        max-width: 100%;
    }
}

@media (min-width: 641px) and (max-width: 1024px) {
    .max-w-2xl {
        max-width: 28rem;
    }
}

@media (min-width: 1025px) {
    .max-w-2xl {
        max-width: 32rem;
    }
}
</style>
