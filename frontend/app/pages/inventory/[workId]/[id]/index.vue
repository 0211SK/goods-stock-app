<template>
    <CommonPageLayout title="グッズ詳細">
        <!-- 在庫詳細コンポーネント -->
        <InventoryDetail :item="item" :loading="loading" :error="error" />

        <!-- 削除確認・成功・失敗モーダル -->
        <DeleteConfirmModal :show-delete-modal="showDeleteModal" :show-success-modal="showSuccessModal"
            :show-error-modal="showErrorModal" :error-message="deleteErrorMessage" :deleting="deleting"
            @confirm="confirmDelete" @cancel="showDeleteModal = false" @close-success="closeSuccessModal"
            @close-error="showErrorModal = false" />
    </CommonPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from '#imports'
import CommonPageLayout from '~/components/common/CommonPageLayout.vue'
import DeleteConfirmModal from '~/components/common/DeleteConfirmModal.vue'
import InventoryDetail from '~/components/inventory/InventoryDetail.vue'
import { useOwnedItems } from '~/composables/useOwnedItems'
import { useFooterButtons } from '~/composables/useFooterButtons'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const workId = Number(route.params.workId)

const item = ref<any | null>(null)
const { loading, error, fetchDetail, deleteItem: deleteItemApi } = useOwnedItems()
const showDeleteModal = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const deleteErrorMessage = ref('')
const deleting = ref(false)

/**
 * 編集ページへ遷移
 */
const goEdit = () => {
    void router.push(`/inventory/${workId}/${id}/edit`)
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
    await router.push(`/inventory/${item.value.workId}`)
}

// フッターに編集・削除ボタンを追加
useFooterButtons([
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
