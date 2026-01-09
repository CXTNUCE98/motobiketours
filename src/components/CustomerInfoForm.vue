<script setup lang="ts">
import { ref, computed } from 'vue';

interface CustomerInfo {
    name: string;
    email: string;
    phone: string;
    address?: string;
}

const props = defineProps<{
    initialData?: Partial<CustomerInfo>;
}>();

const emit = defineEmits<{
    (e: 'next', data: { customerInfo: CustomerInfo; specialRequests?: string }): void;
    (e: 'back'): void;
}>();

const { user } = useAuth();

// Form data
const form = ref<CustomerInfo>({
    name: props.initialData?.name || user.value?.userName || '',
    email: props.initialData?.email || user.value?.email || '',
    phone: props.initialData?.phone || '',
    address: props.initialData?.address || '',
});

const specialRequests = ref('');

// Validation
const errors = ref<Partial<Record<keyof CustomerInfo, string>>>({});

const validateForm = (): boolean => {
    errors.value = {};

    if (!form.value.name.trim()) {
        errors.value.name = 'Vui lòng nhập họ tên';
    }

    if (!form.value.email.trim()) {
        errors.value.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        errors.value.email = 'Email không hợp lệ';
    }

    if (!form.value.phone.trim()) {
        errors.value.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(form.value.phone.replace(/\s/g, ''))) {
        errors.value.phone = 'Số điện thoại không hợp lệ';
    }

    return Object.keys(errors.value).length === 0;
};

const handleNext = () => {
    if (!validateForm()) return;

    emit('next', {
        customerInfo: { ...form.value },
        specialRequests: specialRequests.value || undefined,
    });
};
</script>

<template>
    <div class="customer-info-form">
        <!-- Header -->
        <div class="mb-8">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Thông tin khách hàng
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
                Vui lòng điền đầy đủ thông tin liên hệ để chúng tôi có thể hỗ trợ bạn tốt nhất
            </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Form Section -->
            <div class="lg:col-span-2 space-y-6">
                <div class="card p-6 md:p-8">
                    <div class="space-y-6">
                        <!-- Full Name -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                <i class="bx bx-user text-blue-500 mr-2"></i>
                                Họ và tên
                                <span class="text-red-500">*</span>
                            </label>
                            <input v-model="form.name" type="text" placeholder="Nguyễn Văn A"
                                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                :class="{ 'border-red-500': errors.name }" />
                            <p v-if="errors.name" class="mt-2 text-sm text-red-500 flex items-center gap-1">
                                <i class="bx bx-error-circle"></i>
                                {{ errors.name }}
                            </p>
                        </div>

                        <!-- Email -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                <i class="bx bx-envelope text-blue-500 mr-2"></i>
                                Email
                                <span class="text-red-500">*</span>
                            </label>
                            <input v-model="form.email" type="email" placeholder="email@example.com"
                                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                :class="{ 'border-red-500': errors.email }" />
                            <p v-if="errors.email" class="mt-2 text-sm text-red-500 flex items-center gap-1">
                                <i class="bx bx-error-circle"></i>
                                {{ errors.email }}
                            </p>
                        </div>

                        <!-- Phone -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                <i class="bx bx-phone text-blue-500 mr-2"></i>
                                Số điện thoại
                                <span class="text-red-500">*</span>
                            </label>
                            <input v-model="form.phone" type="tel" placeholder="0901234567"
                                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                :class="{ 'border-red-500': errors.phone }" />
                            <p v-if="errors.phone" class="mt-2 text-sm text-red-500 flex items-center gap-1">
                                <i class="bx bx-error-circle"></i>
                                {{ errors.phone }}
                            </p>
                        </div>

                        <!-- Address -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                <i class="bx bx-map text-blue-500 mr-2"></i>
                                Địa chỉ
                                <span class="text-gray-400 text-xs ml-1">(Tùy chọn)</span>
                            </label>
                            <input v-model="form.address" type="text" placeholder="Số nhà, đường, quận/huyện, thành phố"
                                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                        </div>

                        <!-- Special Requests -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                <i class="bx bx-message-square-detail text-blue-500 mr-2"></i>
                                Yêu cầu đặc biệt
                                <span class="text-gray-400 text-xs ml-1">(Tùy chọn)</span>
                            </label>
                            <textarea v-model="specialRequests" rows="4"
                                placeholder="Ví dụ: Cần xe số tự động, muốn ngồi chỗ nào, có yêu cầu đặc biệt gì..."
                                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"></textarea>
                            <p class="mt-2 text-xs text-gray-500">
                                Chúng tôi sẽ cố gắng đáp ứng mọi yêu cầu của bạn
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Info Card -->
            <div class="lg:col-span-1 space-y-6">
                <!-- Tips Card -->
                <div
                    class="card p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-200 dark:border-amber-800">
                    <div class="flex items-start gap-3 mb-4">
                        <div class="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                            <i class="bx bx-info-circle text-white text-xl"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-900 dark:text-white mb-1">Lưu ý</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                Thông tin quan trọng
                            </p>
                        </div>
                    </div>

                    <ul class="space-y-3 text-sm">
                        <li class="flex items-start gap-2">
                            <i class="bx bx-check-circle text-green-500 mt-0.5"></i>
                            <span class="text-gray-700 dark:text-gray-300">
                                Email sẽ được dùng để gửi xác nhận booking
                            </span>
                        </li>
                        <li class="flex items-start gap-2">
                            <i class="bx bx-check-circle text-green-500 mt-0.5"></i>
                            <span class="text-gray-700 dark:text-gray-300">
                                Số điện thoại để liên hệ khi cần thiết
                            </span>
                        </li>
                        <li class="flex items-start gap-2">
                            <i class="bx bx-check-circle text-green-500 mt-0.5"></i>
                            <span class="text-gray-700 dark:text-gray-300">
                                Thông tin được bảo mật tuyệt đối
                            </span>
                        </li>
                    </ul>
                </div>

                <!-- Action Buttons -->
                <div class="space-y-3">
                    <button @click="handleNext" class="w-full btn-primary py-4 text-lg">
                        <span>Tiếp tục</span>
                        <i class="bx bx-right-arrow-alt text-xl ml-2"></i>
                    </button>

                    <button @click="emit('back')"
                        class="w-full px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold transition-all hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <i class="bx bx-left-arrow-alt text-xl mr-2"></i>
                        <span>Quay lại</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
