<script setup lang="ts">
// Lưu tour (wishlist) và chia sẻ, đặt cạnh tiêu đề trang tour
const props = defineProps<{
    tourId: string;
    title: string;
}>();

const { t } = useI18n();
const { isAuthenticated } = useAuth();

const { data: wishlistStatus } = useIsWishlistedQuery(computed(() => props.tourId));
const toggleWishlistMutation = useToggleWishlistMutation();
const isWishlisted = computed(() => wishlistStatus.value?.isWishlisted || false);

const toggleWishlist = async () => {
    if (!isAuthenticated.value) {
        ElMessage.warning(t('wishlist.loginRequired'));
        return;
    }

    try {
        const wasWishlisted = isWishlisted.value;
        await toggleWishlistMutation.mutateAsync(props.tourId);
        ElMessage.success(wasWishlisted ? t('wishlist.removeSuccess') : t('wishlist.addSuccess'));
    } catch (err) {
        ElMessage.error(t('review.error'));
    }
};

// Chia sẻ: điện thoại dùng bảng chia sẻ của hệ điều hành, máy tính mở menu
const shareRoot = ref<HTMLElement | null>(null);
const shareOpen = ref(false);

const openShare = async () => {
    if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
        try {
            await navigator.share({ title: props.title, url: window.location.href });
        } catch {
            // Người dùng đóng bảng chia sẻ
        }
        return;
    }
    shareOpen.value = !shareOpen.value;
};

const shareOn = (platform: 'facebook' | 'twitter' | 'whatsapp') => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(props.title);
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
        whatsapp: `https://wa.me/?text=${title}%20${url}`,
    };
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    shareOpen.value = false;
};

const copyLink = async () => {
    try {
        await navigator.clipboard.writeText(window.location.href);
        ElMessage.success(t('tour.share.copied'));
    } catch {
        ElMessage.error(t('tour.share.copyFailed'));
    }
    shareOpen.value = false;
};

const onDocumentClick = (e: MouseEvent) => {
    if (shareOpen.value && !shareRoot.value?.contains(e.target as Node)) shareOpen.value = false;
};
const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') shareOpen.value = false;
};

onMounted(() => {
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
    <div class="tour-actions">
        <button type="button" class="tour-actions__btn" :class="{ 'is-active': isWishlisted }"
            :aria-pressed="isWishlisted" @click="toggleWishlist">
            <svg :fill="isWishlisted ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5"
                viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {{ isWishlisted ? t('tour.saved') : t('tour.saveTour') }}
        </button>

        <div ref="shareRoot" class="tour-actions__share">
            <button type="button" class="tour-actions__btn" aria-haspopup="menu" :aria-expanded="shareOpen"
                @click="openShare">
                <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 15V3.5M7.5 8 12 3.5 16.5 8M5 13v6.5h14V13" />
                </svg>
                {{ t('tour.share.button') }}
            </button>

            <ul v-if="shareOpen" class="tour-actions__menu" role="menu">
                <li role="none"><button type="button" role="menuitem" @click="shareOn('facebook')">Facebook</button></li>
                <li role="none"><button type="button" role="menuitem" @click="shareOn('twitter')">X (Twitter)</button></li>
                <li role="none"><button type="button" role="menuitem" @click="shareOn('whatsapp')">WhatsApp</button></li>
                <li role="none"><button type="button" role="menuitem" @click="copyLink">{{ t('tour.share.copyLink') }}</button></li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.tour-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
}

.tour-actions__share {
    position: relative;
}

.tour-actions__btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    min-height: 2.5rem;
    padding: 0 var(--space-4);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-pill);
    background: var(--color-surface);
    color: var(--color-text);
    font-size: var(--text-md);
    font-weight: var(--weight-medium);
    transition: border-color var(--transition-base), color var(--transition-base);
}

.tour-actions__btn:hover {
    border-color: var(--color-text);
}

.tour-actions__btn:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}

.tour-actions__btn svg {
    width: 1.125rem;
    height: 1.125rem;
}

.tour-actions__btn.is-active {
    border-color: var(--color-danger);
    color: var(--color-danger);
}

.tour-actions__menu {
    position: absolute;
    top: calc(100% + var(--space-2));
    right: 0;
    z-index: 20;
    min-width: 12rem;
    padding: var(--space-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    box-shadow: var(--shadow-popover);
}

.tour-actions__menu button {
    display: block;
    width: 100%;
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-sm);
    color: var(--color-text);
    font-size: var(--text-md);
    text-align: left;
}

.tour-actions__menu button:hover,
.tour-actions__menu button:focus-visible {
    background: var(--color-bg-subtle);
    outline: none;
}
</style>
