<script setup lang="ts">
import type { HotSpot } from '~/types/api';

const props = defineProps<{
    spotId: string | null;
    modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const { t } = useI18n();

const { data: spot, isLoading } = useHotSpotByIdQuery(computed(() => props.spotId || ''));

const activeImage = ref(0);

watch(() => props.spotId, () => {
    activeImage.value = 0;
});

const close = () => {
    emit('update:modelValue', false);
};
</script>

<template>
    <UModal :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)"
        :ui="{ width: 'sm:max-w-4xl', rounded: 'rounded-3xl' }">
        <div v-if="isLoading" class="p-20 flex justify-center">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>

        <div v-else-if="spot" class="relative bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            <!-- Header -->
            <div
                class="p-6 flex items-center justify-between bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
                <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{{ spot.name }}</h2>
                <div class="flex items-center gap-3">
                    <button
                        class="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <UnoIcon i="i-ph-heart" class="text-xl" />
                    </button>
                    <button @click="close"
                        class="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <UnoIcon i="i-ph-x" class="text-xl" />
                    </button>
                </div>
            </div>

            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Left: Images -->
                <div class="space-y-4">
                    <div class="aspect-[16/10] rounded-2xl overflow-hidden shadow-inner bg-zinc-200 dark:bg-zinc-800">
                        <img :src="spot.images[activeImage]" class="w-full h-full object-cover" />
                    </div>
                    <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <div v-for="(img, idx) in spot.images" :key="idx" @click="activeImage = idx"
                            class="flex-shrink-0 w-20 aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all"
                            :class="activeImage === idx ? 'border-blue-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'">
                            <img :src="img" class="w-full h-full object-cover" />
                        </div>
                    </div>

                    <div
                        class="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
                        <h4 class="font-bold flex items-center gap-2 mb-3">
                            <UnoIcon i="i-ph-info-bold" class="text-blue-500" />
                            Thông tin chi tiết
                        </h4>
                        <p class="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                            {{ spot.description }}
                        </p>
                    </div>
                </div>

                <!-- Right: Info & Actions -->
                <div class="space-y-6">
                    <!-- Status & Opening Hours -->
                    <div
                        class="flex items-start gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                        <div
                            class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 flex-shrink-0">
                            <UnoIcon i="i-ph-clock-fill" />
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-bold text-green-600">Đang mở cửa</span>
                                <span class="text-xs text-zinc-400">• {{ t('hotSpots.openingHours') }}</span>
                            </div>
                            <p class="text-sm font-medium mt-0.5">{{ spot.opening_hours }}</p>
                        </div>
                    </div>

                    <!-- Price & Rules -->
                    <div
                        class="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                        <h4 class="font-bold text-sm text-zinc-400 uppercase tracking-wider mb-4">{{ t('hotSpots.price')
                            }} & Quy định</h4>

                        <div class="space-y-4">
                            <div class="flex justify-between items-center text-sm">
                                <span class="text-zinc-500">Giá vé tham quan</span>
                                <span class="font-bold text-zinc-900 dark:text-zinc-100">{{ spot.price_info }}</span>
                            </div>
                            <div class="flex justify-between items-center text-sm">
                                <span class="text-zinc-500">Địa điểm lân cận</span>
                                <span class="font-semibold text-zinc-700 dark:text-zinc-300">200m</span>
                            </div>
                        </div>

                        <button
                            class="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                            <UnoIcon i="i-ph-ticket-bold" />
                            {{ t('hotSpots.bookTicket') }}
                        </button>
                    </div>

                    <!-- Map Mini -->
                    <div
                        class="h-40 bg-zinc-200 dark:bg-zinc-800 rounded-2xl overflow-hidden relative border border-zinc-100 dark:border-zinc-800">
                        <div class="absolute inset-0 flex items-center justify-center">
                            <UnoIcon i="i-ph-map-trifold" class="text-4xl text-zinc-400 animate-pulse" />
                            <span
                                class="absolute bottom-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
                                {{ spot.lat }}, {{ spot.lng }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Nearby suggestions -->
            <div v-if="spot.nearby?.length" class="p-6 pt-0">
                <h4 class="text-lg font-bold mb-4 flex items-center justify-between">
                    <span>{{ t('hotSpots.nearbySuggestions') }}</span>
                    <button class="text-sm text-blue-500 hover:underline">Xem thêm</button>
                </h4>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div v-for="near in spot.nearby" :key="near.id" class="group cursor-pointer">
                        <div
                            class="aspect-square rounded-xl overflow-hidden mb-2 bg-zinc-200 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800">
                            <img :src="near.images[0]"
                                class="w-full h-full object-cover group-hover:scale-110 transition-all" />
                        </div>
                        <p class="text-xs font-bold truncate">{{ near.name }}</p>
                        <p class="text-[10px] text-zinc-500 line-clamp-1">{{ Math.round(near.distance * 10) / 10 }}km
                            away</p>
                    </div>
                </div>
            </div>
        </div>
    </UModal>
</template>
