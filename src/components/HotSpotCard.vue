<script setup lang="ts">
import type { HotSpot } from '~/types/api';

defineProps<{
    spot: HotSpot;
    isShowAdd?: boolean;
    isLocating?: boolean;
    isInTrip?: boolean;
}>();

defineEmits<{
    (e: 'edit', spot: HotSpot): void;
    (e: 'delete', id: string): void;
    (e: 'addToTrip', spot: HotSpot): void;
    (e: 'removeFromTrip', id: string): void;
}>();


const { t } = useI18n();
const { user } = useAuth();
const isAdmin = computed(() => user.value?.isAdmin);
</script>

<template>
    <div
        class="spot-card group relative bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border border-zinc-100 dark:border-zinc-800">
        <!-- Image Section -->
        <div class="relative aspect-[4/3] overflow-hidden">
            <img :src="spot.images[0] || '/placeholder-spot.jpg'" :alt="spot.name"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

            <!-- Gradient Overlay -->
            <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            </div>

            <!-- Badges -->
            <div class="absolute top-4 left-4 flex flex-col gap-2 items-start">
                <div v-if="spot.isHot"
                    class="bg-red-500/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <i class='bx bxs-hot'></i>
                    <span>Hot</span>
                </div>
                <div v-if="spot.category"
                    class="bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg border border-white/10 backdrop-filter">
                    {{ spot.category }}
                </div>
            </div>
            <!-- Quick Actions (Edit/Delete) -->
            <div
                class="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                <button v-if="isAdmin" @click.stop="$emit('edit', spot)"
                    class="w-9 h-9 bg-white/90 backdrop-blur-md text-zinc-700 hover:text-blue-600 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                    title="Edit">
                    <i class='bx bxs-edit-alt text-lg'></i>
                </button>
                <button v-if="isAdmin" @click.stop="$emit('delete', spot.id)"
                    class="w-9 h-9 bg-white/90 backdrop-blur-md text-zinc-700 hover:text-red-600 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                    title="Delete">
                    <i class='bx bxs-trash text-lg'></i>
                </button>
            </div>
        </div>

        <!-- Content Section -->
        <div class="p-5 relative">
            <!-- Title & Rating -->
            <div class="mb-4">
                <h3
                    class="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-tight mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {{ spot.name }}
                </h3>
                <div class="flex items-center gap-2">
                    <el-rate v-model="spot.rating" disabled show-score text-color="#ff9900" score-template="{value}"
                        size="small" />
                </div>
            </div>

            <!-- Info Row -->
            <div class="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div class="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-sm">
                    <i class='bx bxs-navigation text-blue-500'></i>
                    <template v-if="spot.distance !== undefined && spot.distance !== null">
                        <span class="font-medium">{{ Math.round(spot.distance * 10) / 10 }} km</span>
                    </template>
                    <template v-else-if="isLocating">
                        <div class="flex items-center gap-1 opacity-60">
                            <i class='bx bx-loader-alt animate-spin text-xs'></i>
                            <span class="text-[10px] italic">{{ t('hotSpots.locating') }}</span>
                        </div>
                    </template>
                    <template v-else>
                        <span class="font-medium">N/A</span>
                    </template>
                </div>
                <div class="flex items-center gap-3">
                    <template v-if="isShowAdd">

                        <button v-if="!isInTrip" @click.stop="$emit('addToTrip', spot)"
                            class="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-full text-xs font-bold transition-all transform active:scale-95 shadow-sm">
                            <i class='bx bx-plus'></i>
                            <span>{{ t('hotSpots.addToTrip') }}</span>
                        </button>
                        <button v-else @click.stop="$emit('removeFromTrip', spot.id)"
                            class="flex items-center gap-1 px-3 py-1.5 bg-zinc-100 text-zinc-400 hover:bg-red-50 text-red-600 hover:text-red-600 rounded-full text-xs font-bold transition-all transform active:scale-95">
                            <i class='bx bx-check'></i>
                            <span>{{ t('hotSpots.added') }}</span>
                        </button>
                    </template>
                    <button class="text-zinc-400 hover:text-blue-500 transition-colors transform active:scale-90">
                        <i class='bx bx-map text-xl'></i>
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
.spot-card {
    /* Dynamic shadow color for dark mode */
}
</style>
