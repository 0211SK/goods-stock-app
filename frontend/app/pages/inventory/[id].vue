<template>
    <section class="page">
        <PageTitle title="在庫詳細" />

        <InventoryFilterBar :filters="filters" @update:filters="updateFilters" />

        <InventoryList :workId="workId" :filters="filters" />
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from '#imports'
import PageTitle from '~/components/common/PageTitle.vue'
import InventoryFilterBar from '~/components/inventory/InventoryFilterBar.vue'
import InventoryList from '~/components/inventory/InventoryList.vue'
import type { InventoryQuery, InventorySort } from '~/types/inventory'

const route = useRoute()
const router = useRouter()

const workId = computed(() => Number(route.params.workId))

const toNum = (v: unknown) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : null
}

const filters = computed<InventoryQuery>(() => {
    const q = route.query
    return {
        // workId は path param で固定するので、query には入れません
        itemTypeId: q.itemTypeId ? toNum(q.itemTypeId) : null,
        keyword: typeof q.keyword === 'string' ? q.keyword : null,
        page: q.page ? toNum(q.page) : 1,
        size: q.size ? toNum(q.size) : 20,
        sort: (typeof q.sort === 'string' ? (q.sort as InventorySort) : 'purchaseDateDesc'),
    }
})

const cleanQuery = (q: Record<string, any>) => {
    const out: Record<string, any> = {}
    for (const [k, v] of Object.entries(q)) {
        if (v === null || v === undefined || v === '') continue
        out[k] = String(v)
    }
    return out
}

const updateFilters = async (partial: InventoryQuery) => {
    const next: InventoryQuery = {
        ...filters.value,
        ...partial,
        page: 1, // フィルタ変更時はページリセット
    }
    await router.push({ query: cleanQuery(next as any) })
}
</script>
