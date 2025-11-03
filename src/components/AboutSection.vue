<script setup lang="ts">
import ArtCreate from '../public/art_create.jpg'

const isVisible = ref(false);
const isHovered = ref(false);

onMounted(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                isVisible.value = true;
            }
        });
    }, { 
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });

    const section = document.querySelector('.about-section');
    if (section) {
        observer.observe(section);
    }

    return () => {
        if (section) {
            observer.unobserve(section);
        }
    };
});



const handleMouseEnter = () => {
    isHovered.value = true;
};

const handleMouseLeave = () => {
    isHovered.value = false;
};
</script>

<template>
    <section class="about-section py-12 sm:py-16 md:py-20 overflow-hidden">
        <div class="container mx-auto px-4">
            <div class="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12">
                <!-- Text Content -->
                <div class="md:(w-472px space-y-8 text-left)  space-y-6 px-4 text-center">
                    <div class="text-3xl sm:text-36px md:text-50px playfair-display leading-125%
                        transform transition-all duration-700"
                        :class="{ 'translate-x-0 opacity-100': isVisible, '-translate-x-20 opacity-0': !isVisible }">
                        Chúng tôi tạo ra nghệ thuật
                    </div>
                    <p class="text-base sm:text-lg md:(text-22px leading-150%) text-gray-600 
                        transform transition-all duration-700 delay-100 font-400"
                        :class="{ 'translate-x-0 opacity-100': isVisible, '-translate-x-20 opacity-0': !isVisible }">
                        It is a long established fact that a reader will be distracted by the of readable content of a page
                        <br />
                        when looking at its layout the points of using 
                        <br /> 
                        that it has a more-or-less normal.
                    </p>
                    
                    <!-- Contact Info -->
                    <div class="flex items-center justify-center flex-col md:(justify-start flex-row) gap-4 transform transition-all duration-700 delay-200"
                        :class="{ 'translate-x-0 opacity-100': isVisible, '-translate-x-20 opacity-0': !isVisible }">
                        <div class="flex items-center justify-center rounded-full w-58px h-58px md:(w-93px h-93px) bg-#F4F0EC p-2 hover:bg-[#C4A484] transition-colors group">
                             <img src="../public/call.png" alt="call_image" class="h-22px md:h-32px" >
                        </div>
                        <div class="space-y-1">
                            <p class="font-semibold text-lg sm:text-24px text-#4D5053">098747968</p>
                            <p class="text-gray-600 text-sm sm:text-22px">Gọi cho chúng tôi</p>
                        </div>
                    </div>

                    
                </div>

                <!-- Image Section -->
                <div class="md:w-1/2 transform transition-all duration-1000 mt-8 md:mt-0"
                    :class="{ 'translate-x-0 opacity-100 rotate-0': isVisible, 'translate-x-20 opacity-0 rotate-6': !isVisible }"
                    @mouseenter="handleMouseEnter"
                    @mouseleave="handleMouseLeave">
                    <div class="relative group">
                        <!-- Main Image -->
                        <img :src="ArtCreate"
                            class="w-382px h-[410px] sm:(h-[500px] w-full) md:(h-[600px] w-full) object-cover 
                            rounded-bl-[40px] sm:rounded-bl-[60px] md:rounded-bl-[80px] 
                            rounded-tr-[120px] sm:rounded-tr-[180px] md:rounded-tr-[240px] 
                            shadow-xl transition-transform duration-700 group-hover:scale-105"
                            />

                        <!-- Decorative Elements -->
                        <!-- <div class="absolute -top-4 -left-4 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 
                            bg-[#C4A484] rounded-full opacity-20 transition-transform duration-500
                            group-hover:scale-125 group-hover:opacity-30"></div>
                        
                        <div class="absolute -bottom-4 -right-4 w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 
                            bg-[#C4A484] rounded-full opacity-20 transition-transform duration-500
                            group-hover:scale-125 group-hover:opacity-30"></div> -->

                        <!-- Animated Border -->
                        <div class="absolute inset-0 border-2 border-[#C4A484] opacity-0 
                            rounded-bl-[80px] rounded-tr-[240px] transition-all duration-700
                            group-hover:opacity-20 group-hover:scale-105"></div>

                        <!-- Pattern Overlay with Animation -->
                        <div class="absolute inset-0 bg-gradient-to-r from-[#C4A484]/10 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-700
                            rounded-bl-[80px] rounded-tr-[240px]"></div>

                        <!-- Floating Elements -->
                        <div v-if="isHovered" class="absolute inset-0">
                            <div v-for="i in 3" :key="i"
                                class="absolute w-4 h-4 bg-[#C4A484] rounded-full opacity-20"
                                :style="{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    animation: `float ${2 + Math.random() * 4}s ease-in-out infinite`
                                }">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.container {
    max-width: 1200px;
}

/* Smooth transitions */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Transform utilities */
.translate-x-0 {
    transform: translateX(0);
}

.-translate-x-20 {
    transform: translateX(-5rem);
}

.translate-x-20 {
    transform: translateX(5rem);
}

.translate-y-0 {
    transform: translateY(0);
}

.translate-y-10 {
    transform: translateY(2.5rem);
}

.rotate-6 {
    transform: rotate(6deg);
}

/* Shadow utilities */
.shadow-xl {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.hover\:shadow-xl:hover {
    box-shadow: 0 25px 30px -12px rgba(0, 0, 0, 0.15);
}

/* Responsive text sizes */
@media (max-width: 640px) {
    .text-3xl {
        font-size: 1.875rem;
        line-height: 2.25rem;
    }
}

@media (min-width: 641px) and (max-width: 1024px) {
    .text-4xl {
        font-size: 2.25rem;
        line-height: 2.5rem;
    }
}

@media (min-width: 1025px) {
    .text-5xl {
        font-size: 3rem;
        line-height: 1.2;
    }
}

/* Animation keyframes */
@keyframes float {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

.animate-float {
    animation: float 6s ease-in-out infinite;
}

/* Group hover animations */
.group:hover .group-hover\:scale-105 {
    transform: scale(1.05);
}

.group:hover .group-hover\:scale-125 {
    transform: scale(1.25);
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
    .transition-all,
    .transform,
    .animate-float {
        transition: none;
        animation: none;
    }
}

.playfair-display {
  font-family: "Playfair Display", serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: normal;
}
</style>