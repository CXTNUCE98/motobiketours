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
        <!-- Page Header -->
        <div class="text-center mb-8">
            <h1 class="text-4xl font-bold mb-2">
                <span class="text-gray-800">CONTACT </span>
                <span class="text-[#E91E63]">US</span>
            </h1>
            <p class="text-gray-600 text-lg">Get in touch with us for any inquiries</p>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
            <!-- Contact Info Section -->
            <div>
                <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <i class="bx bx-info-circle text-[#FF6B35] text-3xl"></i>
                        Contact Information
                    </h2>
                    <div class="space-y-3">
                        <div class="flex items-start gap-3 bg-[#f8f9fa] p-3 rounded-lg">
                            <span class="text-[#FFA726] font-semibold min-w-[70px]">Address:</span>
                            <p class="text-gray-700">14 Nguyen Thi Thap St, Thanh Khe District, Danang City, Vietnam</p>
                        </div>
                        <div class="flex items-start gap-3 bg-[#f8f9fa] p-3 rounded-lg">
                            <span class="text-[#FFA726] font-semibold min-w-[70px]">Tel:</span>
                            <a href="tel:+84903579094" class="text-[#FF6B35] hover:text-[#E91E63] font-semibold">
                                (+84) 0903.579094 Mr Quang
                            </a>
                        </div>
                        <div class="flex items-start gap-3 bg-[#f8f9fa] p-3 rounded-lg">
                            <span class="text-[#FFA726] font-semibold min-w-[70px]">Email:</span>
                            <a href="mailto:vietnamMotorbikeGroup@gmail.com" class="text-[#FF6B35] hover:text-[#E91E63] font-semibold">
                                vietnamMotorbikeGroup@gmail.com
                            </a>
                        </div>
                        <div class="flex items-start gap-3 bg-[#f8f9fa] p-3 rounded-lg">
                            <span class="text-[#FFA726] font-semibold min-w-[70px]">Website:</span>
                            <a class="text-[#FF6B35] hover:text-[#E91E63] font-semibold" href="https://danangmotorbiketours.com" target="_blank" rel="noopener">
                                danangmotorbiketours.com
                            </a>
                        </div>
                    </div>
                </div>

                <div class="bg-gradient-to-r from-[#FF6B35] to-[#E91E63] text-white p-5 rounded-xl shadow-lg mb-6">
                    <p class="italic text-lg">
                        Come with us for the experience of a lifetime either as a rider or as a pillion passenger on one of our motorbikes!
                    </p>
                </div>

                <div class="mt-6 rounded-lg overflow-hidden shadow">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.232470490061!2d108.18688087602543!3d16.050919984619493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219db9d1c0a49%3A0x3c7d3a9b1f4d8f0!2sNguyen%20Thi%20Thap%2C%20Thanh%20Khe%2C%20Da%20Nang!5e0!3m2!1sen!2svi!4v1730720000000!5m2!1sen!2svi"
                        width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
            </div>

            <!-- Contact Form Section -->
            <div>
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <i class="bx bx-message-square-dots text-[#E91E63] text-3xl"></i>
                        Send Us a Message
                    </h2>
                    <p class="text-gray-600 mb-6">We are willing to organize your tours as per your request</p>
                    
                    <div class="grid grid-cols-1 gap-5">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                            <input v-model="form.fullName" @input="clearError('fullName')" type="text" 
                                placeholder="Enter your full name" 
                                class="px-4 py-3 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:border-[#FF6B35] transition-colors duration-300" />
                            <p v-if="errors.fullName" class="mt-2 text-sm text-red-600">{{ errors.fullName }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                            <input v-model="form.email" @input="clearError('email')" type="email" 
                                placeholder="your@email.com" 
                                class="px-4 py-3 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:border-[#FF6B35] transition-colors duration-300" />
                            <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                            <input v-model="form.phone" type="tel" 
                                placeholder="Your phone number" 
                                class="px-4 py-3 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:border-[#FF6B35] transition-colors duration-300" />
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                            <input v-model="form.country" type="text" 
                                placeholder="Your country" 
                                class="px-4 py-3 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:border-[#FF6B35] transition-colors duration-300" />
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                            <input v-model="form.title" @input="clearError('title')" type="text" 
                                placeholder="Message title" 
                                class="px-4 py-3 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:border-[#FF6B35] transition-colors duration-300" />
                            <p v-if="errors.title" class="mt-2 text-sm text-red-600">{{ errors.title }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
                            <textarea v-model="form.content" @input="clearError('content')" rows="5" 
                                placeholder="Tell us about your tour requirements..." 
                                class="px-4 py-3 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:border-[#FF6B35] transition-colors duration-300"></textarea>
                            <p v-if="errors.content" class="mt-2 text-sm text-red-600">{{ errors.content }}</p>
                        </div>
                        <div class="flex justify-end">
                            <button :disabled="isSubmitting" @click="submit" 
                                class="bg-gradient-to-r from-[#FF6B35] to-[#E91E63] hover:from-[#E91E63] hover:to-[#FF6B35] text-white px-8 py-4 rounded-full font-bold disabled:opacity-60 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 uppercase tracking-wide">
                                {{ isSubmitting ? 'Sending...' : 'Send Message' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>


<style scoped>
</style>