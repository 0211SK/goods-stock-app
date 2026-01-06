<template>
    <section class="page">
        <PageTitle title="種類管理" />

        <div class="actions">
            <button class="btn-add" @click="openAddModal">+ 新規登録</button>
        </div>

        <div v-if="loading && items.length === 0" class="loading">読み込み中...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else-if="items.length === 0" class="empty">種類がまだ登録されていません</div>
        <div v-else class="types-list">
            <div v-for="type in items" :key="type.id" class="type-card">
                <div class="type-info">
                    <h3>{{ type.name }}</h3>
                </div>
                <div class="type-actions">
                    <button class="btn-edit" @click="openEditModal(type)">編集</button>
                    <button class="btn-delete" @click="openDeleteModal(type)">削除</button>
                </div>
            </div>
        </div>

        <!-- 登録・編集モーダル -->
        <div v-if="showFormModal" class="modal-overlay" @click="closeFormModal">
            <div class="modal-content" @click.stop>
                <h2>{{ editingType ? '種類を編集' : '種類を登録' }}</h2>
                <form @submit.prevent="submitForm">
                    <div class="form-group">
                        <label for="name">種類名 *</label>
                        <input id="name" v-model="formData.name" type="text" required placeholder="種類名を入力" />
                    </div>
                    <div class="form-buttons">
                        <button type="button" class="btn-cancel" :disabled="loading" @click="closeFormModal">
                            キャンセル
                        </button>
                        <button type="submit" class="btn-submit" :disabled="loading">
                            {{ loading ? '処理中...' : (editingType ? '更新' : '登録') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- 削除確認・成功モーダル -->
        <DeleteConfirmModal :show-delete-modal="showDeleteModal" :show-success-modal="showSuccessModal"
            :deleting="deleting" @confirm="confirmDelete" @cancel="showDeleteModal = false"
            @close-success="closeSuccessModal" />
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageTitle from '~/components/common/PageTitle.vue'
import DeleteConfirmModal from '~/components/common/DeleteConfirmModal.vue'
import { useItemTypes, type ItemType } from '~/composables/useItemTypes'

const { items, loading, fetchList, createItemType, updateItemType, deleteItemType } = useItemTypes()

const error = ref<string | null>(null)
const showFormModal = ref(false)
const showDeleteModal = ref(false)
const showSuccessModal = ref(false)
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
        alert('削除に失敗しました: ' + (e?.message || '不明なエラー'))
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

<style scoped>
/** アクションボタンエリア */
.actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
    padding: 0 20px;
}

.btn-add {
    padding: 12px 24px;
    background: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-add:hover {
    background: #45a049;
}

/** 状態表示 */
.loading,
.error,
.empty {
    text-align: center;
    padding: 40px;
    color: #666;
}

.error {
    color: #d32f2f;
}

/** 種類一覧 */
.types-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 800px;
    margin: 0 auto;
}

.type-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    transition: box-shadow 0.2s;
}

.type-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.type-info h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
}

.type-actions {
    display: flex;
    gap: 8px;
}

.btn-edit,
.btn-delete {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-edit {
    background: #2196f3;
    color: white;
}

.btn-edit:hover {
    background: #1976d2;
}

.btn-delete {
    background: #f44336;
    color: white;
}

.btn-delete:hover {
    background: #d32f2f;
}

/** モーダル */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 8px;
    padding: 32px;
    min-width: 400px;
    max-width: 90%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-content h2 {
    margin: 0 0 24px 0;
    font-size: 20px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
}

.form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
}

.form-group input:focus {
    outline: none;
    border-color: #2196f3;
}

.form-buttons {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 24px;
}

.btn-cancel,
.btn-submit {
    padding: 10px 24px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-cancel {
    background: #e0e0e0;
    color: #333;
}

.btn-cancel:hover {
    background: #d0d0d0;
}

.btn-submit {
    background: #4caf50;
    color: white;
}

.btn-submit:hover {
    background: #45a049;
}

.btn-cancel:disabled,
.btn-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

@media (max-width: 480px) {
    .modal-content {
        min-width: auto;
        padding: 24px;
    }

    .type-card {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .type-actions {
        width: 100%;
        justify-content: flex-end;
    }
}
</style>
