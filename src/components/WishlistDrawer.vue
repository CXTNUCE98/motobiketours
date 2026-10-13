<script setup lang="ts">
const { isWishlistDrawerVisible, closeDrawer } = useWishlistDrawer();

const { t } = useI18n();
const { data: wishlist, isLoading } = useWishlistQuery();
const { formatPrice } = useCurrency();
const localePath = useLocalePath();
const toggleMutation = useToggleWishlistMutation();

// Responsive drawer size
const drawerSize = computed(() => {
    if (typeof window !== 'undefined') {
        return window.innerWidth < 640 ? '100vw' : '440px'
    }
    return '440px'
})

const tours = computed(() => {
    return (wishlist.value || []).map(tour => ({
        id: tour.id,
        image: tour.thumbnail,
        title: tour.title,
        price: tour.priceUsd,
        duration: tour.duration,
        departFrom: tour.departFrom,
    }));
});

const handleRemove = async (tourId: string) => {
    try {
        await toggleMutation.mutateAsync(tourId);
        ElMessage.success(t('wishlist.removeSuccess'));
    } catch (error) {
        ElMessage.error(t('review.error'));
    }
};
</script>

<template>
    <el-drawer v-model="isWishlistDrawerVisible" direction="rtl" :size="drawerSize" :show-close="false"
        class="wishlist-drawer" append-to-body>
        <template #header>
            <div class="wishlist-head">
                <div>
                    <h2 class="wishlist-head__title">{{ t('wishlist.myWishlist') }}</h2>
                    <p class="wishlist-head__count">{{ t('wishlist.drawer.count', { count: tours.length }, tours.length) }}</p>
                </div>
                <button type="button" class="wishlist-head__close" :aria-label="t('common.close')" @click="closeDrawer">
                    {{ t('common.close') }}
                </button>
            </div>
        </template>

        <div class="wishlist-panel">
            <div class="wishlist-body">
                <!-- Đang tải -->
                <ul v-if="isLoading" class="wishlist-list" role="list" aria-busy="true">
                    <li v-for="i in 4" :key="i" class="wishlist-row wishlist-row--loading">
                        <span class="wishlist-row__thumb" aria-hidden="true"></span>
                        <span class="wishlist-row__body">
                            <span class="wishlist-skeleton-line"></span>
                            <span class="wishlist-skeleton-line wishlist-skeleton-line--short"></span>
                        </span>
                    </li>
                </ul>

                <!-- Trạng thái rỗng -->
                <UiEmptyState v-else-if="tours.length === 0" class="wishlist-empty" :title="t('wishlist.empty')"
                    :description="t('wishlist.drawer.emptyHint')">
                    <UiButton :to="localePath('/tour')" @click="closeDrawer">{{ t('tour.readyTour') }}</UiButton>
                </UiEmptyState>

                <!-- Danh sách yêu thích -->
                <ul v-else class="wishlist-list" role="list">
                    <li v-for="tour in tours" :key="tour.id" class="wishlist-row">
                        <NuxtLink :to="localePath(`/tour/${tour.id}`)" class="wishlist-row__link" @click="closeDrawer">
                            <span class="wishlist-row__thumb">
                                <img :src="tour.image" alt="" loading="lazy">
                            </span>
                            <span class="wishlist-row__body">
                                <span class="wishlist-row__title">{{ tour.title }}</span>
                                <span class="wishlist-row__meta">
                                    <template v-if="tour.duration">{{ tour.duration }}</template>
                                    <template v-if="tour.duration && tour.departFrom"> · </template>
                                    <template v-if="tour.departFrom">{{ tour.departFrom }}</template>
                                </span>
                                <span class="wishlist-row__price">{{ formatPrice(tour.price) }}</span>
                            </span>
                        </NuxtLink>
                        <button type="button" class="wishlist-row__remove" @click="handleRemove(tour.id)">
                            {{ t('wishlist.drawer.remove') }}
                        </button>
                    </li>
                </ul>
            </div>

            <div v-if="tours.length > 0" class="wishlist-foot">
                <UiButton variant="outline" block :to="localePath('/tour')" @click="closeDrawer">
                    {{ t('wishlist.drawer.exploreMore') }}
                </UiButton>
                <UiButton block @click="closeDrawer">{{ t('common.close') }}</UiButton>
            </div>
        </div>
    </el-drawer>
</template>

<style scoped>
.wishlist-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-4);
    width: 100%;
}

