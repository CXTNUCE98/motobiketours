<script lang="ts" setup>
import Product1 from "@/public/art_create.jpg"
import Product2 from "@/public/process_design.png"

import Product3 from "@/public/colection_1.jpg"
import Product4 from "@/public/colection_2.jpg"
import Product5 from "@/public/colection_3.jpg"
import Product6 from "@/public/colection_4.jpg"

import Product7 from "@/public/products/product_1.png"
import Product8 from "@/public/products/product_2.png"
import Product9 from "@/public/products/product_3.png"
import Product10 from "@/public/products/product_4.png"
import Product11 from "@/public/products/product_5.png"
import Product12 from "@/public/products/product_6.png"
import Product13 from "@/public/products/product_7.png"
import Product14 from "@/public/products/product_8.png"

import Product15 from "@/public/products/product_9.jpg"
import Product16 from "@/public/products/product_10.jpg"
import Product17 from "@/public/products/product_11.jpg"
import Product18 from "@/public/products/product_12.jpg"
import Product19 from "@/public/products/product_13.jpg"
import Product20 from "@/public/products/product_14.jpg"
import Product21 from "@/public/products/product_15.jpg"
import Product22 from "@/public/products/product_16.jpg"
import Product23 from "@/public/products/product_17.jpg"

// Data for the gallery items
const galleryItems = [
    {
        id: 1,
        image: Product22,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 2,
        image: Product15,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 3,
        image: Product16,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 4,
        image: Product17,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 5,
        image: Product18,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 6,
        image: Product19,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 7,
        image: Product20,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 8,
        image: Product21,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    }
];

const galleryItems1 = [
    {
        id: 1,
        image: Product7,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 2,
        image: Product23,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 3,
        image: Product14,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 4,
        image: Product2,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 5,
        image: Product4,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 6,
        image: Product6,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 7,
        image: Product11,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 8,
        image: Product9,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    }
];

const galleryItems2 = [
    {
        id: 1,
        image: Product13,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 2,
        image: Product2,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 3,
        image: Product3,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 4,
        image: Product4,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 5,
        image: Product5,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 6,
        image: Product6,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 7,
        image: Product2,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 8,
        image: Product3,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    }
];

const galleryItems3 = [
    {
        id: 1,
        image: Product8,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 2,
        image: Product2,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 3,
        image: Product4,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 4,
        image: Product10,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 5,
        image: Product12,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 6,
        image: Product1,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 7,
        image: Product6,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    },
    {
        id: 8,
        image: Product9,
        title: 'Title',
        subtitle: 'Subtitle / Subtitle'
    }
];

const activeGallery = ref(galleryItems)
// Tab navigation
const tabs = [
    { id: 1, label: 'BST 1', active: true },
    { id: 2, label: 'BST 2' },
    { id: 3, label: 'BST 3' },
    { id: 4, label: 'BST 4' }
];

const activeTab = ref(1); // Default to SET 2 which is active

const setActiveTab = (tabId: number) => {
    activeTab.value = tabId;
    if (tabId === 1)
        activeGallery.value = galleryItems
    else if (tabId === 2)
        activeGallery.value = galleryItems1
    else if (tabId === 3)
        activeGallery.value = galleryItems2
    else
        activeGallery.value = galleryItems3

};
// Animation for gallery items
onMounted(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target as HTMLElement;

                // Nếu là gallery item thì dùng delay theo data-index
                if (el.classList.contains('gallery-item')) {
                    const delay = el.dataset.index ? parseInt(el.dataset.index) * 100 : 0;
                    setTimeout(() => {
                        el.classList.add('opacity-100', 'translate-y-0');
                    }, delay);
                }
                // Nếu là phần tử animate-on-scroll thông thường
                else if (el.classList.contains('animate-on-scroll')) {
                    el.classList.remove('opacity-0', 'translate-y-5');
                    el.classList.add('opacity-100', 'translate-y-0');
                }

                observer.unobserve(el);
            }
        });
    }, { threshold: 0.1 });

    // Gán index cho gallery-item
    document.querySelectorAll('.gallery-item').forEach((el, index) => {
        el.setAttribute('data-index', index.toString());
        observer.observe(el);
    });

    // Quan sát các phần tử animate-on-scroll
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
});

</script>

<template>
    <div class="mx-auto">
        <!-- Hero -->
        <SharedHeaderPage title="Bộ sưu tập" subTitle="Trang chủ / Bộ sưu tập" />

        <div class="max-w-6xl mx-auto px-4 py-8">
            <!-- Tab navigation -->
            <div class="flex justify-center mb-8">
                <div class="inline-flex rounded-18px border-1 h-50px md:h-75px border-#C4A484">
                    <button v-for="tab in tabs" :key="tab.id" @click="setActiveTab(tab.id)" :class="[
                        'md:px-16 px-0 py-2 font-medium text-18px min-w-100px',
                        activeTab === tab.id
                            ? 'bg-#CDA274 rounded-18px text-white'
                            : 'bg-transparent text-gray-700 '
                    ]">
                        {{ tab.label }}
                    </button>
                </div>
            </div>

            <!-- Masonry gallery -->
             <div class="columns-1 md:columns-2 gap-6 space-y-6">
                <div v-for="(item, index) in activeGallery" :key="item.id"
                    class="gallery-item break-inside-avoid mb-6 opacity-0 translate-y-8 transition-all duration-700 ease-out">
                    <div class="overflow-hidden bg-white  ">
                        <img :src="item.image" :alt="item.title"
                            class="w-full h-auto transition-transform duration-500 " />
                        <div class="">
                            <h3 class="text-25px  playfair-display text-#292F36">{{ item.title }} </h3>
                            <p class="text-22px text-#4D5053">{{ item.subtitle }}</p>
                        </div>
                    </div>
                </div>
            </div>           
        </div>
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
    font-weight: 400;
}


/* For the image layout similar to the reference */
@media (min-width: 1024px) {
    .grid {
        grid-template-rows: masonry;
    }
}

/* Smooth transitions */
button {
    transition: all 0.3s ease;
}

/* For browsers that don't support prefer-reduced-motion */
@media (prefers-reduced-motion: no-preference) {
    .gallery-item {
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
}
</style>
