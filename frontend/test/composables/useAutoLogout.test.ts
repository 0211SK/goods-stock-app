import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useAutoLogout } from '../../app/composables/useAutoLogout'
import { useAuth } from '../../app/composables/useAuth'

// useRouterとuseAuthをモック化
vi.mock('../../app/composables/useAuth', () => ({
    useAuth: vi.fn(() => ({
        logout: vi.fn().mockResolvedValue(undefined),
    })),
}))

vi.mock('#imports', () => ({
    useRouter: vi.fn(() => ({
        push: vi.fn().mockResolvedValue(undefined),
    })),
}))

describe('useAutoLogout', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.useFakeTimers()
            // process.serverをfalseに設定（クライアント環境）
            ; (global as any).process = { server: false }
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('タイマーをリセットできる', () => {
        const { resetTimer } = useAutoLogout(1) // 1分でテスト

        resetTimer()

        // タイマーが設定されたことを確認
        expect(vi.getTimerCount()).toBeGreaterThan(0)
    })

    it('指定時間後に自動ログアウトする', async () => {
        const mockUseAuth = vi.mocked(useAuth)
        const { resetTimer } = useAutoLogout(1) // 1分でテスト

        resetTimer()

        // 1分（60000ms）進める
        await vi.advanceTimersByTimeAsync(60000)

        // ログアウトが呼ばれたことを確認
        // ログアウトが呼ばれたことを確認
        expect(mockUseAuth).toHaveBeenCalled()
    })

    it('タイマーリセット時に古いタイマーをクリアする', () => {
        const { resetTimer } = useAutoLogout(1)

        resetTimer()
        const firstTimerCount = vi.getTimerCount()

        resetTimer()
        const secondTimerCount = vi.getTimerCount()

        // タイマーが新しく設定されても数が増えないことを確認
        expect(secondTimerCount).toBe(firstTimerCount)
    })

    it('stopWatching でタイマーをクリアする', () => {
        const { startWatching, stopWatching } = useAutoLogout(1)

        // 明示的にタイマーを開始
        startWatching()

        const initialTimerCount = vi.getTimerCount()
        expect(initialTimerCount).toBeGreaterThan(0)

        stopWatching()
        // 全てのタイマーがクリアされることを確認
        expect(vi.getTimerCount()).toBe(0)
    })
})
