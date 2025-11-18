<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useWindowScroll } from '@vueuse/core';

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
    { value: '', label: 'Số ngày' },
];

const handleSearch = () => {
    // Handle search logic here
    console.log('Search:', searchForm.value);
};

// Parallax effect for testimonial background
const testimonialBgOffset = ref(0);
const testimonialSection = ref<any>(null);

const { y: scrollY } = useWindowScroll();

watch(scrollY, () => {
    if (testimonialSection.value && typeof window !== 'undefined') {
        const rect = testimonialSection.value.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Tính toán parallax dựa trên vị trí của section trong viewport
        // Khi section vào viewport, background bắt đầu di chuyển
        if (rect.top < windowHeight && rect.bottom > 0) {
            // Tính toán offset: background di chuyển chậm hơn scroll (50% tốc độ)
            // rect.top là khoảng cách từ top của section đến top của viewport
            const scrollAmount = windowHeight - rect.top;
            // Parallax effect: background di chuyển với tốc độ 50%
            testimonialBgOffset.value = -(scrollAmount * 0.5);
        } else if (rect.bottom <= 0) {
            // Section đã scroll qua hết, giữ offset cuối cùng
            testimonialBgOffset.value = -(windowHeight * 0.5);
        } else {
            // Section chưa vào viewport
            testimonialBgOffset.value = 0;
        }
    }
});

// Newsletter form
const newsletterEmail = ref('');
const handleNewsletter = () => {
    console.log('Newsletter signup:', newsletterEmail.value);
    // Add newsletter signup logic here
};

// Testimonials data
const testimonials = [
    {
        id: 1,
        name: 'Samuel Kaisinger',
        image: '/photos/hotel1.jpg',
        text: 'Tôi và đội ngũ nhân viên chuyên nghiệp nhiệt tình, sự thân thiện, vui vẻ của nhân viên ở Tripo giúp có cảm giác thoải mái, tự nhiên và sẵn sàng quay lại với công ty du lịch trong những chuyến đi tiếp theo.'
    },
    {
        id: 2,
        name: 'Maurice Nygaard',
        image: '/photos/hotel2.jpg',
        text: 'Cảm ơn Trekeel đã mang đến cho tôi một kỳ nghỉ du lịch hoàn hảo về trải nghiệm văn hóa chân thực và điều mà chúng tôi đánh giá cao là dịch vụ của công ty cho các chuyến đi tiếp theo và giới thiệu quảng bá đến bạn bè của tôi.'
    },
    {
        id: 3,
        name: 'John Smith',
        image: '/photos/hotel3.jpg',
        text: 'Dịch vụ tuyệt vời! Đội ngũ hướng dẫn viên rất chuyên nghiệp và nhiệt tình. Tôi sẽ chắc chắn quay lại và giới thiệu cho bạn bè.'
    }
];

// Carousel state
const currentTestimonialIndex = ref(0);
let carouselInterval: ReturnType<typeof setInterval> | null = null;

// Function to change testimonial
const goToTestimonial = (index: number) => {
    currentTestimonialIndex.value = index;
    // Reset auto-play timer when user manually changes
    resetCarouselTimer();
};

// Auto-play carousel
const startCarousel = () => {
    // Clear existing interval if any
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }

    // Set interval to auto-advance every 5 seconds
    carouselInterval = setInterval(() => {
        currentTestimonialIndex.value = (currentTestimonialIndex.value + 1) % testimonials.length;
    }, 5000);
};

// Reset carousel timer
const resetCarouselTimer = () => {
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
    startCarousel();
};

// Pause carousel (optional - for hover pause)
const pauseCarousel = () => {
    if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
    }
};

// Resume carousel
const resumeCarousel = () => {
    if (!carouselInterval) {
        startCarousel();
    }
};

// Animation refs for fade in animations
const customerSection = ref<any>(null);

