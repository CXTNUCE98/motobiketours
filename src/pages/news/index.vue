<script setup lang="ts">
// @ts-nocheck
import { ref, computed } from 'vue'
import { news } from '../../composables/mockup'

const selectedCategory = ref('all')
const searchQuery = ref('')

const categories = [
  { id: 'all', name: 'All News', icon: 'bx-news' },
  { id: 'tours', name: 'Tours', icon: 'bx-map' },
  { id: 'bikes', name: 'Motorcycles', icon: 'bx-cycling' },
  { id: 'destinations', name: 'Destinations', icon: 'bx-world' }
]

const filteredNews = computed(() => {
  let filtered = news

  if (searchQuery.value) {
    filtered = filtered.filter(n =>
      n.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      n.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  return filtered
})

const featuredNews = computed(() => filteredNews.value[0])
const regularNews = computed(() => filteredNews.value.slice(1))
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
    <!-- Hero Section -->
    <div class="relative py-24 md:py-32 overflow-hidden mb-16">
      <!-- Background Elements -->
      <div class="absolute inset-0 bg-[#0f172a]">
        <!-- Animated Mesh Gradient -->
        <div class="absolute inset-0 opacity-40">
          <div
            class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-600 blur-[120px] animate-pulse">
          </div>
          <div
            class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600 blur-[120px] animate-pulse"
            style="animation-delay: 2s"></div>
          <div
            class="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-yellow-500 blur-[100px] animate-pulse"
            style="animation-delay: 4s"></div>
        </div>
        <!-- Grid Pattern -->
        <div class="absolute inset-0 opacity-10"
          style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 40px 40px;"></div>
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-4xl mx-auto text-center">
          <div
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-orange-300 text-sm font-bold mb-8 animate-fade-in">
            <span class="relative flex h-2 w-2">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            TIN TỨC & SỰ KIỆN
          </div>

          <h1 class="text-5xl md:text-7xl font-black mb-8 leading-tight animate-fade-in" style="animation-delay: 0.2s">
            <span class="block text-white">Khám Phá</span>
            <span
              class="block bg-gradient-to-r from-orange-400 via-yellow-300 to-blue-400 bg-clip-text text-transparent filter drop-shadow-sm">
              Những Câu Chuyện Mới
            </span>
          </h1>

          <p class="text-xl md:text-2xl mb-12 text-blue-100/80 max-w-2xl mx-auto leading-relaxed animate-fade-in"
            style="animation-delay: 0.4s">
            Cập nhật những tin tức mới nhất về các cung đường, kinh nghiệm đi phượt và những câu chuyện truyền cảm hứng.
          </p>

          <!-- Category Filters (Moved into Hero) -->
          <div class="flex flex-wrap items-center justify-center gap-3 mt-8 animate-fade-in"
            style="animation-delay: 0.6s">
            <button v-for="category in categories" :key="category.id" @click="selectedCategory = category.id" :class="[
              'group flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-md',
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg shadow-orange-500/30'
                : 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20'
            ]">
              <i :class="['bx', category.icon, 'text-xl', selectedCategory === category.id ? 'animate-pulse' : '']"></i>
              <span>{{ category.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Decorative Bottom Wave -->
      <div class="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            class="fill-white dark:fill-gray-900 transition-colors duration-300" />
        </svg>
      </div>
    </div>

    <!-- Search Bar (Moved below Hero) -->
    <div class="max-w-2xl mx-auto mb-16 -mt-24 relative z-20 px-4">
      <div class="relative group">
        <div
          class="absolute inset-0 bg-orange-500/20 rounded-full blur-xl group-focus-within:bg-orange-500/30 transition-all duration-500">
        </div>
        <i
          class="bx bx-search absolute left-6 top-1/2 -translate-y-1/2 text-2xl text-gray-400 group-focus-within:text-orange-500 transition-colors"></i>
        <input v-model="searchQuery" type="text" placeholder="Tìm kiếm tin tức, điểm đến..."
          class="w-full pl-16 pr-6 py-5 rounded-full border border-white/20 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl focus:ring-2 focus:ring-orange-500/50 outline-none transition-all duration-300 text-lg shadow-2xl text-gray-900 dark:text-white" />
      </div>
    </div>

    <!-- Featured News (First Item) -->
    <div v-if="featuredNews" class="max-w-7xl mx-auto px-4 mb-16 animate-fade-in">
      <div
        class="relative group overflow-hidden rounded-3xl shadow-2xl hover:shadow-orange-500/20 transition-all duration-500">
        <!-- Background Image with Overlay -->
        <div class="relative h-[500px] overflow-hidden">
          <img :src="featuredNews.thumbnail" :alt="featuredNews.title"
            class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        </div>

        <!-- Content Overlay -->
        <div class="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
          <div class="flex items-center gap-3 mb-4">
            <span
              class="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full text-sm font-bold shadow-lg">
              <i class="bx bx-star mr-1"></i>Featured Story
            </span>
            <span class="flex items-center gap-2 text-sm bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
              <i class="bx bx-calendar"></i>
              {{ featuredNews.date }}
            </span>
          </div>

          <h2 class="text-4xl md:text-5xl font-black mb-4 leading-tight">
            {{ featuredNews.title }}
          </h2>

          <p class="text-lg text-gray-200 mb-6 line-clamp-2 max-w-3xl">
            {{ featuredNews.excerpt }}
          </p>

          <router-link :to="`/news/${featuredNews.id}`"
            class="inline-flex items-center gap-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105 group/btn">
            <span>Read Full Story</span>
            <i class="bx bx-right-arrow-alt text-2xl group-hover/btn:translate-x-1 transition-transform"></i>
          </router-link>
        </div>

        <!-- Decorative Corner -->
        <div
          class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500 to-transparent opacity-30 blur-2xl">
        </div>
      </div>
    </div>

    <!-- News Grid -->
    <div class="max-w-7xl mx-auto px-4 mb-16">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-black text-gray-800 dark:text-white">
          <span class="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
            More Stories
          </span>
        </h2>
        <div class="text-gray-600 dark:text-gray-400 font-medium">
          {{ regularNews.length }} {{ regularNews.length === 1 ? 'article' : 'articles' }}
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="(n, index) in regularNews" :key="n.id" class="group animate-fade-in-up"
          :style="{ animationDelay: `${index * 100}ms` }">
          <!-- Card Container -->
          <div
            class="relative h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 transform hover:-translate-y-2 border border-transparent dark:border-gray-700">
            <!-- Image Section -->
            <div class="relative h-56 overflow-hidden">
              <router-link :to="`/news/${n.id}`">
                <img :src="n.thumbnail" :alt="n.title"
                  class="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-2 transition-all duration-700" />
              </router-link>

              <!-- Gradient Overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              </div>

              <!-- Category Badge -->
              <div class="absolute top-4 left-4">
                <span
                  class="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-orange-500 shadow-lg">
                  <i class="bx bx-news mr-1"></i>News
                </span>
              </div>
            </div>

            <!-- Content Section -->
            <div class="p-6">
              <!-- Date -->
              <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <i class="bx bx-time-five text-yellow-500"></i>
                <span>{{ n.date }}</span>
              </div>

              <!-- Title -->
              <router-link :to="`/news/${n.id}`">
                <h3
                  class="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2 group-hover:text-orange-500 transition-colors duration-300">
                  {{ n.title }}
                </h3>
              </router-link>

              <!-- Excerpt -->
              <p class="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 leading-relaxed">
                {{ n.excerpt }}
              </p>

              <!-- Read More Button -->
              <router-link :to="`/news/${n.id}`"
                class="inline-flex items-center gap-2 text-orange-500 font-bold text-sm group-hover:gap-3 transition-all duration-300">
                <span>Read More</span>
                <i class="bx bx-right-arrow-alt text-xl"></i>
              </router-link>
            </div>

            <!-- Decorative Bottom Border -->
            <div
              class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left">
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredNews.length === 0" class="text-center py-20">
        <i class="bx bx-search-alt text-8xl text-gray-300 dark:text-gray-600 mb-4"></i>
        <h3 class="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">No news found</h3>
        <p class="text-gray-500 dark:text-gray-500">Try adjusting your search or filters</p>
      </div>
    </div>

    <!-- Newsletter Section -->
    <div class="max-w-7xl mx-auto px-4 mb-16">
      <div
        class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-yellow-500 to-blue-600 p-12 text-white shadow-2xl">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10">
          <div
            class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse">
          </div>
        </div>

        <div class="relative z-10 text-center max-w-3xl mx-auto">
          <i class="bx bx-envelope text-6xl mb-4 animate-bounce"></i>
          <h2 class="text-4xl font-black mb-4">Stay Updated!</h2>
          <p class="text-xl mb-8 text-white/90">Subscribe to our newsletter and never miss an adventure story</p>

          <div class="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input type="email" placeholder="Enter your email address"
              class="flex-1 px-6 py-4 rounded-full text-gray-800 outline-none focus:ring-4 focus:ring-white/50 transition-all" />
            <button
              class="px-8 py-4 bg-white text-orange-500 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
              Subscribe Now
            </button>
          </div>
        </div>

        <!-- Decorative Elements -->
        <div class="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full opacity-10 blur-3xl"></div>
        <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-white rounded-full opacity-10 blur-3xl"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out;
  animation-fill-mode: both;
}
</style>