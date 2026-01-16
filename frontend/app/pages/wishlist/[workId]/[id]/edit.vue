<template>
    <CommonPageLayout title="欲しいもの詳細編集">
        <!-- 編集フォーム -->
        <WishlistForm :initial-data="formData" :works="works" :item-types="itemTypes" :submitting="loading"
            :error-message="error" submit-label="更新する" :loading="loading" :error="error" :item="item" @submit="onSubmit"
            @cancel="cancel" />
    </CommonPageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from '#imports'
import CommonPageLayout from '~/components/common/CommonPageLayout.vue'
import WishlistForm, { type WishlistFormData } from '~/components/wishlist/WishlistForm.vue'
import { useWorks } from '~/composables/useWorks'
import { useItemTypes } from '~/composables/useItemTypes'
import { useWishlistItems } from '~/composables/useWishlistItems'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const workId = Number(route.params.workId)

const { items: works, fetchWorks } = useWorks()
const { items: itemTypes, fetchList: fetchItemTypes } = useItemTypes()
const { loading, error, fetchDetail, update } = useWishlistItems()

const item = ref<any | null>(null)

/**
 * フォームの初期データを準備
 * APIから取得したデータをフォーム用に変換
 */
const formData = computed<Partial<WishlistFormData>>(() => {
    if (!item.value) return {}

    return {
        workId: item.value.workId,
        itemTypeId: item.value.itemTypeId,
        goodsName: item.value.goodsName || '',
        quantity: item.value.quantity || 0,
        expectedUnitPrice: item.value.expectedUnitPrice || 0,
        releaseDate: item.value.releaseDate || null,
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
const onSubmit = async (formData: WishlistFormData) => {
    try {
        // 更新用のペイロードを作成（画像URLは既に含まれている）
        const payload = {
            workId: formData.workId!,
            itemTypeId: formData.itemTypeId!,
            goodsName: formData.goodsName,
            quantity: formData.quantity,
            expectedUnitPrice: formData.expectedUnitPrice,
            releaseDate: formData.releaseDate,
            imageUrl: formData.imageUrl,
            memo: formData.memo
        }

        // composableのupdate関数を呼び出す（loadingとerrorはcomposable内で管理）
        await update(id, payload)

        // 更新成功後、詳細ページに戻る
        void router.push(`/wishlist/${workId}/${id}`)
    } catch (e) {
        // エラーはcomposable内で処理される
    }
}

/**
 * キャンセルボタンクリック時の処理
 * 詳細ページに戻る
 */
const cancel = () => {
    void router.push(`/wishlist/${workId}/${id}`)
}
</script>

<style scoped></style>
