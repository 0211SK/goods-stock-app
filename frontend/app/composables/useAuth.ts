export const useAuth = () => {
    const token = useCookie<string | null>('access_token', { sameSite: 'lax' })
    const { $supabase } = useNuxtApp() as any

    const login = async (email: string, password: string) => {
        const { data, error } = await $supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        token.value = data.session?.access_token ?? null
    }

    const logout = async () => {
        await $supabase.auth.signOut()
        token.value = null
        // ログアウト時にキャッシュクリア
        localStorage.clear()
        sessionStorage.clear()
    }

    const syncSessionToCookie = async () => {
        // SSRではSupabaseクライアントが存在しないため何もしない
        if (process.server) return

        const { $supabase } = useNuxtApp() as any
        const { data } = await $supabase.auth.getSession()
        token.value = data.session?.access_token ?? null
    }


    const setToken = (newToken: string | null) => {
        token.value = newToken
    }

    // トークンリフレッシュ関数
    const refreshToken = async () => {
        if (process.server) return
        const { $supabase } = useNuxtApp() as any
        // セッションをリフレッシュ
        const { data, error } = await $supabase.auth.refreshSession()
        if (error) throw error
        token.value = data.session?.access_token ?? null
    }


    return { token, login, logout, syncSessionToCookie, setToken, refreshToken }
}
