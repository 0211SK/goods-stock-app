import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    const { setToken } = useAuth()  // トークンを更新する関数

    const supabase = createClient(
        config.public.supabaseUrl,
        config.public.supabaseAnonKey,
        {
            auth: {
                autoRefreshToken: true,  // 自動リフレッシュを有効化
                persistSession: true,     // セッションを永続化
                detectSessionInUrl: true
            }
        }
    )

    // セッション状態の監視
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'TOKEN_REFRESHED') {
            console.log('トークンがリフレッシュされました')
            // ★重要: リフレッシュされたトークンをuseAuthに反映
            if (session?.access_token) {
                setToken(session.access_token)
            }
        } else if (event === 'SIGNED_OUT') {
            console.log('ログアウトしました')
        }
    })

    return {
        provide: {
            supabase
        }
    }
})
