<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useBlogsQuery, useBlogByIdQuery } from '~/composables/useBlogQuery'
import { useCreateCommentMutation } from '~/composables/useBlogMutation'
import CommentItem from '~/components/CommentItem.vue'
import { useQuery } from '@tanstack/vue-query'
import { sanitizeHtml } from '~/utils/sanitize'

const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { user } = useAuth()

const id = computed(() => String(route?.params?.id))

// Fetch Post Detail
const { data: detailBlog, isLoading } = useBlogByIdQuery(id)

const post = computed(() => detailBlog.value || null)

// Nhãn danh mục (khớp với trang danh sách blog)
const categories = computed(() => [
  { label: t('blog.type.travelTips'), value: 'travel-tips' },
  { label: t('blog.type.destination'), value: 'destination' },
  { label: t('blog.type.culture'), value: 'culture' },
  { label: t('blog.type.food'), value: 'food' },
  { label: t('blog.type.adventure'), value: 'adventure' },
  { label: t('blog.type.guides'), value: 'guides' },
])
const categoryLabel = computed(() => categories.value.find(c => c.value === post.value?.category)?.label || post.value?.category)

// Fetch Related Posts (cùng danh mục)
const { data: relatedData } = useBlogsQuery(computed(() => ({
  category: post.value?.category,
  r: 4
})))

const relatedPosts = computed(() => {
  if (!relatedData.value?.data) return []
  return relatedData.value?.data
    .filter(p => String(p.id) !== id.value)
    .slice(0, 3)
})

