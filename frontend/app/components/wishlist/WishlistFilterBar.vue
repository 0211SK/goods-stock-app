<template>
    <div class="filterbar">
        <div class="box">
            <div class="filterbar__row">
                <select class="filterbar__select" :value="filters.workId ?? ''" @change="onWorkChange">
                    <option value="">作品：すべて</option>
                    <option v-for="w in works" :key="w.id" :value="w.id">{{ w.name }}</option>
                </select>

                <select class="filterbar__select" :value="filters.itemTypeId ?? ''" @change="onItemTypeChange">
                    <option value="">種類：すべて</option>
                    <option v-for="t in itemTypes" :key="t.id" :value="t.id">{{ t.name }}</option>
                </select>

                <select class="filterbar__select" :value="filters.sort ?? 'releaseDateDesc'" @change="onSortChange">
                    <option value="releaseDateDesc">発売日（新しい順）</option>
                    <option value="releaseDateAsc">発売日（古い順）</option>
                    <option value="createdAtDesc">登録日（新しい順）</option>
                    <option value="createdAtAsc">登録日（古い順）</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { WishlistQuery } from '~/types/wishlist'
import { onMounted } from 'vue'
import { useItemTypes } from '~/composables/useItemTypes'
import { useWorks } from '~/composables/useWorks'

const props = defineProps<{
    filters: WishlistQuery
}>()

const emit = defineEmits<{
    (e: 'update:filters', v: WishlistQuery): void
}>()

const { items: works, fetchWorks } = useWorks()
const { items: itemTypes, fetchList: fetchItemTypes } = useItemTypes()

onMounted(() => {
    void fetchWorks({ page: 1, size: 200 })
    void fetchItemTypes({ page: 1, size: 200 })
})

const onWorkChange = (e: Event) => {
    const v = (e.target as HTMLSelectElement).value
    emit('update:filters', { workId: v ? Number(v) : undefined })
}

const onItemTypeChange = (e: Event) => {
    const v = (e.target as HTMLSelectElement).value
    emit('update:filters', { itemTypeId: v ? Number(v) : undefined })
}

const onSortChange = (e: Event) => {
    const v = (e.target as HTMLSelectElement).value
    emit('update:filters', { sort: v as any })
}
</script>

<style scoped>
.filterbar {
    display: flex;
    justify-content: center;
}

.box {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: min(980px, 100%);
    padding: 12px 0;
}

.filterbar__row {
    display: flex;
    gap: 12px;
    align-items: center;
    width: min(980px, 100%);
    flex-wrap: wrap;
    word-break: break-all;
}

.filterbar__select {
    height: 36px;
    padding: 0 10px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #fff;
    flex: 1 1 0;
    min-width: 120px;
    max-width: 100%;
    box-sizing: border-box;
}

@media (max-width: 500px) {
    .filterbar__select {
        font-size: 12px;
        padding: 0 5px;
    }

    .filterbar__row {
        flex-wrap: wrap;
        flex-direction: row;
        gap: 8px;
    }

    /* 作品セレクトだけ上に表示・幅100% */
    .filterbar__select:first-child {
        flex-basis: 100%;
        min-width: 100%;
        order: 1;
    }

    /* その他のセレクトを下に横並び */
    .filterbar__select:nth-child(2),
    .filterbar__select:nth-child(3) {
        flex-basis: 48%;
        min-width: 0;
        order: 2;
    }
}
</style>
