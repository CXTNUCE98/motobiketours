<script setup lang="ts">
// Thẻ đặt tour ở cột phải trang tour: giá, nút đặt, cam kết hủy, kênh liên hệ do admin cấu hình
const props = defineProps<{
    price?: number | string;
    tourId: string;
}>();

const { t } = useI18n();
const { contact, primaryPhone, primaryEmail, phoneHref, channelName } = useSiteSettings();
const { formatPrice } = useCurrency();
const bookTour = useBookTour();

const hasPrice = computed(() => Number(props.price) > 0);

// Chỉ lấy kênh nhắn tin (bỏ mạng xã hội như Facebook, YouTube), theo thứ tự khách quốc tế hay dùng
const CHAT_TYPES = ['whatsapp', 'zalo', 'messenger', 'viber', 'line', 'kakaotalk', 'telegram', 'wechat'];
const chatChannels = computed(() =>
    (contact.value?.channels || [])
        .filter((channel) => CHAT_TYPES.includes(channel.type) && channel.url)
        .sort((a, b) => CHAT_TYPES.indexOf(a.type) - CHAT_TYPES.indexOf(b.type))
        .slice(0, 3),
);
const hasHelp = computed(() => chatChannels.value.length > 0 || !!primaryPhone.value || !!primaryEmail.value);
</script>

<template>
    <aside class="booking-card" :aria-label="t('tour.bookTourNow')">
        <p class="booking-card__price">
            <template v-if="hasPrice">
                <span class="booking-card__amount">{{ formatPrice(price) }}</span>
                <span class="booking-card__per-person">{{ t('tour.perPerson') }}</span>
            </template>
            <span v-else class="booking-card__amount">{{ t('tour.priceOnRequest') }}</span>
        </p>

        <div class="booking-card__trust">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                stroke-linejoin="round" aria-hidden="true">
                <path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z" />
                <path d="M8.8 12.2l2.2 2.2 4.2-4.4" />
            </svg>
            <div>
                <p class="booking-card__trust-title">{{ t('tour.moneyBack') }}</p>
                <p class="booking-card__trust-desc">{{ t('tour.cancelBefore') }}</p>
            </div>
        </div>

        <UiButton block @click="bookTour(tourId)">{{ t('tour.bookTourNow') }}</UiButton>
        <p class="booking-card__hint">{{ t('tour.bookingHint') }}</p>

        <div v-if="hasHelp" class="booking-card__help">
            <p class="booking-card__help-title">{{ t('tour.askBeforeBooking') }}</p>
            <ul class="booking-card__help-list" role="list">
                <li v-for="channel in chatChannels" :key="channel.url">
                    <a :href="channel.url" target="_blank" rel="noopener">{{ channelName(channel) }}</a>
                </li>
                <li v-if="primaryPhone">
                    <a :href="phoneHref(primaryPhone.number)">{{ primaryPhone.number }}</a>
                </li>
                <li v-if="primaryEmail">
                    <a :href="`mailto:${primaryEmail}`">{{ primaryEmail }}</a>
                </li>
            </ul>
        </div>
    </aside>
</template>

<style scoped>
.booking-card {
    display: grid;
    gap: var(--space-4);
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
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: var(--space-2);
}

.booking-card__amount {
    font-family: var(--font-serif);
    font-size: var(--text-h3);
    font-variant-numeric: lining-nums;
    line-height: var(--leading-tight);
}

.booking-card__per-person {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.booking-card__trust {
    display: flex;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-md);
    background: var(--color-bg-subtle);
}

.booking-card__trust svg {
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
    margin-top: 0.125rem;
    color: var(--color-accent);
}

.booking-card__trust-title {
    font-size: var(--text-md);
    font-weight: var(--weight-medium);
}

.booking-card__trust-desc {
    margin-top: 0.125rem;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.booking-card__hint {
    margin-top: calc(-1 * var(--space-2));
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    text-align: center;
}

.booking-card__help {
    padding-top: var(--space-4);
    border-top: 1px solid var(--color-border);
}

.booking-card__help-title {
    margin-bottom: var(--space-3);
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.booking-card__help-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
}

.booking-card__help-list a {
    display: inline-flex;
    align-items: center;
    min-height: 2.25rem;
    padding: 0 var(--space-4);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-pill);
    color: var(--color-text);
    font-size: var(--text-sm);
    text-decoration: none;
    overflow-wrap: anywhere;
    transition: border-color var(--transition-base);
}

.booking-card__help-list a:hover {
    border-color: var(--color-text);
}

.booking-card__help-list a:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}
</style>
