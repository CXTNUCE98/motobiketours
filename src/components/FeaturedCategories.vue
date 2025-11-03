<script setup lang="ts">
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Navigation, Autoplay, EffectFade } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

const swiperInstance = ref<SwiperType>()

const categories = ref([
    { 
        name: "Men's Collection", 
        image: "https://cantabilshop.com/cdn/shop/files/men_collection_mobile.jpg?v=1728306864",
        description: "Discover the latest trends in men's fashion"
    },
    { 
        name: "Women's Collection", 
        image: "https://media.istockphoto.com/id/1208148708/photo/polka-dot-summer-brown-dress-suede-wedge-sandals-eco-straw-tote-bag-cosmetics-on-a-light.jpg?s=612x612&w=0&k=20&c=9Y135GYKHLlPotGIfynBbMPhXNbYeuDuFzreL_nfDE8=",
        description: "Elegant and stylish women's wear"
    },
    { 
        name: "Accessories", 
        image: "https://bournecrisp.com.au/wp-content/uploads/2019/07/accessories-make-or-break-1100x733.jpg",
        description: "Complete your look with our accessories"
    },
    { 
        name: "Footwear", 
        image: "https://footdr.com/wp-content/uploads/2020/05/choose-summer-footwear.jpg",
        description: "Step out in style with our footwear collection"
    },
    { 
        name: "Bags & Wallets", 
        image: "https://mygemma.com/cdn/shop/articles/mygemma-WPD-Top-Blog-Image-6.png?v=1695912828",
        description: "Luxury bags for every occasion"
    }
])

const onSwiper = (swiper: SwiperType) => {
    swiperInstance.value = swiper
}
</script>

<template>
    <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
            <div class="text-center mb-12">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Categories</h2>
                <p class="text-gray-600 max-w-2xl mx-auto">Discover our carefully curated collection of fashion essentials</p>
            </div>

            <Swiper 
                :modules="[Pagination, Navigation, Autoplay, EffectFade]"
                :slides-per-view="1"
                :space-between="30"
                :loop="true"
                :pagination="{ 
                    clickable: true,
                    dynamicBullets: true
                }"
                :navigation="true"
                :autoplay="{ 
                    delay: 5000, 
                    disableOnInteraction: false 
                }"
                :breakpoints="{
                    '640': {
                        slidesPerView: 2,
                    },
                    '1024': {
                        slidesPerView: 3,
                    }
                }"
                @swiper="onSwiper"
                class="featured-categories-swiper"
            >
                <SwiperSlide v-for="(category, index) in categories" :key="index">
                    <div class="relative group overflow-hidden rounded-xl shadow-lg transition-all duration-500 hover:shadow-2xl">
                        <div class="aspect-w-4 aspect-h-3">
                            <img 
                                :src="category.image"
                                :alt="category.name"
                                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            >
                        </div>
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <h3 class="text-white text-xl font-bold mb-2">{{ category.name }}</h3>
                            <p class="text-gray-200 text-sm">{{ category.description }}</p>
                            <button class="mt-4 bg-white text-black px-6 py-2 rounded-full text-sm font-medium transform hover:scale-105 transition-transform duration-300">
                                Shop Now
                            </button>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    </section>
</template>

<style scoped>
.featured-categories-swiper {
    padding-bottom: 60px;
}

:deep(.swiper-pagination) {
    bottom: 0;
}

:deep(.swiper-pagination-bullet) {
    width: 10px;
    height: 10px;
    background-color: #cbd5e1;
    opacity: 0.5;
    transition: all 0.3s ease;
}

:deep(.swiper-pagination-bullet-active) {
    background-color: #000;
    opacity: 1;
    width: 24px;
    border-radius: 5px;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
    color: #000;
    background-color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

:deep(.swiper-button-next:after),
:deep(.swiper-button-prev:after) {
    font-size: 18px;
    font-weight: bold;
}

:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
    background-color: #000;
    color: white;
}

.aspect-w-4 {
    position: relative;
    padding-bottom: 75%;
}

.aspect-w-4 > * {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}
</style>

