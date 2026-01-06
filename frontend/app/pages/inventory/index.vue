<template>
    <!-- グッズ作品一覧ページ -->
    <section class="page">
        <PageTitle title="グッズ作品一覧" />
        <!-- 作品ごとのグループ表示コンポーネント -->
        <GenreSection :genres="genres" />
    </section>
</template>

<script setup lang="ts">
import PageTitle from '~/components/common/PageTitle.vue'
import GenreSection from '~/components/inventory/GenreSection.vue'
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from '#imports'
import { useWorks } from '~/composables/useWorks'

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

/**
 * フッターに追加ボタンを設定
 * useStateを使ってグローバルステートに設定
 */
const extraButton = useState<{
    label: string
    icon: string
    onClick: () => void
} | null>('footerExtraButton', () => null)

// ページ読み込み時に作品一覧を取得し、フッターボタンを設定
onMounted(() => {
    void fetchWorks({ page: 1, size: 200 })

    // フッターに「データ登録」ボタンを追加
    extraButton.value = {
        label: 'データ登録',
        icon: '➕',
        onClick: goCreate
    }
})

// ページを離れる時にボタンをクリア
onUnmounted(() => {
    extraButton.value = null
})
</script>

<style scoped>
/* ページ固有のスタイルがあればここに記述 */
</style>