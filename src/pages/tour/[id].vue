<script lang="ts" setup>
import { sanitizeHtml } from '~/utils/sanitize';

const route = useRoute();
const { t, te } = useI18n();
const { general } = useSiteSettings();
const { isAuthenticated } = useAuth();
const { openLoginPopup } = useLoginPopup();
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

// Tiêu đề hiển thị bỏ tiền tố mã tour ("TOUR SM6: Bà Nà Hill" → "Bà Nà Hill"), mã hiện thành nhãn riêng
const displayTitle = computed(() => {
    const title = tour.value?.title || '';
    if (!tourCode.value) return title;
    return title.slice(title.indexOf(':') + 1).trim() || title;
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

const ratingStats = computed(() => tour.value?.ratingStats);
const reviewCount = computed(() => ratingStats.value?.totalReviews || 0);
const averageRating = computed(() => Number(ratingStats.value?.averageRating || 0));
const rateColors = ['var(--color-accent)', 'var(--color-accent)', 'var(--color-accent)'];

// Hàng thông tin chính; chỉ hiện mục có dữ liệu
const FACT_ICONS: Record<string, string[]> = {
    duration: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z', 'M12 7v5l3 2'],
    depart: ['M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z', 'M12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z'],
    type: ['M3.5 12.6V4.5a1 1 0 0 1 1-1h8.1l8 8-9.1 9.1z', 'M8.5 8.5h.01'],
    vehicle: ['M3 16.5v-4.2L5.2 7h13.6l2.2 5.3v4.2z', 'M3 12.3h18', 'M7.5 15a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6z', 'M16.5 15a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6z'],
    stops: ['M6 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', 'M18 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', 'M8 18h8a3 3 0 0 0 0-6H8a3 3 0 0 1 0-6h8'],
};

const facts = computed(() => {
    if (!tour.value) return [];
    const vehicle = tour.value.suggestedVehicle;
    const stopCount = tour.value.itineraries?.length || 0;
    return [
        { key: 'duration', label: t('tour.duration'), value: tour.value.duration },
        { key: 'depart', label: t('tour.departFrom'), value: tour.value.departFrom },
        { key: 'type', label: t('tour.list.type'), value: typeLabels.value },
        {
            key: 'vehicle',
            label: t('tour.vehicle'),
            value: vehicle
                ? [vehicle.model, vehicle.capacity ? t('tour.seatCount', { count: vehicle.capacity }) : '']
                    .filter(Boolean)
                    .join(' · ')
                : '',
        },
        { key: 'stops', label: t('tour.stops'), value: stopCount ? t('tour.stopCount', { count: stopCount }, stopCount) : '' },
    ].filter((fact) => fact.value);
});

// Mục lục dính
const sections = computed(() =>
    [
        overviewHtml.value ? { id: 'tour-overview', label: t('tour.overview') } : null,
        { id: 'tour-itinerary', label: t('tour.itinerary') },
        { id: 'tour-reviews', label: reviewCount.value ? `${t('tour.reviews')} (${reviewCount.value})` : t('tour.reviews') },
    ].filter((section): section is { id: string; label: string } => !!section),
);

// Mô tả dài thì thu gọn, bấm "Đọc tiếp" để mở
const overviewEl = ref<HTMLElement | null>(null);
const overviewExpanded = ref(false);
const overviewCollapsible = ref(false);
watch(
    [overviewHtml, overviewEl],
    async () => {
        await nextTick();
        overviewCollapsible.value = (overviewEl.value?.scrollHeight || 0) > 640;
    },
    { immediate: true, flush: 'post' },
);

// Viết đánh giá: form chỉ mở khi bấm nút; chưa đăng nhập thì mở popup đăng nhập
const showReviewForm = ref(false);
const onWriteReview = () => {
    if (!isAuthenticated.value) {
        ElMessage.warning(t('review.loginRequired'));
        openLoginPopup();
        return;
    }
    showReviewForm.value = true;
};

// Tour liên quan: cùng nơi khởi hành; không có thì lấy các tour khác
const { data: relatedToursData } = useToursQuery(
    computed(() => ({ q: tour.value?.departFrom })),
    computed(() => !!tour.value?.departFrom)
);

const sameDepartureTours = computed(() =>
    ((relatedToursData.value as any)?.data || []).filter((item: any) => item.id !== tour.value?.id),
);

const { data: otherToursData } = useToursQuery(
    computed(() => ({})),
    computed(() => !!relatedToursData.value && sameDepartureTours.value.length === 0)
);

const relatedTours = computed(() => {
    if (!tour.value) return [];
    const list = sameDepartureTours.value.length
        ? sameDepartureTours.value
        : ((otherToursData.value as any)?.data || []).filter((item: any) => item.id !== tour.value?.id);
    return list.slice(0, 3);
});

useSeoMeta({
    title: () => (displayTitle.value ? `${displayTitle.value} | ${general.value?.siteName || 'Andago Tours'}` : undefined),
    description: () => tour.value?.description || undefined,
    ogTitle: () => displayTitle.value || undefined,
    ogDescription: () => tour.value?.description || undefined,
    ogImage: () => gallery.value[0] || undefined,
    twitterCard: 'summary_large_image',
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
        <!-- Header: tiêu đề, số sao, mô tả ngắn, lưu / chia sẻ -->
        <header class="shell tour-hero">
            <p class="tour-hero__back">
                <NuxtLink :to="localePath('/tour')">← {{ t('tour.allTours') }}</NuxtLink>
            </p>
            <UiEyebrow v-if="heroEyebrow">{{ heroEyebrow }}</UiEyebrow>
            <div class="tour-hero__head">
                <div class="tour-hero__text">
                    <h1 class="tour-hero__title">{{ displayTitle }}</h1>
                    <div class="tour-hero__meta">
                        <a v-if="reviewCount" href="#tour-reviews" class="tour-hero__rating">
                            <el-rate :model-value="averageRating" disabled size="small" :colors="rateColors"
                                void-color="var(--color-border)" />
                            <strong>{{ averageRating.toFixed(1) }}</strong>
                            <span>{{ t('review.total', { count: reviewCount }) }}</span>
                        </a>
                        <span v-if="tour.routes">{{ tour.routes }}</span>
                        <span v-if="tourCode" class="tour-hero__code">{{ t('tour.tourCode') }} {{ tourCode }}</span>
                    </div>
                    <p v-if="tour.description" class="tour-hero__lead">{{ tour.description }}</p>
                </div>
                <TourActions :tour-id="tour.id" :title="displayTitle" />
            </div>
        </header>

        <!-- Nội dung + thẻ đặt tour -->
        <section class="shell tour-layout">
            <div class="tour-layout__main">
                <TourGallery :images="gallery" :title="displayTitle" mosaic />

                <dl v-if="facts.length" class="tour-facts">
                    <div v-for="fact in facts" :key="fact.key">
                        <dt>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
                                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path v-for="d in FACT_ICONS[fact.key]" :key="d" :d="d" />
                            </svg>
                            {{ fact.label }}
                        </dt>
                        <dd>{{ fact.value }}</dd>
                    </div>
                </dl>

                <TourSectionNav :sections="sections" />

                <!-- Tổng quan -->
                <div v-if="overviewHtml" id="tour-overview" class="tour-section">
                    <h2 class="tour-section__title">{{ t('tour.overview') }}</h2>
                    <div ref="overviewEl" class="tour-prose"
                        :class="{ 'tour-prose--collapsed': overviewCollapsible && !overviewExpanded }"
                        v-html="sanitizeHtml(overviewHtml)"></div>
                    <UiButton v-if="overviewCollapsible" variant="ghost" size="sm" class="tour-prose__toggle"
                        :aria-expanded="overviewExpanded" @click="overviewExpanded = !overviewExpanded">
                        {{ overviewExpanded ? t('tour.readLess') : t('tour.readMore') }}
                    </UiButton>
                </div>

                <!-- Lịch trình: danh sách điểm dừng + bản đồ -->
                <div id="tour-itinerary" class="tour-section tour-section--itinerary">
                    <h2 class="tour-section__title">{{ t('tour.itinerary') }}</h2>
                    <div v-if="tour.itineraries && tour.itineraries.length > 0" class="tour-itinerary">
                        <TourStops :itineraries="tour.itineraries" />
                        <div class="tour-map">
                            <InteractiveMap :itineraries="tour.itineraries" />
                        </div>
                    </div>
                    <UiEmptyState v-else :title="t('tour.noItinerary')" />
                </div>

                <!-- Đánh giá -->
                <div id="tour-reviews" class="tour-section">
                    <div class="tour-section__head">
                        <h2 class="tour-section__title">{{ t('review.title') }}</h2>
                        <UiButton v-if="!showReviewForm" variant="outline" size="sm" @click="onWriteReview">
                            {{ t('review.writeButton') }}
                        </UiButton>
                    </div>
                    <ReviewsRatingOverview v-if="reviewCount" :stats="ratingStats" size="large"
                        class="tour-reviews__overview" />
                    <div v-if="showReviewForm" class="tour-reviews__form">
                        <ReviewsReviewForm :tour-id="tour.id" @success="showReviewForm = false" />
                        <UiButton variant="ghost" size="sm" @click="showReviewForm = false">
                            {{ t('common.cancel') }}
                        </UiButton>
                    </div>
                    <ReviewsReviewList :reviews="reviews || []" class="tour-reviews__list" />
                </div>
            </div>

            <aside id="tour-booking" class="tour-layout__aside">
                <BookingCard :price="tour.priceUsd" :tour-id="tour.id" />
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

        <TourBookingBar :tour-id="tour.id" :price="tour.priceUsd" />
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
    padding-top: var(--space-fluid-md);
    padding-bottom: var(--space-fluid-md);
}

.tour-hero__back {
    margin-bottom: var(--space-5);
}

.tour-hero :deep(.ui-eyebrow) {
    margin-bottom: var(--space-4);
}

.tour-hero__head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--space-5) var(--space-8);
}

.tour-hero__text {
    flex: 1 1 32rem;
    min-width: 0;
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
    font-size: var(--text-h2);
    font-weight: var(--weight-regular);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    text-wrap: balance;
}

.tour-hero__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-2) var(--space-5);
    margin-top: var(--space-4);
    color: var(--color-text-muted);
    font-size: var(--text-ui);
}

