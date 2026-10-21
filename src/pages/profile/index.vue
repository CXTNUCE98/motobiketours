<script setup lang="ts">
import { reactive, ref, computed, watchEffect } from 'vue'
import type { User, UpdateUserDto } from '~/types/api'
import { validateForm, validationRules, type ValidationErrors } from '~/utils/validation'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { logger } from '~/utils/logger'

const { isAuthenticated, user: authUser, updateUserLocal } = useAuth()
const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()

// Redirect if not authenticated
onMounted(() => {
    if (!isAuthenticated.value) {
        navigateTo('/')
    }
})

// Fetch fresh user data
const { data: userData } = useUserProfileQuery(computed(() => authUser.value?.id))

// Avatar Upload
const avatarPreview = ref<string | null>(null)
const avatarFile = ref<File | null>(null)
// URL ảnh dán vào: giống ảnh tải lên, chỉ lưu khi bấm "Lưu" ở phần thông tin cá nhân
const pastedAvatarUrl = ref<string | null>(null)
const fileInputRef = ref<any>(null)

// Cropper State
const showCropper = ref(false)
const cropperImage = ref<string | null>(null)
const cropperRef = ref<any>(null)

const handleAvatarChange = (event: Event) => {
    const target = event.target as any
    const file = target.files?.[0]

    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            ElMessage.error(t('profile.messages.avatarInvalidType'))
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            ElMessage.error(t('profile.messages.avatarTooLarge'))
            return
        }

        // Create preview for cropper
        const reader = new FileReader()
        reader.onload = (e) => {
            cropperImage.value = e.target?.result as string
            showCropper.value = true
        }
        reader.readAsDataURL(file)

        // Reset input so same file can be selected again
        target.value = ''
    }
}

const onCrop = () => {
    const { canvas } = cropperRef.value.getResult()
    if (canvas) {
        canvas.toBlob((blob: Blob) => {
            if (blob) {
                const file = new File([blob], 'avatar.png', { type: 'image/png' })
                avatarFile.value = file
                avatarPreview.value = URL.createObjectURL(blob)
                pastedAvatarUrl.value = null
                showCropper.value = false
            }
        }, 'image/png')
    }
}

const triggerFileInput = () => {
    fileInputRef.value?.click()
}

const removeAvatar = () => {
    avatarFile.value = null
    avatarPreview.value = null
    pastedAvatarUrl.value = null
    if (fileInputRef.value) {
        fileInputRef.value.value = ''
    }
}

const applyAvatarUrl = (url: string) => {
    removeAvatar()
    pastedAvatarUrl.value = url
}

// Form Data
const infoForm = reactive({
    userName: '',
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
        infoForm.userName = userData.value.userName
        infoForm.email = userData.value.email
    } else if (authUser.value) {
        infoForm.userName = authUser.value.userName
        infoForm.email = authUser.value.email
    }
})

// Validation — computed so messages follow the active locale
const infoErrors = ref<ValidationErrors>({})
const passwordErrors = ref<ValidationErrors>({})

const infoRules = computed(() => ({
    userName: [validationRules.required(t('profile.validation.usernameRequired'))],
}))

const passwordRules = computed(() => ({
    currentPassword: [
        validationRules.required(t('profile.validation.currentPasswordRequired'))
    ],
    newPassword: [
        validationRules.required(t('profile.validation.newPasswordRequired')),
        validationRules.minLength(6, t('profile.validation.passwordMinLength'))
    ],
    confirmPassword: [
        validationRules.required(t('profile.validation.confirmPasswordRequired')),
        validationRules.match(computed(() => passwordForm.newPassword), t('profile.validation.passwordMismatch'))
    ]
}))

// Upload Avatar Mutation
const { mutateAsync: uploadAvatarAsync, isPending: isUploadingAvatar } = useUploadMutation()

// Update Profile Mutation
const { mutateAsync: updateProfileAsync, isPending: isUpdatingProfile } = useUpdateUserMutation()

