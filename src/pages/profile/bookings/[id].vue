<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';

definePageMeta({
    middleware: ['auth'],
});

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const localePath = useLocalePath();

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

const paymentStatusLabel = computed(() => {
    if (!booking.value) return '';
    return t(`profile.bookings.detailPage.paymentStatusValues.${booking.value.paymentStatus}`);
});

// Methods
const handleCancelBooking = async () => {
    ElMessageBox.confirm(
        t('profile.bookings.cancelConfirmMessage'),
        t('profile.bookings.cancelConfirmTitle'),
        {
            confirmButtonText: t('profile.bookings.cancelConfirmBtn'),
            cancelButtonText: t('profile.bookings.cancelKeepBtn'),
            type: 'warning',
        }
    ).then(async () => {
        await cancelMutation.mutateAsync(bookingId.value);
        router.push(localePath('/profile/bookings'));
    }).catch(() => {
        // User cancelled
    });
};
</script>

<template>
    <div class="shell booking-detail-page">
        <!-- Loading -->
        <p v-if="isLoading" class="booking-detail__loading" role="status" aria-live="polite">
            {{ t('profile.bookings.detailPage.loading') }}
        </p>

        <!-- Content -->
        <div v-else-if="booking" class="booking-detail">
            <div class="booking-detail__head">
                <NuxtLink :to="localePath('/profile/bookings')" class="booking-detail__back">
                    ← {{ t('profile.bookings.detailPage.backToList') }}
                </NuxtLink>

                <div class="booking-detail__title-row">
                    <div>
                        <h1 class="booking-detail__title">{{ t('profile.bookings.detailPage.title') }}</h1>
                        <p class="booking-detail__code">
                            {{ t('profile.bookings.detailPage.code') }}: <span>{{ booking.id }}</span>
                        </p>
                    </div>

                    <span class="status-label" :class="`status-label--${booking.status}`">
                        {{ t(`profile.bookings.status.${booking.status}`) }}
                    </span>
                </div>
            </div>

            <div class="booking-detail__layout">
                <!-- Nội dung chính -->
                <div class="booking-detail__main">
                    <section class="booking-detail__section" aria-labelledby="booking-tour-title">
                        <h2 id="booking-tour-title" class="booking-detail__section-title">
                            {{ t('profile.bookings.detailPage.tourInfo') }}
                        </h2>

                        <div class="booking-detail__tour">
                            <img :src="booking.tour.thumbnail" :alt="booking.tour.title" loading="lazy">
                            <div>
                                <h3 class="booking-detail__tour-title">{{ booking.tour.title }}</h3>
                                <dl class="booking-detail__facts">
                                    <div>
                                        <dt>{{ t('profile.bookings.detailPage.startDate') }}</dt>
                                        <dd>{{ formattedDate }}</dd>
                                    </div>
                                    <div>
                                        <dt>{{ t('profile.bookings.detailPage.numberOfPeople') }}</dt>
                                        <dd>{{ booking.numberOfPeople }}</dd>
                                    </div>
                                    <div>
                                        <dt>{{ t('profile.bookings.detailPage.duration') }}</dt>
                                        <dd>{{ booking.tour.duration }}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </section>

                    <section v-if="customerInfo" class="booking-detail__section" aria-labelledby="booking-customer-title">
                        <h2 id="booking-customer-title" class="booking-detail__section-title">
                            {{ t('profile.bookings.detailPage.customerInfo') }}
                        </h2>

                        <dl class="booking-detail__facts booking-detail__facts--grid">
                            <div>
                                <dt>{{ t('profile.bookings.detailPage.name') }}</dt>
                                <dd>{{ customerInfo.name }}</dd>
                            </div>
                            <div>
                                <dt>{{ t('profile.bookings.detailPage.email') }}</dt>
                                <dd>{{ customerInfo.email }}</dd>
                            </div>
                            <div>
                                <dt>{{ t('profile.bookings.detailPage.phone') }}</dt>
                                <dd>{{ customerInfo.phone }}</dd>
                            </div>
                            <div v-if="customerInfo.address">
                                <dt>{{ t('profile.bookings.detailPage.address') }}</dt>
                                <dd>{{ customerInfo.address }}</dd>
                            </div>
                        </dl>
                    </section>

                    <section v-if="booking.specialRequests" class="booking-detail__section"
                        aria-labelledby="booking-requests-title">
                        <h2 id="booking-requests-title" class="booking-detail__section-title">
                            {{ t('profile.bookings.detailPage.specialRequests') }}
                        </h2>
                        <p class="booking-detail__requests">{{ booking.specialRequests }}</p>
                    </section>
                </div>

                <!-- Thanh toán -->
                <aside class="booking-detail__aside">
                    <section class="booking-detail__section" aria-labelledby="booking-payment-title">
                        <h2 id="booking-payment-title" class="booking-detail__section-title">
                            {{ t('profile.bookings.detailPage.paymentSummary') }}
                        </h2>

                        <dl class="booking-detail__price">
                            <div>
                                <dt>{{ t('profile.bookings.detailPage.tourPrice') }}</dt>
                                <dd>{{ formatPrice(booking.tour.priceUsd) }}</dd>
                            </div>
                            <div>
                                <dt>{{ t('profile.bookings.detailPage.numberOfPeople') }}</dt>
                                <dd>× {{ booking.numberOfPeople }}</dd>
                            </div>
                            <div v-if="booking.discountAmount > 0">
                                <dt>{{ t('profile.bookings.detailPage.discount') }}</dt>
                                <dd>− {{ formatPrice(booking.discountAmount) }}</dd>
                            </div>
                            <div class="booking-detail__price-total">
                                <dt>{{ t('profile.bookings.detailPage.totalPrice') }}</dt>
                                <dd>{{ formatPrice(booking.totalPrice) }}</dd>
                            </div>
                        </dl>

                        <dl class="booking-detail__facts">
                            <div>
                                <dt>{{ t('profile.bookings.detailPage.paymentStatus') }}</dt>
                                <dd>{{ paymentStatusLabel }}</dd>
                            </div>
                            <div>
                                <dt>{{ t('profile.bookings.detailPage.paymentMethod') }}</dt>
                                <dd>{{ booking.paymentMethod.toUpperCase() }}</dd>
                            </div>
                        </dl>

                        <div v-if="canCancel" class="booking-detail__cancel">
                            <UiButton variant="outline" block :disabled="cancelMutation.isPending.value"
                                @click="handleCancelBooking">
                                {{ t('profile.bookings.cancel') }}
                            </UiButton>
                        </div>
                    </section>

                    <p class="booking-detail__created">
                        {{ t('profile.bookings.detailPage.createdAt', { date: dayjs(booking.createdAt).format('DD/MM/YYYY HH:mm') }) }}
                    </p>
                </aside>
            </div>
        </div>

        <!-- Not found -->
        <UiEmptyState v-else :title="t('profile.bookings.detailPage.notFoundTitle')"
            :description="t('profile.bookings.detailPage.notFoundDesc')">
            <UiButton :to="localePath('/profile/bookings')">{{ t('profile.bookings.detailPage.backToList') }}</UiButton>
        </UiEmptyState>
    </div>
