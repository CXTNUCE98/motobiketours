import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async (nuxtApp) => {
    // Only load on client-side
    if (process.client) {
        // Dynamic import for better code splitting
        const { QuillEditor } = await import('@vueup/vue-quill')
        await import('@vueup/vue-quill/dist/vue-quill.snow.css')

        nuxtApp.vueApp.component('QuillEditor', QuillEditor)
    }
})
