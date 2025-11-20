<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    price: number | string;
    originalPrice?: number;
    duration: string;
    groupSize: string;
    difficulty?: string;
    tourId: string;
}>();

const isWishlisted = ref(false);

const toggleWishlist = () => {
    isWishlisted.value = !isWishlisted.value;
};

const handleBookNow = () => {
    // Navigate to contact or booking page
    window.location.href = '/contact';
};

const shareOn = (platform: string) => {
    const url = window.location.href;
    const title = document.title;

    const shareUrls: Record<string, string> = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
    };

    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
};

const formatPrice = (price: number | string) => {
    if (typeof price === 'string') return price;
    return new Intl.NumberFormat('vi-VN').format(price);
};
</script>

<template>
    <div class="bg-white rounded-2xl shadow-2xl p-6 sticky top-24 border-2 border-gray-100">
        <!-- Price Section -->
        <div class="mb-6 pb-6 border-b-2 border-gray-100">
            <div class="flex items-baseline gap-3 mb-2">
                <span
                    class="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                    {{ formatPrice(price) }}<span v-if="typeof price === 'number'"> ₫</span>
                </span>
                <span v-if="originalPrice" class="text-lg text-gray-400 line-through">
                    {{ formatPrice(originalPrice) }} ₫
                </span>
            </div>
            <p class="text-sm text-gray-500">Giá cho mỗi người</p>
        </div>

        <!-- Tour Highlights -->
        <div class="space-y-4 mb-6">
            <div class="flex items-center gap-3">
                <div
                    class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div class="flex-1">
                    <p class="text-xs text-gray-500">Thời gian</p>
                    <p class="text-sm font-semibold text-gray-800">{{ duration }}</p>
                </div>
            </div>

            <div class="flex items-center gap-3">
                <div
                    class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <div class="flex-1">
                    <p class="text-xs text-gray-500">Số lượng</p>
                    <p class="text-sm font-semibold text-gray-800">{{ groupSize }}</p>
                </div>
            </div>

            <div v-if="difficulty" class="flex items-center gap-3">
                <div
                    class="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <div class="flex-1">
                    <p class="text-xs text-gray-500">Độ khó</p>
                    <p class="text-sm font-semibold text-gray-800">{{ difficulty }}</p>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3 mb-6">
            <button @click="handleBookNow"
                class="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-3 group">
                <svg class="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span class="text-lg">Đặt Tour Ngay</span>
            </button>

            <button @click="toggleWishlist"
                class="w-full border-2 font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                :class="isWishlisted
                    ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-red-500 hover:bg-red-50 hover:text-red-600'">
                <svg class="w-5 h-5 transition-all duration-300" :fill="isWishlisted ? 'currentColor' : 'none'"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{{ isWishlisted ? 'Đã lưu' : 'Lưu tour' }}</span>
            </button>
        </div>

        <!-- Share Section -->
        <div class="pt-6 border-t-2 border-gray-100">
            <p class="text-sm font-semibold text-gray-700 mb-3">Chia sẻ tour này</p>
            <div class="flex gap-3">
                <button @click="shareOn('facebook')"
                    class="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-md">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                </button>
                <button @click="shareOn('twitter')"
                    class="flex-1 bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-md">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                </button>
                <button @click="shareOn('whatsapp')"
                    class="flex-1 bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-md">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Trust Badge -->
        <div class="mt-6 pt-6 border-t-2 border-gray-100">
            <div class="flex items-center gap-3 text-sm text-gray-600">
                <svg class="w-6 h-6 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd" />
                </svg>
                <div>
                    <p class="font-semibold text-gray-800">Đảm bảo hoàn tiền 100%</p>
                    <p class="text-xs text-gray-500">Hủy miễn phí trước 24h</p>
                </div>
            </div>
        </div>
    </div>
</template>
