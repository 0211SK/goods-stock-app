export default defineNuxtPlugin(() => {
    const { token, logout } = useAuth()
    const config = useRuntimeConfig()
    const router = useRouter()

    /**
     * リトライ可能なエラーかどうかを判定
     */
    const isRetryableError = (error: any) => {
        // ネットワークエラーやタイムアウトはリトライ対象
        if (error.name === 'AbortError') return false // キャンセルはリトライしない
        if (error.code === 'ERR_NETWORK') return true

        const status = error.response?.status

        // 401エラーはリトライしない（認証エラー）
        if (status === 401) return false

        // 5xx系のサーバーエラーはリトライ対象
        if (status && status >= 500 && status < 600) return true

        // 429 (Too Many Requests) もリトライ対象
        if (status === 429) return true

        return false
    }

    const api = $fetch.create({
        baseURL: config.public.apiBase,
        // タイムアウトを設定 (10秒)
        timeout: 10000,
        // リトライロジックを適用
        retry: 2,
        retryDelay: 100,
        onRequest({ options }) {
            if (!token.value) return

            // options.headersはHeaders/配列/オブジェクトの可能性があるためHeadersに正規化
            const headers = new Headers(options.headers as HeadersInit | undefined)
            headers.set('Authorization', `Bearer ${token.value}`)
            options.headers = headers
        },
        async onResponseError({ response }) {
            // 401エラーの場合、認証エラーとしてログアウト
            if (response.status === 401) {
                console.error('認証エラー: トークンが無効または期限切れです')

                // エラーメッセージを表示
                const errorData = response._data
                const message = errorData?.errorCode === 'SESSION_TIMEOUT'
                    ? 'セッションがタイムアウトしました。再度ログインしてください。'
                    : '認証の有効期限が切れました。再度ログインしてください。'

                // ログアウト処理
                await logout()

                // アラート表示
                alert(message)

                // ログインページへリダイレクト
                await router.push('/login')
            }
        },
    })

    return { provide: { api } }
})
