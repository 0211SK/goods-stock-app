<template>
    <CommonPageLayout title="欲しいもの詳細">
        <!-- 欲しいもの詳細コンポーネント -->
        <WishlistDetail :item="item" :loading="loading" :error="error" />

        <!-- 削除確認・成功・失敗モーダル -->
        <DeleteConfirmModal :show-delete-modal="showDeleteModal" :show-success-modal="showSuccessModal"
            :show-error-modal="showErrorModal" :error-message="deleteErrorMessage" :deleting="deleting"
            @confirm="confirmDelete" @cancel="showDeleteModal = false" @close-success="closeSuccessModal"
            @close-error="showErrorModal = false" />

        <!-- 購入確認・成功・エラーモーダル -->
        <PurchaseConfirmModal :show-purchase-modal="showPurchaseModal" :show-success-modal="showPurchaseSuccessModal"
            :show-error-modal="showPurchaseErrorModal" :error-message="purchaseErrorMessage" :purchasing="purchasing"
            :current-image-url="item?.imageUrl" @confirm="confirmPurchase" @cancel="showPurchaseModal = false"
            @close-success="closePurchaseSuccessModal" @close-error="showPurchaseErrorModal = false" />
    </CommonPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from '#imports'
import CommonPageLayout from '~/components/common/CommonPageLayout.vue'
import DeleteConfirmModal from '~/components/common/DeleteConfirmModal.vue'
import PurchaseConfirmModal from '~/components/common/PurchaseConfirmModal.vue'
import WishlistDetail from '~/components/wishlist/WishlistDetail.vue'
import { useWishlistItems } from '~/composables/useWishlistItems'
import { useOwnedItems } from '~/composables/useOwnedItems'
import { useFooterButtons } from '~/composables/useFooterButtons'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const workId = Number(route.params.workId)

const item = ref<any | null>(null)
const { loading, error, fetchDetail, deleteItem: deleteItemApi } = useWishlistItems()
const { create: createOwnedItem, deleteItem: deleteOwnedItem } = useOwnedItems()

// 削除関連
const showDeleteModal = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const deleteErrorMessage = ref('')
const deleting = ref(false)

// 購入関連
const showPurchaseModal = ref(false)
const showPurchaseSuccessModal = ref(false)
const showPurchaseErrorModal = ref(false)
const purchaseErrorMessage = ref('')
const purchasing = ref(false)

/**
 * 編集ページへ遷移
 */
const goEdit = () => {
    void router.push(`/wishlist/${workId}/${id}/edit`)
}

/**
 * 購入ボタン押下
 */
const purchaseItem = () => {
    showPurchaseModal.value = true
}

/**
 * 購入確定処理
 * 1. 欲しいもののデータを在庫として登録
 * 2. 欲しいものリストから削除
 * 3. 在庫一覧ページへ遷移
 * ※どちらかの処理が失敗した場合はロールバック
 * @param newImageUrl - 新しくアップロードされた画像URL（nullの場合は既存の画像を使用）
 */
const confirmPurchase = async (newImageUrl: string | null) => {
    if (!item.value) return

    purchasing.value = true
    let createdOwnedItemId: number | null = null

    try {
        // 欲しいものデータを在庫データに変換
        const ownedItemPayload = {
            workId: item.value.workId,
            itemTypeId: item.value.itemTypeId,
            goodsName: item.value.goodsName,
            quantity: item.value.quantity || 1,
            unitPrice: item.value.expectedUnitPrice || 0,
            purchaseDate: new Date().toISOString().split('T')[0], // 今日の日付
            imageUrl: newImageUrl || item.value.imageUrl, // 新しい画像がある場合はそれを使用、なければ既存の画像
            memo: item.value.memo
        }

        // ステップ1: 在庫として登録
        const createdItem = await createOwnedItem(ownedItemPayload)
        createdOwnedItemId = createdItem.id

        // ステップ2: 欲しいものリストから削除
        try {
            await deleteItemApi(id)
        } catch (deleteError) {
            // 欲しいもの削除が失敗した場合、登録した在庫を削除（ロールバック）
            console.error('欲しいもの削除失敗、在庫をロールバックします', deleteError)
            if (createdOwnedItemId) {
                try {
                    await deleteOwnedItem(createdOwnedItemId)
                    console.log('在庫のロールバック完了')
                } catch (rollbackError) {
                    console.error('ロールバック失敗:', rollbackError)
                }
            }
            throw deleteError // エラーを再スロー
        }

        // 全ての処理が成功した場合のみ成功モーダルを表示
        showPurchaseModal.value = false
        showPurchaseSuccessModal.value = true
    } catch (e: any) {
        // エラー時
        showPurchaseModal.value = false
        purchaseErrorMessage.value = e?.message || '在庫登録に失敗しました'
        showPurchaseErrorModal.value = true
    } finally {
        purchasing.value = false
    }
}

/**
 * 購入成功モーダルを閉じて在庫一覧ページへ遷移
 */
const closePurchaseSuccessModal = async () => {
    showPurchaseSuccessModal.value = false
    await router.push(`/inventory/${workId}`)
}

/**
 * 削除処理
 */
const deleteItem = () => {
    showDeleteModal.value = true
}

/**
 * 削除確定処理
 */
const confirmDelete = async () => {
    deleting.value = true
    try {
        await deleteItemApi(id)
        showDeleteModal.value = false
        // 削除成功メッセージを表示
        showSuccessModal.value = true
    } catch (e: any) {
        // エラー時はモーダルを閉じてエラーメッセージを表示
        showDeleteModal.value = false
        deleteErrorMessage.value = e?.message || '削除に失敗しました'
        showErrorModal.value = true
    } finally {
        deleting.value = false
    }
}

/**
 * 成功モーダルを閉じて一覧ページへ遷移
 */
const closeSuccessModal = async () => {
    showSuccessModal.value = false
    await router.push('/wishlist')
}

// フッターに購入・編集・削除ボタンを追加
useFooterButtons([
    {
        label: '購入済み',
        icon: '✅',
        onClick: purchaseItem,
        class: 'footer-btn--purchase'
    },
    {
        label: '編集',
        icon: '✏️',
        onClick: goEdit,
        class: 'footer-btn--edit'
    },
    {
        label: '削除',
        icon: '🗑️',
        onClick: deleteItem,
        class: 'footer-btn--delete'
    }
])

onMounted(async () => {
    try {
        item.value = await fetchDetail(id)
    } catch (e) {
        // エラーはcomposable内で処理される
    }
})
</script>

<style scoped></style>
