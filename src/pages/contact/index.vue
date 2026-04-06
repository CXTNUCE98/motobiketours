<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useNotifications } from '@/composables/notifications'
import { useI18n } from 'vue-i18n'
import { useCountriesQuery } from '@/composables/useCountriesQuery'
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';

const { t } = useI18n()
const route = useRoute()
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
        console.log('Mail submit error:', e)
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

const contactMethods = [
    {
        key: 'call',
        icon: 'bx bx-phone-call',
        color: 'text-blue-500',
        bgColor: 'bg-blue-50 dark:bg-blue-900/30',
        shadow: 'shadow-blue-500/10',
        link: 'tel:+84854242357',
        value: '+84854.242.357',
        sub: 'Mon-Sun, 8am-8pm'
    },
    {
        key: 'zalo',
        icon: 'bx bxs-chat',
        color: 'text-sky-500',
        bgColor: 'bg-sky-50 dark:bg-sky-900/30',
        borderColor: 'bg-sky-500',
        shadow: 'shadow-sky-500/10',
        link: 'https://zalo.me/84854242357',
        value: t('contact.chatWithUs'),
        sub: 'Mon-Sun, 8am-8pm'
    },
    {
        key: 'viber',
        icon: 'bx bx-phone-call',
        color: 'text-purple-500',
        bgColor: 'bg-purple-50 dark:bg-purple-900/30',
        borderColor: 'bg-purple-500',
        shadow: 'shadow-purple-500/10',
        link: 'https://viber.click/84854242357',
        value: t('contact.chatWithUs'),
        sub: 'Mon-Sun, 8am-8pm'
    },
    {
        key: 'line',
        icon: 'bx bx-phone',
        color: 'text-green-500',
        bgColor: 'bg-green-50 dark:bg-green-900/30',
        borderColor: 'bg-green-500',
        shadow: 'shadow-green-500/10',
        link: 'https://line.me/ti/p/~84854242357',
        value: t('contact.chatWithUs'),
        sub: 'Mon-Sun, 8am-8pm'
    },
    {
        key: 'whatsapp',
        icon: 'bx bxl-whatsapp',
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-50 dark:bg-emerald-900/30',
        borderColor: 'bg-emerald-500',
        shadow: 'shadow-emerald-500/10',
        link: 'https://wa.me/84854242357',
        value: t('contact.chatWithUs'),
        sub: t('contact.instantResponse')
    },
    {
        key: 'messenger',
        icon: 'bx bxl-messenger',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 dark:bg-blue-900/30',
        borderColor: 'bg-blue-600',
        shadow: 'shadow-blue-600/10',
        link: 'https://m.me/61579936051310',
        value: t('contact.chatWithUs'),
        sub: t('contact.fastSupport')
    },
    {
        key: 'kakaotalk',
        icon: 'bx bxs-conversation',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
        borderColor: 'bg-yellow-500',
        shadow: 'shadow-yellow-500/10',
        link: 'https://open.kakao.com/o/+84854242357',
        value: t('contact.chatWithUs'),
        sub: 'KakaoTalk ID'
    }
]

onMounted(() => {
    if (route.query.subject) {
        form.title = route.query.subject as string
    }
    if (route.query.message) {
        form.content = route.query.message as string
    }
})
</script>

