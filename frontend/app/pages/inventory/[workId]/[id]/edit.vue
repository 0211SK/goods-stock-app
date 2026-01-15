<template>
    <CommonPageLayout title="グッズ詳細編集">
        <!-- 読み込み中・エラー表示 -->
        <div v-if="loading && !item">読み込み中…</div>
        <div v-else-if="error && !item">データの取得に失敗しました。リロードしてください</div>

        <!-- 編集フォーム -->
        <InventoryForm v-else-if="item" :initial-data="formData" :works="works" :item-types="itemTypes"
            :submitting="loading" :error-message="error" submit-label="更新する" @submit="onSubmit" @cancel="cancel" />
    </CommonPageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from '#imports'
import CommonPageLayout from '~/components/common/CommonPageLayout.vue'
import InventoryForm, { type InventoryFormData } from '~/components/inventory/InventoryForm.vue'
import { useWorks } from '~/composables/useWorks'
import { useItemTypes } from '~/composables/useItemTypes'
import { useOwnedItems } from '~/composables/useOwnedItems'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const workId = Number(route.params.workId)

const { items: works, fetchWorks } = useWorks()
const { items: itemTypes, fetchList: fetchItemTypes } = useItemTypes()
const { loading, error, fetchDetail, update } = useOwnedItems()

const item = ref<any | null>(null)

/**
 * フォームの初期データを準備
 * APIから取得したデータをフォーム用に変換
 */
const formData = computed<Partial<InventoryFormData>>(() => {
    if (!item.value) return {}

    return {
        workId: item.value.workId,
        itemTypeId: item.value.itemTypeId,
        goodsName: item.value.goodsName || '',
        quantity: item.value.quantity || 1,
        unitPrice: item.value.unitPrice || 0,
        purchaseDate: item.value.purchaseDate || '',
        imageUrl: item.value.imageUrl || null,
        memo: item.value.memo || null
    }
})

onMounted(async () => {
    // 作品と種類のマスタデータを取得
    void fetchWorks({ page: 1, size: 200 })
    void fetchItemTypes({ page: 1, size: 200 })

    // 編集対象のデータを取得
    try {
        item.value = await fetchDetail(id)
    } catch (e) {
        // エラーはcomposable内で処理される
    }
})

/**
 * フォーム送信時の処理
 * composableのupdate関数を使用してAPIを呼び出す（画像は既にアップロード済み）
 */
const onSubmit = async (formData: InventoryFormData) => {
    try {
        // 更新用のペイロードを作成（画像URLは既に含まれている）
        const payload = {
            workId: formData.workId!,
            itemTypeId: formData.itemTypeId!,
            goodsName: formData.goodsName,
            quantity: formData.quantity,
            unitPrice: formData.unitPrice,
            purchaseDate: formData.purchaseDate,
            imageUrl: formData.imageUrl,
            memo: formData.memo
        }

        // composableのupdate関数を呼び出す（loadingとerrorはcomposable内で管理）
        await update(id, payload)

        // 更新成功後、詳細ページに戻る
        void router.push(`/inventory/${workId}/${id}`)
    } catch (e) {
        // エラーはcomposable内で処理される
    }
}

/**
 * キャンセルボタンクリック時の処理
 * 詳細ページに戻る
 */
const cancel = () => {
    void router.push(`/inventory/${workId}/${id}`)
}
</script>

<style scoped></style>
