<script lang="ts" setup>
import { ref, onMounted } from 'vue';

// Dữ liệu stats
const stats = [
    { id: 1, number: 12, displayNumber: ref(0), label: 'Kinh nghiệm' },
    { id: 2, number: 85, displayNumber: ref(0), label: 'Sản phẩm' },
    { id: 3, number: 15, displayNumber: ref(0), label: 'Đã xuất bản' },
    { id: 4, number: 10, displayNumber: ref(0), label: 'Người khách hàng' }
];

const testimonials = [
    {
        name: 'Đặng Tuyết Anh',
        role: 'Thanh Xuân, Hà Nội',
        comment: '"Tôi chọn B Design vì sự chỉn chu trong từng chi tiết. Khi nhận được sản phẩm, tôi biết mình đã chọn đúng nơi"'
    },
    {
        name: 'Đặng Tuyết Anh',
        role: 'Thanh Xuân, Hà Nội',
        comment: '"Tôi chọn B Design vì sự chỉn chu trong từng chi tiết. Khi nhận được sản phẩm, tôi biết mình đã chọn đúng nơi"'
    },
    {
        name: 'Đặng Tuyết Anh',
        role: 'Thanh Xuân, Hà Nội',
        comment: '"Tôi chọn B Design vì sự chỉn chu trong từng chi tiết. Khi nhận được sản phẩm, tôi biết mình đã chọn đúng nơi"'
    }
];

const statsRef = ref(null);
const hasAnimated = ref(false);

onMounted(() => {
    // Tạo intersection observer để theo dõi khi phần tử xuất hiện trong viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated.value) {
                animateNumbers();
                hasAnimated.value = true;
            }
        });
    }, { threshold: 0.1 });

    // Gắn observer vào phần tử stats
    if (statsRef.value) {
        observer.observe(statsRef.value);
    }
});

function animateNumbers() {
    stats.forEach((stat, index) => {
        // Thêm độ trễ cho mỗi số
        setTimeout(() => {
            const duration = 2000; // Thời gian animation (ms)
            const finalNumber = stat.number;
            const startTime = performance.now();

            function updateNumber(timestamp) {
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Hàm easing đơn giản
                const easing = 1 - Math.pow(1 - progress, 3);
                stat.displayNumber.value = Math.round(easing * finalNumber);

                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.displayNumber.value = finalNumber;
                }
            }

            requestAnimationFrame(updateNumber);
        }, index * 150); // Khởi động mỗi số sau 150ms
    });
}
</script>

