<template>
    <div class="inventory-list">
        <div v-if="loading" class="loading">読み込み中…</div>
        <div v-else-if="error" class="error">取得に失敗しました</div>
        <div v-else>
            <div class="grid">
                <article v-for="item in items" :key="item.id" class="card" role="link" @click="goToDetail(item)"
                    tabindex="0">
                    <div class="thumb">
                        <img v-if="item.imageUrl" :src="getImageUrl(item.imageUrl)" alt="" />
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
import { useImageUpload } from '~/composables/useImageUpload'
import { useRouter } from '#imports'

const { getImageUrl } = useImageUpload()

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
const router = useRouter()

const goToDetail = (item: any) => {
    const wid = props.workId ?? item.workId
    if (wid == null) {
        void router.push(`/inventory/${item.id}`)
        return
    }
    void router.push(`/inventory/${wid}/${item.id}`)
}

watchEffect(() => {
    // fetch when query changes
    fetchList(query.value as any)
})
</script>

<style scoped>
.inventory-list {
    margin-top: 18px;
    padding: 0 12px;
}

.loading,
.error {
    text-align: center;
    color: #666;
    padding: 40px 20px;
}

.grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    align-items: stretch;
}

.card {
    display: flex;
    flex-direction: column;
    background: #fff;
    border: 1px solid #e6e6e6;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
    cursor: pointer;
    transition: box-shadow 0.2s, transform 0.2s;
    height: 100%;
}

.card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.card:active {
    transform: translateY(0);
}

.thumb {
    width: 100%;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fafafa;
    overflow: hidden;
}

.thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.no-image {
    color: #999;
    font-size: 14px;
}

.body {
    padding: 12px 14px;
    flex: 1;
    display: flex;
    align-items: center;
}

.goods-name {
    font-size: 16px;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 1.4;
    width: 100%;
}

/* タブレット表示 */
@media (max-width: 1100px) {
    .grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
    }
}

/* スマホ横向き・小型タブレット */
@media (max-width: 800px) {
    .grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
    }

    .thumb {
        height: 120px;
    }

    .goods-name {
        font-size: 14px;
    }
}

/* スマホ縦向き */
@media (max-width: 480px) {
    .inventory-list {
        margin-top: 12px;
        padding: 0 6px;
    }

    .grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
    }

    .card {
        border-radius: 6px;
    }

    .thumb {
        height: 100px;
    }

    .body {
        padding: 6px 8px;
    }

    .goods-name {
        font-size: 13px;
        margin: 0;
        -webkit-line-clamp: 2;
    }

    .no-image {
        font-size: 11px;
    }
}

/* 極小スマホ（320px以下） */
@media (max-width: 360px) {
    .grid {
        gap: 6px;
    }

    .thumb {
        height: 90px;
    }

    .body {
        padding: 5px 6px;
    }

    .goods-name {
        font-size: 12px;
    }
}
</style>
