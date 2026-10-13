<script lang="ts" setup>
import { sanitizeHtml } from '~/utils/sanitize';
import { CONTACT_INFO } from '~/constants/contact';

const route = useRoute();
const { t, te } = useI18n();
const localePath = useLocalePath();
const id = computed(() => String(route.params.id || ''));

// Fetch Tour Detail
const { data: tour, isLoading: isLoadingTour, error: tourError } = useTourByIdQuery(id);

// Fetch Reviews
const { data: reviews } = useTourReviewsQuery(id);

// Fetch City Tours (only if tour fetch fails and id is not a UUID)
const isUuid = computed(() => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id.value));
const formattedLocation = computed(() => id.value.replace(/-/g, ' '));
const { data: cityTours, isLoading: isLoadingCityTours } = useToursQuery(
    computed(() => ({ q: formattedLocation.value })),
    computed(() => !!tourError.value && !isUuid.value)
);

const isDepartFrom = computed(() => !!tourError.value && (cityTours.value as any)?.data && (cityTours.value as any).data.length > 0);
const isNotFound = computed(() => !!tourError.value && (!isUuid.value ? (!(cityTours.value as any)?.data || (cityTours.value as any).data.length === 0) : true) && !isLoadingCityTours.value);

const gallery = computed(() => {
    if (!tour.value) return [];
    const images = tour.value.images || [];
    return [tour.value.thumbnail, ...images].filter(Boolean);
});

const overviewHtml = computed(() => tour.value?.content || '');

const tourCode = computed(() => {
    if (!tour.value?.title) return '';
    const parts = tour.value.title.split(':');
    if (parts.length > 1) {
        return parts[0].replace('TOUR', '').trim();
    }
    return '';
});

// Eyebrow trên đầu trang: khởi hành từ · thời lượng
const heroEyebrow = computed(() => {
    if (!tour.value) return '';
    return [tour.value.departFrom, tour.value.duration].filter(Boolean).join(' · ');
});

// Nhãn loại tour đã dịch (vd. "Phiêu lưu · Văn hóa")
const typeLabels = computed(() =>
    (tour.value?.type || [])
        .map((key) => (te(`tour.types.${key}`) ? t(`tour.types.${key}`) : key))
        .join(' · '),
);

const padNumber = (index: number) => String(index + 1).padStart(2, '0');

// Related tours (same departure location)
const { data: relatedToursData } = useToursQuery(
    computed(() => ({ q: tour.value?.departFrom })),
    computed(() => !!tour.value?.departFrom)
);

const relatedTours = computed(() => {
    const data = (relatedToursData.value as any)?.data || [];
    if (!data.length || !tour.value) return [];
    return data
        .filter((t: any) => t.id !== (tour.value as any)?.id)
        .slice(0, 3);
});
</script>

