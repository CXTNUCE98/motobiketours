<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBlogsQuery } from '~/composables/useBlogQuery'
import { watchDebounced } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

// Các trường API /blog thực tế trả về và được dùng trên trang này
type BlogListItem = {
  id: string
  name: string
  shortDescription?: string
  thumbnail?: string
  category?: string
  createdAt?: string
  numWords?: number
  author?: { userName?: string; avatar?: string }
}

const { user } = useAuth();
const isUser = computed(() => !!user.value?.email);
const localePath = useLocalePath()

const { t, locale } = useI18n()

// Active category filter ('' = tất cả)
const activeCategory = ref('')

// Search query
const searchQuery = ref('')

// Categories
const categories = computed(() => [
  { label: t('blog.type.all'), value: '' },
  { label: t('blog.type.travelTips'), value: 'travel-tips' },
  { label: t('blog.type.destination'), value: 'destination' },
  { label: t('blog.type.culture'), value: 'culture' },
  { label: t('blog.type.food'), value: 'food' },
  { label: t('blog.type.adventure'), value: 'adventure' },
  { label: t('blog.type.guides'), value: 'guides' },
])

// Popular tags
const tags = [
  'Motorbike', 'Vietnam', 'Food', 'Culture', 'Adventure', 'Tips', 'Routes', 'Ha Giang', 'Safety'
]

// API Params
const params = ref<{ category: string; tags: string; p: number; r: number; q?: string }>({
  category: '',
  tags: '',
  p: 1,
  r: 10,
})

// Fetch data
const { data, isLoading, isFetching } = useBlogsQuery(params)

// Computed properties
const posts = computed<BlogListItem[]>(() => (data.value?.data as unknown as BlogListItem[]) || [])
const totalPages = computed(() => data.value?.totalPages || 0)

// Bài đầu tiên của trang 1 làm bài nổi bật, không lặp lại trong lưới bên dưới
const featuredPost = computed(() => (params.value.p === 1 ? posts.value[0] : undefined))
const gridPosts = computed(() => (featuredPost.value ? posts.value.slice(1) : posts.value))

// Methods
const setCategory = (category: string) => {
  activeCategory.value = category
  params.value.category = category
  params.value.p = 1
}

const activeTags = computed({
  get: () => params.value.tags ? params.value.tags.split(',') : [],
  set: (val: string[]) => {
    params.value.tags = val.join(',')
    params.value.p = 1
  }
})

const toggleTag = (tag: string) => {
  const current = activeTags.value
  if (current.includes(tag)) {
    activeTags.value = current.filter(item => item !== tag)
  } else {
    activeTags.value = [...current, tag]
  }
}