<template>
    <div
        class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <!-- Hero Section -->
        <div class="relative py-28 md:py-36 overflow-hidden">
            <!-- Background -->
            <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
                <!-- Subtle geometric pattern -->
                <div class="absolute inset-0 opacity-[0.03]"
                    style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;1&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
                <!-- Soft glow accents -->
                <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]"></div>
                <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-[128px]"></div>
            </div>

            <!-- Content -->
            <div class="container mx-auto px-4 relative z-10">
                <div class="max-w-3xl mx-auto text-center">
                    <!-- Badge -->
                    <div
                        class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-blue-300 text-sm font-semibold mb-8 hero-animate">
                        <span class="relative flex h-2 w-2">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
                        </span>
                        {{ t('contact.contactUs') }}
                    </div>

                    <h1 class="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight hero-animate-delay-1">
                        <span class="block text-white">{{ t('contact.connect') }}</span>
                        <span class="block bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                            {{ t('contact.yourJourney') }}
                        </span>
                    </h1>

                    <p class="text-lg text-slate-300/80 max-w-xl mx-auto leading-relaxed hero-animate-delay-2">
                        {{ t('contact.desc') }}
                    </p>
                </div>
            </div>

            <!-- Bottom wave -->
            <div class="absolute bottom-0 left-0 right-0 pointer-events-none">
                <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
                    <path d="M0 80L48 72C96 64 192 48 288 40C384 32 480 32 576 36C672 40 768 48 864 52C960 56 1056 56 1152 52C1248 48 1344 40 1392 36L1440 32V80H0Z"
                        class="fill-gray-50 dark:fill-gray-900 transition-colors duration-300" />
                </svg>
            </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20 pb-20">
            <!-- Contact Methods Section -->
            <div class="mb-16">

                <!-- Hotline Hero Card -->
                <a href="tel:+84854242357"
                    class="group relative block mb-8 overflow-hidden rounded-3xl">
                    <!-- Animated gradient border -->
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-[2px] animate-gradient-shift">
                        <div class="absolute inset-[2px] bg-white dark:bg-gray-900 rounded-[22px]"></div>
                    </div>
                    <div class="relative flex flex-col sm:flex-row items-center gap-6 px-8 py-7">
                        <!-- Animated phone icon -->
                        <div class="relative">
                            <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                            <div class="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <i class="bx bx-phone-call text-3xl text-white group-hover:animate-bounce"></i>
                            </div>
                        </div>
                        <!-- Info -->
                        <div class="text-center sm:text-left flex-1">
                            <p class="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">{{ t('contact.quickInfo.call') }}</p>
                            <p class="text-3xl font-black text-gray-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">+84 854.242.357</p>
                        </div>
                        <!-- Status badge -->
                        <div class="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full px-5 py-2.5">
                            <span class="relative flex h-2.5 w-2.5">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                            </span>
                            <span class="text-green-700 dark:text-green-400 text-sm font-semibold whitespace-nowrap">Mon-Sun, 8am-8pm</span>
                        </div>
                    </div>
                </a>

                <!-- Chat Platform Grid -->
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                    <a v-for="method in contactMethods.filter(m => m.key !== 'call')" :key="method.key"
                        :href="method.link" target="_blank" rel="noopener noreferrer"
                        class="contact-card group relative bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-md hover:shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-400 hover:-translate-y-2 flex flex-col items-center text-center overflow-hidden">

                        <!-- Hover gradient background -->
                        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl"
                            :class="method.bgColor"></div>

                        <!-- Icon with glow -->
                        <div class="relative mb-4">
                            <div class="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-400"
                                :class="method.bgColor"></div>
                            <div :class="['relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-400 group-hover:scale-110 group-hover:shadow-lg', method.bgColor]">
                                <i :class="[method.icon, 'text-3xl transition-transform duration-300 group-hover:scale-110', method.color]"></i>
                            </div>
                        </div>

                        <!-- Platform name -->
                        <h3 class="relative text-base font-bold text-gray-800 dark:text-white mb-1.5 transition-colors">
                            {{ t(`contact.quickInfo.${method.key}`) }}
                        </h3>

                        <!-- Subtitle -->
                        <p class="relative text-xs text-gray-400 dark:text-gray-500 font-medium">
                            {{ method.sub }}
                        </p>

                        <!-- Bottom accent line -->
                        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 group-hover:w-2/3 transition-all duration-400 rounded-full"
                            :class="method.borderColor"></div>
                    </a>
                </div>
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
                        class="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-none p-2 h-80 border border-transparent dark:border-gray-700">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.4275425111296!2d108.18603187583106!3d16.04328864013049!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142197539244d27%3A0x98059ce4eb00cc95!2zNTMgxJAuIFBo4bqhbSBOZ-G7jWMgTeG6rXUsIEFuIEtow6osIFRoYW5oIEtow6osIMSQw6AgTuG6tW5nLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1766401819853!5m2!1svi!2s"
                            width="100%" height="100%" style="border:0;" allowfullscreen loading="lazy"
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

@keyframes gradient-shift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
}

.animate-gradient-shift {
    background-size: 200% 200%;
    animation: gradient-shift 3s ease infinite;
}

.contact-card {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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