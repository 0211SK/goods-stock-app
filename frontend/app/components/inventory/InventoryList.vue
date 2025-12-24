<template>
    <div class="list">
        <div v-if="pending">読み込み中…</div>
        <div v-else-if="error">取得に失敗しました</div>
        <div v-else>
            <pre>{{ data }}</pre>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { InventoryQuery } from '~/types/inventory'
import { computed } from 'vue'
// useAuth は既存のものを想定（tokenを取り出せるようにしてください）
import { useAuth } from '~/composables/useAuth'

const props = defineProps<{
    workId: number
    filters: InventoryQuery
}>()
const { token } = useAuth()

const query = computed(() => ({
    workId: props.workId, // ここで必ず付与
    itemTypeId: props.filters.itemTypeId ?? undefined,
    keyword: props.filters.keyword ?? undefined,
    page: props.filters.page ?? 1,
    size: props.filters.size ?? 20,
    sort: props.filters.sort ?? 'purchaseDateDesc',
}))

const { data, pending, error, refresh } = await useFetch('/api/owned-items', {
    baseURL: 'http://localhost:8080',
    query,
    headers: computed(() => ({
        Authorization: token.value ? `Bearer ${token.value}` : '',
    })),
    watch: [query, token],
})
</script>

<style scoped>
.list {
    display: flex;
    justify-content: center;
    margin-top: 18px;
}
</style>
