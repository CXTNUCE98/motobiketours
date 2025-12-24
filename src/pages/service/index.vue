<script setup lang="ts">
import { ref, computed } from 'vue';
import { services } from '../../composables/services';
import { useI18n } from 'vue-i18n';
// import { useServicesQuery } from '~/composables/useServicesQuery';

const searchQuery = ref('');
const { t } = useI18n();

// const { data: servicesData, isLoading } = useServicesQuery(computed(() => ({ q: searchQuery.value })));

// const filteredServices = computed(() => {
//     return (servicesData.value as any)?.data || [];
// });

// const servicesCount = computed(() => (servicesData.value as any)?.total || 0);
const filteredServices = computed(() => {
    if (!searchQuery.value) return services;

    const query = searchQuery.value.toLowerCase();
    return services.filter(service =>
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.features.some(f => f.toLowerCase().includes(query))
    );
});
</script>

<template>
    <div
        class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <!-- Hero Section -->
        <div class="relative py-24 md:py-32 overflow-hidden">
            <!-- Background Elements -->
            <div class="absolute inset-0 bg-[#0f172a]">
                <!-- Animated Mesh Gradient -->
                <div class="absolute inset-0 opacity-40">
                    <div
                        class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600 blur-[120px] animate-pulse">
                    </div>
                    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600 blur-[120px] animate-pulse"
                        style="animation-delay: 2s"></div>
                    <div class="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-500 blur-[100px] animate-pulse"
                        style="animation-delay: 4s"></div>
                </div>
                <!-- Grid Pattern -->
                <div class="absolute inset-0 opacity-10"
                    style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 40px 40px;">
                </div>
            </div>

            <div class="container mx-auto px-4 relative z-10">
                <div class="max-w-4xl mx-auto text-center">
                    <div
                        class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-300 text-sm font-bold mb-8 animate-fade-in">
                        <span class="relative flex h-2 w-2">
                            <span
                                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        {{ t('service.professionalService') }}
                    </div>

                    <h1 class="text-5xl md:text-7xl font-black mb-8 leading-tight animate-fade-in"
                        style="animation-delay: 0.2s">
                        <span class="block text-white">{{ t('service.solution') }}</span>
                        <span
                            class="block bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent filter drop-shadow-sm">
                            {{ t('service.perfectExperience') }}
                        </span>
                    </h1>

                    <p class="text-xl md:text-2xl mb-12 text-blue-100/80 max-w-2xl mx-auto leading-relaxed animate-fade-in"
                        style="animation-delay: 0.4s">
                        {{ t('service.professionalServiceDesc') }}
                    </p>

                    <!-- Quick Stats -->
                    <div class="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto animate-fade-in"
                        style="animation-delay: 0.6s">
                        <div
                            class="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
                            <div
                                class="text-3xl md:text-4xl font-black text-white mb-1 group-hover:text-indigo-400 transition-colors">
                                {{ servicesCount }}</div>
                            <div class="text-xs font-bold text-blue-200/60 uppercase tracking-widest">{{
                                t('service.service') }}</div>
                        </div>
                        <div
                            class="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
                            <div
                                class="text-3xl md:text-4xl font-black text-white mb-1 group-hover:text-purple-400 transition-colors">
                                24/7</div>
                            <div class="text-xs font-bold text-blue-200/60 uppercase tracking-widest">{{
                                t('service.support') }}</div>
                        </div>
                        <div
                            class="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
                            <div
                                class="text-3xl md:text-4xl font-black text-white mb-1 group-hover:text-pink-400 transition-colors">
                                5.0</div>
                            <div class="text-xs font-bold text-blue-200/60 uppercase tracking-widest">{{
                                t('service.reputation') }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Decorative Bottom Wave -->
            <div class="absolute bottom-0 left-0 right-0 pointer-events-none">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
                    <path
                        d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                        class="fill-gray-50 dark:fill-gray-900 transition-colors duration-300" />
                </svg>
            </div>
        </div>

        <!-- Services Grid -->
        <div class="container mx-auto px-4 py-16">
            <!-- Search Bar (Moved below Hero) -->
            <div class="max-w-2xl mx-auto mb-16 -mt-8 relative z-20">
                <div class="relative group">
                    <div
                        class="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl group-hover:bg-indigo-500/30 transition-all duration-500">
                    </div>
                    <input v-model="searchQuery" type="text" :placeholder="t('service.filter')"
                        class="relative w-full px-6 py-5 pr-14 rounded-2xl text-gray-800 dark:text-white bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl text-lg shadow-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 placeholder-gray-400 border border-white/20 dark:border-gray-700" />
                    <button
                        class="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-xl hover:scale-110 transition-transform duration-300 shadow-lg">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div v-if="filteredServices.length > 0"
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                <NuxtLink v-for="(service, index) in filteredServices" :key="service.id" :to="`/service/${service.id}`"
                    class="group animate-fade-in" :style="{ animationDelay: `${index * 0.1}s` }">
                    <div
                        class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border-2 border-gray-100 dark:border-gray-700 h-full">
                        <!-- Image -->
                        <div class="relative h-64 overflow-hidden">
                            <img :src="service.thumbnail" :alt="service.title"
                                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div
                                class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500">
                            </div>

                            <!-- Icon Badge -->
                            <div
                                class="absolute top-6 left-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
                                <i :class="`bx ${service.icon} text-3xl text-white`"></i>
                            </div>

                            <!-- Price Badge -->
                            <div
                                class="absolute bottom-6 right-6 px-4 py-2 rounded-xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg">
                                <div class="text-sm font-semibold text-gray-600 dark:text-gray-400">Từ</div>
                                <div
                                    class="text-lg font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                    {{ service.priceRange }}
                                </div>
                            </div>
                        </div>

                        <!-- Content -->
                        <div class="p-6">
                            <h3
                                class="text-2xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                                {{ service.shortTitle }}
                            </h3>

                            <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                                {{ service.description }}
                            </p>

                            <!-- Features -->
                            <div class="space-y-2 mb-6">
                                <div v-for="(feature, idx) in service.features.slice(0, 3)" :key="idx"
                                    class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor"
                                        viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <span class="line-clamp-1">{{ feature }}</span>
                                </div>
                            </div>

                            <!-- CTA Button -->
                            <button
                                class="w-full px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold hover:scale-105 transition-transform duration-300 shadow-lg flex items-center justify-center gap-2">
                                <span>Xem Chi Tiết</span>
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-20">
                <div class="inline-block p-8 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
                    <svg class="w-24 h-24 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Không tìm thấy dịch vụ nào</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-6">Hãy thử tìm kiếm với từ khóa khác</p>
                <button @click="searchQuery = ''"
                    class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform duration-300 shadow-lg">
                    Xóa tìm kiếm
                </button>
            </div>
        </div>

        <!-- Why Choose Us Section -->
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
            <div class="container mx-auto px-4">
                <h2 class="text-4xl font-bold text-center mb-12">{{ $t('service.whyChooseUs') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div class="text-center">
                        <div
                            class="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <i class='bx bx-shield-quarter text-4xl'></i>
                        </div>
                        <h3 class="text-xl font-bold mb-2">{{ $t('service.safetyInsurance') }}</h3>
                        <p class="text-blue-100">{{ $t('service.safetyInsuranceDesc') }}</p>
                    </div>
                    <div class="text-center">
                        <div
                            class="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <i class="bx bx-user-check text-4xl"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-2">{{ $t('service.professional') }}</h3>
                        <p class="text-blue-100">{{ $t('service.professionalDesc') }}</p>
                    </div>
                    <div class="text-center">
                        <div
                            class="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <i class="bx bx-support text-4xl"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-2">{{ $t('service.support247') }}</h3>
                        <p class="text-blue-100">{{ $t('service.support247Desc') }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.6s ease-out forwards;
    opacity: 0;
}

.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>