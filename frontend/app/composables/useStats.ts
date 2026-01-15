import { ref } from 'vue'

/**
 * 所有アイテムサマリーの型定義
 */
export type OwnedItemSummary = {
    id: number
    goodsName?: string | null
    workName?: string | null
    itemTypeName?: string | null
    quantity?: number | null
    unitPrice?: number | null
    total?: number | null
    purchaseDate?: string | null
    imageUrl?: string | null
}

/**
 * ウィッシュアイテムサマリーの型定義
 */
export type WishItemSummary = {
    id: number
    goodsName?: string | null
    workName?: string | null
    itemTypeName?: string | null
    quantity?: number | null
    expectedPrice?: number | null
    total?: number | null
    releaseDate?: string | null
    imageUrl?: string | null
}

/**
 * 月次支出レスポンスの型定義
 */
export type MonthlyExpenseResponse = {
    month: string
    ownedItems: OwnedItemSummary[]
    wishItems: WishItemSummary[]
}

/**
 * 統計データの管理を行うコンポーザブル関数
 */
export const useStats = () => {
    // 月次データ
    const monthlyData = ref<MonthlyExpenseResponse | null>(null)
    // API呼び出し中フラグ
    const loading = ref(false)
    // エラーメッセージ
    const error = ref<string | null>(null)

    /**
     * 月次支出・想定金額サマリーを取得
     * @param month YYYY-MM形式の月
     */
    const fetchMonthlySummary = async (month: string) => {
        loading.value = true
        error.value = null
        try {
            const { $api } = useNuxtApp()
            const res = await $api<MonthlyExpenseResponse>(
                '/api/v1/data/monthly-summary',
                { params: { month } }
            )
            monthlyData.value = res
            return res
        } catch (e: any) {
            console.error('fetchMonthlySummary failed', e)
            const errorMessage = e?.data?.message || e?.message || String(e)
            error.value = errorMessage
            monthlyData.value = null
            throw e
        } finally {
            loading.value = false
        }
    }

    return {
        monthlyData,
        loading,
        error,
        fetchMonthlySummary
    }
}
