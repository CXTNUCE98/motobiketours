<script setup lang="ts">
import { topDestinationsTours } from '@/data/homeData';
</script>

<template>
    <section class="fade-in-section py-12 md:py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 md:px-6">
            <!-- Header Text -->
            <div class="text-center mb-8 md:mb-12">
                <p class="text-red-600 text-sm md:text-base font-medium mb-2">
                    Điểm Đến Hàng Đầu
                </p>
                <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#094174] mb-4">
                    Tour Nổi Bật Của Chúng Tôi
                </h2>
                <p class="text-gray-600 text-base md:text-lg max-w-3xl mx-auto">
                    Những địa điểm đặc sắc cả trong và ngoài nước. Mang đến sự đa dạng cho khách hàng thoải mái lựa
                    chọn chuyến đi cho mình.
                </p>
            </div>

            <!-- Top Destinations Tours Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <TourCard v-for="tour in topDestinationsTours" :key="tour.id" :id="tour.id" :image="tour.image"
                    :title="tour.title" :price="tour.price" :original-price="tour.originalPrice"
                    :discount="tour.discount" :rating="tour.rating" :duration="tour.duration" :people="tour.people"
                    :to="tour.to" />
            </div>
        </div>
    </section>
</template>
