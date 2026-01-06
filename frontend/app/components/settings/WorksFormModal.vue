<template>
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
        <div class="modal-content" @click.stop>
            <h2>{{ isEditing ? '作品を編集' : '作品を登録' }}</h2>
            <form @submit.prevent="$emit('submit')">
                <div class="form-group">
                    <label for="name">作品名 *</label>
                    <input id="name" :value="name"
                        @input="$emit('update:name', ($event.target as HTMLInputElement).value)" type="text" required
                        placeholder="作品名を入力" />
                </div>
                <div class="form-group">
                    <label for="nameKana">よみがな *</label>
                    <input id="nameKana" :value="nameKana"
                        @input="$emit('update:nameKana', ($event.target as HTMLInputElement).value)" type="text"
                        required placeholder="よみがなを入力" />
                </div>
                <div class="form-group">
                    <label for="memo">メモ</label>
                    <textarea id="memo" :value="memo"
                        @input="$emit('update:memo', ($event.target as HTMLTextAreaElement).value)" rows="3"
                        placeholder="メモを入力（任意）"></textarea>
                </div>
                <div class="form-buttons">
                    <button type="button" class="btn-cancel" :disabled="loading" @click="$emit('close')">
                        キャンセル
                    </button>
                    <button type="submit" class="btn-submit" :disabled="loading">
                        {{ loading ? '処理中...' : (isEditing ? '更新' : '登録') }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    show: boolean
    name: string
    nameKana: string
    memo: string
    isEditing: boolean
    loading: boolean
}>()

defineEmits<{
    close: []
    submit: []
    'update:name': [value: string]
    'update:nameKana': [value: string]
    'update:memo': [value: string]
}>()
</script>

<style scoped>
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
}
</style>
