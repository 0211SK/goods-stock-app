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
import { ref, onMounted } from 'vue'

const isAuthChecking = ref(true)

onMounted(() => {
  // 認証チェックが完了したらローディングを非表示
  // ミドルウェアの実行を待つための短い遅延
  setTimeout(() => {
    isAuthChecking.value = false
  }, 100)
})
</script>

<style>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
  z-index: 9999;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 16px;
  font-size: 16px;
  color: #666;
}
</style>
