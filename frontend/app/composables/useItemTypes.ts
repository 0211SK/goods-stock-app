import { ref } from 'vue'

export type ItemType = {
    id: number
    name: string
    createdAt?: string | null
}

export type ItemTypesListResponse = {
    items: ItemType[]
    page?: number
    size?: number
    totalCount?: number
    totalPages?: number
}

export const useItemTypes = () => {
    const items = ref<ItemType[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchList = async (params: { keyword?: string | null; page?: number; size?: number; sort?: string } = {}) => {
        loading.value = true
        error.value = null
        try {
            const { $api } = useNuxtApp()
            const res = await $api<ItemTypesListResponse>('/api/v1/item-types', { params })
            items.value = res.items ?? []
        } catch (e: any) {
            console.error('fetchItemTypes failed', e)
            error.value = e?.message ?? String(e)
            items.value = []
        } finally {
            loading.value = false
        }
    }

    return { items, loading, error, fetchList }
}

export default useItemTypes
