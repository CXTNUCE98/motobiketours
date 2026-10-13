<script setup lang="ts">
import { ref } from 'vue';

interface CustomerInfo {
    name: string;
    email: string;
    phone: string;
    address?: string;
}

const props = defineProps<{
    initialData?: Partial<CustomerInfo>;
}>();

const emit = defineEmits<{
    (e: 'next', data: { customerInfo: CustomerInfo; specialRequests?: string }): void;
    (e: 'back'): void;
}>();

const { user } = useAuth();
const { t } = useI18n();

// Form data
const form = ref<CustomerInfo>({
    name: props.initialData?.name || user.value?.userName || '',
    email: props.initialData?.email || user.value?.email || '',
    phone: props.initialData?.phone || '',
    address: props.initialData?.address || '',
});

const specialRequests = ref('');

// Validation
const errors = ref<Partial<Record<keyof CustomerInfo, string>>>({});

const validateForm = (): boolean => {
    errors.value = {};

    if (!form.value.name.trim()) {
        errors.value.name = t('booking.customerInfo.validation.nameRequired');
    }

    if (!form.value.email.trim()) {
        errors.value.email = t('booking.customerInfo.validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        errors.value.email = t('booking.customerInfo.validation.emailInvalid');
    }

    if (!form.value.phone.trim()) {
        errors.value.phone = t('booking.customerInfo.validation.phoneRequired');
    } else if (!/^[0-9]{10,11}$/.test(form.value.phone.replace(/\s/g, ''))) {
        errors.value.phone = t('booking.customerInfo.validation.phoneInvalid');
    }

    return Object.keys(errors.value).length === 0;
};

const handleNext = () => {
    if (!validateForm()) return;

    emit('next', {
        customerInfo: { ...form.value },
        specialRequests: specialRequests.value || undefined,
    });
};
</script>

<template>
    <div class="customer-info-form">
        <UiSectionHeading :title="t('booking.customerInfo.title')" :lead="t('booking.customerInfo.lead')" />

        <form class="customer-info-form__layout" novalidate @submit.prevent="handleNext">
            <div class="customer-form">
                <UiField :label="t('booking.customerInfo.fullName')" :error="errors.name">
                    <template #default="{ id, describedBy, invalid }">
                        <input :id="id" v-model="form.name" type="text" class="ui-control" autocomplete="name"
                            :placeholder="t('booking.customerInfo.fullNamePlaceholder')"
                            :aria-describedby="describedBy" :aria-invalid="invalid">
                    </template>
                </UiField>

                <UiField :label="t('booking.customerInfo.email')" :error="errors.email">
                    <template #default="{ id, describedBy, invalid }">
                        <input :id="id" v-model="form.email" type="email" class="ui-control" autocomplete="email"
                            :placeholder="t('booking.customerInfo.emailPlaceholder')"
                            :aria-describedby="describedBy" :aria-invalid="invalid">
                    </template>
                </UiField>

                <UiField :label="t('booking.customerInfo.phone')" :error="errors.phone">
                    <template #default="{ id, describedBy, invalid }">
                        <input :id="id" v-model="form.phone" type="tel" class="ui-control" autocomplete="tel"
                            :placeholder="t('booking.customerInfo.phonePlaceholder')" :aria-describedby="describedBy"
                            :aria-invalid="invalid">
                    </template>
                </UiField>

                <UiField :label="`${t('booking.customerInfo.address')} ${t('booking.customerInfo.addressOptional')}`">
                    <template #default="{ id }">
                        <input :id="id" v-model="form.address" type="text" class="ui-control"
                            autocomplete="address-line1" :placeholder="t('booking.customerInfo.addressPlaceholder')">
                    </template>
                </UiField>

                <UiField class="customer-form__wide"
                    :label="`${t('booking.customerInfo.specialRequests')} ${t('booking.customerInfo.addressOptional')}`">
                    <template #default="{ id }">
                        <textarea :id="id" v-model="specialRequests" rows="4" class="ui-control"
                            :placeholder="t('booking.customerInfo.specialRequestsPlaceholder')"></textarea>
                    </template>
                </UiField>
                <p class="customer-form__hint">{{ t('booking.customerInfo.specialRequestsHint') }}</p>
            </div>

            <aside class="customer-info-form__aside">
                <div class="customer-tips">
                    <p class="customer-tips__title">{{ t('booking.customerInfo.tipsTitle') }}</p>
                    <ul role="list">
                        <li>{{ t('booking.customerInfo.tip1') }}</li>
                        <li>{{ t('booking.customerInfo.tip2') }}</li>
                        <li>{{ t('booking.customerInfo.tip3') }}</li>
                    </ul>
                </div>

                <div class="customer-info-form__actions">
                    <UiButton type="submit" block>{{ t('common.nextStep') }}</UiButton>
                    <UiButton type="button" variant="outline" block @click="emit('back')">{{ t('common.prevStep')
                        }}</UiButton>
                </div>
            </aside>
        </form>
    </div>
</template>

<style scoped>
.customer-info-form__layout {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
    gap: var(--space-fluid-xl);
    align-items: start;
    margin-top: var(--space-fluid-md);
}

@media (min-width: 64rem) {
    .customer-info-form__layout {
        grid-template-columns: 3fr 2fr;
    }
}

.customer-form {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
    gap: var(--space-6) var(--space-5);
}

.customer-form__wide {
    grid-column: 1 / -1;
}

.customer-form__hint {
    grid-column: 1 / -1;
    margin-top: calc(-1 * var(--space-4));
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.customer-tips {
    padding-top: var(--space-2);
}

.customer-tips__title {
    padding-bottom: var(--space-3);
    border-bottom: 1px solid var(--color-border-strong);
    font-family: var(--font-serif);
    font-size: var(--text-xl);
}

.customer-tips ul {
    display: grid;
    gap: 0;
    margin-top: var(--space-4);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    line-height: var(--leading-body);
}

.customer-tips li {
    padding-block: var(--space-3);
    border-bottom: 1px solid var(--color-border);
}

.customer-info-form__actions {
    display: grid;
    gap: var(--space-3);
    margin-top: var(--space-6);
}
</style>
