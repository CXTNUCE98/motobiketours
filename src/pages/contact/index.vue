<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useNotifications } from '@/composables/notifications'

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

const validate = () => {
    for (const k of Object.keys(errors) as (keyof ContactForm)[]) delete errors[k]
    if (!form.fullName.trim()) setError('fullName', 'Vui lòng nhập họ tên')
    if (!form.email.trim()) setError('email', 'Vui lòng nhập email')
    else if (!/[^@\s]+@[^@\s]+\.[^@\s]+/.test(form.email)) setError('email', 'Email không hợp lệ')
    if (!form.title.trim()) setError('title', 'Vui lòng nhập tiêu đề')
    if (!form.content.trim()) setError('content', 'Vui lòng nhập nội dung')
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
        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form }),
        })
        if (!res.ok) throw new Error(await res.text())
        notify('success', 'Đã gửi yêu cầu thành công!')
        Object.assign(form, { fullName: '', email: '', phone: '', country: '', title: '', content: '' })
        for (const k of Object.keys(errors) as (keyof ContactForm)[]) delete errors[k]
    } catch (e: any) {
        notify('error', 'Gửi email thất bại, vui lòng thử lại')
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="grid md:grid-cols-2 gap-8">
            <div>
                <h1 class="text-2xl font-bold text-green-700 mb-4">Contact us</h1>
                <div class="space-y-2 text-sm leading-6">
                    <p><strong>Add:</strong> 14 Nguyen Thi Thap St, Thanh Khe Distr, Danang City, Vietnam</p>
                    <p><strong>Tel:</strong> (+84) 0903.579094 Mr Quang</p>
                    <p><strong>Email:</strong> vietnamMotorbikeGroup@gmail.com</p>
                    <p><strong>Website:</strong> <a class="text-green-700 underline" href="https://danangmotorbiketours.com" target="_blank" rel="noopener">danangmotorbiketours.com</a></p>
                </div>

                <p class="mt-6 italic text-rose-700 text-sm">
                    Come with us for the experience of a lifetime either as a rider or as a pillion passengers on one of our motorbikes!
                </p>

                <div class="mt-6 rounded-lg overflow-hidden shadow">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.232470490061!2d108.18688087602543!3d16.050919984619493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219db9d1c0a49%3A0x3c7d3a9b1f4d8f0!2sNguyen%20Thi%20Thap%2C%20Thanh%20Khe%2C%20Da%20Nang!5e0!3m2!1sen!2svi!4v1730720000000!5m2!1sen!2svi"
                        width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
            </div>

            <div>
                <h2 class="text-lg font-semibold mb-3">We are willing to organize your tours as per your request</h2>
                <div class="rounded-xl p-6 bg-white shadow border border-gray-100">
                    <div class="grid grid-cols-1 gap-4">
                        <div>
                            <input v-model="form.fullName" @input="clearError('fullName')" type="text" placeholder="Full Name" class="px-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-green-600" />
                            <p v-if="errors.fullName" class="mt-1 text-xs text-red-600">{{ errors.fullName }}</p>
                        </div>
                        <div>
                            <input v-model="form.email" @input="clearError('email')" type="email" placeholder="Email" class="px-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-green-600" />
                            <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
                        </div>
                        <input v-model="form.phone" type="tel" placeholder="Phone" class="px-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-green-600" />
                        <input v-model="form.country" type="text" placeholder="Country" class="px-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-green-600" />
                        <div>
                            <input v-model="form.title" @input="clearError('title')" type="text" placeholder="Title" class="px-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-green-600" />
                            <p v-if="errors.title" class="mt-1 text-xs text-red-600">{{ errors.title }}</p>
                        </div>
                        <div>
                            <textarea v-model="form.content" @input="clearError('content')" rows="5" placeholder="Content" class="px-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-green-600"></textarea>
                            <p v-if="errors.content" class="mt-1 text-xs text-red-600">{{ errors.content }}</p>
                        </div>
                        <div class="flex justify-end">
                            <button :disabled="isSubmitting" @click="submit" class="px-4 py-2 bg-green-700 text-white rounded disabled:opacity-60">{{ isSubmitting ? 'Sending...' : 'Send' }}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>


<style scoped>
</style>