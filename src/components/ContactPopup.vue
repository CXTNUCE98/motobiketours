<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import { useNotifications } from '@/composables/notifications'
import { useI18n } from 'vue-i18n'
import { useCountriesQuery } from '@/composables/useCountriesQuery'
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';
import { CONTACT_INFO } from '~/constants/contact';

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

// Kênh chat nhanh; cùng danh mục với trang Liên hệ (contact.quickInfo.*)
const chatChannels = computed(() => [
    { key: 'zalo', link: 'https://zalo.me/84854242357' },
    { key: 'whatsapp', link: 'https://wa.me/84854242357' },
    { key: 'messenger', link: 'https://m.me/61579936051310' },
    { key: 'viber', link: 'https://viber.click/84854242357' },
    { key: 'line', link: 'https://line.me/ti/p/+84854242357' },
    { key: 'kakaotalk', link: 'https://open.kakao.com/o/+84854242357' },
    { key: 'fanpage', link: 'https://www.facebook.com/profile.php?id=61579936051310' },
])
</script>

<template>
    <el-dialog v-model="isOpen" width="900px" align-center destroy-on-close :show-close="false"
        class="contact-popup-dialog">
        <div class="contact-popup">
            <header class="contact-popup__head">
                <div>
                    <p class="contact-popup__eyebrow">{{ t('contact.contactUs') }}</p>
                    <h2 class="contact-popup__title">{{ t('contact.connect') }}</h2>
                    <p class="contact-popup__desc">{{ t('contact.desc') }}</p>
                </div>
                <button type="button" class="contact-popup__close" @click="isOpen = false">
                    {{ t('common.close') }}
                </button>
            </header>

            <div class="contact-popup__body">
                <aside class="contact-popup__channels" aria-labelledby="contact-popup-channels-title">
                    <h3 id="contact-popup-channels-title">{{ t('contact.channelsTitle') }}</h3>

                    <dl class="contact-popup__direct">
                        <dt>{{ t('contact.quickInfo.call') }}</dt>
                        <dd>
                            <a :href="CONTACT_INFO.phoneHref">{{ CONTACT_INFO.phoneIntl }}</a>
                            <span class="contact-popup__sub">{{ t('contact.hours') }}</span>
                        </dd>
                    </dl>

                    <ul class="contact-popup__chats" role="list">
                        <li v-for="channel in chatChannels" :key="channel.key">
                            <a :href="channel.link" target="_blank" rel="noopener noreferrer">
                                <span>{{ t(`contact.quickInfo.${channel.key}`) }}</span>
                                <span aria-hidden="true">↗</span>
                            </a>
                        </li>
                    </ul>
                </aside>

                <form class="contact-popup__form" novalidate @submit.prevent="submit">
                    <p class="contact-popup__lead">{{ t('contact.fillOut') }}</p>

                    <UiField :label="t('contact.fullName')" :error="errors.fullName">
                        <template #default="{ id, describedBy, invalid }">
                            <input :id="id" v-model="form.fullName" type="text" class="ui-control"
                                autocomplete="name" :placeholder="t('contact.form.placeholders.fullName')"
                                :aria-describedby="describedBy" :aria-invalid="invalid"
                                @input="validateField('fullName')" @blur="validateField('fullName')">
                        </template>
                    </UiField>

                    <UiField :label="t('contact.email')" :error="errors.email">
                        <template #default="{ id, describedBy, invalid }">
                            <input :id="id" v-model="form.email" type="email" class="ui-control" autocomplete="email"
                                placeholder="example@mail.com" :aria-describedby="describedBy" :aria-invalid="invalid"
                                @input="validateField('email')" @blur="validateField('email')">
                        </template>
                    </UiField>

                    <UiField :label="t('contact.phone')" :error="errors.phone">
                        <template #default="{ id, describedBy, invalid }">
                            <input :id="id" v-model="form.phone" type="tel" class="ui-control" autocomplete="tel"
                                :placeholder="t('contact.form.placeholders.phone')" :aria-describedby="describedBy"
                                :aria-invalid="invalid" @input="validateField('phone')" @blur="validateField('phone')">
                        </template>
                    </UiField>

                    <UiField :label="t('contact.country')" :error="errors.country">
                        <template #default="{ id }">
                            <SearchableSelect v-model="form.country" :input-id="id" :options="countryOptions"
                                :placeholder="t('contact.yourCountry')" :loading="isLoadingCountries"
                                :has-error="!!errors.country" @update:model-value="validateField('country')"
                                @blur="validateField('country')" />
                        </template>
                    </UiField>

                    <UiField class="contact-popup__wide" :label="t('contact.subject')" :error="errors.title">
                        <template #default="{ id, describedBy, invalid }">
                            <input :id="id" v-model="form.title" type="text" class="ui-control"
                                :placeholder="t('contact.howCanHelp')" :aria-describedby="describedBy"
                                :aria-invalid="invalid" @input="validateField('title')" @blur="validateField('title')">
                        </template>
                    </UiField>

                    <UiField class="contact-popup__wide" :label="t('contact.message')" :error="errors.content">
                        <template #default="{ id, describedBy, invalid }">
                            <textarea :id="id" v-model="form.content" rows="4" class="ui-control"
                                :placeholder="t('contact.tellUsAboutYourTrip')" :aria-describedby="describedBy"
                                :aria-invalid="invalid" @input="validateField('content')"
                                @blur="validateField('content')"></textarea>
                        </template>
                    </UiField>

                    <div class="contact-popup__wide">
                        <UiButton type="submit" block :disabled="isSubmitting">
                            {{ isSubmitting ? t('contact.sendingMessage') : t('contact.sendMessage') }}
                        </UiButton>
                    </div>
                </form>
            </div>
        </div>
    </el-dialog>