<template>
    <!-- About me -->
    <section class="py-8 sm:py-10 md:py-16 px-4">
        <div class="max-w-6xl mx-auto">
            <!-- Title -->

            <!-- Content -->
            <!-- <div class="text-base sm:text-lg md:text-xl leading-relaxed text-gray-700">
                <p class="mb-6">
                    My name's <strong>Quang</strong>. I have over <strong>20 years</strong> as a guide for the tour
                    minibus-car-motorbike. With many years of experience as a tour guide, I believe I will make guests
                    please. With cruise along the <strong>Ho Chi Minh Trail</strong> to discover the country's
                    <strong>54 ethnic</strong> to learn about the customs and traditions of each ethnic group in
                    Vietnam. And on the path of the legendary Ho Chi Minh you can admire the spectacular mountains,
                    beautiful waterfalls wild and learn about the history of the Ho Chi Minh trail. Is a legendary road
                    of Vietnam during the war against American and I make sure that you will feel excited to discover
                    and learn the secret of Vietnam country.
                </p>

                <p class="mb-6 font-semibold text-gray-800">
                    My company have <strong>Car</strong> and <strong>minivan</strong> too (Guide)
                </p>

                <img src="../public/best_discover_vn.jpg" alt="best_discover_vn" class="w-full h-full object-cover">
                <p class="mb-6">
                    Why choose us? We always try to offer tourists and travellers the tours in which they get to see the
                    most spectacular views of the <strong>Central Highland</strong>, <strong>Mekong Delta</strong>,
                    countrysides, <strong>Ho Chi Minh trails</strong>
                    through Vietnam and all about the local life of people that we meet on the road. This is the only
                    way to get off the beaten tracks.
                </p>
                <p>
                    After working really hard for a long time, we have been strongly recommended in many different
                    guidebooks such as Lonely Planet, Rough Guide etc...and of course in many reputed sites such as
                </p>
                <div>www.tripadvisor.com;</div>
                <div>www.travelfish.org;</div>
                <div>www.lonelyplanet.com;</div>

                <p class="mt-6">So please come and visit us about our tours and...DO IT !</p>
            </div> -->

            <div class="DetailC"><span style="font-size:24px"><strong>ABOUT ME</strong></span><br>
                <br>
                My name’s Quang. I have over 20 years as a guide for the tour minibus-car-motorbike. With many years of
                experience as a tour guide, I belive I will make guests please. With cruise along the Ho Chi Minh Trail
                to discover the country's 54 ethnic to learn about the customs and traditions of each ethnic group in
                Vietnam. And on the path of the legendary Ho Chi Minh you can admire the spectacular mountains,
                beautiful waterfalls wild and learn about the history of the Ho Chi Minh trail. Is a legendary road of
                Vietnam during the war against American and I make sure that you will feel excited to discover and learn
                the secret of Vietnam country.<br>
                <br>
                My company have Car and minivan too (Guide)
                <div style="text-align: center;">
                    <a href="http://thicongnhadanang.blogspot.com/">
                        <img class="w-full h-full object-cover" alt="vietnam-danang-hoian-easyrider"
                            src="../public/best_discover_vn.jpg" />
                    </a>
                </div>
                Why choose us? We always try to offer tourists and travellers the tours in which they get to see the
                most spectacular views of the&nbsp;<strong>Central Highland</strong>,&nbsp;<strong>Mekong
                    Delta</strong>, countrysides,&nbsp;<strong>Ho Chi Minh trails</strong>&nbsp;through Vietnam and all
                about the local life of people that we meet on the road. This is the only way to get off the beaten
                tracks.<br>
                <br>
                After working really hard for a long time, we have been strongly recommended in many different
                guidebooks such as Lonely Planet, Rough Guide etc...and of course in many reputed sites such as<br>
                <u>www.tripadvisor.com</u>;<br>
                <u>www.travelfish.org</u>;&nbsp;<br>
                <u>www.lonelyplanet.com</u>&nbsp;<br>
                etc...<br>
                <br>
                So please come and visit us about our tours and...DO IT !<br>
                &nbsp;
            </div>

            <!-- Page facebook -->
            <div class="flex justify-center items-center my-8 sm:my-10 md:my-12">
                <!-- Page facebook -->
                <div class="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
                    <iframe
                        src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fquangmotorbiketours&tabs=timeline&width=500&height=450&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                        width="500" height="120" class="w-full border-none overflow-hidden max-w-full">
                    </iframe>
                </div>
                <!-- Map -->
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7865151.0039991485!2d100.60649716662665!3d15.729659658322086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31157a4d736a1e5f%3A0xb03bb0c9e2fe62be!2zVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1762162784619!5m2!1svi!2s"
                    width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade">
                </iframe>

            </div>
        </div>
    </section>
</template>

<style scoped>
.honey-img {
    height: 690px;
    width: 474px;
    overflow: hidden;
}

.vertical-text {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
    white-space: nowrap;
    font-family: Arial, sans-serif;
    font-size: 51px;
    color: #E6E6E6;
    font-weight: bold;
}

/* Hiệu ứng đếm số */
.odometer-animation {
    display: inline-block;
    position: relative;
}

.odometer-animation span {
    font-size: 16px;
    vertical-align: super;
    opacity: 0.8;
}

/* CSS cơ bản */
.container {
    max-width: 1136px;
}

/* Smooth transitions */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Media queries */
@media (max-width: 768px) {
    .odometer-animation {
        font-size: 65px;
    }
}

.dm-serif {
    font-family: "DM Serif Display", serif;
    font-weight: 400;
    font-style: normal;
}

.playfair-display {
    font-family: "Playfair Display", serif;
    font-optical-sizing: auto;
    font-style: normal;
}
</style>