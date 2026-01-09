<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';

const route = useRoute();
const router = useRouter();

const bookingId = ref(route.query.id as string);
const errorMessage = ref(route.query.message as string || 'Thanh toán không thành công');

const retryPayment = () => {
    if (bookingId.value) {
        router.push(`/profile/bookings/${bookingId.value}`);
    } else {
        router.push('/profile/bookings');
    }
};

const goHome = () => {
    router.push('/');
};

const goToMyBookings = () => {
    router.push('/profile/bookings');
};
</script>

<template>
    <div
        class="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div class="max-w-2xl w-full">
            <!-- Error Animation -->
            <div class="text-center mb-8 fade-in-up">
                <div class="relative inline-block">
                    <div class="absolute inset-0 animate-ping bg-red-500/20 rounded-full"></div>
                    <div
                        class="relative w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-red-500/50">
                        <i class="bx bx-x text-white text-7xl animate-scale-in"></i>
                    </div>
                </div>

                <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    Thanh toán thất bại
                </h1>
                <p class="text-lg text-gray-600 dark:text-gray-400 mb-2">
                    {{ errorMessage }}
                </p>
                <div v-if="bookingId"
                    class="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
                    <i class="bx bx-receipt"></i>
                    <span>Mã đặt chỗ: <span class="font-mono font-bold">{{ bookingId }}</span></span>
                </div>
            </div>

            <!-- Info Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 fade-in-up animation-delay-200">
                <div
                    class="card p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800">
                    <div class="flex items-start gap-4">
                        <div
                            class="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0">
                            <i class="bx bx-info-circle text-white text-2xl"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-900 dark:text-white mb-2">
                                Booking đã được tạo
                            </h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                Booking của bạn đã được ghi nhận. Bạn có thể thử thanh toán lại hoặc chọn phương thức
                                khác.
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    class="card p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800">
                    <div class="flex items-start gap-4">
                        <div class="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <i class="bx bx-support text-white text-2xl"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-900 dark:text-white mb-2">
                                Cần hỗ trợ?
                            </h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                Liên hệ với đội ngũ hỗ trợ của chúng tôi nếu bạn gặp bất kỳ vấn đề nào.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Common Issues -->
            <div class="card p-6 mb-8 fade-in-up animation-delay-300">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <i class="bx bx-error-circle text-red-500"></i>
                    Nguyên nhân có thể
                </h3>
                <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li class="flex items-start gap-2">
                        <i class="bx bx-chevron-right text-red-500 mt-0.5"></i>
                        <span>Không đủ số dư trong tài khoản thanh toán</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <i class="bx bx-chevron-right text-red-500 mt-0.5"></i>
                        <span>Thông tin thẻ/tài khoản không chính xác</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <i class="bx bx-chevron-right text-red-500 mt-0.5"></i>
                        <span>Kết nối mạng không ổn định</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <i class="bx bx-chevron-right text-red-500 mt-0.5"></i>
                        <span>Phiên giao dịch đã hết hạn</span>
                    </li>
                </ul>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 fade-in-up animation-delay-400">
                <button @click="retryPayment"
                    class="flex-1 btn-primary py-4 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                    <i class="bx bx-refresh text-xl"></i>
                    <span>Thử thanh toán lại</span>
                </button>
                <button @click="goToMyBookings"
                    class="flex-1 btn-secondary py-4 flex items-center justify-center gap-2">
                    <i class="bx bx-list-ul text-xl"></i>
                    <span>Xem booking của tôi</span>
                </button>
                <button @click="goHome" class="btn-secondary py-4 flex items-center justify-center gap-2 px-6">
                    <i class="bx bx-home text-xl"></i>
                    <span>Về trang chủ</span>
                </button>
            </div>

            <!-- Help Contact -->
            <div class="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 fade-in-up animation-delay-500">
                <p>Cần hỗ trợ khẩn cấp?</p>
                <p class="mt-1">
                    Gọi hotline:
                    <a href="tel:1900xxxx" class="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                        1900 xxxx
                    </a>
                    hoặc email:
                    <a href="mailto:support@motobiketours.com"
                        class="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                        support@motobiketours.com
                    </a>
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes scale-in {
    0% {
        transform: scale(0) rotate(-180deg);
    }

    50% {
        transform: scale(1.2) rotate(0deg);
    }

    100% {
        transform: scale(1) rotate(0deg);
    }
}

.animate-scale-in {
    animation: scale-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes fade-in-up {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in-up {
    animation: fade-in-up 0.6s ease-out;
}

.animation-delay-200 {
    animation-delay: 0.2s;
    animation-fill-mode: both;
}

.animation-delay-300 {
    animation-delay: 0.3s;
    animation-fill-mode: both;
}

.animation-delay-400 {
    animation-delay: 0.4s;
    animation-fill-mode: both;
}

.animation-delay-500 {
    animation-delay: 0.5s;
    animation-fill-mode: both;
}
</style>
