<script setup>
import { ref, computed } from 'vue'

// Active category filter
const activeCategory = ref('All')

// Search query
const searchQuery = ref('')

// Categories
const categories = [
  'All',
  'Travel Tips',
  'Destinations',
  'Culture',
  'Food',
  'Adventure',
  'Guides'
]

// Blog posts data
const blogPosts = ref([
  {
    id: 1,
    title: 'Top 10 Scenic Routes for Motorbike Tours in Vietnam',
    excerpt: 'Discover the most breathtaking routes from Ha Giang Loop to Hai Van Pass. Experience Vietnam\'s stunning landscapes on two wheels.',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop',
    category: 'Destinations',
    author: {
      name: 'Quang Nguyen',
      avatar: 'https://ui-avatars.com/api/?name=Quang+Nguyen&background=FF6B35&color=fff'
    },
    date: '2025-11-15',
    readTime: '8 min read',
    featured: true
  },
  {
    id: 2,
    title: 'Essential Safety Tips for Motorbike Adventures',
    excerpt: 'Stay safe on your journey with our comprehensive guide to motorbike safety in Vietnam. From gear to road rules.',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&h=600&fit=crop',
    category: 'Travel Tips',
    author: {
      name: 'Minh Tran',
      avatar: 'https://ui-avatars.com/api/?name=Minh+Tran&background=1A71C7&color=fff'
    },
    date: '2025-11-12',
    readTime: '6 min read',
    featured: false
  },
  {
    id: 3,
    title: 'Exploring Vietnamese Street Food on Your Tour',
    excerpt: 'A culinary journey through Vietnam\'s best street food spots. Must-try dishes and where to find them along popular routes.',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop',
    category: 'Food',
    author: {
      name: 'Lan Pham',
      avatar: 'https://ui-avatars.com/api/?name=Lan+Pham&background=FFA726&color=fff'
    },
    date: '2025-11-10',
    readTime: '7 min read',
    featured: false
  },
  {
    id: 4,
    title: 'Ha Giang Loop: Complete Guide for First-Timers',
    excerpt: 'Everything you need to know about conquering the legendary Ha Giang Loop. Route details, best stops, and insider tips.',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop',
    category: 'Guides',
    author: {
      name: 'Quang Nguyen',
      avatar: 'https://ui-avatars.com/api/?name=Quang+Nguyen&background=FF6B35&color=fff'
    },
    date: '2025-11-08',
    readTime: '10 min read',
    featured: false
  },
  {
    id: 5,
    title: 'Understanding Vietnamese Culture Through Travel',
    excerpt: 'Immerse yourself in local traditions, customs, and etiquette. Connect deeper with Vietnam beyond the tourist trail.',
    image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop',
    category: 'Culture',
    author: {
      name: 'Hoa Le',
      avatar: 'https://ui-avatars.com/api/?name=Hoa+Le&background=D81B60&color=fff'
    },
    date: '2025-11-05',
    readTime: '9 min read',
    featured: false
  },
  {
    id: 6,
    title: 'Best Time to Visit Vietnam for Motorbike Tours',
    excerpt: 'Plan your perfect trip with our seasonal guide. Weather patterns, festivals, and optimal touring conditions.',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=600&fit=crop',
    category: 'Travel Tips',
    author: {
      name: 'Minh Tran',
      avatar: 'https://ui-avatars.com/api/?name=Minh+Tran&background=1A71C7&color=fff'
    },
    date: '2025-11-03',
    readTime: '5 min read',
    featured: false
  },
  {
    id: 7,
    title: 'Off-Road Adventures in Central Highlands',
    excerpt: 'Tackle challenging terrain and discover hidden gems in Vietnam\'s mountainous heart. For experienced riders seeking thrills.',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=600&fit=crop',
    category: 'Adventure',
    author: {
      name: 'Duc Vo',
      avatar: 'https://ui-avatars.com/api/?name=Duc+Vo&background=4CAF50&color=fff'
    },
    date: '2025-11-01',
    readTime: '8 min read',
    featured: false
  },
  {
    id: 8,
    title: 'Coastal Routes: From Hue to Hoi An',
    excerpt: 'Experience the stunning coastline along Highway 1. Beach stops, seafood, and the famous Hai Van Pass.',
    image: 'https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=800&h=600&fit=crop',
    category: 'Destinations',
    author: {
      name: 'Lan Pham',
      avatar: 'https://ui-avatars.com/api/?name=Lan+Pham&background=FFA726&color=fff'
    },
    date: '2025-10-28',
    readTime: '7 min read',
    featured: false
  },
  {
    id: 9,
    title: 'Packing Guide for Long-Distance Motorbike Tours',
    excerpt: 'What to bring and what to leave behind. Essential gear, clothing, and equipment for multi-day adventures.',
    image: 'https://images.unsplash.com/photo-1622260614927-9c2e4e0b8c2f?w=800&h=600&fit=crop',
    category: 'Travel Tips',
    author: {
      name: 'Quang Nguyen',
      avatar: 'https://ui-avatars.com/api/?name=Quang+Nguyen&background=FF6B35&color=fff'
    },
    date: '2025-10-25',
    readTime: '6 min read',
    featured: false
  },
  {
    id: 10,
    title: 'Homestay Experiences Along the Ho Chi Minh Trail',
    excerpt: 'Connect with local families and experience authentic Vietnamese hospitality. Our favorite homestays and what to expect.',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
    category: 'Culture',
    author: {
      name: 'Hoa Le',
      avatar: 'https://ui-avatars.com/api/?name=Hoa+Le&background=D81B60&color=fff'
    },
    date: '2025-10-22',
    readTime: '8 min read',
    featured: false
  }
])

