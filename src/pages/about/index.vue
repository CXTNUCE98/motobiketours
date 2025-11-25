<script lang="ts" setup>

// Tour guides data
const tourGuides = [
    {
        id: 1,
        name: 'Jane Cooper',
        image: 'https://tte.edu.vn/public/upload/2025/01/avatar-cho39.webp',
        description: 'Hướng dẫn viên du lịch đóng vai trò quan trọng trong ngành du lịch Việt Nam, góp phần giới thiệu hình ảnh đất nước, con người Việt Nam đến với bạn bè quốc tế. Với nhiều năm kinh nghiệm và kiến thức sâu rộng về văn hóa, lịch sử, hướng dẫn viên của chúng tôi cam kết mang đến những trải nghiệm đáng nhớ cho du khách.'
    },
    {
        id: 2,
        name: 'Wade Warren',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH7wZvz7hnx8d5vw-S4y-jQNTAzrHICXvM8A&s',
        description: 'Hướng dẫn viên du lịch đóng vai trò quan trọng trong ngành du lịch Việt Nam, góp phần giới thiệu hình ảnh đất nước, con người Việt Nam đến với bạn bè quốc tế. Với nhiều năm kinh nghiệm và kiến thức sâu rộng về văn hóa, lịch sử, hướng dẫn viên của chúng tôi cam kết mang đến những trải nghiệm đáng nhớ cho du khách.'
    },
    {
        id: 3,
        name: 'Jenny Wilson',
        image: 'https://maunailxinh.com/wp-content/uploads/2025/06/avatar-meo-ngau%E2%80%8B-2.jpg',
        description: 'Hướng dẫn viên du lịch đóng vai trò quan trọng trong ngành du lịch Việt Nam, góp phần giới thiệu hình ảnh đất nước, con người Việt Nam đến với bạn bè quốc tế. Với nhiều năm kinh nghiệm và kiến thức sâu rộng về văn hóa, lịch sử, hướng dẫn viên của chúng tôi cam kết mang đến những trải nghiệm đáng nhớ cho du khách.'
    },
    {
        id: 4,
        name: 'Mamnun Khan',
        image: 'https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/avatar-anh-meo-cute-7.jpg',
        description: 'Hướng dẫn viên du lịch đóng vai trò quan trọng trong ngành du lịch Việt Nam, góp phần giới thiệu hình ảnh đất nước, con người Việt Nam đến với bạn bè quốc tế. Với nhiều năm kinh nghiệm và kiến thức sâu rộng về văn hóa, lịch sử, hướng dẫn viên của chúng tôi cam kết mang đến những trải nghiệm đáng nhớ cho du khách.'
    }
]
</script>

