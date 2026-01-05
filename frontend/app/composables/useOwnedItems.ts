import { ref } from 'vue'

export type OwnedItem = {
    id: number
    workId?: number
    workName?: string | null
    itemTypeId?: number | null
    itemTypeName?: string | null
    name?: string | null
    goodsName?: string | null
    imageUrl?: string | null
    quantity?: number | null
    unitPrice?: number | null
    purchaseDate?: string | null
    memo?: string | null
    createdAt?: string | null
    updatedAt?: string | null
}

export type OwnedItemsListResponse = {
    items: OwnedItem[]
    // optional paging fields
    page?: number
    size?: number
    total?: number
}

export const useOwnedItems = () => {
    const items = ref<OwnedItem[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const meta = ref<{ page?: number; size?: number; total?: number } | null>(null)

    const fetchList = async (params: {
        workId?: number
        itemTypeId?: number | null
        keyword?: string | null
        page?: number
        size?: number
        sort?: string
    } = {}) => {
        loading.value = true
        error.value = null
        try {
            const { $api } = useNuxtApp()
            const res = await $api<OwnedItemsListResponse>('/api/v1/owned-items', { params })
            items.value = res.items ?? []
            meta.value = { page: res.page, size: res.size, total: res.total }
        } catch (e: any) {
            console.error('fetchOwnedItems failed', e)
            error.value = e?.message ?? String(e)
            items.value = []
            meta.value = null
        } finally {
            loading.value = false
        }
    }

    const create = async (payload: any) => {
        loading.value = true
        error.value = null
        try {
            const { $api } = useNuxtApp()
            const res = await $api<any>('/api/v1/owned-items', { method: 'POST', body: payload })
            return res
        } catch (e: any) {
            console.error('createOwnedItem failed', e)
            error.value = e?.message ?? String(e)
            throw e
        } finally {
            loading.value = false
        }
    }

    return { items, loading, error, meta, fetchList, create }
}

export default useOwnedItems
