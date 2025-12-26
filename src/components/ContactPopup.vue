<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import { useNotifications } from '@/composables/notifications'
import { useI18n } from 'vue-i18n'
import { useCountriesQuery } from '@/composables/useCountriesQuery'
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';

const props = defineProps<{
    modelValue: boolean
    subject?: string
    message?: string
}>()

const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()
const { notify } = useNotifications()
const { data: countries, isLoading: isLoadingCountries } = useCountriesQuery()

const isOpen = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

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
        await $fetch('/api/contact', {
            method: 'POST',
            body: { ...form }
        })
        notify('success', t('contact.sendMailSuccess'))
        isOpen.value = false
        Object.assign(form, { fullName: '', email: '', phone: '', country: '', title: '', content: '' })
    } catch (e: any) {
        const errorMessage = e.data?.statusMessage || e.message || t('contact.form.error')
        notify('error', errorMessage)
    } finally {
        isSubmitting.value = false
    }
}

watch(() => props.modelValue, (val) => {
    if (val) {
        if (props.subject) form.title = props.subject
        if (props.message) form.content = props.message
    }
}, { immediate: true })

// Social platforms configuration

const socialPlatforms = [
    { name: 'Zalo', icon: 'bx bxs-chat', color: '#0068FF', link: `https://zalo.me/84854242357` },
    { name: 'WhatsApp', icon: 'bx bxl-whatsapp', color: '#25D366', link: `https://wa.me/84854242357` },
    { name: 'Messenger', icon: 'bx bxl-messenger', color: '#0084FF', link: `https://m.me/61579936051310` },
    { name: 'Viber', icon: 'bx bx-phone', color: '#7360F2', link: `viber://chat?number=+84854242357` },
    { name: 'Line', icon: 'bx bxs-message-rounded-dots', color: '#00C300', link: `https://line.me/ti/p/+84854242357` },
    { name: "Fanpage", icon: 'bx bxl-facebook', color: '#1877F2', link: `https://www.facebook.com/profile.php?id=61579936051310` },
    // { name: 'KakaoTalk', icon: 'bx bxs-conversation', color: '#FEE500', link: `https://open.kakao.com/o/+84854242357` }
]
</script>

<template>
    <el-dialog v-model="isOpen" width="900px" align-center destroy-on-close :show-close="false"
        class="contact-popup-dialog overflow-hidden rounded-[2rem] bg-transparent border-none">
        <template #default>
            <div
                class="relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/20 dark:border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
                <!-- Close Button -->
                <button @click="isOpen = false"
                    class="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all active:scale-95">
                    <i class='bx bx-x text-2xl'></i>
                </button>

                <!-- Left Panel: Social Channels -->
                <div
                    class="md:w-1/3 bg-zinc-50/50 dark:bg-zinc-800/30 p-8 border-r border-zinc-100 dark:border-zinc-800">
                    <div class="mb-8">
                        <h2 class="text-2xl font-black text-zinc-900 dark:text-white mb-2">{{ t('contact.connect') }}
                        </h2>
                        <p class="text-sm text-zinc-500">{{ t('contact.desc') }}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <a v-for="social in socialPlatforms" :key="social.name" :href="social.link" target="_blank"
                            class="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                            <div class="w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-transform group-hover:scale-110"
                                :style="{ backgroundColor: social.color + '10', color: social.color }">
                                <i v-if="!social.icon.startsWith('custom-')" :class="social.icon" class="text-2xl"></i>
                                <span v-else class="text-[10px] font-bold uppercase tracking-tighter">{{ social.name[0]
                                }}</span>
                            </div>
                            <span
                                class="text-[10px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                                {{ social.name }}
                            </span>
                        </a>
                    </div>

                    <div class="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                        <div class="flex items-center gap-4 text-zinc-600 dark:text-zinc-400">
                            <div
                                class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                                <i class='bx bxs-phone-call text-xl'></i>
                            </div>
                            <div>
                                <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Direct Call</p>
                                <p class="font-bold">+84854242357</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Panel: Email Form -->
                <div class="md:w-2/3 p-8 md:p-12">
                    <div class="mb-8">
                        <h2 class="text-2xl font-black text-zinc-900 dark:text-white mb-2">{{
                            t('contact.sendUsAMessage')
                            }}</h2>
                        <p class="text-sm text-zinc-500">{{ t('contact.fillOut') }}</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">{{
                                t('contact.fullName') }}</label>
                            <input v-model="form.fullName" type="text"
                                class="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white"
                                :placeholder="t('contact.form.placeholders.fullName')"
                                @blur="validateField('fullName')">
                        </div>
                        <div class="space-y-2">
                            <label class="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">{{
                                t('contact.email') }}</label>
                            <input v-model="form.email" type="email"
                                class="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white"
                                placeholder="example@mail.com" @blur="validateField('email')">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div class="space-y-2">
                            <label class="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">{{
                                t('contact.phone') }}</label>
                            <input v-model="form.phone" type="text"
                                class="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white"
                                :placeholder="t('contact.form.placeholders.phone')" @blur="validateField('phone')">
                        </div>
                        <div class="space-y-2">
                            <label class="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">{{
                                t('contact.country') }}</label>
                            <SearchableSelect class="dark:!bg-zinc-800/50" v-model="form.country"
                                @update:model-value="validateField('country')" @blur="validateField('country')"
                                :options="countryOptions" :placeholder="t('contact.yourCountry')"
                                :loading="isLoadingCountries" icon="bx bx-world" :has-error="!!errors.country" />
                            <p v-if="errors.country" class="text-red-500 text-xs ml-1 mt-1">{{ errors.country }}
                            </p>
                        </div>
                    </div>

                    <div class="mt-6 space-y-2">
                        <label class="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">{{
                            t('contact.subject') }}</label>
                        <input v-model="form.title" type="text"
                            class="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white"
                            :placeholder="t('contact.subject')" @blur="validateField('title')">
                    </div>

                    <div class="mt-6 space-y-2">
                        <label class="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">{{
                            t('contact.message') }}</label>
                        <textarea v-model="form.content" rows="4"
                            class="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white resize-none"
                            :placeholder="t('contact.tellUsAboutYourTrip')" @blur="validateField('content')"></textarea>
                    </div>

                    <button @click="submit" :disabled="isSubmitting"
                        class="w-full mt-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50">
                        <i v-if="isSubmitting" class='bx bx-loader-alt animate-spin'></i>
                        {{ isSubmitting ? t('contact.sendingMessage') : t('contact.sendMessage') }}
                    </button>
                </div>
            </div>
        </template>
    </el-dialog>
</template>

<style>
.contact-popup-dialog {
    padding: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
}

.contact-popup-dialog .el-dialog__header {
    display: none;
}

.custom-contact-select .el-input__wrapper {
    @apply rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border-none shadow-none px-4 py-2 !important;
}

.custom-contact-select .el-input__inner {
    @apply h-8 dark:text-white !important;
}

body.dark .el-select-dropdown__item {
    color: #cbd5e1;
}

body.dark .el-select-dropdown__item.hover,
body.dark .el-select-dropdown__item:hover {
    background-color: #334155;
}
</style>
