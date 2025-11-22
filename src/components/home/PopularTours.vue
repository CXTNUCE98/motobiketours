<template>
    <section class="fade-in-section py-12 md:py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-4">
            <!-- Header Text -->
            <div class="text-center mb-8 md:mb-12">
                <p class="text-red-600 dark:text-red-400 text-sm md:text-base font-medium mb-2">
                    Danh Mục Du Lịch
                </p>
                <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#094174] dark:text-blue-400">
                    Tour Phổ Biến Của Chúng Tôi
                </h2>
            </div>

            <!-- Popular Tours Grid -->
            <div class="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-10">
                <!-- Tour Miền Bắc -->
                <div class="flex flex-col items-center group cursor-pointer">
                    <div
                        class="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 mb-4 border-4 border-white dark:border-gray-800">
                        <img src="/carousel/1.jpg" alt="Tour Miền Bắc" loading="lazy"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3
                        class="text-[#094174] dark:text-blue-300 font-semibold text-sm md:text-base lg:text-lg text-center">
                        Tour Miền Bắc
                    </h3>
                </div>

                <!-- Tour Miền Trung -->
                <div class="flex flex-col items-center group cursor-pointer">
                    <div
                        class="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 mb-4 border-4 border-white dark:border-gray-800">
                        <img src="/carousel/2.jpg" alt="Tour Miền Trung" loading="lazy"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3
                        class="text-[#094174] dark:text-blue-300 font-semibold text-sm md:text-base lg:text-lg text-center">
                        Tour Miền Trung
                    </h3>
                </div>

                <!-- Tour Miền Nam -->
                <div class="flex flex-col items-center group cursor-pointer">
                    <div
                        class="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 mb-4 border-4 border-white dark:border-gray-800">
                        <img src="/carousel/3.jpg" alt="Tour Miền Nam" loading="lazy"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3
                        class="text-[#094174] dark:text-blue-300 font-semibold text-sm md:text-base lg:text-lg text-center">
                        Tour Miền Nam
                    </h3>
                </div>

                <!-- Tour Châu Á -->
                <div class="flex flex-col items-center group cursor-pointer">
                    <div
                        class="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 mb-4 border-4 border-white dark:border-gray-800">
                        <img src="/carousel/4.jpg" alt="Tour Châu Á" loading="lazy"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3
                        class="text-[#094174] dark:text-blue-300 font-semibold text-sm md:text-base lg:text-lg text-center">
                        Tour Châu Á
                    </h3>
                </div>

                <!-- Tour Châu Âu -->
                <div class="flex flex-col items-center group cursor-pointer">
                    <div
                        class="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 mb-4 border-4 border-white dark:border-gray-800">
                        <img src="/carousel/5.jpg" alt="Tour Châu Âu" loading="lazy"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3
                        class="text-[#094174] dark:text-blue-300 font-semibold text-sm md:text-base lg:text-lg text-center">
                        Tour Châu Âu
                    </h3>
                </div>
            </div>
        </div>
    </section>
</template>
