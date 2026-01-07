<template>
    <section class="page">
        <PageTitle title="欲しいもの詳細" />

        <!-- 欲しいもの詳細コンポーネント -->
        <WishlistDetail :item="item" :loading="loading" :error="error" />

        <!-- 削除確認・成功・失敗モーダル -->
        <DeleteConfirmModal :show-delete-modal="showDeleteModal" :show-success-modal="showSuccessModal"
            :show-error-modal="showErrorModal" :error-message="deleteErrorMessage" :deleting="deleting"
            @confirm="confirmDelete" @cancel="showDeleteModal = false" @close-success="closeSuccessModal"
            @close-error="showErrorModal = false" />
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from '#imports'
import PageTitle from '~/components/common/PageTitle.vue'
import DeleteConfirmModal from '~/components/common/DeleteConfirmModal.vue'
import WishlistDetail from '~/components/wishlist/WishlistDetail.vue'
import { useWishlistItems } from '~/composables/useWishlistItems'
import { useFooterButtons } from '~/composables/useFooterButtons'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const workId = Number(route.params.workId)

const item = ref<any | null>(null)
const { loading, error, fetchDetail, deleteItem: deleteItemApi } = useWishlistItems()
const showDeleteModal = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const deleteErrorMessage = ref('')
const deleting = ref(false)

/**
 * 編集ページへ遷移
 */
const goEdit = () => {
    void router.push(`/wishlist/${workId}/${id}/edit`)
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
