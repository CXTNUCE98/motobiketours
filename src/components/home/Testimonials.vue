<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { testimonials } from '@/data/homeData';

// Carousel state
const currentTestimonialIndex = ref(0);
let carouselInterval: ReturnType<typeof setInterval> | null = null;

const goToTestimonial = (index: number) => {
    currentTestimonialIndex.value = index;
    resetCarouselTimer();
};

const startCarousel = () => {
    if (carouselInterval) clearInterval(carouselInterval);
    carouselInterval = setInterval(() => {
        currentTestimonialIndex.value = (currentTestimonialIndex.value + 1) % testimonials.length;
    }, 5000);
};

const resetCarouselTimer = () => {
    if (carouselInterval) clearInterval(carouselInterval);
    startCarousel();
};

const pauseCarousel = () => {
    if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
    }
};

const resumeCarousel = () => {
    if (!carouselInterval) startCarousel();
};

onMounted(() => {
    startCarousel();
});

onUnmounted(() => {
    if (carouselInterval) clearInterval(carouselInterval);
});
</script>

<template>
    <div>
        <!-- Parallax Background Section -->
        <div class="parallax"></div>

        <!-- Testimonials Content Section -->
        <section class="testimonials-content relative">
            <div class="relative z-10 h-full flex items-end justify-start">
                <div class="w-full px-2 md:px-4 lg:px-6 pb-4 md:pb-6">
                    <!-- Testimonial Card -->
                    <div class="max-w-3xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative customer-section-fade"
                        @mouseenter="pauseCarousel" @mouseleave="resumeCarousel">
                        <!-- Icon xe hơi -->
                        <div class="absolute top-0 right-4 w-20 h-20 md:w-24 md:h-24">
                            <img src="/logo-car.png" alt="logo-car" loading="lazy" class="w-full h-full object-contain">
                        </div>

                        <!-- customer -->
                        <div>
                            <p class="text-red-600 text-sm font-semibold mb-2">#KHÁCH HÀNG HÀI LÒNG</p>
                            <h2 class="text-3xl md:text-4xl font-bold text-[#094174] mb-8">
                                Khách Hàng Của Chúng Tôi Nói Gì
                            </h2>

                            <!-- Current Testimonial with transition -->
                            <transition name="fade" mode="out-in">
                                <div :key="currentTestimonialIndex">
                                    <p class="text-gray-600 text-base md:text-lg leading-relaxed mb-8">
                                        {{ testimonials[currentTestimonialIndex].text }}
                                    </p>

                                    <!-- Author -->
                                    <div class="flex items-center gap-4">
                                        <img :src="testimonials[currentTestimonialIndex].image"
                                            :alt="testimonials[currentTestimonialIndex].name" loading="lazy"
                                            class="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-gray-200" />
                                        <div>
                                            <h3 class="text-lg md:text-xl font-bold text-[#094174]">
                                                {{ testimonials[currentTestimonialIndex].name }}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </transition>
                        </div>

                        <!-- Carousel indicators -->
                        <div class="flex justify-center gap-3 mt-8">
                            <button v-for="(testimonial, index) in testimonials" :key="testimonial.id"
                                @click="goToTestimonial(index)" :class="[
                                    'w-10 h-1.5 rounded-full transition-all duration-300',
                                    currentTestimonialIndex === index
                                        ? 'bg-red-500'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                ]" :aria-label="`Go to testimonial ${index + 1}`"></button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.parallax {
    background-image: url('/testimonial-bg.jpg');
    height: 80vh;
    min-height: 500px;
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}

@media only screen and (max-width: 1366px) {
    .parallax {
        background-attachment: scroll;
    }
}

@media only screen and (max-width: 768px) {
    .parallax {
        height: 60vh;
        min-height: 400px;
    }
}

.testimonials-content {
    background: transparent;
    position: relative;
    z-index: 10;
    margin-top: -80vh;
    height: 80vh;
    min-height: 500px;
}

@media only screen and (max-width: 768px) {
    .testimonials-content {
        margin-top: -60vh;
        height: 60vh;
        min-height: 400px;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: translateX(-20px);
}

.fade-leave-to {
    opacity: 0;
    transform: translateX(20px);
}
</style>
