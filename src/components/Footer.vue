<script setup>
const tourLinks = [
    { title: 'Tour Miền Bắc 2', url: '/tour/city/mien-bac' },
    { title: 'Tour Miền Bắc 1', url: '/tour/city/mien-bac' },
    { title: 'Tour Miền Bắc', url: '/tour/city/mien-bac' },
    { title: 'Tour Miền Trung', url: '/tour/city/mien-trung' },
    { title: 'Tour Miền Nam', url: '/tour/city/mien-nam' },
    { title: 'Tour Trong Nước', url: '/tour' },
    { title: 'Tour Châu Á', url: '/tour' }
];

const galleryImages = [
    '/carousel/1.jpg',
    '/carousel/2.jpg',
    '/carousel/3.jpg',
    '/carousel/4.jpg',
    '/carousel/5.jpg',
    '/carousel/6.jpg'
];
</script>

<template>
    <footer
        class="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 relative overflow-hidden border-t border-gray-200 dark:border-gray-800">
        <div class="container mx-auto px-6 py-12 relative z-10">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-8">
                <!-- Logo and Contact Info -->
                <div class="lg:col-span-3">
                    <div class="mb-6">
                        <h2 class="text-3xl font-bold">
                            <span class="text-black dark:text-white">AN</span><span class="text-[#1A71C7]">DAGO</span>
                        </h2>
                    </div>

                    <div class="space-y-4 text-sm">
                        <div>
                            <h3 class="font-semibold text-gray-800 dark:text-white mb-2">Địa chỉ</h3>
                            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                                53 Phạm Ngọc Mậu, Thanh Khê, Đà Nẵng
                            </p>
                        </div>

                        <div class="border-t border-gray-200 dark:border-gray-800 pt-4">
                            <h3 class="font-semibold text-gray-800 dark:text-white mb-2">Nhận email</h3>
                            <a href="mailto:contact.andago@gmail.com"
                                class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                                contact.andago@gmail.com
                            </a>
                        </div>

                        <div class="border-t border-gray-200 dark:border-gray-800 pt-4">
                            <h3 class="font-semibold text-gray-800 dark:text-white mb-2">Số điện thoại</h3>
                            <a href="tel:0854242357"
                                class="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium">
                                0854.242.357 (Mr An)
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Tour Menu -->
                <div class="lg:col-span-3">
                    <div class="space-y-6">
                        <!-- Tour Nội Bật -->
                        <div>
                            <h3 class="font-bold text-gray-800 dark:text-white mb-4 text-lg">Tour Nội Bật</h3>
                            <ul class="space-y-2">
                                <li v-for="(link, index) in tourLinks.slice(0, 3)" :key="index">
                                    <NuxtLink :to="link.url"
                                        class="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors text-sm flex items-center">
                                        <span class="mr-2">›</span>
                                        {{ link.title }}
                                    </NuxtLink>
                                </li>
                            </ul>
                        </div>

                        <!-- Thư Viện Ảnh -->
                        <div>
                            <h3 class="font-bold text-gray-800 dark:text-white mb-4 text-lg">Thư Viện Ảnh</h3>
                            <ul class="space-y-2">
                                <li v-for="(link, index) in tourLinks.slice(3)" :key="index">
                                    <NuxtLink :to="link.url"
                                        class="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors text-sm flex items-center">
                                        <span class="mr-2">›</span>
                                        {{ link.title }}
                                    </NuxtLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Gallery -->
                <div class="lg:col-span-4">
                    <div class="grid grid-cols-3 gap-2">
                        <div v-for="(image, index) in galleryImages" :key="index"
                            class="aspect-square overflow-hidden rounded">
                            <img :src="image" :alt="`Gallery ${index + 1}`"
                                class="w-full h-full object-cover hover:scale-110 transition-transform duration-300">
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </footer>
</template>

<style scoped>
.container {
    max-width: 1400px;
}
</style>