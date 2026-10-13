<script setup lang="ts">
// Nút dạng viên thuốc. Có `to` → NuxtLink, có `href` → <a>, còn lại → <button>.
type Variant = 'accent' | 'outline' | 'ink' | 'ghost';

const props = withDefaults(defineProps<{
    to?: string;
    href?: string;
    variant?: Variant;
    size?: 'md' | 'sm';
    type?: 'button' | 'submit';
    disabled?: boolean;
    block?: boolean;
}>(), {
    to: undefined,
    href: undefined,
    variant: 'accent',
    size: 'md',
    type: 'button',
});

const classes = computed(() => [
    'ui-btn',
    `ui-btn--${props.variant}`,
    `ui-btn--${props.size}`,
    { 'ui-btn--block': props.block },
]);
</script>

<template>
    <NuxtLink v-if="to" :to="to" :class="classes">
        <slot />
    </NuxtLink>
    <a v-else-if="href" :href="href" :class="classes">
        <slot />
    </a>
    <button v-else :type="type" :disabled="disabled" :class="classes">
        <slot />
    </button>
</template>

<style scoped>
.ui-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    border: 1px solid transparent;
    border-radius: var(--radius-pill);
    font-family: var(--font-sans);
    font-weight: var(--weight-medium);
    line-height: 1;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    transition: background-color var(--transition-base), color var(--transition-base), border-color var(--transition-base);
}

.ui-btn--md {
    min-height: 2.75rem;
    padding: 0 1.375rem;
    font-size: var(--text-ui);
}

.ui-btn--sm {
    min-height: 2.5rem;
    padding: 0 1.125rem;
    font-size: var(--text-md);
}

.ui-btn--block {
    width: 100%;
}

.ui-btn:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 3px;
}

.ui-btn:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

.ui-btn--accent {
    background: var(--color-accent);
    color: var(--color-on-accent);
}

.ui-btn--accent:hover:not(:disabled) {
    background: var(--color-accent-hover);
}

.ui-btn--outline {
    border-color: var(--color-text);
    color: var(--color-text);
}

.ui-btn--outline:hover:not(:disabled) {
    background: var(--color-text);
    color: var(--color-bg);
}

.ui-btn--ink {
    background: var(--color-text);
    color: var(--color-bg);
}

.ui-btn--ink:hover:not(:disabled) {
    background: color-mix(in srgb, var(--color-text) 82%, var(--color-bg));
}

.ui-btn--ghost {
    padding-inline: var(--space-1);
    color: var(--color-text);
    text-decoration: underline;
    text-decoration-color: var(--color-accent);
    text-underline-offset: 0.35em;
}

.ui-btn--ghost:hover:not(:disabled) {
    color: var(--color-accent);
}
</style>