<template>
    <!-- Loading State -->
    <div v-if="isLoadingTour && !isDepartFrom" class="shell tour-loading">
        <UiSkeletonCard ratio="21 / 9" />
        <div class="tour-loading__grid">
            <div class="tour-loading__main">
                <UiSkeletonCard ratio="16 / 9" />
                <UiSkeletonCard ratio="5 / 1" />
            </div>
            <UiSkeletonCard ratio="3 / 4" />
        </div>
    </div>

    <!-- Depart From List View -->
    <div v-else-if="isDepartFrom" class="tour-depart">
        <section class="shell tour-depart__head">
            <UiSectionHeading :eyebrow="t('tour.departingFrom')" :title="formattedLocation" />
        </section>
        <section class="shell">
            <ul class="tour-depart__list" role="list">
                <li v-for="item in cityTours?.data" :key="item.id">
                    <TourListingCard :tour="item" layout="list" />
                </li>
            </ul>
        </section>
    </div>

    <!-- Tour Detail View -->
    <div v-else-if="tour" class="tour-detail">
        <!-- Editorial header -->
        <header class="shell tour-hero">
            <p class="tour-hero__back">
                <NuxtLink :to="localePath('/tour')">← {{ t('tour.allTours') }}</NuxtLink>
            </p>
            <UiEyebrow v-if="heroEyebrow">{{ heroEyebrow }}</UiEyebrow>
            <h1 class="tour-hero__title">{{ tour.title }}</h1>
            <p v-if="tour.routes" class="tour-hero__route">{{ tour.routes }}</p>
            <div class="tour-hero__actions">
                <UiButton href="#tour-booking">{{ t('tour.bookTourNow') }}</UiButton>
                <UiButton href="#tour-reviews" variant="outline">{{ t('tour.reviews') }}</UiButton>
            </div>
        </header>

        <!-- Gallery -->
        <section class="shell tour-hero-gallery" :aria-label="t('tour.form.gallery')">
            <TourGallery :images="gallery" :title="tour.title" />
        </section>

        <!-- Main content + booking -->
        <section class="shell tour-layout">
            <div class="tour-layout__main">
                <!-- Key facts -->
                <dl class="tour-facts">
                    <div>
                        <dt>{{ t('tour.departFrom') }}</dt>
                        <dd>{{ tour.departFrom || '—' }}</dd>
                    </div>
                    <div>
                        <dt>{{ t('tour.duration') }}</dt>
                        <dd>{{ tour.duration || '—' }}</dd>
                    </div>
                    <div v-if="typeLabels">
                        <dt>{{ t('tour.list.type') }}</dt>
                        <dd>{{ typeLabels }}</dd>
                    </div>
                    <div>
                        <dt>{{ t('tour.tourCode') }}</dt>
                        <dd>{{ tourCode || t('tour.steps.none') }}</dd>
                    </div>
                </dl>

                <!-- Overview -->
                <div v-if="overviewHtml" class="tour-section">
                    <UiSectionHeading :title="t('tour.overview')" />
                    <div class="tour-prose" v-html="sanitizeHtml(overviewHtml)"></div>
                </div>

                <!-- Itinerary -->
                <div id="tour-itinerary" class="tour-section">
                    <UiSectionHeading :title="t('tour.itinerary')" />

                    <template v-if="tour.itineraries && tour.itineraries.length > 0">
                        <div class="tour-map">
                            <InteractiveMap :itineraries="tour.itineraries" />
                        </div>

                        <ol class="tour-timeline" role="list">
                            <li v-for="(item, idx) in tour.itineraries" :key="item.id">
                                <span class="tour-timeline__number" aria-hidden="true">{{ padNumber(idx) }}</span>
                                <div class="tour-timeline__body">
                                    <h3 class="tour-timeline__title">{{ item.hotSpot?.name }}</h3>
                                    <p v-if="item.activityDescription" class="tour-timeline__desc">
                                        {{ item.activityDescription }}
                                    </p>
                                </div>
                            </li>
                        </ol>
                    </template>
                    <UiEmptyState v-else :title="t('tour.noItinerary')" />
                </div>

                <!-- Reviews -->
                <div id="tour-reviews" class="tour-section">
                    <UiSectionHeading :title="t('review.title')" />
                    <ReviewsRatingOverview :stats="tour.ratingStats" size="large" />
                    <ReviewsReviewForm :tour-id="tour.id" />
                    <ReviewsReviewList :reviews="reviews || []" />
                </div>

                <!-- Contact -->
                <div class="tour-section">
                    <h2 class="tour-contact__title">{{ t('contact.contactUs') }}</h2>
                    <dl class="tour-contact">
                        <div>
                            <dt>{{ t('contact.quickInfo.call') }}</dt>
                            <dd><a :href="CONTACT_INFO.phoneHref">{{ CONTACT_INFO.phoneIntl }}</a></dd>
                        </div>
                        <div>
                            <dt>{{ t('contact.quickInfo.email') }}</dt>
                            <dd><a :href="`mailto:${CONTACT_INFO.email}`">{{ CONTACT_INFO.email }}</a></dd>
                        </div>
                        <div>
                            <dt>{{ t('contact.quickInfo.visit') }}</dt>
                            <dd>{{ CONTACT_INFO.address }}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            <aside id="tour-booking" class="tour-layout__aside">
                <BookingCard :price="tour.priceUsd || t('tour.priceOnRequest')" :duration="tour.duration"
                    :group-size="t('tour.groupSizeDefault')" :tour-id="tour.id" />
            </aside>
        </section>

        <!-- Related Tours -->
        <section v-if="relatedTours.length > 0" class="shell tour-related">
            <UiSectionHeading :title="t('tour.relatedTours')" />
            <ul class="tour-related__grid" role="list">
                <li v-for="relatedTour in relatedTours" :key="relatedTour?.id">
                    <TourListingCard :tour="relatedTour" />
                </li>
            </ul>
        </section>
    </div>

    <!-- Not Found -->
    <div v-else-if="isNotFound" class="shell tour-not-found">
        <UiEmptyState :title="t('tour.notFoundTour')" :description="t('tour.notFoundTourDesc')">
            <UiButton :to="localePath('/tour')">{{ t('tour.goBackTourList') }}</UiButton>
        </UiEmptyState>
    </div>
