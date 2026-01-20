
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAuth } from '../composables/useAuth'

// トークンがなければ自動でログイン画面にリダイレクト
export default defineNuxtRouteMiddleware(async (to) => {
    // ログイン・新規登録ページへのアクセスは許可
    if (to.path === '/login' || to.path === '/signup') return

    // サーバーサイドではチェックをスキップ（クライアント側で再度チェックされる）
    if (process.server) return

    const { token, syncSessionToCookie } = useAuth()

    // Cookieにtokenがない場合のみ、Supabaseのセッションから補完
    if (!token.value) {
        await syncSessionToCookie()
    }

    // それでもトークンがなければログイン画面へ
    if (!token.value) {
        console.log('No token found, redirecting to login')
        return navigateTo('/login', { replace: true })
    }
})
