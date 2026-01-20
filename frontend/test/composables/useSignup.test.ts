import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSignup } from '../../app/composables/useSignup'

// Supabaseのモック
const mockSignUp = vi.fn()
const mockUseNuxtApp = () => ({ $supabase: { auth: { signUp: mockSignUp } } })

vi.stubGlobal('useNuxtApp', mockUseNuxtApp)

describe('useSignup', () => {
    beforeEach(() => {
        mockSignUp.mockReset()
    })

    it('正常に新規登録できる', async () => {
        const mockUser = { id: 'user1', email: 'test@example.com' }
        const mockSession = { access_token: 'token123' }
        mockSignUp.mockResolvedValue({ data: { user: mockUser, session: mockSession }, error: null })

        const { signup, response, error } = useSignup()
        await signup({ email: 'test@example.com', password: 'password123' })

        expect(error.value).toBeNull()
        expect(response.value?.user).toEqual(mockUser)
        expect(response.value?.session).toEqual(mockSession)
    })

    it('メール重複などでエラーになる', async () => {
        mockSignUp.mockResolvedValue({ data: null, error: { status: 400, message: 'メール重複' } })

        const { signup, response, error } = useSignup()
        await signup({ email: 'duplicate@example.com', password: 'password123' })

        expect(response.value).toBeNull()
        expect(error.value?.errorCode).toBe(400)
        expect(error.value?.message).toBe('メール重複')
    })

    it('ネットワークエラー時はNETWORK_ERRORになる', async () => {
        mockSignUp.mockRejectedValue(new Error('network error'))

        const { signup, response, error } = useSignup()
        await signup({ email: 'test@example.com', password: 'password123' })

        expect(response.value).toBeNull()
        expect(error.value?.errorCode).toBe('NETWORK_ERROR')
        expect(error.value?.message).toBe('通信エラーが発生しました')
    })
})
