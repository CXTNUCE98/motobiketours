<script setup lang="ts">
// Khung chờ khi đang tải danh sách thẻ (tour, bài viết).
withDefaults(defineProps<{
    ratio?: string;
}>(), {
    ratio: '4 / 3',
});
</script>

<template>
    <div class="ui-skeleton" aria-hidden="true">
        <div class="ui-skeleton__media" :style="{ aspectRatio: ratio }" />
        <div class="ui-skeleton__line" />
        <div class="ui-skeleton__line ui-skeleton__line--short" />
    </div>
</template>

<style scoped>
.ui-skeleton__media,
.ui-skeleton__line {
    border-radius: var(--radius-md);
    background: var(--color-bg-subtle);
    animation: ui-skeleton-pulse 1.4s ease-in-out infinite;
}

.ui-skeleton__line {
    height: 1.25rem;
    margin-top: var(--space-4);
}

.ui-skeleton__line--short {
    width: 60%;
    margin-top: 0.625rem;
}

@keyframes ui-skeleton-pulse {
    50% {
        opacity: 0.5;
    }
}
</style>
