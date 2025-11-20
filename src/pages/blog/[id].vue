<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { blogPosts } from '../../data/blogPosts'

const route = useRoute()
const id = computed(() => String(route.params.id))

const post = computed(() => blogPosts.find(p => String(p.id) === id.value))
const relatedPosts = computed(() => {
  if (!post.value) return []
  return blogPosts.filter(p => String(p.id) !== id.value && p.category === post.value.category).slice(0, 3)
})

// Reading progress
const readingProgress = ref(0)

const updateReadingProgress = () => {
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  const scrollTop = window.scrollY
  const trackLength = documentHeight - windowHeight
  readingProgress.value = (scrollTop / trackLength) * 100
}

onMounted(() => {
  window.addEventListener('scroll', updateReadingProgress)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateReadingProgress)
})

// Share functions
const shareOnFacebook = () => {
  const url = encodeURIComponent(window.location.href)
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
}

const shareOnTwitter = () => {
  const url = encodeURIComponent(window.location.href)
  const text = encodeURIComponent(post.value?.title || '')
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
}

const copyLink = () => {
  navigator.clipboard.writeText(window.location.href)
  alert('Link copied to clipboard!')
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50" v-if="post">
    <!-- Reading Progress Bar -->
    <div class="fixed top-0 left-0 h-1 bg-gradient-to-r from-orange-500 to-red-600 z-50 transition-all duration-100" :style="{ width: readingProgress + '%' }"></div>

    <!-- Hero Section -->
    <section class="relative h-[60vh] min-h-[500px] overflow-hidden">
      <div class="absolute inset-0">
        <img :src="post.image" :alt="post.title" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
      </div>
      
      <div class="relative z-10 h-full container mx-auto px-4 flex flex-col justify-end pb-16">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-gray-300 mb-6">
          <router-link to="/" class="hover:text-white transition-colors">Home</router-link>
          <span>/</span>
          <router-link to="/blog" class="hover:text-white transition-colors">Blog</router-link>
          <span>/</span>
          <span class="text-white font-medium">{{ post.category }}</span>
        </nav>

        <!-- Category Badge -->
        <div class="mb-6">
          <span class="inline-block px-4 py-1.5 bg-orange-500/90 backdrop-blur-sm text-white text-sm font-bold rounded-full uppercase tracking-wider shadow-lg">
            {{ post.category }}
          </span>
        </div>

        <!-- Title -->
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8 max-w-4xl shadow-sm">
          {{ post.title }}
        </h1>

        <!-- Meta Info -->
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-4">
            <img :src="post.author.avatar" :alt="post.author.name" class="w-14 h-14 rounded-full border-2 border-white/50 shadow-lg" />
            <div>
              <div class="text-white font-bold text-lg">{{ post.author.name }}</div>
              <div class="text-gray-300 text-sm flex items-center gap-2">
                <span>{{ formatDate(post.date) }}</span>
                <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>{{ post.readTime }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <!-- Article Content (8 cols) -->
        <article class="lg:col-span-8">
          <div class="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <!-- Content Body -->
            <div class="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-orange-600 hover:prose-a:text-orange-700 prose-img:rounded-2xl" v-html="post.content"></div>

            <!-- Tags -->
            <div class="mt-12 pt-8 border-t border-gray-100">
              <h3 class="text-lg font-bold text-gray-800 mb-4">Tags</h3>
              <div class="flex flex-wrap gap-3">
                <span v-for="tag in post.tags" :key="tag" class="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-orange-50 hover:text-orange-600 transition-colors cursor-pointer">
                  #{{ tag }}
                </span>
              </div>
            </div>

            <!-- Share Section -->
            <div class="mt-10 pt-8 border-t border-gray-100">
              <h3 class="text-lg font-bold text-gray-800 mb-4">Share this article</h3>
              <div class="flex flex-wrap gap-3">
                <button @click="shareOnFacebook" class="flex items-center gap-2 px-6 py-3 bg-[#1877f2] text-white rounded-full font-medium hover:bg-[#0c63d4] transition-all hover:-translate-y-1 shadow-lg shadow-blue-200">
                  <i class='bx bxl-facebook text-xl'></i> Facebook
                </button>
                <button @click="shareOnTwitter" class="flex items-center gap-2 px-6 py-3 bg-[#1da1f2] text-white rounded-full font-medium hover:bg-[#0c8bd9] transition-all hover:-translate-y-1 shadow-lg shadow-blue-200">
                  <i class='bx bxl-twitter text-xl'></i> Twitter
                </button>
                <button @click="copyLink" class="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-full font-medium hover:bg-gray-900 transition-all hover:-translate-y-1 shadow-lg shadow-gray-200">
                  <i class='bx bx-link text-xl'></i> Copy Link
                </button>
              </div>
            </div>

            <!-- Author Bio -->
            <div class="mt-12 p-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
              <img :src="post.author.avatar" :alt="post.author.name" class="w-24 h-24 rounded-full border-4 border-white shadow-md flex-shrink-0" />
              <div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">{{ post.author.name }}</h3>
                <p class="text-gray-600 mb-4 leading-relaxed">{{ post.author.bio }}</p>
                <div class="flex gap-3 justify-center md:justify-start">
                  <a href="#" class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-orange-500 hover:shadow-md transition-all">
                    <i class='bx bxl-facebook text-xl'></i>
                  </a>
                  <a href="#" class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-orange-500 hover:shadow-md transition-all">
                    <i class='bx bxl-twitter text-xl'></i>
                  </a>
                  <a href="#" class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-orange-500 hover:shadow-md transition-all">
                    <i class='bx bxl-instagram text-xl'></i>
                  </a>
                </div>
              </div>
            </div>

            <!-- Comments Section -->
            <div class="mt-16">
              <h3 class="text-2xl font-bold text-gray-800 mb-8">Comments</h3>
              <form class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" placeholder="Your Name" class="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all" />
                  <input type="email" placeholder="Your Email" class="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all" />
                </div>
                <textarea placeholder="Your Comment" rows="5" class="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"></textarea>
                <button type="submit" class="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-1 transition-all">
                  Post Comment
                </button>
              </form>
            </div>
          </div>
        </article>

        <!-- Sidebar (4 cols) -->
        <aside class="lg:col-span-4 space-y-8">
          <!-- Sticky Container -->
          <div class="sticky top-24 space-y-8">
            
            <!-- Share Widget -->
            <div class="bg-white rounded-2xl shadow-lg p-6">
              <h3 class="text-lg font-bold text-gray-800 mb-4 pb-3 border-b-2 border-orange-500 inline-block">Share</h3>
              <div class="flex gap-3">
                <button @click="shareOnFacebook" class="flex-1 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                  <i class='bx bxl-facebook text-2xl'></i>
                </button>
                <button @click="shareOnTwitter" class="flex-1 h-12 bg-sky-50 text-sky-500 rounded-xl flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all">
                  <i class='bx bxl-twitter text-2xl'></i>
                </button>
                <button @click="copyLink" class="flex-1 h-12 bg-gray-50 text-gray-600 rounded-xl flex items-center justify-center hover:bg-gray-800 hover:text-white transition-all">
                  <i class='bx bx-link text-2xl'></i>
                </button>
              </div>
            </div>

            <!-- Related Posts -->
            <div class="bg-white rounded-2xl shadow-lg p-6" v-if="relatedPosts.length > 0">
              <h3 class="text-lg font-bold text-gray-800 mb-6 pb-3 border-b-2 border-orange-500 inline-block">Related Posts</h3>
              <div class="space-y-6">
                <router-link 
                  v-for="relatedPost in relatedPosts" 
                  :key="relatedPost.id"
                  :to="`/blog/${relatedPost.id}`"
                  class="group flex gap-4 items-start"
                >
                  <div class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img :src="relatedPost.image" :alt="relatedPost.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-800 leading-snug mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">{{ relatedPost.title }}</h4>
                    <span class="text-xs text-gray-500 font-medium">{{ formatDate(relatedPost.date) }}</span>
                  </div>
                </router-link>
              </div>
            </div>

            <!-- Newsletter -->
            <div class="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg p-8 text-center text-white relative overflow-hidden">
              <div class="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              <div class="relative z-10">
                <i class='bx bx-envelope text-4xl mb-4'></i>
                <h3 class="text-xl font-bold mb-2">Join Our Newsletter</h3>
                <p class="text-indigo-100 text-sm mb-6">Get the latest travel tips and stories delivered to your inbox.</p>
                <input type="email" placeholder="Your email address" class="w-full px-4 py-3 rounded-xl text-gray-800 mb-3 focus:outline-none focus:ring-2 focus:ring-white/50" />
                <button class="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-lg">Subscribe</button>
              </div>
            </div>

          </div>
        </aside>

      </div>
    </div>
  </div>
</template>

<style>
/* Custom scrollbar for the page */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>
