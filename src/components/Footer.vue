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
    <footer class="bg-white text-gray-700 relative overflow-hidden">
        <div class="container mx-auto px-6 py-12 relative z-10">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-8">
                <!-- Logo and Contact Info -->
                <div class="lg:col-span-3">
                    <div class="mb-6">
                        <h2 class="text-3xl font-bold">
                            <span class="text-black">THE</span><span class="text-red-600">AN</span>
                        </h2>
                    </div>
                    
                    <div class="space-y-4 text-sm">
                        <div>
                            <h3 class="font-semibold text-gray-800 mb-2">Địa chỉ</h3>
                            <p class="text-gray-600 leading-relaxed">
                                14 Nguyen Thi Thap St, Thanh Khe District, Danang City, Vietnam
                            </p>
                        </div>
                        
                        <div class="border-t border-gray-200 pt-4">
                            <h3 class="font-semibold text-gray-800 mb-2">Nhận email</h3>
                            <a href="mailto:vietnamMotorbikeGroup@gmail.com" class="text-blue-600 hover:text-blue-800 transition-colors">
                                vietnamMotorbikeGroup@gmail.com
                            </a>
                        </div>
                        
                        <div class="border-t border-gray-200 pt-4">
                            <h3 class="font-semibold text-gray-800 mb-2">Số điện thoại</h3>
                            <a href="tel:19009477" class="text-gray-700 hover:text-red-600 transition-colors font-medium">
                                (+84) 0903.579094 Mr An
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Tour Menu -->
                <div class="lg:col-span-3">
                    <div class="space-y-6">
                        <!-- Tour Nội Bật -->
                        <div>
                            <h3 class="font-bold text-gray-800 mb-4 text-lg">Tour Nội Bật</h3>
                            <ul class="space-y-2">
                                <li v-for="(link, index) in tourLinks.slice(0, 3)" :key="index">
                                    <NuxtLink :to="link.url" class="text-gray-600 hover:text-red-600 transition-colors text-sm flex items-center">
                                        <span class="mr-2">›</span>
                                        {{ link.title }}
                                    </NuxtLink>
                                </li>
                            </ul>
                        </div>
                        
                        <!-- Thư Viện Ảnh -->
                        <div>
                            <h3 class="font-bold text-gray-800 mb-4 text-lg">Thư Viện Ảnh</h3>
                            <ul class="space-y-2">
                                <li v-for="(link, index) in tourLinks.slice(3)" :key="index">
                                    <NuxtLink :to="link.url" class="text-gray-600 hover:text-red-600 transition-colors text-sm flex items-center">
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
                        <div v-for="(image, index) in galleryImages" :key="index" class="aspect-square overflow-hidden rounded">
                            <img :src="image" :alt="`Gallery ${index + 1}`" class="w-full h-full object-cover hover:scale-110 transition-transform duration-300">
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