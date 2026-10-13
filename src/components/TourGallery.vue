<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
    images: string[];
    title: string;
}>();

const { t } = useI18n();

const selectedIndex = ref(0);
const showLightbox = ref(false);
const isHovering = ref(false);
const isZoomed = ref(false);

const currentImage = computed(() => props.images[selectedIndex.value] || '');

const selectImage = (index: number) => {
    selectedIndex.value = index;
};

const openLightbox = (index?: number) => {
    if (index !== undefined) {
        selectedIndex.value = index;
    }
    showLightbox.value = true;
    document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
    showLightbox.value = false;
    isZoomed.value = false;
    document.body.style.overflow = '';
};

const nextImage = () => {
    selectedIndex.value = (selectedIndex.value + 1) % props.images.length;
};

const prevImage = () => {
    selectedIndex.value = (selectedIndex.value - 1 + props.images.length) % props.images.length;
};

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
    if (!showLightbox.value) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
};

// Auto-rotate
let rotateInterval: ReturnType<typeof setInterval> | null = null;

const startAutoRotate = () => {
    if (rotateInterval) return;
    rotateInterval = setInterval(() => {
        if (!isHovering.value && !showLightbox.value) {
            nextImage();
        }
    }, 4000);
};

const stopAutoRotate = () => {
    if (rotateInterval) {
        clearInterval(rotateInterval);
        rotateInterval = null;
    }
};

// Lifecycle
import { onMounted, onBeforeUnmount } from 'vue';

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
    startAutoRotate();
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown);
    stopAutoRotate();
    document.body.style.overflow = '';
});
</script>

<template>
    <div class="tour-gallery" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
        <!-- Main image -->
        <div class="gallery-main">
            <button type="button" class="gallery-main__frame" :aria-label="t('tour.gallery.open')"
                @click="openLightbox()">
                <img :src="currentImage" :alt="title" />
            </button>

            <span class="gallery-main__counter" aria-hidden="true">{{ selectedIndex + 1 }} / {{ images.length }}</span>

            <button v-if="images.length > 1" type="button" class="gallery-main__nav gallery-main__nav--prev"
                :aria-label="t('tour.gallery.prev')" @click.stop="prevImage">
                <span aria-hidden="true">‹</span>
            </button>
            <button v-if="images.length > 1" type="button" class="gallery-main__nav gallery-main__nav--next"
                :aria-label="t('tour.gallery.next')" @click.stop="nextImage">
                <span aria-hidden="true">›</span>
            </button>
        </div>

        <!-- Thumbnails -->
        <ul v-if="images.length > 1" class="gallery-thumbs" role="list">
            <li v-for="(image, index) in images" :key="index">
                <button type="button" class="gallery-thumbs__item" :aria-current="index === selectedIndex"
                    :aria-label="t('tour.gallery.thumbnail', { index: index + 1 })" @click="selectImage(index)">
                    <img :src="image" alt="" loading="lazy" decoding="async" />
                </button>
            </li>
        </ul>

        <!-- Lightbox -->
        <ClientOnly>
            <Teleport to="body">
                <Transition name="lightbox">
                    <div v-if="showLightbox" class="gallery-lightbox" role="dialog" aria-modal="true"
                        :aria-label="title" @click="closeLightbox">
                        <div class="gallery-lightbox__bar">
                            <span class="gallery-lightbox__counter">{{ selectedIndex + 1 }} / {{ images.length }}</span>

                            <div class="gallery-lightbox__actions">
                                <button type="button" class="gallery-lightbox__btn"
                                    :aria-label="isZoomed ? t('tour.gallery.zoomOut') : t('tour.gallery.zoomIn')"
                                    @click.stop="isZoomed = !isZoomed">
                                    <span aria-hidden="true">{{ isZoomed ? '−' : '+' }}</span>
                                </button>
                                <a :href="currentImage" download target="_blank" class="gallery-lightbox__btn"
                                    :aria-label="t('tour.gallery.download')" @click.stop>
                                    <span aria-hidden="true">↓</span>
                                </a>
                                <button type="button" class="gallery-lightbox__btn" :aria-label="t('common.close')"
                                    @click="closeLightbox">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                        </div>

                        <div class="gallery-lightbox__stage" @click.stop>
                            <img :src="currentImage" :alt="title" class="gallery-lightbox__image"
                                :class="{ 'is-zoomed': isZoomed }" @click="isZoomed = !isZoomed" />
                        </div>

                        <button v-if="images.length > 1" type="button"
                            class="gallery-lightbox__nav gallery-lightbox__nav--prev" :aria-label="t('tour.gallery.prev')"
                            @click.stop="prevImage">
                            <span aria-hidden="true">‹</span>
                        </button>
                        <button v-if="images.length > 1" type="button"
                            class="gallery-lightbox__nav gallery-lightbox__nav--next" :aria-label="t('tour.gallery.next')"
                            @click.stop="nextImage">
                            <span aria-hidden="true">›</span>
                        </button>

                        <p class="gallery-lightbox__caption">{{ title }}</p>
                    </div>
                </Transition>
            </Teleport>
        </ClientOnly>
    </div>
