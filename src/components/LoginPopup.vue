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

const close = () => {
  emit('update:modelValue', false)
  resetForms()
}

const isSignUp = ref(false)

const toggleMode = () => {
  isSignUp.value = !isSignUp.value
  resetForms()
}

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

const loginValidationRules: ValidationRules = {
  email: [
    validationRules.required(t('auth.emailRequired')),
    validationRules.email(),
  ],
  password: [
    validationRules.required(t('auth.passwordRequired')),
  ],
}

const registerValidationRules: ValidationRules = {
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
}

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
  const errors = validateForm(loginForm, loginValidationRules)
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
  const errors = validateForm(registerForm, registerValidationRules)
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
</script>

<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-500 cubic-bezier(0.16, 1, 0.3, 1)" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-300 ease-in" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="modelValue" class="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6" role="dialog"
        aria-modal="true">
        <!-- Modern Blur Backdrop -->
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-all" @click="close"></div>

        <!-- Main Card Container -->
        <div
          class="relative w-full max-w-[1000px] bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden min-h-[650px] md:h-[650px] transition-all transform hover:shadow-indigo-500/10 hidden md:block">

          <!-- Close Button -->
          <button @click="close"
            class="absolute top-6 right-6 z-50 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <div class="i-carbon-close text-2xl"></div>
          </button>

          <!-- OVERLAY PANEL (The "Art" side that moves) -->
          <div
            class="absolute top-0 w-5/12 h-full bg-slate-900 text-white overflow-hidden flex flex-col justify-between p-12 transition-all duration-700 ease-in-out z-20"
            :class="isSignUp ? 'left-0' : 'left-[58.333333%]'">
            <!-- Animated Background Gradient -->
            <div class="absolute inset-0 z-0">
              <div class="absolute inset-0 bg-gradient-to-br from-#1A71C1 via-indigo-600 to-#1A71C1 opacity-90">
              </div>
              <div
                class="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent animate-slow-spin">
              </div>
              <div class="absolute inset-0 bg-noise opacity-10 mix-blend-overlay"></div>
            </div>

            <!-- Content -->
            <div class="relative z-10 h-full flex flex-col justify-center text-center">
              <Transition mode="out-in" enter-active-class="transition duration-500 ease-out delay-100"
                enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-300 ease-in" leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-4">
                <div :key="isSignUp ? 'signup-msg' : 'signin-msg'">
                  <h2 class="text-4xl font-bold mb-6 font-display tracking-tight leading-tight">
                    {{ isSignUp ? t('auth.welcomeBack') : t('auth.startJourney') }}
                  </h2>
                  <p class="text-indigo-100 text-lg font-light leading-relaxed mb-8 opacity-90">
                    {{ isSignUp
                      ? t('auth.keepConnected')
                      : t('auth.enterDetails')
                    }}
                  </p>
                  <button @click="toggleMode"
                    class="inline-block px-10 py-3 border-2 border-white rounded-full font-semibold uppercase tracking-widest text-sm hover:bg-white hover:text-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    {{ isSignUp ? t('auth.signIn') : t('auth.signUp') }}
                  </button>
                </div>
              </Transition>
            </div>
          </div>

          <!-- FORM PANEL (The "Content" side that moves) -->
          <div
            class="absolute top-0 w-7/12 h-full bg-white dark:bg-slate-900 p-14 flex flex-col justify-center transition-all duration-700 ease-in-out z-10"
            :class="isSignUp ? 'left-[41.666667%]' : 'left-0'">
            <div class="w-full max-w-md mx-auto text-center" :class="isSignUp ? 'opacity-100' : 'opacity-100'">
              <!-- The content here switches based on mode too -->
              <div class="mb-8">
                <h3 class="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-display">
                  {{ isSignUp ? t('auth.createAccount') : t('auth.signInToAndago') }}
                </h3>
                <!-- Social Icons -->
                <div class="flex justify-center gap-4 my-6">
                  <button v-for="icon in ['bxl-google', 'bxl-facebook-circle', 'bxl-twitter']" :key="icon"
                    class="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-300 group">
                    <i :class="['bx text-xl', icon, 'group-hover:scale-110 transition-transform']"></i>
                  </button>
                </div>
                <p class="text-xs uppercase text-slate-400 tracking-wider">
                  {{ isSignUp ? t('auth.orUseEmail') : t('auth.orUseEmailAccount') }}
                </p>
              </div>

              <!-- Alert -->
              <Transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0">
                <div v-if="isError"
                  class="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 flex gap-3 text-red-600 dark:text-red-400 text-sm text-left">
                  <div class="i-carbon-warning-filled text-lg shrink-0 mt-0.5"></div>
                  <p>{{ getErrorMessage(error) }}</p>
                </div>
              </Transition>

              <!-- Forms with Transition -->
              <Transition mode="out-in" enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95">
                <form v-if="isSignUp" key="signup-form" @submit.prevent="handleRegister" class="space-y-4 text-left">
                  <div class="space-y-1">
                    <div class="relative bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <div class="i-carbon-user text-slate-400"></div>
                      </div>
                      <input v-model="registerForm.userName" type="text"
                        class="w-full bg-transparent border-none rounded-xl px-4 py-3.5 pl-11 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        :placeholder="t('auth.name')" />
                    </div>
                    <p v-if="registerErrors.userName" class="text-xs text-red-500 ml-1">{{ registerErrors.userName }}
                    </p>
                  </div>

                  <div class="space-y-1">
                    <div class="relative bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <div class="i-carbon-email text-slate-400"></div>
                      </div>
                      <input v-model="registerForm.email" type="email"
                        class="w-full bg-transparent border-none rounded-xl px-4 py-3.5 pl-11 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        :placeholder="t('auth.email')" />
                    </div>
                    <p v-if="registerErrors.email" class="text-xs text-red-500 ml-1">{{ registerErrors.email }}</p>
                  </div>

                  <div class="space-y-1">
                    <div class="relative bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <div class="i-carbon-password text-slate-400"></div>
                      </div>
                      <input v-model="registerForm.password" :type="showRegisterPassword ? 'text' : 'password'"
                        class="w-full bg-transparent border-none rounded-xl px-4 py-3.5 pl-11 pr-12 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        :placeholder="t('auth.password')" />
                      <button type="button" @click="showRegisterPassword = !showRegisterPassword"
                        class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors">
                        <div :class="showRegisterPassword ? 'i-carbon-view-off' : 'i-carbon-view'" class="text-xl">
                        </div>
                      </button>
                    </div>
                    <p v-if="registerErrors.password" class="text-xs text-red-500 ml-1">{{ registerErrors.password }}
                    </p>
                  </div>

                  <button type="submit" :disabled="isPending"
                    class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 active:scale-[0.99] transition-all duration-300 disabled:opacity-70 mt-2 uppercase tracking-wider text-sm">
                    <span v-if="!isPending">{{ t('auth.signUp') }}</span>
                    <span v-else>{{ t('auth.processing') }}</span>
                  </button>
                </form>

                <form v-else key="signin-form" @submit.prevent="handleLogin" class="space-y-4 text-left">
                  <div class="space-y-1">
                    <div class="relative bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <div class="i-carbon-email text-slate-400"></div>
                      </div>
                      <input v-model="loginForm.email" type="email"
                        class="w-full bg-transparent border-none rounded-xl px-4 py-3.5 pl-11 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        :placeholder="t('auth.email')" />
                    </div>
                    <p v-if="loginErrors.email" class="text-xs text-red-500 ml-1">{{ loginErrors.email }}</p>
                  </div>

                  <div class="space-y-1">
                    <div class="relative bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <div class="i-carbon-password text-slate-400"></div>
                      </div>
                      <input v-model="loginForm.password" :type="showLoginPassword ? 'text' : 'password'"
                        class="w-full bg-transparent border-none rounded-xl px-4 py-3.5 pl-11 pr-12 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        :placeholder="t('auth.password')" />
                      <button type="button" @click="showLoginPassword = !showLoginPassword"
                        class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors">
                        <div :class="showLoginPassword ? 'i-carbon-view-off' : 'i-carbon-view'" class="text-xl"></div>
                      </button>
                    </div>
                    <p v-if="loginErrors.password" class="text-xs text-red-500 ml-1">{{ loginErrors.password }}</p>
                  </div>

                  <div class="text-right">
                    <a href="#" class="text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors">{{
                      t('auth.forgotPassword') }}</a>
                  </div>

                  <button type="submit" :disabled="isPending"
                    class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 active:scale-[0.99] transition-all duration-300 disabled:opacity-70 mt-2 uppercase tracking-wider text-sm">
                    <span v-if="!isPending">{{ t('auth.signIn') }}</span>
                    <span v-else>{{ t('auth.processing') }}</span>
                  </button>
                </form>
              </Transition>
            </div>
          </div>
        </div>

        <!-- Mobile Layout (Stack, no sliding) -->
        <div
          class="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden md:hidden">
          <button @click="close" class="absolute top-4 right-4 z-50 p-2 text-slate-400 hover:text-indigo-600">
            <div class="i-carbon-close text-xl"></div>
          </button>

          <div class="p-8">
            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold text-slate-900 dark:text-white font-display">{{ isSignUp ?
                t('auth.createAccount')
                : t('auth.signIn') }}</h3>
              <p class="text-sm text-slate-400 mt-2">Welcome to Motobike Tours</p>
            </div>

            <!-- Simplified Forms for Mobile -->
            <Transition mode="out-in" enter-active-class="transition duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-8" enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-8">
              <form v-if="isSignUp" key="mobile-signup" @submit.prevent="handleRegister" class="space-y-4">
                <input v-model="registerForm.userName" type="text" :placeholder="t('auth.name')"
                  class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500/20" />
                <input v-model="registerForm.email" type="email" :placeholder="t('auth.email')"
                  class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500/20" />
                <div class="relative">
                  <input v-model="registerForm.password" :type="showRegisterPassword ? 'text' : 'password'"
                    :placeholder="t('auth.password')"
                    class="w-full px-4 py-3 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500/20" />
                  <button type="button" @click="showRegisterPassword = !showRegisterPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <div :class="showRegisterPassword ? 'i-carbon-view-off' : 'i-carbon-view'"></div>
                  </button>
                </div>
                <button type="submit" class="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">{{
                  t('auth.signUp') }}</button>
                <p class="text-center text-sm text-slate-500 mt-4">
                  Already have an account? <a href="#" @click.prevent="toggleMode"
                    class="text-indigo-600 font-bold">Sign
                    In</a>
                </p>
              </form>

              <form v-else key="mobile-signin" @submit.prevent="handleLogin" class="space-y-4">
                <input v-model="loginForm.email" type="email" :placeholder="t('auth.email')"
                  class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500/20" />
                <div class="relative">
                  <input v-model="loginForm.password" :type="showLoginPassword ? 'text' : 'password'"
                    :placeholder="t('auth.password')"
                    class="w-full px-4 py-3 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500/20" />
                  <button type="button" @click="showLoginPassword = !showLoginPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <div :class="showLoginPassword ? 'i-carbon-view-off' : 'i-carbon-view'"></div>
                  </button>
                </div>
                <button type="submit" class="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">{{
                  t('auth.signIn') }}</button>
                <p class="text-center text-sm text-slate-500 mt-4">
                  Don't have an account? <a href="#" @click.prevent="toggleMode" class="text-indigo-600 font-bold">Sign
                    Up</a>
                </p>
              </form>
            </Transition>
          </div>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.font-display {
  font-family: 'Outfit', sans-serif;
}

.animate-slow-spin {
  animation: spin 15s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.bg-noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
</style>
