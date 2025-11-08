<script setup lang="ts">
import { tours } from '../composables/mockup'

const router = useRouter();
function navigateToNews(id: string) {
    router.push(`/news/${id}`);
}

const features = [
    {
        icon: 'bx-shield-alt-2',
        title: '20+ Years Experience',
        description: 'Trusted by thousands of travelers worldwide with expert local guides'
    },
    {
        icon: 'bx-map',
        title: 'Custom Itineraries',
        description: 'Personalized tours tailored to your interests and schedule'
    },
    {
        icon: 'bx-support',
        title: '24/7 Support',
        description: 'Round-the-clock assistance throughout your journey'
    },
    {
        icon: 'bx-dollar-circle',
        title: 'Best Price Guarantee',
        description: 'Competitive prices with no hidden fees or charges'
    }
]

const testimonials = [
    {
        name: 'Sarah Johnson',
        country: 'USA',
        rating: 5,
        comment: 'An absolutely incredible experience! Quang was an amazing guide who showed us the real Vietnam. The Ho Chi Minh trail was breathtaking.',
        image: '/carousel/1.jpg'
    },
    {
        name: 'David Miller',
        country: 'UK',
        rating: 5,
        comment: 'Best tour I\'ve ever taken. The combination of beautiful landscapes, local culture, and Quang\'s expertise made this unforgettable.',
        image: '/carousel/2.jpg'
    },
    {
        name: 'Emma Wilson',
        country: 'Australia',
        rating: 5,
        comment: 'Highly recommend! Every detail was perfectly planned. We felt safe and well-cared for throughout the entire journey.',
        image: '/carousel/3.jpg'
    }
]

const featuredTours = tours.slice(0, 3)
</script>

