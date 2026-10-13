<script setup lang="ts">
import type { Tour } from '~/types/api';

// Thẻ tour trên trang danh sách. Cả thẻ bấm được (link trải rộng),
// nút quản trị nằm trên lớp link nên không lồng phần tử tương tác trong <a>.
const props = withDefaults(defineProps<{
    tour: Tour;
    layout?: 'grid' | 'list';
    editable?: boolean;
}>(), {
    layout: 'grid',
    editable: false,
});

const emit = defineEmits<{
    (e: 'edit', id: string): void;
    (e: 'delete', id: string): void;
}>();

const { t, te } = useI18n();
const localePath = useLocalePath();
const { formatPrice } = useCurrency();

const detailPath = computed(() => localePath(`/tour/${props.tour.id}`));
const typeLabels = computed(() =>
    (props.tour.type || [])
        .map((key) => (te(`tour.types.${key}`) ? t(`tour.types.${key}`) : key))
        .join(' · '),
);
</script>

<template>
    <article class="tour-card" :class="`tour-card--${layout}`">
        <div class="tour-card__media">
            <img :src="tour.thumbnail" alt="" loading="lazy" decoding="async">
            <span v-if="tour.duration" class="tour-card__duration">{{ tour.duration }}</span>
        </div>

        <div class="tour-card__body">
            <p v-if="layout === 'grid' && tour.departFrom" class="tour-card__depart">{{ tour.departFrom }}</p>
            <h3 class="tour-card__title">
                <NuxtLink :to="detailPath" class="tour-card__link">{{ tour.title }}</NuxtLink>
            </h3>

            <p v-if="layout === 'grid'" class="tour-card__route">{{ tour.routes }}</p>
            <dl v-else class="tour-card__facts">
                <div>
                    <dt>{{ t('tour.list.departure') }}</dt>
                    <dd>{{ tour.departFrom }}</dd>
                </div>
                <div>
                    <dt>{{ t('tour.list.route') }}</dt>
                    <dd>{{ tour.routes }}</dd>
                </div>
                <div v-if="typeLabels">
                    <dt>{{ t('tour.list.type') }}</dt>
                    <dd>{{ typeLabels }}</dd>
                </div>
            </dl>

            <div class="tour-card__foot">
                <p class="tour-card__price">{{ formatPrice(tour.priceUsd) }}</p>
                <span class="tour-card__more" aria-hidden="true">{{ t('tour.list.details') }} →</span>
            </div>

            <div v-if="editable" class="tour-card__admin">
                <button type="button" @click="emit('edit', tour.id)">{{ t('tour.edit') }}</button>
                <button type="button" class="is-danger" @click="emit('delete', tour.id)">
                    {{ t('tour.message.deleteBtn') }}
                </button>
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

.tour-card__body {
    display: flex;
    flex-direction: column;
}

.tour-card--grid .tour-card__body {
    padding-top: 1.125rem;
}

.tour-card__depart {
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

.tour-card__facts {
    display: grid;
    gap: var(--space-2);
    margin-top: var(--space-4);
    font-size: var(--text-ui);
}

.tour-card__facts > div {
    display: grid;
    grid-template-columns: minmax(6rem, auto) 1fr;
    gap: var(--space-4);
}

.tour-card__facts dt {
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide);
    line-height: 1.9;
    text-transform: uppercase;
}

.tour-card__foot {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-4);
    margin-top: auto;
    padding-top: var(--space-4);
}

.tour-card--grid .tour-card__foot {
    margin-top: var(--space-4);
    border-top: 1px solid var(--color-border);
}

.tour-card__price {
    font-family: var(--font-serif);
    font-size: var(--text-2xl);
    font-variant-numeric: lining-nums;
}

.tour-card__more {
    color: var(--color-text-muted);
    font-size: var(--text-md);
}

.tour-card__admin {
    position: relative;
    z-index: 1;
    display: flex;
    gap: var(--space-4);
    margin-top: var(--space-3);
}

.tour-card__admin button {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    text-decoration: underline;
    text-underline-offset: 0.25em;
}

.tour-card__admin button:hover {
    color: var(--color-text);
}

.tour-card__admin .is-danger:hover {
    color: var(--color-danger);
}

/* Dạng danh sách: ảnh và nội dung đứng cạnh nhau khi đủ rộng */
.tour-card--list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
    gap: var(--space-5) var(--space-fluid-md);
    padding-block: var(--space-fluid-sm);
    border-top: 1px solid var(--color-border);
    border-radius: 0;
}

.tour-card--list .tour-card__title {
    font-size: var(--text-title-lg);
}

.tour-card--list .tour-card__facts {
    margin-bottom: var(--space-5);
}

.tour-card--list .tour-card__foot {
    border-top: 1px solid var(--color-border);
}
</style>