const setPage = (page: number) => {
  params.value.p = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watchDebounced(searchQuery, (newVal) => {
  params.value.q = newVal
  params.value.p = 1
}, { debounce: 500, maxWait: 1000 })

const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString(locale.value === 'vi' ? 'vi-VN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function calculateReadTime(numWords?: number, wordsPerMinute = 180) {
  if (!numWords || numWords <= 0) return 0;
  return Math.ceil(numWords / wordsPerMinute);
}

const getImageUrl = (thumbnail?: string) => {
  if (!thumbnail) return 'https://via.placeholder.com/800x600?text=No+Image'
  if (thumbnail.startsWith('http')) return thumbnail
  return `https://res.cloudinary.com/daok0blh9/image/upload/v1764131273/${thumbnail}.jpg`
}

const categoryLabel = (value?: string) =>
  categories.value.find(category => category.value && category.value === value)?.label || value

const postMeta = (post: BlogListItem) => [
  formatDate(post.createdAt),
  t('blog.readTime', { count: calculateReadTime(post.numWords) }),
].filter(Boolean)

const postAuthor = (post: BlogListItem) => ({
  name: post.author?.userName,
  avatar: post.author?.avatar || (post.author?.userName ? `https://ui-avatars.com/api/?name=${post.author.userName}` : undefined),
})
</script>

<template>
  <div class="blog-page">
    <UiPageHero :eyebrow="t('blog.blog')" :title="t('blog.discover')" :emphasis="t('blog.epicJourneys')"
      :intro="t('blog.epicJourneysDesc')">
      <template v-if="isUser" #actions>
        <UiButton :to="localePath('/blog/create')">+ {{ t('blog.create') }}</UiButton>
      </template>
    </UiPageHero>

    <!-- Bộ lọc -->
    <section class="shell blog-filters" :aria-label="t('blog.filter.title')">
      <div class="blog-filters__row">
        <div class="blog-filters__chips" role="group" :aria-label="t('blog.filter.categories')">
          <UiChip v-for="category in categories" :key="category.value" :active="activeCategory === category.value"
            @click="setCategory(category.value)">
            {{ category.label }}
          </UiChip>
        </div>

        <form class="blog-filters__search" role="search" @submit.prevent>
          <label class="visually-hidden" for="blog-search">{{ t('blog.filter.search') }}</label>
          <input id="blog-search" v-model="searchQuery" type="search" class="ui-control ui-control--pill"
            :placeholder="t('blog.filter.filterDes')">
        </form>
      </div>

      <div class="blog-filters__tags" role="group" :aria-label="t('blog.filter.tags')">
        <span class="blog-filters__label" aria-hidden="true">{{ t('blog.filter.tags') }}</span>
        <UiChip v-for="tag in tags" :key="tag" :active="activeTags.includes(tag)" @click="toggleTag(tag)">
          #{{ tag }}
        </UiChip>
      </div>
    </section>

    <div class="shell blog-content" :aria-busy="isFetching ? 'true' : 'false'">
      <!-- Skeleton Loading -->
      <ul v-if="isLoading" class="blog-grid" role="list">
        <li v-for="i in 6" :key="i">
          <UiSkeletonCard ratio="3 / 2" />
        </li>
      </ul>

      <template v-else-if="posts.length > 0">
        <!-- Featured Post -->
        <section v-if="featuredPost" class="blog-featured" :aria-label="t('blog.featured')">
          <ArticleCard variant="feature" :heading-level="2" :to="localePath(`/blog/${featuredPost.id}`)"
            :image="getImageUrl(featuredPost.thumbnail)" :title="featuredPost.name"
            :excerpt="featuredPost.shortDescription"
            :eyebrow="categoryLabel(featuredPost.category) || t('blog.featured')"
            :author="postAuthor(featuredPost)" :meta="postMeta(featuredPost)" :cta="t('blog.readArticle')" />
        </section>

        <!-- Regular Posts Grid -->
        <ul v-if="gridPosts.length" class="blog-grid" role="list">
          <li v-for="post in gridPosts" :key="post.id">
            <ArticleCard :to="localePath(`/blog/${post.id}`)" :image="getImageUrl(post.thumbnail)" :title="post.name"
              :excerpt="post.shortDescription" :eyebrow="categoryLabel(post.category)" :author="postAuthor(post)"
              :meta="postMeta(post)" />
          </li>
        </ul>

        <!-- Pagination -->
        <UiPagination class="blog-pagination" :page="params.p" :total-pages="totalPages" @update:page="setPage" />
      </template>

      <!-- Empty State -->
      <UiEmptyState v-else :title="t('blog.emptyTitle')" :description="t('blog.emptyDesc')" />
    </div>

    <NewsletterSignup />
  </div>
</template>

<style scoped>
.blog-filters {
  display: grid;
  gap: var(--space-4);
  padding-bottom: var(--space-5);
  margin-bottom: var(--space-fluid-lg);
  border-bottom: 1px solid var(--color-border-strong);
}

.blog-filters__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.blog-filters__chips,
.blog-filters__tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
}

.blog-filters__search {
  flex: 1 1 16rem;
  max-width: 24rem;
}

.blog-filters__search .ui-control {
  min-height: 2.5rem;
  padding-block: var(--space-2);
  font-size: var(--text-ui);
}

.blog-filters__label {
  margin-right: var(--space-1);
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
}

.blog-filters__tags :deep(.ui-chip) {
  min-height: 2rem;
  padding-inline: var(--space-3);
  font-size: var(--text-sm);
}

.blog-content {
  padding-bottom: var(--section-space);
  transition: opacity var(--transition-base);
}

.blog-content[aria-busy='true'] {
  opacity: 0.55;
}

.blog-featured {
  padding-bottom: var(--space-block);
  margin-bottom: var(--space-block);
  border-bottom: 1px solid var(--color-border);
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
  gap: var(--space-fluid-lg) var(--space-fluid-sm);
}

.blog-pagination {
  margin-top: var(--space-fluid-lg);
}
</style>
