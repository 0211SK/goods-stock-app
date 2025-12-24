import { ref } from 'vue'

export type WorkItem = { id: number; name: string; nameKana?: string | null }
export type WorksResponse = { items: Array<{ id: number; name: string; nameKana?: string | null }> }

export const useWorks = () => {
    const items = ref<WorkItem[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchWorks = async (params: { page?: number; size?: number; keyword?: string | null; sort?: string } = {}) => {
        loading.value = true
        error.value = null
        try {
            const { $api } = useNuxtApp()
            const res = await $api<WorksResponse>('/api/v1/works', { params })
            items.value = (res.items ?? []).map((i: any) => ({ id: i.id, name: i.name, nameKana: i.nameKana }))
        } catch (e: any) {
            console.error('fetchWorks failed', e)
            error.value = e?.message ?? String(e)
            items.value = []
        } finally {
            loading.value = false
        }
    }

    return { items, loading, error, fetchWorks }
}

export default useWorks
