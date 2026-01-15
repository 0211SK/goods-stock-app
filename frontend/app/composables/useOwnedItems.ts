import { ref } from 'vue'

/**
 * 所有アイテム（在庫）の型定義
 * データベースのowned_itemsテーブルに対応
 */
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

/**
 * 所有アイテム一覧取得APIのレスポンス型
 * ページネーション情報を含む
 */
export type OwnedItemsListResponse = {
    items: OwnedItem[]
    // ページネーション情報（オプショナル）
    page?: number
    size?: number
    total?: number
}

/**
 * 所有アイテム（在庫）の管理を行うコンポーザブル関数
 * 一覧取得、詳細取得、登録、更新などのAPI呼び出しと状態管理を提供
 */
export const useOwnedItems = () => {
    // 一覧データ
    const items = ref<OwnedItem[]>([])
    // API呼び出し中フラグ
    const loading = ref(false)
    // エラーメッセージ
    const error = ref<string | null>(null)
    // ページネーション情報
    const meta = ref<{ page?: number; size?: number; total?: number } | null>(null)

    /**
     * 所有アイテム一覧を取得
     * @param params 検索条件（作品ID、種類ID、キーワード、ページング、ソート）
     */
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
            // APIから一覧データを取得
            const { $api } = useNuxtApp()
            const res = await $api<OwnedItemsListResponse>('/api/v1/owned-items', { params })
            // 取得結果を状態に反映
            items.value = res.items ?? []
            meta.value = { page: res.page, size: res.size, total: res.total }
        } catch (e: any) {
            // エラー時は空配列を設定し、エラーメッセージを保存
            console.error('fetchOwnedItems failed', e)
            const errorMessage = e?.data?.message || e?.message || String(e)
            error.value = errorMessage
            items.value = []
            meta.value = null
        } finally {
            loading.value = false
        }
    }

    /**
     * 新規所有アイテムを登録
     * @param payload 登録するアイテムのデータ
     * @returns 登録されたアイテムのデータ
     * @throws API呼び出しエラー時は例外をスロー
     */
    const create = async (payload: any) => {
        loading.value = true
        error.value = null
        try {
            // POSTメソッドでデータを送信
            const { $api } = useNuxtApp()
            const res = await $api<any>('/api/v1/owned-items', { method: 'POST', body: payload })
            return res
        } catch (e: any) {
            // エラー時はエラーメッセージを保存して例外を再スロー
            console.error('createOwnedItem failed', e)
            const errorMessage = e?.data?.message || e?.message || String(e)
            error.value = errorMessage
            throw new Error(errorMessage)
        } finally {
            loading.value = false
        }
    }

    /**
     * 所有アイテムの詳細情報を取得
     * @param id アイテムID
     * @returns アイテムの詳細データ
     * @throws API呼び出しエラー時は例外をスロー
     */
    const fetchDetail = async (id: number) => {
        loading.value = true
        error.value = null
        try {
            // 指定されたIDのアイテムを取得
            const { $api } = useNuxtApp()
            const res = await $api<OwnedItem>(`/api/v1/owned-items/${id}`)
            return res
        } catch (e: any) {
            // エラー時はエラーメッセージを保存して例外を再スロー
            console.error('fetchOwnedItemDetail failed', e)
            const errorMessage = e?.data?.message || e?.message || String(e)
            error.value = errorMessage
            throw new Error(errorMessage)
        } finally {
            loading.value = false
        }
    }

    /**
     * 所有アイテムの情報を更新
     * @param id アイテムID
     * @param payload 更新するデータ
     * @returns 更新後のアイテムデータ
     * @throws API呼び出しエラー時は例外をスロー
     */
    const update = async (id: number, payload: any) => {
        loading.value = true
        error.value = null
        try {
            // PUTメソッドで更新データを送信
            const { $api } = useNuxtApp()
            const res = await $api<OwnedItem>(`/api/v1/owned-items/${id}`, { method: 'PUT', body: payload })
            return res
        } catch (e: any) {
            // エラー時はエラーメッセージを保存して例外を再スロー
            console.error('updateOwnedItem failed', e)
            const errorMessage = e?.data?.message || e?.message || String(e)
            error.value = errorMessage
            throw new Error(errorMessage)
        } finally {
            loading.value = false
        }
    }

    /**
     * 所有アイテムを削除
     * @param id アイテムID
     * @returns 削除成功レスポンス
     * @throws API呼び出しエラー時は例外をスロー
     */
    const deleteItem = async (id: number) => {
        loading.value = true
        error.value = null
        try {
            // DELETEメソッドで削除リクエストを送信
            const { $api } = useNuxtApp()
            const res = await $api<{ success: boolean; message: string }>(`/api/v1/owned-items/${id}`, { method: 'DELETE' })
            return res
        } catch (e: any) {
            // エラー時はエラーメッセージを保存して例外を再スロー
            console.error('deleteOwnedItem failed', e)
            // バックエンドからのエラーメッセージを取得
            const errorMessage = e?.data?.message || e?.message || String(e)
            error.value = errorMessage
            throw new Error(errorMessage)
        } finally {
            loading.value = false
        }
    }

    // 外部から使用する関数と状態を公開
    return { items, loading, error, meta, fetchList, create, fetchDetail, update, deleteItem }
}

export default useOwnedItems
