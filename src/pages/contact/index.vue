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
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-16">
        <!-- Hero Section -->
        <div class="relative bg-gradient-to-r from-purple-600 via-purple-700 to-pink-500 overflow-hidden">
            <div class="hero-pattern absolute inset-0 animate-hero-pattern opacity-5"></div>
            
            <div class="relative z-10 max-w-4xl mx-auto px-4 py-20 text-center">
                <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-white text-sm font-medium mb-6 border border-white/30 animate-fade-in-down">
                    <i class='bx bx-envelope text-lg'></i>
                    <span>Get In Touch</span>
                </div>
                
                <h1 class="text-5xl md:text-6xl font-extrabold text-white mb-4 animate-fade-in-up">
                    <span class="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">Contact</span> Us
                </h1>
                
                <p class="text-xl text-white/95 animate-fade-in-up-delay">
                    Let's create your perfect Vietnam motorbike adventure together
                </p>
            </div>
            
            <!-- Floating Circles -->
            <div class="absolute w-72 h-72 bg-white/10 rounded-full -top-36 -right-24 backdrop-blur-sm animate-float"></div>
            <div class="absolute w-48 h-48 bg-white/10 rounded-full -bottom-24 -left-12 backdrop-blur-sm animate-float-slow"></div>
            <div class="absolute w-36 h-36 bg-white/10 rounded-full top-1/2 right-[10%] backdrop-blur-sm animate-float-slower"></div>
        </div>

        <div class="max-w-7xl mx-auto px-4 -mt-8">
            <!-- Quick Contact Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <a href="tel:+84903579094" class="group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div class="relative">
                        <div class="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                            <i class='bx bxs-phone-call'></i>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800 mb-1">Call Us</h3>
                        <p class="text-gray-600 text-sm mb-1">(+84) 0903.579094</p>
                        <span class="text-xs text-gray-500 font-medium">Mr Quang</span>
                    </div>
                </a>

                <a href="mailto:vietnamMotorbikeGroup@gmail.com" class="group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div class="relative">
                        <div class="w-14 h-14 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                            <i class='bx bxs-envelope'></i>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800 mb-1">Email Us</h3>
                        <p class="text-gray-600 text-sm mb-1 break-words">vietnamMotorbikeGroup@gmail.com</p>
                        <span class="text-xs text-gray-500 font-medium">Quick Response</span>
                    </div>
                </a>

                <div class="group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div class="relative">
                        <div class="w-14 h-14 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                            <i class='bx bxs-map'></i>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800 mb-1">Visit Us</h3>
                        <p class="text-gray-600 text-sm mb-1">14 Nguyen Thi Thap St</p>
                        <span class="text-xs text-gray-500 font-medium">Danang, Vietnam</span>
                    </div>
                </div>

                <a href="https://motobiketours.vercel.app" target="_blank" rel="noopener" class="group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div class="relative">
                        <div class="w-14 h-14 bg-gradient-to-br from-green-400 to-teal-400 rounded-2xl flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                            <i class='bx bx-globe'></i>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800 mb-1">Website</h3>
                        <p class="text-gray-600 text-sm mb-1">motobiketours.vercel.app</p>
                        <span class="text-xs text-gray-500 font-medium">Explore More</span>
                    </div>
                </a>
            </div>

            <!-- Main Content -->
            <div class="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 mb-12">
                <!-- Contact Form -->
                <div class="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50">
                    <div class="flex items-center gap-4 mb-8">
                        <div class="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center text-white text-2xl">
                            <i class='bx bx-message-square-dots'></i>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800">Send Us a Message</h2>
                            <p class="text-sm text-gray-600">We'll respond within 24 hours</p>
                        </div>
                    </div>

                    <form @submit.prevent="submit" class="space-y-6">
                        <div class="grid md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <i class='bx bx-user text-purple-600'></i>
                                    Full Name *
                                </label>
                                <input 
                                    v-model="form.fullName" 
                                    @input="clearError('fullName')" 
                                    type="text" 
                                    placeholder="John Doe"
                                    :class="['w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:-translate-y-0.5', 
                                             errors.fullName ? 'border-red-500' : 'border-gray-200 focus:border-purple-600 focus:shadow-lg focus:shadow-purple-100']"
                                />
                                <span v-if="errors.fullName" class="text-sm text-red-500 font-medium">{{ errors.fullName }}</span>
                            </div>

                            <div class="space-y-2">
                                <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <i class='bx bx-envelope text-purple-600'></i>
                                    Email *
                                </label>
                                <input 
                                    v-model="form.email" 
                                    @input="clearError('email')" 
                                    type="email" 
                                    placeholder="john@example.com"
                                    :class="['w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:-translate-y-0.5', 
                                             errors.email ? 'border-red-500' : 'border-gray-200 focus:border-purple-600 focus:shadow-lg focus:shadow-purple-100']"
                                />
                                <span v-if="errors.email" class="text-sm text-red-500 font-medium">{{ errors.email }}</span>
                            </div>
                        </div>

                        <div class="grid md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <i class='bx bx-phone text-purple-600'></i>
                                    Phone Number
                                </label>
                                <input 
                                    v-model="form.phone" 
                                    type="tel" 
                                    placeholder="+1 234 567 8900"
                                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-purple-600 focus:shadow-lg focus:shadow-purple-100 focus:-translate-y-0.5"
                                />
                            </div>

                            <div class="space-y-2">
                                <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <i class='bx bx-world text-purple-600'></i>
                                    Country
                                </label>
                                <input 
                                    v-model="form.country" 
                                    type="text" 
                                    placeholder="United States"
                                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-purple-600 focus:shadow-lg focus:shadow-purple-100 focus:-translate-y-0.5"
                                />
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <i class='bx bx-edit text-purple-600'></i>
                                Subject *
                            </label>
                            <input 
                                v-model="form.title" 
                                @input="clearError('title')" 
                                type="text" 
                                placeholder="Tour Inquiry"
                                :class="['w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:-translate-y-0.5', 
                                         errors.title ? 'border-red-500' : 'border-gray-200 focus:border-purple-600 focus:shadow-lg focus:shadow-purple-100']"
                            />
                            <span v-if="errors.title" class="text-sm text-red-500 font-medium">{{ errors.title }}</span>
                        </div>

                        <div class="space-y-2">
                            <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <i class='bx bx-message-detail text-purple-600'></i>
                                Your Message *
                            </label>
                            <textarea 
                                v-model="form.content" 
                                @input="clearError('content')" 
                                rows="6" 
                                placeholder="Tell us about your dream motorbike tour in Vietnam..."
                                :class="['w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:-translate-y-0.5 resize-y min-h-[120px]', 
                                         errors.content ? 'border-red-500' : 'border-gray-200 focus:border-purple-600 focus:shadow-lg focus:shadow-purple-100']"
                            ></textarea>
                            <span v-if="errors.content" class="text-sm text-red-500 font-medium">{{ errors.content }}</span>
                        </div>

                        <button 
                            type="submit" 
                            :disabled="isSubmitting" 
                            class="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-purple-300 hover:shadow-xl hover:shadow-purple-400 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <i :class="isSubmitting ? 'bx bx-loader-alt bx-spin text-xl' : 'bx bx-send text-xl'"></i>
                            <span>{{ isSubmitting ? 'Sending...' : 'Send Message' }}</span>
                        </button>
                    </form>
                </div>

                <!-- Info Section -->
                <div class="space-y-6">
                    <!-- Quote Card -->
                    <div class="relative bg-gradient-to-br from-purple-600 to-purple-800 p-8 rounded-2xl text-white overflow-hidden">
                        <i class='bx bxs-quote-alt-left text-6xl opacity-20 mb-4'></i>
                        <p class="relative z-10 text-lg italic leading-relaxed">
                            Come with us for the experience of a lifetime either as a rider or as a pillion passenger on one of our motorbikes!
                        </p>
                        <div class="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full"></div>
                    </div>

                    <!-- Social Media -->
                    <div class="bg-white p-6 rounded-2xl shadow-lg">
                        <h3 class="text-xl font-bold text-gray-800 mb-4 text-center">Follow Our Adventures</h3>
                        <div class="grid grid-cols-4 gap-3">
                            <a href="#" class="aspect-square bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center text-white text-2xl hover:-translate-y-1 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg">
                                <i class='bx bxl-facebook'></i>
                            </a>
                            <a href="#" class="aspect-square bg-gradient-to-br from-pink-500 via-red-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl hover:-translate-y-1 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg">
                                <i class='bx bxl-instagram'></i>
                            </a>
                            <a href="#" class="aspect-square bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center text-white text-2xl hover:-translate-y-1 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg">
                                <i class='bx bxl-youtube'></i>
                            </a>
                            <a href="#" class="aspect-square bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center text-white text-2xl hover:-translate-y-1 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg">
                                <i class='bx bx-map-alt'></i>
                            </a>
                        </div>
                    </div>

                    <!-- Map -->
                    <div class="bg-white rounded-2xl overflow-hidden shadow-lg">
                        <div class="bg-gradient-to-r from-cyan-400 to-cyan-600 px-6 py-4 flex items-center gap-3 text-white">
                            <i class='bx bxs-map text-2xl'></i>
                            <h3 class="text-lg font-semibold">Find Us Here</h3>
                        </div>
                        <div class="h-72">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.232470490061!2d108.18688087602543!3d16.050919984619493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219db9d1c0a49%3A0x3c7d3a9b1f4d8f0!2sNguyen%20Thi%20Thap%2C%20Thanh%20Khe%2C%20Da%20Nang!5e0!3m2!1sen!2svi!4v1730720000000!5m2!1sen!2svi"
                                width="100%" 
                                height="100%" 
                                style="border:0;" 
                                allowfullscreen 
                                loading="lazy"
                                referrerpolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>

                    <!-- Business Hours -->
                    <div class="bg-white rounded-2xl overflow-hidden shadow-lg">
                        <div class="bg-gradient-to-r from-pink-500 to-red-500 px-6 py-4 flex items-center gap-3 text-white">
                            <i class='bx bx-time-five text-2xl'></i>
                            <h3 class="text-lg font-semibold">Business Hours</h3>
                        </div>
                        <div class="p-6 space-y-4">
                            <div class="flex justify-between items-center pb-4 border-b border-gray-200">
                                <span class="text-gray-600">Monday - Friday</span>
                                <strong class="text-gray-800 font-semibold">8:00 AM - 8:00 PM</strong>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Saturday - Sunday</span>
                                <strong class="text-gray-800 font-semibold">9:00 AM - 6:00 PM</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Floating Action Buttons -->
        <div class="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
            <a href="https://wa.me/84903579094" target="_blank" title="Chat on WhatsApp" 
               class="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white text-2xl shadow-lg hover:shadow-xl hover:scale-110 hover:rotate-12 transition-all duration-300 animate-bounce-in">
                <i class='bx bxl-whatsapp'></i>
            </a>
            <a href="tel:+84903579094" title="Call Us" 
               class="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center text-white text-2xl shadow-lg hover:shadow-xl hover:scale-110 hover:rotate-12 transition-all duration-300 animate-bounce-in">
                <i class='bx bx-phone-call'></i>
            </a>
        </div>
    </div>
</template>

<style scoped>
.hero-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
</style>