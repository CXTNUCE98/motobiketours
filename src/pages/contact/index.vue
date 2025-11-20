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
    else if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(form.email)) setError('email', 'Email không hợp lệ')
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
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Actual API call would go here
        // const res = await fetch('/api/contact', { ... })
        
        notify('success', 'Đã gửi yêu cầu thành công! Chúng tôi sẽ liên hệ lại sớm nhất.')
        Object.assign(form, { fullName: '', email: '', phone: '', country: '', title: '', content: '' })
        for (const k of Object.keys(errors) as (keyof ContactForm)[]) delete errors[k]
    } catch (e: any) {
        notify('error', 'Gửi thất bại, vui lòng thử lại')
    } finally {
        isSubmitting.value = false
    }
}

const faqItems = [
    {
        question: "How do I book a tour?",
        answer: "You can book a tour directly through our website by selecting your preferred tour and filling out the booking form. Alternatively, you can contact us via email or phone for personalized assistance."
    },
    {
        question: "What is included in the tour price?",
        answer: "Our tour prices typically include motorbike rental, fuel, guide fees, accommodation, and selected meals. Specific inclusions are detailed on each tour's page."
    },
    {
        question: "Do I need a driving license?",
        answer: "Yes, a valid international driving permit (IDP) or a Vietnamese driving license is required to operate a motorbike legally in Vietnam."
    },
    {
        question: "Can I customize my tour?",
        answer: "Absolutely! We specialize in tailor-made tours. Contact us with your preferences, and we'll design a unique itinerary just for you."
    }
]

const activeFaq = ref<number | null>(0)
const toggleFaq = (index: number) => {
    activeFaq.value = activeFaq.value === index ? null : index
}
</script>

