import { ref } from 'vue'

export type WorkItem = {
    id: number
    name: string
    nameKana?: string | null
    memo?: string | null
}
export type WorksResponse = {
    items: Array<{
        id: number
        name: string
        nameKana?: string | null
        memo?: string | null
    }>
}

export const useWorks = () => {
    const items = ref<WorkItem[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    /**
     * 作品一覧を取得
     */
    const fetchWorks = async (params: { page?: number; size?: number; keyword?: string | null; sort?: string } = {}) => {
        loading.value = true
        error.value = null
        try {
            const { $api } = useNuxtApp()
            const res = await $api<WorksResponse>('/api/v1/works', { params })
            items.value = (res.items ?? []).map((i: any) => ({
                id: i.id,
                name: i.name,
                nameKana: i.nameKana,
                memo: i.memo
            }))
        } catch (e: any) {
            console.error('fetchWorks failed', e)
            const errorMessage = e?.data?.message || e?.message || String(e)
            error.value = errorMessage
            items.value = []
        } finally {
            loading.value = false
        }
    }

    /**
     * 作品を新規登録
     */
    const createWork = async (data: { name: string; nameKana: string; memo?: string }) => {
        loading.value = true
        error.value = null
        try {
            const { $api } = useNuxtApp()
            await $api('/api/v1/works', {
                method: 'POST',
                body: data
            })
        } catch (e: any) {
            console.error('createWork failed', e)
            // バックエンドからのエラーメッセージを取得
            const errorMessage = e?.data?.message || e?.message || String(e)
            error.value = errorMessage
            throw new Error(errorMessage)
        } finally {
            loading.value = false
        }
    }

    /**
     * 作品を更新
     */
    const updateWork = async (id: number, data: { name: string; nameKana: string; memo?: string }) => {
        loading.value = true
        error.value = null
        try {
            const { $api } = useNuxtApp()
            await $api(`/api/v1/works/${id}`, {
                method: 'PUT',
                body: data
            })
        } catch (e: any) {
            console.error('updateWork failed', e)
            // バックエンドからのエラーメッセージを取得
            const errorMessage = e?.data?.message || e?.message || String(e)
            error.value = errorMessage
            throw new Error(errorMessage)
        } finally {
            loading.value = false
        }
    }

    /**
     * 作品を削除
     */
    const deleteWork = async (id: number) => {
        loading.value = true
        error.value = null
        try {
            const { $api } = useNuxtApp()
            await $api(`/api/v1/works/${id}`, {
                method: 'DELETE'
            })
        } catch (e: any) {
            console.error('deleteWork failed', e)
            // バックエンドからのエラーメッセージを取得
            const errorMessage = e?.data?.message || e?.message || String(e)
            error.value = errorMessage
            throw new Error(errorMessage)
        } finally {
            loading.value = false
        }
    }

    return { items, loading, error, fetchWorks, createWork, updateWork, deleteWork }
}

export default useWorks
