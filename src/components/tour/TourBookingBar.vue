<script setup lang="ts">
// Thanh giá + nút đặt tour dính đáy màn hình. Chỉ hiện dưới 64rem, khi thẻ đặt tour
// không còn nằm cạnh nội dung mà bị đẩy xuống cuối trang.
const props = defineProps<{
    tourId: string;
    price?: number | string;
}>();

const { t } = useI18n();
const { formatPrice } = useCurrency();
const bookTour = useBookTour();

const hasPrice = computed(() => Number(props.price) > 0);

// Chừa chỗ dưới footer để thanh không che nội dung cuối trang
useHead({ bodyAttrs: { class: 'has-booking-bar' } });
</script>

<template>
    <div class="booking-bar" role="region" :aria-label="t('tour.bookTourNow')">
        <div class="booking-bar__price">
            <p v-if="hasPrice">
                <strong>{{ formatPrice(price) }}</strong>
                <span>{{ t('tour.perPerson') }}</span>
            </p>
            <p v-else><strong>{{ t('tour.priceOnRequest') }}</strong></p>
            <small>{{ t('tour.cancelBefore') }}</small>
        </div>
        <UiButton @click="bookTour(tourId)">{{ t('tour.bookTourNow') }}</UiButton>
    </div>
</template>

<style scoped>
.booking-bar {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 900;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    padding: var(--space-3) var(--gutter) calc(var(--space-3) + env(safe-area-inset-bottom, 0px));
    border-top: 1px solid var(--color-border);
    background: var(--color-surface);
}

@media (min-width: 64rem) {
    .booking-bar {
        display: none;
    }
}

.booking-bar__price {
    display: grid;
    min-width: 0;
    line-height: var(--leading-snug);
}

.booking-bar__price strong {
    font-family: var(--font-serif);
    font-size: var(--text-2xl);
    font-weight: var(--weight-regular);
    font-variant-numeric: lining-nums;
}

.booking-bar__price span {
    margin-left: var(--space-1);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.booking-bar__price small {
    overflow: hidden;
    color: var(--color-accent);
    font-size: var(--text-xs);
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>

<style>
/* Không scoped: đệm cho body để footer không bị thanh đặt tour che */
@media (max-width: 63.99rem) {
    body.has-booking-bar {
        padding-bottom: 5rem;
    }
}
</style>
