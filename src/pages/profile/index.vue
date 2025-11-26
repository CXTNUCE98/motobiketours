<script setup lang="ts">
import { ref, reactive, onMounted, computed, watchEffect } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuth } from '~/composables/useAuth'
import { apiClient } from '~/services/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { User, UpdateUserDto } from '~/types/api'
import { validateForm, validationRules, type ValidationErrors } from '~/utils/validation'

const { isAuthenticated, user: authUser, getAuthHeaders, fetchUserProfile } = useAuth()
const queryClient = useQueryClient()

// Redirect if not authenticated
onMounted(() => {
    if (!isAuthenticated.value) {
        navigateTo('/')
    }
})

// Tabs
const activeTab = ref('info') // 'info' | 'security'

// Fetch fresh user data
const { data: userData, isLoading } = useQuery({
    queryKey: ['user-profile', authUser.value?.id],
    queryFn: () => apiClient<User>(`/users/${authUser.value?.id}`, {
        headers: getAuthHeaders()
    }),
    enabled: !!authUser.value?.id
})

// Avatar Upload
const avatarPreview = ref<string | null>(null)
const avatarFile = ref<File | null>(null)
const fileInputRef = ref<any>(null)

const handleAvatarChange = (event: Event) => {
    const target = event.target as any
    const file = target.files?.[0]

    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            ElMessage.error('Please select an image file')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            ElMessage.error('Image size should be less than 5MB')
            return
        }

        avatarFile.value = file

        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
            avatarPreview.value = e.target?.result as string
        }
        reader.readAsDataURL(file)
    }
}

const triggerFileInput = () => {
    fileInputRef.value?.click()
}

const removeAvatar = () => {
    avatarFile.value = null
    avatarPreview.value = null
    if (fileInputRef.value) {
        fileInputRef.value.value = ''
    }
}

// Form Data
const infoForm = reactive({
    username: '',
    email: '',
})

const passwordForm = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
})

// Initialize form when data is loaded
watchEffect(() => {
    if (userData.value) {
        infoForm.username = userData.value.username
        infoForm.email = userData.value.email
    } else if (authUser.value) {
        infoForm.username = authUser.value.username
        infoForm.email = authUser.value.email
    }
})

// Validation
const infoErrors = ref<ValidationErrors>({})
const passwordErrors = ref<ValidationErrors>({})

const infoRules = {
    username: [validationRules.required('Username is required')],
}

const passwordRules = {
    newPassword: [
        validationRules.required('New password is required'),
        validationRules.minLength(6, 'Password must be at least 6 characters')
    ],
    confirmPassword: [
        validationRules.required('Please confirm your password'),
        validationRules.match(computed(() => passwordForm.newPassword), 'Passwords do not match')
    ]
}

// Upload Avatar Mutation
const { mutate: uploadAvatar, mutateAsync: uploadAvatarAsync, isPending: isUploadingAvatar } = useMutation({
    mutationFn: async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)

        const API_BASE_URL = 'http://localhost:3001'
        const response = await fetch(`${API_BASE_URL}/blog/upload-image`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
            },
            body: formData
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({}))
            const errorMessage = error.message || 'Upload avatar failed'
            throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage)
        }

        const result = await response.json()
        // API trả về { url, secureUrl, imageId } - sử dụng secureUrl nếu có, nếu không dùng url
        return result.secureUrl || result.url
    },
    onError: (error: any) => {
        ElMessage.error(error.message || 'Failed to upload avatar')
    }
})

// Update Profile Mutation
const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async (data: UpdateUserDto) => {
        // Đảm bảo avatar chỉ là URL string, không phải base64
        // Nếu avatar là base64 (bắt đầu với 'data:'), không gửi nó
        const updateData: UpdateUserDto = { ...data }
        if (updateData.avatar && typeof updateData.avatar === 'string' && updateData.avatar.startsWith('data:')) {
            // Không gửi base64, chỉ gửi các field khác
            delete updateData.avatar
        }

        const response = await apiClient<User>(`/users/${authUser.value?.id}`, {
            method: 'PATCH',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        })
        return response
    },
    onSuccess: (updatedUser) => {
        queryClient.invalidateQueries({ queryKey: ['user-profile'] })
        queryClient.setQueryData(['user-profile', authUser.value?.id], updatedUser)
        fetchUserProfile() // Update global auth state
        removeAvatar() // Clear avatar preview after successful update
        ElMessage.success('Profile updated successfully!')
    },
    onError: (error: any) => {
        ElMessage.error(error.message || 'Failed to update profile')
    }
})