// Comments (Temporary useQuery until useCommentsQuery is created)
const { data: commentsData, isLoading: commentsLoading, refetch: refetchComments } = useQuery({
  queryKey: ['comments', id],
  queryFn: () => $motobikertoursApi('/comments/tree/{id}', {
    path: { id: id.value },
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

const createCommentMutation = useCreateCommentMutation()

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
  }, {
    onSuccess: () => {
      newCommentContent.value = ''
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
  readingProgress.value = trackLength > 0 ? (scrollTop / trackLength) * 100 : 0
}

onMounted(() => {
  window.addEventListener('scroll', updateReadingProgress)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateReadingProgress)
})

// Share
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
    title: t('common.success'),
    message: t('blog.detail.linkCopied'),
    type: 'success',
  })
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString(locale.value === 'vi' ? 'vi-VN' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const calculateReadTime = (numWords, wordsPerMinute = 180) => {
  if (!numWords || numWords <= 0) return 0
  return Math.ceil(numWords / wordsPerMinute)
}

const getImageUrl = (thumbnail) => {
  if (!thumbnail) return 'https://via.placeholder.com/800x600?text=No+Image'
  if (thumbnail.startsWith('http')) return thumbnail
  return `https://res.cloudinary.com/daok0blh9/image/upload/v1764131273/${thumbnail}.jpg`
}
</script>

<template>
  <div class="blog-detail">
    <div v-if="post">
      <div class="blog-detail__progress" :style="{ width: readingProgress + '%' }" aria-hidden="true" />

      <header class="shell blog-detail__head">
        <p class="blog-detail__eyebrow">
          <NuxtLink :to="localePath('/blog')">{{ categoryLabel || t('blog.blog') }}</NuxtLink>
        </p>
        <h1 class="blog-detail__title">{{ post.name }}</h1>

        <div class="blog-detail__meta">
          <img v-if="post.author?.avatar" :src="post.author.avatar" :alt="post.author?.userName" class="blog-detail__avatar">
          <span v-if="post.author?.userName">{{ post.author.userName }}</span>
          <span>{{ formatDate(post.createdAt) }}</span>
          <span v-if="calculateReadTime(post.numWords)">{{ t('blog.readTime', { count: calculateReadTime(post.numWords) }) }}</span>
        </div>

        <div class="blog-detail__share">
          <UiButton variant="ghost" size="sm" @click="shareOnFacebook">{{ t('blog.detail.shareFacebook') }}</UiButton>
          <UiButton variant="ghost" size="sm" @click="shareOnTwitter">{{ t('blog.detail.shareTwitter') }}</UiButton>
          <UiButton variant="ghost" size="sm" @click="copyLink">{{ t('blog.detail.copyLink') }}</UiButton>
        </div>
      </header>

      <div class="shell blog-detail__cover">
        <img :src="getImageUrl(post.thumbnail)" :alt="post.name" loading="eager" decoding="async">
      </div>

      <div class="shell">
        <div class="blog-detail__measure">
          <div class="prose" v-html="sanitizeHtml(post.content)" />

          <ul v-if="post.tags?.length" class="blog-detail__tags" role="list" :aria-label="t('blog.detail.tags')">
            <li v-for="tag in post.tags" :key="tag">#{{ tag }}</li>
          </ul>

          <section class="blog-detail__comments" :aria-label="t('comment.title', { count: comments.length })">
            <h2 class="blog-detail__comments-title">{{ t('comment.title', { count: comments.length }) }}</h2>

            <form v-if="user" class="blog-detail__comment-form" @submit.prevent="handleCreateComment">
              <label class="visually-hidden" for="new-comment">{{ t('comment.placeholder') }}</label>
              <textarea id="new-comment" v-model="newCommentContent" class="ui-control" rows="4"
                :placeholder="t('comment.placeholder')" required></textarea>
              <UiButton type="submit" :disabled="createCommentMutation?.isPending?.value || !newCommentContent.trim()">
                {{ createCommentMutation?.isPending?.value ? t('comment.posting') : t('comment.post') }}
              </UiButton>
            </form>

            <div v-else class="blog-detail__login-prompt">
              <p>{{ t('comment.loginPrompt') }}</p>
              <UiButton :to="localePath('/login')">{{ t('comment.login') }}</UiButton>
            </div>

            <p v-if="commentsLoading" class="blog-detail__comments-status">{{ t('common.loadingData') }}</p>

            <div v-else-if="comments.length > 0" class="blog-detail__comments-list">
              <CommentItem v-for="comment in comments" :key="comment.id" :comment="comment" :current-user="user"
                :blog-id="id" @refresh="refetchComments" />
            </div>

            <p v-else class="blog-detail__comments-status">{{ t('comment.empty') }}</p>
          </section>
        </div>
      </div>

      <section v-if="relatedPosts.length > 0" class="shell blog-detail__related" :aria-label="t('blog.detail.relatedPosts')">
        <h2 class="blog-detail__related-title">{{ t('blog.detail.relatedPosts') }}</h2>
        <ul class="blog-detail__related-grid" role="list">
          <li v-for="relatedPost in relatedPosts" :key="relatedPost.id">
            <ArticleCard :to="localePath(`/blog/${relatedPost.id}`)" :image="getImageUrl(relatedPost.thumbnail)"
              :title="relatedPost.name" :meta="[formatDate(relatedPost.createdAt)]" />
          </li>
        </ul>
      </section>
    </div>

    <div v-else-if="isLoading" class="shell blog-detail__status">
      <p>{{ t('common.loadingData') }}</p>
    </div>

    <div v-else class="shell blog-detail__notfound">
      <UiEmptyState :title="t('blog.detail.notFound')" :description="t('blog.detail.notFoundDesc')">
        <UiButton :to="localePath('/blog')">{{ t('blog.detail.backToBlog') }}</UiButton>
      </UiEmptyState>
    </div>
  </div>
</template>

<style scoped>
.blog-detail__progress {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  height: 2px;
  background: var(--color-accent);
  transition: width var(--transition-fast);
}

.blog-detail__head {
  padding-top: var(--space-page-top);
  padding-bottom: var(--space-fluid-lg);
}

.blog-detail__eyebrow {
  margin-bottom: var(--space-5);
}

.blog-detail__eyebrow a {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-accent);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-label);
  text-decoration: none;
  text-transform: uppercase;
}

.blog-detail__eyebrow a::before {
  content: '';
  flex-shrink: 0;
  width: 2.5rem;
  height: 1px;
  background: currentColor;
}

.blog-detail__title {
  max-width: 50rem;
  font-family: var(--font-serif);
  font-size: var(--text-display);
  font-weight: var(--weight-regular);
  line-height: var(--leading-display);
  letter-spacing: var(--tracking-display);
  text-wrap: balance;
}

