<script setup lang="ts">
import { ref } from 'vue';

type PaymentMethod = 'vnpay' | 'momo' | 'stripe' | 'cash';

interface PaymentOption {
    value: PaymentMethod;
    labelKey: string;
    descKey: string;
}

const props = defineProps<{
    modelValue: PaymentMethod;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: PaymentMethod): void;
}>();

const { t } = useI18n();

const paymentOptions: PaymentOption[] = [
    { value: 'vnpay', labelKey: 'booking.payment.methods.vnpay', descKey: 'booking.payment.methods.vnpayDesc' },
    { value: 'momo', labelKey: 'booking.payment.methods.momo', descKey: 'booking.payment.methods.momoDesc' },
    { value: 'stripe', labelKey: 'booking.payment.methods.stripe', descKey: 'booking.payment.methods.stripeDesc' },
    { value: 'cash', labelKey: 'booking.payment.methods.cash', descKey: 'booking.payment.methods.cashDesc' },
];

const selectedMethod = ref<PaymentMethod>(props.modelValue);

const selectMethod = (method: PaymentMethod) => {
    selectedMethod.value = method;
    emit('update:modelValue', method);
};
</script>

<template>
    <div class="payment-method-selector">
        <fieldset class="payment-fieldset">
            <legend class="visually-hidden">{{ t('booking.payment.title') }}</legend>

            <label v-for="option in paymentOptions" :key="option.value" class="payment-row"
                :class="{ 'is-selected': selectedMethod === option.value }">
                <input type="radio" name="booking-payment-method" class="payment-row__radio" :value="option.value"
                    :checked="selectedMethod === option.value" @change="selectMethod(option.value)">
                <span class="payment-row__text">
                    <span class="payment-row__label">{{ t(option.labelKey) }}</span>
                    <span class="payment-row__desc">{{ t(option.descKey) }}</span>
                </span>
            </label>
        </fieldset>

        <div v-if="selectedMethod && selectedMethod !== 'cash'" class="payment-info">
            <p class="payment-info__title">{{ t('booking.payment.infoTitle') }}</p>
            <p class="payment-info__text">
                {{ t('booking.payment.infoRedirect', { method: t(`booking.payment.methods.${selectedMethod}`) }) }}
            </p>
            <ul class="payment-info__list" role="list">
                <li>{{ t('booking.payment.infoSsl') }}</li>
                <li>{{ t('booking.payment.infoSecure') }}</li>
            </ul>
        </div>

        <div v-if="selectedMethod === 'cash'" class="payment-info">
            <p class="payment-info__title">{{ t('booking.payment.cashTitle') }}</p>
            <p class="payment-info__text">{{ t('booking.payment.cashInfo') }}</p>
            <ul class="payment-info__list" role="list">
                <li>{{ t('booking.payment.cashPrepare') }}</li>
                <li>{{ t('booking.payment.cashConfirm') }}</li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.payment-fieldset {
    display: grid;
    margin: 0;
    padding: 0;
    border: 0;
    border-top: 1px solid var(--color-border-strong);
}

.payment-row {
    display: flex;
    align-items: flex-start;
    gap: var(--space-4);
    padding: var(--space-5) var(--space-4);
    margin-inline: calc(-1 * var(--space-4));
    border-bottom: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color var(--transition-base);
}

.payment-row__radio {
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
    margin-top: 0.1875rem;
    accent-color: var(--color-accent);
}

.payment-row__radio:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}

.payment-row__text {
    min-width: 0;
}

.payment-row__label {
    display: block;
    font-family: var(--font-serif);
    font-size: var(--text-xl);
    transition: color var(--transition-base);
}

.payment-row__desc {
    display: block;
    margin-top: var(--space-1);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    line-height: var(--leading-body);
}

.payment-row.is-selected {
    background: var(--color-bg-subtle);
}

.payment-row.is-selected .payment-row__label {
    color: var(--color-accent);
}

.payment-info {
    margin-top: var(--space-6);
    padding-top: var(--space-6);
    border-top: 1px solid var(--color-border);
}

.payment-info__title {
    font-family: var(--font-serif);
    font-size: var(--text-lg);
}

.payment-info__text {
    margin-top: var(--space-2);
    max-width: 36rem;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    line-height: var(--leading-body);
}

.payment-info__list {
    display: grid;
    gap: var(--space-2);
    margin-top: var(--space-3);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}
</style>
