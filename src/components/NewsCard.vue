<script setup lang="ts">
import { useRouter } from 'vue-router';

type Props = {
    id: string;
    image: string;
    title: string;
    date: string;
    views: number;
    description: string;
    to?: string;
};

const props = withDefaults(defineProps<Props>(), {
    to: undefined
});

const router = useRouter();

const formattedDate = props.date;
const formattedViews = new Intl.NumberFormat('vi-VN').format(props.views);

const handleCardClick = () => {
    if (props.to) {
        router.push(props.to);
    } else {
        router.push(`/news/${props.id}`);
    }
};
</script>

<template>
    <div class="group relative bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
        @click="handleCardClick">
        <!-- Image Container -->
        <div class="relative h-64 overflow-hidden">
            <img :src="image" :alt="title" loading="lazy"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>

        <!-- Metadata Bar (Below Image) -->
        <div class="px-5 pt-3 pb-2 border-b border-gray-200">
            <div class="flex items-center gap-4 text-gray-600 text-xs md:text-sm">
                <div class="flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ formattedDate }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{{ formattedViews }}</span>
                </div>
            </div>
        </div>

        <!-- Content -->
        <div class="p-5 pt-4">
            <!-- Title -->
            <h3
                class="text-gray-800 font-bold text-base mb-3 line-clamp-2 min-h-[3rem] group-hover:text-red-600 transition-colors duration-300">
                {{ title }}
            </h3>

            <!-- Description -->
            <p class="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                {{ description }}
            </p>
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

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
