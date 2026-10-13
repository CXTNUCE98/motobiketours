<script lang="ts" setup>
import { CONTACT_INFO } from '~/constants/contact';

const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
    title: () => t('about.introTitle'),
    description: () => t('about.introDesc1'),
});

// focus: điểm lấy nét khi cắt ảnh ngang 705x400 thành khung dọc 3:4
const heroPhotos = computed(() => [
    { src: '/photos/taynguyen.jpg', place: t('about.places.taynguyen'), focus: '92% 50%' },
    { src: '/photos/mytho1.jpg', place: t('about.places.mytho'), focus: '62% 50%' },
    { src: '/photos/cungdinhhue.jpg', place: t('about.places.hue'), focus: '35% 50%' },
]);

const serviceKeys = ['flights', 'hotels', 'tours', 'visa', 'rentals', 'insurance'];
const advantageKeys = ['price', 'quality', 'diversity', 'speed', 'support', 'promotions'];

// Ảnh chân dung thật: đặt file vào src/public/guides/ rồi điền đường dẫn vào `photo`,
// ví dụ '/guides/jane-cooper.jpg'. Khi chưa có ảnh, thẻ hiển thị chữ cái đầu của tên.
const guides = [
    { name: 'Jane Cooper', photo: '' },
    { name: 'Wade Warren', photo: '' },
    { name: 'Jenny Wilson', photo: '' },
    { name: 'Mamnun Khan', photo: '' },
];

const padNumber = (index: number) => String(index + 1).padStart(2, '0');
const initials = (name: string) => name.split(' ').map((word) => word[0]).join('');
</script>

<template>
    <div class="about">
        <UiPageHero size="xl" :eyebrow="t('nav.about')" title="ANDAGO" :emphasis="t('about.title')"
            :intro="t('about.introDesc1')">
            <template #actions>
                <UiButton :to="localePath('/tour')">{{ t('about.exploreTours') }}</UiButton>
                <UiButton :href="CONTACT_INFO.phoneHref" variant="outline">{{ t('about.callAdvice') }}</UiButton>
            </template>

            <ul class="hero-gallery" role="list">
                <li v-for="photo in heroPhotos" :key="photo.src">
                    <figure class="hero-photo">
                        <img :src="photo.src" :alt="photo.place" :style="{ objectPosition: photo.focus }" width="705"
                            height="400" />
                        <figcaption aria-hidden="true">{{ photo.place }}</figcaption>
                    </figure>
                </li>
            </ul>
        </UiPageHero>

        <!-- Dịch vụ -->
        <section class="services" aria-labelledby="services-title">
            <div class="shell split">
                <UiSectionHeading id="services-title" :title="t('about.servicesTitle')"
                    :lead="t('about.introDesc3')" />

                <ol class="service-list" role="list">
                    <li v-for="(key, index) in serviceKeys" :key="key">
                        <span class="service-number" aria-hidden="true">{{ padNumber(index) }}</span>
                        <span class="service-name">{{ t(`about.services.${key}`) }}</span>
                    </li>
                </ol>
            </div>
        </section>

        <!-- Ưu điểm -->
        <section class="advantages" aria-labelledby="advantages-title">
            <div class="shell">
                <UiSectionHeading id="advantages-title" class="advantages__heading"
                    :title="t('about.advantagesTitle')" emphasis="ANDAGO" />

                <ul class="advantage-grid" role="list">
                    <li v-for="key in advantageKeys" :key="key" class="advantage">
                        <span class="advantage-dot" aria-hidden="true"></span>
                        {{ t(`about.advantages.${key}`) }}
                    </li>
                </ul>
            </div>
        </section>

        <!-- Hướng dẫn viên -->
        <section class="guides" aria-labelledby="guides-title">
            <div class="shell">
                <div class="split guides-head">
                    <UiSectionHeading id="guides-title" :eyebrow="t('about.guidesSub')"
                        :title="t('about.guidesTitle')" />
                    <p class="guides-desc">{{ t('about.guidesDesc') }}</p>
                </div>

                <ul class="guide-grid" role="list">
                    <li v-for="guide in guides" :key="guide.name">
                        <div class="guide-photo">
                            <img v-if="guide.photo" :src="guide.photo" :alt="guide.name" loading="lazy"
                                decoding="async" />
                            <span v-else class="guide-initials" aria-hidden="true">{{ initials(guide.name) }}</span>
                        </div>
                        <h3 class="guide-name">{{ guide.name }}</h3>
                        <p class="guide-role">{{ t('about.guidesSub') }}</p>
                    </li>
                </ul>
            </div>
        </section>

        <!-- CTA + liên hệ -->
        <section class="cta" aria-labelledby="cta-title">
            <div class="shell">
                <div class="cta-card">
                    <div>
                        <h2 id="cta-title" class="cta-title">
                            <UiEmphasis :text="t('about.ctaTitle')" match="ANDAGO" />
                        </h2>
                        <UiButton :to="localePath('/tour')" variant="ink" class="cta-button">
                            {{ t('nav.bookTour') }}
                        </UiButton>
                    </div>

                    <dl class="cta-contacts">
                        <div>
                            <dt>{{ t('contact.quickInfo.visit') }}</dt>
                            <dd>{{ CONTACT_INFO.address }}</dd>
                        </div>
                        <div>
                            <dt>{{ t('contact.quickInfo.email') }}</dt>
                            <dd><a :href="`mailto:${CONTACT_INFO.email}`">{{ CONTACT_INFO.email }}</a></dd>
                        </div>
                        <div>
                            <dt>{{ t('contact.quickInfo.call') }}</dt>
                            <dd>
                                <a :href="CONTACT_INFO.phoneHref">{{ CONTACT_INFO.phone }}</a>
                                <span class="cta-person">{{ CONTACT_INFO.phonePerson }}</span>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.split {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
    gap: var(--space-fluid-xl);
    align-items: start;
}

