import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/vue'
import SignupPage from '../../app/pages/signup.vue'
import { config } from '@vue/test-utils'
import { ref } from 'vue'

// definePageMetaをグローバルでダミー定義
global.definePageMeta = global.definePageMeta || (() => { })

// NuxtLink/nuxt-linkをテスト用にスタブ登録
config.global.components = config.global.components || {}
config.global.components.NuxtLink = { template: '<a><slot /></a>' }
config.global.components['nuxt-link'] = { template: '<a><slot /></a>' }

// useSignup, useAuth, useRouterのモック
const signupMock = vi.fn()
const setTokenMock = vi.fn()
const pushMock = vi.fn()
const errorRef = ref(null)
const responseRef = ref(null)

vi.mock('../../app/composables/useSignup', () => ({
    useSignup: () => ({
        signup: signupMock,
        loading: false,
        error: errorRef,
        response: responseRef,
    })
}))
vi.mock('../../app/composables/useAuth', () => ({
    useAuth: () => ({ setToken: setTokenMock })
}))
vi.mock('vue-router', () => ({
    useRouter: () => ({ push: pushMock })
}))

describe('SignupPage', () => {
    beforeEach(() => {
        signupMock.mockReset()
        setTokenMock.mockReset()
        pushMock.mockReset()
        errorRef.value = null
        responseRef.value = null
    })

    it('フォームの入力と送信ができる', async () => {
        render(SignupPage)
        const emailInput = screen.getByLabelText('メール')
        const passwordInput = screen.getByLabelText('パスワード')
        const submitButton = screen.getByRole('button', { name: '登録' })

        await fireEvent.update(emailInput, 'test@example.com')
        await fireEvent.update(passwordInput, 'password123')
        await fireEvent.click(submitButton)

        expect(signupMock).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' })
    })

    it('エラー時はエラーメッセージが表示される', async () => {
        signupMock.mockImplementationOnce(() => {
            errorRef.value = { message: 'エラー発生' }
        })
        render(SignupPage)
        const emailInput = screen.getByLabelText('メール')
        const passwordInput = screen.getByLabelText('パスワード')
        const submitButton = screen.getByRole('button', { name: '登録' })

        await fireEvent.update(emailInput, 'test@example.com')
        await fireEvent.update(passwordInput, 'password123')
        await fireEvent.click(submitButton)

        expect(screen.queryByText('エラー発生')).not.toBeNull()
    })

    it('登録成功時はsetTokenとpushが呼ばれる', async () => {
        signupMock.mockImplementationOnce(() => {
            responseRef.value = { session: { access_token: 'token123' } }
        })
        render(SignupPage)
        const emailInput = screen.getByLabelText('メール')
        const passwordInput = screen.getByLabelText('パスワード')
        const submitButton = screen.getByRole('button', { name: '登録' })

        await fireEvent.update(emailInput, 'test@example.com')
        await fireEvent.update(passwordInput, 'password123')
        await fireEvent.click(submitButton)

        expect(setTokenMock).toHaveBeenCalledWith('token123')
        expect(pushMock).toHaveBeenCalledWith('/')
    })
})