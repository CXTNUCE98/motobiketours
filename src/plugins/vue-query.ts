import { VueQueryPlugin, QueryClient, hydrate, dehydrate } from '@tanstack/vue-query'
import type { NuxtApp } from '#app'

export default defineNuxtPlugin(async (nuxtApp: NuxtApp) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60_000, // 60s — match BE cache TTL
            },
        },
    })

    // SSR: Dehydrate query cache into Nuxt payload after render
    if (process.server) {
        nuxtApp.hook('app:rendered', () => {
            nuxtApp.payload.vueQueryState = dehydrate(queryClient)
        })
    }

    // Client: Hydrate query cache from Nuxt payload
    if (process.client && nuxtApp.payload.vueQueryState) {
        hydrate(queryClient, nuxtApp.payload.vueQueryState)
    }

    nuxtApp.vueApp.use(VueQueryPlugin, {
        queryClient,
    })
})
