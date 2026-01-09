<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';

definePageMeta({
    middleware: ['auth'],
});

const route = useRoute();
const router = useRouter();

const bookingId = computed(() => route.params.id as string);

// Fetch booking detail
const { data: booking, isLoading } = useBookingDetailQuery(bookingId.value);

const cancelMutation = useCancelBookingMutation();

const { formatPrice } = useCurrency();

// Computed
const formattedDate = computed(() => {
    if (!booking.value) return '';
    return dayjs(booking.value.startDate).format('DD/MM/YYYY');
});

const customerInfo = computed(() => {
    if (!booking.value?.customerInfo) return null;
    try {
        return typeof booking.value.customerInfo === 'string'
            ? JSON.parse(booking.value.customerInfo)
            : booking.value.customerInfo;
    } catch {
        return null;
    }
});

const canCancel = computed(() => {
    if (!booking.value) return false;
    const daysUntilStart = dayjs(booking.value.startDate).diff(dayjs(), 'day');
    return booking.value.status !== 'cancelled' &&
        booking.value.status !== 'completed' &&
        daysUntilStart > 1;
});

const statusConfig = {
    pending: {
        label: 'Chờ xác nhận',
        color: 'from-yellow-500 to-amber-500',
        textColor: 'text-yellow-700 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        icon: 'bx-time-five',
    },
    confirmed: {
        label: 'Đã xác nhận',
        color: 'from-blue-500 to-cyan-500',
        textColor: 'text-blue-700 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        icon: 'bx-check-circle',
    },
    completed: {
        label: 'Hoàn thành',
        color: 'from-green-500 to-emerald-500',
        textColor: 'text-green-700 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        icon: 'bx-check-double',
    },
    cancelled: {
        label: 'Đã hủy',
        color: 'from-red-500 to-pink-500',
        textColor: 'text-red-700 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        icon: 'bx-x-circle',
    },
};

// Methods
const handleCancelBooking = async () => {
    ElMessageBox.confirm(
        'Bạn có chắc chắn muốn hủy booking này? Hành động này không thể hoàn tác.',
        'Xác nhận hủy booking',
        {
            confirmButtonText: 'Hủy booking',
            cancelButtonText: 'Giữ lại',
            type: 'warning',
        }
    ).then(async () => {
        await cancelMutation.mutateAsync(bookingId.value);
        router.push('/profile/bookings');
    }).catch(() => {
        // User cancelled
    });
};
</script>