</template>

<style scoped>
/* Loading */
.tour-loading {
    display: grid;
    gap: var(--space-fluid-lg);
    padding-block: var(--space-page-top) var(--space-page-bottom);
}

.tour-loading__grid {
    display: grid;
    gap: var(--space-fluid-lg);
}

.tour-loading__main {
    display: grid;
    gap: var(--space-fluid-md);
}

@media (min-width: 64rem) {
    .tour-loading__grid {
        grid-template-columns: 1fr 21rem;
        align-items: start;
    }
}

/* Depart-from list */
.tour-depart__head {
    padding-top: var(--space-page-top);
    padding-bottom: var(--space-fluid-lg);
}

.tour-depart__list {
    border-bottom: 1px solid var(--color-border);
    padding-bottom: var(--section-space);
}

.tour-depart__list > li + li :deep(.tour-card--list) {
    border-top: 1px solid var(--color-border);
}

/* Hero */
.tour-hero {
    padding-top: var(--space-page-top);
    padding-bottom: var(--space-fluid-lg);
}

.tour-hero__back {
    margin-bottom: var(--space-6);
}

.tour-hero__back a {
    color: var(--color-text-muted);
    font-size: var(--text-ui);
    text-decoration: none;
    transition: color var(--transition-base);
}

.tour-hero__back a:hover {
    color: var(--color-text);
}

.tour-hero__title {
    max-width: 52rem;
    font-family: var(--font-serif);
    font-size: var(--text-display);
    font-weight: var(--weight-regular);
    line-height: var(--leading-display);
    letter-spacing: var(--tracking-display);
    text-wrap: balance;
}

.tour-hero__route {
    max-width: 40rem;
    margin-top: var(--space-5);
    color: var(--color-text-muted);
    font-size: var(--text-lead);
    line-height: var(--leading-body);
}

.tour-hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    margin-top: var(--space-8);
}

.tour-hero a:focus-visible,
.tour-timeline a:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 3px;
}

/* Gallery */
.tour-hero-gallery {
    padding-bottom: var(--section-space);
}

/* Layout: main + booking */
.tour-layout {
    display: grid;
    gap: var(--space-fluid-xl);
    align-items: start;
    padding-bottom: var(--section-space);
}

@media (min-width: 64rem) {
    .tour-layout {
        grid-template-columns: 1fr 21rem;
    }
}

.tour-layout__main {
    min-width: 0;
}

.tour-section {
    padding-top: var(--space-block);
}

/* Key facts */
.tour-facts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
    overflow: hidden;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
}

