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

const { t } = useI18n();
const { formatPrice } = useCurrency();

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

// Disable past dates
const disabledDate = (date: Date) => {
    return date < new Date(new Date().setHours(0, 0, 0, 0));
};
</script>

<template>
    <div class="date-people-picker">
        <UiSectionHeading :title="t('booking.datePeople.title')" :lead="t('booking.datePeople.lead')" />

        <form class="date-people-layout" novalidate @submit.prevent="handleNext">
            <div class="date-people-layout__main">
                <UiField :label="t('booking.datePeople.calendarLabel')">
                    <template #default="{ id }">
                        <el-date-picker :id="id" v-model="selectedDate" type="date"
                            :placeholder="t('booking.datePeople.datePlaceholder')" :disabled-date="disabledDate"
                            size="large" format="DD/MM/YYYY" value-format="YYYY-MM-DD" />
                    </template>
                </UiField>

                <p v-if="selectedDate" class="date-people-layout__selected">
                    {{ t('booking.datePeople.selectedDate') }}: <strong>{{ formattedDate }}</strong>
                </p>

                <fieldset class="people-counter">
                    <legend>{{ t('booking.datePeople.peopleLabel') }}</legend>
                    <div class="people-counter__control">
                        <button type="button" class="people-counter__btn"
                            :disabled="numberOfPeople <= (minPeople || 1)"
                            :aria-label="t('booking.datePeople.decrease')" @click="decrementPeople">&minus;</button>
                        <span class="people-counter__value">
                            {{ numberOfPeople }}
                            <span class="people-counter__unit">{{ t('booking.datePeople.unit') }}</span>
                        </span>
                        <button type="button" class="people-counter__btn"
                            :disabled="maxPeople && numberOfPeople >= maxPeople"
                            :aria-label="t('booking.datePeople.increase')" @click="incrementPeople">+</button>
                    </div>
                    <p v-if="minPeople || maxPeople" class="people-counter__hint">
                        <span v-if="minPeople">{{ t('booking.datePeople.minPeople', { count: minPeople }) }}</span>
                        <span v-if="minPeople && maxPeople"> · </span>
                        <span v-if="maxPeople">{{ t('booking.datePeople.maxPeople', { count: maxPeople }) }}</span>
                    </p>
                </fieldset>
            </div>

            <aside class="date-people-layout__aside">
                <dl class="date-people-summary">
                    <div>
                        <dt>{{ t('booking.summary.pricePerPerson') }}</dt>
                        <dd>{{ formatPrice(pricePerPerson) }}</dd>
                    </div>
                    <div>
                        <dt>{{ t('booking.summary.people') }}</dt>
                        <dd>&times; {{ numberOfPeople }}</dd>
                    </div>
                </dl>

                <div class="date-people-summary__total">
                    <span>{{ t('booking.summary.total') }}</span>
                    <span class="date-people-summary__amount">{{ formatPrice(totalPrice) }}</span>
                </div>

                <UiButton type="submit" block :disabled="!canProceed">{{ t('common.nextStep') }}</UiButton>
            </aside>
        </form>
    </div>
</template>

<style scoped>
.date-people-layout {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
    gap: var(--space-fluid-xl);
    align-items: start;
    margin-top: var(--space-fluid-md);
}

@media (min-width: 64rem) {
    .date-people-layout {
        grid-template-columns: 3fr 2fr;
    }
}

.date-people-layout__main {
    display: grid;
    gap: var(--space-5);
}

.date-people-layout__selected {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.date-people-layout__selected strong {
    color: var(--color-text);
    font-family: var(--font-serif);
    font-size: var(--text-lg);
    font-style: normal;
}

.people-counter {
    margin: 0;
    padding: var(--space-5) 0 0;
    border: 0;
    border-top: 1px solid var(--color-border);
}

.people-counter legend {
    float: left;
    width: 100%;
    margin-bottom: var(--space-3);
    padding: 0;
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.people-counter legend+* {
    clear: both;
}

.people-counter__control {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 16rem;
}

.people-counter__btn {
    display: grid;
    place-items: center;
    width: 2.75rem;
    height: 2.75rem;
    flex-shrink: 0;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-pill);
    color: var(--color-text);
    font-family: var(--font-serif);
    font-size: var(--text-xl);
    line-height: 1;
    transition: border-color var(--transition-base), color var(--transition-base);
}

.people-counter__btn:hover:not(:disabled) {
    border-color: var(--color-accent);
    color: var(--color-accent);
}

.people-counter__btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.people-counter__btn:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}

.people-counter__value {
    font-family: var(--font-serif);
    font-size: var(--text-h3);
    font-variant-numeric: tabular-nums;
}

.people-counter__unit {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
}

.people-counter__hint {
    margin-top: var(--space-3);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.date-people-layout__aside {
    position: sticky;
    top: calc(var(--header-height) + 1.5rem);
    padding-top: var(--space-6);
    border-top: 1px solid var(--color-border-strong);
}

.date-people-summary>div {
    display: flex;
    justify-content: space-between;
    padding-block: var(--space-2);
    color: var(--color-text-muted);
}

.date-people-summary dd {
    color: var(--color-text);
    font-weight: var(--weight-medium);
}

.date-people-summary__total {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: var(--space-4);
    padding: var(--space-4) 0;
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
    font-family: var(--font-serif);
}

.date-people-summary__amount {
    font-size: var(--text-h3);
    color: var(--color-accent);
}

.date-people-layout__aside .ui-btn {
    margin-top: var(--space-6);
}

:deep(.el-date-editor) {
    width: 100%;
}
</style>
