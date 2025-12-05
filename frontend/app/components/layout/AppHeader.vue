<template>
    <header class="app-header">
        <div class="app-header__left">
            <NuxtLink to="/inventory" class="app-header__logo">
                グッズ在庫管理
            </NuxtLink>
        </div>

        <nav class="app-header__nav">
            <NuxtLink to="/inventory" class="app-header__nav-link">
                在庫一覧
            </NuxtLink>
            <NuxtLink to="/wishlist" class="app-header__nav-link">
                欲しいもの
            </NuxtLink>
            <NuxtLink to="/stats" class="app-header__nav-link">
                月次集計
            </NuxtLink>
            <NuxtLink to="/settings" class="app-header__nav-link">
                設定
            </NuxtLink>
            <!-- ログイン状態によってログイン/ログアウトを切り替える予定 -->
            <NuxtLink to="/login" class="app-header__nav-link app-header__nav-link--sub">
                ログイン
            </NuxtLink>
        </nav>
    </header>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    background-color: #ffffff;
}

.app-header__logo {
    font-weight: 700;
    font-size: 20px;
    text-decoration: none;
    color: #111827;
}

.app-header__nav {
    display: flex;
    gap: 1rem;
}

.app-header__nav-link {
    text-decoration: none;
    color: #374151;
    font-size: 14px;
    padding: 0.25rem 0.5rem;
    border-radius: 999px;
}

/* NuxtLink は router-link-active クラスが付くので、そこを装飾 */
.app-header__nav-link.router-link-active {
    background-color: #2563eb11;
    color: #2563eb;
    font-weight: 600;
}

.app-header__nav-link--sub {
    font-size: 13px;
    opacity: 0.8;
}
</style>
