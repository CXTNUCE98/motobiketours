<script setup lang="ts">
import type { TourCardItem } from '@/types/api';

// Thẻ tour dùng ở trang chủ và trang yêu thích (wishlist.vue — thuộc nhóm khác, không đổi API).
// Visually khớp với tour/TourListingCard: ảnh 4:3 bo góc, eyebrow nhỏ màu nhấn, tiêu đề serif,
// chi tiết chữ mờ, giá serif, đường kẻ thay cho khung/bóng đổ.
type Props = {
    tour?: TourCardItem;
    rating?: number;
    showPeulisLabel?: boolean;
    variant?: 'default' | 'compact';
    to?: string;
    tags?: string[];
    originalPrice?: number;
    /** If provided, skip the individual wishlist check and use this value */
    isWishlistedOverride?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    rating: 5,
    showPeulisLabel: true,
    variant: 'default',
    to: undefined,
    tags: () => [],
    isWishlistedOverride: undefined,
});

const { t } = useI18n();
const { isAuthenticated } = useAuth();
const { formatPrice } = useCurrency();
const localePath = useLocalePath();

const tourId = computed(() => props.tour?.id || '');

// Wishlist Logic
// Use override if provided, otherwise fall back to individual check
const { data: wishlistStatus } = props.isWishlistedOverride === undefined
    ? useIsWishlistedQuery(tourId)
    : { data: ref(null) };
const toggleWishlistMutation = useToggleWishlistMutation();

const isWishlisted = computed(() =>
    props.isWishlistedOverride !== undefined
        ? props.isWishlistedOverride
        : (wishlistStatus.value?.isWishlisted ?? false),
);

const wishlistLabel = computed(() => (isWishlisted.value ? t('tourCard.wishlistRemove') : t('tourCard.wishlistAdd')));

const toggleWishlist = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated.value) {
        ElMessage.warning(t('review.loginRequired'));
        return;
    }

    try {
        const wasWishlisted = isWishlisted.value;
        await toggleWishlistMutation.mutateAsync(tourId.value);

        // Show success message based on previous state
        if (wasWishlisted) {
            ElMessage.success(t('wishlist.removeSuccess'));
        } else {
            ElMessage.success(t('wishlist.addSuccess'));
        }
    } catch (err) {
        ElMessage.error(t('review.error'));
    }
};

const detailPath = computed(() => localePath(props.tour?.to || `/tour/${props.tour?.id}`));

const formattedPrice = computed(() => formatPrice(props.tour?.price));

const formattedOriginalPrice = computed(() => {
    const oPrice = props.tour?.originalPrice || props.originalPrice;
    if (!oPrice) return '';
    return formatPrice(oPrice);
});

const tagsList = computed(() => (props.tour?.tags?.length ? props.tour.tags : props.tags));
const ratingValue = computed(() => props.tour?.rating || props.rating);
</script>

<template>
    <article class="tour-card" :class="`tour-card--${variant}`">
        <div class="tour-card__media">
            <img :src="tour?.image" :alt="tour?.title || ''" loading="lazy" decoding="async">
            <span v-if="tour?.duration" class="tour-card__duration">{{ tour.duration }}</span>

            <button type="button" class="tour-card__wishlist" :class="{ 'is-active': isWishlisted }"
                :aria-label="wishlistLabel" :aria-pressed="isWishlisted" @click="toggleWishlist">
                <svg viewBox="0 0 24 24" :fill="isWishlisted ? 'currentColor' : 'none'" stroke="currentColor"
                    stroke-width="1.5" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0z" />
                </svg>
            </button>
        </div>

        <div class="tour-card__body">
            <p v-if="tour?.badge" class="tour-card__eyebrow">{{ tour.badge }}</p>
            <h3 class="tour-card__title">
                <NuxtLink :to="detailPath" class="tour-card__link">{{ tour?.title }}</NuxtLink>
            </h3>

            <template v-if="variant !== 'compact'">
                <p v-if="tagsList.length" class="tour-card__route">{{ tagsList.join(' · ') }}</p>

                <div v-if="tour?.people || ratingValue" class="tour-card__meta">
                    <span v-if="tour?.people">{{ t('tour.peopleCount', { count: tour.people }) }}</span>
                    <span v-if="ratingValue">{{ ratingValue.toFixed(1) }}/5</span>
                </div>
            </template>

            <div class="tour-card__foot">
                <div class="tour-card__price-group">
                    <p class="tour-card__price">{{ formattedPrice }}</p>
                    <p v-if="formattedOriginalPrice" class="tour-card__original-price">{{ formattedOriginalPrice }}</p>
                    <span v-if="tour?.discount" class="tour-card__discount">-{{ tour.discount }}%</span>
                </div>
                <span class="tour-card__more" aria-hidden="true">{{ t('tour.list.details') }} →</span>
            </div>
        </div>
    </article>
