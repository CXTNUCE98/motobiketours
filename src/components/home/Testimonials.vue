<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
const { t } = useI18n();
import { testimonials } from '@/data/homeData';

// Carousel state
const currentTestimonialIndex = ref(0);
let carouselInterval: ReturnType<typeof setInterval> | null = null;

const goToTestimonial = (index: number) => {
    currentTestimonialIndex.value = index;
    resetCarouselTimer();
};

const startCarousel = () => {
    if (carouselInterval) clearInterval(carouselInterval);
    carouselInterval = setInterval(() => {
        currentTestimonialIndex.value = (currentTestimonialIndex.value + 1) % testimonials.length;
    }, 5000);
};

const resetCarouselTimer = () => {
    if (carouselInterval) clearInterval(carouselInterval);
    startCarousel();
};

const pauseCarousel = () => {
    if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
    }
};

const resumeCarousel = () => {
    if (!carouselInterval) startCarousel();
};

onMounted(() => {
    startCarousel();
});

onUnmounted(() => {
    if (carouselInterval) clearInterval(carouselInterval);
});
</script>

<template>
    <section class="testimonials" aria-labelledby="testimonials-title" @mouseenter="pauseCarousel"
        @mouseleave="resumeCarousel">
        <div class="shell">
            <UiSectionHeading id="testimonials-title" :eyebrow="t('home.testimonialsSubtitle')"
                :title="t('home.testimonialsTitle')" />

            <Transition name="fade" mode="out-in">
                <blockquote :key="currentTestimonialIndex" class="testimonial">
                    <p class="testimonial__quote">{{ testimonials[currentTestimonialIndex].text }}</p>
                    <footer class="testimonial__meta">
                        <img :src="testimonials[currentTestimonialIndex].image" alt="" class="testimonial__avatar"
                            loading="lazy">
                        <cite class="testimonial__name">{{ testimonials[currentTestimonialIndex].name }}</cite>
                    </footer>
                </blockquote>
            </Transition>

            <div class="testimonial-nav" role="group" :aria-label="t('home.testimonialsTitle')">
                <button v-for="(item, index) in testimonials" :key="item.id" type="button" class="testimonial-dot"
                    :aria-current="currentTestimonialIndex === index ? 'true' : undefined"
                    :aria-label="t('home.testimonialGoTo', { n: index + 1 })" @click="goToTestimonial(index)" />
            </div>
        </div>
    </section>
</template>

<style scoped>
.testimonials {
    --em-color: var(--color-inverse-accent);
    padding-block: var(--section-space);
    background: var(--color-inverse-bg);
    color: var(--color-inverse-text);
}

.testimonial {
    max-width: 44rem;
    margin: var(--space-fluid-xl) 0 0;
}

.testimonial__quote {
    position: relative;
    padding-left: var(--space-8);
    font-family: var(--font-serif);
    font-size: var(--text-h3);
    font-style: italic;
    line-height: var(--leading-snug);
    text-wrap: balance;
}

.testimonial__quote::before {
    content: '\201C';
    position: absolute;
    top: -0.5rem;
    left: 0;
    color: var(--color-inverse-accent);
    font-family: var(--font-serif);
    font-size: var(--text-display);
    font-style: normal;
    line-height: 1;
}

.testimonial__meta {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-top: var(--space-fluid-lg);
}

.testimonial__avatar {
    width: 3rem;
    height: 3rem;
    border: 1px solid var(--color-inverse-border);
    border-radius: 50%;
    object-fit: cover;
}

.testimonial__name {
    font-size: var(--text-ui);
    font-style: normal;
    font-weight: var(--weight-medium);
}

.testimonial-nav {
    display: flex;
    gap: var(--space-2);
    margin-top: var(--space-fluid-lg);
    padding-top: var(--space-6);
    border-top: 1px solid var(--color-inverse-border);
}

.testimonial-dot {
    width: 1.75rem;
    height: 2px;
    background: var(--color-inverse-border);
    transition: background-color var(--transition-base);
}

.testimonial-dot:hover {
    background: var(--color-inverse-muted);
}

.testimonial-dot[aria-current='true'] {
    background: var(--color-inverse-accent);
}

.testimonial-dot:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 3px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity var(--transition-base);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
