<script setup lang="ts">
defineProps<{
    title: string;
    description?: string;
}>();
</script>

<template>
    <div class="ui-empty">
        <p class="ui-empty__title">{{ title }}</p>
        <p v-if="description" class="ui-empty__desc">{{ description }}</p>
        <div v-if="$slots.default" class="ui-empty__action">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.ui-empty {
    padding-block: var(--space-block);
    border-block: 1px solid var(--color-border);
    text-align: center;
}

.ui-empty__title {
    font-family: var(--font-serif);
    font-size: var(--text-title-lg);
    font-style: italic;
}

.ui-empty__desc {
    margin-top: var(--space-2);
    color: var(--color-text-muted);
}

.ui-empty__action {
    margin-top: var(--space-6);
}
</style>
