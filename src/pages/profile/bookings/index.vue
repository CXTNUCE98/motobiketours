<script setup lang="ts">
import type { FilterBookingDto } from '~/types/booking'

definePageMeta({
    middleware: ['auth']
})

// Filter options configuration
const filterOptions = [
    { key: 'all', label: 'Tất cả', icon: 'bx-list-ul', color: 'blue' },
    { key: 'pending', label: 'Chờ xác nhận', icon: 'bx-time-five', color: 'yellow' },
    { key: 'confirmed', label: 'Đã xác nhận', icon: 'bx-check-circle', color: 'blue' },
    { key: 'completed', label: 'Hoàn thành', icon: 'bx-check-double', color: 'green' },
    { key: 'cancelled', label: 'Đã hủy', icon: 'bx-x-circle', color: 'red' },
] as const

// State
const bookingsTab = ref<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all')
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

const { formatPrice } = useCurrency()

// Methods
const handleCancelBooking = async (id: string) => {
    ElMessageBox.confirm(
        'Bạn có chắc chắn muốn hủy booking này? Hành động này không thể hoàn tác.',
        'Xác nhận hủy booking',
        {
            confirmButtonText: 'Hủy booking',
            cancelButtonText: 'Giữ lại',
            type: 'warning',
        }
    ).then(async () => {
        await cancelMutation.mutateAsync(id)
        refetchBookings()
    }).catch(() => { })
}
</script>

<template>
    <div
        class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Hero Section -->
            <div class="mb-8">
                <button @click="$router.back()"
                    class="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors">
                    <i class="bx bx-arrow-back text-xl"></i>
                    <span class="font-medium">Quay lại</span>
                </button>
                <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2">
                    <i class="bx bx-calendar-check text-blue-600 dark:text-blue-400 mr-3"></i>
                    My Bookings
                </h1>
                <p class="text-lg text-gray-600 dark:text-gray-400">Quản lý tất cả booking của
                    bạn</p>
            </div>

            <!-- Stats Overview -->
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div
                    class="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng cộng</div>
                    <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ bookingStats.total }}</div>
                </div>
                <div
                    class="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                    <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Chờ xác nhận</div>
                    <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ bookingStats.pending }}</div>
                </div>
                <div
                    class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Đã xác nhận</div>
                    <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ bookingStats.confirmed }}</div>
                </div>
                <div
                    class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                    <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Hoàn thành</div>
                    <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ bookingStats.completed }}</div>
                </div>
                <div
                    class="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Đã hủy</div>
                    <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ bookingStats.cancelled }}</div>
                </div>
            </div>

            <!-- Search -->
            <div class="relative mb-6">
                <i class="bx bx-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
                <input v-model="bookingsSearch" type="text" placeholder="Tìm kiếm theo tên tour..."
                    class="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
            </div>

            <!-- Filter Tabs -->
            <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6">
                <button v-for="option in filterOptions" :key="option.key" @click="bookingsTab = option.key"
                    class="px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all text-sm"
                    :class="bookingsTab === option.key
                        ? `bg-${option.color}-600 text-white shadow-lg`
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'">
                    <i :class="`bx ${option.icon} mr-1`"></i> {{ option.label }}
                </button>
            </div>

            <!-- Loading -->
            <div v-if="bookingsLoading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="i in 4" :key="i" class="bg-white dark:bg-gray-800 rounded-xl p-4 animate-pulse">
                    <div class="flex gap-4">
                        <div class="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                        <div class="flex-1 space-y-3">
                            <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bookings Grid -->
            <div v-else-if="filteredBookings.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <div v-for="booking in filteredBookings" :key="booking.id"
                    class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-200 dark:border-gray-700 fade-in-up">
                    <div class="p-4">
                        <div class="flex gap-4 mb-3">
                            <!-- Thumbnail -->
                            <div class="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                                <img :src="booking.tour.thumbnail" :alt="booking.tour.title"
                                    class="w-full h-full object-cover" />
                                <div class="absolute top-1 right-1 px-2 py-0.5 rounded-lg text-xs font-bold backdrop-blur-sm"
                                    :class="{
                                        'bg-yellow-500/90 text-white': booking.status === 'pending',
                                        'bg-blue-500/90 text-white': booking.status === 'confirmed',
                                        'bg-green-500/90 text-white': booking.status === 'completed',
                                        'bg-red-500/90 text-white': booking.status === 'cancelled',
                                    }">
                                    <i :class="`bx ${booking.status === 'pending' ? 'bx-time-five' :
                                        booking.status === 'confirmed' ? 'bx-check-circle' :
                                            booking.status === 'completed' ? 'bx-check-double' :
                                                'bx-x-circle'
                                        }`"></i>
                                </div>
                            </div>

                            <!-- Info -->
                            <div class="flex-1 min-w-0">
                                <h4 class="font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{{
                                    booking.tour.title }}</h4>
                                <div class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                    <div class="flex items-center gap-2">
                                        <i class="bx bx-calendar text-blue-500"></i>
                                        <span>{{ new Date(booking.startDate).toLocaleDateString('vi-VN') }}</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <i class="bx bx-group text-purple-500"></i>
                                        <span>{{ booking.numberOfPeople }} người</span>
                                        <i class="bx bx-money text-green-500 ml-2"></i>
                                        <span class="font-bold text-gray-900 dark:text-white">{{
                                            formatPrice(booking.totalPrice) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <button @click="$router.push(`/profile/bookings/${booking.id}`)"
                                class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all text-sm">
                                <i class="bx bx-detail mr-1"></i> Chi tiết
                            </button>
                            <button v-if="booking.status === 'pending' || booking.status === 'confirmed'"
                                @click="handleCancelBooking(booking.id)"
                                class="px-3 py-2 border-2 border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-sm">
                                <i class="bx bx-x mr-1"></i> Hủy
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12">
                <div
                    class="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <i class="bx bx-calendar-x text-5xl text-gray-400"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Chưa có booking nào</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">
                    {{ bookingsTab !== 'all' ? 'Không có booking nào ở trạng thái này'
                        : 'Hãy đặt chuyến đi đầu tiên của bạn!' }}
                </p>
                <button @click="$router.push('/')"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
                    <i class="bx bx-world text-xl"></i>
                    <span>Khám phá tours</span>
                </button>
            </div>
        </div>
    </div>
</template>



<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in-up {
    animation: fadeInUp 0.5s ease-out;
}
</style>
