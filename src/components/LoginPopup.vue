<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'
import { ref, reactive, computed } from 'vue'
import { authService } from '~/services/auth.service'
import { useAuth } from '~/composables/useAuth'
import type { LoginDto, RegisterDto, ApiError } from '~/types/api'
import { validateForm, validationRules, type ValidationRules, type ValidationErrors } from '~/utils/validation'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

// Get auth composable
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

// Form data
const loginForm = reactive<LoginDto>({
  email: '',
  password: '',
})

const registerForm = reactive<RegisterDto>({
  email: '',
  password: '',
  name: '',
})

// Validation errors
const loginErrors = ref<ValidationErrors>({})
const registerErrors = ref<ValidationErrors>({})

// Validation rules
const loginValidationRules: ValidationRules = {
  email: [
    validationRules.required('Email is required'),
    validationRules.email(),
  ],
  password: [
    validationRules.required('Password is required'),
  ],
}

const registerValidationRules: ValidationRules = {
  name: [
    validationRules.required('Name is required'),
    validationRules.minLength(2, 'Name must be at least 2 characters'),
  ],
  email: [
    validationRules.required('Email is required'),
    validationRules.email(),
  ],
  password: [
    validationRules.required('Password is required'),
    validationRules.minLength(6, 'Password must be at least 6 characters'),
  ],
}

// Reset forms
const resetForms = () => {
  loginForm.email = ''
  loginForm.password = ''
  registerForm.email = ''
  registerForm.password = ''
  registerForm.name = ''
  loginErrors.value = {}
  registerErrors.value = {}
}

// Login mutation
const {
  mutate: loginMutate,
  isPending: isLoginPending,
  isError: isLoginError,
  error: loginError,
} = useMutation({
  mutationFn: (data: LoginDto) => authService.login(data),
  onSuccess: (data) => {
    // Update auth state
    setAuthState(data.access_token)

    // Show success message (you can integrate a toast library here)
    console.log('Login successful!')

    // Close modal
    close()

    // Optionally redirect or refresh user data
    // window.location.reload()
  },
  onError: (error: ApiError) => {
    console.error('Login failed:', error)
  },
})

// Register mutation
const {
  mutate: registerMutate,
  isPending: isRegisterPending,
  isError: isRegisterError,
  error: registerError,
} = useMutation({
  mutationFn: (data: RegisterDto) => authService.register(data),
  onSuccess: (data) => {
    // Update auth state
    setAuthState(data.access_token)

    // Show success message
    console.log('Registration successful!')

    // Close modal
    close()

    // Optionally redirect or refresh user data
    // window.location.reload()
  },
  onError: (error: ApiError) => {
    console.error('Registration failed:', error)
  },
})

// Handle login submit
const handleLogin = () => {
  // Validate form
  const errors = validateForm(loginForm, loginValidationRules)
  loginErrors.value = errors

  // If there are errors, don't submit
  if (Object.keys(errors).length > 0) {
    return
  }

  // Submit form
  loginMutate(loginForm)
}

// Handle register submit
const handleRegister = () => {
  // Validate form
  const errors = validateForm(registerForm, registerValidationRules)
  registerErrors.value = errors

  // If there are errors, don't submit
  if (Object.keys(errors).length > 0) {
    return
  }

  // Submit form
  registerMutate(registerForm)
}

// Get error message from API error
const getErrorMessage = (error: any): string => {
  if (!error) return ''

  const apiError = error as ApiError

  if (Array.isArray(apiError.message)) {
    return apiError.message.join(', ')
  }

  return apiError.message || 'An error occurred'
}

// Computed properties for current state
const isPending = computed(() => isSignUp.value ? isRegisterPending.value : isLoginPending.value)
const isError = computed(() => isSignUp.value ? isRegisterError.value : isLoginError.value)
const error = computed(() => isSignUp.value ? registerError.value : loginError.value)
</script>

