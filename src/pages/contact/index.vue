<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useNotifications } from '@/composables/notifications'
import { useI18n } from 'vue-i18n'
import { useCountriesQuery } from '@/composables/useCountriesQuery'
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';
import { CONTACT_INFO } from '~/constants/contact';

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

const faqItems = computed(() => [
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
])

const activeFaq = ref<number | null>(0)
const toggleFaq = (index: number) => {
    activeFaq.value = activeFaq.value === index ? null : index
}

// Các kênh chat; số điện thoại hiển thị riêng ở khối hotline
const chatChannels = computed(() => [
    { key: 'zalo', link: 'https://zalo.me/84854242357', sub: t('contact.hours') },
    { key: 'viber', link: 'https://viber.click/84854242357', sub: t('contact.hours') },
    { key: 'line', link: 'https://line.me/ti/p/~84854242357', sub: t('contact.hours') },
    { key: 'whatsapp', link: 'https://wa.me/84854242357', sub: t('contact.instantResponse') },
    { key: 'messenger', link: 'https://m.me/61579936051310', sub: t('contact.fastSupport') },
    { key: 'kakaotalk', link: 'https://open.kakao.com/o/+84854242357', sub: 'KakaoTalk ID' },
])

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
    <div class="contact-page">
        <UiPageHero :eyebrow="t('contact.contactUs')" :title="t('contact.connect')"
            :emphasis="t('contact.yourJourney')" :intro="t('contact.desc')">
            <template #actions>
                <UiButton :href="CONTACT_INFO.phoneHref">{{ t('contact.quickInfo.call') }}</UiButton>
                <UiButton :href="`mailto:${CONTACT_INFO.email}`" variant="outline">
                    {{ t('contact.quickInfo.email') }}
                </UiButton>
            </template>
        </UiPageHero>

        <!-- Form + kênh liên hệ -->
        <section class="shell contact-main">
            <div class="contact-form-wrap">
                <UiSectionHeading :title="t('contact.sendUsAMessage')" :lead="t('contact.fillOut')" />

                <form class="contact-form" novalidate @submit.prevent="submit">
                    <UiField :label="t('contact.fullName')" :error="errors.fullName">
                        <template #default="{ id, describedBy, invalid }">
                            <input :id="id" v-model="form.fullName" type="text" class="ui-control"
                                autocomplete="name" placeholder="John Doe" :aria-describedby="describedBy"
                                :aria-invalid="invalid" @input="validateField('fullName')"
                                @blur="validateField('fullName')">
                        </template>
                    </UiField>

                    <UiField :label="t('contact.email')" :error="errors.email">
                        <template #default="{ id, describedBy, invalid }">
                            <input :id="id" v-model="form.email" type="email" class="ui-control"
                                autocomplete="email" placeholder="john@example.com" :aria-describedby="describedBy"
                                :aria-invalid="invalid" @input="validateField('email')" @blur="validateField('email')">
                        </template>
                    </UiField>

                    <UiField :label="t('contact.phone')" :error="errors.phone">
                        <template #default="{ id, describedBy, invalid }">
                            <input :id="id" v-model="form.phone" type="tel" class="ui-control" autocomplete="tel"
                                placeholder="+84 123 456 789" :aria-describedby="describedBy" :aria-invalid="invalid"
                                @input="validateField('phone')" @blur="validateField('phone')">
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

                    <UiField class="contact-form__wide" :label="t('contact.subject')" :error="errors.title">
                        <template #default="{ id, describedBy, invalid }">
                            <input :id="id" v-model="form.title" type="text" class="ui-control"
                                :placeholder="t('contact.howCanHelp')" :aria-describedby="describedBy"
                                :aria-invalid="invalid" @input="validateField('title')" @blur="validateField('title')">
                        </template>
                    </UiField>

                    <UiField class="contact-form__wide" :label="t('contact.message')" :error="errors.content">
                        <template #default="{ id, describedBy, invalid }">
                            <textarea :id="id" v-model="form.content" rows="5" class="ui-control"
                                :placeholder="t('contact.tellUsAboutYourTrip')" :aria-describedby="describedBy"
                                :aria-invalid="invalid" @input="validateField('content')"
                                @blur="validateField('content')"></textarea>
                        </template>
                    </UiField>

                    <div class="contact-form__wide">
                        <UiButton type="submit" :disabled="isSubmitting">
                            {{ isSubmitting ? t('contact.sendingMessage') : t('contact.sendMessage') }}
                        </UiButton>
                    </div>
                </form>
            </div>

            <aside class="contact-channels" aria-labelledby="contact-channels-title">
                <h2 id="contact-channels-title" class="contact-channels__title">{{ t('contact.channelsTitle') }}</h2>

                <dl class="contact-channels__direct">
                    <div>
                        <dt>{{ t('contact.quickInfo.call') }}</dt>
                        <dd>
                            <a :href="CONTACT_INFO.phoneHref" class="contact-channels__hotline">
                                {{ CONTACT_INFO.phoneIntl }}
                            </a>
                            <span class="contact-channels__sub">{{ t('contact.hours') }}</span>
                        </dd>
                    </div>
                    <div>
                        <dt>{{ t('contact.quickInfo.email') }}</dt>
                        <dd><a :href="`mailto:${CONTACT_INFO.email}`">{{ CONTACT_INFO.email }}</a></dd>
                    </div>
                    <div>
                        <dt>{{ t('contact.quickInfo.visit') }}</dt>
                        <dd>{{ CONTACT_INFO.address }}</dd>
                    </div>
                </dl>

                <ul class="contact-channels__chats" role="list">
                    <li v-for="channel in chatChannels" :key="channel.key">
                        <a :href="channel.link" target="_blank" rel="noopener noreferrer">
                            <span class="contact-channels__name">{{ t(`contact.quickInfo.${channel.key}`) }}</span>
                            <span class="contact-channels__sub">{{ channel.sub }}</span>
                            <span class="contact-channels__arrow" aria-hidden="true">↗</span>
                        </a>
                    </li>
                </ul>
            </aside>
        </section>

        <!-- FAQ + bản đồ -->
        <section class="shell contact-faq" aria-labelledby="contact-faq-title">
            <div>
                <UiSectionHeading id="contact-faq-title" :title="t('contact.faq')" />

                <div class="faq-list">
                    <div v-for="(faq, index) in faqItems" :key="index" class="faq-item">
                        <h3>
                            <button :id="`faq-trigger-${index}`" type="button" class="faq-item__trigger"
                                :aria-expanded="activeFaq === index" :aria-controls="`faq-panel-${index}`"
                                @click="toggleFaq(index)">
                                <span>{{ faq.question }}</span>
                                <span class="faq-item__sign" aria-hidden="true">{{ activeFaq === index ? '−' : '+'
                                    }}</span>
                            </button>
                        </h3>
                        <div v-show="activeFaq === index" :id="`faq-panel-${index}`" role="region"
                            :aria-labelledby="`faq-trigger-${index}`" class="faq-item__answer">
                            {{ faq.answer }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="contact-map">
                <iframe :src="CONTACT_INFO.mapEmbedUrl" :title="t('contact.mapTitle')" allowfullscreen loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </section>
    </div>
</template>

<style scoped>
.contact-main,
.contact-faq {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
    gap: var(--space-fluid-xl);
    align-items: start;
    padding-bottom: var(--section-space);
}

@media (min-width: 64rem) {
    .contact-main {
        grid-template-columns: 3fr 2fr;
    }
}

/* Form */
.contact-form {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
    gap: var(--space-6) var(--space-5);
    margin-top: var(--space-fluid-md);
}

.contact-form__wide {
    grid-column: 1 / -1;
}

/* Kênh liên hệ */
.contact-channels {
    padding-top: var(--space-2);
}

.contact-channels__title {
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--color-border-strong);
    font-family: var(--font-serif);
    font-size: var(--text-3xl);
    font-weight: var(--weight-regular);
}

