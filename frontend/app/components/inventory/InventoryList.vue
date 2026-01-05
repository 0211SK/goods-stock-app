<template>
    <div class="inventory-list">
        <div v-if="loading" class="loading">読み込み中…</div>
        <div v-else-if="error" class="error">取得に失敗しました</div>
        <div v-else>
            <div class="grid">
                <article v-for="item in items" :key="item.id" class="card">
                    <div class="thumb">
                        <img v-if="item.imageUrl" :src="item.imageUrl" alt="" />
                        <div v-else class="no-image">画像なし</div>
                    </div>
                    <div class="body">
                        <h3 class="goods-name">{{ item.goodsName ?? item.name ?? '無名のグッズ' }}</h3>
                    </div>
                </article>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { InventoryQuery } from '~/types/inventory'
import { computed, watchEffect } from 'vue'
import { useOwnedItems } from '~/composables/useOwnedItems'

const props = defineProps<{
    workId: number | null
    filters: InventoryQuery
}>()

const query = computed(() => ({
    workId: props.workId ?? undefined,
    itemTypeId: props.filters.itemTypeId ?? undefined,
    keyword: props.filters.keyword ?? undefined,
    page: props.filters.page ?? 1,
    size: props.filters.size ?? 20,
    sort: props.filters.sort ?? 'purchaseDateDesc',
}))

const { items, loading, error, fetchList } = useOwnedItems()

watchEffect(() => {
    // fetch when query changes
    fetchList(query.value as any)
})
</script>

<style scoped>
.inventory-list {
    margin-top: 18px;
}

.loading,
.error {
    text-align: center;
    color: #666;
}

.grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    align-items: start;
}

.card {
    display: flex;
    flex-direction: column;
    background: #fff;
    border: 1px solid #e6e6e6;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.thumb {
    width: 100%;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fafafa;
}

.thumb img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.no-image {
    color: #999;
    font-size: 14px;
}

.body {
    padding: 12px 14px;
}

.goods-name {
    font-size: 16px;
    margin: 0 0 6px 0;
}

@media (max-width: 1100px) {
    .grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 800px) {
    .grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 480px) {
    .grid {
        grid-template-columns: 1fr;
    }
}
</style>
