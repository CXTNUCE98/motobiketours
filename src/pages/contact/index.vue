<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useNotifications } from '@/composables/notifications'
import { useI18n } from 'vue-i18n'
import { useCountriesQuery } from '@/composables/useCountriesQuery'
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';

const { t } = useI18n()
const { data: countries, isLoading: isLoadingCountries } = useCountriesQuery()

const countryOptions = computed(() => {
    return (countries.value || []).map(c => ({
        value: c.niceName,
        label: c.niceName,
    }))
})
type ContactForm = {
    fullName: string
    email: string
    phone: string
    country: string
    title: string
    content: string
}

const form = reactive<ContactForm>({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    title: '',
    content: '',
})

const isSubmitting = ref(false)
const { notify } = useNotifications()

type ContactErrors = Partial<Record<keyof ContactForm, string>>
const errors = reactive<ContactErrors>({})

const setError = (key: keyof ContactForm, msg: string) => { errors[key] = msg }
const clearError = (key: keyof ContactForm) => { if (errors[key]) delete errors[key] }

const validateField = (key: keyof ContactForm) => {
    clearError(key)
    const value = (form[key] || '').toString().trim()

    switch (key) {
        case 'fullName':
            if (!value) setError('fullName', t('contact.form.validation.fullName'))
            break
        case 'email':
            if (!value) {
                setError('email', t('contact.form.validation.emailRequired'))
            } else if (!isEmail(value) || !/\.[a-zA-Z]{2,}$/.test(value)) {
                setError('email', t('contact.form.validation.emailInvalid'))
            }
            break
        case 'phone':
            if (!value) {
                setError('phone', t('contact.form.validation.phoneRequired'))
            } else if (!isMobilePhone(value, 'any', { strictMode: false })) {
                setError('phone', t('contact.form.validation.phoneInvalid'))
            }
            break
        case 'country':
            if (!form.country) setError('country', t('contact.form.validation.countryRequired'))
            break
        case 'title':
            if (!value) setError('title', t('contact.form.validation.subject'))
            break
        case 'content':
            if (!value) setError('content', t('contact.form.validation.message'))
            break
    }
}

const validate = () => {
    (Object.keys(form) as (keyof ContactForm)[]).forEach(validateField)
    return Object.keys(errors).length === 0
}

const submit = async () => {
    const ok = validate()
    if (!ok) {
        const firstError = errors.fullName || errors.email || errors.title || errors.content
        if (firstError) notify('error', firstError)
        return
    }
    try {
        isSubmitting.value = true
        // Gọi API thực tế thay vì dùng mock setTimeout
        await $fetch('/api/contact', {
            method: 'POST',
            body: {
                fullName: form.fullName,
                email: form.email,
                phone: form.phone,
                country: form.country,
                title: form.title,
                content: form.content
            }
        })
        notify('success', t('contact.sendMailSuccess') || 'Đã gửi yêu cầu thành công! Chúng tôi sẽ liên hệ lại sớm nhất.')
        Object.assign(form, { fullName: '', email: '', phone: '', country: '', title: '', content: '' })
        for (const k of Object.keys(errors) as (keyof ContactForm)[]) delete errors[k]
    } catch (e: any) {
        console.error('Mail submit error:', e)
        const errorMessage = e.data?.statusMessage || e.message || 'Gửi thất bại, vui lòng thử lại'
        notify('error', errorMessage)
    } finally {
        isSubmitting.value = false
    }
}

const faqItems = [
    {
        question: t('contact.faqItems.howBook'),
        answer: t('contact.faqItems.answerHowBook')
    },
    {
        question: t('contact.faqItems.tourPrice'),
        answer: t('contact.faqItems.answerTourPrice')
    },
    {
        question: t('contact.faqItems.drivingLicense'),
        answer: t('contact.faqItems.answerDrivingLicense')
    },
    {
        question: t('contact.faqItems.customTour'),
        answer: t('contact.faqItems.answerCustomTour')
    }
]

const activeFaq = ref<number | null>(0)
const toggleFaq = (index: number) => {
    activeFaq.value = activeFaq.value === index ? null : index
}
</script>

