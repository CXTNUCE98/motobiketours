<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';

interface Step {
    number: number;
    title: string;
    icon: string;
    path: string;
}

const props = defineProps<{
    currentStep: number;
}>();

const router = useRouter();
const route = useRoute();

const steps: Step[] = [
    { number: 1, title: 'Chọn ngày', icon: 'bx-calendar', path: 'date' },
    { number: 2, title: 'Thông tin', icon: 'bx-user', path: 'info' },
    { number: 3, title: 'Thanh toán', icon: 'bx-credit-card', path: 'payment' },
    { number: 4, title: 'Xác nhận', icon: 'bx-check-circle', path: 'confirm' },
];

const isStepCompleted = (stepNumber: number) => stepNumber < props.currentStep;
const isStepActive = (stepNumber: number) => stepNumber === props.currentStep;
</script>

<template>
    <div class="booking-steps-container">
        <!-- Desktop Stepper -->
        <div class="stepper-desktop hidden md:flex items-center justify-between max-w-4xl mx-auto">
            <template v-for="(step, index) in steps" :key="step.number">
                <div class="step-item flex-1 relative">
                    <div class="flex flex-col items-center">
                        <!-- Step Circle -->
                        <div class="step-circle w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 transform"
                            :class="{
                                'bg-gradient-to-br from-blue-500 to-cyan-500 text-white scale-110 shadow-lg shadow-blue-500/50':
                                    isStepActive(step.number),
                                'bg-gradient-to-br from-green-500 to-emerald-500 text-white':
                                    isStepCompleted(step.number),
                                'bg-gray-200 dark:bg-gray-700 text-gray-400': !isStepActive(step.number) && !isStepCompleted(step.number),
                            }">
                            <i v-if="isStepCompleted(step.number)" class="bx bx-check text-3xl animate-scale-in"></i>
                            <i v-else :class="`bx ${step.icon} text-2xl`"></i>
                        </div>

                        <!-- Step Label -->
                        <div class="mt-3 text-center">
                            <div class="text-sm font-bold transition-colors" :class="{
                                'text-blue-600 dark:text-blue-400': isStepActive(step.number),
                                'text-green-600 dark:text-green-400': isStepCompleted(step.number),
                                'text-gray-500 dark:text-gray-400': !isStepActive(step.number) && !isStepCompleted(step.number),
                            }">
                                {{ step.title }}
                            </div>
                            <div class="text-xs text-gray-400 mt-1">Bước {{ step.number }}</div>
                        </div>
                    </div>
                </div>

                <!-- Connector Line -->
                <div v-if="index < steps.length - 1" class="flex-1 h-1 mx-4 rounded-full transition-all duration-500"
                    :class="{
                        'bg-gradient-to-r from-green-500 to-emerald-500': isStepCompleted(step.number),
                        'bg-gray-200 dark:bg-gray-700': !isStepCompleted(step.number),
                    }"></div>
            </template>
        </div>

        <!-- Mobile Stepper -->
        <div class="stepper-mobile md:hidden">
            <div class="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <div class="flex items-center gap-3">
                    <div
                        class="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                        <i :class="`bx ${steps[currentStep - 1].icon} text-xl`"></i>
                    </div>
                    <div>
                        <div class="text-sm font-bold text-gray-900 dark:text-white">
                            {{ steps[currentStep - 1].title }}
                        </div>
                        <div class="text-xs text-gray-500">Bước {{ currentStep }} / {{ steps.length }}</div>
                    </div>
                </div>

                <!-- Progress Bar -->
                <div class="text-sm font-bold text-blue-600">
                    {{ Math.round((currentStep / steps.length) * 100) }}%
                </div>
            </div>

            <!-- Mini Progress Bar -->
            <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-3 overflow-hidden">
                <div class="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 rounded-full"
                    :style="{ width: `${(currentStep / steps.length) * 100}%` }"></div>
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
</style>
