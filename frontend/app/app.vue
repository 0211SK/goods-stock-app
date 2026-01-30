<template>
  <div>
    <!-- 認証チェック中のローディング画面 -->
    <div v-if="isAuthChecking" class="loading-screen">
      <div class="loading-spinner"></div>
      <p class="loading-text">読み込み中...</p>
    </div>

    <!-- 認証チェック完了後にコンテンツを表示 -->
    <NuxtLayout v-else>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
/**
 * アプリケーションのルートコンポーネント
 * 全ページ共通のローディング画面を制御する
 */
import { ref, onMounted } from 'vue'
import { useAutoLogout } from './composables/useAutoLogout'

// 認証チェック中かどうかを管理するフラグ
// true: ローディング画面を表示
// false: 通常のコンテンツを表示
const isAuthChecking = ref(true)

// 自動ログアウト監視を開始
useAutoLogout()

// コンポーネントがマウントされた時に実行
onMounted(() => {
  // 認証チェックが完了したらローディングを非表示
  // ミドルウェア（auth.global.ts）の実行を待つための短い遅延
  // 100ms後にローディング画面を非表示にし、通常のコンテンツを表示
  setTimeout(() => {
    isAuthChecking.value = false
  }, 100)
})
</script>

<style>
/* ===== ローディング画面のスタイル ===== */

/* ローディング画面全体のコンテナ */
.loading-screen {
  position: fixed;
  /* 画面全体に固定表示 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* 縦方向中央揃え */
  align-items: center;
  /* 横方向中央揃え */
  background: #fff;
  /* 白背景で他のコンテンツを隠す */
  z-index: 9999;
  /* 最前面に表示 */
}

/* 回転するスピナー（ローディングアニメーション） */
.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  /* グレーの円 */
  border-top: 4px solid #3b82f6;
  /* 青い部分が回転 */
  border-radius: 50%;
  /* 円形にする */
  animation: spin 1s linear infinite;
  /* 1秒で1回転を無限に繰り返す */
}

/* スピナーの回転アニメーション定義 */
@keyframes spin {
  0% {
    transform: rotate(0deg);
    /* 開始位置 */
  }

  100% {
    transform: rotate(360deg);
    /* 1回転 */
  }
}

/* 「読み込み中...」のテキスト */
.loading-text {
  margin-top: 16px;
  font-size: 16px;
  color: #666;
}
</style>
