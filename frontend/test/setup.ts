import { vi } from 'vitest'

// グローバル型定義の拡張
declare global {
    var useNuxtApp: any
    var useCookie: any
    var useRuntimeConfig: any
    var navigateTo: any
}

// Nuxtのグローバル関数をモック
; (global as any).useNuxtApp = vi.fn(() => ({
    $api: vi.fn(),
    $supabase: {
        auth: {
            signInWithPassword: vi.fn(),
            signOut: vi.fn(),
            getSession: vi.fn(),
        },
    },
}))

    ; (global as any).useCookie = vi.fn((key: string) => ({
        value: null,
    }))

    ; (global as any).useRuntimeConfig = vi.fn(() => ({
        public: {
            apiBase: 'http://localhost:8080',
        },
    }))

    ; (global as any).navigateTo = vi.fn()
    // Vueライフサイクルフックをモック
    ; (global as any).onMounted = vi.fn((cb) => cb && cb())
    ; (global as any).onBeforeUnmount = vi.fn()
    ; (global as any).onUnmounted = vi.fn()
    ; (global as any).useState = vi.fn((key, init) => {
        const value = init ? init() : null
        return { value }
    })
// process.serverのモック
if (typeof process === 'undefined') {
    ; (global as any).process = { server: false }
}
