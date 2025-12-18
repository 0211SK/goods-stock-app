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
    }

    const syncSessionToCookie = async () => {
        // SSRではSupabaseクライアントが存在しないため何もしない
        if (process.server) return

        const { $supabase } = useNuxtApp() as any
        const { data } = await $supabase.auth.getSession()
        token.value = data.session?.access_token ?? null
    }


    return { token, login, logout, syncSessionToCookie }
}
