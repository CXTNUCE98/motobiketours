<script setup lang="ts">
import { ref } from 'vue';
import { logger } from '~/utils/logger';

const newsletterEmail = ref('');
const handleNewsletter = () => {
    logger.log('Newsletter signup:', newsletterEmail.value);
    // TODO: Implement newsletter signup functionality
};
</script>

<template>
    <section class="fade-in-section py-20 md:py-32 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div class="max-w-6xl mx-auto px-4">
            <div class="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                <!-- Form Side -->
                <div>
                    <p class="text-red-600 dark:text-red-400 text-sm font-semibold mb-2">Nhận Ưu Đãi</p>
                    <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-[#094174] dark:text-blue-400 mb-8">
                        Đăng Ký Cho Chúng Tôi
                    </h2>

                    <div class="space-y-4">
                        <input v-model="newsletterEmail" type="email" placeholder="Địa chỉ email......"
                            class="w-full px-6 py-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 focus:outline-none transition-all" />
                        <button @click="handleNewsletter"
                            class="bg-[#1A71C7] hover:bg-[#C2185B] text-white font-bold py-4 px-12 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                            Đăng Ký
                        </button>
                    </div>
                </div>

                <!-- Image Side -->
                <div class="relative">
                    <img src="/news-letter-image.png" alt="Newsletter" loading="lazy"
                        class="w-full h-auto object-contain " />
                </div>
            </div>
        </div>
    </section>
</template>
