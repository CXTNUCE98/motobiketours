<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
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

// Form Data
const infoForm = reactive({
    name: '',
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
        infoForm.name = userData.value.name
        infoForm.email = userData.value.email
    } else if (authUser.value) {
        infoForm.name = authUser.value.name
        infoForm.email = authUser.value.email
    }
})

// Validation
const infoErrors = ref<ValidationErrors>({})
const passwordErrors = ref<ValidationErrors>({})

const infoRules = {
    name: [validationRules.required('Name is required')],
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

// Update Profile Mutation
const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: (data: UpdateUserDto) => apiClient(`/users/${authUser.value?.id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    }),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user-profile'] })
        fetchUserProfile() // Update global auth state
        alert('Profile updated successfully!')
    },
    onError: (error: any) => {
        alert(error.message || 'Failed to update profile')
    }
})

// Change Password Mutation
const { mutate: changePassword, isPending: isChangingPassword } = useMutation({
    mutationFn: (data: UpdateUserDto) => apiClient(`/users/${authUser.value?.id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    }),
    onSuccess: () => {
        passwordForm.currentPassword = ''
        passwordForm.newPassword = ''
        passwordForm.confirmPassword = ''
        alert('Password changed successfully!')
    },
    onError: (error: any) => {
        alert(error.message || 'Failed to change password')
    }
})

const handleUpdateInfo = () => {
    const errors = validateForm(infoForm, infoRules)
    infoErrors.value = errors

    if (Object.keys(errors).length === 0) {
        updateProfile({ name: infoForm.name })
    }
}

const handleChangePassword = () => {
    const errors = validateForm(passwordForm, passwordRules)
    passwordErrors.value = errors

    if (Object.keys(errors).length === 0) {
        // Note: The backend might not verify currentPassword if it's a simple update endpoint
        // But we send the new password
        changePassword({ password: passwordForm.newPassword })
    }
}
</script>

<template>
    <div class="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
                <!-- Header -->
                <div class="bg-[#1A71C7] p-8 text-white relative overflow-hidden">
                    <div
                        class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl">
                    </div>
                    <div class="relative z-10 flex items-center gap-6">
                        <div
                            class="w-20 h-20 rounded-full bg-white text-[#1A71C7] flex items-center justify-center text-3xl font-bold shadow-lg">
                            {{ userData?.name?.charAt(0).toUpperCase() || authUser?.name?.charAt(0).toUpperCase() || 'U'
                            }}
                        </div>
                        <div>
                            <h1 class="text-2xl font-bold">{{ userData?.name || authUser?.name || 'User' }}</h1>
                            <p class="text-white/80">{{ userData?.email || authUser?.email }}</p>
                            <div
                                class="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-xs font-medium backdrop-blur-sm">
                                {{ userData?.role || authUser?.role || 'USER' }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="flex border-b border-slate-200 dark:border-slate-700">
                    <button @click="activeTab = 'info'"
                        class="flex-1 py-4 text-sm font-medium text-center transition-colors relative"
                        :class="activeTab === 'info' ? 'text-[#1A71C7] dark:text-sky-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'">
                        Personal Information
                        <div v-if="activeTab === 'info'"
                            class="absolute bottom-0 left-0 w-full h-0.5 bg-[#1A71C7] dark:bg-sky-400"></div>
                    </button>
                    <button @click="activeTab = 'security'"
                        class="flex-1 py-4 text-sm font-medium text-center transition-colors relative"
                        :class="activeTab === 'security' ? 'text-[#1A71C7] dark:text-sky-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'">
                        Security & Password
                        <div v-if="activeTab === 'security'"
                            class="absolute bottom-0 left-0 w-full h-0.5 bg-[#1A71C7] dark:bg-sky-400"></div>
                    </button>
                </div>

                <!-- Content -->
                <div class="p-8">
                    <!-- Personal Info Tab -->
                    <div v-if="activeTab === 'info'" class="space-y-6 max-w-lg mx-auto">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full
                                    Name</label>
                                <input v-model="infoForm.name" type="text"
                                    class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1A71C7] focus:border-transparent outline-none transition-all"
                                    :class="{ 'border-red-500': infoErrors.name }" />
                                <p v-if="infoErrors.name" class="mt-1 text-xs text-red-500">{{ infoErrors.name }}</p>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email
                                    Address</label>
                                <input v-model="infoForm.email" type="email" disabled
                                    class="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed" />
                                <p class="mt-1 text-xs text-slate-400">Email cannot be changed</p>
                            </div>
                        </div>

                        <div class="pt-4">
                            <button @click="handleUpdateInfo" :disabled="isUpdatingProfile"
                                class="w-full px-6 py-3 bg-[#1A71C7] text-white rounded-lg font-semibold hover:bg-[#155a9f] transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                <svg v-if="isUpdatingProfile" class="animate-spin h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                {{ isUpdatingProfile ? 'Saving Changes...' : 'Save Changes' }}
                            </button>
                        </div>
                    </div>

                    <!-- Security Tab -->
                    <div v-if="activeTab === 'security'" class="space-y-6 max-w-lg mx-auto">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current
                                    Password</label>
                                <input v-model="passwordForm.currentPassword" type="password"
                                    placeholder="Enter current password"
                                    class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1A71C7] focus:border-transparent outline-none transition-all" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New
                                    Password</label>
                                <input v-model="passwordForm.newPassword" type="password"
                                    placeholder="Enter new password"
                                    class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1A71C7] focus:border-transparent outline-none transition-all"
                                    :class="{ 'border-red-500': passwordErrors.newPassword }" />
                                <p v-if="passwordErrors.newPassword" class="mt-1 text-xs text-red-500">{{
                                    passwordErrors.newPassword }}</p>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm
                                    New Password</label>
                                <input v-model="passwordForm.confirmPassword" type="password"
                                    placeholder="Confirm new password"
                                    class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1A71C7] focus:border-transparent outline-none transition-all"
                                    :class="{ 'border-red-500': passwordErrors.confirmPassword }" />
                                <p v-if="passwordErrors.confirmPassword" class="mt-1 text-xs text-red-500">{{
                                    passwordErrors.confirmPassword }}</p>
                            </div>
                        </div>

                        <div class="pt-4">
                            <button @click="handleChangePassword" :disabled="isChangingPassword"
                                class="w-full px-6 py-3 bg-[#1A71C7] text-white rounded-lg font-semibold hover:bg-[#155a9f] transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                <svg v-if="isChangingPassword" class="animate-spin h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                {{ isChangingPassword ? 'Update Password' : 'Update Password' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>