<template>
    <!-- アプリケーション全体のフッター -->
    <footer class="app-footer">
        <div class="footer-buttons">
            <!-- トップページへ戻るボタン -->
            <button class="footer-btn footer-btn--home" @click="goHome" title="トップページへ">
                <span class="icon">🏠</span>
                <span class="label">トップ</span>
            </button>

            <!-- ページ固有の追加ボタン（複数対応） -->
            <button v-for="(btn, index) in extraButtons" :key="index" class="footer-btn"
                :class="btn.class || 'footer-btn--extra'" @click="btn.onClick" :title="btn.label">
                <span class="icon">{{ btn.icon }}</span>
                <span class="label">{{ btn.label }}</span>
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
 * ページから提供される追加ボタンの情報を受け取る（複数対応）
 * useStateを使ってページ間で共有されるグローバルステート
 */
const extraButtons = useState<Array<{
    label: string
    icon: string
    onClick: () => void
    class?: string
}>>('footerExtraButtons', () => [])

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
    padding: 1rem;
    margin-top: auto;
}

.footer-buttons {
    display: flex;
    justify-content: center;
    gap: clamp(8px, 1vw, 16px);
    max-width: 1024px;
    margin: 0 auto;
    width: 100%;
    padding: 0 1rem;
}

.footer-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(4px, 0.5vw, 8px);
    padding: clamp(8px, 1vw, 12px) clamp(12px, 2vw, 24px);
    border: none;
    border-radius: 8px;
    font-size: clamp(12px, 1.5vw, 16px);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    flex: 1;
    min-width: 80px;
    max-width: 200px;
    white-space: nowrap;
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

.footer-btn--edit {
    background-color: #f59e0b;
    color: white;
}

.footer-btn--edit:hover {
    background-color: #d97706;
}

.footer-btn--delete {
    background-color: #ef4444;
    color: white;
}

.footer-btn--delete:hover {
    background-color: #dc2626;
}

.icon {
    font-size: clamp(16px, 2vw, 20px);
    line-height: 1;
    flex-shrink: 0;
}

.label {
    font-size: clamp(11px, 1.3vw, 14px);
    flex-shrink: 0;
}

/* タブレット画面用の調整 */
@media (max-width: 768px) {
    .footer-buttons {
        gap: clamp(6px, 1.5vw, 12px);
    }

    .footer-btn {
        min-width: 70px;
        padding: clamp(6px, 1.2vw, 10px) clamp(8px, 1.8vw, 16px);
    }
}

/* レスポンシブ対応: 小さい画面ではボタンを縦に配置 */
@media (max-width: 480px) {
    .footer-buttons {
        flex-direction: column;
        gap: 12px;
    }

    .footer-btn {
        width: 100%;
        max-width: 100%;
        justify-content: center;
        font-size: 14px;
    }

    .icon {
        font-size: 18px;
    }

    .label {
        font-size: 13px;
    }
}
</style>