// Top Destinations tours data
const topDestinationsTours = [
    {
        id: 'nam-cat-tien',
        image: '/carousel/1.jpg',
        title: 'Tour Nam Cát Tiên 2N1D: Thiên Nhiên Hoang Sơ Rừng',
        price: 4500000,
        originalPrice: 4972000,
        discount: 9,
        rating: 5,
        duration: '3 ngày 2 đêm',
        people: '3 người',
        to: '/tour/nam-cat-tien'
    },
    {
        id: 'mien-tay',
        image: '/carousel/2.jpg',
        title: 'Tour Miền Tây 4N3D: Cái Bè - Sóc Trăng - Bạc Liêu - Cà',
        price: 3490000,
        rating: 5,
        duration: '4 ngày 3 đêm',
        people: '5 người',
        to: '/tour/mien-tay'
    },
    {
        id: 'mien-bac-hcm',
        image: '/carousel/3.jpg',
        title: 'Tour Miền Bắc 4N3D: HCM - Hạ Long - Ninh Bình - Sapa',
        price: 16780000,
        rating: 5,
        duration: '4 ngày 3 đêm',
        people: '7 người',
        to: '/tour/mien-bac-hcm'
    },
    {
        id: 'mien-bac-ha-noi',
        image: '/carousel/4.jpg',
        title: 'Tour Miền Bắc 5N4D: Hà Nội - Ninh Bình - Vịnh Hạ Long',
        price: 9100000,
        rating: 5,
        duration: '5 ngày 4 đêm',
        people: '7 người',
        to: '/tour/mien-bac-ha-noi'
    }
];

// Tour Da Nang data
const tourDaNangTours = [
    {
        id: 'hue',
        image: '/photos/cungdinhhue.jpg',
        title: 'TOUR HUẾ 1 NGÀY TỪ ĐÀ NẴNG',
        price: 750000,
        rating: 5,
        duration: '1 ngày',
        people: '2-4 người',
        badge: 'Khám phá lịch sử',
        showPeulisLabel: false,
        to: '/tour/hue'
    },
    {
        id: 'bana',
        image: '/carousel/2.jpg',
        title: 'ĐÀ NẴNG – BÀ NÀ HILLS',
        price: 1250000,
        rating: 5,
        duration: '1 ngày',
        people: '2-4 người',
        badge: 'Tour Bà Nà',
        showPeulisLabel: false,
        to: '/tour/bana'
    },
    {
        id: 'hoian',
        image: '/carousel/4.jpg',
        title: 'ĐÀ NẴNG – NGŨ HÀNH SƠN – HỘI AN',
        price: 400000,
        rating: 5,
        duration: '1 ngày',
        people: '2-4 người',
        badge: 'Tour ghép',
        showPeulisLabel: false,
        to: '/tour/hoian'
    }
];

// Tour Hot data
const tourHotTours = [
    {
        id: 'hue-hot',
        image: '/photos/cungdinhhue.jpg',
        title: 'TOUR HUẾ 1 NGÀY TỪ ĐÀ NẴNG',
        price: 750000,
        rating: 5,
        duration: '1 ngày',
        people: '2-4 người',
        badge: 'Khám phá lịch sử',
        showPeulisLabel: false,
        to: '/tour/hue'
    },
    {
        id: 'bana-hot',
        image: '/carousel/2.jpg',
        title: 'ĐÀ NẴNG – BÀ NÀ HILLS',
        price: 1250000,
        rating: 5,
        duration: '1 ngày',
        people: '2-4 người',
        badge: 'Tour Bà Nà',
        showPeulisLabel: false,
        to: '/tour/bana'
    },
    {
        id: 'hoian-hot',
        image: '/carousel/4.jpg',
        title: 'ĐÀ NẴNG – NGŨ HÀNH SƠN – HỘI AN',
        price: 400000,
        rating: 5,
        duration: '1 ngày',
        people: '2-4 người',
        badge: 'Tour ghép',
        showPeulisLabel: false,
        to: '/tour/hoian'
    },
    {
        id: 'sontra-hot',
        image: '/carousel/5.jpg',
        title: 'SƠN TRÀ – NGŨ HÀNH SƠN – HỘI AN',
        price: 450000,
        rating: 5,
        duration: '1 ngày',
        people: '2-4 người',
        badge: 'Tour Hội An',
        showPeulisLabel: false,
        to: '/tour/sontra'
    }
];

