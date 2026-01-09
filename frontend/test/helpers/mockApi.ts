import { vi } from 'vitest'

/**
 * API呼び出しのモックヘルパー
 */
export const createMockApi = () => {
    return vi.fn()
}

/**
 * 成功レスポンスを返すAPIモックを作成
 */
export const mockApiSuccess = <T>(data: T) => {
    return vi.fn().mockResolvedValue(data)
}

/**
 * エラーレスポンスを返すAPIモックを作成
 */
export const mockApiError = (message: string = 'API Error', statusCode: number = 500) => {
    const error = new Error(message) as any
    error.data = { message }
    error.statusCode = statusCode
    return vi.fn().mockRejectedValue(error)
}

/**
 * Nuxt Appのモックを作成
 */
export const mockNuxtApp = (apiMock?: any) => {
    return {
        $api: apiMock || vi.fn(),
        $supabase: {
            auth: {
                signInWithPassword: vi.fn(),
                signOut: vi.fn(),
                getSession: vi.fn(),
            },
        },
    }
}
