<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { CONTACT_INFO } from '~/constants/contact';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const bookingId = ref(route.query.id as string);
const errorMessage = computed(() => (route.query.message as string) || t('booking.failed.defaultMessage'));

const retryPayment = () => {
    if (bookingId.value) {
        router.push(`/profile/bookings/${bookingId.value}`);
    } else {
        router.push('/profile/bookings');
    }
};

const goHome = () => {
    router.push('/');
};

const goToMyBookings = () => {
    router.push('/profile/bookings');
};
</script>

<template>
    <div class="booking-result shell">
        <div class="booking-result__inner">
            <UiEyebrow>{{ t('booking.failed.eyebrow') }}</UiEyebrow>
            <h1 class="booking-result__title booking-result__title--danger">
                {{ t('booking.failed.titleBase') }} <em>{{ t('booking.failed.emphasis') }}</em>
            </h1>
            <p class="booking-result__lead">{{ errorMessage }}</p>
            <p v-if="bookingId" class="booking-result__code">
                {{ t('booking.failed.bookingCode') }}: <strong>{{ bookingId }}</strong>
            </p>

            <div class="booking-result__info">
                <div>
                    <h2>{{ t('booking.failed.createdTitle') }}</h2>
                    <p>{{ t('booking.failed.createdDesc') }}</p>
                </div>
                <div>
                    <h2>{{ t('booking.failed.helpTitle') }}</h2>
                    <p>{{ t('booking.failed.helpDesc') }}</p>
                </div>
            </div>

            <section class="booking-result__steps" aria-labelledby="failed-reasons-title">
                <h2 id="failed-reasons-title" class="booking-result__steps-title">
                    {{ t('booking.failed.reasonsTitle') }}
                </h2>
                <ul class="reason-list" role="list">
                    <li>{{ t('booking.failed.reason1') }}</li>
                    <li>{{ t('booking.failed.reason2') }}</li>
                    <li>{{ t('booking.failed.reason3') }}</li>
                    <li>{{ t('booking.failed.reason4') }}</li>
                </ul>
            </section>

            <div class="booking-result__actions booking-result__actions--three">
                <UiButton block @click="retryPayment">{{ t('booking.failed.retry') }}</UiButton>
                <UiButton variant="outline" block @click="goToMyBookings">{{ t('booking.failed.viewBookings')
                    }}</UiButton>
                <UiButton variant="ghost" block @click="goHome">{{ t('booking.failed.backHome') }}</UiButton>
            </div>

            <p class="booking-result__help">
                {{ t('booking.failed.urgentHelp') }}<br>
                {{ t('booking.failed.callHotline') }}:
                <a :href="CONTACT_INFO.phoneHref">{{ CONTACT_INFO.phoneIntl }}</a>
                {{ t('booking.failed.orEmail') }}
                <a :href="`mailto:${CONTACT_INFO.email}`">{{ CONTACT_INFO.email }}</a>
            </p>
        </div>
    </div>
</template>

<style scoped>
.booking-result {
    display: grid;
    place-items: center;
    min-height: calc(100vh - var(--header-height));
    padding-block: var(--space-fluid-xl);
}

.booking-result__inner {
    width: 100%;
    max-width: 40rem;
    text-align: center;
}

.booking-result__title {
    font-family: var(--font-serif);
    font-size: var(--text-h2);
    font-weight: var(--weight-regular);
    line-height: var(--leading-tight);
}

.booking-result__title em {
    color: var(--color-accent);
    font-style: italic;
}

.booking-result__title--danger em {
    color: var(--color-danger);
}

.booking-result__lead {
    margin-top: var(--space-4);
    color: var(--color-text-muted);
    font-size: var(--text-lead);
    line-height: var(--leading-body);
}

.booking-result__code {
    margin-top: var(--space-4);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.booking-result__code strong {
    color: var(--color-text);
    font-family: var(--font-serif);
    font-variant-numeric: tabular-nums;
}

.booking-result__info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
    gap: var(--space-fluid-md);
    margin-top: var(--space-fluid-lg);
    padding-top: var(--space-6);
    border-top: 1px solid var(--color-border);
    text-align: left;
}

.booking-result__info h2 {
    font-family: var(--font-serif);
    font-size: var(--text-lg);
    font-weight: var(--weight-regular);
}

.booking-result__info p {
    margin-top: var(--space-2);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    line-height: var(--leading-body);
}

.booking-result__steps {
    margin-top: var(--space-fluid-lg);
    padding-top: var(--space-6);
    border-top: 1px solid var(--color-border);
    text-align: left;
}

.booking-result__steps-title {
    font-family: var(--font-serif);
    font-size: var(--text-title);
    font-weight: var(--weight-regular);
}

.reason-list {
    display: grid;
    margin-top: var(--space-4);
}

.reason-list li {
    padding-block: var(--space-3);
    border-bottom: 1px solid var(--color-border);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.booking-result__actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
    gap: var(--space-3);
    margin-top: var(--space-fluid-lg);
}

.booking-result__help {
    margin-top: var(--space-fluid-md);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    line-height: var(--leading-body);
}

.booking-result__help a {
    color: var(--color-text);
    font-weight: var(--weight-medium);
    text-decoration: underline;
    text-decoration-color: var(--color-border);
    text-underline-offset: 0.2em;
}

.booking-result__help a:hover {
    text-decoration-color: var(--color-accent);
}
</style>
