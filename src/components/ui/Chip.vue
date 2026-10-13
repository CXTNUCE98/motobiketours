<script setup lang="ts">
// Nút lọc dạng viên thuốc nhỏ; `active` là trạng thái đang chọn.
defineProps<{
    active?: boolean;
}>();
</script>

<template>
    <button type="button" class="ui-chip" :aria-pressed="active ? 'true' : 'false'">
        <slot />
    </button>
</template>

<style scoped>
.ui-chip {
    display: inline-flex;
    align-items: center;
    min-height: 2.25rem;
    padding: 0 var(--space-4);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-pill);
    color: var(--color-text-muted);
    font-size: var(--text-md);
    white-space: nowrap;
    transition: background-color var(--transition-base), color var(--transition-base), border-color var(--transition-base);
}

.ui-chip:hover {
    border-color: var(--color-text);
    color: var(--color-text);
}

.ui-chip[aria-pressed='true'] {
    border-color: var(--color-text);
    background: var(--color-text);
    color: var(--color-bg);
}

.ui-chip:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}
</style>