// News data
const latestNews = [
    {
        id: 'dong-nai-destinations',
        image: '/carousel/1.jpg',
        title: 'Những Điểm Đến Đẹp Lạ Không Nhiều Người Biết Ở Đồng Nai',
        date: '04/05/2024',
        views: 103,
        description: 'Ngoài khu du lịch Bửu Long, Vườn Quốc gia Nam Cát Tiên đã quá quen thuộc, Đồng Nai còn nhiều điểm tham quan độc đáo, thích hợp cho những ai yêu thích khám phá và trải nghiệm.',
        to: '/news/dong-nai-destinations'
    },
    {
        id: 'bac-giang-village',
        image: '/carousel/2.jpg',
        title: 'Làng Cổ Thuần Việt Ở Bắc Giang',
        date: '04/05/2024',
        views: 46,
        description: 'Nhịp sống chậm rãi, yên bình trên đường quê rợp bóng tre, hòa cùng khói lam chiều trên ruộng tại làng Sấu thuộc huyện Tân Yên.',
        to: '/news/bac-giang-village'
    },
    {
        id: 'thanh-hoa-tourism',
        image: '/carousel/3.jpg',
        title: 'Thanh Hóa Đón Gần 500.000 Khách Du Lịch, Gấp 9 Lần Đà Lạt',
        date: '04/05/2024',
        views: 50,
        description: 'Trong 3 ngày của kỳ nghỉ lễ Giỗ tổ Hùng Vương, các điểm du lịch của tỉnh Thanh Hóa đã đón hơn 460.000 lượt khách; doanh thu đạt 520 tỉ đồng.',
        to: '/news/thanh-hoa-tourism'
    }
];

// Hero Carousel state
const currentSlide = ref(0)
const totalSlides = 3
const isHovering = ref(false)

const slides = [
    {
        title: 'Tìm Chuyến Tham Quan Hoàn Hảo Của Bạn Tại Trekeel',
        subtitle: 'Khám Phá Thế Giới',
        description: 'Địa điểm độc đáo cả trong và ngoài nước. Mạng đến sự đa dạng để khách hàng thoải mái lựa chọn chuyến đi cho riêng mình.',
        image: '/carousel/1.jpg',
        videoThumb: '/carousel/2.jpg'
    },
    {
        title: 'Khám Phá Vẻ Đẹp Việt Nam',
        subtitle: 'Du Lịch Trọn Vẹn',
        description: 'Trải nghiệm những điểm đến tuyệt vời nhất tại Việt Nam cùng đội ngũ hướng dẫn viên chuyên nghiệp.',
        image: '/carousel/3.jpg',
        videoThumb: '/carousel/4.jpg'
    },
    {
        title: 'Hành Trình Đáng Nhớ',
        subtitle: 'Kỷ Niệm Khó Quên',
        description: 'Tạo nên những kỷ niệm đẹp cùng gia đình và bạn bè trong những chuyến đi khó quên.',
        image: '/carousel/5.jpg',
        videoThumb: '/carousel/6.jpg'
    }
]

const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % totalSlides
}

const prevSlide = () => {
    currentSlide.value = (currentSlide.value - 1 + totalSlides) % totalSlides
}

const goToSlide = (index: number) => {
    currentSlide.value = index
}

// Auto-play hero carousel
let heroAutoPlayInterval: ReturnType<typeof setInterval> | null = null

