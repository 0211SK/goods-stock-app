import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuth } from '../../app/composables/useAuth'
import { mockNuxtApp } from '../helpers/mockApi'

describe('useAuth', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('login', () => {
        it('成功時にトークンを設定する', async () => {
            // モックの設定
            const mockToken = 'test-access-token'
            const mockSession = { access_token: mockToken }
            const mockSupabase = {
                auth: {
                    signInWithPassword: vi.fn().mockResolvedValue({
                        data: { session: mockSession },
                        error: null,
                    }),
                    signOut: vi.fn(),
                    getSession: vi.fn(),
                },
            }

            const mockCookie = { value: null }
                ; (global as any).useCookie = vi.fn(() => mockCookie)
                ; (global as any).useNuxtApp = vi.fn(() => ({ $supabase: mockSupabase }))

            // テスト実行
            const { login, token } = useAuth()
            await login('test@example.com', 'password123')

            // 検証
            expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            })
            expect(mockCookie.value).toBe(mockToken)
        })

        it('エラー時に例外をスローする', async () => {
            const mockError = new Error('Invalid credentials')
            const mockSupabase = {
                auth: {
                    signInWithPassword: vi.fn().mockResolvedValue({
                        data: null,
                        error: mockError,
                    }),
                    signOut: vi.fn(),
                    getSession: vi.fn(),
                },
            }

                ; (global as any).useCookie = vi.fn(() => ({ value: null }))
                ; (global as any).useNuxtApp = vi.fn(() => ({ $supabase: mockSupabase }))

            const { login } = useAuth()

            await expect(login('test@example.com', 'wrong')).rejects.toThrow('Invalid credentials')
        })
    })

    describe('logout', () => {
        it('トークンをnullにする', async () => {
            const mockSupabase = {
                auth: {
                    signInWithPassword: vi.fn(),
                    signOut: vi.fn().mockResolvedValue({ error: null }),
                    getSession: vi.fn(),
                },
            }

            const mockCookie = { value: 'existing-token' }
                ; (global as any).useCookie = vi.fn(() => mockCookie)
                ; (global as any).useNuxtApp = vi.fn(() => ({ $supabase: mockSupabase }))

            const { logout } = useAuth()
            await logout()

            expect(mockSupabase.auth.signOut).toHaveBeenCalled()
            expect(mockCookie.value).toBeNull()
        })
    })
})
