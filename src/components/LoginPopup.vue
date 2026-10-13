<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useLoginMutation, useRegisterMutation } from '~/composables/useAuthMutation'
import type { LoginDto, RegisterDto, ApiError } from '~/types/api'
import { validateForm, validationRules, type ValidationRules, type ValidationErrors } from '~/utils/validation'
import { logger } from '~/utils/logger'

const { t } = useI18n()

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const { login: setAuthState } = useAuth()

const dialogTitleId = useId()

const close = () => {
  emit('update:modelValue', false)
  resetForms()
}

const isSignUp = ref(false)

const setMode = (value: boolean) => {
  if (isSignUp.value === value) return
  isSignUp.value = value
  resetForms()
}

const toggleMode = () => setMode(!isSignUp.value)

const showLoginPassword = ref(false)
const showRegisterPassword = ref(false)

const loginForm = reactive<LoginDto>({
  email: '',
  password: '',
})

const registerForm = reactive<RegisterDto>({
  email: '',
  password: '',
  isAdmin: false,
  userName: '',
  avatar: '',
})

const loginErrors = ref<ValidationErrors>({})
const registerErrors = ref<ValidationErrors>({})

// computed để thông báo lỗi luôn theo đúng ngôn ngữ hiện tại
const loginValidationRules = computed<ValidationRules>(() => ({
  email: [
    validationRules.required(t('auth.emailRequired')),
    validationRules.email(),
  ],
  password: [
    validationRules.required(t('auth.passwordRequired')),
  ],
}))

const registerValidationRules = computed<ValidationRules>(() => ({
  userName: [
    validationRules.required(t('auth.usernameRequired')),
    validationRules.minLength(2, t('auth.usernameMin')),
  ],
  email: [
    validationRules.required(t('auth.emailRequired')),
    validationRules.email(),
  ],
  password: [
    validationRules.required(t('auth.passwordRequired')),
    validationRules.minLength(6, t('auth.passwordMin')),
  ],
}))

const resetForms = () => {
  loginForm.email = ''
  loginForm.password = ''
  registerForm.email = ''
  registerForm.password = ''
  registerForm.userName = ''
  loginErrors.value = {}
  registerErrors.value = {}
  showLoginPassword.value = false
  showRegisterPassword.value = false
}

const {
  mutate: loginMutate,
  isPending: isLoginPending,
  isError: isLoginError,
  error: loginError,
} = useLoginMutation();

const {
  mutate: registerMutate,
  isPending: isRegisterPending,
  isError: isRegisterError,
  error: registerError,
} = useRegisterMutation();

const handleLogin = () => {
  const errors = validateForm(loginForm, loginValidationRules.value)
  loginErrors.value = errors
  if (Object.keys(errors).length > 0) return
  loginMutate(loginForm, {
    onSuccess: (data) => {
      const token = data.accessToken
      if (token) {
        setAuthState(token)
        ElMessage.success(t('auth.loginSuccess'))
        close()
      } else {
        logger.error('Login failed: No access token received')
        ElMessage.error(t('auth.loginFailed'))
      }
    },
    onError: (error: any) => {
      logger.error('Login failed:', error)
    },
  })
}

const handleRegister = () => {
  const errors = validateForm(registerForm, registerValidationRules.value)
  registerErrors.value = errors
  if (Object.keys(errors).length > 0) return
  registerMutate(registerForm, {
    onSuccess: (data) => {
      const token = data.accessToken
      if (token) {
        setAuthState(token)
        ElMessage.success(t('auth.registerSuccess'))
        close()
      } else {
        logger.error('Registration failed: No access token received')
        ElMessage.error(t('auth.registerFailed'))
      }
    },
    onError: (error: any) => {
      logger.error('Registration failed:', error)
    },
  })
}

const getErrorMessage = (error: any): string => {
  if (!error) return ''
  const apiError = error as ApiError
  if (Array.isArray(apiError.message)) return apiError.message.join(', ')
  return apiError.message || t('common.errorOccurred')
}

