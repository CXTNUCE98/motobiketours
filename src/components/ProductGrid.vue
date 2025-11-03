<script setup lang="ts">
const products = [
    {
        id: 1,
        name: 'Small Logo Baseball Black/Beige',
        price: 29.99,
        image: 'https://down-vn.img.susercontent.com/file/c7db377b177fc8e2ff75a769022dcc23',
        category: 'Accessories',
        rating: 4.5,
    },
    {
        id: 2,
        name: 'Small Patch Baseball White/Black',
        price: 39.99,
        image: 'https://aothudong.com/upload/product/atd-479/bo-quan-ao-thu-dong-hang-hieu.jpg',
        category: 'T-Shirts',
        rating: 4.8,
    },
    {
        id: 3,
        name: 'Basic Logo White Shirt',
        price: 49.99,
        image: 'https://salt.tikicdn.com/cache/w300/ts/product/a8/6d/19/7d656516c64f75658ae9906723ada711.jpg',
        category: 'Shirts',
        rating: 4.2,
    },
    {
        id: 4,
        name: 'Classic Black Pant',
        price: 59.99,
        image: 'https://salt.tikicdn.com/cache/w300/ts/product/01/56/ec/26036061a9a3aba26157a0ec285c8613.jpg',
        category: 'Pants',
        rating: 4.7,
    }
];

const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
};

const getRatingStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
};

const isShowPreviewProduct = ref(false)
function handleQuickView() {
    isShowPreviewProduct.value = true
}
</script>

<template>
    <section class="py-12 px-4 md:px-8">
        <div class="container mx-auto">
            <div class="flex items-center justify-between mb-8">
                <h2 class="text-2xl md:text-3xl font-bold">SHOP THE LEGACY CAPSULE</h2>
                <NuxtLink to="/shop" 
                    class="text-sm font-medium hover:underline transition-all duration-300">
                    View All →
                </NuxtLink>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                <div v-for="product in products" :key="product.id"
                    class="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
                    <!-- Product Image Container -->
                    <div class="relative aspect-w-1 aspect-h-1 overflow-hidden">
                        <img :src="product.image" 
                            :alt="product.name"
                            class="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                        >
                        <!-- Quick View Button -->
                        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                            <button @click="handleQuickView" class="bg-white text-black px-4 py-2 rounded-full text-sm font-medium transform hover:scale-105 transition-all duration-300 hover:bg-gray-100">
                                Quick View
                            </button>
                        </div>
                    </div>

                    <!-- Product Info -->
                    <div class="p-4">
                        <div class="text-xs text-gray-500 mb-1">{{ product.category }}</div>
                        <h3 class="text-sm font-medium mb-1 truncate">{{ product.name }}</h3>
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-bold">{{ formatPrice(product.price) }}</span>
                            <span class="text-yellow-400 text-xs">{{ getRatingStars(product.rating) }}</span>
                        </div>
                    </div>

                    <!-- Add to Cart Button - Appears on Hover -->
                    <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <button class="w-full bg-black text-white py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors duration-300">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <ProductDetailDialog v-model:visible="isShowPreviewProduct" @close="isShowPreviewProduct = false " />
</template>

<style scoped>
.aspect-w-1 {
    position: relative;
    padding-bottom: 100%;
}

.aspect-w-1 > * {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

/* Smooth scroll behavior */
html {
    scroll-behavior: smooth;
}

/* Fade in animation for products */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.grid > div {
    animation: fadeIn 0.6s ease-out forwards;
}

.grid > div:nth-child(1) { animation-delay: 0.1s; }
.grid > div:nth-child(2) { animation-delay: 0.2s; }
.grid > div:nth-child(3) { animation-delay: 0.3s; }
.grid > div:nth-child(4) { animation-delay: 0.4s; }

/* Hover effect for rating stars */
.text-yellow-400 {
    transition: all 0.3s ease;
}

.text-yellow-400:hover {
    transform: scale(1.1);
    text-shadow: 0 0 5px rgba(250, 204, 21, 0.5);
}
</style> 