<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const { home, primaryPhone, localized, phoneHref } = useSiteSettings();

// Bộ ảnh dọc dưới tiêu đề, cấu hình trong admin (Cấu hình → Trang chủ)
const slides = computed(() =>
    (home.value?.heroSlides ?? []).map((slide, index) => ({
        key: `${slide.image}-${index}`,
        image: slide.image,
        caption: localized(slide.caption),
    })),
);
</script>

<template>
    <UiPageHero size="xl" :eyebrow="t('home.discoverTheWorld')" :title="t('home.discoverVietnam')" emphasis="ANDAGO"
        :intro="t('home.uniqueLocations')">
        <template #actions>
            <UiButton :to="localePath('/tour')">{{ t('about.exploreTours') }}</UiButton>
            <UiButton v-if="primaryPhone" :href="phoneHref(primaryPhone.number)" variant="outline">
                {{ t('about.callAdvice') }}
            </UiButton>
        </template>

        <ul v-if="slides.length" class="hero-gallery" role="list">
            <li v-for="slide in slides" :key="slide.key">
                <figure class="hero-photo">
                    <img :src="slide.image" :alt="slide.caption" loading="eager" decoding="async">
                    <figcaption v-if="slide.caption" aria-hidden="true">{{ slide.caption }}</figcaption>
                </figure>
            </li>
        </ul>
    </UiPageHero>
</template>

<style scoped>
.hero-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 13rem), 1fr));
    gap: var(--space-fluid-sm);
    align-items: start;
    margin-top: var(--space-fluid-lg);
}

.hero-photo {
    position: relative;
    aspect-ratio: 3 / 4;
    overflow: hidden;
    border-radius: var(--radius-md);
    background: var(--color-border);
}

.hero-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-slow);
}

.hero-photo:hover img {
    transform: scale(1.03);
}

.hero-photo::after {
    content: '';
    position: absolute;
    inset: 55% 0 0;
    background: linear-gradient(to top, var(--color-scrim), transparent);
    pointer-events: none;
}

.hero-photo figcaption {
    position: absolute;
    right: 1rem;
    bottom: 0.875rem;
    left: 1rem;
    z-index: 1;
    color: var(--color-inverse-text);
    font-size: var(--text-xs);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

@media (min-width: 45rem) {
    .hero-gallery li:nth-child(2) {
        margin-top: 32px;
    }
}
</style>
