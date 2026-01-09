<script setup lang="ts">
import { computed } from 'vue';
import type { CreateBookingDto } from '~/types/booking';
import dayjs from 'dayjs';

const props = defineProps<{
    bookingData: CreateBookingDto;
    tourData: any;
    totalPrice: number;
}>();

const emit = defineEmits<{
    (e: 'back'): void;
    (e: 'confirm'): void;
}>();

const { formatPrice } = useCurrency();

const formattedDate = computed(() => {
    return dayjs(props.bookingData.startDate).format('DD/MM/YYYY');
});

const paymentMethodLabel = computed(() => {
    const methods = {
        vnpay: 'VNPay',
        momo: 'MoMo',
        stripe: 'Stripe',
        cash: 'Tiền mặt',
    };
    return methods[props.bookingData.paymentMethod] || props.bookingData.paymentMethod;
});
</script>

<template>
    <div class="booking-summary">
        <!-- Header -->
        <div class="mb-8">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Xác nhận đặt chỗ
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
                Vui lòng kiểm tra lại thông tin trước khi xác nhận
            </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Details Section -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Tour Info -->
                <div class="card p-6">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <i class="bx bx-map text-blue-500 text-2xl"></i>
                        Thông tin chuyến đi
                    </h3>

                    <div class="space-y-4">
                        <div class="flex gap-4">
                            <img :src="tourData.thumbnail" :alt="tourData.title"
                                class="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
                            <div class="flex-1">
                                <h4 class="font-bold text-gray-900 dark:text-white mb-1">
                                    {{ tourData.title }}
                                </h4>
                                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <i class="bx bx-time-five"></i>
                                    <span>{{ tourData.duration }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div>
                                <div class="text-sm text-gray-500 mb-1">Ngày khởi hành</div>
                                <div class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <i class="bx bx-calendar text-blue-500"></i>
                                    {{ formattedDate }}
                                </div>
                            </div>
                            <div>
                                <div class="text-sm text-gray-500 mb-1">Số người</div>
                                <div class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <i class="bx bx-group text-purple-500"></i>
                                    {{ bookingData.numberOfPeople }} người
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Customer Info -->
                <div class="card p-6">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <i class="bx bx-user text-blue-500 text-2xl"></i>
                        Thông tin khách hàng
                    </h3>

                    <div v-if="bookingData.customerInfo" class="space-y-3">
                        <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <i class="bx bx-user text-gray-500"></i>
                            <div class="flex-1">
                                <div class="text-xs text-gray-500">Họ tên</div>
                                <div class="font-semibold text-gray-900 dark:text-white">
                                    {{ bookingData.customerInfo?.name }}
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <i class="bx bx-envelope text-gray-500"></i>
                            <div class="flex-1">
                                <div class="text-xs text-gray-500">Email</div>
                                <div class="font-semibold text-gray-900 dark:text-white">
                                    {{ bookingData.customerInfo?.email }}
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <i class="bx bx-phone text-gray-500"></i>
                            <div class="flex-1">
                                <div class="text-xs text-gray-500">Số điện thoại</div>
                                <div class="font-semibold text-gray-900 dark:text-white">
                                    {{ bookingData.customerInfo?.phone }}
                                </div>
                            </div>
                        </div>

                        <div v-if="bookingData.customerInfo?.address"
                            class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <i class="bx bx-map text-gray-500"></i>
                            <div class="flex-1">
                                <div class="text-xs text-gray-500">Địa chỉ</div>
                                <div class="font-semibold text-gray-900 dark:text-white">
                                    {{ bookingData.customerInfo?.address }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Special Requests -->
                <div v-if="bookingData.specialRequests" class="card p-6">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <i class="bx bx-message-square-detail text-blue-500 text-2xl"></i>
                        Yêu cầu đặc biệt
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                        {{ bookingData.specialRequests }}
                    </p>
                </div>
            </div>

            <!-- Summary Sidebar -->
            <div class="lg:col-span-1 space-y-6">
                <!-- Price Summary -->
                <div
                    class="card p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 sticky top-24">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Tổng quan thanh toán</h3>

                    <div class="space-y-3 mb-6">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600 dark:text-gray-400">Giá tour</span>
                            <span class="font-semibold text-gray-900 dark:text-white">
                                {{ formatPrice(tourData.priceUsd) }}
                            </span>
                        </div>

                        <div class="flex justify-between items-center">
                            <span class="text-gray-600 dark:text-gray-400">Số người</span>
                            <span class="font-semibold text-gray-900 dark:text-white">
                                × {{ bookingData.numberOfPeople }}
                            </span>
                        </div>

                        <div v-if="bookingData.voucherCode" class="flex justify-between items-center text-green-600">
                            <span>Giảm giá</span>
                            <span class="font-semibold">- {{ formatPrice(0) }}</span>
                        </div>

                        <div class="h-px bg-gray-300 dark:bg-gray-600"></div>

                        <div class="flex justify-between items-center pt-2">
                            <span class="text-lg font-bold text-gray-900 dark:text-white">Tổng cộng</span>
                            <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {{ formatPrice(totalPrice) }}
                            </span>
                        </div>
                    </div>

                    <!-- Payment Method -->
                    <div class="p-4 bg-white dark:bg-gray-800 rounded-xl mb-6">
                        <div class="text-sm text-gray-500 mb-1">Phương thức thanh toán</div>
                        <div class="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <i class="bx bx-credit-card text-blue-500"></i>
                            {{ paymentMethodLabel }}
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="space-y-3">
                        <button @click="emit('confirm')" class="w-full btn-primary py-4 text-lg">
                            <i class="bx bx-check-circle text-xl mr-2"></i>
                            <span>Xác nhận đặt chỗ</span>
                        </button>

                        <button @click="emit('back')"
                            class="w-full px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold transition-all hover:border-gray-400 dark:hover:border-gray-500">
                            <i class="bx bx-left-arrow-alt text-xl mr-2"></i>
                            <span>Quay lại</span>
                        </button>
                    </div>

                    <!-- Terms -->
                    <p class="mt-6 text-xs text-gray-500 text-center">
                        Bằng việc xác nhận, bạn đồng ý với
                        <a href="#" class="text-blue-500 hover:underline">Điều khoản dịch vụ</a>
                        và
                        <a href="#" class="text-blue-500 hover:underline">Chính sách bảo mật</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
