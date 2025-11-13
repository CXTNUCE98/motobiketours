<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

type Props = {
    id: string;
    image: string;
    title: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    rating?: number;
    duration: string;
    people: string;
    badge?: string;
    showPeulisLabel?: boolean;
    variant?: 'default' | 'compact';
    to?: string;
};

const props = withDefaults(defineProps<Props>(), {
    rating: 5,
    showPeulisLabel: true,
    variant: 'default',
    to: undefined
});

const router = useRouter();

const formattedPrice = computed(() => {
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
</script>

<template>
    <div 
        class="group relative bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
        @click="handleCardClick"
    >
        <!-- Image Container -->
        <div class="relative h-64 overflow-hidden">
            <img 
                :src="image" 
                :alt="title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            <!-- Peulis Label (Top Left) -->
            <div 
                v-if="showPeulisLabel"
                class="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold z-10"
            >
                Peulis
            </div>
            
            <!-- Discount Badge (Top Right) -->
            <div 
                v-if="discount"
                class="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold z-10"
            >
                -{{ discount }}%
            </div>
            
            <!-- Badge (Top Left - alternative) -->
            <div 
                v-if="badge && !showPeulisLabel"
                class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 z-10 flex items-center gap-1"
            >
                <span>{{ badge }}</span>
            </div>
        </div>

        <!-- Content -->
        <div class="p-5">
            <!-- Rating Stars -->
            <div class="flex items-center gap-0.5 mb-2">
                <svg 
                    v-for="i in 5" 
                    :key="i"
                    class="w-4 h-4 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
            </div>

            <!-- Price -->
            <div class="flex items-center gap-2 mb-3">
                <span class="text-red-600 font-bold text-lg">
                    {{ formattedPrice }} ₫
                </span>
                <span 
                    v-if="originalPrice"
                    class="text-gray-400 line-through text-sm"
                >
                    {{ formattedOriginalPrice }} ₫
                </span>
            </div>

            <!-- Tour Title -->
            <h3 class="text-gray-800 font-semibold text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                {{ title }}
            </h3>

            <!-- Details -->
            <div class="space-y-2 mb-4">
                <div class="flex items-center gap-2 text-gray-600 text-sm">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span><span class="font-medium">Thời gian:</span> {{ duration }}</span>
                </div>
                <div class="flex items-center gap-2 text-gray-600 text-sm">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    <span><span class="font-medium">Số lượng:</span> {{ people }}</span>
                </div>
            </div>

            <!-- Book Tour Button -->
            <button
                @click.stop="handleBookTour"
                class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                <span>Đặt Tour</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>

