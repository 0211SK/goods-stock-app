import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/vue'
import LoginPage from '../../app/pages/login.vue'
import { config } from '@vue/test-utils'

// definePageMetaをグローバルでダミー定義
declare global {
    // eslint-disable-next-line no-var
    var definePageMeta: ((...args: any[]) => void) | undefined;
}
global.definePageMeta = global.definePageMeta || (() => { });

// NuxtLinkをテスト用にスタブ登録
config.global.components = config.global.components || {}
config.global.components.NuxtLink = {
    template: '<a><slot /></a>'
}

// useAuth, useRouterのモック
const loginMock = vi.fn()
const pushMock = vi.fn()

vi.mock('../../app/composables/useAuth', () => ({
    useAuth: () => ({ login: loginMock })
}))
vi.mock('vue-router', () => ({
    useRouter: () => ({ push: pushMock })
}))

describe('LoginPage', () => {
    beforeEach(() => {
        loginMock.mockReset()
        pushMock.mockReset()
    })

    it('フォームの入力と送信ができる', async () => {
        render(LoginPage)
        const emailInput = screen.getByLabelText('メール')
        const passwordInput = screen.getByLabelText('パスワード')
        const submitButton = screen.getByRole('button', { name: 'ログイン' })

        await fireEvent.update(emailInput, 'test@example.com')
        await fireEvent.update(passwordInput, 'password123')
        await fireEvent.click(submitButton)

        expect(loginMock).toHaveBeenCalledWith('test@example.com', 'password123')
    })

    it('エラー時はエラーメッセージが表示される', async () => {
        vi.mocked(loginMock).mockImplementationOnce(() => {
            throw new Error('ログイン失敗')
        })
        render(LoginPage)
        const emailInput = screen.getByLabelText('メール')
        const passwordInput = screen.getByLabelText('パスワード')
        const submitButton = screen.getByRole('button', { name: 'ログイン' })

        await fireEvent.update(emailInput, 'test@example.com')
        await fireEvent.update(passwordInput, 'password123')
        await fireEvent.click(submitButton)

        expect(screen.queryByText('メールまたはパスワードが正しくありません')).not.toBeNull()
    })

    it('ログイン成功時はpushが呼ばれる', async () => {
        loginMock.mockResolvedValueOnce(undefined)
        render(LoginPage)
        const emailInput = screen.getByLabelText('メール')
        const passwordInput = screen.getByLabelText('パスワード')
        const submitButton = screen.getByRole('button', { name: 'ログイン' })

        await fireEvent.update(emailInput, 'test@example.com')
        await fireEvent.update(passwordInput, 'password123')
        await fireEvent.click(submitButton)

        expect(pushMock).toHaveBeenCalledWith('/')
    })

})
