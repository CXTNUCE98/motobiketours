<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

type Props = {
    id: string;
    image: string;
    title: string;
    price: number | string;
    originalPrice?: number;
    discount?: number;
    rating?: number;
    duration: string;
    people: string;
    badge?: string;
    showPeulisLabel?: boolean;
    variant?: 'default' | 'compact';
    to?: string;
    tags?: string[];
};

const props = withDefaults(defineProps<Props>(), {
    rating: 5,
    showPeulisLabel: true,
    variant: 'default',
    to: undefined,
    tags: () => []
});

const router = useRouter();
const isWishlisted = ref(false);

const formattedPrice = computed(() => {
    if (typeof props.price === 'string') return props.price;
    return new Intl.NumberFormat('vi-VN').format(props.price);
});

const formattedOriginalPrice = computed(() => {
    if (!props.originalPrice) return '';
    return new Intl.NumberFormat('vi-VN').format(props.originalPrice);
});

const handleBookTour = () => {
    if (props.to) {
        router.push(props.to);
    } else {
        router.push(`/tour/${props.id}`);
    }
};

const handleCardClick = () => {
    if (props.to) {
        router.push(props.to);
    } else {
        router.push(`/tour/${props.id}`);
    }
};

const toggleWishlist = (e: Event) => {
    e.stopPropagation();
    isWishlisted.value = !isWishlisted.value;
};
</script>

<template>
    <div class="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
        @click="handleCardClick" style="backdrop-filter: blur(10px);">
        <!-- Image Container with Gradient Overlay -->
        <div class="relative h-64 overflow-hidden">
            <NuxtImg :src="image" :alt="title" loading="lazy" format="webp"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

            <!-- Gradient Overlay -->
            <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500">
            </div>

            <!-- Wishlist Button -->
            <button @click="toggleWishlist"
                class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white z-10 shadow-lg"
                :class="isWishlisted ? 'text-red-500' : 'text-gray-400'">
                <svg class="w-5 h-5 transition-all duration-300" :fill="isWishlisted ? 'currentColor' : 'none'"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>

            <!-- Peulis Label (Top Left) -->
            <div v-if="showPeulisLabel"
                class="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold z-10 bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg">
                Peulis
            </div>

            <!-- Discount Badge (Top Right, below wishlist) -->
            <div v-if="discount"
                class="absolute top-16 right-4 px-3 py-1.5 rounded-full text-xs font-bold z-10 bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg animate-pulse">
                -{{ discount }}%
            </div>

            <!-- Badge (Alternative) -->
            <div v-if="badge && !showPeulisLabel"
                class="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold text-gray-700 z-10 flex items-center gap-2 shadow-lg">
                <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>{{ badge }}</span>
            </div>

            <!-- Tags at bottom of image -->
            <div v-if="tags && tags.length > 0" class="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 z-10">
                <span v-for="tag in tags.slice(0, 3)" :key="tag"
                    class="px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-md text-gray-700 shadow-md">
                    {{ tag }}
                </span>
            </div>
        </div>

        <!-- Content with Glassmorphism Effect -->
        <div class="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <!-- Rating Stars -->
            <div class="flex items-center gap-1 mb-3">
                <svg v-for="i in 5" :key="i" class="w-4 h-4 transition-colors duration-300"
                    :class="i <= rating ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
                <span class="text-xs text-gray-500 ml-1">({{ rating }}.0)</span>
            </div>

            <!-- Price -->
            <div class="flex items-center gap-2 mb-3">
                <span
                    class="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                    {{ formattedPrice }}<span v-if="typeof price === 'number'"> ₫</span>
                </span>
                <span v-if="originalPrice" class="text-sm text-gray-400 line-through">
                    {{ formattedOriginalPrice }} ₫
                </span>
            </div>

            <!-- Tour Title -->
            <h3
                class="text-gray-800 dark:text-white font-bold text-base mb-4 line-clamp-2 min-h-[3rem] leading-relaxed group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {{ title }}
            </h3>

            <!-- Details with Icons -->
            <div class="space-y-3 mb-5">
                <div class="flex items-center gap-3 text-gray-600 dark:text-gray-300 text-sm">
                    <div
                        class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="flex-1">
                        <span class="font-semibold text-gray-700 dark:text-gray-200">Thời gian:</span>
                        <span class="ml-1">{{ duration }}</span>
                    </div>
                </div>
                <div class="flex items-center gap-3 text-gray-600 dark:text-gray-300 text-sm">
                    <div
                        class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                        <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div class="flex-1">
                        <span class="font-semibold text-gray-700 dark:text-gray-200">Số lượng:</span>
                        <span class="ml-1">{{ people }}</span>
                    </div>
                </div>
            </div>

            <!-- Book Tour Button with Gradient -->
            <button @click.stop="handleBookTour"
                class="w-full bg-#1A71C7 hover:opacity-80 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 group/btn">
                <svg class="w-5 h-5 transition-transform duration-300 group-hover/btn:rotate-12" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Đặt Tour Ngay</span>
                <svg class="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </button>
        </div>

        <!-- Hover Glow Effect -->
        <div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style="box-shadow: 0 0 40px rgba(59, 130, 246, 0.3);"></div>
    </div>
</template>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.7;
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
