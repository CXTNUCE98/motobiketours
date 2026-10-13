<script setup lang="ts">
// Khung cho một ô nhập: nhãn + control (slot) + thông báo lỗi.
// Slot nhận { id, describedBy, invalid } để gắn vào input bên trong.
const props = defineProps<{
    label: string;
    error?: string;
}>();

const id = useId();
const errorId = `${id}-error`;
const slotProps = computed(() => ({
    id,
    describedBy: props.error ? errorId : undefined,
    invalid: props.error ? 'true' : undefined,
}));
</script>

<template>
    <div class="ui-field">
        <label :for="id" class="ui-field__label">{{ label }}</label>
        <slot v-bind="slotProps" />
        <p v-if="error" :id="errorId" class="ui-field__error">{{ error }}</p>
    </div>
</template>

<style scoped>
.ui-field__label {
    display: block;
    margin-bottom: var(--space-2);
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.ui-field__error {
    margin-top: 0.375rem;
    color: var(--color-danger);
    font-size: var(--text-sm);
}
</style>
