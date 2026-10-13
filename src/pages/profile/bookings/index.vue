<script setup lang="ts">
import type { FilterBookingDto } from '~/types/booking'

definePageMeta({
    middleware: ['auth']
})

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const { formatPrice } = useCurrency()

const filterKeys = ['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const

// State
const bookingsTab = ref<typeof filterKeys[number]>('all')
const bookingsSearch = ref('')

// Reactive filters
const bookingsFilters = computed<FilterBookingDto>(() => {
    const filters: FilterBookingDto = {
        page: '1',
        limit: '100',
        sortBy: 'createdAt',
        sortOrder: 'DESC',
    }

    if (bookingsTab.value !== 'all') {
        filters.status = bookingsTab.value
    }

    return filters
})

// Fetch bookings
const { data: bookingsData, isLoading: bookingsLoading, refetch: refetchBookings } = useMyBookingsQuery(bookingsFilters)
const cancelMutation = useCancelBookingMutation()

const bookings = computed(() => bookingsData.value?.data || [])
const bookingStats = computed(() => ({
    total: bookingsData.value?.meta?.total || 0,
    pending: bookings.value.filter((b: any) => b.status === 'pending').length,
    confirmed: bookings.value.filter((b: any) => b.status === 'confirmed').length,
    completed: bookings.value.filter((b: any) => b.status === 'completed').length,
    cancelled: bookings.value.filter((b: any) => b.status === 'cancelled').length,
}))

const filteredBookings = computed(() => {
    if (!bookingsSearch.value) return bookings.value
    return bookings.value.filter((booking: any) =>
        booking.tour.title.toLowerCase().includes(bookingsSearch.value.toLowerCase())
    )
})

const formatDate = (value: string | Date) => new Date(value).toLocaleDateString('vi-VN')

const canCancelRow = (booking: any) => booking.status === 'pending' || booking.status === 'confirmed'

// Methods
const handleCancelBooking = async (id: string) => {
    ElMessageBox.confirm(
        t('profile.bookings.cancelConfirmMessage'),
        t('profile.bookings.cancelConfirmTitle'),
        {
            confirmButtonText: t('profile.bookings.cancelConfirmBtn'),
            cancelButtonText: t('profile.bookings.cancelKeepBtn'),
            type: 'warning',
        }
    ).then(async () => {
        await cancelMutation.mutateAsync(id)
        refetchBookings()
    }).catch(() => { })
}

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
            <h1 class="account-head__title">{{ t('profile.bookings.title') }}</h1>
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
                <!-- Tổng quan -->
                <dl class="booking-summary">
                    <div>
                        <dt>{{ t('profile.bookings.stats.total') }}</dt>
                        <dd>{{ bookingStats.total }}</dd>
                    </div>
                    <div>
                        <dt>{{ t('profile.bookings.stats.pending') }}</dt>
                        <dd>{{ bookingStats.pending }}</dd>
                    </div>
                    <div>
                        <dt>{{ t('profile.bookings.stats.confirmed') }}</dt>
                        <dd>{{ bookingStats.confirmed }}</dd>
                    </div>
                    <div>
                        <dt>{{ t('profile.bookings.stats.completed') }}</dt>
                        <dd>{{ bookingStats.completed }}</dd>
                    </div>
                    <div>
                        <dt>{{ t('profile.bookings.stats.cancelled') }}</dt>
                        <dd>{{ bookingStats.cancelled }}</dd>
                    </div>
                </dl>

                <!-- Bộ lọc + tìm kiếm -->
                <div class="booking-toolbar">
                    <div class="booking-toolbar__filters" role="group" :aria-label="t('profile.bookings.title')">
                        <UiChip v-for="key in filterKeys" :key="key" :active="bookingsTab === key" @click="bookingsTab = key">
                            {{ key === 'all' ? t('profile.bookings.filters.all') : t(`profile.bookings.status.${key}`) }}
                        </UiChip>
                    </div>

                    <UiField class="booking-toolbar__search" :label="t('profile.bookings.searchLabel')">
                        <template #default="{ id }">
                            <input :id="id" v-model="bookingsSearch" type="search" class="ui-control"
                                :placeholder="t('profile.bookings.searchPlaceholder')">
                        </template>
                    </UiField>
                </div>

                <!-- Loading -->
                <ul v-if="bookingsLoading" class="booking-list" role="list" aria-busy="true">
                    <li v-for="i in 4" :key="i">
                        <UiSkeletonCard ratio="1 / 1" />
                    </li>
                </ul>

                <!-- Danh sách booking -->
                <ul v-else-if="filteredBookings.length > 0" class="booking-list" role="list">
                    <li v-for="booking in filteredBookings" :key="booking.id" class="booking-row">
                        <div class="booking-row__media">
                            <img :src="booking.tour.thumbnail" :alt="booking.tour.title" loading="lazy" decoding="async">
                        </div>

                        <div class="booking-row__body">
                            <p class="booking-row__code">{{ t('profile.bookings.code') }} · {{ booking.id }}</p>
                            <h3 class="booking-row__title">
                                <NuxtLink :to="localePath(`/profile/bookings/${booking.id}`)" class="booking-row__link">
                                    {{ booking.tour.title }}
                                </NuxtLink>
                            </h3>
                            <dl class="booking-row__facts">
                                <div>
                                    <dt>{{ t('profile.bookings.date') }}</dt>
                                    <dd>{{ formatDate(booking.startDate) }}</dd>
                                </div>
                                <div>
                                    <dt>{{ t('profile.bookings.people') }}</dt>
                                    <dd>{{ booking.numberOfPeople }}</dd>
                                </div>
                            </dl>
                        </div>

                        <div class="booking-row__meta">
                            <span class="status-label" :class="`status-label--${booking.status}`">
                                {{ t(`profile.bookings.status.${booking.status}`) }}
                            </span>
                            <p class="booking-row__total">{{ formatPrice(booking.totalPrice) }}</p>
                            <UiButton v-if="canCancelRow(booking)" variant="outline" size="sm" class="booking-row__cancel"
                                @click="handleCancelBooking(booking.id)">
                                {{ t('profile.bookings.cancel') }}
                            </UiButton>
                        </div>
                    </li>
                </ul>

                <!-- Trạng thái rỗng -->
                <UiEmptyState v-else :title="t('profile.bookings.emptyTitle')"
                    :description="bookingsTab !== 'all' ? t('profile.bookings.emptyDescFiltered') : t('profile.bookings.emptyDesc')">
                    <UiButton :to="localePath('/tour')">{{ t('profile.bookings.exploreTours') }}</UiButton>
                </UiEmptyState>
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

/* Tổng quan */
.booking-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 7rem), 1fr));
    margin-bottom: var(--space-fluid-lg);
    border-block: 1px solid var(--color-border);
}