.tour-hero__rating {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    color: inherit;
    text-decoration: none;
}

.tour-hero__rating strong {
    color: var(--color-text);
    font-weight: var(--weight-semibold);
}

.tour-hero__rating span {
    text-decoration: underline;
    text-decoration-color: var(--color-border);
    text-underline-offset: 0.25em;
}

.tour-hero__rating:hover span {
    text-decoration-color: var(--color-accent);
}

.tour-hero__rating :deep(.el-rate) {
    --el-rate-icon-size: 15px;
    height: auto;
}

.tour-hero__rating :deep(.el-rate__item) {
    margin-right: 1px;
}

.tour-hero__code {
    padding: 0.125rem var(--space-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide);
}

.tour-hero__lead {
    max-width: 44rem;
    margin-top: var(--space-4);
    color: var(--color-text-muted);
    font-size: var(--text-lead);
    line-height: var(--leading-body);
}

.tour-hero a:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 3px;
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
        grid-template-columns: minmax(0, 1fr) 21rem;
        gap: var(--space-fluid-lg);
    }

    /* Cột phải cao bằng cột nội dung để thẻ đặt tour dính được khi cuộn */
    .tour-layout__aside {
        align-self: stretch;
    }
}

.tour-layout__main {
    display: grid;
    gap: var(--space-fluid-md);
    min-width: 0;
}