// Filtered posts based on category and search
const filteredPosts = computed(() => {
  let posts = blogPosts.value

  // Filter by category
  if (activeCategory.value !== 'All') {
    posts = posts.filter(post => post.category === activeCategory.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    posts = posts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query)
    )
  }

  return posts
})

// Featured post
const featuredPost = computed(() => {
  return blogPosts.value.find(post => post.featured)
})

// Regular posts (non-featured)
const regularPosts = computed(() => {
  return filteredPosts.value.filter(post => !post.featured)
})

// Popular posts for sidebar
const popularPosts = computed(() => {
  return blogPosts.value.slice(0, 4)
})

// Category counts
const categoryCounts = computed(() => {
  const counts = {}
  blogPosts.value.forEach(post => {
    counts[post.category] = (counts[post.category] || 0) + 1
  })
  return counts
})

// Tags
const tags = ['Motorbike', 'Vietnam', 'Adventure', 'Travel', 'Culture', 'Food', 'Safety', 'Routes', 'Tips', 'Guides']

// Methods
const setCategory = (category) => {
  activeCategory.value = category
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <div class="blog-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-overlay">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="gradient-text">Blog & Travel Stories</span>
          </h1>
          <p class="hero-subtitle">
            Discover tips, guides, and inspiring stories from Vietnam's most scenic motorbike routes
          </p>
          
          <!-- Search Bar -->
          <div class="search-container">
            <div class="search-wrapper">
              <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Search articles, destinations, tips..." 
                class="search-input"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="blog-container">
      <!-- Category Filter -->
      <section class="category-section">
        <div class="category-scroll">
          <button
            v-for="category in categories"
            :key="category"
            @click="setCategory(category)"
            :class="['category-pill', { active: activeCategory === category }]"
          >
            {{ category }}
          </button>
        </div>
      </section>

      <div class="content-wrapper">
        <!-- Main Content -->
        <div class="main-content">
          <!-- Featured Post -->
          <section v-if="featuredPost && activeCategory === 'All' && !searchQuery" class="featured-section">
            <div class="featured-post">
              <div class="featured-image-wrapper">
                <img :src="featuredPost.image" :alt="featuredPost.title" class="featured-image" />
                <div class="featured-overlay">
                  <span class="featured-badge">Featured</span>
                  <span class="category-badge">{{ featuredPost.category }}</span>
                </div>
              </div>
              <div class="featured-content">
                <h2 class="featured-title">{{ featuredPost.title }}</h2>
                <p class="featured-excerpt">{{ featuredPost.excerpt }}</p>
                <div class="featured-meta">
                  <div class="author-info">
                    <img :src="featuredPost.author.avatar" :alt="featuredPost.author.name" class="author-avatar" />
                    <div>
                      <div class="author-name">{{ featuredPost.author.name }}</div>
                      <div class="post-date">{{ formatDate(featuredPost.date) }} • {{ featuredPost.readTime }}</div>
                    </div>
                  </div>
                  <button class="read-more-btn">
                    Read Article
                    <svg class="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- Blog Grid -->
          <section class="blog-grid">
            <div 
              v-for="post in regularPosts" 
              :key="post.id"
              class="blog-card"
            >
              <div class="card-image-wrapper">
                <img :src="post.image" :alt="post.title" class="card-image" />
                <span class="card-category">{{ post.category }}</span>
              </div>
              <div class="card-content">
                <h3 class="card-title">{{ post.title }}</h3>
                <p class="card-excerpt">{{ post.excerpt }}</p>
                <div class="card-footer">
                  <div class="card-author">
                    <img :src="post.author.avatar" :alt="post.author.name" class="card-avatar" />
                    <div class="card-author-info">
                      <div class="card-author-name">{{ post.author.name }}</div>
                      <div class="card-meta">{{ formatDate(post.date) }} • {{ post.readTime }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Pagination -->
          <section class="pagination-section">
            <button class="pagination-btn" disabled>
              <svg class="pagination-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <div class="pagination-numbers">
              <button class="page-number active">1</button>
              <button class="page-number">2</button>
              <button class="page-number">3</button>
              <span class="page-dots">...</span>
              <button class="page-number">10</button>
            </div>
            <button class="pagination-btn">
              Next
              <svg class="pagination-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </section>
        </div>

        <!-- Sidebar -->
        <aside class="sidebar">
          <!-- Popular Posts Widget -->
          <div class="widget">
            <h3 class="widget-title">Popular Posts</h3>
            <div class="popular-posts">
              <div 
                v-for="post in popularPosts" 
                :key="post.id"
                class="popular-post-item"
              >
                <img :src="post.image" :alt="post.title" class="popular-post-image" />
                <div class="popular-post-content">
                  <h4 class="popular-post-title">{{ post.title }}</h4>
                  <div class="popular-post-meta">{{ formatDate(post.date) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Categories Widget -->
          <div class="widget">
            <h3 class="widget-title">Categories</h3>
            <div class="categories-list">
              <button
                v-for="category in categories.filter(c => c !== 'All')"
                :key="category"
                @click="setCategory(category)"
                class="category-item"
              >
                <span>{{ category }}</span>
                <span class="category-count">{{ categoryCounts[category] || 0 }}</span>
              </button>
            </div>
          </div>

          <!-- Tags Widget -->
          <div class="widget">
            <h3 class="widget-title">Popular Tags</h3>
            <div class="tags-cloud">
              <span 
                v-for="tag in tags" 
                :key="tag"
                class="tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Newsletter Widget -->
          <div class="widget newsletter-widget">
            <h3 class="widget-title">Newsletter</h3>
            <p class="newsletter-text">Subscribe to get the latest travel tips and stories</p>
            <input type="email" placeholder="Your email" class="newsletter-input" />
            <button class="newsletter-btn">Subscribe</button>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.blog-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* Hero Section */
.hero-section {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding: 80px 20px;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.hero-overlay {
  position: relative;
  z-index: 1;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 20px;
  line-height: 1.2;
}

.gradient-text {
  background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 40px;
  line-height: 1.6;
}

/* Search Container */
.search-container {
  max-width: 600px;
  margin: 0 auto;
}

.search-wrapper {
  position: relative;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search-wrapper:focus-within {
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.search-icon {
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.8);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 14px 24px 14px 56px;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 1rem;
  font-weight: 500;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

/* Blog Container */
.blog-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Category Section */
.category-section {
  margin-bottom: 40px;
}

.category-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 8px 0;
  scrollbar-width: none;
}

.category-scroll::-webkit-scrollbar {
  display: none;
}

.category-pill {
  padding: 12px 28px;
  background: white;
  border: 2px solid transparent;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.95rem;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.category-pill:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.category-pill.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
}

/* Content Wrapper */
.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 40px;
}

.main-content {
  min-width: 0;
}

/* Featured Section */
.featured-section {
  margin-bottom: 60px;
}

.featured-post {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
}

.featured-post:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.featured-image-wrapper {
  position: relative;
  height: 400px;
  overflow: hidden;
}

.featured-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.featured-post:hover .featured-image {
  transform: scale(1.1);
}

.featured-overlay {
  position: absolute;
  top: 24px;
  left: 24px;
  right: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.featured-badge {
  padding: 8px 20px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 16px rgba(245, 87, 108, 0.4);
}

.category-badge {
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  color: #667eea;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.85rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.featured-content {
  padding: 40px;
}

.featured-title {
  font-size: 2rem;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 16px;
  line-height: 1.3;
}

.featured-excerpt {
  font-size: 1.1rem;
  color: #718096;
  line-height: 1.7;
  margin-bottom: 32px;
}

.featured-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 3px solid #f7fafc;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.author-name {
  font-weight: 700;
  color: #2d3748;
  font-size: 0.95rem;
}

.post-date {
  font-size: 0.85rem;
  color: #a0aec0;
  margin-top: 2px;
}

.read-more-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.read-more-btn:hover {
  transform: translateX(4px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.arrow-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.read-more-btn:hover .arrow-icon {
  transform: translateX(4px);
}

/* Blog Grid */
.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 32px;
  margin-bottom: 60px;
}

.blog-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;
  cursor: pointer;
}

.blog-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card-image-wrapper {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.blog-card:hover .card-image {
  transform: scale(1.15);
}

.card-category {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  color: #667eea;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.8rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-content {
  padding: 28px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-excerpt {
  font-size: 0.95rem;
  color: #718096;
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  border-top: 1px solid #e2e8f0;
  padding-top: 20px;
}

.card-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #f7fafc;
}

.card-author-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
}

.card-meta {
  font-size: 0.8rem;
  color: #a0aec0;
  margin-top: 2px;
}

/* Pagination */
.pagination-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  color: #4a5568;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-icon {
  width: 18px;
  height: 18px;
}

.pagination-numbers {
  display: flex;
  gap: 8px;
  align-items: center;
}

.page-number {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  color: #4a5568;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-number:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
}

.page-number.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.page-dots {
  color: #a0aec0;
  font-weight: 600;
}

/* Sidebar */
.sidebar {
  position: sticky;
  top: 20px;
  height: fit-content;
}

.widget {
  background: white;
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.widget-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 3px solid #667eea;
}

/* Popular Posts */
.popular-posts {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.popular-post-item {
  display: flex;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 12px;
}

.popular-post-item:hover {
  background: #f7fafc;
  transform: translateX(4px);
}

.popular-post-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  flex-shrink: 0;
}

.popular-post-content {
  flex: 1;
  min-width: 0;
}

.popular-post-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
  line-height: 1.4;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.popular-post-meta {
  font-size: 0.75rem;
  color: #a0aec0;
}

/* Categories List */
.categories-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f7fafc;
  border: none;
  border-radius: 12px;
  color: #4a5568;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-item:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateX(4px);
}

.category-count {
  padding: 4px 12px;
  background: white;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 700;
}

.category-item:hover .category-count {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

/* Tags Cloud */
.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 8px 16px;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 50px;
  color: #4a5568;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* Newsletter Widget */
.newsletter-widget {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.newsletter-widget .widget-title {
  color: white;
  border-bottom-color: rgba(255, 255, 255, 0.3);
}

.newsletter-text {
  margin-bottom: 16px;
  line-height: 1.6;
  opacity: 0.95;
}

.newsletter-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: white;
  font-size: 0.95rem;
  margin-bottom: 12px;
  outline: none;
  transition: all 0.3s ease;
}

.newsletter-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.newsletter-input:focus {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
}

.newsletter-btn {
  width: 100%;
  padding: 12px;
  background: white;
  border: none;
  border-radius: 12px;
  color: #667eea;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.newsletter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .content-wrapper {
    grid-template-columns: 1fr 300px;
  }
}

@media (max-width: 992px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .blog-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .featured-image-wrapper {
    height: 280px;
  }

  .featured-content {
    padding: 28px;
  }

  .featured-title {
    font-size: 1.5rem;
  }

  .featured-meta {
    flex-direction: column;
    align-items: flex-start;
  }

  .blog-grid {
    grid-template-columns: 1fr;
  }

  .pagination-section {
    gap: 8px;
  }

  .pagination-btn {
    padding: 10px 16px;
    font-size: 0.85rem;
  }

  .page-number {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 60px 16px;
  }

  .hero-title {
    font-size: 1.75rem;
  }

  .category-pill {
    padding: 10px 20px;
    font-size: 0.85rem;
  }

  .card-content {
    padding: 20px;
  }

  .widget {
    padding: 20px;
  }
}
</style>