.booking-summary > div {
    padding-block: var(--space-4);
    border-left: 1px solid var(--color-border);
    text-align: center;
}

.booking-summary > div:first-child {
    border-left: 0;
}

.booking-summary dt {
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.booking-summary dd {
    margin-top: 0.375rem;
    font-family: var(--font-serif);
    font-size: var(--text-2xl);
    font-variant-numeric: lining-nums;
}

/* Bộ lọc + tìm kiếm */
.booking-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--space-4);
    margin-bottom: var(--space-fluid-md);
}

.booking-toolbar__filters {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
}

.booking-toolbar__search {
    flex: 1 1 16rem;
    max-width: 22rem;
}

/* Danh sách booking */
.booking-list {
    border-top: 1px solid var(--color-border);
}

.booking-row {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
    gap: var(--space-4) var(--space-fluid-sm);
    padding-block: var(--space-fluid-sm);
    border-bottom: 1px solid var(--color-border);
}

.booking-row__media {
    aspect-ratio: 4 / 3;
    max-width: 10rem;
    overflow: hidden;
    border-radius: var(--radius-md);
    background: var(--color-bg-subtle);
}

.booking-row__media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.booking-row__body {
    min-width: 0;
}

.booking-row__code {
    margin-bottom: 0.375rem;
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
}

.booking-row__title {
    font-family: var(--font-serif);
    font-size: var(--text-title);
    font-weight: var(--weight-regular);
    line-height: var(--leading-snug);
}

.booking-row__link {
    color: inherit;
    text-decoration: none;
}

.booking-row__link::after {
    content: '';
    position: absolute;
    inset: 0;
}

.booking-row__link:hover {
    color: var(--color-accent);
}

.booking-row__facts {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2) var(--space-6);
    margin-top: var(--space-3);
}

.booking-row__facts dt {
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
}

.booking-row__facts dd {
    font-size: var(--text-ui);
}

.booking-row__meta {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
}

.booking-row__total {
    font-family: var(--font-serif);
    font-size: var(--text-2xl);
    font-variant-numeric: lining-nums;
}

.booking-row__cancel {
    position: relative;
    z-index: 1;
}

/* Nhãn trạng thái */
.status-label {
    display: inline-flex;
    padding: 0.25rem var(--space-3);
    border: 1px solid currentColor;
    border-radius: var(--radius-pill);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.status-label--pending {
    color: var(--color-warning);
}

.status-label--confirmed {
    color: var(--color-accent);
}

.status-label--completed {
    color: var(--color-success);
}

.status-label--cancelled {
    color: var(--color-danger);
}

.booking-row__link:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 4px;
}
</style>