<template>
    <div class="booking-detail-page">
        <!-- Loading -->
        <div v-if="isLoading" class="flex items-center justify-center min-h-[400px]">
            <div class="text-center">
                <i class="bx bx-loader-alt animate-spin text-6xl text-blue-500 mb-4"></i>
                <p class="text-gray-600 dark:text-gray-400">Đang tải thông tin booking...</p>
            </div>
        </div>

        <!-- Content -->
        <div v-else-if="booking" class="max-w-5xl mx-auto">
            <!-- Header -->
            <div class="mb-8">
                <button @click="router.push('/profile/bookings')"
                    class="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4">
                    <i class="bx bx-arrow-back text-xl"></i>
                    <span>Quay lại danh sách</span>
                </button>

                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            Chi tiết booking
                        </h1>
                        <p class="text-gray-600 dark:text-gray-400">
                            Mã booking: <span class="font-mono font-bold">{{ booking.id }}</span>
                        </p>
                    </div>

                    <!-- Status Badge -->
                    <div class="inline-flex items-center gap-3 px-6 py-3 rounded-2xl"
                        :class="statusConfig[booking.status].bgColor">
                        <div class="w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-white"
                            :class="statusConfig[booking.status].color">
                            <i :class="`bx ${statusConfig[booking.status].icon} text-2xl`"></i>
                        </div>
                        <div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">Trạng thái</div>
                            <div class="font-bold" :class="statusConfig[booking.status].textColor">
                                {{ statusConfig[booking.status].label }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Main Info -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Tour Info -->
                    <div class="card p-6">
                        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <i class="bx bx-map text-blue-500 text-2xl"></i>
                            Thông tin chuyến đi
                        </h2>

                        <div class="flex gap-4 mb-6">
                            <img :src="booking.tour.thumbnail" :alt="booking.tour.title"
                                class="w-48 h-48 rounded-xl object-cover flex-shrink-0" />
                            <div class="flex-1">
                                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                    {{ booking.tour.title }}
                                </h3>
                                <div class="space-y-2">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <i class="bx bx-calendar text-blue-600 text-xl"></i>
                                        </div>
                                        <div>
                                            <div class="text-sm text-gray-500">Ngày khởi hành</div>
                                            <div class="font-bold text-gray-900 dark:text-white">{{ formattedDate }}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="flex items-center gap-3">
                                        <div
                                            class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                            <i class="bx bx-group text-purple-600 text-xl"></i>
                                        </div>
                                        <div>
                                            <div class="text-sm text-gray-500">Số người</div>
                                            <div class="font-bold text-gray-900 dark:text-white">{{
                                                booking.numberOfPeople }} người</div>
                                        </div>
                                    </div>

                                    <div class="flex items-center gap-3">
                                        <div
                                            class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                            <i class="bx bx-time-five text-green-600 text-xl"></i>
                                        </div>
                                        <div>
                                            <div class="text-sm text-gray-500">Thời gian</div>
                                            <div class="font-bold text-gray-900 dark:text-white">{{
                                                booking.tour.duration }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Customer Info -->
                    <div v-if="customerInfo" class="card p-6">
                        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <i class="bx bx-user text-blue-500 text-2xl"></i>
                            Thông tin khách hàng
                        </h2>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                <div class="text-sm text-gray-500 mb-1">Họ tên</div>
                                <div class="font-bold text-gray-900 dark:text-white">{{ customerInfo.name }}</div>
                            </div>

                            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                <div class="text-sm text-gray-500 mb-1">Email</div>
                                <div class="font-bold text-gray-900 dark:text-white">{{ customerInfo.email }}</div>
                            </div>

                            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                <div class="text-sm text-gray-500 mb-1">Số điện thoại</div>
                                <div class="font-bold text-gray-900 dark:text-white">{{ customerInfo.phone }}</div>
                            </div>

                            <div v-if="customerInfo.address" class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                <div class="text-sm text-gray-500 mb-1">Địa chỉ</div>
                                <div class="font-bold text-gray-900 dark:text-white">{{ customerInfo.address }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Special Requests -->
                    <div v-if="booking.specialRequests" class="card p-6">
                        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <i class="bx bx-message-square-detail text-blue-500 text-2xl"></i>
                            Yêu cầu đặc biệt
                        </h2>
                        <p class="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                            {{ booking.specialRequests }}
                        </p>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="space-y-6">
                    <!-- Price Summary -->
                    <div
                        class="card p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 sticky top-24">
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Chi tiết thanh toán</h3>

                        <div class="space-y-3 mb-6">
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600 dark:text-gray-400">Giá tour</span>
                                <span class="font-semibold text-gray-900 dark:text-white">
                                    {{ formatPrice(booking.tour.priceUsd) }}
                                </span>
                            </div>

                            <div class="flex justify-between items-center">
                                <span class="text-gray-600 dark:text-gray-400">Số người</span>
                                <span class="font-semibold text-gray-900 dark:text-white">
                                    × {{ booking.numberOfPeople }}
                                </span>
                            </div>

                            <div v-if="booking.discountAmount > 0"
                                class="flex justify-between items-center text-green-600">
                                <span>Giảm giá</span>
                                <span class="font-semibold">- {{ formatPrice(booking.discountAmount) }}</span>
                            </div>

                            <div class="h-px bg-gray-300 dark:bg-gray-600"></div>

                            <div class="flex justify-between items-center pt-2">
                                <span class="text-lg font-bold text-gray-900 dark:text-white">Tổng cộng</span>
                                <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {{ formatPrice(booking.totalPrice) }}
                                </span>
                            </div>
                        </div>

                        <!-- Payment Status -->
                        <div class="p-4 bg-white dark:bg-gray-800 rounded-xl mb-4">
                            <div class="text-sm text-gray-500 mb-1">Trạng thái thanh toán</div>
                            <div class="font-bold text-gray-900 dark:text-white">
                                {{ booking.paymentStatus === 'unpaid' ? 'Chưa thanh toán' :
                                    booking.paymentStatus === 'deposit_paid' ? 'Đã cọc' : 'Đã thanh toán' }}
                            </div>
                        </div>

                        <!-- Payment Method -->
                        <div class="p-4 bg-white dark:bg-gray-800 rounded-xl mb-6">
                            <div class="text-sm text-gray-500 mb-1">Phương thức thanh toán</div>
                            <div class="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <i class="bx bx-credit-card text-blue-500"></i>
                                {{ booking.paymentMethod.toUpperCase() }}
                            </div>
                        </div>

                        <!-- Action Button -->
                        <button v-if="canCancel" @click="handleCancelBooking" :disabled="cancelMutation.isPending.value"
                            class="w-full px-6 py-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <i class="bx bx-x-circle text-xl mr-2"></i>
                            <span>Hủy booking</span>
                        </button>
                    </div>

                    <!-- Created Date -->
                    <div class="card p-4 text-sm text-gray-600 dark:text-gray-400">
                        <div class="flex items-center gap-2">
                            <i class="bx bx-time"></i>
                            <span>Đặt ngày {{ dayjs(booking.createdAt).format('DD/MM/YYYY HH:mm') }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Error State -->
        <div v-else class="flex items-center justify-center min-h-[400px]">
            <div class="text-center">
                <i class="bx bx-error-circle text-6xl text-red-500 mb-4"></i>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Không tìm thấy booking
                </h2>
                <p class="text-gray-600 dark:text-gray-400 mb-6">
                    Booking này không tồn tại hoặc đã bị xóa
                </p>
                <button @click="router.push('/profile/bookings')" class="btn-primary">
                    Quay lại danh sách
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}
</style>