<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="modelValue" class="fixed inset-0 z-[1000] flex items-center justify-center p-4" role="dialog"
        aria-modal="true">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="close"></div>

        <!-- Modal Container -->
        <div
          class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl min-h-[600px] overflow-hidden flex flex-col md:block z-10">

          <!-- Close Button -->
          <button @click="close"
            class="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 transition-colors">
            <svg class="w-5 h-5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <!-- Left Panel (Blue) - Info & Switch -->
          <div
            class="w-full md:w-5/12 bg-[#1A71C7] p-8 md:p-12 text-white flex flex-col justify-center items-center text-center relative overflow-hidden transition-all duration-700 ease-in-out z-20 md:absolute md:top-0 md:h-full"
            :class="isSignUp ? 'order-1 md:left-0' : 'order-2 md:left-[58.333333%]'">

            <!-- Background Shapes -->
            <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
              <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-[#FFCE46] rounded-full opacity-90"></div>
              <div class="absolute top-1/4 left-1/4 w-16 h-16 bg-white/10 rotate-45 backdrop-blur-sm"></div>
              <div class="absolute bottom-1/4 right-1/4 w-10 h-10 bg-white/10 rotate-45 backdrop-blur-sm"></div>
              <div class="absolute top-10 right-10 w-20 h-20 bg-white/5 rotate-12 rounded-xl"></div>
            </div>

            <div class="relative z-10 w-full">
              <Transition mode="out-in" enter-active-class="transition duration-300 ease-out delay-100"
                enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-4">
                <div :key="isSignUp ? 'signup-info' : 'signin-info'" class="flex flex-col items-center">
                  <h2 class="text-3xl md:text-4xl font-bold mb-6">
                    {{ isSignUp ? 'Welcome Back!' : 'Hello, Friend!' }}
                  </h2>
                  <p class="text-base md:text-lg mb-8 text-white/90 leading-relaxed">
                    {{ isSignUp
                      ? 'To keep connected with us please login with your personal info'
                      : 'Enter your personal details and start journey with us'
                    }}
                  </p>
                  <button @click="toggleMode"
                    class="border-2 border-white text-white px-10 py-3 rounded-full font-semibold hover:bg-white hover:text-[#1A71C7] transition-all duration-300 uppercase tracking-wider text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    {{ isSignUp ? 'Sign In' : 'Sign Up' }}
                  </button>
                </div>
              </Transition>
            </div>
          </div>

          <!-- Right Panel (White) - Forms -->
          <div
            class="w-full md:w-7/12 bg-white dark:bg-slate-900 p-8 md:p-12 flex flex-col justify-center items-center relative transition-all duration-700 ease-in-out z-10 md:absolute md:top-0 md:h-full"
            :class="isSignUp ? 'order-2 md:left-[41.666667%]' : 'order-1 md:left-0'">

            <!-- Red Triangle -->
            <div class="absolute -top-32 -right-32 w-64 h-64 bg-[#EB5563] rotate-45 z-0 pointer-events-none opacity-90">
            </div>

            <div class="relative z-10 w-full max-w-md text-center">
              <Transition mode="out-in" enter-active-class="transition duration-300 ease-out delay-100"
                enter-from-class="opacity-0 translate-x-4" enter-to-class="opacity-100 translate-x-0"
                leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 translate-x-0"
                leave-to-class="opacity-0 -translate-x-4">
                <div :key="isSignUp ? 'signup-form' : 'signin-form'" class="w-full">
                  <h2 class="text-3xl font-bold text-[#1A71C7] mb-6">
                    {{ isSignUp ? 'Create Account' : 'Sign in to ANDAGO' }}
                  </h2>

                  <!-- Social Icons -->
                  <div class="flex justify-center gap-4 mb-6">
                    <button
                      class="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:border-[#1A71C7] hover:text-[#1A71C7] hover:bg-[#1A71C7]/5 transition-colors">
                      <i class='bx bxl-google'></i>
                    </button>
                    <button
                      class="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:border-[#1A71C7] hover:text-[#1A71C7] hover:bg-[#1A71C7]/5 transition-colors">
                      <i class='bx bxl-facebook-circle'></i>
                    </button>
                    <button
                      class="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:border-[#1A71C7] hover:text-[#1A71C7] hover:bg-[#1A71C7]/5 transition-colors">
                      <i class='bx bxl-twitter'></i>
                    </button>
                  </div>

                  <p class="text-slate-400 text-sm mb-8">
                    {{ isSignUp ? 'or use your email for registration:' : 'or use your email account:' }}
                  </p>

                  <!-- Error Alert -->
                  <div v-if="isError"
                    class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p class="text-sm text-red-600 dark:text-red-400">
                      {{ getErrorMessage(error) }}
                    </p>
                  </div>

                  <!-- Sign Up Form -->
                  <form v-if="isSignUp" class="space-y-4 w-full" @submit.prevent="handleRegister">
                    <!-- Name Input -->
                    <div class="relative group">
                      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <div class="i-carbon-user text-slate-400 group-focus-within:text-[#1A71C7] transition-colors">
                        </div>
                      </div>
                      <input v-model="registerForm.name" type="text" placeholder="Name" :class="[
                        'w-full bg-slate-50 dark:bg-slate-800 border py-3.5 pl-11 pr-4 rounded-lg text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-[#1A71C7] outline-none transition-all',
                        registerErrors.name ? 'border-red-500' : 'border-transparent'
                      ]" />
                      <p v-if="registerErrors.name" class="mt-1 text-xs text-red-500 text-left">
                        {{ registerErrors.name }}
                      </p>
                    </div>

                    <!-- Email Input -->
                    <div class="relative group">
                      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <div class="i-carbon-email text-slate-400 group-focus-within:text-[#1A71C7] transition-colors">
                        </div>
                      </div>
                      <input v-model="registerForm.email" type="email" placeholder="Email" :class="[
                        'w-full bg-slate-50 dark:bg-slate-800 border py-3.5 pl-11 pr-4 rounded-lg text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-[#1A71C7] outline-none transition-all',
                        registerErrors.email ? 'border-red-500' : 'border-transparent'
                      ]" />
                      <p v-if="registerErrors.email" class="mt-1 text-xs text-red-500 text-left">
                        {{ registerErrors.email }}
                      </p>
                    </div>

                    <!-- Password Input -->
                    <div class="relative group">
                      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <div
                          class="i-carbon-password text-slate-400 group-focus-within:text-[#1A71C7] transition-colors">
                        </div>
                      </div>
                      <input v-model="registerForm.password" type="password" placeholder="Password" :class="[
                        'w-full bg-slate-50 dark:bg-slate-800 border py-3.5 pl-11 pr-4 rounded-lg text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-[#1A71C7] outline-none transition-all',
                        registerErrors.password ? 'border-red-500' : 'border-transparent'
                      ]" />
                      <p v-if="registerErrors.password" class="mt-1 text-xs text-red-500 text-left">
                        {{ registerErrors.password }}
                      </p>
                    </div>

                    <button type="submit" :disabled="isPending"
                      class="mt-8 w-auto px-12 py-3 bg-[#1A71C7] text-white rounded-full font-bold hover:bg-white hover:text-[#1A71C7] hover:ring-2 hover:ring-[#1A71C7] transition-all duration-300 shadow-lg hover:shadow-[#1A71C7]/30 hover:-translate-y-0.5 uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#1A71C7] disabled:hover:text-white disabled:hover:translate-y-0">
                      <span v-if="!isPending">Sign Up</span>
                      <span v-else class="flex items-center gap-2">
                        <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                          viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                          </circle>
                          <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                          </path>
                        </svg>
                        Processing...
                      </span>
                    </button>
                  </form>

                  <!-- Sign In Form -->
                  <form v-else class="space-y-4 w-full" @submit.prevent="handleLogin">
                    <!-- Email Input -->
                    <div class="relative group">
                      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <div class="i-carbon-email text-slate-400 group-focus-within:text-[#1A71C7] transition-colors">
                        </div>
                      </div>
                      <input v-model="loginForm.email" type="email" placeholder="Email" :class="[
                        'w-full bg-slate-50 dark:bg-slate-800 border py-3.5 pl-11 pr-4 rounded-lg text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-[#1A71C7] outline-none transition-all',
                        loginErrors.email ? 'border-red-500' : 'border-transparent'
                      ]" />
                      <p v-if="loginErrors.email" class="mt-1 text-xs text-red-500 text-left">
                        {{ loginErrors.email }}
                      </p>
                    </div>

                    <!-- Password Input -->
                    <div class="relative group">
                      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <div
                          class="i-carbon-password text-slate-400 group-focus-within:text-[#1A71C7] transition-colors">
                        </div>
                      </div>
                      <input v-model="loginForm.password" type="password" placeholder="Password" :class="[
                        'w-full bg-slate-50 dark:bg-slate-800 border py-3.5 pl-11 pr-4 rounded-lg text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-[#1A71C7] outline-none transition-all',
                        loginErrors.password ? 'border-red-500' : 'border-transparent'
                      ]" />
                      <p v-if="loginErrors.password" class="mt-1 text-xs text-red-500 text-left">
                        {{ loginErrors.password }}
                      </p>
                    </div>

                    <!-- Forgot Password -->
                    <div class="text-right">
                      <a href="#" class="text-sm text-slate-400 hover:text-[#1A71C7] transition-colors">Forgot your
                        password?</a>
                    </div>

                    <button type="submit" :disabled="isPending"
                      class="mt-8 w-auto px-12 py-3 bg-[#1A71C7] text-white rounded-full font-bold hover:bg-white hover:text-[#1A71C7] hover:ring-2 hover:ring-[#1A71C7] transition-all duration-300 shadow-lg hover:shadow-[#1A71C7]/30 hover:-translate-y-0.5 uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#1A71C7] disabled:hover:text-white disabled:hover:translate-y-0">
                      <span v-if="!isPending">Sign In</span>
                      <span v-else class="flex items-center gap-2">
                        <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                          viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                          </circle>
                          <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                          </path>
                        </svg>
                        Processing...
                      </span>
                    </button>
                  </form>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Add any specific animations if needed, but Tailwind classes handle most */
</style>