</template>

<style scoped>
.tour-card {
    position: relative;
    border-radius: var(--radius-md);
}

.tour-card:has(.tour-card__link:focus-visible) {
    outline: var(--focus-ring);
    outline-offset: 6px;
}

.tour-card__link {
    color: inherit;
    text-decoration: none;
    outline: none;
}

/* Link trải rộng: bấm vào bất kỳ đâu trên thẻ đều mở chi tiết tour */
.tour-card__link::after {
    content: '';
    position: absolute;
    inset: 0;
}

.tour-card__media {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border-radius: var(--radius-md);
    background: var(--color-bg-subtle);
}

.tour-card__media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-slow);
}

.tour-card:hover .tour-card__media img {
    transform: scale(1.03);
}

.tour-card__media::after {
    content: '';
    position: absolute;
    inset: 60% 0 0;
    background: linear-gradient(to top, var(--color-scrim), transparent);
    pointer-events: none;
}

.tour-card__duration {
    position: absolute;
    bottom: 0.75rem;
    left: 0.875rem;
    z-index: 1;
    color: var(--color-inverse-text);
    font-size: var(--text-2xs);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.tour-card__wishlist {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    background: color-mix(in srgb, var(--color-surface) 85%, transparent);
    color: var(--color-text-muted);
    transition: color var(--transition-base);
}

.tour-card__wishlist svg {
    width: 1.125rem;
    height: 1.125rem;
}

.tour-card__wishlist:hover,
.tour-card__wishlist.is-active {
    color: var(--color-danger);
}

.tour-card__wishlist:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}

.tour-card__body {
    display: flex;
    flex-direction: column;
    padding-top: 1.125rem;
}

.tour-card__eyebrow {
    margin-bottom: 0.375rem;
    color: var(--color-accent);
    font-size: var(--text-2xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.tour-card__title {
    font-family: var(--font-serif);
    font-size: var(--text-title);
    font-weight: var(--weight-regular);
    line-height: var(--leading-snug);
    transition: color var(--transition-base);
}

.tour-card:hover .tour-card__title {
    color: var(--color-accent);
}

.tour-card__route {
    display: -webkit-box;
    margin-top: var(--space-2);
    overflow: hidden;
    color: var(--color-text-muted);
    font-size: var(--text-ui);
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
}

.tour-card__meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1) var(--space-3);
    margin-top: var(--space-2);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.tour-card__meta>span+span::before {
    content: '·';
    margin-right: var(--space-3);
}

.tour-card__foot {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-4);
    margin-top: var(--space-4);
    padding-top: var(--space-4);
    border-top: 1px solid var(--color-border);
}

.tour-card__price-group {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: var(--space-2);
}

.tour-card__price {
    font-family: var(--font-serif);
    font-size: var(--text-2xl);
    font-variant-numeric: lining-nums;
}

.tour-card__original-price {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    text-decoration: line-through;
}

.tour-card__discount {
    color: var(--color-accent);
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
}

.tour-card__more {
    color: var(--color-text-muted);
    font-size: var(--text-md);
}

.tour-card--compact .tour-card__body {
    padding-top: var(--space-3);
}

.tour-card--compact .tour-card__title {
    font-size: var(--text-lg);
}
</style>