// Start carousel and setup animations on mount
onMounted(() => {
    startCarousel();

    // Setup hero carousel auto-play
    heroAutoPlayInterval = setInterval(() => {
        if (!isHovering.value) {
            nextSlide()
        }
    }, 5000)

    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    // Setup intersection observer for fade in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    // Observer for fade in top animation
    const observer = new (window as any).IntersectionObserver((entries: any[]) => {
        entries.forEach((entry: any) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-top');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe customer section for fade in left
    if (customerSection.value) {
        const customerObserver = new (window as any).IntersectionObserver((entries: any[]) => {
            entries.forEach((entry: any) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-left');
                    customerObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        customerObserver.observe(customerSection.value);
    }

    // Observe all sections with class 'fade-in-section'
    setTimeout(() => {
        document.querySelectorAll('.fade-in-section').forEach((section: any) => {
            observer.observe(section);
        });
    }, 100);
});

// Cleanup on unmount
onUnmounted(() => {
    if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
    }
    if (heroAutoPlayInterval) {
        clearInterval(heroAutoPlayInterval);
        heroAutoPlayInterval = null;
    }
});
</script>

<template>
    <div>
        <!-- Spacer for fixed header - matches header height -->

        <!-- Hero Carousel Section -->
        <div class="w-full bg-white">
            <div class="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden bg-map"
                style="z-index: 1;">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
                    <div class="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12" @mouseenter="isHovering = true"
                        @mouseleave="isHovering = false">
                        <!-- Left Content -->
                        <div class="flex-1 text-center lg:text-left space-y-4 sm:space-y-6 z-10 w-full">
                            <transition name="fade" mode="out-in">
                                <div :key="currentSlide">
                                    <p class="text-gray-600 text-xs sm:text-sm md:text-base font-medium mb-2">
                                        {{ slides[currentSlide].subtitle }}
                                    </p>
                                    <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#094174] leading-tight mb-3 sm:mb-4">
                                        {{ slides[currentSlide].title }}
                                    </h1>
                                    <p
                                        class="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0">
                                        {{ slides[currentSlide].description }}
                                    </p>
                                    <NuxtLink to="/booking"
                                        class="inline-block bg-[#1A71C7] hover:bg-[#C2185B] text-white px-6 py-2.5 sm:px-8 sm:py-3 md:px-10 md:py-4 rounded-lg font-bold text-xs sm:text-sm md:text-base uppercase tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                        ĐẶT BÂY GIỜ
                                    </NuxtLink>
                                </div>
                            </transition>
                        </div>

                        <!-- Right Image - Circular Design -->
                        <div class="flex-1 relative flex items-center justify-center w-full lg:w-auto">
                            <transition name="fade" mode="out-in">
                                <div :key="currentSlide" class="relative w-full max-w-[500px]">
                                    <!-- Main circular image -->
                                    <div
                                        class="relative w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] mx-auto">
                                        <!-- Background decorative circles -->
                                        <div
                                            class="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl">
                                        </div>

                                        <!-- Main image circle -->
                                        <div
                                            class="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-4 sm:border-6 md:border-8 border-white">
                                            <img :src="slides[currentSlide].image" :alt="slides[currentSlide].title"
                                                class="w-full h-full object-cover" />
                                        </div>

                                        <!-- Video thumbnail overlay (top left) -->
                                        <div
                                            class="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 md:-top-8 md:-left-8 w-24 h-18 sm:w-32 sm:h-24 md:w-48 md:h-36 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border-2 sm:border-4 border-white bg-white transform hover:scale-105 transition-transform duration-300">
                                            <img :src="slides[currentSlide].videoThumb" alt="Video"
                                                class="w-full h-full object-cover" />
                                            <!-- Play button -->
                                            <div class="absolute inset-0 flex items-center justify-center bg-black/20">
                                                <button
                                                    class="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-[#1A71C7] rounded-full flex items-center justify-center shadow-lg hover:bg-[#C2185B] transition-colors">
                                                    <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 text-white ml-0.5 sm:ml-1" fill="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </transition>
                        </div>
                    </div>

                    <!-- Carousel Indicators -->
                    <div class="flex justify-center items-center gap-2 mt-6 sm:mt-8 lg:mt-12">
                        <button v-for="index in totalSlides" :key="index" @click="goToSlide(index - 1)" :class="[
                            'transition-all duration-300',
                            currentSlide === index - 1
                                ? 'w-8 h-2 bg-[#1A71C7] rounded-full'
                                : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400'
                        ]" :aria-label="`Go to slide ${index}`"></button>
                    </div>
                </div>

                <!-- Decorative elements -->
                <div class="absolute top-10 right-10 w-20 h-20 bg-blue-200/20 rounded-full blur-2xl"></div>
                <div class="absolute bottom-20 left-20 w-32 h-32 bg-purple-200/20 rounded-full blur-3xl"></div>
            </div>
        </div>

        <!-- Tìm kiếm chuyến tham quan -->
        <section class="fade-in-section py-12 md:py-16 bg-gray-50">
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
                        class="w-full md:w-14 h-12 md:h-14 bg-[#1A71C7] hover:bg-[#C2185B] text-white rounded-full md:rounded-r-full md:rounded-l-none flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex-shrink-0">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>

        <!-- Popular tour -->
        <section class="fade-in-section py-12 md:py-16 bg-gray-50">
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
        <section class="fade-in-section py-12 md:py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 md:px-6">
                <div class="text-center mb-8 md:mb-12">
                    <h2 class="text-3xl md:text-4xl font-bold mb-2">
                        <span class="text-gray-800">TOUR </span>
                        <span class="text-[#1A71C7]">ĐÀ NẴNG</span>
                    </h2>
                    <p class="text-gray-600 text-lg">Tour ghép hàng ngày khởi hành từ TP Đà Nẵng giá rẻ</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <TourCard v-for="tour in tourDaNangTours" :key="tour.id" :id="tour.id" :image="tour.image"
                        :title="tour.title" :price="tour.price" :rating="tour.rating" :duration="tour.duration"
                        :people="tour.people" :badge="tour.badge" :show-peulis-label="tour.showPeulisLabel"
                        :to="tour.to" />
                </div>
            </div>
        </section>

        <!-- Tour Hot Section -->
        <section class="fade-in-section py-12 md:py-16 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 md:px-6">
                <div class="text-center mb-8 md:mb-12">
                    <h2 class="text-3xl md:text-4xl font-bold mb-2">
                        <span class="text-gray-800">TOUR </span>
                        <span class="text-[#1A71C7]">HOT</span>
                    </h2>
                    <p class="text-gray-600 text-lg">Tour được nhiều khách lựa chọn nhất</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <TourCard v-for="tour in tourHotTours" :key="tour.id" :id="tour.id" :image="tour.image"
                        :title="tour.title" :price="tour.price" :rating="tour.rating" :duration="tour.duration"
                        :people="tour.people" :badge="tour.badge" :show-peulis-label="tour.showPeulisLabel"
                        :to="tour.to" />
                </div>
            </div>
        </section>

        <!-- Parallax Background Section -->
        <div class="parallax"></div>

        <!-- Testimonials Content Section -->
        <section ref="testimonialSection" class="testimonials-content relative">
            <div class="relative z-10 h-full flex items-end justify-start">
                <div class="w-full px-2 md:px-4 lg:px-6 pb-4 md:pb-6">
                    <!-- Testimonial Card -->
                    <div ref="customerSection"
                        class="max-w-3xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative customer-section-fade"
                        @mouseenter="pauseCarousel" @mouseleave="resumeCarousel">
                        <!-- Icon xe hơi -->
                        <div class="absolute top-0 right-4 w-20 h-20 md:w-24 md:h-24">
                            <img src="/logo-car.png" alt="logo-car" class="w-full h-full object-contain">
                        </div>

                        <!-- customer -->
                        <div>
                            <p class="text-red-600 text-sm font-semibold mb-2">#KHÁCH HÀNG HÀI LÒNG</p>
                            <h2 class="text-3xl md:text-4xl font-bold text-[#094174] mb-8">
                                Khách Hàng Của Chúng Tôi Nói Gì
                            </h2>

                            <!-- Current Testimonial with transition -->
                            <transition name="fade" mode="out-in">
                                <div :key="currentTestimonialIndex">
                                    <p class="text-gray-600 text-base md:text-lg leading-relaxed mb-8">
                                        {{ testimonials[currentTestimonialIndex].text }}
                                    </p>

                                    <!-- Author -->
                                    <div class="flex items-center gap-4">
                                        <img :src="testimonials[currentTestimonialIndex].image"
                                            :alt="testimonials[currentTestimonialIndex].name"
                                            class="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-gray-200" />
                                        <div>
                                            <h3 class="text-lg md:text-xl font-bold text-[#094174]">
                                                {{ testimonials[currentTestimonialIndex].name }}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </transition>
                        </div>

                        <!-- Carousel indicators -->
                        <div class="flex justify-center gap-3 mt-8">
                            <button v-for="(testimonial, index) in testimonials" :key="testimonial.id"
                                @click="goToTestimonial(index)" :class="[
                                    'w-10 h-1.5 rounded-full transition-all duration-300',
                                    currentTestimonialIndex === index
                                        ? 'bg-red-500'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                ]" :aria-label="`Go to testimonial ${index + 1}`"></button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Newsletter Section - không có parallax -->
        <section class="fade-in-section py-20 md:py-32 bg-white">
            <div class="max-w-6xl mx-auto px-4">
                <div class="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                    <!-- Form Side -->
                    <div>
                        <p class="text-red-600 text-sm font-semibold mb-2">Nhận Ưu Đãi</p>
                        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-[#094174] mb-8">
                            Đăng Ký Cho Chúng Tôi
                        </h2>

                        <div class="space-y-4">
                            <input v-model="newsletterEmail" type="email" placeholder="Địa chỉ email......"
                                class="w-full px-6 py-4 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none text-gray-700 placeholder-gray-400 transition-all" />
                            <button @click="handleNewsletter"
                                class="bg-[#1A71C7] hover:bg-[#C2185B] text-white font-bold py-4 px-12 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                                Đăng Ký
                            </button>
                        </div>

                        <!-- Partner Logos -->
                        <!-- <div class="flex flex-wrap items-center gap-8 mt-12">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Quora_logo_2015.svg"
                                alt="Quora" class="h-8 opacity-60 hover:opacity-100 transition-opacity" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg"
                                alt="Airbnb" class="h-8 opacity-60 hover:opacity-100 transition-opacity" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Snapdeal_logo.svg"
                                alt="Snapdeal" class="h-8 opacity-60 hover:opacity-100 transition-opacity" />
                        </div> -->
                    </div>

                    <!-- Image Side -->
                    <div class="relative">
                        <img src="/news-letter-image.png" alt="Newsletter" class="w-full h-auto object-contain " />
                    </div>
                </div>
            </div>
        </section>

        <section class="fade-in-section py-12 md:py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 md:px-6">
                <!-- Header Text -->
                <div class="text-center mb-8 md:mb-12">
                    <p class="text-red-600 text-sm md:text-base font-medium mb-2">
                        Điểm Đến Hàng Đầu
                    </p>
                    <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#094174] mb-4">
                        Tour Nổi Bật Của Chúng Tôi
                    </h2>
                    <p class="text-gray-600 text-base md:text-lg max-w-3xl mx-auto">
                        Những địa điểm đặc sắc cả trong và ngoài nước. Mang đến sự đa dạng cho khách hàng thoải mái lựa
                        chọn chuyến đi cho mình.
                    </p>
                </div>

                <!-- Top Destinations Tours Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <TourCard v-for="tour in topDestinationsTours" :key="tour.id" :id="tour.id" :image="tour.image"
                        :title="tour.title" :price="tour.price" :original-price="tour.originalPrice"
                        :discount="tour.discount" :rating="tour.rating" :duration="tour.duration" :people="tour.people"
                        :to="tour.to" />
                </div>
            </div>
        </section>

        <!-- News -->
        <section class="fade-in-section py-12 md:py-16 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 md:px-6">
                <!-- Header Text -->
                <div class="text-center mb-8 md:mb-12">
                    <p class="text-red-600 text-sm md:text-base font-medium mb-2">
                        Tin Tức
                    </p>
                    <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#094174]">
                        Bài Viết Mới Nhất
                    </h2>
                </div>

                <!-- News Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <NewsCard
                        v-for="newsItem in latestNews"
                        :key="newsItem.id"
                        :id="newsItem.id"
                        :image="newsItem.image"
                        :title="newsItem.title"
                        :date="newsItem.date"
                        :views="newsItem.views"
                        :description="newsItem.description"
                        :to="newsItem.to"
                    />
                </div>
            </div>
        </section>

    </div>
</template>

<style scoped>
/* ============================================
   Background & Map Styles
   ============================================ */
.bg-map {
    background-image: url('/map.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-blend-mode: overlay;
}

/* ============================================
   Parallax & Testimonial Styles
   ============================================ */
.parallax {
    background-image: url('/testimonial-bg.jpg');
    height: 80vh;
    min-height: 500px;
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}

/* Turn off parallax scrolling for tablets and phones for better performance */
@media only screen and (max-width: 1366px) {
    .parallax {
        background-attachment: scroll;
    }
}

/* Mobile optimization */
@media only screen and (max-width: 768px) {
    .parallax {
        height: 60vh;
        min-height: 400px;
    }
}

.testimonials-content {
    background: transparent;
    position: relative;
    z-index: 10;
    margin-top: -80vh;
    height: 80vh;
    min-height: 500px;
}

@media only screen and (max-width: 768px) {
    .testimonials-content {
        margin-top: -60vh;
        height: 60vh;
        min-height: 400px;
    }
}

.testimonial-bg-layer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: -150px;
    background-image: url('/testimonial-bg.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    will-change: transform;
    z-index: 0;
}

/* ============================================
   Transition & Animation Styles
   ============================================ */
/* Unified fade transition for all carousels */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: translateX(-20px);
}

.fade-leave-to {
    opacity: 0;
    transform: translateX(20px);
}

/* Fade in from top animation for sections */
.fade-in-section {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.fade-in-section.animate-fade-in-top {
    opacity: 1;
    transform: translateY(0);
}

/* Fade in from left animation for customer section */
.customer-section-fade {
    opacity: 0;
    transform: translateX(-50px);
    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.customer-section-fade.animate-fade-in-left {
    opacity: 1;
    transform: translateX(0);
}

/* ============================================
   Responsive Utilities
   ============================================ */
@media only screen and (max-width: 640px) {
    /* Improve spacing on mobile */
    .fade-in-section {
        transform: translateY(20px);
    }
}

/* ============================================
   Performance Optimizations
   ============================================ */
/* Use will-change sparingly for better performance */
.parallax,
.testimonial-bg-layer {
    will-change: transform;
}

/* Optimize image rendering */
img {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
}
</style>