.blog-detail__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-1) var(--space-3);
  margin-top: var(--space-6);
  color: var(--color-text-muted);
  font-size: var(--text-ui);
}

.blog-detail__meta > * + *::before {
  content: '·';
  margin-right: var(--space-3);
}

.blog-detail__avatar {
  width: 1.75rem;
  height: 1.75rem;
  margin-right: var(--space-2);
  border-radius: 50%;
  object-fit: cover;
}

.blog-detail__share {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-5);
}

.blog-detail__share :deep(.ui-btn) {
  padding-inline: 0;
}

.blog-detail__cover {
  margin-bottom: var(--space-block);
}

.blog-detail__cover img {
  width: 100%;
  max-height: 32rem;
  border-radius: var(--radius-md);
  object-fit: cover;
  background: var(--color-bg-subtle);
}

.blog-detail__measure {
  max-width: 42rem;
  margin-inline: auto;
  padding-bottom: var(--space-block);
}

/* Kiểu chữ cho nội dung v-html */
.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3),
.prose :deep(h4) {
  margin-top: var(--space-8);
  margin-bottom: var(--space-3);
  font-family: var(--font-serif);
  font-weight: var(--weight-regular);
  line-height: var(--leading-snug);
}

.prose :deep(h1) {
  font-size: var(--text-h3);
}

.prose :deep(h2) {
  font-size: var(--text-title-lg);
}

.prose :deep(h3) {
  font-size: var(--text-title);
}

.prose :deep(p) {
  margin-bottom: var(--space-5);
  color: var(--color-text);
  font-size: var(--text-lead);
  line-height: var(--leading-body);
}

.prose :deep(a) {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.prose :deep(strong) {
  font-weight: var(--weight-semibold);
}

.prose :deep(ul),
.prose :deep(ol) {
  margin: 0 0 var(--space-5) var(--space-5);
  color: var(--color-text);
  line-height: var(--leading-body);
}

.prose :deep(img) {
  display: block;
  width: 100% !important;
  height: auto !important;
  margin-block: var(--space-6);
  border-radius: var(--radius-md);
}

.prose :deep(blockquote) {
  margin-block: var(--space-6);
  padding-left: var(--space-5);
  border-left: 2px solid var(--color-accent);
  color: var(--color-text-muted);
  font-family: var(--font-serif);
  font-size: var(--text-lead);
  font-style: italic;
}

.blog-detail__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding-top: var(--space-6);
  margin-top: var(--space-6);
  border-top: 1px solid var(--color-border);
}

.blog-detail__tags li {
  padding: 0 var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  line-height: 2rem;
}

.blog-detail__comments {
  padding-top: var(--space-block);
  margin-top: var(--space-block);
  border-top: 1px solid var(--color-border-strong);
}

.blog-detail__comments-title {
  margin-bottom: var(--space-fluid-md);
  font-family: var(--font-serif);
  font-size: var(--text-h3);
  font-weight: var(--weight-regular);
}

.blog-detail__comment-form {
  display: grid;
  gap: var(--space-3);
  margin-bottom: var(--space-fluid-md);
}

.blog-detail__comment-form .ui-btn {
  justify-self: start;
}

.blog-detail__login-prompt {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-5);
  margin-bottom: var(--space-fluid-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.blog-detail__login-prompt p {
  color: var(--color-text-muted);
}

.blog-detail__comments-status {
  padding-block: var(--space-6);
  color: var(--color-text-muted);
  text-align: center;
}

.blog-detail__related {
  padding-bottom: var(--section-space);
  margin-top: var(--space-block);
  border-top: 1px solid var(--color-border-strong);
}

.blog-detail__related-title {
  padding-top: var(--space-fluid-lg);
  margin-bottom: var(--space-fluid-md);
  font-family: var(--font-serif);
  font-size: var(--text-h3);
  font-weight: var(--weight-regular);
}

.blog-detail__related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: var(--space-fluid-lg) var(--space-fluid-sm);
}

.blog-detail__status,
.blog-detail__notfound {
  padding-block: var(--section-space);
  color: var(--color-text-muted);
  text-align: center;
}
</style>
