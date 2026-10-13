<script setup lang="ts">
import { ref, computed } from 'vue';
import type { HotSpot } from '~/types/api';
import { useHotSpotByIdQuery } from '~/composables/useHotSpotsQuery';
import TourGallery from '~/components/TourGallery.vue';
import ContactPopup from '~/components/ContactPopup.vue';

const props = defineProps<{
    spotId: string | null;
    modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'change-spot']);

const { t } = useI18n();

const showContactPopup = ref(false);
const contactSubject = ref('');
const contactMessage = ref('');

const { data: spot, isLoading } = useHotSpotByIdQuery(computed(() => props.spotId || ''));

const dialogVisible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});

const handleClose = () => {
    dialogVisible.value = false;
};

const openGoogleMaps = () => {
    if (spot.value?.lat && spot.value?.lng) {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${spot.value.lat},${spot.value.lng}`, '_blank');
    }
};

const contactUs = () => {
    if (!spot.value) return;
    contactSubject.value = `Custom Trip: ${spot.value.name}`;
    contactMessage.value = `I am interested in visiting ${spot.value.name} (${spot.value.address}). Please help me customize a trip here.`;
    showContactPopup.value = true;
};
</script>

<template>
    <el-dialog v-model="dialogVisible" width="90%" class="spot-dialog" :show-close="false" :lock-scroll="true"
        :before-close="handleClose" destroy-on-close align-center>
        <p v-if="isLoading" class="spot-dialog__loading">{{ t('common.loadingData') }}</p>

        <div v-else-if="spot" class="spot-dialog__content">
            <header class="spot-dialog__head">
                <div class="spot-dialog__heading">
                    <p class="spot-dialog__eyebrow">{{ spot.category }}</p>
                    <h2 class="spot-dialog__title">{{ spot.name }}</h2>
                    <el-rate :model-value="spot.rating" disabled show-score text-color="var(--color-accent)"
                        score-template="{value}" />
                </div>
                <button type="button" class="spot-dialog__close" @click="handleClose">{{ t('common.close') }}</button>
            </header>

            <div class="spot-dialog__body">
                <div class="spot-dialog__gallery">
                    <TourGallery :images="spot.images || []" :title="spot.name" />

                    <div class="spot-dialog__description">
                        <h3>{{ t('hotSpots.description') }}</h3>
                        <p>{{ spot.description }}</p>
                    </div>
                </div>

                <div class="spot-dialog__info">
                    <dl class="spot-dialog__facts">
                        <div>
                            <dt>{{ t('common.openingHours') }}</dt>
                            <dd>{{ spot.openingHours || t('common.updating') }}</dd>
                        </div>
                        <div>
                            <dt>{{ t('common.priceInfo') }}</dt>
                            <dd>{{ spot.priceInfo || t('common.free') }}</dd>
                        </div>
                        <div>
                            <dt>{{ t('common.address') }}</dt>
                            <dd>{{ spot.address }}</dd>
                        </div>
                        <div>
                            <dt>{{ t('hotSpots.coordinates') }}</dt>
                            <dd>{{ spot.lat }}, {{ spot.lng }}</dd>
                        </div>
                    </dl>

                    <div class="spot-dialog__rules">
                        <h3>{{ t('common.rules') }}</h3>
                        <ul role="list">
                            <li>{{ t('common.maintainClean') }}</li>
                            <li>{{ t('common.adhereRegulations') }}</li>
                            <li>{{ t('common.touchExhibits') }}</li>
                        </ul>
                    </div>

                    <div class="spot-dialog__actions">
                        <UiButton @click="openGoogleMaps">{{ t('common.directions') }}</UiButton>
                        <UiButton variant="outline" @click="contactUs">{{ t('common.contactUs') }}</UiButton>
                    </div>
                </div>
            </div>

            <div v-if="spot.nearby?.length" class="spot-dialog__nearby">
                <h3>{{ t('hotSpots.nearbySuggestions') }}</h3>
                <ul class="spot-dialog__nearby-grid" role="list">
                    <li v-for="near in spot.nearby" :key="near.id">
                        <button type="button" class="spot-dialog__nearby-item" @click="emit('change-spot', near.id)">
                            <span class="spot-dialog__nearby-media">
                                <img :src="near.images?.[0] || '/placeholder.jpg'" :alt="near.name" loading="lazy"
                                    decoding="async">
                            </span>
                            <span class="spot-dialog__nearby-name">{{ near.name }}</span>
                            <span class="spot-dialog__nearby-meta">{{ near.category }}</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>

        <ContactPopup v-model="showContactPopup" :subject="contactSubject" :message="contactMessage" />
    </el-dialog>
</template>

<style scoped>
.spot-dialog :deep(.el-dialog) {
    overflow: hidden;
    border-radius: var(--radius-lg);
    background: var(--color-surface);
}

.spot-dialog :deep(.el-dialog__header) {
    display: none;
}

.spot-dialog :deep(.el-dialog__body) {
    max-height: 85vh;
    padding: 0;
    overflow-y: auto;
}

.spot-dialog__loading {
    padding: var(--space-block) 0;
    color: var(--color-text-muted);
    text-align: center;
}

.spot-dialog__content {
    padding: var(--space-fluid-md);
}

.spot-dialog__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-4);
    padding-bottom: var(--space-5);
    margin-bottom: var(--space-fluid-md);
    border-bottom: 1px solid var(--color-border-strong);
}

.spot-dialog__eyebrow {
    margin-bottom: var(--space-2);
    color: var(--color-accent);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.spot-dialog__title {
    margin-bottom: var(--space-3);
    font-family: var(--font-serif);
    font-size: var(--text-h3);
    font-weight: var(--weight-regular);
    line-height: var(--leading-tight);
}

.spot-dialog__close {
    flex-shrink: 0;
    min-height: 2.5rem;
    padding-inline: var(--space-2);
    color: var(--color-text);
    font-weight: var(--weight-medium);
    text-decoration: underline;
    text-decoration-color: var(--color-accent);
    text-underline-offset: 0.35em;
}

.spot-dialog__close:hover {
    color: var(--color-accent);
}

.spot-dialog__body {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
    gap: var(--space-fluid-xl);
    align-items: start;
}

.spot-dialog__description {
    margin-top: var(--space-5);
}

.spot-dialog__description h3,
.spot-dialog__rules h3,
.spot-dialog__nearby h3 {
    margin-bottom: var(--space-3);
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.spot-dialog__description p {
    color: var(--color-text-muted);
    line-height: var(--leading-body);
    white-space: pre-line;
}

.spot-dialog__facts {
    display: grid;
    gap: 0;
}

.spot-dialog__facts > div {
    padding-block: var(--space-4);
    border-bottom: 1px solid var(--color-border);
}

.spot-dialog__facts dt {
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
}

.spot-dialog__facts dd {
    margin-top: 0.25rem;
    font-family: var(--font-serif);
    font-size: var(--text-lg);
}

.spot-dialog__rules {
    margin-top: var(--space-fluid-sm);
}

.spot-dialog__rules ul {
    display: grid;
    gap: var(--space-2);
    color: var(--color-text-muted);
    line-height: var(--leading-body);
}

.spot-dialog__rules li {
    padding-left: var(--space-4);
    position: relative;
}

.spot-dialog__rules li::before {
    content: '—';
    position: absolute;
    left: 0;
    color: var(--color-accent);
}

.spot-dialog__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    margin-top: var(--space-fluid-sm);
}

.spot-dialog__nearby {
    padding-top: var(--space-fluid-md);
    margin-top: var(--space-fluid-lg);
    border-top: 1px solid var(--color-border-strong);
}

.spot-dialog__nearby-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 9rem), 1fr));
    gap: var(--space-fluid-sm);
}

.spot-dialog__nearby-item {
    display: block;
    width: 100%;
    text-align: left;
}

.spot-dialog__nearby-media {
    display: block;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    border-radius: var(--radius-md);
    background: var(--color-bg-subtle);
}

.spot-dialog__nearby-media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-slow);
}

.spot-dialog__nearby-item:hover .spot-dialog__nearby-media img {
    transform: scale(1.03);
}

.spot-dialog__nearby-name {
    display: block;
    margin-top: var(--space-2);
    font-family: var(--font-serif);
    font-size: var(--text-lg);
    line-height: var(--leading-snug);
    transition: color var(--transition-base);
}

.spot-dialog__nearby-item:hover .spot-dialog__nearby-name {
    color: var(--color-accent);
}

.spot-dialog__nearby-meta {
    display: block;
    margin-top: 0.125rem;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.spot-dialog button:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}
</style>
