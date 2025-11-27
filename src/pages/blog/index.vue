<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'

const router = useRouter()

// Active category filter
const activeCategory = ref('All')

// Search query
const searchQuery = ref('')

// Categories
const categories = [
  { label: 'All', value: '' },
  { label: 'Travel Tips', value: 'travel-tips' },
  { label: 'Destination', value: 'destination' },
  { label: 'Culture', value: 'culture' },
  { label: 'Food', value: 'food' },
  { label: 'Adventure', value: 'adventure' },
  { label: 'Guides', value: 'guides' },
]

// Popular tags
const tags = [
  'Motorbike', 'Vietnam', 'Food', 'Culture', 'Adventure', 'Tips', 'Routes', 'Ha Giang', 'Safety'
]

// API Params
const params = ref({
  // q: '',
  category: '',
  tags: '',
  p: 1,
  r: 10,
})

// Fetch data
const { data, isLoading, isFetching } = useQuery({
  queryKey: ['/blog', params],
  queryFn: async () => {
    const res = await $motobikertoursApi('/blog', {
      query: params.value,
    })
    return res
  },
  refetchOnWindowFocus: false,
})

// Computed properties
const posts = computed(() => data.value?.data || [])
const meta = computed(() => data.value?.meta || {})

const featuredPost = computed(() => {
  return posts.value?.[0]
})

// Methods
const setCategory = (category) => {
  activeCategory.value = category
  params.value.category = category === 'All' ? '' : category
  params.value.p = 1
}

const activeTags = computed({
  get: () => params.value.tags ? params.value.tags.split(',') : [],
  set: (val) => {
    params.value.tags = val.join(',')
    params.value.p = 1
  }
})

const toggleTag = (tag) => {
  const current = activeTags.value
  if (current.includes(tag)) {
    activeTags.value = current.filter(t => t !== tag)
  } else {
    activeTags.value = [...current, tag]
  }
}

const setPage = (page) => {
  params.value.p = page
}

watchDebounced(searchQuery, (newVal) => {
  params.value.q = newVal
  params.value.p = 1
}, { debounce: 500, maxWait: 1000 })

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function createNewBlog() {
  router.push('/blog/create')
}

function calculateReadTime(text, wordsPerMinute = 180) {
  const wordCount = text?.trim()?.split(/\s+/)?.length || 0;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes;
}