const updateProfile = async (data: UpdateUserDto) => {
    if (!authUser.value?.id) return

    try {
        const updateData: UpdateUserDto = { ...data }
        if (updateData.avatar && typeof updateData.avatar === 'string' && updateData.avatar.startsWith('data:')) {
            delete updateData.avatar
        }

        const updatedUser = await updateProfileAsync({ id: authUser.value.id, data: updateData })

        updateUserLocal(updatedUser as unknown as User) // Update global auth state directly
        removeAvatar() // Clear avatar preview after successful update
        ElMessage.success(t('profile.messages.updateSuccess'))
        return updatedUser
    } catch (error: any) {
        const message = error.message || t('profile.messages.updateError')
        ElMessage.error(message)
        throw error
    }
}

// Change Password Mutation
const changePassword = async (data: UpdateUserDto) => {
    if (!authUser.value?.id) return
    isChangingPassword.value = true
    try {
        await updateProfileAsync({ id: authUser.value.id, data })
        passwordForm.currentPassword = ''
        passwordForm.newPassword = ''
        passwordForm.confirmPassword = ''
        passwordErrors.value = {}
        ElMessage.success(t('profile.messages.passwordSuccess'))
    } catch (error: any) {
        const message = error.message || t('profile.messages.passwordError')
        ElMessage.error(message)
    } finally {
        isChangingPassword.value = false
    }
}
const isChangingPassword = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const handleUpdateInfo = async () => {
    const errors = validateForm(infoForm, infoRules.value)
    infoErrors.value = errors

    if (Object.keys(errors).length === 0) {
        try {
            // If there's a new avatar file, upload it first, then update profile with URL
            if (avatarFile.value) {
                // Upload avatar và lấy URL
                const avatarUrl = await uploadAvatarAsync({ file: avatarFile.value, folder: 'profile' })
                // Sau khi upload thành công, update profile với URL và userName
                await updateProfile({
                    userName: infoForm.userName,
                    avatar: avatarUrl.url // Chỉ gửi URL, không phải base64
                })
            } else if (pastedAvatarUrl.value) {
                await updateProfile({ userName: infoForm.userName, avatar: pastedAvatarUrl.value })
            } else {
                // Just update userName
                await updateProfile({ userName: infoForm.userName })
            }
        } catch (error) {
            // Error đã được xử lý trong mutation onError
            logger.error('Failed to update profile:', error)
        }
    }
}

const handleChangePassword = () => {
    const errors = validateForm(passwordForm, passwordRules.value)
    passwordErrors.value = errors

    if (Object.keys(errors).length === 0) {
        changePassword({
            password: passwordForm.newPassword
        })
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
    if (pastedAvatarUrl.value) return pastedAvatarUrl.value
    if (userData.value?.avatar) return userData.value?.avatar
    if (authUser.value?.avatar) return authUser.value?.avatar
    return null
})

