<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { useAuth } from '~/composables/useAuth'
import CommentItem from '~/components/CommentItem.vue'

const route = useRoute()
const id = computed(() => String(route?.params?.id))
const { user } = useAuth()
const queryClient = useQueryClient()

// Fetch Post Detail
const { data: detailBlog, isLoading } = useQuery({
  queryKey: ['blog/id', id],
  queryFn: () => $motobikertoursApi(`/blog/${id.value}`),
  enabled: computed(() => !!id.value)
})

const post = computed(() => detailBlog.value || null)

// Fetch Related Posts
const { data: relatedData } = useQuery({
  queryKey: ['blog', 'related', computed(() => post.value?.category)],
  queryFn: () => $motobikertoursApi('/blog', {
    query: {
      category: post.value?.category,
      r: 4
    }
  }),
  enabled: computed(() => !!post.value?.category)
})

const relatedPosts = computed(() => {
  if (!relatedData.value?.data) return []
  return relatedData.value?.data
    .filter(p => String(p.id) !== id.value)
    .slice(0, 3)
})

// Comments
const { data: commentsData, isLoading: commentsLoading, refetch: refetchComments } = useQuery({
  queryKey: ['comments', id],
  queryFn: () => $motobikertoursApi(`/comments/tree/${id.value}`, {
    query: {
      page: 1,
      limit: 50
    }
  }),
  enabled: computed(() => !!id.value)
})

const comments = computed(() => commentsData.value?.data || [])

// Create comment
const newCommentContent = ref('')

const createCommentMutation = useMutation({
  mutationFn: (commentData) => $motobikertoursApi('/comments', {
    method: 'POST',
    body: commentData
  }),
  onSuccess: () => {
    newCommentContent.value = ''
    refetchComments()
  },
  onError: (error) => {
    console.error('Error creating comment:', error)
    ElNotification({
      title: 'Error',
      message: 'Failed to post comment. Please try again.',
      type: 'error',
    })
  }
})

const handleCreateComment = () => {
  if (!user.value || !newCommentContent.value.trim()) return

  createCommentMutation.mutate({
    blogId: id.value,
    content: newCommentContent.value,
    author: {
      authId: user.value?.id,
      avatar: user.value?.avatar || `https://ui-avatars.com/api/?name=${user.value?.userName}`,
      userName: user.value?.userName
    }
  })
}

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
  const text = encodeURIComponent(post.value?.name || '')
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
}

