<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogsQuery } from '~/composables/useBlogQuery'
import { watchDebounced } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { user } = useAuth();
const isUser = computed(() => !!user.value?.email);

const { t } = useI18n()

// Active category filter
const activeCategory = ref('All')

// Search query
const searchQuery = ref('')
const showMobileFilter = ref(false)

// Categories
const categories = [
  { label: t('blog.type.all'), value: '' },
  { label: t('blog.type.travelTips'), value: 'travel-tips' },
  { label: t('blog.type.destination'), value: 'destination' },
  { label: t('blog.type.culture'), value: 'culture' },
  { label: t('blog.type.food'), value: 'food' },
  { label: t('blog.type.adventure'), value: 'adventure' },
  { label: t('blog.type.guides'), value: 'guides' },
]

// Popular tags
const tags = [
  'Motorbike', 'Vietnam', 'Food', 'Culture', 'Adventure', 'Tips', 'Routes', 'Ha Giang', 'Safety'
]

// API Params
const params = ref({
  category: '',
  tags: '',
  p: 1,
  r: 10,
})

// Fetch data
const { data, isLoading, isFetching } = useBlogsQuery(params)

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

function calculateReadTime(numWords, wordsPerMinute = 180) {
  if (!numWords || numWords <= 0) return 0;
  return Math.ceil(numWords / wordsPerMinute);
}

const getImageUrl = (thumbnail) => {
  if (!thumbnail) return 'https://via.placeholder.com/800x600?text=No+Image'
  if (thumbnail.startsWith('http')) return thumbnail
  return `https://res.cloudinary.com/daok0blh9/image/upload/v1764131273/${thumbnail}.jpg`
}

