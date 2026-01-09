<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { CreateBookingDto } from '~/types/booking';
import BookingSteps from '~/components/BookingSteps.vue';
import DatePeoplePicker from '~/components/DatePeoplePicker.vue';
import CustomerInfoForm from '~/components/CustomerInfoForm.vue';
import PaymentMethodSelector from '~/components/PaymentMethodSelector.vue';
import BookingSummary from '~/components/BookingSummary.vue';

definePageMeta({
    middleware: ['auth'],
});

const route = useRoute();
const router = useRouter();
const { isAuthenticated } = useAuth();
const { formatPrice } = useCurrency();

// Get tour ID from route
const tourId = computed(() => route.params.tourId as string);

// Fetch tour data
const { data: tourData, isLoading: isLoadingTour } = useTourQuery(tourId.value);

// Booking state
const currentStep = ref(1);
const bookingData = ref<Partial<CreateBookingDto>>({
    tourId: tourId.value,
    paymentMethod: 'vnpay',
});

const totalPrice = computed(() => {
    if (!tourData.value || !bookingData.value.numberOfPeople) return 0;
    return tourData.value.priceUsd * bookingData.value.numberOfPeople;
});

// Mutation for creating booking
const createBookingMutation = useCreateBookingMutation();

// Step handlers
const handleDatePeopleNext = (data: { startDate: string; numberOfPeople: number }) => {
    bookingData.value.startDate = data.startDate;
    bookingData.value.numberOfPeople = data.numberOfPeople;
    currentStep.value = 2;
    scrollToTop();
};

const handleCustomerInfoNext = (data: { customerInfo: any; specialRequests?: string }) => {
    bookingData.value.customerInfo = data.customerInfo;
    bookingData.value.specialRequests = data.specialRequests;
    currentStep.value = 3;
    scrollToTop();
};

const handlePaymentNext = () => {
    currentStep.value = 4;
    scrollToTop();
};

const handleBack = () => {
    if (currentStep.value > 1) {
        currentStep.value--;
        scrollToTop();
    }
};

const handleConfirm = async () => {
    if (!isAuthenticated.value) {
        ElMessage.warning('Vui lòng đăng nhập để đặt tour');
        router.push('/login');
        return;
    }

    try {
        await createBookingMutation.mutateAsync(bookingData.value as CreateBookingDto);
        // Success message & redirect handled by mutation
    } catch (error) {
        console.error('Booking error:', error);
    }
};

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Redirect if not authenticated
onMounted(() => {
    if (!isAuthenticated.value) {
        router.push(`/login?redirect=/booking/${tourId.value}`);
    }
});
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <!-- Loading State -->
        <div v-if="isLoadingTour" class="flex items-center justify-center min-h-screen">
            <div class="text-center">
                <i class="bx bx-loader-alt animate-spin text-6xl text-blue-500 mb-4"></i>
                <p class="text-gray-600 dark:text-gray-400">Đang tải thông tin tour...</p>
            </div>
        </div>

        <!-- Main Content -->
        <div v-else-if="tourData" class="container mx-auto px-4 py-8 md:py-12">
            <!-- Page Header -->
            <div class="mb-8 text-center fade-in-up">
                <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    Đặt chỗ của bạn
                </h1>
                <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Chỉ còn vài bước nữa là bạn có thể bắt đầu hành trình khám phá tuyệt vời!
                </p>
            </div>

            <!-- Stepper -->
            <div class="mb-12 fade-in-up animation-delay-200">
                <BookingSteps :currentStep="currentStep" />
            </div>

            <!-- Steps Content -->
            <div class="max-w-7xl mx-auto">
                <!-- Step 1: Date & People -->
                <div v-show="currentStep === 1" class="fade-in-up animation-delay-300">
                    <DatePeoplePicker :tour-id="tourId" :price-per-person="tourData.priceUsd" :min-people="1"
                        :max-people="20" @next="handleDatePeopleNext" />
                </div>

                <!-- Step 2: Customer Info -->
                <div v-show="currentStep === 2" class="fade-in-up animation-delay-300">
                    <CustomerInfoForm :initial-data="bookingData.customerInfo" @next="handleCustomerInfoNext"
                        @back="handleBack" />
                </div>

                <!-- Step 3: Payment Method -->
                <div v-show="currentStep === 3" class="fade-in-up animation-delay-300">
                    <div class="mb-8">
                        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                            Phương thức thanh toán
                        </h2>
                        <p class="text-gray-600 dark:text-gray-400">
                            Chọn phương thức thanh toán phù hợp với bạn
                        </p>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div class="lg:col-span-2">
                            <div class="card p-6 md:p-8">
                                <PaymentMethodSelector v-model="bookingData.paymentMethod!" />
                            </div>
                        </div>

                        <div class="space-y-6">
                            <!-- Price Summary -->
                            <div
                                class="card p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800">
                                <h3 class="font-bold text-gray-900 dark:text-white mb-4">Tổng cộng</h3>
                                <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">
                                    {{ formatPrice(totalPrice) }}
                                </div>

                                <div class="space-y-3">
                                    <button @click="handlePaymentNext" class="w-full btn-primary py-4 text-lg">
                                        <span>Tiếp tục</span>
                                        <i class="bx bx-right-arrow-alt text-xl ml-2"></i>
                                    </button>

                                    <button @click="handleBack"
                                        class="w-full px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold transition-all hover:border-gray-400">
                                        <i class="bx bx-left-arrow-alt text-xl mr-2"></i>
                                        <span>Quay lại</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Step 4: Confirm -->
                <div v-show="currentStep === 4" class="fade-in-up animation-delay-300">
                    <BookingSummary :booking-data="bookingData as CreateBookingDto" :tour-data="tourData"
                        :total-price="totalPrice" @back="handleBack" @confirm="handleConfirm" />
                </div>
            </div>

            <!-- Loading Overlay for Booking Submission -->
            <div v-if="createBookingMutation.isPending.value"
                class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 text-center">
                    <i class="bx bx-loader-alt animate-spin text-6xl text-blue-500 mb-4"></i>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Đang xử lý đặt chỗ...
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400">
                        Vui lòng không tắt trang này
                    </p>
                </div>
            </div>
        </div>

        <!-- Error State -->
        <div v-else class="flex items-center justify-center min-h-screen">
            <div class="text-center">
                <i class="bx bx-error-circle text-6xl text-red-500 mb-4"></i>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Không tìm thấy tour
                </h2>
                <p class="text-gray-600 dark:text-gray-400 mb-6">
                    Tour bạn đang tìm không tồn tại hoặc đã bị xóa
                </p>
                <button @click="router.push('/tours')" class="btn-primary">
                    <i class="bx bx-home mr-2"></i>
                    Quay về trang chủ
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

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}
</style>