<template>
    <div
        class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <!-- Hero Section -->
        <div class="relative py-24 md:py-32 overflow-hidden">
            <!-- Background with Mesh Gradient -->
            <div class="absolute inset-0 bg-[#0f172a]">
                <!-- Animated Mesh Gradient -->
                <div class="absolute inset-0 opacity-40">
                    <div
                        class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600 blur-[120px] animate-pulse">
                    </div>
                    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600 blur-[120px] animate-pulse"
                        style="animation-delay: 2s"></div>
                    <div class="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-cyan-500 blur-[100px] animate-pulse"
                        style="animation-delay: 4s"></div>
                </div>
                <!-- Grid Pattern -->
                <div class="absolute inset-0 opacity-10"
                    style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 40px 40px;">
                </div>
            </div>

            <!-- Content -->
            <div class="container mx-auto px-4 relative z-10">
                <div class="max-w-4xl mx-auto text-center">
                    <!-- Badge -->
                    <div
                        class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-300 text-sm font-bold mb-8 animate-fade-in">
                        <span class="relative flex h-2 w-2">
                            <span
                                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        {{ t('contact.contactUs') }}
                    </div>

                    <h1 class="text-5xl md:text-7xl font-black mb-8 leading-tight animate-fade-in"
                        style="animation-delay: 0.2s">
                        <span class="block text-white">{{ t('contact.connect') }}</span>
                        <span
                            class="block bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent filter drop-shadow-sm">
                            {{ t('contact.yourJourney') }}
                        </span>
                    </h1>

                    <p class="text-xl md:text-2xl mb-12 text-blue-100/80 max-w-2xl mx-auto leading-relaxed animate-fade-in"
                        style="animation-delay: 0.4s">
                        {{ t('contact.desc') }}
                    </p>
                </div>
            </div>

            <!-- Decorative Bottom Wave -->
            <div class="absolute bottom-0 left-0 right-0 pointer-events-none">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
                    <path
                        d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                        class="fill-gray-50 dark:fill-gray-900 transition-colors duration-300" />
                </svg>
            </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20 pb-20">
            <!-- Contact Quick Info Cards (Restored from image) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                <!-- Call Us -->
                <a href="tel:0854242357"
                    class="group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl shadow-blue-500/5 border border-white dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                    <div
                        class="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                        <i class="bx bx-phone-call text-2xl text-blue-500"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ t('contact.quickInfo.call') }}
                    </h3>
                    <p class="text-gray-700 dark:text-gray-200 font-bold mb-1">+84854.242.357 (Mr An)</p>
                    <p class="text-sm text-gray-400">Mon-Sun, 8am-8pm</p>
                </a>

                <!-- Email Us -->
                <a href="mailto:contact.andago@gmail.com"
                    class="group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl shadow-purple-500/5 border border-white dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                    <div
                        class="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                        <i class="bx bx-envelope text-2xl text-pink-500"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ t('contact.quickInfo.email') }}
                    </h3>
                    <p class="text-gray-700 dark:text-gray-200 font-bold mb-1">contact.andago@gmail.com</p>
                    <p class="text-sm text-gray-400">Online Support</p>
                </a>

                <!-- Visit Us -->
                <div
                    class="group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl shadow-indigo-500/5 border border-white dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                    <div
                        class="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                        <i class="bx bx-map text-2xl text-purple-500"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ t('contact.quickInfo.visit') }}
                    </h3>
                    <p class="text-gray-700 dark:text-gray-200 font-bold mb-1">53 Phạm Ngọc Mậu</p>
                    <p class="text-sm text-gray-400">Thanh Khê, Đà Nẵng</p>
                </div>

                <!-- WhatsApp -->
                <a href="https://wa.me/84854242357" target="_blank"
                    class="group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl shadow-green-500/5 border border-white dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                    <div
                        class="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                        <i class="bx bxl-whatsapp text-2xl text-green-500"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ t('contact.quickInfo.whatsapp')
                    }}</h3>
                    <p class="text-gray-700 dark:text-gray-200 font-bold mb-1">{{ t('contact.chatWithUs') }}</p>
                    <p class="text-sm text-gray-400">Instant Response</p>
                </a>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                <!-- Contact Form -->
                <div class="lg:col-span-2">
                    <div
                        class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none p-8 md:p-10 border border-transparent dark:border-gray-700">
                        <div class="mb-10">
                            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{{
                                t('contact.sendUsAMessage') }}</h2>
                            <p class="text-gray-600 dark:text-gray-300">{{ t('contact.fillOut') }}</p>
                        </div>

                        <form @submit.prevent="submit" class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-2">
                                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{{
                                        t('contact.fullName') }}</label>
                                    <div class="relative">
                                        <i
                                            class="bx bx-user absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400"></i>
                                        <input v-model="form.fullName" @input="validateField('fullName')"
                                            @blur="validateField('fullName')" type="text"
                                            class="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                            placeholder="John Doe"
                                            :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500/10': errors.fullName }">
                                    </div>
                                    <p v-if="errors.fullName" class="text-red-500 text-xs ml-1">{{ errors.fullName }}
                                    </p>
                                </div>

                                <div class="space-y-2">
                                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{{
                                        t('contact.email') }}</label>
                                    <div class="relative">
                                        <i
                                            class="bx bx-envelope absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400"></i>
                                        <input v-model="form.email" @input="validateField('email')"
                                            @blur="validateField('email')" type="email"
                                            class="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                            placeholder="john@example.com"
                                            :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500/10': errors.email }">
                                    </div>
                                    <p v-if="errors.email" class="text-red-500 text-xs ml-1">{{ errors.email }}</p>
                                </div>

                                <div class="space-y-2">
                                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{{
                                        t('contact.phone') }}</label>
                                    <div class="relative">
                                        <i
                                            class="bx bx-phone absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400"></i>
                                        <input v-model="form.phone" @input="validateField('phone')"
                                            @blur="validateField('phone')" type="tel"
                                            class="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                            placeholder="+84 123 456 789"
                                            :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500/10': errors.phone }">
                                    </div>
                                    <p v-if="errors.phone" class="text-red-500 text-xs ml-1">{{ errors.phone }}</p>
                                </div>

                                <div class="space-y-2">
                                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{{
                                        t('contact.country') }}</label>
                                    <SearchableSelect v-model="form.country"
                                        @update:model-value="validateField('country')" @blur="validateField('country')"
                                        :options="countryOptions" :placeholder="t('contact.yourCountry')"
                                        :loading="isLoadingCountries" icon="bx bx-world"
                                        :has-error="!!errors.country" />
                                    <p v-if="errors.country" class="text-red-500 text-xs ml-1 mt-1">{{ errors.country }}
                                    </p>
                                </div>
                            </div>

                            <div class="space-y-2">
                                <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{{
                                    t('contact.subject') }}</label>
                                <div class="relative">
                                    <i
                                        class="bx bx-tag absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400"></i>
                                    <input v-model="form.title" @input="validateField('title')"
                                        @blur="validateField('title')" type="text"
                                        class="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                        :placeholder="t('contact.howCanHelp')"
                                        :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500/10': errors.title }">
                                </div>
                                <p v-if="errors.title" class="text-red-500 text-xs ml-1">{{ errors.title }}</p>
                            </div>

                            <div class="space-y-2">
                                <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{{
                                    t('contact.message') }}</label>
                                <div class="relative">
                                    <i class="bx bx-message-detail absolute left-4 top-6 text-xl text-gray-400"></i>
                                    <textarea v-model="form.content" @input="validateField('content')"
                                        @blur="validateField('content')" rows="5"
                                        class="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none text-gray-900 dark:text-white placeholder-gray-400"
                                        :placeholder="t('contact.tellUsAboutYourTrip')"
                                        :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500/10': errors.content }"></textarea>
                                </div>
                                <p v-if="errors.content" class="text-red-500 text-xs ml-1">{{ errors.content }}</p>
                            </div>

                            <button type="submit" :disabled="isSubmitting"
                                class="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                <i v-if="isSubmitting" class="bx bx-loader-alt animate-spin text-xl"></i>
                                <span>{{ isSubmitting ? t('contact.sendingMessage') : t('contact.sendMessage') }}</span>
                                <i v-if="!isSubmitting" class="bx bx-send text-xl"></i>
                            </button>
                        </form>
                    </div>
                </div>

                <!-- FAQ & Map -->
                <div class="space-y-8">
                    <!-- FAQ Section -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none p-8 border border-transparent dark:border-gray-700">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            {{ t('contact.faq') }}
                        </h3>
                        <div class="space-y-4">
                            <div v-for="(faq, index) in faqItems" :key="index"
                                class="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden transition-all duration-300"
                                :class="activeFaq === index ? 'bg-gray-50 dark:bg-gray-700/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'">
                                <button @click="toggleFaq(index)"
                                    class="w-full px-5 py-4 flex items-center justify-between text-left">
                                    <span class="font-medium text-gray-900 dark:text-white text-sm">{{ faq.question
                                    }}</span>
                                    <i class="bx bx-chevron-down text-xl text-gray-400 transition-transform duration-300"
                                        :class="{ 'rotate-180 text-indigo-600 dark:text-indigo-400': activeFaq === index }"></i>
                                </button>
                                <div v-show="activeFaq === index"
                                    class="px-5 pb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed animate-fade-in">
                                    {{ faq.answer }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Map Section -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none p-2 h-80 border border-transparent dark:border-gray-700">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.4275425111296!2d108.18603187583106!3d16.04328864013049!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142197539244d27%3A0x98059ce4eb00cc95!2zNTMgxJAuIFBo4bqhbSBOZ-G7jWMgTeG6rXUsIEFuIEtow6osIFRoYW5oIEtow6osIMSQw6AgTuG6tW5nLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1766401819853!5m2!1svi!2s"
                            width="600" height="450" style="border:0;" allowfullscreen loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
    opacity: 0;
}

:deep(.contact-country-select .el-select-v2__wrapper) {
    @apply pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-xl transition-all !important;
    height: auto !important;
    min-height: 52px !important;
}

:deep(.contact-country-select .el-select-v2__wrapper.is-focused) {
    @apply bg-white dark:bg-gray-600 border-indigo-500 ring-4 ring-indigo-500/10 !important;
}

:deep(.contact-country-select .el-select-v2__placeholder) {
    @apply text-gray-400 !important;
    left: 48px !important;
}

:deep(.contact-country-select .el-select-v2__input) {
    @apply text-gray-900 dark:text-white !important;
    margin-left: 36px !important;
}

:deep(.contact-country-select .el-select-v2__combobox-input) {
    padding-left: 0 !important;
}
</style>