</template>

<style scoped>
.booking-detail-page {
    padding-block: var(--space-page-top) var(--section-space);
}

.booking-detail__loading {
    padding-block: var(--space-block);
    color: var(--color-text-muted);
    text-align: center;
}

.booking-detail__back {
    display: inline-block;
    margin-bottom: var(--space-6);
    color: var(--color-text-muted);
    font-size: var(--text-ui);
    text-decoration: none;
}

.booking-detail__back:hover {
    color: var(--color-text);
}

.booking-detail__title-row {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-4);
    padding-bottom: var(--space-fluid-md);
    border-bottom: 1px solid var(--color-border-strong);
}

.booking-detail__title {
    font-family: var(--font-serif);
    font-size: var(--text-h3);
    font-weight: var(--weight-regular);
}

.booking-detail__code {
    margin-top: var(--space-2);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.booking-detail__code span {
    color: var(--color-text);
    overflow-wrap: anywhere;
}

.booking-detail__layout {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
    gap: var(--space-fluid-xl);
    align-items: start;
    margin-top: var(--space-fluid-lg);
}

@media (min-width: 64rem) {
    .booking-detail__layout {
        grid-template-columns: 2fr 1fr;
    }
}

.booking-detail__main {
    display: grid;
    gap: 0;
}

.booking-detail__section {
    padding-block: var(--space-fluid-md);
    border-bottom: 1px solid var(--color-border);
}

.booking-detail__main .booking-detail__section:first-child {
    padding-top: 0;
}

.booking-detail__aside .booking-detail__section {
    padding-top: 0;
    border-bottom: 0;
}

@media (min-width: 64rem) {
    .booking-detail__aside {
        position: sticky;
        top: calc(var(--header-height) + 1.5rem);
    }
}

.booking-detail__section-title {
    margin-bottom: var(--space-5);
    font-family: var(--font-serif);
    font-size: var(--text-title);
    font-weight: var(--weight-regular);
}

.booking-detail__tour {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-6);
}

