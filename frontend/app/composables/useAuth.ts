export const useAuth = () => {
    const token = useCookie<string | null>('access_token', {
        sameSite: 'lax',
    })

    const login = async (email: string, password: string) => {
        const config = useRuntimeConfig()

        const res = await $fetch<{ accessToken: string }>(`${config.public.apiBase}/api/auth/login`, {
            method: 'POST',
            body: { email, password },
        })

        token.value = res.accessToken
    }

    const logout = () => {
        token.value = null
    }

    return { token, login, logout }
}
