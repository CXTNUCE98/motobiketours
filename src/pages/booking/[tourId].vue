<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { CreateBookingDto } from '~/types/booking';
import BookingSteps from '~/components/BookingSteps.vue';
import DatePeoplePicker from '~/components/DatePeoplePicker.vue';
import CustomerInfoForm from '~/components/CustomerInfoForm.vue';
import PaymentMethodSelector from '~/components/PaymentMethodSelector.vue';
import BookingSummary from '~/components/BookingSummary.vue';
import { useTourByIdQuery } from '~/composables/useToursQuery';

definePageMeta({
    middleware: ['auth'],
});

const route = useRoute();
const router = useRouter();
const { isAuthenticated } = useAuth();
const { formatPrice } = useCurrency();
const { t } = useI18n();
const localePath = useLocalePath();

// Get tour ID from route
const tourId = computed(() => route.params.tourId as string);

// Fetch tour data (light mode — only need price, title, thumbnail)
const { data: tourData, isLoading: isLoadingTour } = useTourByIdQuery(tourId, { light: true });

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
        ElMessage.warning(t('booking.loginRequired'));
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
    <div class="booking-page">
        <!-- Loading State -->
        <div v-if="isLoadingTour" class="booking-page__status shell">
            <p>{{ t('booking.loadingTour') }}</p>
        </div>

        <!-- Main Content -->
        <template v-else-if="tourData">
            <header class="booking-head">
                <div class="shell">
                    <UiEyebrow>{{ t('booking.heroEyebrow') }}</UiEyebrow>
                    <h1 class="booking-head__title">
                        {{ t('booking.heroTitleBase') }}
                        <em>{{ t('booking.heroEmphasis') }}</em>
                    </h1>
                    <p class="booking-head__intro">{{ t('booking.heroIntro') }}</p>
                </div>
            </header>

            <div class="shell booking-steps-wrap">
                <BookingSteps :current-step="currentStep" />
            </div>

            <div class="shell booking-body">
                <!-- Step 1: Date & People -->
                <div v-show="currentStep === 1">
                    <DatePeoplePicker :tour-id="tourId" :price-per-person="tourData.priceUsd" :min-people="1"
                        :max-people="20" @next="handleDatePeopleNext" />
                </div>

                <!-- Step 2: Customer Info -->
                <div v-show="currentStep === 2">
                    <CustomerInfoForm :initial-data="bookingData.customerInfo" @next="handleCustomerInfoNext"
                        @back="handleBack" />
                </div>

                <!-- Step 3: Payment Method -->
                <div v-show="currentStep === 3" class="booking-layout">
                    <div class="booking-layout__main">
                        <UiSectionHeading :title="t('booking.payment.title')" :lead="t('booking.payment.lead')" />
                        <PaymentMethodSelector v-model="bookingData.paymentMethod!" />
                    </div>

                    <aside class="booking-layout__aside">
                        <div class="booking-total">
                            <p class="booking-total__label">{{ t('booking.summary.total') }}</p>
                            <p class="booking-total__amount">{{ formatPrice(totalPrice) }}</p>

                            <div class="booking-total__actions">
                                <UiButton block @click="handlePaymentNext">{{ t('common.nextStep') }}</UiButton>
                                <UiButton variant="outline" block @click="handleBack">{{ t('common.prevStep')
                                    }}</UiButton>
                            </div>
                        </div>
                    </aside>
                </div>

                <!-- Step 4: Confirm -->
                <div v-show="currentStep === 4">
                    <BookingSummary :booking-data="bookingData as CreateBookingDto" :tour-data="tourData"
                        :total-price="totalPrice" @back="handleBack" @confirm="handleConfirm" />
                </div>
            </div>

            <!-- Loading Overlay for Booking Submission -->
            <div v-if="createBookingMutation.isPending.value" class="booking-overlay" role="status" aria-live="polite">
                <div class="booking-overlay__box">
                    <p class="booking-overlay__title">{{ t('booking.processingTitle') }}</p>
                    <p class="booking-overlay__desc">{{ t('booking.processingDesc') }}</p>
                </div>
            </div>
        </template>

        <!-- Error State -->
        <div v-else class="booking-page__status shell">
            <UiEmptyState :title="t('booking.tourNotFound')" :description="t('booking.tourNotFoundDesc')">
                <UiButton :to="localePath('/tour')">{{ t('booking.backToTours') }}</UiButton>
            </UiEmptyState>
        </div>
    </div>
</template>

<style scoped>
.booking-page__status {
    display: grid;
    place-items: center;
    min-height: 50vh;
    text-align: center;
    color: var(--color-text-muted);
}

.booking-head {
    padding-block: var(--space-fluid-lg) var(--space-fluid-md);
}

.booking-head__title {
    font-family: var(--font-serif);
    font-size: var(--text-h3);
    font-weight: var(--weight-regular);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
}

.booking-head__title em {
    color: var(--color-accent);
    font-style: italic;
}

.booking-head__intro {
    max-width: 36rem;
    margin-top: var(--space-3);
    color: var(--color-text-muted);
    font-size: var(--text-lead);
    line-height: var(--leading-body);
}

.booking-steps-wrap {
    padding-bottom: var(--space-fluid-md);
}

.booking-body {
    padding-bottom: var(--section-space);
}

.booking-layout {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
    gap: var(--space-fluid-xl);
    align-items: start;
}

@media (min-width: 64rem) {
    .booking-layout {
        grid-template-columns: 2fr 1fr;
    }
}

.booking-layout__aside {
    position: sticky;
    top: calc(var(--header-height) + 1.5rem);
}

.booking-total {
    padding-top: var(--space-6);
    border-top: 1px solid var(--color-border-strong);
}

.booking-total__label {
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.booking-total__amount {
    margin-top: var(--space-2);
    font-family: var(--font-serif);
    font-size: var(--text-h3);
    color: var(--color-accent);
}

.booking-total__actions {
    display: grid;
    gap: var(--space-3);
    margin-top: var(--space-6);
}

.booking-overlay {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: grid;
    place-items: center;
    padding: var(--space-6);
    background: var(--color-backdrop);
}

.booking-overlay__box {
    max-width: 24rem;
    width: 100%;
    padding: var(--space-8);
    border-radius: var(--radius-lg);
    background: var(--color-surface);
    text-align: center;
}

.booking-overlay__title {
    font-family: var(--font-serif);
    font-size: var(--text-title);
}

.booking-overlay__desc {
    margin-top: var(--space-2);
    color: var(--color-text-muted);
}
</style>
