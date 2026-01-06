<template>
    <section class="page">
        <PageTitle title="種類管理" />

        <!-- 種類一覧コンポーネント -->
        <ItemTypesList :items="items" :loading="loading" :error="error" @add="openAddModal" @edit="openEditModal"
            @delete="openDeleteModal" />

        <!-- 登録・編集モーダル -->
        <ItemTypesFormModal :show="showFormModal" :name="formData.name" :is-editing="!!editingType" :loading="loading"
            @close="closeFormModal" @submit="submitForm" @update:name="formData.name = $event" />

        <!-- 削除確認・成功・失敗モーダル -->
        <DeleteConfirmModal :show-delete-modal="showDeleteModal" :show-success-modal="showSuccessModal"
            :show-error-modal="showErrorModal" :error-message="deleteErrorMessage" :deleting="deleting"
            @confirm="confirmDelete" @cancel="showDeleteModal = false" @close-success="closeSuccessModal"
            @close-error="showErrorModal = false" />
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageTitle from '~/components/common/PageTitle.vue'
import DeleteConfirmModal from '~/components/common/DeleteConfirmModal.vue'
import ItemTypesList from '~/components/settings/ItemTypesList.vue'
import ItemTypesFormModal from '~/components/settings/ItemTypesFormModal.vue'
import { useItemTypes, type ItemType } from '~/composables/useItemTypes'

const { items, loading, fetchList, createItemType, updateItemType, deleteItemType } = useItemTypes()

const error = ref<string | null>(null)
const showFormModal = ref(false)
const showDeleteModal = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const deleteErrorMessage = ref('')
const deleting = ref(false)
const editingType = ref<ItemType | null>(null)
const deletingType = ref<ItemType | null>(null)

const formData = ref({
    name: ''
})

/**
 * 新規登録モーダルを開く
 */
const openAddModal = () => {
    editingType.value = null
    formData.value = { name: '' }
    showFormModal.value = true
}

/**
 * 編集モーダルを開く
 */
const openEditModal = (type: ItemType) => {
    editingType.value = type
    formData.value = {
        name: type.name
    }
    showFormModal.value = true
}

/**
 * フォームを送信
 */
const submitForm = async () => {
    try {
        if (editingType.value) {
            await updateItemType(editingType.value.id, formData.value)
        } else {
            await createItemType(formData.value)
        }
        closeFormModal()
        await fetchList()
    } catch (e: any) {
        alert('エラーが発生しました: ' + (e?.message || '不明なエラー'))
    }
}

/**
 * フォームモーダルを閉じる
 */
const closeFormModal = () => {
    showFormModal.value = false
    editingType.value = null
    formData.value = { name: '' }
}

/**
 * 削除確認モーダルを開く
 */
const openDeleteModal = (type: ItemType) => {
    deletingType.value = type
    showDeleteModal.value = true
}

/**
 * 削除を実行
 */
const confirmDelete = async () => {
    if (!deletingType.value) return

    deleting.value = true
    try {
        await deleteItemType(deletingType.value.id)
        showDeleteModal.value = false
        showSuccessModal.value = true
    } catch (e: any) {
        showDeleteModal.value = false
        deleteErrorMessage.value = e?.message || '削除に失敗しました'
        showErrorModal.value = true
    } finally {
        deleting.value = false
    }
}

/**
 * 削除成功モーダルを閉じて一覧を更新
 */
const closeSuccessModal = async () => {
    showSuccessModal.value = false
    deletingType.value = null
    await fetchList()
}

onMounted(async () => {
    await fetchList()
})
</script>