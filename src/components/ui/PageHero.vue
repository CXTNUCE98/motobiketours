<script setup lang="ts">
// Phần mở đầu của trang: nhãn, tiêu đề rất lớn (dòng sau in nghiêng màu nhấn),
// bên phải là đoạn giới thiệu + nút. Slot mặc định nằm dưới (ảnh, ô tìm kiếm...).
withDefaults(defineProps<{
    title: string;
    emphasis?: string;
    eyebrow?: string;
    intro?: string;
    size?: 'lg' | 'xl';
}>(), {
    emphasis: undefined,
    eyebrow: undefined,
    intro: undefined,
    size: 'lg',
});
</script>

<template>
    <section class="page-hero" :class="`page-hero--${size}`">
        <div class="shell">
            <div class="page-hero__head">
                <div class="page-hero__heading">
                    <UiEyebrow v-if="eyebrow">{{ eyebrow }}</UiEyebrow>
                    <h1 class="page-hero__title">
                        {{ title }}
                        <em v-if="emphasis">{{ emphasis }}</em>
                    </h1>
                </div>

                <div v-if="intro || $slots.actions" class="page-hero__aside">
                    <p v-if="intro" class="page-hero__intro">{{ intro }}</p>
                    <div v-if="$slots.actions" class="page-hero__actions">
                        <slot name="actions" />
                    </div>
                </div>
            </div>

            <slot />
        </div>
    </section>
</template>

<style scoped>
.page-hero {
    padding-top: var(--space-page-top);
    padding-bottom: var(--space-page-bottom);
}

.page-hero__head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: var(--space-fluid-lg);
}

.page-hero__heading {
    flex: 999 1 30rem;
    min-width: 0;
}

.page-hero__aside {
    flex: 1 1 20rem;
    max-width: 34rem;
}

.page-hero__title {
    font-family: var(--font-serif);
    font-size: var(--text-display);
    font-weight: var(--weight-regular);
    line-height: var(--leading-display);
    letter-spacing: var(--tracking-display);
}

.page-hero--xl .page-hero__title {
    font-size: var(--text-display-xl);
}

.page-hero__title em {
    display: block;
    color: var(--color-accent);
    font-style: italic;
    text-wrap: balance;
}

.page-hero__intro {
    color: var(--color-text-muted);
    font-size: var(--text-intro);
    line-height: var(--leading-body);
}

.page-hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    margin-top: 1.75rem;
}

.page-hero__aside > .page-hero__actions:first-child {
    margin-top: 0;
}
</style>
