<script lang="ts" setup>
import HeroImage from "@/public/hero_header.png"

// Form data
const name = ref('');
const email = ref('');
const message = ref('');

// Animation logic for scroll reveal
onMounted(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target as HTMLElement;
                el.classList.remove('opacity-0', 'translate-y-5');
                el.classList.add('opacity-100', 'translate-y-0');
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
});

// Form submission
const submitForm = () => {
    console.log('Form submitted', { name: name.value, email: email.value, message: message.value });
    name.value = '';
    email.value = '';
    message.value = '';
};
</script>

<template>
    <div class="mx-auto">
        <!-- Hero -->
        <SharedHeaderPage title="Về chúng tôi" subTitle="Trang chủ / Về chúng tôi" />

        <!-- Quote -->
        <section class="max-w-875px md:block hidden mx-auto px-6 md:px-0 mb-24 h-428px">
            <div class="relative animate-on-scroll opacity-0 translate-y-5 transition-all duration-700 w-full h-full">
                <!-- Background image -->
                <img class="absolute inset-0 w-full h-full object-cover z-0" src="@/public/frame.png" alt="frame_img" />

                <!-- Overlay text centered -->
                <div class="absolute inset-0 flex items-center justify-center flex-col text-center z-10 px-4">
                    <div class="flex justify-center">
                        <i class='bx bxs-quote-alt-left text-30px italic'></i>
                    </div>
                    <p class="text-35px italic font-light playfair-display font-400 pt-24px pb-34px">
                        Style is a way to say who you are without having to speak.
                    </p>
                    <p class="text-sm text-gray-600">- Rachel Zoe</p>
                </div>
            </div>
        </section>

        <!-- What we do -->
        <div class="flex md:px-0 px-6 justify-center">
            <section class="max-w-1200px mb-24">
                <div class="flex flex-col md:flex-row gap-8 items-center">
                    <div
                        class="w-full md:(w-1/2 text-left) text-center animate-on-scroll opacity-0 translate-y-5 transition-all duration-700">
                        <h2 class="text-32px md:text-50px font-500 mb-4 playfair-display">Chúng tôi làm gì?</h2>
                        <p class="text-gray-700 text-base md:text-22px font-400 leading-200%">
                            Chúng tôi tạo nên những thiết kế nương vào nét hiện đại, thanh lịch và đầy tinh tế.
                        </p>
                        <p class="text-gray-700 mb-4 text-base md:text-22px font-400 leading-200%">
                            Không chỉ mang lại không gian, chúng tôi sẽ mang đến cho bạn những điều thú vị nhất về chất
                            liệu
                            chúng tôi sử dụng được đặc biệt tạo ra từ hương liệu, bột màu được cấu cú một cách đắt đỏ.
                        </p>
                    </div>
                    <div
                        class="w-full h-full max-w-660px animate-on-scroll opacity-0 translate-y-5 transition-all duration-700 delay-100">
                        <img :src="HeroImage" alt="Interior design"
                            class="w-full h-full rounded-24px md:rounded-70px shadow-md" />
                    </div>
                </div>
            </section>
        </div>

        <!-- What you receive -->
        <div class="flex md:px-0 px-6 justify-center">
            <section class="max-w-1200px mb-24">
                <div class="flex flex-col md:flex-row-reverse gap-8 items-center">
                    <div
                        class="w-full md:(w-477px text-left) text-center animate-on-scroll opacity-0 translate-y-5 transition-all duration-700">
                        <h2 class="text-32px md:text-50px text-center font-500 mb-4 playfair-display">Thứ bạn nhận lại
                        </h2>
                        <p class="text-des md:pl-12">
                            Khách hàng của B Design không đơn thuần mặc đẹp.
                        </p>
                        <p class="text-des md:pl-12">
                            Họ trở nên nổi bật, tự tin và mang theo dấu ấn cá nhân ở bất kỳ đâu.
                        </p>
                        <p class="text-des md:pl-12">
                            Mỗi thiết kế là một tác phẩm – kết hợp giữa nghệ thuật và kỹ thuật, giữa cảm xúc và sự chỉn
                            chu.
                        </p>
                    </div>
                    <div
                        class="w-full h-full max-w-660px animate-on-scroll opacity-0 translate-y-5 transition-all duration-700 delay-100">
                        <img :src="HeroImage" alt="Interior design"
                            class="w-full h-full rounded-24px md:rounded-70px shadow-md" />
                    </div>
                </div>
            </section>
        </div>

        <!-- Contact -->
        <section class="px-6 md:px-12 mb-16">
            <div class="max-w-2xl mx-auto animate-on-scroll opacity-0 translate-y-5 transition-all duration-700">
                <h2 class="text-32px md:text-50px mb-10 text-center playfair-display">Để lại thông tin tư vấn</h2>
                <form @submit.prevent="submitForm">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label for="name" class="block mb-1 text-gray-600">Tên</label>
                            <input type="text" id="name" v-model="name"
                                class="w-full border-b border-gray-300 py-2 px-1 focus:outline-none focus:border-gray-500 transition-colors"
                                required />
                        </div>
                        <div>
                            <label for="email" class="block mb-1 text-gray-600">Email</label>
                            <input type="email" id="email" v-model="email"
                                class="w-full border-b border-gray-300 py-2 px-1 focus:outline-none focus:border-gray-500 transition-colors"
                                required />
                        </div>
                    </div>
                    <div class="mb-8">
                        <label for="message" class="block mb-1 text-gray-600">Ghi chú</label>
                        <textarea id="message" v-model="message" rows="3"
                            class="w-full border-b border-gray-300 py-2 px-1 focus:outline-none focus:border-gray-500 transition-colors"></textarea>
                    </div>
                    <div class="flex justify-center">
                        <button type="submit"
                            class="bg-gray-800 text-white px-48px py-10px rounded-12px hover:bg-gray-700 transition-colors flex justify-center items-center">
                            Gửi <i class='bx bx-right-arrow-alt text-[#C4A484]'></i>
                        </button>
                    </div>
                </form>
            </div>
        </section>
    </div>
</template>

<style scoped>
@media (prefers-reduced-motion: reduce) {
    .animate-on-scroll {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition: none !important;
    }
}

.delay-100 {
    transition-delay: 0.1s;
}

.playfair-display {
    font-family: 'Playfair Display', serif;
    font-optical-sizing: auto;
    font-weight: 500;
}

.text-des {
    color: #4D5053;
    text-align: center;
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 200%;
    /* 32px */
    letter-spacing: 0.16px;
}
</style>
