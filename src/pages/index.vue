<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    // Setup intersection observer for fade in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-top');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections with class 'fade-in-section'
    setTimeout(() => {
        document.querySelectorAll('.fade-in-section').forEach((section) => {
            observer.observe(section);
        });
    }, 100);

    const customerObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-left');
                customerObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    setTimeout(() => {
        const customerSection = document.querySelector('.customer-section-fade');
        if (customerSection) {
            customerObserver.observe(customerSection);
        }
    }, 100);
});
</script>

<template>
    <div>
        <HomeHeroSection />
        <HomeSearchSection />
        <HomePopularTours />
        <HomeDaNangTours />
        <HomeHotTours />
        <HomeTestimonials />
        <HomeNewsletter />
        <HomeTopDestinations />
        <HomeLatestNews />
    </div>
</template>

<style scoped>
/* Animation Styles */
:deep(.fade-in-section) {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

:deep(.fade-in-section.animate-fade-in-top) {
    opacity: 1;
    transform: translateY(0);
}

:deep(.customer-section-fade) {
    opacity: 0;
    transform: translateX(-50px);
    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

:deep(.customer-section-fade.animate-fade-in-left) {
    opacity: 1;
    transform: translateX(0);
}

@media only screen and (max-width: 640px) {
    :deep(.fade-in-section) {
        transform: translateY(20px);
    }
}
</style>