.booking-detail__tour img {
    width: 9rem;
    aspect-ratio: 1 / 1;
    flex-shrink: 0;
    border-radius: var(--radius-md);
    object-fit: cover;
}

.booking-detail__tour-title {
    font-family: var(--font-serif);
    font-size: var(--text-title);
    font-weight: var(--weight-regular);
    line-height: var(--leading-snug);
}

.booking-detail__facts {
    display: grid;
    gap: var(--space-3);
    margin-top: var(--space-4);
}

.booking-detail__facts--grid {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
}

.booking-detail__facts dt {
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
}

.booking-detail__facts dd {
    margin-top: 0.125rem;
    font-size: var(--text-ui);
}

.booking-detail__requests {
    color: var(--color-text-muted);
    line-height: var(--leading-body);
}

.booking-detail__price {
    display: grid;
    gap: var(--space-2);
}

.booking-detail__price > div {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-4);
}

.booking-detail__price dt {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.booking-detail__price-total {
    padding-top: var(--space-3);
    margin-top: var(--space-2);
    border-top: 1px solid var(--color-border);
}

.booking-detail__price-total dt {
    color: var(--color-text);
    font-weight: var(--weight-medium);
}

.booking-detail__price-total dd {
    font-family: var(--font-serif);
    font-size: var(--text-2xl);
}

.booking-detail__aside .booking-detail__facts {
    padding-top: var(--space-4);
    margin-top: var(--space-4);
    border-top: 1px solid var(--color-border);
}

.booking-detail__cancel {
    margin-top: var(--space-6);
}

.booking-detail__cancel :deep(.ui-btn--outline) {
    border-color: var(--color-danger);
    color: var(--color-danger);
}

.booking-detail__cancel :deep(.ui-btn--outline:hover) {
    background: var(--color-danger);
    color: var(--color-on-accent);
}

.booking-detail__created {
    margin-top: var(--space-5);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

/* Nhãn trạng thái (dùng chung với trang danh sách) */
.status-label {
    display: inline-flex;
    flex-shrink: 0;
    padding: 0.25rem var(--space-3);
    border: 1px solid currentColor;
    border-radius: var(--radius-pill);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.status-label--pending {
    color: var(--color-warning);
}

.status-label--confirmed {
    color: var(--color-accent);
}

.status-label--completed {
    color: var(--color-success);
}

.status-label--cancelled {
    color: var(--color-danger);
}

.booking-detail__back:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}
</style>