const getImageUrl = (thumbnail) => {
  if (!thumbnail) return 'https://via.placeholder.com/800x600?text=No+Image'
  if (thumbnail.startsWith('http')) return thumbnail
  return `https://res.cloudinary.com/daok0blh9/image/upload/v1764131273/${thumbnail}.jpg`
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-20 px-4 overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

      <div class="relative z-10 max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          Explore Our <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Travel
            Stories</span>
        </h1>
        <p class="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          Discover hidden gems, expert tips, and unforgettable adventures from our motorbike tours across Vietnam.
        </p>

        <!-- Search Bar -->
        <div class="max-w-2xl mx-auto relative group">
          <div class="absolute inset-0 bg-white/20 rounded-full blur-md group-hover:bg-white/30 transition-all"></div>
          <div
            class="relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2 shadow-2xl transition-all focus-within:bg-white/20 focus-within:scale-[1.02]">
            <i class='bx bx-search text-2xl text-white/70 ml-4'></i>
            <input v-model="searchQuery" type="text" placeholder="Search title blog"
              class="w-full bg-transparent border-none outline-none text-white placeholder-white/60 px-4 py-3 text-lg" />
          </div>
        </div>
      </div>
    </section>

    <div class="container mx-auto px-4 py-12 max-w-7xl">
      <!-- Category Filter -->
      <div class="flex justify-between items-center">
        <div class="flex overflow-x-auto pt-2 pb-4 gap-3 no-scrollbar">
          <button v-for="category in categories" :key="category.value" @click="setCategory(category.value)"
            class="px-6 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all duration-300 border"
            :class="activeCategory === category.value
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg shadow-indigo-200 transform -translate-y-1'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-md'">
            {{ category?.label }}
          </button>
        </div>
        <button @click="createNewBlog"
          class="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-md px-6 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all duration-300 border">
          Create New Post
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <!-- Main Content (8 cols) -->
        <div class="lg:col-span-8 space-y-12">

          <!-- Featured Post -->
          <section v-if="featuredPost" class="relative group">
            <router-link :to="`/blog/${featuredPost?.id}`" class="block">
              <div class="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <img :src="getImageUrl(featuredPost?.thumbnail)" :alt="featuredPost?.name"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                <div class="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                  <span
                    class="inline-block px-4 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full uppercase tracking-wider mb-4 shadow-lg">
                    Featured
                  </span>
                  <h2
                    class="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-orange-200 transition-colors">
                    {{ featuredPost?.name }}
                  </h2>
                  <p class="text-gray-300 text-lg mb-6 line-clamp-2 max-w-2xl">
                    {{ featuredPost?.shortDescription }}
                  </p>

                  <div class="flex items-center gap-4">
                    <img
                      :src="featuredPost?.author?.avatar || 'https://ui-avatars.com/api/?name=' + featuredPost?.author?.userName"
                      :alt="featuredPost?.author?.userName"
                      class="w-12 h-12 object-cover rounded-full border-2 border-white/50 [image-rendering:-webkit-optimize-contrast] image-crisp" />
                    <div>
                      <div class="text-white font-bold">{{ featuredPost?.author?.userName }}</div>
                      <div class="text-gray-400 text-sm">{{ formatDate(featuredPost?.created_at) }} • {{
                        calculateReadTime(featuredPost?.content)
                      }} min read</div>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
          </section>
          <!-- Regular Posts Grid -->
          <section v-loading="isFetching" v-if="posts?.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <router-link v-for="post in posts" :key="post.id" :to="`/blog/${post.id}`"
              class="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full border border-transparent dark:border-gray-700">
              <div class="relative h-56 overflow-hidden">
                <img :src="getImageUrl(post?.thumbnail)" :alt="post?.name"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <span
                  class="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-bold rounded-full shadow-md">
                  {{ post?.category || 'Travel' }}
                </span>
              </div>

              <div class="p-6 flex flex-col flex-grow">
                <h3
                  class="text-xl font-bold text-gray-800 dark:text-white mb-3 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {{ post?.name }}
                </h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-3 flex-grow">
                  {{ post?.shortDescription }}
                </p>

                <div
                  class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                  <div class="flex items-center gap-3">
                    <img :src="post?.author?.avatar || 'https://ui-avatars.com/api/?name=' + post?.author?.userName"
                      :alt="post?.author?.userName"
                      class="w-8 h-8 rounded-full object-cover border border-gray-200 image-crisp" />
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ post?.author?.userName
                      }}</span>
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ calculateReadTime(post?.content)
                    }} min read</span>
                </div>
              </div>
            </router-link>
          </section>

          <!-- Pagination -->
          <div class="flex justify-center items-center gap-4 pt-8" v-if="meta?.totalPages > 1">
            <button @click="setPage(params.p - 1)" :disabled="params.p <= 1"
              class="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <i class='bx bx-chevron-left text-2xl'></i>
            </button>

            <template v-for="page in meta?.totalPages" :key="page">
              <button
                v-if="page === params.p || page === 1 || page === meta?.totalPages || (page >= params.p - 1 && page <= params.p + 1)"
                @click="setPage(page)"
                :class="page === params.p
                  ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-200'
                  : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-400'"
                class="w-10 h-10 rounded-full flex items-center justify-center transition-all">
                {{ page }}
              </button>
              <span v-else-if="page === params.p - 2 || page === params.p + 2" class="text-gray-400">...</span>
            </template>

            <button @click="setPage(params.p + 1)" :disabled="params.p >= meta?.totalPages"
              class="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <i class='bx bx-chevron-right text-2xl'></i>
            </button>
          </div>
        </div>

        <!-- Sidebar (4 cols) -->
        <aside class="lg:col-span-4 space-y-8">
          <!-- Popular Posts Widget -->


          <!-- Categories Widget -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3
              class="text-lg font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b-2 border-indigo-500 inline-block">
              Categories</h3>
            <div class="space-y-2">
              <button v-for="category in categories" :key="category?.value" @click="setCategory(category?.value)"
                class="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
                <span
                  class="text-gray-600 dark:text-gray-300 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {{ category?.label }}
                </span>
              </button>
            </div>
          </div>

          <!-- Tags Widget -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3
              class="text-lg font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b-2 border-indigo-500 inline-block">
              Popular Tags</h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in tags" :key="tag" @click="toggleTag(tag)"
                :class="activeTags.includes(tag) ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'"
                class="px-3 py-1.5 text-xs font-bold rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer select-none">
                #{{ tag }}
              </span>
            </div>
          </div>

          <!-- Newsletter Widget -->
          <div
            class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl p-8 text-center text-white relative overflow-hidden">
            <div
              class="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
            </div>
            <div class="relative z-10">
              <i class='bx bx-paper-plane text-4xl mb-4 text-indigo-400'></i>
              <h3 class="text-xl font-bold mb-2">Travel Inspiration</h3>
              <p class="text-gray-400 text-sm mb-6">Join 10,000+ travelers and get exclusive guides.</p>
              <input type="email" placeholder="Your email address"
                class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/20 transition-all" />
              <button
                class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-900/50">Subscribe
                Now</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

.image-crisp {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  image-rendering: high-quality;
}
</style>