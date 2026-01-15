<template>
    <CommonPageLayout title="欲しいものリスト">
        <template #filter>
            <WishlistFilterBar :filters="filters" @update:filters="updateFilters" />
        </template>
        <WishlistList :workId="null" :filters="normalizedFilters" />
    </CommonPageLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from '#imports'
import CommonPageLayout from '~/components/common/CommonPageLayout.vue'
import WishlistFilterBar from '~/components/wishlist/WishlistFilterBar.vue'
import WishlistList from '~/components/wishlist/WishlistList.vue'
import type { WishlistQuery, WishlistSort } from '~/types/wishlist'
import { useFooterButtons } from '~/composables/useFooterButtons'

const route = useRoute()
const router = useRouter()

const toNum = (v: unknown) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : undefined
}

/**
 * 新規登録ページへ遷移
 */
const goToNew = () => {
    void router.push('/wishlist/new')
}

// フッターに登録ボタンを追加
useFooterButtons([{
    label: '欲しいもの登録',
    icon: '➕',
    onClick: goToNew
}])

const filters = computed<WishlistQuery>(() => {
    const q = route.query
    return {
        workId: q.workId ? toNum(q.workId) : undefined,
        itemTypeId: q.itemTypeId ? toNum(q.itemTypeId) : undefined,
        keyword: typeof q.keyword === 'string' ? q.keyword : undefined,
        page: q.page ? toNum(q.page) : 1,
        size: q.size ? toNum(q.size) : 20,
        sort: (typeof q.sort === 'string' ? (q.sort as WishlistSort) : 'releaseDateDesc'),
    }
})

const normalizedFilters = computed<WishlistQuery>(() => {
    return {
        workId: filters.value.workId ?? undefined,
        itemTypeId: filters.value.itemTypeId ?? undefined,
        keyword: filters.value.keyword ?? undefined,
        page: filters.value.page ?? undefined,
        size: filters.value.size ?? undefined,
        sort: filters.value.sort ?? undefined,
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

const updateFilters = async (partial: WishlistQuery) => {
    const next: WishlistQuery = {
        ...filters.value,
        ...partial,
        page: 1, // フィルタ変更時はページリセット
    }
    await router.push({ query: cleanQuery(next as any) })
}
</script>

<style scoped></style>