// Change Password Mutation
const { mutate: changePassword, isPending: isChangingPassword } = useMutation({
    mutationFn: async (data: UpdateUserDto) => {
        const response = await apiClient<User>(`/users/${authUser.value?.id}`, {
            method: 'PATCH',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        return response
    },
    onSuccess: () => {
        passwordForm.currentPassword = ''
        passwordForm.newPassword = ''
        passwordForm.confirmPassword = ''
        passwordErrors.value = {}
        ElMessage.success('Password changed successfully!')
    },
    onError: (error: any) => {
        ElMessage.error(error.message || 'Failed to change password')
    }
})

const handleUpdateInfo = async () => {
    const errors = validateForm(infoForm, infoRules)
    infoErrors.value = errors

    if (Object.keys(errors).length === 0) {
        try {
            // If there's a new avatar file, upload it first, then update profile with URL
            if (avatarFile.value) {
                // Upload avatar và lấy URL
                const avatarUrl = await uploadAvatarAsync(avatarFile.value)
                // Sau khi upload thành công, update profile với URL và username
                // avatarUrl là string URL từ server, không phải base64
                await updateProfile({
                    username: infoForm.username,
                    avatar: avatarUrl // Chỉ gửi URL, không phải base64
                })
            } else {
                // Just update username
                await updateProfile({ username: infoForm.username })
            }
        } catch (error) {
            // Error đã được xử lý trong mutation onError
            console.error('Failed to update profile:', error)
        }
    }
}

const handleChangePassword = () => {
    const errors = validateForm(passwordForm, passwordRules)
    passwordErrors.value = errors

    if (Object.keys(errors).length === 0) {
        changePassword({ password: passwordForm.newPassword })
    }
}

// Computed properties for avatar display
const currentAvatar = computed(() => {
    // Priority: preview (chỉ khi đang chọn file mới) > userData avatar > authUser avatar
    // Sau khi upload thành công, avatarPreview sẽ bị clear, nên sẽ hiển thị URL từ server
    if (avatarPreview.value && avatarFile.value) {
        // Chỉ hiển thị preview khi đang có file mới được chọn (chưa upload)
        return avatarPreview.value
    }
    if (userData.value?.avatar) return userData.value?.avatar
    if (authUser.value?.avatar) return authUser.value?.avatar
    return null
})

const userInitial = computed(() => {
    return userData.value?.userName?.charAt(0).toUpperCase() ||
        authUser.value?.userName?.charAt(0).toUpperCase() || 'U'
})

const displayName = computed(() => {
    return userData.value?.userName || authUser.value?.userName || 'User'
})

// Check if profile is being updated (either uploading avatar or updating profile)
const isUpdating = computed(() => isUploadingAvatar.value || isUpdatingProfile.value)
</script>

<template>
    <div
        class="min-h-screen pt-10 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Page Header -->
            <div class="my-8">
                <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Profile</h1>
                <p class="text-slate-600 dark:text-slate-400">Manage your account settings and preferences</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Sidebar Profile Card -->
                <div class="lg:col-span-1">
                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden sticky top-28">
                        <!-- Profile Header with Gradient -->
                        <div
                            class="bg-gradient-to-br from-[#1A71C7] via-[#1e88e5] to-[#1565c0] p-8 text-white relative overflow-hidden">
                            <div
                                class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl">
                            </div>
                            <div
                                class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl">
                            </div>

                            <div class="relative z-10 flex flex-col items-center">
                                <!-- Avatar -->
                                <div class="relative group mb-4">
                                    <div
                                        class="w-24 h-24 rounded-full bg-white text-[#1A71C7] flex items-center justify-center text-3xl font-bold shadow-2xl ring-4 ring-white/20 overflow-hidden">
                                        <img v-if="currentAvatar" :src="currentAvatar" alt="Avatar"
                                            class="w-full h-full object-cover" />
                                        <span v-else>{{ userInitial }}</span>
                                    </div>
                                    <div
                                        class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                </div>

                                <h2 class="text-xl font-bold text-center mb-1">{{ displayName }}</h2>
                                <p class="text-white/80 text-sm mb-3">{{ userData?.email || authUser?.email }}</p>
                                <div
                                    class="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-xs font-medium backdrop-blur-sm">
                                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    {{ userData?.role || authUser?.role || 'USER' }}
                                </div>
                            </div>
                        </div>

                        <!-- Quick Stats -->
                        <div class="p-6 border-t border-slate-200 dark:border-slate-700">
                            <div class="space-y-3">
                                <div
                                    class="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none"
                                                stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p class="text-xs text-slate-500 dark:text-slate-400">Email Status</p>
                                            <p class="text-sm font-semibold text-slate-900 dark:text-white">Verified</p>
                                        </div>
                                    </div>
                                    <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>

                                <div
                                    class="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                            <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none"
                                                stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p class="text-xs text-slate-500 dark:text-slate-400">Account Security</p>
                                            <p class="text-sm font-semibold text-slate-900 dark:text-white">Protected
                                            </p>
                                        </div>
                                    </div>
                                    <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Content Area -->
                <div class="lg:col-span-2">
                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
                        <!-- Tabs -->
                        <div
                            class="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                            <button @click="activeTab = 'info'"
                                class="flex-1 py-4 px-6 text-sm font-medium text-center transition-all relative group"
                                :class="activeTab === 'info' ? 'text-[#1A71C7] dark:text-sky-400 bg-white dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'">
                                <div class="flex items-center justify-center gap-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>Personal Information</span>
                                </div>
                                <div v-if="activeTab === 'info'"
                                    class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#1A71C7] to-transparent dark:via-sky-400">
                                </div>
                            </button>
                            <button @click="activeTab = 'security'"
                                class="flex-1 py-4 px-6 text-sm font-medium text-center transition-all relative group"
                                :class="activeTab === 'security' ? 'text-[#1A71C7] dark:text-sky-400 bg-white dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'">
                                <div class="flex items-center justify-center gap-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span>Security & Password</span>
                                </div>
                                <div v-if="activeTab === 'security'"
                                    class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#1A71C7] to-transparent dark:via-sky-400">
                                </div>
                            </button>
                        </div>

                        <!-- Content -->
                        <div class="p-8">
                            <!-- Personal Info Tab -->
                            <div v-if="activeTab === 'info'" class="space-y-8">
                                <!-- Avatar Upload Section -->
                                <div class="pb-6 border-b border-slate-200 dark:border-slate-700">
                                    <h3
                                        class="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                        <svg class="w-5 h-5 text-[#1A71C7] dark:text-sky-400" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Profile Picture
                                    </h3>

                                    <div class="flex items-center gap-6">
                                        <!-- Avatar Preview -->
                                        <div class="relative">
                                            <div
                                                class="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-3xl font-bold text-slate-600 dark:text-slate-300 shadow-lg overflow-hidden ring-4 ring-slate-100 dark:ring-slate-700">
                                                <img v-if="currentAvatar" :src="currentAvatar" alt="Avatar Preview"
                                                    class="w-full h-full object-cover" />
                                                <span v-else>{{ userInitial }}</span>
                                            </div>
                                            <div v-if="avatarPreview"
                                                class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>

                                        <!-- Upload Controls -->
                                        <div class="flex-1">
                                            <input ref="fileInputRef" type="file" accept="image/*"
                                                @change="handleAvatarChange" class="hidden" />
                                            <div class="flex flex-wrap gap-3">
                                                <button @click="triggerFileInput" type="button"
                                                    class="px-4 py-2 bg-[#1A71C7] text-white rounded-lg font-medium hover:bg-[#155a9f] transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                                                    <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    Upload Photo
                                                </button>
                                                <button v-if="avatarPreview" @click="removeAvatar" type="button"
                                                    class="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                                                    <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Remove
                                                </button>
                                            </div>
                                            <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                                JPG, PNG or GIF. Max size 5MB. Recommended 400x400px.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Personal Details Form -->
                                <div>
                                    <h3
                                        class="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                        <svg class="w-5 h-5 text-[#1A71C7] dark:text-sky-400" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Personal Details
                                    </h3>

                                    <div class="space-y-5">
                                        <div>
                                            <label
                                                class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                User name
                                            </label>
                                            <div class="relative">
                                                <div
                                                    class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <svg class="w-5 h-5 text-slate-400" fill="none"
                                                        stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <input v-model="infoForm.username" type="text"
                                                    placeholder="Enter your username"
                                                    class="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1A71C7] focus:border-transparent outline-none transition-all"
                                                    :class="{ 'border-red-500 focus:ring-red-500': infoErrors.username }" />
                                            </div>
                                            <p v-if="infoErrors.username"
                                                class="mt-2 text-sm text-red-500 flex items-center gap-1">
                                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                                {{ infoErrors.username }}
                                            </p>
                                        </div>

                                        <div>
                                            <label
                                                class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Email Address
                                            </label>
                                            <div class="relative">
                                                <div
                                                    class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <svg class="w-5 h-5 text-slate-400" fill="none"
                                                        stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <input v-model="infoForm.email" type="email" disabled
                                                    class="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed" />
                                                <div
                                                    class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                    <svg class="w-5 h-5 text-slate-400" fill="currentColor"
                                                        viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd"
                                                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                            clip-rule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <p
                                                class="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                                Email address cannot be changed for security reasons
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Save Button -->
                                <div class="pt-4">
                                    <button @click="handleUpdateInfo" :disabled="isUpdating"
                                        class="w-full px-6 py-3.5 bg-gradient-to-r from-[#1A71C7] to-[#1e88e5] text-white rounded-xl font-semibold hover:from-[#155a9f] hover:to-[#1565c0] transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]">
                                        <svg v-if="isUpdating" class="animate-spin h-5 w-5"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                            </path>
                                        </svg>
                                        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M5 13l4 4L19 7" />
                                        </svg>
                                        {{ isUpdating ? 'Saving Changes...' : 'Save Changes' }}
                                    </button>
                                </div>
                            </div>

                            <!-- Security Tab -->
                            <div v-if="activeTab === 'security'" class="space-y-6">
                                <div>
                                    <h3
                                        class="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                        <svg class="w-5 h-5 text-[#1A71C7] dark:text-sky-400" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                        </svg>
                                        Change Password
                                    </h3>

                                    <div class="space-y-5">
                                        <div>
                                            <label
                                                class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Current Password
                                            </label>
                                            <div class="relative">
                                                <div
                                                    class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <svg class="w-5 h-5 text-slate-400" fill="none"
                                                        stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                </div>
                                                <input v-model="passwordForm.currentPassword" type="password"
                                                    placeholder="Enter your current password"
                                                    class="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1A71C7] focus:border-transparent outline-none transition-all" />
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                New Password
                                            </label>
                                            <div class="relative">
                                                <div
                                                    class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <svg class="w-5 h-5 text-slate-400" fill="none"
                                                        stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                    </svg>
                                                </div>
                                                <input v-model="passwordForm.newPassword" type="password"
                                                    placeholder="Enter new password (min 6 characters)"
                                                    class="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1A71C7] focus:border-transparent outline-none transition-all"
                                                    :class="{ 'border-red-500 focus:ring-red-500': passwordErrors.newPassword }" />
                                            </div>
                                            <p v-if="passwordErrors.newPassword"
                                                class="mt-2 text-sm text-red-500 flex items-center gap-1">
                                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                                {{ passwordErrors.newPassword }}
                                            </p>
                                        </div>

                                        <div>
                                            <label
                                                class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Confirm New Password
                                            </label>
                                            <div class="relative">
                                                <div
                                                    class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <svg class="w-5 h-5 text-slate-400" fill="none"
                                                        stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <input v-model="passwordForm.confirmPassword" type="password"
                                                    placeholder="Confirm your new password"
                                                    class="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1A71C7] focus:border-transparent outline-none transition-all"
                                                    :class="{ 'border-red-500 focus:ring-red-500': passwordErrors.confirmPassword }" />
                                            </div>
                                            <p v-if="passwordErrors.confirmPassword"
                                                class="mt-2 text-sm text-red-500 flex items-center gap-1">
                                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                                {{ passwordErrors.confirmPassword }}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Security Tips -->
                                <div
                                    class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                    <div class="flex gap-3">
                                        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                                            fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <div>
                                            <h4 class="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                                                Password Security Tips</h4>
                                            <ul class="text-xs text-blue-800 dark:text-blue-400 space-y-1">
                                                <li>• Use at least 6 characters</li>
                                                <li>• Include uppercase and lowercase letters</li>
                                                <li>• Add numbers and special characters</li>
                                                <li>• Avoid common words or personal information</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <!-- Update Button -->
                                <div class="pt-4">
                                    <button @click="handleChangePassword" :disabled="isChangingPassword"
                                        class="w-full px-6 py-3.5 bg-gradient-to-r from-[#1A71C7] to-[#1e88e5] text-white rounded-xl font-semibold hover:from-[#155a9f] hover:to-[#1565c0] transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]">
                                        <svg v-if="isChangingPassword" class="animate-spin h-5 w-5"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                            </path>
                                        </svg>
                                        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                        </svg>
                                        {{ isChangingPassword ? 'Updating Password...' : 'Update Password' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>