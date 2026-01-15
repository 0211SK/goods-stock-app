import { ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from './useAuth'
import { useRouter } from '#imports'

/**
 * 自動ログアウトとトークンリフレッシュ機能を提供するコンポーザブル
 * - 指定時間（デフォルト3時間）操作がない場合、自動的にログアウトする
 * - 操作がある場合は、定期的にトークンをリフレッシュする
 */

export const useAutoLogout = (timeoutMinutes: number = 180) => {
    const { logout, refreshToken } = useAuth()
    const router = useRouter()
    const timeoutId = ref<NodeJS.Timeout | null>(null)
    const refreshTimeoutId = ref<NodeJS.Timeout | null>(null)
    const isActive = ref(false)
    const hadApiActivity = ref(false)

    const TIMEOUT_MS = timeoutMinutes * 60 * 1000 // 分をミリ秒に変換
    const REFRESH_BEFORE_MINUTES = 10
    const REFRESH_MS = (timeoutMinutes - REFRESH_BEFORE_MINUTES) * 60 * 1000 // 2時間50分後

    /**
     * タイマーをリセット
     * ユーザーの操作があるたびに呼び出される
     */

    // APIアクティビティ検知時に呼ばれる
    const onApiActivity = () => {
        hadApiActivity.value = true
        resetTimer()
    }

    // 自動ログアウトタイマーをリセット
    const resetTimer = () => {
        // 既存のタイマーをクリア
        if (timeoutId.value) {
            clearTimeout(timeoutId.value)
        }
        if (refreshTimeoutId.value) {
            clearTimeout(refreshTimeoutId.value)
        }

        // 新しいタイマーをセット
        timeoutId.value = setTimeout(async () => {
            console.log('自動ログアウト: 3時間操作がありませんでした')
            await logout()
            await router.push('/login')
        }, TIMEOUT_MS)

        // 2時間50分後にリフレッシュ判定
        refreshTimeoutId.value = setTimeout(async () => {
            if (hadApiActivity.value) {
                try {
                    if (typeof refreshToken === 'function') {
                        await refreshToken()
                        console.log('トークンをリフレッシュしました')
                    }
                } catch (e) {
                    console.error('トークンリフレッシュ失敗', e)
                }
            }
            hadApiActivity.value = false // 判定後リセット
        }, REFRESH_MS)
    }


    /**
     * API通信時のみタイマーをリセットする
     * window.dispatchEvent(new CustomEvent('api-activity')) でリセット
     */

    const startWatching = () => {
        if (process.server || isActive.value) return

        isActive.value = true
        hadApiActivity.value = false
        resetTimer()
        window.addEventListener('api-activity', onApiActivity)
    }

    /**
     * 監視を停止
     */

    const stopWatching = () => {
        if (!isActive.value) return

        isActive.value = false

        // タイマーをクリア
        if (timeoutId.value) {
            clearTimeout(timeoutId.value)
            timeoutId.value = null
        }
        if (refreshTimeoutId.value) {
            clearTimeout(refreshTimeoutId.value)
            refreshTimeoutId.value = null
        }

        // カスタムイベントリスナーを削除
        window.removeEventListener('api-activity', onApiActivity)
    }

    // コンポーネントのマウント時に監視開始
    onMounted(() => {
        startWatching()
    })

    // コンポーネントのアンマウント時に監視停止
    onUnmounted(() => {
        stopWatching()
    })

    return {
        startWatching,
        stopWatching,
        resetTimer
    }
}
