<script setup lang="ts">
// Cụm tiêu đề section: nhãn + tiêu đề serif (in nghiêng cụm `emphasis`) + đoạn dẫn.
withDefaults(defineProps<{
    title: string;
    eyebrow?: string;
    lead?: string;
    emphasis?: string;
    level?: 1 | 2 | 3;
    id?: string;
}>(), {
    eyebrow: undefined,
    lead: undefined,
    emphasis: undefined,
    level: 2,
    id: undefined,
});
</script>

<template>
    <div class="ui-heading">
        <UiEyebrow v-if="eyebrow">{{ eyebrow }}</UiEyebrow>
        <component :is="`h${level}`" :id="id" class="ui-heading__title">
            <UiEmphasis :text="title" :match="emphasis" />
        </component>
        <p v-if="lead" class="ui-heading__lead">{{ lead }}</p>
        <slot />
    </div>
</template>

<style scoped>
.ui-heading__title {
    font-family: var(--font-serif);
    font-size: var(--text-h2);
    font-weight: var(--weight-regular);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    text-wrap: balance;
}

.ui-heading__lead {
    max-width: 36rem;
    margin-top: var(--space-6);
    color: var(--lead-color, var(--color-text-muted));
    font-size: var(--text-lead);
    line-height: var(--leading-body);
}
</style>
