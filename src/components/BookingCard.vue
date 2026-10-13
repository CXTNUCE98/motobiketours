<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps<{
    price: number | string;
    originalPrice?: number;
    duration: string;
    groupSize: string;
    difficulty?: string;
    tourId: string;
}>();

const { t } = useI18n();
const { isAuthenticated } = useAuth();
const router = useRouter();
const localePath = useLocalePath();

// Wishlist Logic
const { data: wishlistStatus } = useIsWishlistedQuery(computed(() => props.tourId));
const toggleWishlistMutation = useToggleWishlistMutation();

const isWishlisted = computed(() => wishlistStatus.value?.isWishlisted || false);

const toggleWishlist = async () => {
    if (!isAuthenticated.value) {
        ElMessage.warning(t('review.loginRequired'));
        return;
    }

    try {
        const wasWishlisted = isWishlisted.value;
        await toggleWishlistMutation.mutateAsync(props.tourId);

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

const handleBookNow = () => {
    if (!isAuthenticated.value) {
        ElMessage.warning(t('review.loginRequired'));
        router.push(localePath(`/login?redirect=/booking/${props.tourId}`));
        return;
    }
    // Navigate to booking flow
    router.push(localePath(`/booking/${props.tourId}`));
};


const shareOn = (platform: string) => {
    const url = window.location.href;
    const title = document.title;

    const shareUrls: Record<string, string> = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
    };

    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
};

const { formatPrice: formatCurrency } = useCurrency();

const formatPrice = (price: number | string) => {
    return formatCurrency(price);
};
</script>

<template>
    <aside class="booking-card" :aria-label="t('tour.bookTourNow')">
        <div class="booking-card__price">
            <span class="booking-card__amount">{{ formatPrice(price) }}</span>
            <span v-if="originalPrice" class="booking-card__original">{{ formatPrice(originalPrice) }}</span>
            <p class="booking-card__per-person">{{ t('tour.pricePerPerson') }}</p>
        </div>

        <dl class="booking-card__facts">
            <div>
                <dt>{{ t('tour.time') }}</dt>
                <dd>{{ duration }}</dd>
            </div>
            <div>
                <dt>{{ t('tour.groupSize') }}</dt>
                <dd>{{ groupSize }}</dd>
            </div>
            <div v-if="difficulty">
                <dt>{{ t('tour.difficultyLabel') }}</dt>
                <dd>{{ difficulty }}</dd>
            </div>
        </dl>

        <div class="booking-card__actions">
            <UiButton block @click="handleBookNow">{{ t('tour.bookTourNow') }}</UiButton>
            <UiButton block variant="outline" class="booking-card__wishlist" :class="{ 'is-active': isWishlisted }"
                :aria-pressed="isWishlisted" @click="toggleWishlist">
                <svg class="booking-card__heart" :fill="isWishlisted ? 'currentColor' : 'none'" stroke="currentColor"
                    stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {{ isWishlisted ? t('tour.saved') : t('tour.saveTour') }}
            </UiButton>
        </div>

        <div class="booking-card__share">
            <p class="booking-card__share-label">{{ t('tour.shareThisTour') }}</p>
            <div class="booking-card__share-list">
                <button type="button" class="booking-card__share-btn" :aria-label="t('tour.share.facebook')"
                    @click="shareOn('facebook')">Facebook</button>
                <button type="button" class="booking-card__share-btn" :aria-label="t('tour.share.twitter')"
                    @click="shareOn('twitter')">Twitter</button>
                <button type="button" class="booking-card__share-btn" :aria-label="t('tour.share.whatsapp')"
                    @click="shareOn('whatsapp')">WhatsApp</button>
            </div>
        </div>

        <div class="booking-card__trust">
            <p class="booking-card__trust-title">{{ t('tour.moneyBack') }}</p>
            <p class="booking-card__trust-desc">{{ t('tour.cancelBefore') }}</p>
        </div>
    </aside>
</template>

<style scoped>
.booking-card {
    display: block;
    padding: var(--space-6);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--color-surface);
}

@media (min-width: 64rem) {
    .booking-card {
        position: sticky;
        top: calc(var(--header-height) + 1.5rem);
    }
}

.booking-card__price {
    padding-bottom: var(--space-5);
    margin-bottom: var(--space-5);
    border-bottom: 1px solid var(--color-border);
}

.booking-card__amount {
    font-family: var(--font-serif);
    font-size: var(--text-h3);
    font-variant-numeric: lining-nums;
    line-height: var(--leading-tight);
}

.booking-card__original {
    margin-left: var(--space-3);
    color: var(--color-text-muted);
    font-size: var(--text-lg);
    text-decoration: line-through;
}

.booking-card__per-person {
    margin-top: 0.375rem;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.booking-card__facts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(6rem, 1fr));
    gap: var(--space-4);
    padding-bottom: var(--space-5);
    margin-bottom: var(--space-5);
    border-bottom: 1px solid var(--color-border);
}

.booking-card__facts dt {
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.booking-card__facts dd {
    margin-top: 0.25rem;
    font-family: var(--font-serif);
    font-size: var(--text-lg);
    line-height: var(--leading-snug);
}

.booking-card__actions {
    display: grid;
    gap: var(--space-3);
}

.booking-card__heart {
    width: 1.125rem;
    height: 1.125rem;
}

.booking-card__wishlist.is-active {
    border-color: var(--color-danger);
    color: var(--color-danger);
}

.booking-card__share {
    padding-top: var(--space-5);
    margin-top: var(--space-5);
    border-top: 1px solid var(--color-border);
}

.booking-card__share-label {
    margin-bottom: var(--space-3);
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.booking-card__share-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
}

.booking-card__share-btn {
    min-height: 2.25rem;
    padding: 0 var(--space-4);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-pill);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    transition: border-color var(--transition-base), color var(--transition-base);
}

.booking-card__share-btn:hover {
    border-color: var(--color-text);
    color: var(--color-text);
}

.booking-card__share-btn:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}

.booking-card__trust {
    padding-top: var(--space-5);
    margin-top: var(--space-5);
    border-top: 1px solid var(--color-border);
}

.booking-card__trust-title {
    font-weight: var(--weight-medium);
}

.booking-card__trust-desc {
    margin-top: 0.25rem;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}
</style>
