<script setup lang="ts">
import { ref } from 'vue';

type PaymentMethod = 'vnpay' | 'momo' | 'stripe' | 'cash';

interface PaymentOption {
    value: PaymentMethod;
    label: string;
    icon: string;
    description: string;
    color: string;
    badge?: string;
}

const props = defineProps<{
    modelValue: PaymentMethod;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: PaymentMethod): void;
}>();

const paymentOptions: PaymentOption[] = [
    {
        value: 'vnpay',
        label: 'VNPay',
        icon: 'bx-credit-card',
        description: 'Thanh toán qua VNPay - Hỗ trợ mọi ngân hàng',
        color: 'from-blue-500 to-cyan-500',
        badge: 'Phổ biến',
    },
    {
        value: 'momo',
        label: 'MoMo',
        icon: 'bx-wallet',
        description: 'Thanh toán qua ví điện tử MoMo',
        color: 'from-pink-500 to-rose-500',
        badge: 'Nhanh chóng',
    },
    {
        value: 'stripe',
        label: 'Stripe',
        icon: 'bxl-stripe',
        description: 'Thanh toán quốc tế qua Stripe',
        color: 'from-purple-500 to-indigo-500',
    },
    {
        value: 'cash',
        label: 'Tiền mặt',
        icon: 'bx-money',
        description: 'Thanh toán trực tiếp khi khởi hành',
        color: 'from-green-500 to-emerald-500',
    },
];

const selectedMethod = ref<PaymentMethod>(props.modelValue);

const selectMethod = (method: PaymentMethod) => {
    selectedMethod.value = method;
    emit('update:modelValue', method);
};
</script>

<template>
    <div class="payment-method-selector">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button v-for="option in paymentOptions" :key="option.value" @click="selectMethod(option.value)"
                class="payment-option relative p-6 rounded-2xl border-2 transition-all duration-300 text-left group"
                :class="{
                    'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/20':
                        selectedMethod === option.value,
                    'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md':
                        selectedMethod !== option.value,
                }">
                <!-- Selected Indicator -->
                <div v-if="selectedMethod === option.value"
                    class="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center animate-scale-in">
                    <i class="bx bx-check text-white text-xl"></i>
                </div>

                <!-- Badge -->
                <div v-if="option.badge"
                    class="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r text-white text-xs font-bold rounded-full"
                    :class="`bg-gradient-to-r ${option.color}`">
                    {{ option.badge }}
                </div>

                <!-- Icon -->
                <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all" :class="{
                    [`bg-gradient-to-br ${option.color} text-white`]: selectedMethod === option.value,
                    'bg-gray-100 dark:bg-gray-800 text-gray-500 group-hover:bg-gray-200 dark:group-hover:bg-gray-700':
                        selectedMethod !== option.value,
                }">
                    <i :class="`bx ${option.icon} text-3xl`"></i>
                </div>

                <!-- Content -->
                <div>
                    <h3 class="text-lg font-bold mb-2 transition-colors" :class="{
                        'text-blue-600 dark:text-blue-400': selectedMethod === option.value,
                        'text-gray-900 dark:text-white': selectedMethod !== option.value,
                    }">
                        {{ option.label }}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ option.description }}
                    </p>
                </div>

                <!-- Hover Effect -->
                <div class="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 transition-opacity pointer-events-none"
                    :class="`${option.color} group-hover:opacity-5`"></div>
            </button>
        </div>

        <!-- Payment Info -->
        <div v-if="selectedMethod && selectedMethod !== 'cash'"
            class="mt-6 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
            <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <i class="bx bx-info-circle text-white text-xl"></i>
                </div>
                <div class="flex-1">
                    <h4 class="font-bold text-gray-900 dark:text-white mb-2">Thông tin thanh toán</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Bạn sẽ được chuyển đến cổng thanh toán {{paymentOptions.find(o => o.value ===
                        selectedMethod)?.label }} để hoàn tất giao dịch.
                    </p>
                    <ul class="space-y-2 text-sm">
                        <li class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <i class="bx bx-check-circle text-green-500"></i>
                            <span>Giao dịch được mã hóa SSL</span>
                        </li>
                        <li class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <i class="bx bx-check-circle text-green-500"></i>
                            <span>Thông tin thanh toán được bảo mật tuyệt đối</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Cash Payment Info -->
        <div v-if="selectedMethod === 'cash'"
            class="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800">
            <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <i class="bx bx-money text-white text-xl"></i>
                </div>
                <div class="flex-1">
                    <h4 class="font-bold text-gray-900 dark:text-white mb-2">Thanh toán tiền mặt</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Bạn sẽ thanh toán trực tiếp cho hướng dẫn viên khi bắt đầu tour.
                    </p>
                    <ul class="space-y-2 text-sm">
                        <li class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <i class="bx bx-info-circle text-blue-500"></i>
                            <span>Vui lòng chuẩn bị đủ tiền mặt</span>
                        </li>
                        <li class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <i class="bx bx-info-circle text-blue-500"></i>
                            <span>Booking sẽ được xác nhận sau khi thanh toán</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
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

.animate-scale-in {
    animation: scale-in 0.5s ease-out;
}

.payment-option {
    position: relative;
    overflow: hidden;
}
</style>