/* Hero */
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

/* Dịch vụ */
.services {
    padding-block: var(--section-space);
}

.service-list {
    border-bottom: 1px solid var(--color-border);
}

.service-list li {
    display: grid;
    grid-template-columns: 3.25rem 1fr;
    gap: var(--space-4);
    align-items: baseline;
    padding-block: 1.375rem;
    border-top: 1px solid var(--color-border);
}

.service-number {
    color: var(--color-accent);
    font-family: var(--font-serif);
    font-size: var(--text-3xl);
    font-style: italic;
    font-variant-numeric: lining-nums tabular-nums;
}

.service-name {
    font-family: var(--font-serif);
    font-size: var(--text-title);
    line-height: var(--leading-snug);
}

/* Ưu điểm: section nền tối */
.advantages {
    --em-color: var(--color-inverse-accent);
    padding-block: var(--section-space);
    background: var(--color-inverse-bg);
    color: var(--color-inverse-text);
}

.advantages__heading {
    max-width: 44rem;
    margin-bottom: var(--space-fluid-lg);
}

/* Đường kẻ chỉ nằm giữa các ô: viền trên/trái của hàng, cột đầu bị cắt bởi overflow */
.advantage-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
    overflow: hidden;
    border-block: 1px solid var(--color-inverse-border);
}

.advantage {
    margin: -1px 0 0 -1px;
    padding: var(--space-fluid-md) var(--space-fluid-sm);
    border-top: 1px solid var(--color-inverse-border);
    border-left: 1px solid var(--color-inverse-border);
    font-family: var(--font-serif);
    font-size: var(--text-3xl);
    line-height: var(--leading-snug);
}

.advantage-dot {
    display: block;
    width: 0.5rem;
    height: 0.5rem;
    margin-bottom: var(--space-6);
    border-radius: 50%;
    background: var(--color-inverse-accent);
}

/* Hướng dẫn viên */
.guides {
    padding-block: var(--section-space);
}

.guides-head {
    align-items: end;
    margin-bottom: var(--space-fluid-lg);
}

.guides-desc {
    max-width: 36rem;
    color: var(--color-text-muted);
    font-size: var(--text-lead);
    line-height: var(--leading-body);
}

.guide-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 9.5rem), 1fr));
    gap: var(--space-fluid-md) var(--space-fluid-sm);
}

.guide-photo {
    display: grid;
    place-items: center;
    aspect-ratio: 4 / 5;
    overflow: hidden;
    border-radius: var(--radius-md);
    background: var(--color-bg-subtle);
    border: 1px solid var(--color-border);
}

.guide-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.guide-initials {
    color: var(--color-text-muted);
    font-family: var(--font-serif);
    font-size: var(--text-h3);
    font-style: italic;
}

.guide-name {
    margin-top: var(--space-4);
    font-family: var(--font-serif);
    font-size: var(--text-title);
    font-weight: var(--weight-regular);
    line-height: var(--leading-snug);
}

.guide-role {
    margin-top: 0.375rem;
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
}

/* CTA + liên hệ */
.cta {
    padding-bottom: var(--section-space);
}

.cta-card {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
    gap: var(--space-fluid-lg);
    padding: var(--space-panel);
    border-radius: var(--radius-lg);
    background: var(--color-accent);
    color: var(--color-on-accent);
    --em-color: currentColor;
    --focus-color: var(--color-on-accent);
}

.cta-card a:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 3px;
}

.cta-title {
    font-family: var(--font-serif);
    font-size: var(--text-h2);
    font-weight: var(--weight-regular);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    text-wrap: balance;
}

.cta-button {
    margin-top: var(--space-8);
}

.cta-contacts {
    display: grid;
    gap: var(--space-6);
    align-content: end;
}

.cta-contacts > div {
    padding-top: var(--space-5);
    border-top: 1px solid color-mix(in srgb, currentColor 40%, transparent);
}

.cta-contacts dt {
    font-size: var(--text-xs);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.cta-contacts dd {
    margin-top: 0.375rem;
    font-family: var(--font-serif);
    font-size: var(--text-title);
    line-height: var(--leading-snug);
    overflow-wrap: anywhere;
}

.cta-contacts a {
    color: inherit;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.2em;
}

.cta-contacts a:hover {
    text-decoration-thickness: 2px;
}

.cta-person {
    margin-left: var(--space-2);
    font-family: var(--font-sans);
    font-size: var(--text-ui);
}
</style>
