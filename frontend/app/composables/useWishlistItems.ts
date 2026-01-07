import { ref } from 'vue'

/**
 * 欲しいものの型定義
 * データベースのwish_itemsテーブルに対応
 */
export type WishItem = {
    id: number
    userId?: number | null
    workId?: number | null
    workName?: string | null
    itemTypeId?: number | null
    itemTypeName?: string | null
    goodsName?: string | null
    quantity?: number | null
    expectedUnitPrice?: number | null
    releaseDate?: string | null
    imageUrl?: string | null
    memo?: string | null
    createdAt?: string | null
    updatedAt?: string | null
}

/**
 * 欲しいもの一覧取得APIのレスポンス型
 * ページネーション情報を含む
 */
export type WishItemsListResponse = {
    items: WishItem[]
    // ページネーション情報（オプショナル）
    page?: number
    size?: number
    totalCount?: number
    totalPages?: number
}

/**
 * 欲しいもの（ウィッシュリスト）の管理を行うコンポーザブル関数
 * 一覧取得、詳細取得、登録、更新などのAPI呼び出しと状態管理を提供
 */
export const useWishlistItems = () => {
    // 一覧データ
    const items = ref<WishItem[]>([])
    // API呼び出し中フラグ
    const loading = ref(false)
    // エラーメッセージ
    const error = ref<string | null>(null)
    // ページネーション情報
    const meta = ref<{ page?: number; size?: number; totalCount?: number; totalPages?: number } | null>(null)

    /**
     * 欲しいもの一覧を取得
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
            const res = await $api<WishItemsListResponse>('/api/v1/wish-items', { params })
            // 取得結果を状態に反映
            items.value = res.items ?? []
            meta.value = { page: res.page, size: res.size, totalCount: res.totalCount, totalPages: res.totalPages }
        } catch (e: any) {
            // エラー時は空配列を設定し、エラーメッセージを保存
            console.error('fetchWishItems failed', e)
            error.value = e?.message ?? String(e)
            items.value = []
            meta.value = null
        } finally {
            loading.value = false
        }
    }

    /**
     * 新規欲しいものを登録
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
            const res = await $api<any>('/api/v1/wish-items', { method: 'POST', body: payload })
            return res
        } catch (e: any) {
            // エラー時はエラーメッセージを保存して例外を再スロー
            console.error('createWishItem failed', e)
            error.value = e?.message ?? String(e)
            throw e
        } finally {
            loading.value = false
        }
    }

    /**
     * 欲しいものの詳細情報を取得
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
            const res = await $api<WishItem>(`/api/v1/wish-items/${id}`)
            return res
        } catch (e: any) {
            // エラー時はエラーメッセージを保存して例外を再スロー
            console.error('fetchWishItemDetail failed', e)
            error.value = e?.message ?? String(e)
            throw e
        } finally {
            loading.value = false
        }
    }

    /**
     * 欲しいものの情報を更新
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
            const res = await $api<WishItem>(`/api/v1/wish-items/${id}`, { method: 'PUT', body: payload })
            return res
        } catch (e: any) {
            // エラー時はエラーメッセージを保存して例外を再スロー
            console.error('updateWishItem failed', e)
            error.value = e?.message ?? String(e)
            throw e
        } finally {
            loading.value = false
        }
    }

    /**
     * 欲しいものを削除
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
            const res = await $api<{ success: boolean; message: string }>(`/api/v1/wish-items/${id}`, { method: 'DELETE' })
            return res
        } catch (e: any) {
            // エラー時はエラーメッセージを保存して例外を再スロー
            console.error('deleteWishItem failed', e)
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

export default useWishlistItems
