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

        // 5xx系のサーバーエラーはリトライ対象
        const status = error.response?.status
        if (status && status >= 500 && status < 600) return true

        // 429 (Too Many Requests) もリトライ対象
        if (status === 429) return true

        return false
    }

    /**
     * 指数バックオフでリトライを実行
     */
    const fetchWithRetry = async (url: string, options: any, retries = 3) => {
        for (let i = 0; i < retries; i++) {
            try {
                return await $fetch(url, options)
            } catch (error: any) {
                // 最後の試行でエラーの場合は例外をスロー
                if (i === retries - 1) throw error

                // リトライ可能なエラーでない場合は即座にスロー
                if (!isRetryableError(error)) throw error

                // 指数バックオフで待機 (100ms, 200ms, 400ms...)
                const delay = Math.min(1000, 100 * Math.pow(2, i))
                await new Promise(resolve => setTimeout(resolve, delay))

                console.log(`Retrying request (${i + 1}/${retries - 1})...`)
            }
        }
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
            // 401エラーの場合、セッションタイムアウトをチェック
            if (response.status === 401) {
                try {
                    const errorData = response._data

                    // SESSION_TIMEOUTエラーの場合
                    if (errorData?.errorCode === 'SESSION_TIMEOUT') {
                        // ログアウト処理
                        await logout()

                        // ユーザーに通知
                        alert('セッションがタイムアウトしました。再度ログインしてください。')

                        // ログインページへリダイレクト
                        await router.push('/login')
                        return
                    }

                    // その他の401エラー（認証エラー）もログインページへ
                    await logout()
                    await router.push('/login')
                } catch (e) {
                    console.error('Session timeout handling error:', e)
                }
            }
        },
    })

    return { provide: { api } }
})