<template>
    <div class="bg-white">
        <!-- Features Section -->
        <section class="py-16 bg-gradient-to-b from-gray-50 to-white">
            <div class="container mx-auto px-4 max-w-7xl">
                <div class="text-center mb-12">
                    <h2 class="font-display font-bold text-3xl md:text-4xl text-secondary-800 mb-4">Why Choose Us</h2>
                    <p class="text-gray-600 max-w-2xl mx-auto">Experience the difference with Vietnam's most trusted motorbike tour operator</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div v-for="feature in features" :key="feature.title" class="bg-white p-6 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                        <div class="w-14 h-14 bg-gradient-to-br from-primary-500 to-adventure-500 rounded-lg flex items-center justify-center mb-4">
                            <i :class="`bx ${feature.icon} text-3xl text-white`"></i>
                        </div>
                        <h3 class="font-display font-semibold text-lg text-secondary-800 mb-2">{{ feature.title }}</h3>
                        <p class="text-sm text-gray-600 leading-relaxed">{{ feature.description }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- About Section -->
        <section class="py-16 bg-white">
            <div class="container mx-auto px-4 max-w-7xl">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div class="mb-4">
                            <span class="text-primary-600 font-semibold text-sm uppercase tracking-wider">About Me</span>
                            <h2 class="font-display font-bold text-3xl md:text-4xl text-secondary-800 mt-2 mb-4">Your Expert Guide to Vietnam</h2>
                        </div>
                        <div class="space-y-4 text-gray-600 leading-relaxed">
                            <p>
                                My name's <span class="font-semibold text-secondary-800">Quang</span>. I have over 20 years as a guide for tour minibus, car, and motorbike adventures. 
                                With many years of experience as a tour guide, I believe I will make guests pleased with their journey through Vietnam.
                            </p>
                            <p>
                                Join me on a cruise along the <span class="font-semibold text-secondary-800">Ho Chi Minh Trail</span> to discover the country's 54 ethnic groups, 
                                learning about the customs and traditions of each. Along this legendary path, you can admire spectacular mountains, 
                                beautiful wild waterfalls, and learn about the history that shaped Vietnam.
                            </p>
                            <p class="italic text-primary-600">
                                "I make sure that you will feel excited to discover and learn the secrets of Vietnam."
                            </p>
                        </div>
                        <div class="mt-6 flex flex-col sm:flex-row gap-4">
                            <NuxtLink to="/about" class="px-6 py-3 bg-gradient-to-r from-primary-500 to-adventure-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 text-center">
                                Learn More About Us
                            </NuxtLink>
                            <NuxtLink to="/tour" class="px-6 py-3 border-2 border-secondary-800 text-secondary-800 font-semibold rounded-lg hover:bg-secondary-800 hover:text-white transition-all duration-200 text-center">
                                View All Tours
                            </NuxtLink>
                        </div>
                    </div>
                    <div class="relative">
                        <div class="grid grid-cols-2 gap-4">
                            <img src="/h-1.jpg" alt="Vietnam Tour" class="w-full h-48 object-cover rounded-lg shadow-medium hover:scale-105 transition-transform duration-300">
                            <img src="/h-2.jpg" alt="Motorbike Adventure" class="w-full h-48 object-cover rounded-lg shadow-medium hover:scale-105 transition-transform duration-300 mt-8">
                            <img src="/h-3.jpg" alt="Local Culture" class="w-full h-48 object-cover rounded-lg shadow-medium hover:scale-105 transition-transform duration-300 -mt-8">
                            <img src="/h-4.jpg" alt="Beautiful Landscapes" class="w-full h-48 object-cover rounded-lg shadow-medium hover:scale-105 transition-transform duration-300">
                        </div>
                        <div class="absolute -bottom-6 -left-6 w-32 h-32 bg-primary-100 rounded-full -z-10"></div>
                        <div class="absolute -top-6 -right-6 w-24 h-24 bg-accent-100 rounded-full -z-10"></div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Featured Tours Section -->
        <section class="py-16 bg-gradient-to-b from-gray-50 to-white">
            <div class="container mx-auto px-4 max-w-7xl">
                <div class="text-center mb-12">
                    <span class="text-primary-600 font-semibold text-sm uppercase tracking-wider">Popular Tours</span>
                    <h2 class="font-display font-bold text-3xl md:text-4xl text-secondary-800 mt-2 mb-4">Featured Adventures</h2>
                    <p class="text-gray-600 max-w-2xl mx-auto">Discover our most popular motorbike tours through Vietnam's stunning landscapes</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                    <NuxtLink v-for="tour in featuredTours" :key="tour.id" :to="`/tour/${tour.id}`" 
                        class="group bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-strong transition-all duration-300 hover:-translate-y-2">
                        <div class="relative h-56 overflow-hidden">
                            <img :src="tour.thumbnail" :alt="tour.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                            <div class="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-primary-600">
                                {{ tour.duration }}
                            </div>
                        </div>
                        <div class="p-6">
                            <h3 class="font-display font-semibold text-lg text-secondary-800 mb-3 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
                                {{ tour.title }}
                            </h3>
                            <div class="space-y-2 mb-4">
                                <div class="flex items-center gap-2 text-sm text-gray-600">
                                    <i class='bx bx-map-pin text-primary-500'></i>
                                    <span class="line-clamp-1">{{ tour.routes }}</span>
                                </div>
                                <div class="flex items-center gap-2 text-sm text-gray-600">
                                    <i class='bx bx-current-location text-primary-500'></i>
                                    <span>From {{ tour.departFrom }}</span>
                                </div>
                            </div>
                            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div>
                                    <span class="text-xs text-gray-500">Starting from</span>
                                    <div class="font-bold text-xl text-primary-600">{{ tour.priceUsd || 'Contact' }}</div>
                                </div>
                                <span class="text-primary-600 font-semibold text-sm group-hover:translate-x-1 transition-transform duration-200">
                                    View Details →
                                </span>
                            </div>
                        </div>
                    </NuxtLink>
                </div>
                <div class="text-center">
                    <NuxtLink to="/tour" class="inline-block px-8 py-3 bg-gradient-to-r from-primary-500 to-adventure-500 text-#334155 font-semibold rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105">
                        View All Tours
                    </NuxtLink>
                </div>
            </div>
        </section>

        <!-- Testimonials Section -->
        <section class="py-16 bg-secondary-900 text-white">
            <div class="container mx-auto px-4 max-w-7xl">
                <div class="text-center mb-12">
                    <span class="text-primary-400 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
                    <h2 class="font-display font-bold text-3xl md:text-4xl mt-2 mb-4">What Our Travelers Say</h2>
                    <p class="text-gray-400 max-w-2xl mx-auto">Read reviews from our satisfied customers from around the world</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div v-for="testimonial in testimonials" :key="testimonial.name" class="bg-secondary-800 p-6 rounded-xl">
                        <div class="flex items-center gap-1 mb-4">
                            <i v-for="n in testimonial.rating" :key="n" class='bx bxs-star text-primary-500 text-lg'></i>
                        </div>
                        <p class="text-gray-300 mb-6 leading-relaxed italic">"{{ testimonial.comment }}"</p>
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-adventure-500 rounded-full flex items-center justify-center">
                                <span class="font-bold text-white">{{ testimonial.name.charAt(0) }}</span>
                            </div>
                            <div>
                                <div class="font-semibold">{{ testimonial.name }}</div>
                                <div class="text-sm text-gray-400">{{ testimonial.country }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-12 text-center">
                    <img src="/tripadvisor.png" alt="TripAdvisor" class="inline-block h-20 opacity-80 hover:opacity-100 transition-opacity duration-200">
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="py-16 bg-gradient-to-r from-primary-500 to-adventure-500">
            <div class="container mx-auto px-4 max-w-7xl text-center text-#334155">
                <h2 class="font-display font-bold text-3xl md:text-4xl mb-4">Ready to Start Your Adventure?</h2>
                <p class="text-lg mb-8 text-#334155 max-w-2xl mx-auto">
                    Book your unforgettable motorbike tour through Vietnam today and experience the journey of a lifetime
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <NuxtLink to="/contact" class="px-8 py-3.5 bg-#334155 text-primary-600 font-semibold rounded-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                        Book Your Tour Now
                    </NuxtLink>
                    <NuxtLink to="/tour" class="px-8 py-3.5 bg-transparent border-2 border-#334155 text-#334155 font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-all duration-200">
                        Browse All Tours
                    </NuxtLink>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
