<template>
    <div class="filterbar">
        <div class="filterbar__row">
            <select class="filterbar__select" :value="filters.itemTypeId ?? ''" @change="onItemTypeChange">
                <option value="">種類：すべて</option>
                <option v-for="t in itemTypes" :key="t.id" :value="t.id">{{ t.name }}</option>
            </select>

            <select class="filterbar__select" :value="filters.sort ?? 'purchaseDateDesc'" @change="onSortChange">
                <option value="purchaseDateDesc">購入日（新しい順）</option>
                <option value="purchaseDateAsc">購入日（古い順）</option>
                <option value="createdAtDesc">登録日（新しい順）</option>
                <option value="createdAtAsc">登録日（古い順）</option>
            </select>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { InventoryQuery } from '~/types/inventory'

const props = defineProps<{
    filters: InventoryQuery
}>()

const emit = defineEmits<{
    (e: 'update:filters', v: InventoryQuery): void
}>()

// 例：後でAPIから取得に置き換え
const itemTypes = ref<{ id: number; name: string }[]>([
    { id: 1, name: '缶バッチ' },
    { id: 2, name: 'アクスタ' },
])

const localKeyword = ref(props.filters.keyword ?? '')

watch(
    () => props.filters.keyword,
    (v) => { localKeyword.value = v ?? '' }
)

const onItemTypeChange = (e: Event) => {
    const v = (e.target as HTMLSelectElement).value
    emit('update:filters', { itemTypeId: v ? Number(v) : null })
}

const onSortChange = (e: Event) => {
    const v = (e.target as HTMLSelectElement).value
    emit('update:filters', { sort: v as any })
}

const applyKeyword = () => {
    emit('update:filters', { keyword: localKeyword.value.trim() || null })
}
</script>

<style scoped>
.filterbar {
    display: flex;
    justify-content: center;
}

.filterbar__row {
    display: flex;
    gap: 12px;
    align-items: center;
    width: min(980px, 100%);
}

.filterbar__select {
    height: 36px;
    padding: 0 10px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #fff;
}
</style>
