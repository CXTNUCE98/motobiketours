<script setup lang="ts">
import { ref, computed } from 'vue';
import dayjs from 'dayjs';

const props = defineProps<{
    tourId: string;
    minPeople?: number;
    maxPeople?: number;
    pricePerPerson: number;
}>();

const emit = defineEmits<{
    (e: 'next', data: { startDate: string; numberOfPeople: number }): void;
}>();

// State
const selectedDate = ref<Date | null>(null);
const numberOfPeople = ref(props.minPeople || 1);

// Computed
const totalPrice = computed(() => props.pricePerPerson * numberOfPeople.value);

const formattedDate = computed(() => {
    if (!selectedDate.value) return '';
    return dayjs(selectedDate.value).format('DD/MM/YYYY');
});

const canProceed = computed(() => selectedDate.value !== null);

// Methods
const incrementPeople = () => {
    if (!props.maxPeople || numberOfPeople.value < props.maxPeople) {
        numberOfPeople.value++;
    }
};

const decrementPeople = () => {
    if (numberOfPeople.value > (props.minPeople || 1)) {
        numberOfPeople.value--;
    }
};

const handleNext = () => {
    if (!canProceed.value) return;

    emit('next', {
        startDate: dayjs(selectedDate.value).format('YYYY-MM-DD'),
        numberOfPeople: numberOfPeople.value,
    });
};

const { formatPrice } = useCurrency();

// Disable past dates
const disabledDate = (date: Date) => {
    return date < new Date(new Date().setHours(0, 0, 0, 0));
};
</script>

<template>
    <div class="date-people-picker">
        <!-- Header -->
        <div class="mb-8">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Chọn ngày khởi hành
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
                Chọn ngày bạn muốn bắt đầu hành trình và số người tham gia
            </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <!-- Calendar Section -->
            <div class="lg:col-span-3">
                <div class="card p-6">
                    <div class="flex items-center gap-2 mb-4">
                        <i class="bx bx-calendar text-2xl text-blue-500"></i>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Chọn ngày</h3>
                    </div>

                    <el-date-picker v-model="selectedDate" type="date" placeholder="Chọn ngày khởi hành"
                        :disabled-date="disabledDate" class="w-full" size="large" format="DD/MM/YYYY"
                        value-format="YYYY-MM-DD" />

                    <div v-if="selectedDate" class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                <i class="bx bx-check text-2xl"></i>
                            </div>
                            <div>
                                <div class="text-sm text-gray-600 dark:text-gray-400">Ngày đã chọn</div>
                                <div class="text-lg font-bold text-gray-900 dark:text-white">
                                    {{ formattedDate }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- People Counter & Summary -->
            <div class="lg:col-span-2 space-y-6">
                <!-- People Counter -->
                <div class="card p-6">
                    <div class="flex items-center gap-2 mb-4">
                        <i class="bx bx-group text-2xl text-purple-500"></i>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Số người</h3>
                    </div>

                    <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <button @click="decrementPeople"
                            class="w-12 h-12 rounded-full bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            :disabled="numberOfPeople <= (minPeople || 1)">
                            <i class="bx bx-minus text-xl text-gray-700 dark:text-gray-300"></i>
                        </button>

                        <div class="text-center">
                            <div class="text-4xl font-bold text-gray-900 dark:text-white">
                                {{ numberOfPeople }}
                            </div>
                            <div class="text-sm text-gray-500 mt-1">người</div>
                        </div>

                        <button @click="incrementPeople"
                            class="w-12 h-12 rounded-full bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            :disabled="maxPeople && numberOfPeople >= maxPeople">
                            <i class="bx bx-plus text-xl text-gray-700 dark:text-gray-300"></i>
                        </button>
                    </div>

                    <div v-if="minPeople || maxPeople" class="mt-3 text-sm text-gray-500 text-center">
                        <span v-if="minPeople">Tối thiểu: {{ minPeople }} người</span>
                        <span v-if="minPeople && maxPeople"> • </span>
                        <span v-if="maxPeople">Tối đa: {{ maxPeople }} người</span>
                    </div>
                </div>

                <!-- Price Summary -->
                <div
                    class="card p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Tổng quan</h3>

                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600 dark:text-gray-400">Giá / người</span>
                            <span class="font-semibold text-gray-900 dark:text-white">
                                {{ formatPrice(pricePerPerson) }}
                            </span>
                        </div>

                        <div class="flex justify-between items-center">
                            <span class="text-gray-600 dark:text-gray-400">Số người</span>
                            <span class="font-semibold text-gray-900 dark:text-white">
                                × {{ numberOfPeople }}
                            </span>
                        </div>

                        <div class="h-px bg-gray-300 dark:bg-gray-600"></div>

                        <div class="flex justify-between items-center pt-2">
                            <span class="text-lg font-bold text-gray-900 dark:text-white">Tổng cộng</span>
                            <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {{ formatPrice(totalPrice) }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Next Button -->
                <button @click="handleNext" :disabled="!canProceed"
                    class="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                    <span>Tiếp tục</span>
                    <i class="bx bx-right-arrow-alt text-xl ml-2"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
:deep(.el-date-picker) {
    width: 100%;
}
</style>