const isPending = computed(() => isSignUp.value ? isRegisterPending.value : isLoginPending.value)
const isError = computed(() => isSignUp.value ? isRegisterError.value : isLoginError.value)
const error = computed(() => isSignUp.value ? registerError.value : loginError.value)

const socialProviders = computed(() => [
  { key: 'google', label: t('auth.social.google') },
  { key: 'facebook', label: t('auth.social.facebook') },
  { key: 'twitter', label: t('auth.social.twitter') },
])
</script>

<template>
  <Teleport to="body">
    <Transition name="login-fade">
      <div v-if="modelValue" class="login-dialog" role="dialog" aria-modal="true" :aria-labelledby="dialogTitleId">
        <div class="login-dialog__backdrop" @click="close" />

        <div class="login-dialog__panel">
          <button type="button" class="login-dialog__close" @click="close">{{ t('common.close') }}</button>

          <h2 :id="dialogTitleId" class="login-dialog__title">
            {{ isSignUp ? t('auth.createAccount') : t('auth.signInToAndago') }}
          </h2>
          <p class="login-dialog__lead">
            {{ isSignUp ? t('auth.keepConnected') : t('auth.enterDetails') }}
          </p>

          <div class="login-dialog__tabs">
            <UiChip :active="!isSignUp" @click="setMode(false)">{{ t('auth.signIn') }}</UiChip>
            <UiChip :active="isSignUp" @click="setMode(true)">{{ t('auth.signUp') }}</UiChip>
          </div>

          <p v-if="isError" class="login-dialog__alert">{{ getErrorMessage(error) }}</p>

          <Transition name="login-fade" mode="out-in">
            <form v-if="isSignUp" key="signup" class="login-form" novalidate @submit.prevent="handleRegister">
              <UiField :label="t('auth.name')" :error="registerErrors.userName">
                <template #default="{ id, describedBy, invalid }">
                  <input :id="id" v-model="registerForm.userName" type="text" class="ui-control" autocomplete="name"
                    :aria-describedby="describedBy" :aria-invalid="invalid">
                </template>
              </UiField>

              <UiField :label="t('auth.email')" :error="registerErrors.email">
                <template #default="{ id, describedBy, invalid }">
                  <input :id="id" v-model="registerForm.email" type="email" class="ui-control" autocomplete="email"
                    :aria-describedby="describedBy" :aria-invalid="invalid">
                </template>
              </UiField>

              <UiField :label="t('auth.password')" :error="registerErrors.password">
                <template #default="{ id, describedBy, invalid }">
                  <div class="password-control">
                    <input :id="id" v-model="registerForm.password" :type="showRegisterPassword ? 'text' : 'password'"
                      class="ui-control" autocomplete="new-password" :aria-describedby="describedBy"
                      :aria-invalid="invalid">
                    <button type="button" class="password-control__toggle"
                      :aria-label="showRegisterPassword ? t('auth.hidePassword') : t('auth.showPassword')"
                      @click="showRegisterPassword = !showRegisterPassword">
                      {{ showRegisterPassword ? t('auth.hide') : t('auth.show') }}
                    </button>
                  </div>
                </template>
              </UiField>

              <UiButton type="submit" block :disabled="isPending">
                {{ isPending ? t('auth.processing') : t('auth.signUp') }}
              </UiButton>
            </form>

            <form v-else key="signin" class="login-form" novalidate @submit.prevent="handleLogin">
              <UiField :label="t('auth.email')" :error="loginErrors.email">
                <template #default="{ id, describedBy, invalid }">
                  <input :id="id" v-model="loginForm.email" type="email" class="ui-control" autocomplete="email"
                    :aria-describedby="describedBy" :aria-invalid="invalid">
                </template>
              </UiField>

              <UiField :label="t('auth.password')" :error="loginErrors.password">
                <template #default="{ id, describedBy, invalid }">
                  <div class="password-control">
                    <input :id="id" v-model="loginForm.password" :type="showLoginPassword ? 'text' : 'password'"
                      class="ui-control" autocomplete="current-password" :aria-describedby="describedBy"
                      :aria-invalid="invalid">
                    <button type="button" class="password-control__toggle"
                      :aria-label="showLoginPassword ? t('auth.hidePassword') : t('auth.showPassword')"
                      @click="showLoginPassword = !showLoginPassword">
                      {{ showLoginPassword ? t('auth.hide') : t('auth.show') }}
                    </button>
                  </div>
                </template>
              </UiField>

              <p class="login-form__forgot">
                <a href="#" class="login-dialog__link">{{ t('auth.forgotPassword') }}</a>
              </p>

              <UiButton type="submit" block :disabled="isPending">
                {{ isPending ? t('auth.processing') : t('auth.signIn') }}
              </UiButton>
            </form>
          </Transition>

          <p class="login-dialog__divider">
            <span>{{ isSignUp ? t('auth.orUseEmail') : t('auth.orUseEmailAccount') }}</span>
          </p>

          <div class="login-dialog__social">
            <UiButton v-for="provider in socialProviders" :key="provider.key" type="button" variant="outline" block>
              {{ provider.label }}
            </UiButton>
          </div>

          <p class="login-dialog__switch">
            {{ isSignUp ? t('auth.alreadyHaveAccount') : t('auth.noAccount') }}
            <button type="button" class="login-dialog__link" @click="toggleMode">
              {{ isSignUp ? t('auth.signIn') : t('auth.signUp') }}
            </button>
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.login-dialog {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--gutter);
}