.tour-facts > div {
    margin: -1px 0 0 -1px;
    padding: var(--space-5);
    border-top: 1px solid var(--color-border);
    border-left: 1px solid var(--color-border);
}

.tour-facts dt {
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.tour-facts dd {
    margin-top: 0.375rem;
    font-family: var(--font-serif);
    font-size: var(--text-lg);
    line-height: var(--leading-snug);
}

/* Overview prose */
.tour-prose {
    max-width: 44rem;
    margin-top: var(--space-fluid-md);
    color: var(--color-text-muted);
    line-height: var(--leading-body);
}

.tour-prose :deep(h1),
.tour-prose :deep(h2),
.tour-prose :deep(h3),
.tour-prose :deep(h4) {
    margin-top: var(--space-6);
    margin-bottom: var(--space-3);
    color: var(--color-text);
    font-family: var(--font-serif);
    font-size: var(--text-title);
    font-weight: var(--weight-regular);
}

.tour-prose :deep(p) {
    margin-bottom: var(--space-4);
}

.tour-prose :deep(ul) {
    margin: var(--space-3) 0 var(--space-4) var(--space-5);
    list-style: disc;
}

.tour-prose :deep(a) {
    color: var(--color-text);
    text-decoration: underline;
    text-decoration-color: var(--color-accent);
    text-underline-offset: 0.25em;
}

/* Itinerary map */
.tour-map {
    aspect-ratio: 16 / 9;
    overflow: hidden;
    margin-top: var(--space-fluid-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
}

/* Itinerary timeline (như danh sách dịch vụ ở trang giới thiệu) */
.tour-timeline {
    margin-top: var(--space-fluid-md);
    border-bottom: 1px solid var(--color-border);
}

.tour-timeline > li {
    display: grid;
    grid-template-columns: 3.25rem 1fr;
    gap: var(--space-4);
    padding-block: var(--space-5);
    border-top: 1px solid var(--color-border);
}

.tour-timeline__number {
    color: var(--color-accent);
    font-family: var(--font-serif);
    font-size: var(--text-2xl);
    font-style: italic;
    font-variant-numeric: lining-nums tabular-nums;
}

.tour-timeline__title {
    font-family: var(--font-serif);
    font-size: var(--text-title);
    font-weight: var(--weight-regular);
    line-height: var(--leading-snug);
}

.tour-timeline__desc {
    margin-top: 0.375rem;
    color: var(--color-text-muted);
    line-height: var(--leading-body);
}

/* Contact */
.tour-contact__title {
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--color-border-strong);
    font-family: var(--font-serif);
    font-size: var(--text-3xl);
    font-weight: var(--weight-regular);
}

.tour-contact {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
    gap: var(--space-4);
    margin-top: var(--space-fluid-md);
}

.tour-contact > div {
    padding-block: var(--space-4);
    border-top: 1px solid var(--color-border);
}

.tour-contact dt {
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.tour-contact dd {
    margin-top: 0.375rem;
    font-family: var(--font-serif);
    font-size: var(--text-lg);
    line-height: var(--leading-snug);
    overflow-wrap: anywhere;
}

.tour-contact a {
    color: inherit;
    text-decoration: underline;
    text-decoration-color: var(--color-border);
    text-underline-offset: 0.2em;
}

.tour-contact a:hover {
    text-decoration-color: var(--color-accent);
}

/* Related tours */
.tour-related {
    padding-bottom: var(--section-space);
}

.tour-related__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
    gap: var(--space-fluid-md) var(--space-fluid-sm);
    margin-top: var(--space-fluid-md);
}

/* Not found */
.tour-not-found {
    display: flex;
    align-items: center;
    min-height: 60vh;
    padding-block: var(--space-page-top) var(--space-page-bottom);
}

.tour-not-found > :deep(.ui-empty) {
    width: 100%;
}
</style>
