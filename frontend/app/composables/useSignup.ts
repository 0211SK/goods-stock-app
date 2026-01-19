
import { ref } from 'vue'

interface SignupRequest {
    email: string
    password: string
}

interface SignupResponse {
    user: any | null
    session: any | null
}

interface SignupError {
    errorCode: string
    message: string
}

export function useSignup() {
    const loading = ref(false)
    const error = ref<SignupError | null>(null)
    const response = ref<SignupResponse | null>(null)

    const signup = async (payload: SignupRequest) => {
        loading.value = true
        error.value = null
        response.value = null
        try {
            // Supabase認証で新規ユーザー登録
            const { $supabase } = useNuxtApp() as any
            const { data, error: signupError } = await $supabase.auth.signUp({
                email: payload.email,
                password: payload.password
            })
            if (signupError) {
                error.value = { errorCode: signupError.status || 'SIGNUP_ERROR', message: signupError.message }
                return
            }
            response.value = data
        } catch (e: any) {
            error.value = { errorCode: 'NETWORK_ERROR', message: '通信エラーが発生しました' }
        } finally {
            loading.value = false
        }
    }

    return { signup, loading, error, response }
}