.wishlist-head__title {
    font-family: var(--font-serif);
    font-size: var(--text-2xl);
    font-weight: var(--weight-regular);
}

.wishlist-head__count {
    margin-top: 0.25rem;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.wishlist-head__close {
    flex-shrink: 0;
    color: var(--color-text-muted);
    font-size: var(--text-ui);
    text-decoration: underline;
    text-decoration-color: var(--color-accent);
    text-underline-offset: 0.3em;
}

.wishlist-head__close:hover {
    color: var(--color-text);
}

.wishlist-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

.wishlist-body {
    flex: 1 1 auto;
    overflow-y: auto;
    padding-inline: var(--space-6);
}

.wishlist-list {
    border-top: 1px solid var(--color-border);
}

.wishlist-row {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: var(--space-4);
    padding-block: var(--space-5);
    border-bottom: 1px solid var(--color-border);
}

.wishlist-row__link {
    display: flex;
    flex: 1 1 auto;
    gap: var(--space-4);
    min-width: 0;
    color: inherit;
    text-decoration: none;
}

.wishlist-row__thumb {
    display: block;
    flex-shrink: 0;
    width: 4.5rem;
    height: 4.5rem;
    overflow: hidden;
    border-radius: var(--radius-md);
    background: var(--color-bg-subtle);
}

.wishlist-row__thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.wishlist-row__body {
    display: block;
    min-width: 0;
}

.wishlist-row__title {
    display: -webkit-box;
    overflow: hidden;
    font-family: var(--font-serif);
    font-size: var(--text-lg);
    line-height: var(--leading-snug);
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
}

.wishlist-row__link:hover .wishlist-row__title {
    color: var(--color-accent);
}

.wishlist-row__meta {
    display: block;
    margin-top: 0.375rem;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.wishlist-row__price {
    display: block;
    margin-top: var(--space-2);
    font-family: var(--font-serif);
    font-size: var(--text-lg);
    font-variant-numeric: lining-nums;
}

.wishlist-row__remove {
    position: relative;
    z-index: 1;
    flex-shrink: 0;
    margin-top: 0.125rem;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    text-decoration: underline;
    text-decoration-color: var(--color-border);
    text-underline-offset: 0.25em;
}

.wishlist-row__remove:hover {
    color: var(--color-danger);
    text-decoration-color: var(--color-danger);
}

.wishlist-row__link::after {
    content: '';
    position: absolute;
    inset: 0;
}

/* Khung chờ khi tải */
.wishlist-row--loading {
    pointer-events: none;
}

.wishlist-row__thumb[aria-hidden],
.wishlist-skeleton-line {
    background: var(--color-bg-subtle);
}

.wishlist-skeleton-line {
    height: 0.9rem;
    margin-top: var(--space-2);
    border-radius: var(--radius-sm);
}

.wishlist-skeleton-line:first-child {
    margin-top: 0.3rem;
    width: 80%;
}

.wishlist-skeleton-line--short {
    width: 40%;
}

/* Trạng thái rỗng: border-block gốc của UiEmptyState không cần trong khung hẹp của drawer */
.wishlist-empty {
    border-block: 0;
}

.wishlist-foot {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    padding: var(--space-5) var(--space-6);
    border-top: 1px solid var(--color-border);
}

.wishlist-foot > :deep(.ui-btn) {
    flex: 1 1 10rem;
}

.wishlist-head__close:focus-visible,
.wishlist-row__remove:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}

.wishlist-row__link:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 4px;
}
</style>

<style>
/* Chrome của el-drawer được teleport ra ngoài cây component, phải ghi đè toàn cục,
   namespaced dưới .wishlist-drawer để không ảnh hưởng drawer khác. */
.wishlist-drawer {
    --el-drawer-padding-primary: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

@media (min-width: 40rem) {
    .wishlist-drawer {
        border-radius: var(--radius-lg) 0 0 var(--radius-lg);
    }
}

.wishlist-drawer .el-drawer__header {
    margin-bottom: 0;
    padding: var(--space-6);
    border-bottom: 1px solid var(--color-border);
}

.wishlist-drawer .el-drawer__body {
    display: flex !important;
    flex-direction: column !important;
    padding: 0;
    height: 100%;
    overflow: hidden;
}

.wishlist-drawer .el-drawer__body::-webkit-scrollbar {
    width: 6px;
}

.wishlist-drawer .el-drawer__body::-webkit-scrollbar-thumb {
    border-radius: var(--radius-pill);
    background: var(--color-border);
}
</style>