const totalBlogs = computed(() => meta.value?.total || 0)
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/20 to-violet-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 selection:text-white">
    <!-- Hero Section -->
    <section class="relative py-20 md:py-28 overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950">
        <!-- Subtle geometric pattern -->
        <div class="absolute inset-0 opacity-[0.03]"
          style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;1&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
        <!-- Soft glow accents -->
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px]"></div>
        <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-[128px]"></div>
      </div>

      <!-- Content -->
      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-3xl mx-auto text-center">
          <!-- Badge -->
          <div
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-indigo-300 text-sm font-semibold mb-8 hero-animate">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-400"></span>
            </span>
            <span class="tracking-wider">{{ t('blog.blog') }}</span>
          </div>

          <!-- Main Heading -->
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight hero-animate-delay-1">
            <span class="block text-white mb-2">{{ t('blog.discover') }}</span>
            <span
              class="block bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              {{ t('blog.epicJourneys') }}
            </span>
          </h1>

          <!-- Description -->
          <p class="text-lg text-slate-300/80 max-w-xl mx-auto leading-relaxed mb-12 hero-animate-delay-2">
            {{ t('blog.epicJourneysDesc') }}
          </p>

          <!-- Stats Cards -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto hero-animate-delay-3">
            <div
              class="group bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div class="text-2xl font-black text-white mb-0.5 group-hover:text-indigo-400 transition-colors">{{ totalBlogs }}+</div>
              <div class="text-xs font-semibold text-indigo-200/60 uppercase tracking-wider">{{ t('blog.stories') }}</div>
            </div>
            <div
              class="group bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div class="text-2xl font-black text-white mb-0.5 group-hover:text-violet-400 transition-colors">50k+</div>
              <div class="text-xs font-semibold text-indigo-200/60 uppercase tracking-wider">{{ t('blog.readers') }}</div>
            </div>
            <div
              class="group bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div class="text-2xl font-black text-white mb-0.5 group-hover:text-indigo-400 transition-colors">10k+</div>
              <div class="text-xs font-semibold text-indigo-200/60 uppercase tracking-wider">{{ t('blog.followers') }}</div>
            </div>
            <div
              class="group bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div class="text-2xl font-black text-white mb-0.5 group-hover:text-violet-400 transition-colors">100+</div>
              <div class="text-xs font-semibold text-indigo-200/60 uppercase tracking-wider">{{ t('blog.writers') }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom wave -->
      <div class="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
          <path d="M0 80L48 72C96 64 192 48 288 40C384 32 480 32 576 36C672 40 768 48 864 52C960 56 1056 56 1152 52C1248 48 1344 40 1392 36L1440 32V80H0Z"
            class="fill-gray-50 dark:fill-gray-900 transition-colors duration-300" />
        </svg>
      </div>
    </section>

    <div class="container mx-auto px-4 py-12 max-w-7xl relative z-20 -mt-20">
      <!-- Category Filter & Actions -->
      <div class="mb-12 sticky top-4 z-30">
        <div
          class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-full p-2 shadow-2xl shadow-indigo-500/10 flex justify-between items-center gap-4 transition-all duration-300 hover:shadow-indigo-500/20">

          <!-- Mobile Filter Button -->
          <button @click="showMobileFilter = true"
            class="lg:hidden flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold shadow-lg border border-gray-100 dark:border-gray-600 active:scale-95 transition-transform">
            <i class='bx bx-filter-alt text-xl text-indigo-500'></i>
            <span>{{ t('blog.filter.title') }}</span>
          </button>

          <!-- Desktop Categories -->
          <div class="hidden lg:block w-full md:w-auto overflow-x-auto no-scrollbar">
            <div class="flex items-center gap-2 p-1">
              <button v-for="category in categories" :key="category.value" @click="setCategory(category.value)"
                class="relative px-6 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all duration-300 overflow-hidden group"
                :class="activeCategory === category.value ? 'text-white shadow-lg shadow-indigo-500/30 scale-105' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'">
                <div v-if="activeCategory === category.value"
                  class="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 animate-gradient-x">
                </div>
                <span class="relative z-10 flex items-center gap-2">
                  <i v-if="activeCategory === category.value" class='bx bx-check text-lg'></i>
                  {{ category.label }}
                </span>
              </button>
            </div>
          </div>

          <!-- Actions -->
          <div v-if="isUser" class="flex items-center gap-3 ml-auto lg:ml-0 px-2">
            <el-tooltip class="box-item" effect="dark" :content="t('blog.create')" placement="top">
              <button @click="createNewBlog"
                class="group relative flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 md:px-8 py-3 rounded-full font-bold text-sm shadow-xl shadow-gray-900/20 dark:shadow-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden">
                <i class='bx bx-plus-circle text-xl'></i>
              </button>
            </el-tooltip>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <!-- Main Content (8 cols) -->
        <div class="lg:col-span-8 space-y-12">

          <!-- Featured Post -->
          <section v-if="featuredPost" class="relative group perspective-1000">
            <router-link :to="`/blog/${featuredPost?.id}`"
              class="block transform transition-transform duration-500 hover:scale-[1.01]">
              <div class="relative h-[600px] rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10">
                <img :src="getImageUrl(featuredPost?.thumbnail)" :alt="featuredPost?.name"
                  class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-90">
                </div>

                <div class="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16">
                  <div class="flex items-center gap-3 mb-6">
                    <span
                      class="px-4 py-1.5 bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg shadow-orange-500/20">Featured
                      Story</span>
                    <span
                      class="px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-xs font-bold rounded-full uppercase tracking-wider border border-white/20">{{
                        featuredPost?.category || 'Adventure' }}</span>
                  </div>

                  <h2
                    class="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight group-hover:text-orange-200 transition-colors drop-shadow-lg">
                    {{ featuredPost?.name }}</h2>
                  <p class="text-gray-300 text-lg md:text-xl mb-8 line-clamp-2 max-w-3xl leading-relaxed font-light">{{
                    featuredPost?.shortDescription }}</p>

                  <div class="flex items-center gap-6">
                    <div class="flex items-center gap-4">
                      <div class="relative">
                        <div
                          class="absolute inset-0 bg-orange-500 rounded-full blur opacity-50 group-hover:opacity-100 transition-opacity">
                        </div>
                        <img
                          :src="featuredPost?.author?.avatar || 'https://ui-avatars.com/api/?name=' + featuredPost?.author?.userName"
                          :alt="featuredPost?.author?.userName"
                          class="relative w-14 h-14 object-cover rounded-full border-2 border-white/50 image-crisp" />
                      </div>
                      <div>
                        <div class="text-white font-bold text-lg">{{ featuredPost?.author?.userName }}</div>
                        <div class="text-gray-400 text-sm flex items-center gap-2">
                          <span>{{ formatDate(featuredPost?.createdAt) }}</span>
                          <span class="w-1 h-1 bg-gray-500 rounded-full"></span>
                          <span>{{ calculateReadTime(featuredPost?.numWords) }} min read</span>
                        </div>
                      </div>
                    </div>

                    <div
                      class="hidden md:flex items-center gap-2 text-white/80 text-sm font-medium ml-auto group-hover:translate-x-2 transition-transform">
                      Read Article <i class='bx bx-right-arrow-alt text-2xl'></i>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
          </section>

          <!-- Regular Posts Grid -->
          <section v-loading="isFetching" v-if="posts?.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <router-link v-for="(post, index) in posts" :key="post.id" :to="`/blog/${post.id}`"
              class="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full border border-gray-100 dark:border-gray-700/50 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 relative isolate">
              <div
                class="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              </div>

              <div class="relative h-64 overflow-hidden">
                <img :src="getImageUrl(post?.thumbnail)" :alt="post?.name"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div class="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500"></div>
                <span
                  class="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full shadow-lg border border-white/20 dark:border-gray-700">{{
                    post?.category || 'Travel' }}</span>
              </div>

              <div class="p-8 flex flex-col flex-grow">
                <div class="mb-4 flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  <i class='bx bx-calendar text-indigo-500'></i>
                  <span>{{ formatDate(post?.createdAt) }}</span>
                </div>

                <h3
                  class="text-2xl font-bold text-gray-800 dark:text-white mb-4 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {{ post?.name }}</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">{{
                  post?.shortDescription }}</p>

                <div
                  class="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700/50 mt-auto">
                  <div class="flex items-center gap-3">
                    <img :src="post?.author?.avatar || 'https://ui-avatars.com/api/?name=' + post?.author?.userName"
                      :alt="post?.author?.userName"
                      class="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-600 image-crisp" />
                    <span class="text-sm font-bold text-gray-700 dark:text-gray-200">{{ post?.author?.userName }}</span>
                  </div>
                  <span
                    class="text-xs font-semibold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">{{
                      calculateReadTime(post?.numWords) }} min read</span>
                </div>
              </div>
            </router-link>
          </section>

          <!-- Pagination -->
          <div class="flex justify-center items-center gap-4 pt-8" v-if="meta?.totalPages > 1">
            <button @click="setPage(params.p - 1)" :disabled="params.p <= 1"
              class="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <i class='bx bx-chevron-left text-2xl'></i>
            </button>

            <template v-for="page in meta?.totalPages" :key="page">
              <button
                v-if="page === params.p || page === 1 || page === meta?.totalPages || (page >= params.p - 1 && page <= params.p + 1)"
                @click="setPage(page)"
                :class="page === params.p ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/30 scale-110' : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'"
                class="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300">{{ page
                }}</button>
              <span v-else-if="page === params.p - 2 || page === params.p + 2"
                class="text-gray-400 font-bold">...</span>
            </template>

            <button @click="setPage(params.p + 1)" :disabled="params.p >= meta?.totalPages"
              class="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <i class='bx bx-chevron-right text-2xl'></i>
            </button>
          </div>
        </div>

        <!-- Sidebar (4 cols) -->
        <aside class="lg:col-span-4 space-y-8">
          <!-- Search Widget -->
          <div
            class="hidden lg:block bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 border border-gray-100 dark:border-gray-700/50">
            <h3
              class="text-xl font-black text-gray-800 dark:text-white mb-6 pb-2 border-b-2 border-indigo-500 inline-block">
              Search Stories</h3>
            <div class="relative group">
              <div
                class="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-md group-hover:bg-indigo-500/30 transition-all duration-500">
              </div>
              <div
                class="relative flex items-center bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl p-3 shadow-sm transition-all focus-within:bg-white dark:focus-within:bg-gray-700 focus-within:ring-2 focus-within:ring-indigo-500/30">
                <i class='bx bx-search text-2xl text-gray-400 dark:text-gray-300 ml-3'></i>
                <input v-model="searchQuery" type="text" placeholder="What are you looking for?"
                  class="w-full bg-transparent border-none outline-none text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 px-4 py-2 text-base font-medium" />
              </div>
            </div>
          </div>

          <!-- Categories Widget -->
          <div
            class="hidden lg:block bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 border border-gray-100 dark:border-gray-700/50">
            <h3
              class="text-xl font-black text-gray-800 dark:text-white mb-6 pb-2 border-b-2 border-indigo-500 inline-block">
              Categories</h3>
            <div class="space-y-3">
              <button v-for="category in categories" :key="category?.value" @click="setCategory(category?.value)"
                class="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 group border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                :class="activeCategory === category.value ? 'text-white shadow-lg shadow-indigo-500/30 scale-105' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'">
                <span
                  class="text-gray-600 dark:text-gray-300 font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-3">
                  <span class="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-indigo-500 transition-colors"></span>
                  {{ category?.label }}
                </span>
                <i
                  class='bx bx-chevron-right text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all'></i>
              </button>
            </div>
          </div>

          <!-- Tags Widget -->
          <div
            class="hidden lg:block bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 border border-gray-100 dark:border-gray-700/50">
            <h3
              class="text-xl font-black text-gray-800 dark:text-white mb-6 pb-2 border-b-2 border-indigo-500 inline-block">
              Trending Tags</h3>
            <div class="flex flex-wrap gap-3">
              <span v-for="tag in tags" :key="tag" @click="toggleTag(tag)"
                :class="activeTags.includes(tag) ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400'"
                class="px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer select-none border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800">#{{
                  tag }}</span>
            </div>
          </div>

          <!-- Newsletter Widget -->
          <div
            class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-xl p-8 text-center text-white relative overflow-hidden group">
            <div
              class="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
            </div>
            <div
              class="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700">
            </div>
            <div
              class="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700">
            </div>

            <div class="relative z-10">
              <div
                class="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/10">
                <i class='bx bx-paper-plane text-3xl text-indigo-400'></i>
              </div>
              <h3 class="text-2xl font-black mb-3">Travel Inspiration</h3>
              <p class="text-gray-400 text-sm mb-8 leading-relaxed">Join 10,000+ travelers and get exclusive guides,
                tips, and
                hidden gems delivered to your inbox.</p>

              <div class="space-y-3">
                <input type="email" placeholder="Your email address"
                  class="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all text-sm font-medium" />
                <button
                  class="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-900/50 hover:shadow-indigo-600/50 hover:-translate-y-0.5">Subscribe
                  Now</button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- Mobile Filter Dialog -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-full opacity-0">
      <div v-if="showMobileFilter" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
        <div @click="showMobileFilter = false" class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity">
        </div>

        <div
          class="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div
            class="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl z-10">
            <h3 class="text-xl font-black text-gray-900 dark:text-white">{{ t('blog.filter.title') }}</h3>
            <button @click="showMobileFilter = false"
              class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <i class='bx bx-x text-2xl text-gray-500'></i>
            </button>
          </div>

          <div class="p-6 overflow-y-auto space-y-8">
            <div>
              <h4 class="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <i class='bx bx-search text-indigo-500'></i> {{ t('blog.filter.search') }}
              </h4>
              <div
                class="relative flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/30">
                <input v-model="searchQuery" type="text" :placeholder="t('blog.filter.filterDes')"
                  class="w-full bg-transparent border-none outline-none text-gray-700 dark:text-white placeholder-gray-400 text-base font-medium" />
              </div>
            </div>

            <div>
              <h4 class="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <i class='bx bx-category text-indigo-500'></i> {{ t('blog.filter.categories') }}
              </h4>
              <div class="grid grid-cols-2 gap-3">
                <button v-for="category in categories" :key="category.value" @click="setCategory(category.value)"
                  class="px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 border text-left flex items-center justify-between group"
                  :class="activeCategory === category.value ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'bg-gray-50 dark:bg-gray-800 border-transparent hover:border-gray-200 dark:hover:border-gray-700 text-gray-600 dark:text-gray-300'">
                  {{ category.label }}
                  <i v-if="activeCategory === category.value" class='bx bx-check text-lg'></i>
                </button>
              </div>
            </div>

            <div>
              <h4 class="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <i class='bx bx-hash text-indigo-500'></i> {{ t('blog.filter.tags') }}
              </h4>
              <div class="flex flex-wrap gap-2">
                <span v-for="tag in tags" :key="tag" @click="toggleTag(tag)"
                  :class="activeTags.includes(tag) ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
                  class="px-3 py-1.5 text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer select-none">#{{
                    tag }}</span>
              </div>
            </div>
          </div>

          <div class="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <button @click="showMobileFilter = false"
              class="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 active:scale-95 transition-transform flex items-center justify-center gap-2">
              <span>{{ t('blog.showResults') }}</span>
              <i class='bx bx-right-arrow-alt text-xl'></i>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.image-crisp {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  image-rendering: high-quality;
}

.perspective-1000 {
  perspective: 1000px;
}
</style>