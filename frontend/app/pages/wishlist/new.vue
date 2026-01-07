<template>
    <!-- 欲しいもの登録ページ -->
    <section class="page">
        <PageTitle title="欲しいもの登録" />

        <!-- 欲しいもの登録フォームコンポーネント -->
        <WishlistForm :initial-data="initialData" :works="works" :item-types="itemTypes" :submitting="submitting"
            :error-message="errorMessage" @submit="onSubmit" @cancel="cancel" />
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from '#imports'
import PageTitle from '~/components/common/PageTitle.vue'
import WishlistForm, { type WishlistFormData } from '~/components/wishlist/WishlistForm.vue'
import { useWorks } from '~/composables/useWorks'
import { useItemTypes } from '~/composables/useItemTypes'
import { useWishlistItems } from '~/composables/useWishlistItems'

// ルーターと各種コンポーザブルの初期化
const router = useRouter()
const route = useRoute()
const { items: works, fetchWorks } = useWorks()                      // 作品一覧の取得用
const { items: itemTypes, fetchList: fetchItemTypes } = useItemTypes()  // 種類一覧の取得用
const { create } = useWishlistItems()                                // 欲しいもの登録用

// フォームの状態管理
const submitting = ref(false)           // API送信中フラグ
const errorMessage = ref<string | null>(null)  // エラーメッセージ

/**
 * クエリパラメータからworkIdを取得して初期値を設定
 * 欲しいもの一覧画面から遷移した場合、作品が自動選択される
 */
const initialData = computed(() => {
    const workIdParam = route.query.workId
    if (workIdParam) {
        const workId = Number(workIdParam)
        if (Number.isFinite(workId)) {
            return { workId }
        }
    }
    return undefined
})

// ページ読み込み時に作品と種類の一覧を取得
onMounted(() => {
    void fetchWorks({ page: 1, size: 200 })
    void fetchItemTypes({ page: 1, size: 200 })
})

/**
 * フォーム送信時の処理
 * 1. APIで新規欲しいものを登録（画像は既にアップロード済み）
 * 2. 成功したらその作品の欲しいもの一覧ページに遷移
 * 3. 失敗したらエラーメッセージを表示
 */
const onSubmit = async (formData: WishlistFormData) => {
    submitting.value = true
    errorMessage.value = null
    try {
        // APIに送信するペイロードを作成（画像URLは既に含まれている）
        const payload = {
            workId: formData.workId!,
            itemTypeId: formData.itemTypeId!,
            goodsName: formData.goodsName,
            quantity: formData.quantity,
            expectedUnitPrice: formData.expectedUnitPrice,
            releaseDate: formData.releaseDate,
            imageUrl: formData.imageUrl,
            memo: formData.memo,
        }
        // 欲しいもの登録APIを呼び出す
        const res = await create(payload)
        // 登録成功後、欲しいものリストページに遷移
        void router.push('/wishlist')
    } catch (e: any) {
        // エラー時はメッセージを表示（フォームは保持される）
        errorMessage.value = e?.message ?? '登録に失敗しました'
    } finally {
        submitting.value = false
    }
}

/**
 * キャンセルボタンクリック時の処理
 * 前のページに戻る
 */
const cancel = () => {
    void router.back()
}
</script>

<style scoped>
/* ページ固有のスタイルがあればここに記述 */
</style>