</template>

<style scoped>
.contact-popup-dialog :deep(.el-dialog) {
    overflow: hidden;
    border-radius: var(--radius-lg);
    background: var(--color-surface);
}

.contact-popup-dialog :deep(.el-dialog__header) {
    display: none;
}

.contact-popup-dialog :deep(.el-dialog__body) {
    max-height: 85vh;
    padding: 0;
    overflow-y: auto;
}

.contact-popup {
    padding: var(--space-fluid-md);
}

.contact-popup__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-4);
    padding-bottom: var(--space-5);
    margin-bottom: var(--space-fluid-md);
    border-bottom: 1px solid var(--color-border-strong);
}

.contact-popup__eyebrow {
    margin-bottom: var(--space-2);
    color: var(--color-accent);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.contact-popup__title {
    font-family: var(--font-serif);
    font-size: var(--text-h3);
    font-weight: var(--weight-regular);
    line-height: var(--leading-tight);
}

.contact-popup__desc {
    max-width: 32rem;
    margin-top: var(--space-2);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    line-height: var(--leading-body);
}

.contact-popup__close {
    flex-shrink: 0;
    min-height: 2.5rem;
    padding-inline: var(--space-2);
    color: var(--color-text);
    font-weight: var(--weight-medium);
    text-decoration: underline;
    text-decoration-color: var(--color-accent);
    text-underline-offset: 0.35em;
}

.contact-popup__close:hover {
    color: var(--color-accent);
}

.contact-popup__body {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
    gap: var(--space-fluid-xl);
    align-items: start;
}

.contact-popup__channels h3 {
    padding-bottom: var(--space-4);
    margin-bottom: var(--space-4);
    border-bottom: 1px solid var(--color-border);
    font-family: var(--font-serif);
    font-size: var(--text-xl);
    font-weight: var(--weight-regular);
}

.contact-popup__direct {
    padding-bottom: var(--space-4);
    margin-bottom: var(--space-2);
    border-bottom: 1px solid var(--color-border);
}

.contact-popup__direct dt {
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.contact-popup__direct dd {
    margin-top: 0.375rem;
}

.contact-popup__direct a {
    color: inherit;
    font-family: var(--font-serif);
    font-size: var(--text-lg);
    text-decoration: underline;
    text-decoration-color: var(--color-border);
    text-underline-offset: 0.2em;
}

.contact-popup__direct a:hover {
    text-decoration-color: var(--color-accent);
}

.contact-popup__sub {
    display: block;
    margin-top: var(--space-1);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.contact-popup__chats a {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-3);
    padding-block: var(--space-3);
    border-bottom: 1px solid var(--color-border);
    color: var(--color-text);
    font-family: var(--font-serif);
    font-size: var(--text-md);
    text-decoration: none;
    transition: color var(--transition-base);
}

.contact-popup__chats a:hover {
    color: var(--color-accent);
}

.contact-popup__lead {
    grid-column: 1 / -1;
    margin-bottom: var(--space-2);
    color: var(--color-text-muted);
}

.contact-popup__form {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 13rem), 1fr));
    align-content: start;
    gap: var(--space-5) var(--space-4);
}

.contact-popup__wide {
    grid-column: 1 / -1;
}

.contact-popup button:focus-visible,
.contact-popup a:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}

@media (max-width: 48rem) {
    .contact-popup__body {
        grid-template-columns: 1fr;
    }
}
</style>
