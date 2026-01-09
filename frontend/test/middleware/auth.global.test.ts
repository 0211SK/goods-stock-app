// グローバルにdefineNuxtRouteMiddlewareをモック（import前に必須）
; (globalThis as any).defineNuxtRouteMiddleware = (fn: any) => fn
import { describe, it, expect, vi, beforeEach } from 'vitest'
import authGlobalMiddleware from '../../app/middleware/auth.global'
import { useAuth } from '../../app/composables/useAuth'
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

vi.mock('../../app/composables/useAuth')
vi.mock('nuxt/app', () => require(require('path').resolve(__dirname, '../mocks/nuxt-imports.ts')))

    // グローバルにdefineNuxtRouteMiddlewareをモック
    ; (globalThis as any).defineNuxtRouteMiddleware = (fn: any) => fn

describe('auth.global middleware', () => {
    const mockSyncSessionToCookie = vi.fn()
    let tokenValue: any = { value: null }

    beforeEach(() => {
        vi.clearAllMocks()
        tokenValue = { value: null }
            ; (useAuth as any).mockReturnValue({
                token: tokenValue,
                syncSessionToCookie: mockSyncSessionToCookie,
            })
    })

    it('ログインページは通過する', async () => {
        const to = {
            path: '/login',
            name: 'login',
            fullPath: '/login',
            matched: [],
            query: {},
            params: {},
            hash: '',
            redirectedFrom: undefined,
            meta: {},
        }
        const result = await authGlobalMiddleware(to, to)
        expect(result).toBeUndefined()
        expect(navigateTo).not.toHaveBeenCalled()
    })

    it('トークンがなければsyncSessionToCookieが呼ばれる', async () => {
        const to = {
            path: '/inventory',
            name: 'inventory',
            fullPath: '/inventory',
            matched: [],
            query: {},
            params: {},
            hash: '',
            redirectedFrom: undefined,
            meta: {},
        }
        tokenValue.value = null
        await authGlobalMiddleware(to, to)
        expect(mockSyncSessionToCookie).toHaveBeenCalled()
    })

    it('トークンがなければnavigateToでリダイレクト', async () => {
        const to = {
            path: '/inventory',
            name: 'inventory',
            fullPath: '/inventory',
            matched: [],
            query: {},
            params: {},
            hash: '',
            redirectedFrom: undefined,
            meta: {},
        }
        tokenValue.value = null
        mockSyncSessionToCookie.mockResolvedValue(undefined)
        await authGlobalMiddleware(to, to)
        expect(navigateTo).toHaveBeenCalledWith('/login', { replace: true })
    })

    it('トークンがあれば何もしない', async () => {
        const to = {
            path: '/inventory',
            name: 'inventory',
            fullPath: '/inventory',
            matched: [],
            query: {},
            params: {},
            hash: '',
            redirectedFrom: undefined,
            meta: {},
        }
        tokenValue.value = 'dummy-token'
        const result = await authGlobalMiddleware(to, to)
        expect(result).toBeUndefined()
        expect(navigateTo).not.toHaveBeenCalled()
    })
})
