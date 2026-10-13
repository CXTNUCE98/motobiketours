<script setup lang="ts">
const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();
const { data: wishlist, isLoading } = useWishlistQuery();

const tours = computed(() => {
    return (wishlist.value || []).map(tour => ({
        id: tour.id,
        image: tour.thumbnail,
        title: tour.title,
        price: tour.priceUsd,
        duration: tour.duration,
        people: '2-4',
        tags: tour.type || [],
        rating: tour.ratingStats?.averageRating || 5
    }));
});

// Điều hướng tài khoản: đánh dấu mục đang hoạt động theo đường dẫn hiện tại
const isNavActive = (path: string, exact = false) => {
    const target = localePath(path)
    return exact ? route.path === target : route.path === target || route.path.startsWith(`${target}/`)
}
</script>

<template>
    <div class="account-page">
        <header class="shell account-head">
            <UiEyebrow>{{ t('profile.eyebrow') }}</UiEyebrow>
            <h1 class="account-head__title">{{ t('wishlist.myWishlist') }}</h1>
        </header>

        <div class="shell account-layout">
            <nav class="account-nav" :aria-label="t('profile.nav.ariaLabel')">
                <ul role="list">
                    <li>
                        <NuxtLink :to="localePath('/profile')" :aria-current="isNavActive('/profile', true) ? 'page' : undefined">
                            {{ t('profile.nav.info') }}
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink :to="localePath('/profile/bookings')" :aria-current="isNavActive('/profile/bookings') ? 'page' : undefined">
                            {{ t('profile.nav.bookings') }}
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink :to="localePath('/profile/wishlist')" :aria-current="isNavActive('/profile/wishlist') ? 'page' : undefined">
                            {{ t('profile.nav.wishlist') }}
                        </NuxtLink>
                    </li>
                </ul>
            </nav>

            <div class="account-main">
                <!-- Đang tải -->
                <ul v-if="isLoading" class="wishlist-grid" role="list" aria-busy="true">
                    <li v-for="i in 3" :key="i">
                        <UiSkeletonCard />
                    </li>
                </ul>

                <!-- Trạng thái rỗng -->
                <UiEmptyState v-else-if="tours.length === 0" :title="t('wishlist.empty')">
                    <UiButton :to="localePath('/tour')">{{ t('tour.readyTour') }}</UiButton>
                </UiEmptyState>

                <!-- Lưới tour -->
                <ul v-else class="wishlist-grid" role="list">
                    <li v-for="tour in tours" :key="tour.id">
                        <TourCard :tour="tour" />
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
.account-head {
    padding-top: var(--space-page-top);
    padding-bottom: var(--space-fluid-lg);
}

.account-head__title {
    font-family: var(--font-serif);
    font-size: var(--text-h3);
    font-weight: var(--weight-regular);
    line-height: var(--leading-tight);
}

.account-layout {
    display: grid;
    gap: var(--space-fluid-lg);
    align-items: start;
    padding-bottom: var(--section-space);
}

@media (min-width: 64rem) {
    .account-layout {
        grid-template-columns: minmax(12rem, 1fr) 3fr;
    }
}

/* Điều hướng tài khoản */
.account-nav ul {
    border-top: 1px solid var(--color-border);
}

@media (min-width: 64rem) {
    .account-nav {
        position: sticky;
        top: calc(var(--header-height) + 1.5rem);
    }
}

.account-nav a {
    display: block;
    padding-block: var(--space-4);
    border-bottom: 1px solid var(--color-border);
    color: var(--color-text-muted);
    font-size: var(--text-ui);
    text-decoration: none;
}

.account-nav a:hover {
    color: var(--color-text);
}

.account-nav a[aria-current='page'] {
    color: var(--color-accent);
    font-weight: var(--weight-medium);
}

.account-nav a:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}

/* Lưới tour yêu thích */
.wishlist-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
    gap: var(--space-fluid-md) var(--space-fluid-sm);
}
</style>
