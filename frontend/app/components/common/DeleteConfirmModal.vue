<template>
    <!-- 削除確認モーダル -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="$emit('cancel')">
        <div class="modal-content" @click.stop>
            <p class="modal-message">本当に削除しますか？</p>
            <div class="modal-buttons">
                <button class="btn-cancel" :disabled="deleting" @click="$emit('cancel')">キャンセル</button>
                <button class="btn-confirm" :disabled="deleting" @click="$emit('confirm')">
                    {{ deleting ? '削除中...' : '削除' }}
                </button>
            </div>
        </div>
    </div>

    <!-- 削除成功モーダル -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="$emit('close-success')">
        <div class="modal-content" @click.stop>
            <p class="modal-message success">削除しました</p>
            <div class="modal-buttons">
                <button class="btn-success" @click="$emit('close-success')">OK</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * 削除確認・成功モーダルコンポーネント
 * 
 * アイテムの削除確認と削除成功を表示する共通モーダル
 */

// Props定義
defineProps<{
    /** 削除確認モーダルの表示状態 */
    showDeleteModal: boolean
    /** 削除成功モーダルの表示状態 */
    showSuccessModal: boolean
    /** 削除処理中フラグ */
    deleting: boolean
}>()

// イベント定義
defineEmits<{
    /** 削除確定時に発火 */
    confirm: []
    /** キャンセル時に発火 */
    cancel: []
    /** 成功モーダルを閉じる時に発火 */
    'close-success': []
}>()
</script>

<style scoped>
/* モーダルオーバーレイ */
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

/* モーダルコンテンツ */
.modal-content {
    background: white;
    border-radius: 8px;
    padding: 32px;
    min-width: 320px;
    max-width: 90%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-message {
    font-size: 16px;
    margin: 0 0 24px 0;
    text-align: center;
    color: #333;
}

.modal-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.btn-cancel,
.btn-confirm {
    padding: 10px 24px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-cancel {
    background-color: #e0e0e0;
    color: #333;
}

.btn-cancel:hover {
    background-color: #d0d0d0;
}

.btn-confirm {
    background-color: #d32f2f;
    color: white;
}

.btn-confirm:hover {
    background-color: #b71c1c;
}

.btn-cancel:disabled,
.btn-confirm:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-success {
    padding: 10px 24px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
    background-color: #4caf50;
    color: white;
}

.btn-success:hover {
    background-color: #45a049;
}

.modal-message.success {
    color: #4caf50;
    font-weight: 500;
}
</style>