.contact-channels__direct > div {
    padding-block: var(--space-5);
    border-bottom: 1px solid var(--color-border);
}

.contact-channels__direct dt {
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.contact-channels__direct dd {
    margin-top: 0.375rem;
    font-family: var(--font-serif);
    font-size: var(--text-xl);
    line-height: var(--leading-snug);
    overflow-wrap: anywhere;
}

.contact-channels__direct a {
    color: inherit;
    text-decoration: underline;
    text-decoration-color: var(--color-border);
    text-underline-offset: 0.2em;
}

.contact-channels__direct a:hover {
    text-decoration-color: var(--color-accent);
}

.contact-channels__hotline {
    display: block;
    font-size: var(--text-h3);
    font-variant-numeric: lining-nums;
}

.contact-channels__sub {
    display: block;
    margin-top: var(--space-1);
    color: var(--color-text-muted);
    font-family: var(--font-sans);
    font-size: var(--text-sm);
}

.contact-channels__chats a {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0 var(--space-4);
    align-items: baseline;
    padding-block: var(--space-4);
    border-bottom: 1px solid var(--color-border);
    color: var(--color-text);
    text-decoration: none;
}

.contact-channels__name {
    font-family: var(--font-serif);
    font-size: var(--text-xl);
    transition: color var(--transition-base);
}

.contact-channels__chats .contact-channels__sub {
    grid-column: 1;
    margin-top: 0;
}

.contact-channels__arrow {
    grid-row: 1 / span 2;
    grid-column: 2;
    align-self: center;
    color: var(--color-text-muted);
}

.contact-channels__chats a:hover .contact-channels__name,
.contact-channels__chats a:hover .contact-channels__arrow {
    color: var(--color-accent);
}

.contact-channels a:focus-visible,
.faq-item__trigger:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 3px;
}

/* FAQ */
.faq-list {
    margin-top: var(--space-fluid-md);
    border-top: 1px solid var(--color-border-strong);
}

.faq-item {
    border-bottom: 1px solid var(--color-border);
}

.faq-item__trigger {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-6);
    width: 100%;
    padding-block: var(--space-5);
    color: var(--color-text);
    font-family: var(--font-serif);
    font-size: var(--text-title);
    line-height: var(--leading-snug);
    text-align: left;
}

.faq-item__trigger:hover {
    color: var(--color-accent);
}

.faq-item__sign {
    flex-shrink: 0;
    color: var(--color-accent);
    font-family: var(--font-sans);
    font-size: var(--text-xl);
}

.faq-item__answer {
    padding-bottom: var(--space-6);
    max-width: 40rem;
    color: var(--color-text-muted);
    line-height: var(--leading-body);
}

/* Bản đồ */
.contact-map {
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--color-bg-subtle);
}

.contact-map iframe {
    width: 100%;
    height: 100%;
    border: 0;
}
</style>