<template>
    <div class="min-h-screen bg-gray-50 font-sans">
        <!-- Hero Section -->
        <div class="relative h-[500px] bg-gray-900 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 opacity-90"></div>
            <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-40"></div>
            
            <!-- Animated Shapes -->
            <div class="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div class="absolute top-20 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div class="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <div class="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-6 animate-fade-in-down">
                    <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    Available 24/7 for Support
                </div>
                <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight animate-fade-in-up">
                    Let's Start Your <br/>
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Adventure</span>
                </h1>
                <p class="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
                    Have questions about our tours or want to plan a custom trip? We're here to help you create unforgettable memories in Vietnam.
                </p>
            </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">
            <!-- Contact Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                <div v-for="(item, index) in [
                    { icon: 'bx-phone-call', title: 'Call Us', text: '(+84) 0903.579094', sub: 'Mon-Sun, 8am-8pm', color: 'text-blue-500', bg: 'bg-blue-50', href: 'tel:+84903579094' },
                    { icon: 'bx-envelope', title: 'Email Us', text: 'vietnamMotorbikeGroup@gmail.com', sub: 'Online Support', color: 'text-pink-500', bg: 'bg-pink-50', href: 'mailto:vietnamMotorbikeGroup@gmail.com' },
                    { icon: 'bx-map', title: 'Visit Us', text: '14 Nguyen Thi Thap St', sub: 'Danang, Vietnam', color: 'text-purple-500', bg: 'bg-purple-50', href: null },
                    { icon: 'bxl-whatsapp', title: 'WhatsApp', text: 'Chat with us', sub: 'Instant Response', color: 'text-green-500', bg: 'bg-green-50', href: 'https://wa.me/84903579094' }
                ]" :key="index" 
                class="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                @click="item.href ? null : null">
                    <component :is="item.href ? 'a' : 'div'" :href="item.href" :target="item.href?.startsWith('http') ? '_blank' : undefined" class="block h-full">
                        <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-colors duration-300', item.bg, item.color, 'group-hover:scale-110 group-hover:rotate-3 transition-transform']">
                            <i :class="['bx', item.icon]"></i>
                        </div>
                        <h3 class="text-lg font-bold text-gray-900 mb-1">{{ item.title }}</h3>
                        <p class="text-gray-600 font-medium mb-1 truncate" :title="item.text">{{ item.text }}</p>
                        <p class="text-sm text-gray-400">{{ item.sub }}</p>
                    </component>
                </div>
            </div>

            <div class="grid lg:grid-cols-12 gap-12">
                <!-- Contact Form -->
                <div class="lg:col-span-7">
                    <div class="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 md:p-10 border border-gray-100">
                        <div class="mb-8">
                            <h2 class="text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                            <p class="text-gray-500">Fill out the form below and we'll get back to you shortly.</p>
                        </div>

                        <form @submit.prevent="submit" class="space-y-6">
                            <div class="grid md:grid-cols-2 gap-6">
                                <div class="space-y-2">
                                    <label class="text-sm font-semibold text-gray-700">Full Name</label>
                                    <div class="relative">
                                        <input v-model="form.fullName" @input="clearError('fullName')" type="text" 
                                            :class="['w-full pl-10 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500/20 transition-all outline-none', errors.fullName ? 'border-red-500' : 'border-gray-200 focus:border-purple-500']"
                                            placeholder="John Doe">
                                        <i class='bx bx-user absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xl'></i>
                                    </div>
                                    <span v-if="errors.fullName" class="text-xs text-red-500 font-medium ml-1">{{ errors.fullName }}</span>
                                </div>
                                <div class="space-y-2">
                                    <label class="text-sm font-semibold text-gray-700">Email Address</label>
                                    <div class="relative">
                                        <input v-model="form.email" @input="clearError('email')" type="email" 
                                            :class="['w-full pl-10 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500/20 transition-all outline-none', errors.email ? 'border-red-500' : 'border-gray-200 focus:border-purple-500']"
                                            placeholder="john@example.com">
                                        <i class='bx bx-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xl'></i>
                                    </div>
                                    <span v-if="errors.email" class="text-xs text-red-500 font-medium ml-1">{{ errors.email }}</span>
                                </div>
                            </div>

                            <div class="grid md:grid-cols-2 gap-6">
                                <div class="space-y-2">
                                    <label class="text-sm font-semibold text-gray-700">Phone Number</label>
                                    <div class="relative">
                                        <input v-model="form.phone" type="tel" 
                                            class="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                                            placeholder="+1 (555) 000-0000">
                                        <i class='bx bx-phone absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xl'></i>
                                    </div>
                                </div>
                                <div class="space-y-2">
                                    <label class="text-sm font-semibold text-gray-700">Country</label>
                                    <div class="relative">
                                        <input v-model="form.country" type="text" 
                                            class="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                                            placeholder="Your Country">
                                        <i class='bx bx-world absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xl'></i>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-2">
                                <label class="text-sm font-semibold text-gray-700">Subject</label>
                                <div class="relative">
                                    <input v-model="form.title" @input="clearError('title')" type="text" 
                                        :class="['w-full pl-10 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500/20 transition-all outline-none', errors.title ? 'border-red-500' : 'border-gray-200 focus:border-purple-500']"
                                        placeholder="How can we help you?">
                                    <i class='bx bx-edit absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xl'></i>
                                </div>
                                <span v-if="errors.title" class="text-xs text-red-500 font-medium ml-1">{{ errors.title }}</span>
                            </div>

                            <div class="space-y-2">
                                <label class="text-sm font-semibold text-gray-700">Message</label>
                                <div class="relative">
                                    <textarea v-model="form.content" @input="clearError('content')" rows="5" 
                                        :class="['w-full p-4 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500/20 transition-all outline-none resize-none', errors.content ? 'border-red-500' : 'border-gray-200 focus:border-purple-500']"
                                        placeholder="Tell us more about your inquiry..."></textarea>
                                </div>
                                <span v-if="errors.content" class="text-xs text-red-500 font-medium ml-1">{{ errors.content }}</span>
                            </div>

                            <button type="submit" :disabled="isSubmitting" 
                                class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2">
                                <i v-if="isSubmitting" class='bx bx-loader-alt bx-spin text-xl'></i>
                                <span>{{ isSubmitting ? 'Sending Message...' : 'Send Message' }}</span>
                                <i v-if="!isSubmitting" class='bx bx-send text-xl'></i>
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Info & Map -->
                <div class="lg:col-span-5 space-y-8">
                    <!-- Map Card -->
                    <div class="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 h-[400px] relative group">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.232470490061!2d108.18688087602543!3d16.050919984619493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219db9d1c0a49%3A0x3c7d3a9b1f4d8f0!2sNguyen%20Thi%20Thap%2C%20Thanh%20Khe%2C%20Da%20Nang!5e0!3m2!1sen!2svi!4v1730720000000!5m2!1sen!2svi"
                            class="w-full h-full border-0 grayscale group-hover:grayscale-0 transition-all duration-700"
                            allowfullscreen 
                            loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade">
                        </iframe>
                        <div class="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50">
                            <div class="flex items-start gap-3">
                                <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 shrink-0">
                                    <i class='bx bxs-map text-xl'></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-gray-900">Our Location</h4>
                                    <p class="text-sm text-gray-600">14 Nguyen Thi Thap St, Danang, Vietnam</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- FAQ Section -->
                    <div class="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
                        <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <i class='bx bx-help-circle text-purple-600'></i>
                            Frequently Asked Questions
                        </h3>
                        <div class="space-y-4">
                            <div v-for="(faq, index) in faqItems" :key="index" 
                                class="border border-gray-100 rounded-xl overflow-hidden transition-all duration-300"
                                :class="activeFaq === index ? 'bg-purple-50 border-purple-100' : 'hover:bg-gray-50'">
                                <button @click="toggleFaq(index)" class="w-full px-5 py-4 flex items-center justify-between text-left">
                                    <span class="font-semibold text-gray-800 text-sm">{{ faq.question }}</span>
                                    <i :class="['bx bx-chevron-down text-xl transition-transform duration-300 text-gray-400', activeFaq === index ? 'rotate-180 text-purple-600' : '']"></i>
                                </button>
                                <div v-show="activeFaq === index" class="px-5 pb-4 text-sm text-gray-600 animate-fade-in">
                                    {{ faq.answer }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-blob {
    animation: blob 7s infinite;
}
.animation-delay-2000 {
    animation-delay: 2s;
}
.animation-delay-4000 {
    animation-delay: 4s;
}
@keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
}
.animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
    opacity: 0;
    transform: translateY(20px);
}
.animate-fade-in-down {
    animation: fadeInDown 0.8s ease-out forwards;
    opacity: 0;
    transform: translateY(-20px);
}
@keyframes fadeInUp {
    to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInDown {
    to { opacity: 1; transform: translateY(0); }
}
</style>