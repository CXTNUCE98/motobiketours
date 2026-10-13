<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { services } from '../../composables/services';

const route = useRoute();
const { t } = useI18n();
const localePath = useLocalePath();

const service = computed(() => services.find(s => s.id === route.params.id));

const relatedServices = computed(() => {
    if (!service.value) return [];
    return services.filter(s => s.id !== service.value!.id).slice(0, 3);
});

const contactPhone = '1900 9477';
const contactPhoneHref = computed(() => `tel:${contactPhone.replace(/\s/g, '')}`);
</script>

<template>
    <div v-if="service" class="service-detail">
        <header class="shell service-detail__head">
            <p class="service-detail__eyebrow">
                <NuxtLink :to="localePath('/service')">{{ t('service.detail.eyebrow') }}</NuxtLink>
            </p>
            <h1 class="service-detail__title">{{ service.title }}</h1>
            <p class="service-detail__lead">{{ service.description }}</p>
        </header>

        <div class="shell service-detail__cover">
            <img :src="service.thumbnail" :alt="service.title" loading="eager" decoding="async">
        </div>

        <div class="shell service-detail__layout">
            <div class="service-detail__main">
                <dl class="service-detail__facts">
                    <div>
                        <dt>{{ t('service.detail.price') }}</dt>
                        <dd>{{ service.priceRange }}</dd>
                    </div>
                    <div v-if="service.duration">
                        <dt>{{ t('tour.duration') }}</dt>
                        <dd>{{ service.duration }}</dd>
                    </div>
                </dl>

                <section v-if="service.highlights?.length" class="service-detail__section">
                    <h2>{{ t('service.detail.highlights') }}</h2>
                    <ul role="list">
                        <li v-for="(item, idx) in service.highlights" :key="idx">{{ item }}</li>
                    </ul>
                </section>

                <section v-if="service.included?.length" class="service-detail__section">
                    <h2>{{ t('service.detail.included') }}</h2>
                    <ul role="list">
                        <li v-for="(item, idx) in service.included" :key="idx">{{ item }}</li>
                    </ul>
                </section>

                <section v-if="service.notIncluded?.length" class="service-detail__section">
                    <h2>{{ t('service.detail.notIncluded') }}</h2>
                    <ul role="list">
                        <li v-for="(item, idx) in service.notIncluded" :key="idx">{{ item }}</li>
                    </ul>
                </section>

                <section v-if="service.reviews?.length" class="service-detail__section">
                    <h2>{{ t('service.detail.reviews') }}</h2>
                    <ul class="service-detail__reviews" role="list">
                        <li v-for="review in service.reviews" :key="review.id">
                            <img :src="review.avatar" alt="" class="service-detail__review-avatar">
                            <div>
                                <p class="service-detail__review-head">
                                    <span>{{ review.name }}</span>
                                    <span>{{ review.date }}</span>
                                    <span>{{ review.rating }}/5</span>
                                </p>
                                <p>{{ review.comment }}</p>
                            </div>
                        </li>
                    </ul>
                </section>
            </div>

            <aside class="service-detail__aside">
                <div class="service-detail__contact">
                    <p class="service-detail__contact-price">{{ service.priceRange }}</p>
                    <UiButton :to="localePath('/contact')" block>{{ t('service.detail.contactCta') }}</UiButton>
                    <UiButton :href="contactPhoneHref" variant="outline" block>{{ contactPhone }}</UiButton>

                    <ul v-if="service.features?.length" class="service-detail__features" role="list">
                        <li v-for="(feature, idx) in service.features" :key="idx">{{ feature }}</li>
                    </ul>
                </div>
            </aside>
        </div>

        <section v-if="relatedServices.length" class="shell service-detail__related"
            :aria-label="t('service.detail.relatedTitle')">
            <h2 class="service-detail__related-title">{{ t('service.detail.relatedTitle') }}</h2>
            <ul class="service-detail__related-grid" role="list">
                <li v-for="related in relatedServices" :key="related.id">
                    <ArticleCard :to="localePath(`/service/${related.id}`)" :image="related.thumbnail"
                        :title="related.shortTitle" :excerpt="related.description" :eyebrow="related.priceRange" />
                </li>
            </ul>
        </section>
    </div>

    <div v-else class="shell service-detail__notfound">
        <UiEmptyState :title="t('service.detail.notFound')" :description="t('service.detail.notFoundDesc')">
            <UiButton :to="localePath('/service')">{{ t('service.detail.backToList') }}</UiButton>
        </UiEmptyState>
    </div>
