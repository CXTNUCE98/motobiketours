<script setup lang="ts">
import type { HotSpot } from '~/types/api';

const props = defineProps<{
    spot: HotSpot;
    isShowAdd?: boolean;
    isLocating?: boolean;
    isInTrip?: boolean;
}>();

defineEmits<{
    (e: 'edit', spot: HotSpot): void;
    (e: 'delete', id: string): void;
    (e: 'addToTrip', spot: HotSpot): void;
    (e: 'removeFromTrip', id: string): void;
}>();

const { t } = useI18n();
const { user } = useAuth();
const isAdmin = computed(() => user.value?.isAdmin);

// Tính lại nhãn khoảng cách mỗi khi đổi ngôn ngữ để phần dịch cập nhật đúng.
const distanceLabel = computed(() => {
    if (props.spot.distance === undefined || props.spot.distance === null) return '';
    return t('hotSpots.distance', { distance: Math.round(props.spot.distance * 10) / 10 });
});
</script>

<template>
    <article class="spot-card">
        <div class="spot-card__media">
            <img :src="spot.images?.[0] || '/placeholder-spot.jpg'" :alt="spot.name" loading="lazy" decoding="async">
            <span v-if="distanceLabel" class="spot-card__distance">{{ distanceLabel }}</span>
            <span v-else-if="isLocating" class="spot-card__distance spot-card__distance--muted">
                {{ t('hotSpots.locating') }}
            </span>
        </div>

        <div class="spot-card__body">
            <p class="spot-card__eyebrow">
                {{ spot.category }}<template v-if="spot.isHot"> · {{ t('hotSpots.hotBadge') }}</template>
            </p>
            <h3 class="spot-card__title">{{ spot.name }}</h3>
            <p class="spot-card__address">{{ spot.address }}</p>

            <div class="spot-card__foot">
                <el-rate :model-value="spot.rating" disabled show-score text-color="var(--color-accent)"
                    score-template="{value}" size="small" />

                <template v-if="isShowAdd">
                    <button v-if="!isInTrip" type="button" class="spot-card__trip-btn"
                        @click.stop="$emit('addToTrip', spot)">
                        {{ t('hotSpots.addToTrip') }}
                    </button>
                    <button v-else type="button" class="spot-card__trip-btn is-added"
                        @click.stop="$emit('removeFromTrip', spot.id)">
                        {{ t('hotSpots.added') }}
                    </button>
                </template>
            </div>

            <div v-if="isAdmin" class="spot-card__admin">
                <button type="button" @click.stop="$emit('edit', spot)">{{ t('common.edit') }}</button>
                <button type="button" class="is-danger" @click.stop="$emit('delete', spot.id)">
                    {{ t('common.remove') }}
                </button>
            </div>
        </div>
    </article>
</template>

<style scoped>
.spot-card {
    position: relative;
    border-radius: var(--radius-md);
}

.spot-card__media {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border-radius: var(--radius-md);
    background: var(--color-bg-subtle);
}

.spot-card__media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-slow);
}

.spot-card:hover .spot-card__media img {
    transform: scale(1.03);
}

.spot-card__media::after {
    content: '';
    position: absolute;
    inset: 60% 0 0;
    background: linear-gradient(to top, var(--color-scrim), transparent);
    pointer-events: none;
}

.spot-card__distance {
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

.spot-card__distance--muted {
    font-style: italic;
    text-transform: none;
    letter-spacing: normal;
    opacity: 0.85;
}

.spot-card__body {
    display: flex;
    flex-direction: column;
    padding-top: 1.125rem;
}

.spot-card__eyebrow {
    margin-bottom: 0.375rem;
    color: var(--color-accent);
    font-size: var(--text-2xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.spot-card__title {
    font-family: var(--font-serif);
    font-size: var(--text-title);
    font-weight: var(--weight-regular);
    line-height: var(--leading-snug);
    transition: color var(--transition-base);
}

.spot-card:hover .spot-card__title {
    color: var(--color-accent);
}

.spot-card__address {
    display: -webkit-box;
    margin-top: var(--space-2);
    overflow: hidden;
    color: var(--color-text-muted);
    font-size: var(--text-ui);
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
}

.spot-card__foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    margin-top: var(--space-4);
    padding-top: var(--space-4);
    border-top: 1px solid var(--color-border);
}

.spot-card__trip-btn {
    position: relative;
    z-index: 1;
    min-height: 2.25rem;
    padding: 0 var(--space-4);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-pill);
    color: var(--color-text);
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    transition: background-color var(--transition-base), color var(--transition-base), border-color var(--transition-base);
}

.spot-card__trip-btn:hover {
    border-color: var(--color-text);
}

.spot-card__trip-btn.is-added {
    border-color: var(--color-accent);
    color: var(--color-accent);
}

.spot-card__admin {
    position: relative;
    z-index: 1;
    display: flex;
    gap: var(--space-4);
    margin-top: var(--space-3);
}

.spot-card__admin button {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    text-decoration: underline;
    text-underline-offset: 0.25em;
}

.spot-card__admin button:hover {
    color: var(--color-text);
}

.spot-card__admin .is-danger:hover {
    color: var(--color-danger);
}

.spot-card :deep(.el-rate__text) {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.spot-card button:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}
</style>
