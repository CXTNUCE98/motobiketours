<script setup lang="ts">
// Nhãn nhỏ viết hoa kèm gạch ngang màu nhấn, đặt phía trên tiêu đề.
</script>

<template>
    <p class="ui-eyebrow">
        <slot />
    </p>
</template>

<style scoped>
.ui-eyebrow {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-6);
    color: var(--eyebrow-color, var(--color-accent));
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.ui-eyebrow::before {
    content: '';
    flex-shrink: 0;
    width: 2.5rem;
    height: 1px;
    background: currentColor;
}
</style>