// Responsive dialog width for mobile
const dialogWidth = computed(() => {
    if (typeof window !== 'undefined') {
        return window.innerWidth < 640 ? '90vw' : '500px'
    }
    return '500px'
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
            <h1 class="account-head__title">{{ t('profile.title') }}</h1>
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
                <!-- Ảnh đại diện -->
                <section class="account-section" aria-labelledby="account-identity-title">
                    <h2 id="account-identity-title" class="account-section__title">{{ t('profile.sections.identity') }}</h2>

                    <div class="account-identity">
                        <div class="account-identity__avatar">
                            <img v-if="currentAvatar" :src="currentAvatar" :alt="displayName">
                            <span v-else aria-hidden="true">{{ userInitial }}</span>
                        </div>

                        <div class="account-identity__body">
                            <p class="account-identity__name">{{ displayName }}</p>
                            <p class="account-identity__email">{{ userData?.email || authUser?.email }}</p>

                            <input ref="fileInputRef" type="file" accept="image/*" class="visually-hidden"
                                @change="handleAvatarChange">
                            <div class="account-identity__actions">
                                <UiButton type="button" variant="outline" size="sm" @click="triggerFileInput">
                                    {{ t('profile.avatar.upload') }}
                                </UiButton>
                                <UiButton v-if="avatarPreview || pastedAvatarUrl" type="button" variant="ghost" size="sm" @click="removeAvatar">
                                    {{ t('profile.avatar.remove') }}
                                </UiButton>
                            </div>
                            <UiImageUrlInput class="account-identity__url" :disabled="isUpdating" @submit="applyAvatarUrl" />
                            <p class="account-identity__hint">{{ t('profile.avatar.hint') }}</p>
                        </div>
                    </div>
                </section>

                <!-- Thông tin cá nhân -->
                <section class="account-section" aria-labelledby="account-details-title">
                    <h2 id="account-details-title" class="account-section__title">{{ t('profile.sections.details') }}</h2>

                    <form class="account-form" novalidate @submit.prevent="handleUpdateInfo">
                        <UiField :label="t('profile.form.username')" :error="infoErrors.userName">
                            <template #default="{ id, describedBy, invalid }">
                                <input :id="id" v-model="infoForm.userName" type="text" class="ui-control"
                                    autocomplete="nickname" :aria-describedby="describedBy" :aria-invalid="invalid">
                            </template>
                        </UiField>

                        <UiField :label="t('profile.form.email')">
                            <template #default="{ id }">
                                <input :id="id" v-model="infoForm.email" type="email" class="ui-control" disabled>
                            </template>
                        </UiField>
                        <p class="account-form__hint">{{ t('profile.form.emailLocked') }}</p>

                        <div class="account-form__actions">
                            <UiButton type="submit" :disabled="isUpdating">
                                {{ isUpdating ? t('profile.form.saving') : t('profile.form.save') }}
                            </UiButton>
                        </div>
                    </form>
                </section>

                <!-- Mật khẩu -->
                <section class="account-section" aria-labelledby="account-security-title">
                    <h2 id="account-security-title" class="account-section__title">{{ t('profile.sections.security') }}</h2>

                    <form class="account-form" novalidate @submit.prevent="handleChangePassword">
                        <UiField :label="t('profile.form.currentPassword')" :error="passwordErrors.currentPassword">
                            <template #default="{ id, describedBy, invalid }">
                                <div class="password-control">
                                    <input :id="id" v-model="passwordForm.currentPassword"
                                        :type="showCurrentPassword ? 'text' : 'password'" class="ui-control"
                                        autocomplete="current-password" :aria-describedby="describedBy" :aria-invalid="invalid">
                                    <button type="button" class="password-control__toggle"
                                        :aria-label="showCurrentPassword ? t('auth.hidePassword') : t('auth.showPassword')"
                                        @click="showCurrentPassword = !showCurrentPassword">
                                        {{ showCurrentPassword ? t('auth.hide') : t('auth.show') }}
                                    </button>
                                </div>
                            </template>
                        </UiField>

                        <UiField :label="t('profile.form.newPassword')" :error="passwordErrors.newPassword">
                            <template #default="{ id, describedBy, invalid }">
                                <div class="password-control">
                                    <input :id="id" v-model="passwordForm.newPassword"
                                        :type="showNewPassword ? 'text' : 'password'" class="ui-control"
                                        autocomplete="new-password" :aria-describedby="describedBy" :aria-invalid="invalid">
                                    <button type="button" class="password-control__toggle"
                                        :aria-label="showNewPassword ? t('auth.hidePassword') : t('auth.showPassword')"
                                        @click="showNewPassword = !showNewPassword">
                                        {{ showNewPassword ? t('auth.hide') : t('auth.show') }}
                                    </button>
                                </div>
                            </template>
                        </UiField>

                        <UiField :label="t('profile.form.confirmPassword')" :error="passwordErrors.confirmPassword">
                            <template #default="{ id, describedBy, invalid }">
                                <div class="password-control">
                                    <input :id="id" v-model="passwordForm.confirmPassword"
                                        :type="showConfirmPassword ? 'text' : 'password'" class="ui-control"
                                        autocomplete="new-password" :aria-describedby="describedBy" :aria-invalid="invalid">
                                    <button type="button" class="password-control__toggle"
                                        :aria-label="showConfirmPassword ? t('auth.hidePassword') : t('auth.showPassword')"
                                        @click="showConfirmPassword = !showConfirmPassword">
                                        {{ showConfirmPassword ? t('auth.hide') : t('auth.show') }}
                                    </button>
                                </div>
                            </template>
                        </UiField>

                        <div class="account-form__actions">
                            <UiButton type="submit" :disabled="isChangingPassword">
                                {{ isChangingPassword ? t('profile.form.updatingPassword') : t('profile.form.updatePassword') }}
                            </UiButton>
                        </div>
                    </form>
                </section>
            </div>
        </div>

        <!-- Cắt ảnh đại diện -->
        <el-dialog v-model="showCropper" :title="t('profile.avatar.cropTitle')" :width="dialogWidth"
            :close-on-click-modal="false" destroy-on-close :lock-scroll="true">
            <div class="cropper-frame">
                <cropper ref="cropperRef" class="cropper-frame__area" :src="cropperImage" :stencil-component="CircleStencil"
                    :stencil-props="{ aspectRatio: 1 / 1 }" />
            </div>
            <template #footer>
                <UiButton variant="outline" @click="showCropper = false">{{ t('profile.avatar.cropCancel') }}</UiButton>
                <UiButton @click="onCrop">{{ t('profile.avatar.cropSave') }}</UiButton>
            </template>
        </el-dialog>
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

/* Các khối nội dung */
.account-section {
    padding-block: var(--space-fluid-lg);
    border-bottom: 1px solid var(--color-border);
}

.account-section:first-child {
    padding-top: 0;
}

.account-section:last-child {
    border-bottom: 0;
}

.account-section__title {
    margin-bottom: var(--space-6);
    font-family: var(--font-serif);
    font-size: var(--text-title);
    font-weight: var(--weight-regular);
}

/* Ảnh đại diện */
.account-identity {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-6);
}

.account-identity__avatar {
    display: grid;
    flex-shrink: 0;
    place-items: center;
    width: 5.5rem;
    height: 5.5rem;
    overflow: hidden;
    border: 1px solid var(--color-border);
    border-radius: 50%;
    background: var(--color-bg-subtle);
    color: var(--color-text-muted);
    font-family: var(--font-serif);
    font-size: var(--text-h3);
    font-style: italic;
}

.account-identity__avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.account-identity__body {
    flex: 1 1 16rem;
    min-width: 0;
}

.account-identity__name {
    font-family: var(--font-serif);
    font-size: var(--text-title);
    line-height: var(--leading-snug);
}

.account-identity__email {
    margin-top: 0.25rem;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    overflow-wrap: anywhere;
}

.account-identity__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    margin-top: var(--space-4);
}

.account-identity__url {
    max-width: 28rem;
    margin-top: var(--space-3);
}

.account-identity__hint {
    margin-top: var(--space-3);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

/* Form */
.account-form {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
    gap: var(--space-5);
    max-width: 40rem;
}

.account-form__hint {
    grid-column: 1 / -1;
    margin-top: -0.75rem;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.account-form__actions {
    grid-column: 1 / -1;
    margin-top: var(--space-2);
}

.password-control {
    position: relative;
}

.password-control .ui-control {
    padding-right: 4rem;
}

.password-control__toggle {
    position: absolute;
    top: 50%;
    right: var(--space-4);
    transform: translateY(-50%);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
}

.password-control__toggle:hover {
    color: var(--color-accent);
}

.account-nav a:focus-visible,
.password-control__toggle:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}

/* Cropper */
.cropper-frame {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 24rem;
    overflow: hidden;
    border-radius: var(--radius-md);
    background: var(--color-bg-subtle);
}

.cropper-frame__area {
    width: 100%;
    height: 100%;
}

:deep(.el-dialog__footer) {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
}
</style>