</template>

<style scoped>
.service-detail__head {
    padding-top: var(--space-page-top);
    padding-bottom: var(--space-fluid-lg);
}

.service-detail__eyebrow {
    margin-bottom: var(--space-5);
}

.service-detail__eyebrow a {
    display: inline-flex;
    align-items: center;
    gap: var(--space-3);
    color: var(--color-accent);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-label);
    text-decoration: none;
    text-transform: uppercase;
}

.service-detail__eyebrow a::before {
    content: '';
    flex-shrink: 0;
    width: 2.5rem;
    height: 1px;
    background: currentColor;
}

.service-detail__title {
    max-width: 48rem;
    font-family: var(--font-serif);
    font-size: var(--text-display);
    font-weight: var(--weight-regular);
    line-height: var(--leading-display);
    letter-spacing: var(--tracking-display);
    text-wrap: balance;
}

.service-detail__lead {
    max-width: 42rem;
    margin-top: var(--space-6);
    color: var(--color-text-muted);
    font-size: var(--text-intro);
    line-height: var(--leading-body);
}

.service-detail__cover {
    margin-bottom: var(--space-block);
}

.service-detail__cover img {
    width: 100%;
    max-height: 32rem;
    border-radius: var(--radius-md);
    object-fit: cover;
    background: var(--color-bg-subtle);
}

.service-detail__layout {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
    gap: var(--space-fluid-xl);
    align-items: start;
    padding-bottom: var(--section-space);
}

@media (min-width: 64rem) {
    .service-detail__layout {
        grid-template-columns: 2fr 1fr;
    }
}

.service-detail__facts {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-fluid-lg);
    padding-bottom: var(--space-6);
    margin-bottom: var(--space-block);
    border-bottom: 1px solid var(--color-border-strong);
}

.service-detail__facts dt {
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.service-detail__facts dd {
    margin-top: 0.375rem;
    font-family: var(--font-serif);
    font-size: var(--text-xl);
}

.service-detail__section {
    padding-bottom: var(--space-block);
}

.service-detail__section h2 {
    padding-bottom: var(--space-3);
    margin-bottom: var(--space-4);
    border-bottom: 1px solid var(--color-border);
    font-family: var(--font-serif);
    font-size: var(--text-h3);
    font-weight: var(--weight-regular);
}

.service-detail__section ul {
    display: grid;
    gap: var(--space-3);
    color: var(--color-text);
    line-height: var(--leading-body);
}

.service-detail__section ul li {
    padding-left: var(--space-5);
    position: relative;
}

.service-detail__section ul li::before {
    content: '—';
    position: absolute;
    left: 0;
    color: var(--color-accent);
}

.service-detail__reviews {
    display: grid;
    gap: var(--space-6);
}

.service-detail__reviews li {
    display: flex;
    gap: var(--space-4);
    padding-top: var(--space-5);
    border-top: 1px solid var(--color-border);
}

.service-detail__review-avatar {
    flex-shrink: 0;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    object-fit: cover;
}

.service-detail__review-head {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1) var(--space-3);
    margin-bottom: var(--space-2);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.service-detail__review-head span:first-child {
    color: var(--color-text);
    font-weight: var(--weight-semibold);
}

.service-detail__review-head > * + *::before {
    content: '·';
    margin-right: var(--space-3);
}

/* Sidebar liên hệ */
.service-detail__contact {
    position: sticky;
    top: calc(var(--header-height) + var(--space-6));
    display: grid;
    gap: var(--space-3);
    padding: var(--space-6);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
}

.service-detail__contact-price {
    margin-bottom: var(--space-2);
    font-family: var(--font-serif);
    font-size: var(--text-2xl);
    text-align: center;
}

.service-detail__features {
    display: grid;
    gap: var(--space-2);
    padding-top: var(--space-5);
    margin-top: var(--space-2);
    border-top: 1px solid var(--color-border);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.service-detail__related {
    padding-bottom: var(--section-space);
    border-top: 1px solid var(--color-border-strong);
}

.service-detail__related-title {
    padding-top: var(--space-fluid-lg);
    margin-bottom: var(--space-fluid-md);
    font-family: var(--font-serif);
    font-size: var(--text-h3);
    font-weight: var(--weight-regular);
}

.service-detail__related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
    gap: var(--space-fluid-lg) var(--space-fluid-sm);
}

.service-detail__notfound {
    padding-block: var(--section-space);
}
</style>
