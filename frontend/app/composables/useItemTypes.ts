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

    /**
     * 種類一覧を取得
     */
    const fetchList = async (params: { keyword?: string | null; page?: number; size?: number; sort?: string } = {}) => {
        loading.value = true
        error.value = null
        try {
            const { $api } = useNuxtApp()
            const res = await $api<ItemTypesListResponse>('/api/v1/item-types', { params })
            items.value = res.items ?? []
        } catch (e: any) {
            console.error('fetchItemTypes failed', e)
            const errorMessage = e?.data?.message || e?.message || String(e)
            error.value = errorMessage
            items.value = []
        } finally {
            loading.value = false
        }
    }

    /**
     * 種類を新規登録
     */
    const createItemType = async (data: { name: string }) => {
        loading.value = true
        error.value = null
        try {
            const { $api } = useNuxtApp()
            await $api('/api/v1/item-types', {
                method: 'POST',
                body: data
            })
        } catch (e: any) {
            console.error('createItemType failed', e)
            const errorMessage = e?.data?.message || e?.message || String(e)
            error.value = errorMessage
            throw new Error(errorMessage)
        } finally {
            loading.value = false
        }
    }

    /**
     * 種類を更新
     */
    const updateItemType = async (id: number, data: { name: string }) => {
        loading.value = true
        error.value = null
        try {
            const { $api } = useNuxtApp()
            await $api(`/api/v1/item-types/${id}`, {
                method: 'PUT',
                body: data
            })
        } catch (e: any) {
            console.error('updateItemType failed', e)
            const errorMessage = e?.data?.message || e?.message || String(e)
            error.value = errorMessage
            throw new Error(errorMessage)
        } finally {
            loading.value = false
        }
    }

    /**
     * 種類を削除
     */
    const deleteItemType = async (id: number) => {
        loading.value = true
        error.value = null
        try {
            const { $api } = useNuxtApp()
            await $api(`/api/v1/item-types/${id}`, {
                method: 'DELETE'
            })
        } catch (e: any) {
            console.error('deleteItemType failed', e)
            // バックエンドからのエラーメッセージを取得
            const errorMessage = e?.data?.message || e?.message || String(e)
            error.value = errorMessage
            throw new Error(errorMessage)
        } finally {
            loading.value = false
        }
    }

    return { items, loading, error, fetchList, createItemType, updateItemType, deleteItemType }
}

export default useItemTypes
