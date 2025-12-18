// トークンがなければ自動でログイン画面にリダイレクト
export default defineNuxtRouteMiddleware(async (to) => {
    if (to.path === '/login') return

    const { token, syncSessionToCookie } = useAuth()

    // Cookieにtokenがない場合のみ、Supabaseのセッションから補完します
    if (!token.value) {
        await syncSessionToCookie()
    }

    if (!token.value) {
        return navigateTo('/login')
    }
})
