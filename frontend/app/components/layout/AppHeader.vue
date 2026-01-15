<template>
    <header class="app-header">
        <!-- 上段 -->
        <div class="header-top">
            <NuxtLink to="/inventory" class="logo">
                グッズ在庫管理
            </NuxtLink>

            <button @click="handleLogout" class="logout-button">
                ログアウト
            </button>
        </div>

        <!-- 下段：メイン操作（PC / SP 共通） -->
        <div class="header-main">
            <div class="tabs">
                <NuxtLink to="/inventory" class="tab" :class="{ active: route.path.startsWith('/inventory') }">
                    グッズ検索
                </NuxtLink>
                <NuxtLink to="/wishlist" class="tab" :class="{ active: route.path.startsWith('/wishlist') }">
                    欲しいもの
                </NuxtLink>
                <NuxtLink to="/stats" class="tab" :class="{ active: route.path.startsWith('/stats') }">
                    支出予定額
                </NuxtLink>
                <NuxtLink to="/settings" class="tab" :class="{ active: route.path.startsWith('/settings') }">
                    設定
                </NuxtLink>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
/**
 * アプリケーションのヘッダーコンポーネント
 * ロゴ、ナビゲーションタブ、ログアウトボタンを表示
 */
import { useRoute, useRouter } from "vue-router"

// 現在のルート情報を取得（アクティブなタブの判定に使用）
const route = useRoute()
// ルーター（ページ遷移用）
const router = useRouter()
// 認証関連の機能を取得
const { logout } = useAuth()

/**
 * ログアウトボタンのクリックハンドラ
 * 1. Supabaseのセッションとトークンを削除
 * 2. ログイン画面にリダイレクト（ページ全体をリロード）
 */
const handleLogout = async () => {
    // ログアウト処理（トークン削除とSupabaseセッションのクリア）
    await logout()
    // ページ全体をリロードしてキャッシュをクリア
    // router.push()ではなくwindow.location.hrefを使うことで確実にリセット
    window.location.href = '/login'
}
</script>

<style scoped>
/* ===== 共通 ===== */
.app-header {
    border-bottom: 1px solid #e5e7eb;
    background: #fff;
}

.header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
}

.logo {
    font-size: 20px;
    font-weight: 700;
    color: #111827;
    text-decoration: none;
}

.logout-button {
    padding: 6px 12px;
    font-size: 10px;
    color: #fff;
    background: #dc2626;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.logout-button:hover {
    background: #b91c1c;
}

.logout-button:active {
    background: #991b1b;
}

/* ===== メイン操作 ===== */
.header-main {
    display: flex;
    gap: 16px;
    padding: 12px 20px;
    align-items: center;
    justify-content: center;
}

.tabs {
    display: flex;
    align-items: center;
    border: 1px solid #d1d5db;
    flex: 0 0 auto;
    width: 100%;
}

.tab {
    flex: 1;
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    text-decoration: none;
    color: #111827;
    border-right: 1px solid #d1d5db;
    background: #fff;
}

.tab:last-child {
    border-right: none;
}

.tab.active {
    outline: 2px solid #111;
    outline-offset: -2px;
    font-weight: 700;
}

/* ===== スマホ調整 ===== */
@media (max-width: 767px) {
    .header-main {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
    }

    .tabs {
        width: 100%;
    }

    .tab {
        flex: 1;
        text-align: center;
        padding: 10px 16px;
    }
}

@media (max-width: 360px) {
    .header-main {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
    }

    .tabs {
        width: 100%;
    }

    .tab {
        flex: 1;
        text-align: center;
        padding: 10px 16px;
        font-size: 12px;
    }
}
</style>
