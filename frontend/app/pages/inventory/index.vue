<template>
    <CommonPageLayout title="グッズ作品一覧">
        <GenreSection :genres="genres" />
    </CommonPageLayout>
</template>

<script setup lang="ts">
import CommonPageLayout from '~/components/common/CommonPageLayout.vue'
import GenreSection from '~/components/inventory/GenreSection.vue'
import { onMounted } from 'vue'
import { useRouter } from '#imports'
import { useWorks } from '~/composables/useWorks'
import { useFooterButtons } from '~/composables/useFooterButtons'

// 作品一覧を取得するコンポーザブル（genresという名前で使用）
const { items: genres, fetchWorks } = useWorks()
const router = useRouter()

/**
 * 「データ登録」ボタンクリック時の処理
 * 新規在庫登録ページに遷移
 */
const goCreate = () => {
    void router.push('/inventory/new')
}

// フッターに「データ登録」ボタンを追加
useFooterButtons([{
    label: '在庫データ登録',
    icon: '➕',
    onClick: goCreate
}])

// ページ読み込み時に作品一覧を取得
onMounted(() => {
    void fetchWorks({ page: 1, size: 200 })
})
</script>

<style scoped>
/* ページ固有のスタイルがあればここに記述 */
</style>