<template>
    <!-- アプリケーション全体のフッター -->
    <footer class="app-footer">
        <div class="footer-buttons">
            <!-- ページ固有の追加ボタン（提供されている場合のみ表示） -->
            <button v-if="extraButton" class="footer-btn footer-btn--extra" @click="extraButton.onClick"
                :title="extraButton.label">
                <span class="icon">{{ extraButton.icon }}</span>
                <span class="label">{{ extraButton.label }}</span>
            </button>

            <!-- トップページへ戻るボタン -->
            <button class="footer-btn footer-btn--home" @click="goHome" title="トップページへ">
                <span class="icon">🏠</span>
                <span class="label">トップ</span>
            </button>

            <!-- 1ページ戻るボタン -->
            <button class="footer-btn footer-btn--back" @click="goBack" title="前のページへ戻る">
                <span class="icon">←</span>
                <span class="label">戻る</span>
            </button>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { useRouter } from '#imports'

const router = useRouter()

/**
 * ページから提供される追加ボタンの情報を受け取る
 * useStateを使ってページ間で共有されるグローバルステート
 */
const extraButton = useState<{
    label: string
    icon: string
    onClick: () => void
} | null>('footerExtraButton', () => null)

/**
 * トップページ（在庫一覧）へ遷移
 */
const goHome = () => {
    void router.push('/inventory')
}

/**
 * 1ページ前に戻る
 */
const goBack = () => {
    router.back()
}
</script>

<style scoped>
.app-footer {
    background-color: #f8f9fa;
    border-top: 1px solid #e9ecef;
    padding: 16px;
    margin-top: auto;
}

.footer-buttons {
    display: flex;
    justify-content: center;
    gap: 16px;
    max-width: 1024px;
    margin: 0 auto;
    width: 100%;
    padding: 0 16px;
}

.footer-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    flex: 1;
    min-width: 120px;
    max-width: 200px;
}

.footer-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.footer-btn:active {
    transform: translateY(0);
}

.footer-btn--home {
    background-color: #2563eb;
    color: white;
}

.footer-btn--home:hover {
    background-color: #1d4ed8;
}

.footer-btn--back {
    background-color: #6b7280;
    color: white;
}

.footer-btn--back:hover {
    background-color: #4b5563;
}

.footer-btn--extra {
    background-color: #10b981;
    color: white;
}

.footer-btn--extra:hover {
    background-color: #059669;
}

.icon {
    font-size: 20px;
    line-height: 1;
}

.label {
    font-size: 14px;
}

/* レスポンシブ対応: 小さい画面ではボタンを縦に配置 */
@media (max-width: 480px) {
    .footer-buttons {
        flex-direction: column;
        gap: 12px;
    }

    .footer-btn {
        width: 100%;
        justify-content: center;
    }
}
</style>