</template>

<style scoped>
.tour-gallery {
    display: grid;
    gap: var(--space-3);
}

/* Main image */
.gallery-main {
    position: relative;
    overflow: hidden;
    border-radius: var(--radius-lg);
    background: var(--color-bg-subtle);
}

.gallery-main__frame {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
}

.gallery-main__frame img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-slow);
}

.gallery-main__frame:hover img,
.gallery-main__frame:focus-visible img {
    transform: scale(1.03);
}

.gallery-main__frame:focus-visible {
    outline: var(--focus-ring);
    outline-offset: -3px;
}

.gallery-main::after {
    content: '';
    position: absolute;
    inset: 70% 0 0;
    background: linear-gradient(to top, var(--color-scrim), transparent);
    pointer-events: none;
}

.gallery-main__counter {
    position: absolute;
    right: var(--space-4);
    bottom: var(--space-3);
    z-index: 1;
    color: var(--color-inverse-text);
    font-size: var(--text-xs);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-wide);
}

.gallery-main__nav {
    position: absolute;
    top: 50%;
    z-index: 1;
    display: grid;
    place-items: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: var(--radius-pill);
    background: color-mix(in srgb, var(--color-bg) 70%, transparent);
    color: var(--color-text);
    font-size: var(--text-2xl);
    line-height: 1;
    transform: translateY(-50%);
    transition: background-color var(--transition-base);
}

.gallery-main__nav:hover {
    background: var(--color-bg);
}

.gallery-main__nav:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}

.gallery-main__nav--prev {
    left: var(--space-4);
}

.gallery-main__nav--next {
    right: var(--space-4);
}

/* Thumbnails */
.gallery-thumbs {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(4.5rem, 1fr));
    gap: var(--space-2);
}

.gallery-thumbs__item {
    display: block;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border: 2px solid transparent;
    border-radius: var(--radius-sm);
    opacity: 0.65;
    transition: opacity var(--transition-base), border-color var(--transition-base);
}

.gallery-thumbs__item:hover {
    opacity: 1;
}

.gallery-thumbs__item[aria-current='true'] {
    border-color: var(--color-accent);
    opacity: 1;
}

.gallery-thumbs__item:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}

.gallery-thumbs__item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Lightbox */
.gallery-lightbox {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-6);
    background: var(--color-inverse-bg);
}

.gallery-lightbox__bar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    padding: var(--space-5) var(--space-6);
}

.gallery-lightbox__counter {
    color: var(--color-inverse-muted);
    font-size: var(--text-sm);
    letter-spacing: var(--tracking-wide);
}

.gallery-lightbox__actions {
    display: flex;
    gap: var(--space-3);
}

.gallery-lightbox__btn {
    display: grid;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: var(--radius-pill);
    background: color-mix(in srgb, var(--color-inverse-text) 12%, transparent);
    color: var(--color-inverse-text);
    font-size: var(--text-xl);
    line-height: 1;
    transition: background-color var(--transition-base);
}

.gallery-lightbox__btn:hover {
    background: color-mix(in srgb, var(--color-inverse-text) 22%, transparent);
}

.gallery-lightbox__btn:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}

.gallery-lightbox__stage {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 64rem;
}

.gallery-lightbox__image {
    max-width: 100%;
    max-height: 78vh;
    border-radius: var(--radius-md);
    object-fit: contain;
    cursor: zoom-in;
    transition: transform var(--transition-base);
}

.gallery-lightbox__image.is-zoomed {
    max-width: none;
    max-height: none;
    width: 100%;
    height: auto;
    cursor: zoom-out;
}

.gallery-lightbox__nav {
    position: absolute;
    top: 50%;
    display: grid;
    place-items: center;
    width: 3rem;
    height: 3rem;
    border-radius: var(--radius-pill);
    background: color-mix(in srgb, var(--color-inverse-text) 12%, transparent);
    color: var(--color-inverse-text);
    font-size: var(--text-3xl);
    line-height: 1;
    transform: translateY(-50%);
    transition: background-color var(--transition-base);
}

.gallery-lightbox__nav:hover {
    background: color-mix(in srgb, var(--color-inverse-text) 22%, transparent);
}

.gallery-lightbox__nav:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}

.gallery-lightbox__nav--prev {
    left: var(--space-6);
}

.gallery-lightbox__nav--next {
    right: var(--space-6);
}

.gallery-lightbox__caption {
    position: absolute;
    bottom: var(--space-6);
    color: var(--color-inverse-muted);
    font-family: var(--font-serif);
    font-size: var(--text-lg);
    text-align: center;
}

.lightbox-enter-active,
.lightbox-leave-active {
    transition: opacity var(--transition-base);
}

.lightbox-enter-from,
.lightbox-leave-to {
    opacity: 0;
}
</style>
