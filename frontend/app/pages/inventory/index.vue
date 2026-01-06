<template>
    <!-- グッズ作品一覧ページ -->
    <section class="page">
        <PageTitle title="グッズ作品一覧" />
        <!-- 作品ごとのグループ表示コンポーネント -->
        <GenreSection :genres="genres" />
        <!-- 新規登録ボタン（右下固定） -->
        <button class="btn-create" @click="goCreate">データ登録</button>
    </section>
</template>

<script setup lang="ts">
import PageTitle from '~/components/common/PageTitle.vue'
import GenreSection from '~/components/inventory/GenreSection.vue'
import { onMounted } from 'vue'
import { useRouter } from '#imports'
import { useWorks } from '~/composables/useWorks'

// 作品一覧を取得するコンポーザブル（genresという名前で使用）
const { items: genres, fetchWorks } = useWorks()
const router = useRouter()

// ページ読み込み時に作品一覧を取得
onMounted(() => {
    fetchWorks({ page: 1, size: 200 })
})

/**
 * 「データ登録」ボタンクリック時の処理
 * 新規在庫登録ページに遷移
 */
const goCreate = () => {
    void router.push('/inventory/new')
}
</script>

<style scoped>
.btn-create {
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 16px 24px;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 16px;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 100;
}

.btn-create:hover {
    background-color: #1d4ed8;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
}

.btn-create:active {
    transform: translateY(0);
}
</style>