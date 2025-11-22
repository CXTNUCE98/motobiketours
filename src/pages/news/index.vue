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
    <!-- Hero Section with Gradient -->
    <div class="relative overflow-hidden mb-16">
      <!-- Animated Background -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-[#FF6B35] via-[#FFA726] to-[#1A71C7] opacity-10 dark:opacity-5">
        <div
          class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHs0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHs0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30">
        </div>
      </div>

      <div class="relative z-10 text-center py-20 px-4">
        <!-- Animated Title -->
        <div class="mb-6 animate-fade-in-down">
          <h1
            class="text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-[#FF6B35] via-[#FFA726] to-[#1A71C7] bg-clip-text text-transparent drop-shadow-lg">
            Latest News & Stories
          </h1>
          <div class="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-300 text-lg">
            <i class="bx bx-map-pin text-[#FF6B35] text-2xl animate-bounce"></i>
            <p class="font-medium">Discover amazing motorcycle adventures across Vietnam</p>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="max-w-2xl mx-auto mt-8 animate-fade-in-up">
          <div class="relative group">
            <i
              class="bx bx-search absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-gray-400 group-focus-within:text-[#FF6B35] transition-colors"></i>
            <input v-model="searchQuery" type="text" placeholder="Search for news, destinations, bikes..."
              class="w-full pl-14 pr-6 py-4 rounded-full border-2 border-gray-200 dark:border-gray-700 focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20 outline-none transition-all duration-300 text-lg shadow-lg backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
          </div>
        </div>

        <!-- Category Filters -->
        <div class="flex flex-wrap items-center justify-center gap-3 mt-8 animate-fade-in-up animation-delay-200">
          <button v-for="category in categories" :key="category.id" @click="selectedCategory = category.id" :class="[
            'group flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-md',
            selectedCategory === category.id
              ? 'bg-gradient-to-r from-[#FF6B35] to-[#FFA726] text-white shadow-lg shadow-[#FF6B35]/30'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-lg'
          ]">
            <i :class="['bx', category.icon, 'text-xl', selectedCategory === category.id ? 'animate-pulse' : '']"></i>
            <span>{{ category.name }}</span>
          </button>
        </div>
      </div>

      <!-- Decorative Elements -->
      <div class="absolute top-10 left-10 w-20 h-20 bg-[#FF6B35] rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div
        class="absolute bottom-10 right-10 w-32 h-32 bg-[#1A71C7] rounded-full opacity-20 blur-3xl animate-pulse animation-delay-1000">
      </div>
    </div>

    <!-- Featured News (First Item) -->
    <div v-if="featuredNews" class="max-w-7xl mx-auto px-4 mb-16 animate-fade-in">
      <div
        class="relative group overflow-hidden rounded-3xl shadow-2xl hover:shadow-[#FF6B35]/20 transition-all duration-500">
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
              class="px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#FFA726] rounded-full text-sm font-bold shadow-lg">
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
            class="inline-flex items-center gap-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-[#FF6B35] dark:hover:bg-[#FF6B35] hover:text-white transition-all duration-300 transform hover:scale-105 group/btn">
            <span>Read Full Story</span>
            <i class="bx bx-right-arrow-alt text-2xl group-hover/btn:translate-x-1 transition-transform"></i>
          </router-link>
        </div>

        <!-- Decorative Corner -->
        <div
          class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FFA726] to-transparent opacity-30 blur-2xl">
        </div>
      </div>
    </div>

    <!-- News Grid -->
    <div class="max-w-7xl mx-auto px-4 mb-16">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-black text-gray-800 dark:text-white">
          <span class="bg-gradient-to-r from-[#FF6B35] to-[#1A71C7] bg-clip-text text-transparent">
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
            class="relative h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#FF6B35]/10 transition-all duration-500 transform hover:-translate-y-2 border border-transparent dark:border-gray-700">
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
                  class="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-[#FF6B35] shadow-lg">
                  <i class="bx bx-news mr-1"></i>News
                </span>
              </div>
            </div>

            <!-- Content Section -->
            <div class="p-6">
              <!-- Date -->
              <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <i class="bx bx-time-five text-[#FFA726]"></i>
                <span>{{ n.date }}</span>
              </div>

              <!-- Title -->
              <router-link :to="`/news/${n.id}`">
                <h3
                  class="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2 group-hover:text-[#FF6B35] transition-colors duration-300">
                  {{ n.title }}
                </h3>
              </router-link>

              <!-- Excerpt -->
              <p class="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 leading-relaxed">
                {{ n.excerpt }}
              </p>

              <!-- Read More Button -->
              <router-link :to="`/news/${n.id}`"
                class="inline-flex items-center gap-2 text-[#FF6B35] font-bold text-sm group-hover:gap-3 transition-all duration-300">
                <span>Read More</span>
                <i class="bx bx-right-arrow-alt text-xl"></i>
              </router-link>
            </div>

            <!-- Decorative Bottom Border -->
            <div
              class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B35] via-[#FFA726] to-[#1A71C7] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left">
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
        class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF6B35] via-[#FFA726] to-[#1A71C7] p-12 text-white shadow-2xl">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10">
          <div
            class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4zIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMjBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6TTEyIDM0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDIwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSAzIDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] animate-pulse">
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
              class="px-8 py-4 bg-white text-[#FF6B35] rounded-full font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
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
@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
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

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.animate-fade-in-down {
  animation: fade-in-down 0.6s ease-out;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out;
  animation-fill-mode: both;
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.animation-delay-200 {
  animation-delay: 200ms;
}

.animation-delay-1000 {
  animation-delay: 1000ms;
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #FF6B35, #1A71C7);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #1A71C7, #FF6B35);
}
</style>