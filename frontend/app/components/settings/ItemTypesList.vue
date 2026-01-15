<template>
    <div>
        <div class="actions">
            <button class="btn-add" @click="$emit('add')">+ 新規登録</button>
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
                    <button class="btn-edit" @click="$emit('edit', type)">編集</button>
                    <button class="btn-delete" @click="$emit('delete', type)">削除</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ItemType } from '~/composables/useItemTypes'

defineProps<{
    items: ItemType[]
    loading: boolean
    error: string | null
}>()

defineEmits<{
    add: []
    edit: [type: ItemType]
    delete: [type: ItemType]
}>()
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

@media (max-width: 480px) {
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
