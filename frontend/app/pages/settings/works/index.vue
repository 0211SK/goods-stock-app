<template>
    <section class="page">
        <PageTitle title="作品管理" />

        <!-- 作品一覧コンポーネント -->
        <WorksList :items="items" :loading="loading" :error="error" @add="openAddModal" @edit="openEditModal"
            @delete="openDeleteModal" />

        <!-- 登録・編集モーダル -->
        <WorksFormModal :show="showFormModal" :name="formData.name" :name-kana="formData.nameKana" :memo="formData.memo"
            :is-editing="!!editingWork" :loading="loading" @close="closeFormModal" @submit="submitForm"
            @update:name="formData.name = $event" @update:name-kana="formData.nameKana = $event"
            @update:memo="formData.memo = $event" />

        <!-- 削除確認・成功・失敗モーダル -->
        <DeleteConfirmModal :show-delete-modal="showDeleteModal" :show-success-modal="showSuccessModal"
            :show-error-modal="showErrorModal" :error-message="deleteErrorMessage" :deleting="deleting"
            @confirm="confirmDelete" @cancel="showDeleteModal = false" @close-success="closeSuccessModal"
            @close-error="closeErrorModal" />
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageTitle from '~/components/common/PageTitle.vue'
import DeleteConfirmModal from '~/components/common/DeleteConfirmModal.vue'
import WorksList from '~/components/settings/WorksList.vue'
import WorksFormModal from '~/components/settings/WorksFormModal.vue'
import { useWorks, type WorkItem } from '~/composables/useWorks'

const { items, loading, error, fetchWorks, createWork, updateWork, deleteWork } = useWorks()

const showFormModal = ref(false)
const showDeleteModal = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const deleteErrorMessage = ref('')
const deleting = ref(false)
const editingWork = ref<WorkItem | null>(null)
const deletingWork = ref<WorkItem | null>(null)

const formData = ref({
    name: '',
    nameKana: '',
    memo: ''
})

/**
 * 新規登録モーダルを開く
 */
const openAddModal = () => {
    editingWork.value = null
    formData.value = { name: '', nameKana: '', memo: '' }
    showFormModal.value = true
}

/**
 * 編集モーダルを開く
 */
const openEditModal = (work: WorkItem) => {
    editingWork.value = work
    formData.value = {
        name: work.name,
        nameKana: work.nameKana || '',
        memo: work.memo || ''
    }
    showFormModal.value = true
}

/**
 * フォームを送信
 */
const submitForm = async () => {
    // よみがなのバリデーション（ひらがなと伸ばし棒のみ許可）
    const hiraganaPattern = /^[\u3040-\u309F\u30FC]+$/
    if (formData.value.nameKana && !hiraganaPattern.test(formData.value.nameKana)) {
        deleteErrorMessage.value = '読み仮名はひらがなで入力してください'
        showErrorModal.value = true
        return
    }

    try {
        if (editingWork.value) {
            await updateWork(editingWork.value.id, formData.value)
        } else {
            await createWork(formData.value)
        }
        closeFormModal()
        await fetchWorks()
    } catch (e: any) {
        deleteErrorMessage.value = e?.message || 'エラーが発生しました'
        showErrorModal.value = true
    }
}

/**
 * フォームモーダルを閉じる
 */
const closeFormModal = () => {
    showFormModal.value = false
    editingWork.value = null
    formData.value = { name: '', nameKana: '', memo: '' }
}

/**
 * 削除確認モーダルを開く
 */
const openDeleteModal = (work: WorkItem) => {
    deletingWork.value = work
    showDeleteModal.value = true
}

/**
 * 削除を実行
 */
const confirmDelete = async () => {
    if (!deletingWork.value) return

    deleting.value = true
    try {
        await deleteWork(deletingWork.value.id)
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
    deletingWork.value = null
    await fetchWorks()
}

/**
 * エラーモーダルを閉じて一覧を更新
 */
const closeErrorModal = async () => {
    showErrorModal.value = false
    await fetchWorks()
}

onMounted(async () => {
    await fetchWorks()
})
</script>
