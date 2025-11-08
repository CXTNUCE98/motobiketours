<script setup>
const tourLinks = [
    { name: 'Sai Gon Tours', path: '/tour/sai-gon' },
    { name: 'Da Nang Tours', path: '/tour/da-nang' },
    { name: 'Hoi An Tours', path: '/tour/hoi-an' },
    { name: 'Hue Tours', path: '/tour/hue' },
    { name: 'Ha Noi Tours', path: '/tour/ha-noi' },
]

const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Our Tours', path: '/tour' },
    { name: 'Photo Gallery', path: '/photos' },
    { name: 'Video Gallery', path: '/video' },
    { name: 'Booking Guide', path: '/booking' },
    { name: 'Contact Us', path: '/contact' },
]

const currentYear = new Date().getFullYear()
</script>

<template>
    <footer class="bg-secondary-900 text-white w-full max-w-7xl mx-auto">
        <div class="container mx-auto px-4">
            <!-- Main Footer Content -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
                <!-- Company Info -->
                <div class="lg:col-span-1">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-adventure-500 rounded-lg flex items-center justify-center">
                            <i class='bx bx-trip text-white text-2xl'></i>
                        </div>
                        <div>
                            <div class="font-display font-bold text-lg">Vietnam Adventures</div>
                            <div class="text-xs text-gray-400">Motorbike Tours</div>
                        </div>
                    </div>
                    <p class="text-sm text-gray-400 mb-4 leading-relaxed">
                        Experience authentic Vietnam through breathtaking landscapes and hidden gems on two wheels. Over 20 years of trusted service.
                    </p>
                    <div class="flex gap-3">
                        <a href="#" class="w-10 h-10 bg-secondary-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-colors duration-200">
                            <i class='bx bxl-facebook text-xl'></i>
                        </a>
                        <a href="#" class="w-10 h-10 bg-secondary-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-colors duration-200">
                            <i class='bx bxl-instagram text-xl'></i>
                        </a>
                        <a href="#" class="w-10 h-10 bg-secondary-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-colors duration-200">
                            <i class='bx bxl-youtube text-xl'></i>
                        </a>
                        <a href="#" class="w-10 h-10 bg-secondary-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-colors duration-200">
                            <i class='bx bxl-tripadvisor text-xl'></i>
                        </a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div>
                    <h3 class="font-display font-semibold text-lg mb-4">Quick Links</h3>
                    <ul class="space-y-2">
                        <li v-for="link in quickLinks" :key="link.path">
                            <NuxtLink :to="link.path" class="text-sm text-gray-400 hover:text-primary-500 transition-colors duration-200 flex items-center gap-2">
                                <i class='bx bx-chevron-right text-xs'></i>
                                {{ link.name }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <!-- Popular Tours -->
                <div>
                    <h3 class="font-display font-semibold text-lg mb-4">Popular Tours</h3>
                    <ul class="space-y-2">
                        <li v-for="link in tourLinks" :key="link.path">
                            <NuxtLink :to="link.path" class="text-sm text-gray-400 hover:text-primary-500 transition-colors duration-200 flex items-center gap-2">
                                <i class='bx bx-map-pin text-xs'></i>
                                {{ link.name }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <!-- Contact Info -->
                <div>
                    <h3 class="font-display font-semibold text-lg mb-4">Contact Us</h3>
                    <ul class="space-y-3">
                        <li class="flex items-start gap-3 text-sm text-gray-400">
                            <i class='bx bx-map text-xl text-primary-500 flex-shrink-0'></i>
                            <span>14 Nguyen Thi Thap St, Thanh Khe District, Da Nang City, Vietnam</span>
                        </li>
                        <li class="flex items-center gap-3 text-sm text-gray-400">
                            <i class='bx bx-phone text-xl text-primary-500 flex-shrink-0'></i>
                            <a href="tel:+84903579094" class="hover:text-primary-500 transition-colors duration-200">
                                (+84) 0903 579 094
                            </a>
                        </li>
                        <li class="flex items-center gap-3 text-sm text-gray-400">
                            <i class='bx bx-envelope text-xl text-primary-500 flex-shrink-0'></i>
                            <a href="mailto:vietnammotorbikegroup@gmail.com" class="hover:text-primary-500 transition-colors duration-200 break-all">
                                vietnammotorbikegroup@gmail.com
                            </a>
                        </li>
                        <li class="flex items-center gap-3 text-sm text-gray-400">
                            <i class='bx bx-globe text-xl text-primary-500 flex-shrink-0'></i>
                            <a href="http://www.danangmotorbiketours.com" target="_blank" rel="noopener noreferrer" class="hover:text-primary-500 transition-colors duration-200">
                                danangmotorbiketours.com
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Bottom Bar -->
            <div class="border-t border-secondary-800 py-6">
                <div class="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
                    <p>© {{ currentYear }} Vietnam Motorbike Adventures. All rights reserved.</p>
                    <div class="flex items-center gap-4">
                        <NuxtLink to="/privacy" class="hover:text-primary-500 transition-colors duration-200">Privacy Policy</NuxtLink>
                        <span class="text-gray-600">|</span>
                        <NuxtLink to="/terms" class="hover:text-primary-500 transition-colors duration-200">Terms of Service</NuxtLink>
                        <span class="text-gray-600">|</span>
                        <a href="https://web360.com.vn" target="_blank" rel="noopener noreferrer" class="hover:text-primary-500 transition-colors duration-200">
                            Powered by Web360
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.container {
    max-width: 1280px;
}
</style>