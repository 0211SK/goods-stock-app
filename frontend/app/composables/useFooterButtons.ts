import { onMounted, onBeforeUnmount } from 'vue'

/**
 * フッターボタンの型定義
 */
export type FooterButton = {
    label: string
    icon: string
    onClick: () => void
    class?: string
}

/**
 * フッターにボタンを追加・管理するコンポーザブル
 * ページのマウント時にボタンを設定し、アンマウント時に自動でクリアする
 * 
 * @param buttons 表示するボタンの配列
 * 
 * @example
 * ```typescript
 * useFooterButtons([
 *   { label: '在庫データ登録', icon: '➕', onClick: goToNew }
 * ])
 * ```
 */
export const useFooterButtons = (buttons: FooterButton[]) => {
    /**
     * グローバルステートのフッターボタン
     */
    const extraButtons = useState<FooterButton[]>('footerExtraButtons', () => [])

    onMounted(() => {
        // ボタンを設定
        extraButtons.value = buttons
    })

    // ページを離れる前にボタンをクリア
    onBeforeUnmount(() => {
        extraButtons.value = []
    })

    return {
        extraButtons
    }
}

export default useFooterButtons