.tour-section {
    padding-top: var(--space-8);
    scroll-margin-top: calc(var(--header-height) + 3.5rem);
}

.tour-section__head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
}

.tour-section__title {
    font-family: var(--font-serif);
    font-size: var(--text-h3);
    font-weight: var(--weight-regular);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
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
    display: grid;
    gap: var(--space-3);
    justify-items: start;
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.tour-facts dt svg {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--color-accent);
}

.tour-facts dd {
    margin-top: 0.375rem;
    font-family: var(--font-serif);
    font-size: var(--text-lg);
    line-height: var(--leading-snug);
}

/* Overview prose */
.tour-prose > :deep(:first-child) {
    margin-top: 0;
}

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

/* Mô tả dài: thu gọn, mờ dần ở mép dưới */
.tour-prose--collapsed {
    max-height: 28rem;
    overflow: hidden;
    -webkit-mask-image: linear-gradient(to bottom, #000 65%, transparent);
    mask-image: linear-gradient(to bottom, #000 65%, transparent);
}

.tour-prose__toggle {
    margin-top: var(--space-3);
}

/* Lịch trình: danh sách + bản đồ cạnh nhau khi cột nội dung đủ rộng */
.tour-section--itinerary {
    container-type: inline-size;
}

.tour-itinerary {
    display: grid;
    gap: var(--space-fluid-md);
    margin-top: var(--space-fluid-md);
}

.tour-map {
    order: -1;
    /* Giữ z-index nội bộ của Leaflet (control = 1000) bên dưới mục lục dính và popup */
    isolation: isolate;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
}

@container (min-width: 44rem) {
    .tour-itinerary {
        grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
        align-items: start;
    }

    .tour-map {
        position: sticky;
        top: calc(var(--header-height) + 4.5rem);
        order: 0;
        aspect-ratio: 4 / 5;
        max-height: 32rem;
    }
}

/* Đánh giá */
.tour-reviews__overview,
.tour-reviews__list {
    margin-top: var(--space-fluid-md);
}

.tour-reviews__form {
    display: grid;
    justify-items: start;
    gap: var(--space-3);
    margin-top: var(--space-fluid-md);
    padding: var(--space-6);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
}

.tour-reviews__form > :first-child {
    width: 100%;
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