const copyLink = () => {
  navigator.clipboard.writeText(window.location.href)
  ElNotification({
    title: 'Success',
    message: 'Link copied to clipboard!',
    type: 'success',
  })
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const calculateReadTime = (text, wordsPerMinute = 180) => {
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
    <div v-if="post">
      <!-- Reading Progress Bar -->
      <div class="fixed top-0 left-0 h-1 bg-gradient-to-r from-orange-500 to-red-600 z-50 transition-all duration-100"
        :style="{ width: readingProgress + '%' }"></div>

      <!-- Hero Section -->
      <section class="relative h-[60vh] min-h-[500px] overflow-hidden">
        <div class="absolute inset-0">
          <img :src="getImageUrl(post?.thumbnail)" :alt="post?.name" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
        </div>

        <div class="relative z-10 h-full container mx-auto px-4 flex flex-col justify-end pb-16">
          <!-- Breadcrumb -->
          <nav class="flex items-center gap-2 text-sm text-gray-300 mb-6">
            <router-link to="/" class="hover:text-white transition-colors">Home</router-link>
            <span>/</span>
            <router-link to="/blog" class="hover:text-white transition-colors">Blog</router-link>
            <span>/</span>
            <span class="text-white font-medium">{{ post?.category }}</span>
          </nav>

          <!-- Category Badge -->
          <div class="mb-6">
            <span
              class="inline-block px-4 py-1.5 bg-orange-500/90 backdrop-blur-sm text-white text-sm font-bold rounded-full uppercase tracking-wider shadow-lg">
              {{ post?.category }}
            </span>
          </div>

          <!-- Title -->
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8 max-w-4xl shadow-sm">
            {{ post?.name }}
          </h1>

          <!-- Meta Info -->
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-4">
              <img :src="post?.author?.avatar || 'https://ui-avatars.com/api/?name=' + post?.author?.userName"
                :alt="post?.author?.userName"
                class="w-14 h-14 rounded-full object-cover border-2 border-white/50 shadow-lg" />
              <div>
                <div class="text-white font-bold text-lg">{{ post?.author?.userName }}</div>
                <div class="text-gray-300 text-sm flex items-center gap-2">
                  <span>{{ formatDate(post?.created_at) }}</span>
                  <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>{{ calculateReadTime(post?.content) }} min read</span>
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
            <div
              class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12 border border-transparent dark:border-gray-700">
              <!-- Content Body -->
              <div
                class="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-orange-600 hover:prose-a:text-orange-700 prose-img:rounded-2xl"
                v-html="post?.content"></div>

              <!-- Tags -->
              <div class="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700"
                v-if="post?.tags && post?.tags?.length">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">Tags</h3>
                <div class="flex flex-wrap gap-3">
                  <span v-for="tag in post.tags" :key="tag"
                    class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer">
                    #{{ tag }}
                  </span>
                </div>
              </div>

              <!-- Share Section -->
              <div class="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">Share this article</h3>
                <div class="flex flex-wrap gap-3">
                  <button @click="shareOnFacebook"
                    class="flex items-center gap-2 px-6 py-3 bg-[#1877f2] text-white rounded-full font-medium hover:bg-[#0c63d4] transition-all hover:-translate-y-1 shadow-lg shadow-blue-200 dark:shadow-none">
                    <i class='bx bxl-facebook text-xl'></i> Facebook
                  </button>
                  <button @click="shareOnTwitter"
                    class="flex items-center gap-2 px-6 py-3 bg-[#1da1f2] text-white rounded-full font-medium hover:bg-[#0c8bd9] transition-all hover:-translate-y-1 shadow-lg shadow-blue-200 dark:shadow-none">
                    <i class='bx bxl-twitter text-xl'></i> Twitter
                  </button>
                  <button @click="copyLink"
                    class="flex items-center gap-2 px-6 py-3 bg-gray-800 dark:bg-gray-700 text-white rounded-full font-medium hover:bg-gray-900 dark:hover:bg-gray-600 transition-all hover:-translate-y-1 shadow-lg shadow-gray-200 dark:shadow-none">
                    <i class='bx bx-link text-xl'></i> Copy Link
                  </button>
                </div>
              </div>

              <!-- Author Bio -->
              <div
                class="mt-12 p-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                <img :src="post?.author?.avatar || 'https://ui-avatars.com/api/?name=' + post?.author?.userName"
                  :alt="post?.author?.userName"
                  class="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-600 shadow-md flex-shrink-0" />
                <div>
                  <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">{{ post?.author?.userName }}</h3>
                  <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {{ post?.author?.bio || 'Passionate traveler and writer.' }}</p>
                  <div class="flex gap-3 justify-center md:justify-start">
                    <a href="#"
                      class="w-10 h-10 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:shadow-md transition-all">
                      <i class='bx bxl-facebook text-xl'></i>
                    </a>
                    <a href="#"
                      class="w-10 h-10 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:shadow-md transition-all">
                      <i class='bx bxl-twitter text-xl'></i>
                    </a>
                    <a href="#"
                      class="w-10 h-10 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:shadow-md transition-all">
                      <i class='bx bxl-instagram text-xl'></i>
                    </a>
                  </div>
                </div>
              </div>

              <!-- Comments Section -->
              <div class="mt-16">
                <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-8">
                  Comments ({{ commentsData?.total || 0 }})
                </h3>

                <!-- Comment Form -->
                <form v-if="user" @submit.prevent="handleCreateComment" class="space-y-4 mb-8">
                  <textarea v-model="newCommentContent" placeholder="Write a comment..." rows="4"
                    class="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-500/20 transition-all text-gray-900 dark:text-white placeholder-gray-400"
                    required></textarea>
                  <button type="submit" :disabled="createCommentMutation?.isPending?.value || !newCommentContent.trim()"
                    class="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full hover:shadow-lg hover:shadow-orange-200 dark:hover:shadow-none hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ createCommentMutation?.isPending?.value ? 'Posting...' : 'Post Comment' }}
                  </button>
                </form>

                <!-- Login prompt -->
                <div v-else class="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl text-center">
                  <p class="text-gray-600 dark:text-gray-300 mb-4">Please login to comment</p>
                  <router-link to="/login"
                    class="inline-block px-6 py-3 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-colors">
                    Login
                  </router-link>
                </div>

                <!-- Comments List -->
                <div v-if="commentsLoading" class="text-center py-8">
                  <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto">
                  </div>
                </div>

                <div v-else-if="comments.length > 0" class="space-y-6">
                  <CommentItem v-for="comment in comments" :key="comment.id" :comment="comment" :current-user="user"
                    :blog-id="id" @refresh="refetchComments" />
                </div>

                <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
                  No comments yet. Be the first to comment!
                </div>
              </div>
            </div>
          </article>

          <!-- Sidebar (4 cols) -->
          <aside class="lg:col-span-4 space-y-8">
            <!-- Sticky Container -->
            <div class="sticky top-24 space-y-8">

              <!-- Share Widget -->
              <div
                class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-transparent dark:border-gray-700">
                <h3
                  class="text-lg font-bold text-gray-800 dark:text-white mb-4 pb-3 border-b-2 border-orange-500 inline-block">
                  Share</h3>
                <div class="flex gap-3">
                  <button @click="shareOnFacebook"
                    class="flex-1 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all">
                    <i class='bx bxl-facebook text-2xl'></i>
                  </button>
                  <button @click="shareOnTwitter"
                    class="flex-1 h-12 bg-sky-50 dark:bg-sky-900/30 text-sky-500 dark:text-sky-400 rounded-xl flex items-center justify-center hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white transition-all">
                    <i class='bx bxl-twitter text-2xl'></i>
                  </button>
                  <button @click="copyLink"
                    class="flex-1 h-12 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl flex items-center justify-center hover:bg-gray-800 hover:text-white dark:hover:bg-gray-600 dark:hover:text-white transition-all">
                    <i class='bx bx-link text-2xl'></i>
                  </button>
                </div>
              </div>

              <!-- Related Posts -->
              <div
                class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-transparent dark:border-gray-700"
                v-if="relatedPosts.length > 0">
                <h3
                  class="text-lg font-bold text-gray-800 dark:text-white mb-6 pb-3 border-b-2 border-orange-500 inline-block">
                  Related Posts</h3>
                <div class="space-y-6">
                  <router-link v-for="relatedPost in relatedPosts" :key="relatedPost?.id"
                    :to="`/blog/${relatedPost?.id}`" class="group flex gap-4 items-start">
                    <div class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img :src="getImageUrl(relatedPost?.thumbnail)" :alt="relatedPost?.name"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <h4
                        class="font-bold text-gray-800 dark:text-white leading-snug mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
                        {{ relatedPost?.name }}</h4>
                      <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{
                        formatDate(relatedPost?.created_at)
                      }}</span>
                    </div>
                  </router-link>
                </div>
              </div>

              <!-- Newsletter -->
              <div
                class="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg p-8 text-center text-white relative overflow-hidden">
                <div
                  class="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                </div>
                <div class="relative z-10">
                  <i class='bx bx-envelope text-4xl mb-4'></i>
                  <h3 class="text-xl font-bold mb-2">Join Our Newsletter</h3>
                  <p class="text-indigo-100 text-sm mb-6">Get the latest travel tips and stories delivered to your
                    inbox.
                  </p>
                  <input type="email" placeholder="Your email address"
                    class="w-full px-4 py-3 rounded-xl text-gray-800 mb-3 focus:outline-none focus:ring-2 focus:ring-white/50" />
                  <button
                    class="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-lg">Subscribe</button>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </div>
    <div v-else-if="isLoading" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
    </div>
    <div v-else class="flex items-center justify-center min-h-screen">
      <p class="text-xl text-gray-600 dark:text-gray-400">Post not found</p>
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
