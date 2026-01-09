<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import confetti from 'canvas-confetti';

const route = useRoute();
const router = useRouter();

const bookingId = ref(route.query.id as string);

// Trigger confetti animation
onMounted(() => {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
    });
});

const goToMyBookings = () => {
    router.push('/profile/bookings');
};

const goHome = () => {
    router.push('/');
};
</script>

<template>
    <div
        class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div class="max-w-2xl w-full">
            <!-- Success Animation -->
            <div class="text-center mb-8 fade-in-up">
                <div class="relative inline-block">
                    <div class="absolute inset-0 animate-ping bg-green-500/20 rounded-full"></div>
                    <div
                        class="relative w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/50">
                        <i class="bx bx-check text-white text-7xl animate-scale-in"></i>
                    </div>
                </div>

                <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    Đặt chỗ thành công!
                </h1>
                <p class="text-lg text-gray-600 dark:text-gray-400 mb-2">
                    Cảm ơn bạn đã tin tưởng và lựa chọn dịch vụ của chúng tôi
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
                    class="card p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800">
                    <div class="flex items-start gap-4">
                        <div class="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <i class="bx bx-envelope text-white text-2xl"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-900 dark:text-white mb-2">
                                Kiểm tra email
                            </h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                Chúng tôi đã gửi email xác nhận đặt chỗ và thông tin chi tiết chuyến đi tới hộp thư của
                                bạn
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    class="card p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800">
                    <div class="flex items-start gap-4">
                        <div
                            class="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                            <i class="bx bx-phone text-white text-2xl"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-900 dark:text-white mb-2">
                                Hỗ trợ 24/7
                            </h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                Nếu có bất kỳ thắc mắc nào, đừng ngần ngại liên hệ với chúng tôi qua hotline hoặc email
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Next Steps -->
            <div class="card p-8 mb-8 fade-in-up animation-delay-300">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <i class="bx bx-list-check text-blue-500"></i>
                    Các bước tiếp theo
                </h2>

                <div class="space-y-4">
                    <div class="flex items-start gap-4">
                        <div
                            class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center flex-shrink-0 font-bold">
                            1
                        </div>
                        <div class="flex-1">
                            <h3 class="font-bold text-gray-900 dark:text-white mb-1">
                                Kiểm tra thông tin
                            </h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                Xem lại thông tin booking trong email xác nhận
                            </p>
                        </div>
                    </div>

                    <div class="flex items-start gap-4">
                        <div
                            class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center flex-shrink-0 font-bold">
                            2
                        </div>
                        <div class="flex-1">
                            <h3 class="font-bold text-gray-900 dark:text-white mb-1">
                                Chuẩn bị hành trang
                            </h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                Đọc kỹ hướng dẫn chuẩn bị trong email để có trải nghiệm tốt nhất
                            </p>
                        </div>
                    </div>

                    <div class="flex items-start gap-4">
                        <div
                            class="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white flex items-center justify-center flex-shrink-0 font-bold">
                            3
                        </div>
                        <div class="flex-1">
                            <h3 class="font-bold text-gray-900 dark:text-white mb-1">
                                Sẵn sàng khởi hành
                            </h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                Đến điểm tập trung đúng giờ và sẵn sàng cho hành trình tuyệt vời!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 fade-in-up animation-delay-400">
                <button @click="goToMyBookings" class="btn-primary py-4 text-lg">
                    <i class="bx bx-list-ul text-xl mr-2"></i>
                    <span>Xem booking của tôi</span>
                </button>

                <button @click="goHome"
                    class="px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold transition-all hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <i class="bx bx-home text-xl mr-2"></i>
                    <span>Về trang chủ</span>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
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

@keyframes scale-in {
    0% {
        transform: scale(0);
    }

    50% {
        transform: scale(1.2);
    }

    100% {
        transform: scale(1);
    }
}

.fade-in-up {
    animation: fade-in-up 0.6s ease-out forwards;
}

.animation-delay-200 {
    animation-delay: 0.2s;
    opacity: 0;
}

.animation-delay-300 {
    animation-delay: 0.3s;
    opacity: 0;
}

.animation-delay-400 {
    animation-delay: 0.4s;
    opacity: 0;
}

.animate-scale-in {
    animation: scale-in 0.5s ease-out;
}
</style>
