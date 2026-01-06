<template>
    <section class="page">
        <PageTitle title="作品管理" />

        <div class="actions">
            <button class="btn-add" @click="openAddModal">+ 新規登録</button>
        </div>

        <div v-if="loading && items.length === 0" class="loading">読み込み中...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else-if="items.length === 0" class="empty">作品がまだ登録されていません</div>
        <div v-else class="works-list">
            <div v-for="work in items" :key="work.id" class="work-card">
                <div class="work-info">
                    <h3>{{ work.name }}</h3>
                    <p v-if="work.nameKana" class="kana">{{ work.nameKana }}</p>
                </div>
                <div class="work-actions">
                    <button class="btn-edit" @click="openEditModal(work)">編集</button>
                    <button class="btn-delete" @click="openDeleteModal(work)">削除</button>
                </div>
            </div>
        </div>

        <!-- 登録・編集モーダル -->
        <div v-if="showFormModal" class="modal-overlay" @click="closeFormModal">
            <div class="modal-content" @click.stop>
                <h2>{{ editingWork ? '作品を編集' : '作品を登録' }}</h2>
                <form @submit.prevent="submitForm">
                    <div class="form-group">
                        <label for="name">作品名 *</label>
                        <input id="name" v-model="formData.name" type="text" required placeholder="作品名を入力" />
                    </div>
                    <div class="form-group">
                        <label for="nameKana">よみがな *</label>
                        <input id="nameKana" v-model="formData.nameKana" type="text" required placeholder="よみがなを入力" />
                    </div>
                    <div class="form-group">
                        <label for="memo">メモ</label>
                        <textarea id="memo" v-model="formData.memo" rows="3" placeholder="メモを入力（任意）"></textarea>
                    </div>
                    <div class="form-buttons">
                        <button type="button" class="btn-cancel" :disabled="loading" @click="closeFormModal">
                            キャンセル
                        </button>
                        <button type="submit" class="btn-submit" :disabled="loading">
                            {{ loading ? '処理中...' : (editingWork ? '更新' : '登録') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

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

/** 作品一覧 */
.works-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 800px;
    margin: 0 auto;
}

.work-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    transition: box-shadow 0.2s;
}

.work-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.work-info h3 {
    margin: 0 0 4px 0;
    font-size: 16px;
    font-weight: 600;
}

.work-info .kana {
    margin: 0;
    font-size: 13px;
    color: #666;
}

.work-actions {
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

.form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
    font-family: inherit;
    resize: vertical;
}

.form-group textarea:focus {
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

    .work-card {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .work-actions {
        width: 100%;
        justify-content: flex-end;
    }
}
</style>