<template>
    <div class="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <!-- Spacer for fixed header -->

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                <!-- Left Side - Text Content -->
                <div class="space-y-6 sm:space-y-8 order-2 lg:order-1">
                    <!-- Main Title -->
                    <h1
                        class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 leading-tight">
                        ANDAGO || Đại Lý Du Lịch & Đặt Tour
                    </h1>

                    <!-- Section 1: Giới thiệu về ANDAGO -->
                    <div class="space-y-3 sm:space-y-4">
                        <h2 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Giới thiệu về ANDAGO
                        </h2>
                        <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                            ANDAGO là đại lý du lịch trực tuyến uy tín tại Việt Nam, chuyên cung cấp các dịch vụ du lịch
                            đa dạng và chất lượng cao.
                        </p>

                        <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                            Các dịch vụ chính của chúng tôi bao gồm:
                        </p>

                        <ul
                            class="space-y-1.5 sm:space-y-2 text-gray-700 dark:text-gray-300 list-disc list-inside ml-3 sm:ml-4 text-sm sm:text-base">
                            <li>Đặt vé máy bay, tàu hỏa, xe khách</li>
                            <li>Đặt phòng khách sạn, resort</li>
                            <li>Đặt tour du lịch trong nước và quốc tế</li>
                            <li>Dịch vụ visa du lịch</li>
                            <li>Dịch vụ thuê xe du lịch</li>
                            <li>Dịch vụ bảo hiểm du lịch</li>
                        </ul>

                        <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                            Với đội ngũ nhân viên chuyên nghiệp, nhiệt tình và giàu kinh nghiệm, ANDAGO cam kết mang đến
                            cho khách hàng những trải nghiệm du lịch tuyệt vời nhất.
                        </p>
                    </div>

                    <!-- Section 2: Ưu điểm -->
                    <div class="space-y-3 sm:space-y-4">
                        <h2 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Ưu điểm khi sử dụng dịch
                            vụ của ANDAGO</h2>

                        <ul
                            class="space-y-1.5 sm:space-y-2 text-gray-700 dark:text-gray-300 list-disc list-inside ml-3 sm:ml-4 text-sm sm:text-base">
                            <li>Giá cả cạnh tranh</li>
                            <li>Chất lượng dịch vụ uy tín</li>
                            <li>Sản phẩm du lịch đa dạng</li>
                            <li>Đặt tour và vé máy bay nhanh chóng, dễ dàng</li>
                            <li>Hỗ trợ tư vấn 24/7</li>
                            <li>Nhiều chương trình khuyến mãi hấp dẫn</li>
                        </ul>
                    </div>
                </div>

                <!-- Right Side - Image Collage -->
                <div class="flex flex-col gap-3 sm:gap-4 order-1 lg:order-2">
                    <!-- Top Image (Larger) -->
                    <div class="w-full h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg">
                        <img src="/photos/taynguyen.jpg" alt="Mountain adventure"
                            class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>

                    <!-- Bottom Two Images -->
                    <div class="grid grid-cols-2 gap-3 sm:gap-4">
                        <!-- Bottom Left Image -->
                        <div class="w-full h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden shadow-lg">
                            <img src="/photos/mytho1.jpg" alt="Beach relaxation"
                                class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>

                        <!-- Bottom Right Image -->
                        <div class="w-full h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden shadow-lg">
                            <img src="/photos/cungdinhhue.jpg" alt="Cultural tour"
                                class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Hướng dẫn viên du lịch Section -->
        <section class="bg-gray-50 dark:bg-gray-800 py-12 sm:py-16 md:py-20 lg:py-24 transition-colors duration-300">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Section Header -->
                <div class="text-center mb-8 sm:mb-12 md:mb-16">
                    <p
                        class="text-red-600 dark:text-red-400 text-xs sm:text-sm font-semibold mb-2 uppercase tracking-wide">
                        Hướng Dẫn Viên Du Lịch
                    </p>
                    <h2
                        class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white leading-tight">
                        Gặp Gỡ Hướng Dẫn Viên Xuất Sắc Của Chúng Tôi
                    </h2>
                </div>

                <!-- Tour Guides Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    <div v-for="guide in tourGuides" :key="guide.id"
                        class="bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                        <!-- Profile Image -->
                        <div class="relative h-64 sm:h-72 md:h-80 overflow-hidden">
                            <img :src="guide.image" :alt="guide.name"
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>

                        <!-- Card Content -->
                        <div class="p-4 sm:p-5 md:p-6">
                            <!-- Category/Role -->
                            <p
                                class="text-red-600 dark:text-red-400 text-xs sm:text-sm font-bold uppercase tracking-wide mb-2">
                                HƯỚNG DẪN VIÊN DU LỊCH
                            </p>

                            <!-- Name -->
                            <h3
                                class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">
                                {{ guide.name }}
                            </h3>

                            <!-- Description -->
                            <p class="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-4">
                                {{ guide.description }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
/* ============================================
   Image Hover Effects
   ============================================ */
img {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
}

/* Prevent layout shift on image hover */
div[class*="overflow-hidden"] {
    overflow: hidden;
}

/* ============================================
   Responsive Typography
   ============================================ */
@media (max-width: 640px) {
    h1 {
        line-height: 1.2;
    }

    h2 {
        line-height: 1.3;
    }
}

/* ============================================
   List Styling Improvements
   ============================================ */
ul {
    line-height: 1.6;
}

/* ============================================
   Spacing Utilities
   ============================================ */
@media (max-width: 640px) {
    .space-y-6>*+* {
        margin-top: 1rem;
    }
}

/* ============================================
   Line Clamp Utility
   ============================================ */
.line-clamp-4 {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
