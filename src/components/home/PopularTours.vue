<script setup lang="ts">
const { t } = useI18n();

const categories = computed(() => [
    { title: t('home.categories.north'), image: '/carousel/1.jpg' },
    { title: t('home.categories.central'), image: '/carousel/2.jpg' },
    { title: t('home.categories.south'), image: '/carousel/3.jpg' },
    { title: t('home.categories.asia'), image: '/carousel/4.jpg' },
    { title: t('home.categories.europe'), image: '/carousel/5.jpg' },
]);
</script>

<template>
    <section class="popular" aria-labelledby="popular-title">
        <div class="shell">
            <UiSectionHeading id="popular-title" :eyebrow="t('home.popularSubtitle')" :title="t('home.popularTitle')" />

            <ul class="popular-grid" role="list">
                <li v-for="cat in categories" :key="cat.title">
                    <figure class="popular-photo">
                        <img :src="cat.image" :alt="cat.title" loading="lazy" decoding="async">
                    </figure>
                    <p class="popular-name">{{ cat.title }}</p>
                </li>
            </ul>
        </div>
    </section>
</template>

<style scoped>
.popular {
    padding-block: var(--section-space);
}

.popular-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 9rem), 1fr));
    gap: var(--space-fluid-md) var(--space-fluid-sm);
    margin-top: var(--space-fluid-lg);
    text-align: center;
}

.popular-photo {
    overflow: hidden;
    max-width: 10rem;
    aspect-ratio: 1 / 1;
    margin-inline: auto;
    border-radius: 50%;
    background: var(--color-bg-subtle);
}

.popular-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-slow);
}

.popular-grid li:hover .popular-photo img {
    transform: scale(1.03);
}

.popular-name {
    margin-top: var(--space-4);
    font-family: var(--font-serif);
    font-size: var(--text-title);
    line-height: var(--leading-snug);
}
</style>
