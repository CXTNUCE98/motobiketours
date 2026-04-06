import { VueQueryPlugin, QueryClient, hydrate, dehydrate } from '@tanstack/vue-query'
import type { NuxtApp } from '#app'

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60_000, // 60s — match BE cache TTL
            },
        },
    })

    nuxtApp.vueApp.use(VueQueryPlugin, {
        queryClient,
    })
})
