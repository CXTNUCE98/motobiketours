<script setup lang="ts">
// Dải bước đặt chỗ dạng tối giản: số thứ tự serif in nghiêng, bước hiện tại tô màu nhấn.
interface Step {
    number: number;
    titleKey: string;
}

const props = defineProps<{
    currentStep: number;
}>();

const { t } = useI18n();

const steps: Step[] = [
    { number: 1, titleKey: 'booking.steps.date' },
    { number: 2, titleKey: 'booking.steps.info' },
    { number: 3, titleKey: 'booking.steps.payment' },
    { number: 4, titleKey: 'booking.steps.confirm' },
];

const isStepCompleted = (stepNumber: number) => stepNumber < props.currentStep;
const isStepActive = (stepNumber: number) => stepNumber === props.currentStep;
const padNumber = (value: number) => String(value).padStart(2, '0');
</script>

<template>
    <nav class="booking-steps" :aria-label="t('booking.steps.ariaLabel')">
        <ol class="booking-steps__list" role="list">
            <li v-for="step in steps" :key="step.number" class="booking-steps__item" :class="{
                'is-active': isStepActive(step.number),
                'is-done': isStepCompleted(step.number),
            }" :aria-current="isStepActive(step.number) ? 'step' : undefined">
                <span class="booking-steps__index" aria-hidden="true">{{ padNumber(step.number) }}</span>
                <span class="booking-steps__label">{{ t(step.titleKey) }}</span>
            </li>
        </ol>
    </nav>
</template>

<style scoped>
.booking-steps__list {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: var(--space-2) var(--space-4);
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--color-border-strong);
}

.booking-steps__item {
    display: flex;
    align-items: baseline;
    gap: var(--space-2);
    color: var(--color-text-muted);
}

.booking-steps__item:not(:first-child)::before {
    content: '·';
    margin-right: var(--space-4);
    color: var(--color-border);
}

.booking-steps__index {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: var(--text-lg);
    font-variant-numeric: lining-nums tabular-nums;
}

.booking-steps__label {
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.booking-steps__item.is-done {
    color: var(--color-text);
}

.booking-steps__item.is-active {
    color: var(--color-accent);
}

.booking-steps__item.is-active .booking-steps__index {
    color: var(--color-accent);
}
</style>
