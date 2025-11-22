<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { services } from '../../composables/services';

const route = useRoute();
const activeTab = ref('info'); // 'info' or 'reviews'

const service = computed(() => {
    return services.find(s => s.id === route.params.id);
});

const contactPhone = '1900 9477'; // Số điện thoại mẫu

const handleCallNow = () => {
    window.location.href = `tel:${contactPhone.replace(/\s/g, '')}`;
};

const handleConsultation = () => {
    // Có thể mở modal hoặc chuyển đến trang liên hệ
    alert('Chức năng liên hệ tư vấn sẽ được triển khai');
};
</script>

<template>
    <div v-if="service"
        class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <!-- Hero Section with Image -->
        <div class="relative h-[60vh] overflow-hidden">
            <img :src="service.thumbnail" :alt="service.title" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

            <!-- Content Overlay -->
            <div class="absolute inset-0 flex items-end">
                <div class="container mx-auto px-4 pb-12">
                    <div class="max-w-4xl">
                        <div class="flex items-center gap-3 mb-4">
                            <div
                                class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                                <i :class="`bx ${service.icon} text-3xl text-white`"></i>
                            </div>
                            <div>
                                <div class="text-blue-200 text-sm font-semibold">DỊCH VỤ</div>
                                <div class="text-white text-2xl font-bold">{{ service.shortTitle }}</div>
                            </div>
                        </div>
                        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
                            {{ service.title }}
                        </h1>
                        <p class="text-xl text-blue-100 mb-6">
                            {{ service.description }}
                        </p>
                        <div class="flex flex-wrap gap-3">
                            <div class="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-white font-semibold">
                                <i class="bx bx-time-five mr-2"></i>{{ service.duration }}
                            </div>
                            <div
                                class="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-lg">
                                <i class="bx bx-purchase-tag mr-2"></i>{{ service.priceRange }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="container mx-auto px-4 py-12">
            <div class="max-w-6xl mx-auto">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Left Column - Main Content -->
                    <div class="lg:col-span-2">
                        <!-- Tabs -->
                        <div
                            class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-6 overflow-hidden border border-gray-100 dark:border-gray-700">
                            <div class="flex border-b border-gray-200 dark:border-gray-700">
                                <button @click="activeTab = 'info'" :class="[
                                    'flex-1 px-6 py-4 font-bold text-lg transition-all duration-300',
                                    activeTab === 'info'
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                ]">
                                    <i class="bx bx-info-circle mr-2"></i>
                                    Thông Tin Dịch Vụ
                                </button>
                                <button @click="activeTab = 'reviews'" :class="[
                                    'flex-1 px-6 py-4 font-bold text-lg transition-all duration-300',
                                    activeTab === 'reviews'
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                ]">
                                    <i class="bx bx-message-square-dots mr-2"></i>
                                    Bình Luận ({{ service.reviews.length }})
                                </button>
                            </div>

                            <!-- Tab Content -->
                            <div class="p-8">
                                <!-- Info Tab -->
                                <div v-if="activeTab === 'info'" class="space-y-8">
                                    <!-- Highlights -->
                                    <div>
                                        <h3
                                            class="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                            <i class="bx bx-star text-yellow-500"></i>
                                            Điểm Nổi Bật
                                        </h3>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div v-for="(highlight, idx) in service.highlights" :key="idx"
                                                class="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 border border-blue-100 dark:border-gray-600">
                                                <svg class="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                                                    fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                                <span class="text-gray-700 dark:text-gray-300">{{ highlight }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Included -->
                                    <div>
                                        <h3
                                            class="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                            <i class="bx bx-check-circle text-green-500"></i>
                                            Bao Gồm
                                        </h3>
                                        <div class="space-y-2">
                                            <div v-for="(item, idx) in service.included" :key="idx"
                                                class="flex items-start gap-3 p-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200">
                                                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                                                    fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                                <span class="text-gray-700 dark:text-gray-300">{{ item }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Not Included -->
                                    <div>
                                        <h3
                                            class="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                            <i class="bx bx-x-circle text-red-500"></i>
                                            Không Bao Gồm
                                        </h3>
                                        <div class="space-y-2">
                                            <div v-for="(item, idx) in service.notIncluded" :key="idx"
                                                class="flex items-start gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200">
                                                <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                                                    fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                                <span class="text-gray-700 dark:text-gray-300">{{ item }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Reviews Tab -->
                                <div v-if="activeTab === 'reviews'" class="space-y-6">
                                    <div v-for="review in service.reviews" :key="review.id"
                                        class="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-700 border border-gray-200 dark:border-gray-600">
                                        <div class="flex items-start gap-4">
                                            <img :src="review.avatar" :alt="review.name"
                                                class="w-14 h-14 rounded-full border-4 border-white dark:border-gray-600 shadow-lg" />
                                            <div class="flex-1">
                                                <div class="flex items-center justify-between mb-2">
                                                    <h4 class="font-bold text-lg text-gray-800 dark:text-white">{{
                                                        review.name }}</h4>
                                                    <span class="text-sm text-gray-500 dark:text-gray-400">{{
                                                        review.date }}</span>
                                                </div>
                                                <div class="flex items-center gap-1 mb-3">
                                                    <i v-for="star in 5" :key="star" :class="[
                                                        'bx bxs-star text-xl',
                                                        star <= review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'
                                                    ]"></i>
                                                </div>
                                                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{
                                                    review.comment }}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Add Review CTA -->
                                    <div
                                        class="text-center p-8 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 border-2 border-dashed border-blue-300 dark:border-gray-600">
                                        <i
                                            class="bx bx-message-square-add text-5xl text-blue-600 dark:text-blue-400 mb-4"></i>
                                        <h4 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Bạn đã sử dụng
                                            dịch vụ này?</h4>
                                        <p class="text-gray-600 dark:text-gray-300 mb-4">Chia sẻ trải nghiệm của bạn để
                                            giúp người khác!</p>
                                        <button
                                            class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:scale-105 transition-transform duration-300 shadow-lg">
                                            Viết Đánh Giá
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column - Sidebar -->
                    <div class="lg:col-span-1">
                        <!-- Contact Card -->
                        <div
                            class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-6 border border-gray-100 dark:border-gray-700">
                            <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Liên Hệ Ngay
                            </h3>

                            <!-- Price -->
                            <div
                                class="text-center mb-6 p-4 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 border border-pink-200 dark:border-gray-600">
                                <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">Giá từ</div>
                                <div
                                    class="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                    {{ service.priceRange }}
                                </div>
                            </div>

                            <!-- Contact Buttons -->
                            <div class="space-y-3 mb-6">
                                <button @click="handleConsultation"
                                    class="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:scale-105 transition-transform duration-300 shadow-lg flex items-center justify-center gap-2">
                                    <i class="bx bx-conversation text-2xl"></i>
                                    <span>Liên Hệ Tư Vấn</span>
                                </button>
                                <button @click="handleCallNow"
                                    class="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition-transform duration-300 shadow-lg flex items-center justify-center gap-2">
                                    <i class="bx bx-phone-call text-2xl animate-pulse"></i>
                                    <span>{{ contactPhone }}</span>
                                </button>
                            </div>

                            <!-- Features List -->
                            <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h4 class="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                    <i class="bx bx-list-check text-blue-600 dark:text-blue-400"></i>
                                    Tính Năng Nổi Bật
                                </h4>
                                <div class="space-y-3">
                                    <div v-for="(feature, idx) in service.features" :key="idx"
                                        class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                        <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <span>{{ feature }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Trust Badges -->
                            <div class="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                                <div class="grid grid-cols-3 gap-3 text-center">
                                    <div>
                                        <i class="bx bx-shield-check text-3xl text-green-500 mb-1"></i>
                                        <div class="text-xs text-gray-600 dark:text-gray-400">Bảo hiểm</div>
                                    </div>
                                    <div>
                                        <i class="bx bx-support text-3xl text-blue-500 mb-1"></i>
                                        <div class="text-xs text-gray-600 dark:text-gray-400">24/7</div>
                                    </div>
                                    <div>
                                        <i class="bx bx-medal text-3xl text-yellow-500 mb-1"></i>
                                        <div class="text-xs text-gray-600 dark:text-gray-400">Uy tín</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Related Services -->
        <div class="bg-gradient-to-r from-gray-100 to-blue-100 dark:from-gray-800 dark:to-gray-900 py-16">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">Dịch Vụ Khác</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    <NuxtLink v-for="relatedService in services.filter(s => s.id !== service.id).slice(0, 3)"
                        :key="relatedService.id" :to="`/service/${relatedService.id}`"
                        class="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-transparent dark:border-gray-700">
                        <div class="relative h-48 overflow-hidden">
                            <img :src="relatedService.thumbnail" :alt="relatedService.title"
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div class="absolute bottom-4 left-4 right-4">
                                <h3 class="text-white font-bold text-lg line-clamp-2">{{ relatedService.shortTitle }}
                                </h3>
                            </div>
                        </div>
                        <div class="p-4">
                            <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ relatedService.duration }}
                            </div>
                            <div class="font-bold text-purple-600 dark:text-purple-400">{{ relatedService.priceRange }}
                            </div>
                        </div>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>

    <!-- Not Found -->
    <div v-else class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div class="text-center">
            <i class="bx bx-error-circle text-8xl text-red-500 mb-4"></i>
            <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">Không Tìm Thấy Dịch Vụ</h1>
            <p class="text-gray-600 dark:text-gray-400 mb-6">Dịch vụ bạn tìm kiếm không tồn tại</p>
            <NuxtLink to="/service"
                class="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:scale-105 transition-transform duration-300 shadow-lg">
                Quay Lại Danh Sách
            </NuxtLink>
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

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