.login-dialog__backdrop {
  position: absolute;
  inset: 0;
  background: var(--color-backdrop);
}

.login-dialog__panel {
  position: relative;
  width: 100%;
  max-width: 26rem;
  max-height: calc(100vh - 2 * var(--gutter));
  overflow-y: auto;
  padding: var(--space-fluid-lg) var(--space-8);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-popover);
}

.login-dialog__close {
  position: absolute;
  top: var(--space-5);
  right: var(--space-5);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  text-decoration: underline;
  text-decoration-color: var(--color-border);
  text-underline-offset: 0.25em;
}

.login-dialog__close:hover {
  color: var(--color-text);
}

.login-dialog__title {
  padding-right: var(--space-10);
  font-family: var(--font-serif);
  font-size: var(--text-h3);
  font-weight: var(--weight-regular);
  line-height: var(--leading-tight);
}

.login-dialog__lead {
  margin-top: var(--space-2);
  color: var(--color-text-muted);
  font-size: var(--text-ui);
  line-height: var(--leading-body);
}

.login-dialog__tabs {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-6);
}

.login-dialog__alert {
  margin-top: var(--space-5);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-md);
  color: var(--color-danger);
  font-size: var(--text-sm);
}

.login-form {
  display: grid;
  gap: var(--space-5);
  margin-top: var(--space-6);
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

.login-form__forgot {
  margin-top: -0.75rem;
  text-align: right;
}

/* Chữ ở giữa, hai đường kẻ hai bên co lại khi chữ xuống dòng */
.login-dialog__divider {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-8);
}

.login-dialog__divider::before,
.login-dialog__divider::after {
  content: '';
  flex: 1 1 var(--space-6);
  border-top: 1px solid var(--color-border);
}

.login-dialog__divider span {
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
}

.login-dialog__social {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 7rem), 1fr));
  gap: var(--space-3);
  margin-top: var(--space-5);
}

.login-dialog__switch {
  margin-top: var(--space-6);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  text-align: center;
}

.login-dialog__link {
  color: var(--color-text);
  font-weight: var(--weight-medium);
  text-decoration: underline;
  text-decoration-color: var(--color-accent);
  text-underline-offset: 0.3em;
}

.login-dialog__link:hover {
  color: var(--color-accent);
}

.login-dialog :focus-visible {
  outline: var(--focus-ring);
  outline-offset: 2px;
}

.login-fade-enter-active,
.login-fade-leave-active {
  transition: opacity var(--transition-base);
}

.login-fade-enter-from,
.login-fade-leave-to {
  opacity: 0;
}
</style>
