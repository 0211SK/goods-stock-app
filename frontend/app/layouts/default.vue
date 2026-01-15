<template>
    <div class="layout-default">
        <AppHeader />

        <main class="layout-default__main">
            <slot />
        </main>

        <AppFooter />
    </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/layout/AppHeader.vue'
import AppFooter from '~/components/layout/AppFooter.vue'
import { useAutoLogout } from '~/composables/useAutoLogout'

// 3時間の非アクティブ時に自動ログアウト
useAutoLogout(180)
</script>

<style scoped>
.layout-default {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.layout-default__main {
    flex: 1;
    padding: 1.5rem;
    max-width: 1024px;
    margin: 0 auto;
}
</style>
