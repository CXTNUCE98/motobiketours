<script setup lang="ts">
const router = useRouter();
function navigateToNews(id: string) {
    router.push(`/news/${id}`);
}

// Search form state
const searchForm = ref({
    keyword: '',
    location: '',
    brand: ''
});

const locations = [
    { value: '', label: 'Địa điểm của bạn' },
    { value: 'danang', label: 'Đà Nẵng' },
    { value: 'hue', label: 'Huế' },
    { value: 'hoian', label: 'Hội An' },
    { value: 'quangnam', label: 'Quảng Nam' }
];

const brands = [
    { value: '', label: 'Thương hiệu' },
    { value: 'trekeel', label: 'Trekeel' },
    { value: 'other', label: 'Khác' }
];

const handleSearch = () => {
    // Handle search logic here
    console.log('Search:', searchForm.value);
};
</script>

<template>
    <div>
        <!-- Tìm kiếm chuyến tham quan -->
        <section class="py-12 md:py-16 bg-gray-50">
            <div class="max-w-6xl mx-auto px-4">
                <!-- Header Text -->
                <div class="text-center mb-8 md:mb-12">
                    <p class="text-red-600 text-sm md:text-base font-medium mb-2">
                        Tìm Chuyến Tham Quan Hoàn Hảo Theo Sở Thích Của Bạn !!
                    </p>
                    <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#094174]">
                        Tìm Kiếm Chuyến Đi Tốt Nhất Của Bạn
                    </h2>
                </div>

                <!-- Search Bar Container -->
                <div
                    class="bg-white rounded-16px md:rounded-full shadow-xl p-2 md:p-3 flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0">
                    <!-- Keyword Input -->
                    <div class="flex-1 md:flex-[2]">
                        <input v-model="searchForm.keyword" type="text" placeholder="Nhập từ khóa......"
                            class="w-full h-12 md:h-14 px-4 md:px-6 rounded-full md:rounded-l-full md:rounded-r-none border border-gray-200 focus:outline-none text-sm md:text-base " />
                    </div>

                    <!-- Location Dropdown -->
                    <div class="flex-1 relative">
                        <select v-model="searchForm.location"
                            class="w-full h-12 md:h-14 px-4 md:px-6 rounded-full md:rounded-none border border-gray-200 border-l-0 focus:outline-none appearance-none bg-white text-sm md:text-base cursor-pointer ">
                            <option v-for="loc in locations" :key="loc.value" :value="loc.value">
                                {{ loc.label }}
                            </option>
                        </select>
                        <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    <!-- Brand Dropdown -->
                    <div class="flex-1 relative">
                        <select v-model="searchForm.brand"
                            class="w-full h-12 md:h-14 px-4 md:px-6 rounded-full md:rounded-none border border-gray-200 border-l-0  focus:outline-none appearance-none bg-white text-sm md:text-base cursor-pointer ">
                            <option v-for="brand in brands" :key="brand.value" :value="brand.value">
                                {{ brand.label }}
                            </option>
                        </select>
                        <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    <!-- Search Button -->
                    <button @click="handleSearch"
                        class="w-full md:w-14 h-12 md:h-14 bg-[#E91E63] hover:bg-[#C2185B] text-white rounded-full md:rounded-r-full md:rounded-l-none flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex-shrink-0">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>

        <!-- Popular tour -->
        <section class="py-12 md:py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4">
                <!-- Header Text -->
                <div class="text-center mb-8 md:mb-12">
                    <p class="text-red-600 text-sm md:text-base font-medium mb-2">
                        Danh Mục Du Lịch
                    </p>
                    <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#094174]">
                        Tour Phổ Biến Của Chúng Tôi
                    </h2>
                </div>

                <!-- Popular Tours Grid -->
                <div class="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-10">
                    <!-- Tour Miền Bắc -->
                    <div class="flex flex-col items-center group cursor-pointer">
                        <div
                            class="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 mb-4">
                            <img src="/carousel/1.jpg" alt="Tour Miền Bắc"
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <h3 class="text-[#094174] font-semibold text-sm md:text-base lg:text-lg text-center">
                            Tour Miền Bắc
                        </h3>
                    </div>

                    <!-- Tour Miền Trung -->
                    <div class="flex flex-col items-center group cursor-pointer">
                        <div
                            class="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 mb-4">
                            <img src="/carousel/2.jpg" alt="Tour Miền Trung"
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <h3 class="text-[#094174] font-semibold text-sm md:text-base lg:text-lg text-center">
                            Tour Miền Trung
                        </h3>
                    </div>

                    <!-- Tour Miền Nam -->
                    <div class="flex flex-col items-center group cursor-pointer">
                        <div
                            class="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 mb-4">
                            <img src="/carousel/3.jpg" alt="Tour Miền Nam"
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <h3 class="text-[#094174] font-semibold text-sm md:text-base lg:text-lg text-center">
                            Tour Miền Nam
                        </h3>
                    </div>

                    <!-- Tour Châu Á -->
                    <div class="flex flex-col items-center group cursor-pointer">
                        <div
                            class="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 mb-4">
                            <img src="/carousel/4.jpg" alt="Tour Châu Á"
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <h3 class="text-[#094174] font-semibold text-sm md:text-base lg:text-lg text-center">
                            Tour Châu Á
                        </h3>
                    </div>

                    <!-- Tour Châu Âu -->
                    <div class="flex flex-col items-center group cursor-pointer">
                        <div
                            class="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 mb-4">
                            <img src="/carousel/5.jpg" alt="Tour Châu Âu"
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <h3 class="text-[#094174] font-semibold text-sm md:text-base lg:text-lg text-center">
                            Tour Châu Âu
                        </h3>
                    </div>
                </div>
            </div>
        </section>

        <!-- Tour Da Nang Section -->
        <section class="max-w-7xl mx-auto px-4 md:px-6 py-4">
            <div class="text-center mb-8">
                <h2 class="text-4xl font-bold mb-2">
                    <span class="text-gray-800">TOUR </span>
                    <span class="text-[#E91E63]">ĐÀ NẴNG</span>
                </h2>
                <p class="text-gray-600 text-lg">Tour ghép hàng ngày khởi hành từ TP Đà Nẵng giá rẻ</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Sample Tour Cards -->
                <NuxtLink to="/tour/hue"
                    class="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div class="relative h-64 overflow-hidden">
                        <img src="/photos/cungdinhhue.jpg" alt="Tour Huế"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                        <!-- Badge -->
                        <div
                            class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
                            <i class="bx bx-map text-[#FF6B35]"></i>
                            <span class="text-sm font-semibold text-gray-700">Khám phá lịch sử</span>
                        </div>

                        <!-- Price -->
                        <div
                            class="absolute top-4 right-4 bg-gradient-to-r from-[#FF6B35] to-[#E91E63] text-white px-4 py-2 rounded-full font-bold shadow-lg">
                            750.000đ
                        </div>

                        <!-- Content -->
                        <div class="absolute bottom-0 left-0 right-0 p-5 text-white">
                            <h3 class="text-xl font-bold mb-1">TOUR HUẾ 1 NGÀY TỪ ĐÀ NẴNG</h3>
                        </div>
                    </div>
                </NuxtLink>

                <NuxtLink to="/tour/bana"
                    class="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div class="relative h-64 overflow-hidden">
                        <img src="/carousel/2.jpg" alt="Bà Nà Hills"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                        <div
                            class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
                            <i class="bx bx-cable-car text-[#FF6B35]"></i>
                            <span class="text-sm font-semibold text-gray-700">Tour Bà Nà</span>
                        </div>

                        <div
                            class="absolute top-4 right-4 bg-gradient-to-r from-[#FF6B35] to-[#E91E63] text-white px-4 py-2 rounded-full font-bold shadow-lg">
                            1.250.000đ
                        </div>

                        <div class="absolute bottom-0 left-0 right-0 p-5 text-white">
                            <h3 class="text-xl font-bold mb-1">ĐÀ NẴNG – BÀ NÀ HILLS</h3>
                        </div>
                    </div>
                </NuxtLink>

                <NuxtLink to="/tour/hoian"
                    class="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div class="relative h-64 overflow-hidden">
                        <img src="/carousel/4.jpg" alt="Hội An"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                        <div
                            class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
                            <i class="bx bx-building-house text-[#FF6B35]"></i>
                            <span class="text-sm font-semibold text-gray-700">Tour ghép</span>
                        </div>

                        <div
                            class="absolute top-4 right-4 bg-gradient-to-r from-[#FF6B35] to-[#E91E63] text-white px-4 py-2 rounded-full font-bold shadow-lg">
                            400.000đ
                        </div>

                        <div class="absolute bottom-0 left-0 right-0 p-5 text-white">
                            <h3 class="text-xl font-bold mb-1">ĐÀ NẴNG – NGŨ HÀNH SƠN – HỘI AN</h3>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </section>
        <!-- Tour Hot Section -->
        <section class="max-w-7xl mx-auto px-4 md:px-6 py-4">
            <div class="text-center mb-8">
                <h2 class="text-4xl font-bold mb-2">
                    <span class="text-gray-800">TOUR </span>
                    <span class="text-[#E91E63]">HOT</span>
                </h2>
                <p class="text-gray-600 text-lg">Tour được nhiều khách lựa chọn nhất</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <NuxtLink to="/tour/hue"
                    class="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                    <div class="relative h-48 overflow-hidden">
                        <img src="/photos/cungdinhhue.jpg" alt="Tour Huế"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div
                            class="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded text-xs font-semibold text-gray-700 flex items-center gap-1">
                            <i class="bx bx-map-alt text-[#FF6B35]"></i>
                            <span>Khám phá lịch sử</span>
                        </div>
                        <div
                            class="absolute top-3 right-3 bg-gradient-to-r from-[#FF6B35] to-[#E91E63] text-white px-3 py-1 rounded-full text-sm font-bold">
                            750.000đ
                        </div>
                        <div class="absolute bottom-0 left-0 right-0 p-3 text-white">
                            <h4 class="font-bold text-sm">TOUR HUẾ 1 NGÀY TỪ ĐÀ NẴNG</h4>
                        </div>
                    </div>
                </NuxtLink>

                <NuxtLink to="/tour/bana"
                    class="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                    <div class="relative h-48 overflow-hidden">
                        <img src="/carousel/2.jpg" alt="Bà Nà"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div
                            class="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded text-xs font-semibold text-gray-700 flex items-center gap-1">
                            <i class="bx bx-cable-car text-[#FF6B35]"></i>
                            <span>Tour Bà Nà</span>
                        </div>
                        <div
                            class="absolute top-3 right-3 bg-gradient-to-r from-[#FF6B35] to-[#E91E63] text-white px-3 py-1 rounded-full text-sm font-bold">
                            1.250.000đ
                        </div>
                        <div class="absolute bottom-0 left-0 right-0 p-3 text-white">
                            <h4 class="font-bold text-sm">ĐÀ NẴNG – BÀ NÀ HILLS</h4>
                        </div>
                    </div>
                </NuxtLink>

                <NuxtLink to="/tour/hoian"
                    class="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                    <div class="relative h-48 overflow-hidden">
                        <img src="/carousel/4.jpg" alt="Hội An"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div
                            class="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded text-xs font-semibold text-gray-700 flex items-center gap-1">
                            <i class="bx bx-moon text-[#FF6B35]"></i>
                            <span>Tour ghép</span>
                        </div>
                        <div
                            class="absolute top-3 right-3 bg-gradient-to-r from-[#FF6B35] to-[#E91E63] text-white px-3 py-1 rounded-full text-sm font-bold">
                            400.000đ
                        </div>
                        <div class="absolute bottom-0 left-0 right-0 p-3 text-white">
                            <h4 class="font-bold text-sm">ĐÀ NẴNG – NGŨ HÀNH SƠN – HỘI AN</h4>
                        </div>
                    </div>
                </NuxtLink>

                <NuxtLink to="/tour/sontra"
                    class="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                    <div class="relative h-48 overflow-hidden">
                        <img src="/carousel/5.jpg" alt="Sơn Trà"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div
                            class="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded text-xs font-semibold text-gray-700 flex items-center gap-1">
                            <i class="bx bx-landscape text-[#FF6B35]"></i>
                            <span>Tour Hội An</span>
                        </div>
                        <div
                            class="absolute top-3 right-3 bg-gradient-to-r from-[#FF6B35] to-[#E91E63] text-white px-3 py-1 rounded-full text-sm font-bold">
                            450.000đ
                        </div>
                        <div class="absolute bottom-0 left-0 right-0 p-3 text-white">
                            <h4 class="font-bold text-sm">SƠN TRÀ – NGŨ HÀNH SƠN – HỘI AN</h4>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </section>

        <!-- About Section -->
        <div class="bg-white rounded-xl shadow-lg max-w-7xl mx-auto px-4 md:px-6 py-4">
            <div class="text-center mb-6">
                <h2 class="text-4xl font-bold mb-2">
                    <span class="text-gray-800">ABOUT </span>
                    <span class="text-[#E91E63]">ME</span>
                </h2>
            </div>

            <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                <p class="text-center text-lg">
                    My name's <span class="font-bold text-[#FF6B35]">Quang</span>. I have over 20 years as a guide for
                    the tour minibus-car-motorbike.
                    With many years of experience as a tour guide, I believe I will make guests please. With cruise
                    along the
                    <span class="font-semibold text-[#E91E63]">Ho Chi Minh Trail</span> to discover the country's 54
                    ethnic to learn about
                    the customs and traditions of each ethnic group in Vietnam.
                </p>

                <p>
                    And on the path of the legendary Ho Chi Minh you can admire the spectacular mountains,
                    beautiful waterfalls wild and learn about the history of the Ho Chi Minh trail. Is a legendary road
                    of
                    Vietnam during the war against American and I make sure that you will feel excited to discover and
                    learn
                    the secret of Vietnam country.
                </p>

                <div class="bg-gradient-to-r from-[#FFF5F0] to-[#FFE8E0] p-4 rounded-lg border-l-4 border-[#FF6B35]">
                    <p class="text-[#FF6B35] font-bold italic">My company have Car and minivan too (Guide)</p>
                </div>

                <div class="my-6 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <a href="http://thicongnhadanang.blogspot.com/" target="_blank" class="block">
                        <img class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                            alt="vietnam-danang-hoian-easyrider" src="../public/best_discover_vn.jpg" />
                    </a>
                </div>

                <div class="bg-gradient-to-r from-[#FF6B35] to-[#E91E63] text-white p-6 rounded-xl shadow-xl">
                    <h3 class="text-2xl font-bold mb-3">Why choose us?</h3>
                    <p class="text-white/95 leading-relaxed">
                        We always try to offer tourists and travellers the tours in which they get to see the
                        most spectacular views of the <strong>Central Highland</strong>, <strong>Mekong Delta</strong>,
                        countrysides, <strong>Ho Chi Minh trails</strong> through Vietnam and all about the local life
                        of
                        people that we meet on the road. This is the only way to get off the beaten tracks.
                    </p>
                </div>

                <p>
                    After working really hard for a long time, we have been strongly recommended in many different
                    guidebooks such as <span class="font-semibold">Lonely Planet</span>,
                    <span class="font-semibold">Rough Guide</span> etc...and of course in many reputed sites such as:
                </p>

                <div class="flex flex-wrap justify-center gap-3 my-4">
                    <a href="https://www.tripadvisor.com" target="_blank"
                        class="inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-[#E91E63] text-white px-5 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold">
                        <i class="bx bx-globe"></i>
                        www.tripadvisor.com
                    </a>
                    <a href="https://www.travelfish.org" target="_blank"
                        class="inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-[#E91E63] text-white px-5 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold">
                        <i class="bx bx-globe"></i>
                        www.travelfish.org
                    </a>
                    <a href="https://www.lonelyplanet.com" target="_blank"
                        class="inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-[#E91E63] text-white px-5 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold">
                        <i class="bx bx-globe"></i>
                        www.lonelyplanet.com
                    </a>
                </div>

                <div
                    class="bg-gradient-to-r from-[#FFA726] to-[#FF9800] text-white p-6 rounded-xl text-center font-bold text-2xl shadow-xl">
                    So please come and visit us about our tours and...DO IT!
                </div>
            </div>
        </div>
        <!-- Gallery & Contact Section -->
        <div class="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto px-4 md:px-6">
            <!-- Gallery -->
            <div class="w-full md:w-[60%]">
                <div class="bg-white rounded-lg shadow-lg p-4">
                    <div class="flex items-center gap-2 mb-4">
                        <div class="w-1 h-6 bg-[#FF6B35]"></div>
                        <h3 class="text-2xl font-bold text-[#1a2332]">PHOTO GALLERY</h3>
                    </div>
                    <div
                        class="rounded-lg overflow-hidden shadow-md mb-4 hover:shadow-xl transition-shadow duration-300">
                        <img class="w-full h-64 object-cover transform hover:scale-105 transition-transform duration-500"
                            src="../public/gallery.jpg" alt="gallery">
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                            <img class="w-full h-40 object-cover transform hover:scale-110 transition-transform duration-500"
                                src="../public/h-1.jpg" alt="h_1">
                        </div>
                        <div class="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                            <img class="w-full h-40 object-cover transform hover:scale-110 transition-transform duration-500"
                                src="../public/h-2.jpg" alt="h_2">
                        </div>
                        <div class="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                            <img class="w-full h-40 object-cover transform hover:scale-110 transition-transform duration-500"
                                src="../public/h-3.jpg" alt="h_3">
                        </div>
                        <div class="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                            <img class="w-full h-40 object-cover transform hover:scale-110 transition-transform duration-500"
                                src="../public/h-4.jpg" alt="h_4">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Contact -->
            <div class="w-full md:w-[40%] md:min-w-[300px]">
                <div class="bg-gradient-to-br from-[#2C3E50] to-[#34495E] rounded-xl shadow-xl p-6 text-white">
                    <div class="flex items-center gap-2 mb-4">
                        <div class="w-1 h-6 bg-[#FF6B35]"></div>
                        <h3 class="text-2xl font-bold">CONTACT INFO</h3>
                    </div>

                    <div class="bg-white/10 backdrop-blur-sm rounded-lg p-5 mb-4">
                        <p class="font-bold text-xl text-center text-[#FF6B35] mb-4 italic">QUANG EASYRIDER</p>
                        <div class="space-y-3">
                            <div
                                class="flex items-start gap-3 bg-white/10 p-3 rounded-lg hover:bg-white/20 transition-colors duration-300">
                                <span class="text-[#FFA726] font-semibold min-w-[70px]">Website:</span>
                                <a href="http://danangmotorbiketours.com" target="_blank"
                                    class="text-white hover:text-[#FFA726] transition-colors duration-300">
                                    danangmotorbiketours.com
                                </a>
                            </div>
                            <div
                                class="flex items-start gap-3 bg-white/10 p-3 rounded-lg hover:bg-white/20 transition-colors duration-300">
                                <span class="text-[#FFA726] font-semibold min-w-[70px]">Email:</span>
                                <a href="mailto:vietnammotorbikegroup@gmail.com"
                                    class="text-white hover:text-[#FFA726] transition-colors duration-300 break-all">
                                    vietnammotorbikegroup@gmail.com
                                </a>
                            </div>
                            <div
                                class="flex items-start gap-3 bg-white/10 p-3 rounded-lg hover:bg-white/20 transition-colors duration-300">
                                <span class="text-[#FFA726] font-semibold min-w-[70px]">Tel:</span>
                                <a href="tel:+84903579094"
                                    class="text-white hover:text-[#FFA726] transition-colors duration-300">
                                    (+84)0903.579094 (Mr Quang)
                                </a>
                            </div>
                            <div
                                class="flex items-start gap-3 bg-white/10 p-3 rounded-lg hover:bg-white/20 transition-colors duration-300">
                                <span class="text-[#FFA726] font-semibold min-w-[70px]">Address:</span>
                                <p class="text-white">14 Nguyen Thi Thap St, Thanh Khe District, Danang City, Vietnam
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="text-center">
                        <img class="w-full rounded-lg shadow-lg" src="../public/yellow_back.png" alt="Tripadvisor">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>