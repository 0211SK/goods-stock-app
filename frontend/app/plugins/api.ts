export default defineNuxtPlugin(() => {
    const { token } = useAuth()
    const config = useRuntimeConfig()

    const api = $fetch.create({
        baseURL: config.public.apiBase,
        onRequest({ options }) {
            if (!token.value) return

            // options.headersはHeaders/配列/オブジェクトの可能性があるためHeadersに正規化
            const headers = new Headers(options.headers as HeadersInit | undefined)
            headers.set('Authorization', `Bearer ${token.value}`)
            options.headers = headers
        },
    })

    return { provide: { api } }
})
