<template>
    <section class="page">
        <div class="box">
            <div class="box2">
                <PageTitle title="グッズ一覧" />

                <InventoryFilterBar :filters="filters" :workName="workName" @update:filters="updateFilters" />
            </div>
            <InventoryList :workId="workId" :filters="filters" />
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from '#imports'
import PageTitle from '~/components/common/PageTitle.vue'
import InventoryFilterBar from '~/components/inventory/InventoryFilterBar.vue'
import InventoryList from '~/components/inventory/InventoryList.vue'
import type { InventoryQuery, InventorySort } from '~/types/inventory'
import { useWorks } from '~/composables/useWorks'
import { useFooterButtons } from '~/composables/useFooterButtons'

const route = useRoute()
const router = useRouter()

const toNum = (v: unknown) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : null
}

const workId = computed<number | null>(() => toNum(route.params.id))

const { items: works, fetchWorks } = useWorks()

/**
 * 新規登録ページへ遷移
 */
const goToNew = () => {
    void router.push('/inventory/new')
}

// フッターに登録ボタンを追加
useFooterButtons([{
    label: '在庫データ登録',
    icon: '➕',
    onClick: goToNew
}])

onMounted(() => {
    void fetchWorks({ page: 1, size: 200 })
})

const workName = computed(() => {
    if (!workId.value) return null
    const w = works.value.find((x: any) => x.id === workId.value)
    return w ? w.name : null
})

const filters = computed<InventoryQuery>(() => {
    const q = route.query
    return {
        // workId は path param で固定するので、query には入れない
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

<style scoped>
.box2 {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 18px 12px;
}
</style>