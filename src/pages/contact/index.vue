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
        await new Promise(resolve => setTimeout(resolve, 1500))
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
                        LIÊN HỆ VỚI CHÚNG TÔI
                    </div>

                    <h1 class="text-5xl md:text-7xl font-black mb-8 leading-tight animate-fade-in"
                        style="animation-delay: 0.2s">
                        <span class="block text-white">Kết Nối</span>
                        <span
                            class="block bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent filter drop-shadow-sm">
                            Hành Trình Của Bạn
                        </span>
                    </h1>

                    <p class="text-xl md:text-2xl mb-12 text-blue-100/80 max-w-2xl mx-auto leading-relaxed animate-fade-in"
                        style="animation-delay: 0.4s">
                        Bạn có câu hỏi hay muốn lên kế hoạch cho chuyến đi sắp tới? Đừng ngần ngại liên hệ, chúng tôi
                        luôn sẵn sàng hỗ trợ bạn.
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
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Call Us</h3>
                    <p class="text-gray-700 dark:text-gray-200 font-bold mb-1">0854.242.357 (Mr An)</p>
                    <p class="text-sm text-gray-400">Mon-Sun, 8am-8pm</p>
                </a>

                <!-- Email Us -->
                <a href="mailto:contact.andago@gmail.com"
                    class="group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl shadow-purple-500/5 border border-white dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                    <div
                        class="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                        <i class="bx bx-envelope text-2xl text-pink-500"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Email Us</h3>
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
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Visit Us</h3>
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
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">WhatsApp</h3>
                    <p class="text-gray-700 dark:text-gray-200 font-bold mb-1">Chat with us</p>
                    <p class="text-sm text-gray-400">Instant Response</p>
                </a>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                <!-- Contact Form -->
                <div class="lg:col-span-2">
                    <div
                        class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none p-8 md:p-10 border border-transparent dark:border-gray-700">
                        <div class="mb-10">
                            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Send us a Message</h2>
                            <p class="text-gray-600 dark:text-gray-300">Fill out the form below and our team will get
                                back to you within 24 hours.</p>
                        </div>

                        <form @submit.prevent="submit" class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-2">
                                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Full
                                        Name</label>
                                    <div class="relative">
                                        <i
                                            class="bx bx-user absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400"></i>
                                        <input v-model="form.fullName" @input="clearError('fullName')" type="text"
                                            class="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                            placeholder="John Doe"
                                            :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500/10': errors.fullName }">
                                    </div>
                                    <p v-if="errors.fullName" class="text-red-500 text-xs ml-1">{{ errors.fullName }}
                                    </p>
                                </div>

                                <div class="space-y-2">
                                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Email
                                        Address</label>
                                    <div class="relative">
                                        <i
                                            class="bx bx-envelope absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400"></i>
                                        <input v-model="form.email" @input="clearError('email')" type="email"
                                            class="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                            placeholder="john@example.com"
                                            :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500/10': errors.email }">
                                    </div>
                                    <p v-if="errors.email" class="text-red-500 text-xs ml-1">{{ errors.email }}</p>
                                </div>

                                <div class="space-y-2">
                                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Phone
                                        Number</label>
                                    <div class="relative">
                                        <i
                                            class="bx bx-phone absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400"></i>
                                        <input v-model="form.phone" type="tel"
                                            class="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                            placeholder="+84 123 456 789">
                                    </div>
                                </div>

                                <div class="space-y-2">
                                    <label
                                        class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Country</label>
                                    <div class="relative">
                                        <i
                                            class="bx bx-world absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400"></i>
                                        <input v-model="form.country" type="text"
                                            class="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                            placeholder="Your Country">
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-2">
                                <label
                                    class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Subject</label>
                                <div class="relative">
                                    <i
                                        class="bx bx-tag absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400"></i>
                                    <input v-model="form.title" @input="clearError('title')" type="text"
                                        class="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                        placeholder="How can we help you?"
                                        :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500/10': errors.title }">
                                </div>
                                <p v-if="errors.title" class="text-red-500 text-xs ml-1">{{ errors.title }}</p>
                            </div>

                            <div class="space-y-2">
                                <label
                                    class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Message</label>
                                <div class="relative">
                                    <i class="bx bx-message-detail absolute left-4 top-6 text-xl text-gray-400"></i>
                                    <textarea v-model="form.content" @input="clearError('content')" rows="5"
                                        class="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none text-gray-900 dark:text-white placeholder-gray-400"
                                        placeholder="Tell us about your trip plans..."
                                        :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500/10': errors.content }"></textarea>
                                </div>
                                <p v-if="errors.content" class="text-red-500 text-xs ml-1">{{ errors.content }}</p>
                            </div>

                            <button type="submit" :disabled="isSubmitting"
                                class="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                <i v-if="isSubmitting" class="bx bx-loader-alt animate-spin text-xl"></i>
                                <span>{{ isSubmitting ? 'Sending Message...' : 'Send Message' }}</span>
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
                            <i
                                class="bx bx-question-mark bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 p-1.5 rounded-lg"></i>
                            Common Questions
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
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.110435403624!2d108.2414633759036!3d16.05975803969183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142177f2ced6d8b%3A0xeac35f2960ca74a4!2zOTkgVMO0IEhp4bq_biBUaMOgbmgsIFBo4bqvYyBN4bu5LCBTxqFuIFRyw6AsIMSQw6AgTuG6tW5nIDU1MDAwMCwgVmlldG5hbQ!5e0!3m2!1sen!2s!4v1709955244444!5m2!1sen!2s"
                            class="w-full h-full rounded-2xl" style="border:0;" allowfullscreen="" loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade">
                        </iframe>
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
</style>