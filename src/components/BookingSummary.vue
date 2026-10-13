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

const { t } = useI18n();
const { formatPrice } = useCurrency();

const formattedDate = computed(() => {
    return dayjs(props.bookingData.startDate).format('DD/MM/YYYY');
});

const paymentMethodLabel = computed(() => t(`booking.payment.methods.${props.bookingData.paymentMethod}`));
</script>

<template>
    <div class="booking-confirm">
        <UiSectionHeading :title="t('booking.confirmStep.title')" :lead="t('booking.confirmStep.lead')" />

        <div class="booking-confirm__layout">
            <div class="booking-confirm__main">
                <!-- Tour Info -->
                <section class="confirm-block" aria-labelledby="confirm-trip-title">
                    <h3 id="confirm-trip-title" class="confirm-block__title">{{ t('booking.confirmStep.tripInfo') }}
                    </h3>

                    <div class="confirm-trip">
                        <img :src="tourData.thumbnail" :alt="tourData.title" class="confirm-trip__image" />
                        <div>
                            <p class="confirm-trip__name">{{ tourData.title }}</p>
                            <p class="confirm-trip__duration">{{ tourData.duration }}</p>
                        </div>
                    </div>

                    <dl class="confirm-dl">
                        <div>
                            <dt>{{ t('booking.confirmStep.startDate') }}</dt>
                            <dd>{{ formattedDate }}</dd>
                        </div>
                        <div>
                            <dt>{{ t('booking.confirmStep.people') }}</dt>
                            <dd>{{ t('booking.confirmStep.peopleCount', { count: bookingData.numberOfPeople }) }}
                            </dd>
                        </div>
                    </dl>
                </section>

                <!-- Customer Info -->
                <section v-if="bookingData.customerInfo" class="confirm-block" aria-labelledby="confirm-customer-title">
                    <h3 id="confirm-customer-title" class="confirm-block__title">
                        {{ t('booking.confirmStep.customerInfo') }}
                    </h3>

                    <dl class="confirm-dl">
                        <div>
                            <dt>{{ t('booking.confirmStep.fullName') }}</dt>
                            <dd>{{ bookingData.customerInfo.name }}</dd>
                        </div>
                        <div>
                            <dt>{{ t('booking.confirmStep.email') }}</dt>
                            <dd>{{ bookingData.customerInfo.email }}</dd>
                        </div>
                        <div>
                            <dt>{{ t('booking.confirmStep.phone') }}</dt>
                            <dd>{{ bookingData.customerInfo.phone }}</dd>
                        </div>
                        <div v-if="bookingData.customerInfo.address">
                            <dt>{{ t('booking.confirmStep.address') }}</dt>
                            <dd>{{ bookingData.customerInfo.address }}</dd>
                        </div>
                    </dl>
                </section>

                <!-- Special Requests -->
                <section v-if="bookingData.specialRequests" class="confirm-block"
                    aria-labelledby="confirm-requests-title">
                    <h3 id="confirm-requests-title" class="confirm-block__title">
                        {{ t('booking.confirmStep.specialRequests') }}
                    </h3>
                    <p class="confirm-block__text">{{ bookingData.specialRequests }}</p>
                </section>
            </div>

            <!-- Summary Sidebar -->
            <aside class="booking-confirm__aside">
                <dl class="confirm-summary">
                    <div>
                        <dt>{{ t('booking.summary.pricePerPerson') }}</dt>
                        <dd>{{ formatPrice(tourData.priceUsd) }}</dd>
                    </div>
                    <div>
                        <dt>{{ t('booking.summary.people') }}</dt>
                        <dd>&times; {{ bookingData.numberOfPeople }}</dd>
                    </div>
                    <div v-if="bookingData.voucherCode" class="confirm-summary__discount">
                        <dt>{{ t('booking.summary.discount') }}</dt>
                        <dd>&minus; {{ formatPrice(0) }}</dd>
                    </div>
                </dl>

                <div class="confirm-summary__total">
                    <span>{{ t('booking.summary.total') }}</span>
                    <span class="confirm-summary__amount">{{ formatPrice(totalPrice) }}</span>
                </div>

                <p class="confirm-summary__method">
                    <span>{{ t('booking.summary.paymentMethod') }}</span>
                    <strong>{{ paymentMethodLabel }}</strong>
                </p>

                <div class="confirm-summary__actions">
                    <UiButton block @click="emit('confirm')">{{ t('booking.confirmStep.confirmButton') }}</UiButton>
                    <UiButton variant="outline" block @click="emit('back')">{{ t('common.prevStep') }}</UiButton>
                </div>

                <p class="confirm-summary__terms">{{ t('booking.confirmStep.terms') }}</p>
            </aside>
        </div>
    </div>
</template>

<style scoped>
.booking-confirm__layout {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
    gap: var(--space-fluid-xl);
    align-items: start;
    margin-top: var(--space-fluid-md);
}

@media (min-width: 64rem) {
    .booking-confirm__layout {
        grid-template-columns: 2fr 1fr;
    }
}

.booking-confirm__main {
    display: grid;
    gap: var(--space-fluid-md);
}

.confirm-block {
    padding-top: var(--space-6);
    border-top: 1px solid var(--color-border);
}

.confirm-block__title {
    font-family: var(--font-serif);
    font-size: var(--text-title);
    font-weight: var(--weight-regular);
}

.confirm-trip {
    display: flex;
    gap: var(--space-4);
    margin-top: var(--space-4);
}

.confirm-trip__image {
    width: 6rem;
    height: 6rem;
    flex-shrink: 0;
    border-radius: var(--radius-md);
    object-fit: cover;
}

.confirm-trip__name {
    font-family: var(--font-serif);
    font-size: var(--text-lg);
}

.confirm-trip__duration {
    margin-top: var(--space-1);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.confirm-dl {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
    gap: var(--space-4);
    margin-top: var(--space-5);
    padding-top: var(--space-5);
    border-top: 1px solid var(--color-border);
}

.confirm-dl dt {
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.confirm-dl dd {
    margin-top: 0.375rem;
    font-family: var(--font-serif);
    font-size: var(--text-lg);
    overflow-wrap: anywhere;
}

.confirm-block__text {
    margin-top: var(--space-4);
    color: var(--color-text-muted);
    line-height: var(--leading-body);
}

.booking-confirm__aside {
    position: sticky;
    top: calc(var(--header-height) + 1.5rem);
    padding-top: var(--space-6);
    border-top: 1px solid var(--color-border-strong);
}

.confirm-summary>div {
    display: flex;
    justify-content: space-between;
    gap: var(--space-4);
    padding-block: var(--space-2);
    color: var(--color-text-muted);
}

.confirm-summary dd {
    color: var(--color-text);
    font-weight: var(--weight-medium);
}

.confirm-summary__discount {
    color: var(--color-success);
}

.confirm-summary__discount dd {
    color: var(--color-success);
}

.confirm-summary__total {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: var(--space-4);
    padding: var(--space-4) 0;
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
    font-family: var(--font-serif);
}

.confirm-summary__amount {
    font-size: var(--text-h3);
    color: var(--color-accent);
}

.confirm-summary__method {
    display: flex;
    justify-content: space-between;
    margin-top: var(--space-4);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.confirm-summary__actions {
    display: grid;
    gap: var(--space-3);
    margin-top: var(--space-6);
}

.confirm-summary__terms {
    margin-top: var(--space-5);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    line-height: var(--leading-body);
    text-align: center;
}
</style>
