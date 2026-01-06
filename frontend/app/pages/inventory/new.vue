<template>
    <!-- 在庫登録ページ -->
    <section class="page">
        <PageTitle title="在庫登録" />

        <!-- 在庫登録フォームコンポーネント -->
        <InventoryForm :works="works" :item-types="itemTypes" :submitting="submitting" :error-message="errorMessage"
            @submit="onSubmit" @cancel="cancel" />
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from '#imports'
import PageTitle from '~/components/common/PageTitle.vue'
import InventoryForm, { type InventoryFormData } from '~/components/inventory/InventoryForm.vue'
import { useWorks } from '~/composables/useWorks'
import { useItemTypes } from '~/composables/useItemTypes'
import { useOwnedItems } from '~/composables/useOwnedItems'

// ルーターと各種コンポーザブルの初期化
const router = useRouter()
const { items: works, fetchWorks } = useWorks()                      // 作品一覧の取得用
const { items: itemTypes, fetchList: fetchItemTypes } = useItemTypes()  // 種類一覧の取得用
const { create } = useOwnedItems()                                   // 在庫登録用

// フォームの状態管理
const submitting = ref(false)           // API送信中フラグ
const errorMessage = ref<string | null>(null)  // エラーメッセージ

// ページ読み込み時に作品と種類の一覧を取得
onMounted(() => {
    void fetchWorks({ page: 1, size: 200 })
    void fetchItemTypes({ page: 1, size: 200 })
})

/**
 * フォーム送信時の処理
 * 1. APIで新規在庫を登録
 * 2. 成功したらその作品の在庫一覧ページに遷移
 * 3. 失敗したらエラーメッセージを表示
 */
const onSubmit = async (formData: InventoryFormData, imageFile: File | null) => {
    submitting.value = true
    errorMessage.value = null
    try {
        // APIに送信するペイロードを作成
        const payload = {
            workId: formData.workId!,
            itemTypeId: formData.itemTypeId!,
            goodsName: formData.goodsName,
            quantity: formData.quantity,
            unitPrice: formData.unitPrice,
            purchaseDate: formData.purchaseDate,
            imageUrl: formData.imageUrl,
            memo: formData.memo,
        }
        // 在庫登録APIを呼び出す
        const res = await create(payload)
        // 登録成功後、その作品の在庫一覧ページに遷移
        void router.push(`/inventory/${res.workId}`)
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
