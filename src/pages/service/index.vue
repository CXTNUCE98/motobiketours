<script setup lang="ts">
import Image from "@/public/process_design.png"

import ProcessIcon1 from "@/public/work_icon1.png"
import ProcessIcon2 from "@/public/work_icon2.png"
import ProcessIcon3 from "@/public/work_icon3.png"
import ProcessIcon4 from "@/public/work_icon4.png"

const processMap = [
    {
        title: 'Lắng nghe',
        description: 'Gặp gỡ, tư vấn 1:1 với khách hàng để tìm hiểu về phòng cách, mục đích sử dụng trang phục, những điều khách hàng muốn thể hiện lên thiết kế, kết hợp moodboard, hình ảnh để truyền cảm hứng',
        image: Image,
        icon: ProcessIcon1,
        number: '01',
        reverse: false,
    },
    {
        title: 'Phác thảo',
        description: 'Thiết kế bản vẽ phác thảo, tư vấn chất liệu, màu sắc, kỹ thuật may phù hợp với mong muốn của khách hàng',
        image: Image,
        icon: ProcessIcon2,
        number: '02',
        reverse: true,
    },
    {
        title: 'Thử mẫu',
        description: 'May bản mẫu đầu tiên để khách thử. Điều chỉnh form dáng, tinh chỉnh theo ý kiến của khách hàng',
        image: Image,
        icon: ProcessIcon3,
        number: '03',
        reverse: false,
    },
    {
        title: 'Hoàn thiện',
        description: 'Sản xuất theo số lượng yêu cầu, giao thành phẩm tới tay khách hàng',
        image: Image,
        icon: ProcessIcon4,
        number: '04',
        reverse: true,
    },
]

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
</script>

<template>
    <div class="mx-auto">
        <!-- Hero -->
        <SharedHeaderPage title="Dịch vụ " subTitle="Trang chủ / Dịch vụ " />

        <!-- ProcessStep -->
        <section class="min-h-screen flex justify-center items-center py-10 px-4">
            <div
                class="bg-[#F4F0EC] max-w-[1200px] w-full rounded-[2rem] py-[60px] md:(px-12 py-[140px]) space-y-10 shadow-md">
                <div class="text-center space-y-1">
                    <h1 class="text-[32px] playfair-display font-semibold md:text-[50px] text-gray-800">Quy trình thiết
                        kế</h1>
                    <p class="text-[22px] font-normal text-gray-500">Bao gồm 4 giai đoạn chính</p>
                </div>

                <div class="space-y-[60px]">
                    <template v-for="item in processMap" :key="item.number">
                        <ProcessStep class="animate-on-scroll transition duration-700 transform opacity-0 translate-y-5"
                            :number="item.number" :title="item.title" :image="item.image" :icon="item.icon"
                            :reverse="item.reverse">
                            {{ item.description }}
                        </ProcessStep>
                    </template>
                </div>
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

.playfair-display {
    font-family: 'Playfair Display', serif;
    font-optical-sizing: auto;
}
</style>