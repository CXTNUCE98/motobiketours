<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const bookingId = ref(route.query.id as string);

const goToMyBookings = () => {
    router.push('/profile/bookings');
};

const goHome = () => {
    router.push('/');
};
</script>

<template>
    <div class="booking-result shell">
        <div class="booking-result__inner">
            <UiEyebrow>{{ t('booking.success.eyebrow') }}</UiEyebrow>
            <h1 class="booking-result__title">
                {{ t('booking.success.titleBase') }} <em>{{ t('booking.success.emphasis') }}</em>
            </h1>
            <p class="booking-result__lead">{{ t('booking.success.lead') }}</p>
            <p v-if="bookingId" class="booking-result__code">
                {{ t('booking.success.bookingCode') }}: <strong>{{ bookingId }}</strong>
            </p>

            <div class="booking-result__info">
                <div>
                    <h2>{{ t('booking.success.checkEmailTitle') }}</h2>
                    <p>{{ t('booking.success.checkEmailDesc') }}</p>
                </div>
                <div>
                    <h2>{{ t('booking.success.supportTitle') }}</h2>
                    <p>{{ t('booking.success.supportDesc') }}</p>
                </div>
            </div>

            <section class="booking-result__steps" aria-labelledby="next-steps-title">
                <h2 id="next-steps-title" class="booking-result__steps-title">
                    {{ t('booking.success.nextStepsTitle') }}
                </h2>
                <ol class="next-steps" role="list">
                    <li>
                        <span class="next-steps__index" aria-hidden="true">01</span>
                        <div>
                            <p class="next-steps__title">{{ t('booking.success.step1Title') }}</p>
                            <p class="next-steps__desc">{{ t('booking.success.step1Desc') }}</p>
                        </div>
                    </li>
                    <li>
                        <span class="next-steps__index" aria-hidden="true">02</span>
                        <div>
                            <p class="next-steps__title">{{ t('booking.success.step2Title') }}</p>
                            <p class="next-steps__desc">{{ t('booking.success.step2Desc') }}</p>
                        </div>
                    </li>
                    <li>
                        <span class="next-steps__index" aria-hidden="true">03</span>
                        <div>
                            <p class="next-steps__title">{{ t('booking.success.step3Title') }}</p>
                            <p class="next-steps__desc">{{ t('booking.success.step3Desc') }}</p>
                        </div>
                    </li>
                </ol>
            </section>

            <div class="booking-result__actions">
                <UiButton block @click="goToMyBookings">{{ t('booking.success.viewBookings') }}</UiButton>
                <UiButton variant="outline" block @click="goHome">{{ t('booking.success.backHome') }}</UiButton>
            </div>
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

.next-steps {
    display: grid;
    gap: var(--space-5);
    margin-top: var(--space-5);
}

.next-steps li {
    display: flex;
    gap: var(--space-4);
}

.next-steps__index {
    flex-shrink: 0;
    color: var(--color-accent);
    font-family: var(--font-serif);
    font-style: italic;
    font-size: var(--text-xl);
    font-variant-numeric: lining-nums tabular-nums;
}

.next-steps__title {
    font-weight: var(--weight-medium);
}

.next-steps__desc {
    margin-top: var(--space-1);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    line-height: var(--leading-body);
}

.booking-result__actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
    gap: var(--space-3);
    margin-top: var(--space-fluid-lg);
}
</style>
