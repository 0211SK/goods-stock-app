<template>
    <CommonPageLayout title="月次支出・想定金額">
        <template #filter>
            <StatsFilterBar :selected-year="selectedYear" :selected-month="selectedMonth"
                :available-years="availableYears" @update:selected-year="selectedYear = $event"
                @update:selected-month="selectedMonth = $event" @clear-filters="clearFilters" />
        </template>
        <StatsCards :selected-month="selectedMonth" :loading="loading" :error="error"
            :wishlist-monthly-stats="wishlistMonthlyStats" :monthly-stats="monthlyStats"
            :monthly-planned-stats="monthlyPlannedStats" :yearly-stats="yearlyStats" />
    </CommonPageLayout>
</template>

<script setup lang="ts">
import CommonPageLayout from '~/components/common/CommonPageLayout.vue'
import StatsFilterBar from '~/components/stats/StatsFilterBar.vue'
import StatsCards from '~/components/stats/StatsCards.vue'
import { useStats, type OwnedItemSummary, type WishItemSummary } from '~/composables/useStats'
import { computed, onMounted, ref, watch } from 'vue'

// 現在の年月を取得
const currentDate = new Date()
const currentYear = currentDate.getFullYear()
const currentMonth = currentDate.getMonth() + 1

// フィルター用の状態（初期値を現在の年月に設定）
const selectedYear = ref<string>(String(currentYear))
const selectedMonth = ref<string>(String(currentMonth))

// 統計データの取得
const { fetchMonthlySummary } = useStats()

// ローディングとエラー状態を個別に管理
const loading = ref(false)
const error = ref<string | null>(null)

// 全データを保持するための配列
const allOwnedItems = ref<OwnedItemSummary[]>([])
const allWishItems = ref<WishItemSummary[]>([])

// 利用可能な年月のセット
const availableMonths = ref<Set<string>>(new Set())

// 利用可能な年のリストを計算（固定リスト：過去3年から未来1年まで）
const availableYears = computed(() => {
    const years: number[] = []
    for (let i = -3; i <= 1; i++) {
        years.push(currentYear + i)
    }
    return years.sort((a, b) => b - a)
})

// フィルタークリア関数
const clearFilters = () => {
    selectedYear.value = ''
    selectedMonth.value = ''
}

// フィルター済み所有アイテム
const filteredOwnedItems = computed(() => {
    return allOwnedItems.value.filter((item: OwnedItemSummary) => {
        if (!item.purchaseDate) return false

        const date = new Date(item.purchaseDate)
        const year = date.getFullYear()
        const month = date.getMonth() + 1

        // 年フィルター
        if (selectedYear.value && year !== parseInt(selectedYear.value)) {
            return false
        }

        // 月フィルター
        if (selectedMonth.value && month !== parseInt(selectedMonth.value)) {
            return false
        }

        return true
    })
})

// フィルター済みウィッシュリストアイテム
const filteredWishItems = computed(() => {
    return allWishItems.value.filter((item: WishItemSummary) => {
        if (!item.releaseDate) return false

        const date = new Date(item.releaseDate)
        const year = date.getFullYear()
        const month = date.getMonth() + 1

        // 年フィルター
        if (selectedYear.value && year !== parseInt(selectedYear.value)) {
            return false
        }

        // 月フィルター
        if (selectedMonth.value && month !== parseInt(selectedMonth.value)) {
            return false
        }

        return true
    })
})

// 月別統計の型定義
type MonthlyStatItem = {
    month: string
    total: number
    count: number
}

// ウィッシュリスト月別統計の計算
const wishlistMonthlyStats = computed(() => {
    const statsMap = new Map<string, MonthlyStatItem>()

    filteredWishItems.value.forEach((item: WishItemSummary) => {
        if (!item.releaseDate) return

        // 発売予定日から年月を取得
        const date = new Date(item.releaseDate)
        const yearMonth = `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月`

        const total = item.total || 0
        const quantity = item.quantity || 0

        if (statsMap.has(yearMonth)) {
            const existing = statsMap.get(yearMonth)!
            existing.total += total
            existing.count += quantity
        } else {
            statsMap.set(yearMonth, {
                month: yearMonth,
                total,
                count: quantity
            })
        }
    })

    // 月の降順でソート
    return Array.from(statsMap.values()).sort((a, b) => {
        return b.month.localeCompare(a.month)
    })
})

// 月別統計の計算
const monthlyStats = computed(() => {
    const statsMap = new Map<string, MonthlyStatItem>()

    filteredOwnedItems.value.forEach((item: OwnedItemSummary) => {
        if (!item.purchaseDate) return

        // 購入日から年月を取得
        const date = new Date(item.purchaseDate)
        const yearMonth = `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月`

        const total = item.total || 0
        const quantity = item.quantity || 0

        if (statsMap.has(yearMonth)) {
            const existing = statsMap.get(yearMonth)!
            existing.total += total
            existing.count += quantity
        } else {
            statsMap.set(yearMonth, {
                month: yearMonth,
                total,
                count: quantity
            })
        }
    })

    // 月の降順でソート
    return Array.from(statsMap.values()).sort((a, b) => {
        return b.month.localeCompare(a.month)
    })
})

// 月別支出予定統計の計算（購入済み + ウィッシュリスト）
const monthlyPlannedStats = computed(() => {
    const statsMap = new Map<string, MonthlyStatItem>()

    // 購入済みアイテムを集計
    filteredOwnedItems.value.forEach((item: OwnedItemSummary) => {
        if (!item.purchaseDate) return

        const date = new Date(item.purchaseDate)
        const yearMonth = `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月`

        const total = item.total || 0
        const quantity = item.quantity || 0

        if (statsMap.has(yearMonth)) {
            const existing = statsMap.get(yearMonth)!
            existing.total += total
            existing.count += quantity
        } else {
            statsMap.set(yearMonth, {
                month: yearMonth,
                total,
                count: quantity
            })
        }
    })

    // ウィッシュリストアイテムを集計
    filteredWishItems.value.forEach((item: WishItemSummary) => {
        if (!item.releaseDate) return

        const date = new Date(item.releaseDate)
        const yearMonth = `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月`

        const total = item.total || 0
        const quantity = item.quantity || 0

        if (statsMap.has(yearMonth)) {
            const existing = statsMap.get(yearMonth)!
            existing.total += total
            existing.count += quantity
        } else {
            statsMap.set(yearMonth, {
                month: yearMonth,
                total,
                count: quantity
            })
        }
    })

    // 月の降順でソート
    return Array.from(statsMap.values()).sort((a, b) => {
        return b.month.localeCompare(a.month)
    })
})

// 年別統計の型定義
type YearlyStatItem = {
    year: string
    total: number
    count: number
}

// 年別統計の計算（購入済みのみ）
const yearlyStats = computed(() => {
    const statsMap = new Map<string, YearlyStatItem>()

    // 購入済みアイテムのみを集計
    filteredOwnedItems.value.forEach((item: OwnedItemSummary) => {
        if (!item.purchaseDate) return

        const date = new Date(item.purchaseDate)
        const year = String(date.getFullYear())

        const total = item.total || 0
        const quantity = item.quantity || 0

        if (statsMap.has(year)) {
            const existing = statsMap.get(year)!
            existing.total += total
            existing.count += quantity
        } else {
            statsMap.set(year, {
                year,
                total,
                count: quantity
            })
        }
    })

    // 年の降順でソート
    return Array.from(statsMap.values()).sort((a, b) => {
        return b.year.localeCompare(a.year)
    })
})

// 指定した月のデータを取得する関数
const fetchMonthData = async (year: number, month: number) => {
    const monthString = `${year}-${String(month).padStart(2, '0')}`

    // すでに取得済みの場合はスキップ
    if (availableMonths.value.has(monthString)) {
        console.log(`Data for ${monthString} already loaded, skipping...`)
        return
    }

    try {
        const result = await fetchMonthlySummary(monthString)
        if (result) {
            availableMonths.value.add(result.month)
            allOwnedItems.value.push(...result.ownedItems)
            allWishItems.value.push(...result.wishItems)
            console.log(`Data for ${monthString} loaded successfully`)
        }
    } catch (e) {
        console.warn(`Failed to fetch data for ${monthString}:`, e)
    }
}

// 指定した年のデータを取得する関数
const fetchYearData = async (year: number) => {
    loading.value = true
    error.value = null

    try {
        const monthsToFetch: number[] = []

        // その年の12ヶ月分を取得
        for (let month = 1; month <= 12; month++) {
            const monthString = `${year}-${String(month).padStart(2, '0')}`
            if (!availableMonths.value.has(monthString)) {
                monthsToFetch.push(month)
            }
        }

        if (monthsToFetch.length === 0) {
            console.log(`All data for year ${year} already loaded`)
            return
        }

        console.log(`Fetching data for ${monthsToFetch.length} months in ${year}...`)

        // 並列取得
        await Promise.all(
            monthsToFetch.map(month => fetchMonthData(year, month))
        )
    } catch (e) {
        console.error(`Failed to fetch year data for ${year}:`, e)
        error.value = 'データの取得中にエラーが発生しました。'
    } finally {
        loading.value = false
    }
}

// 初期データ取得（現在の月のみ）
const fetchInitialData = async () => {
    loading.value = true
    error.value = null

    try {
        console.log(`Fetching initial data for ${currentYear}-${String(currentMonth).padStart(2, '0')}...`)
        await fetchMonthData(currentYear, currentMonth)
    } catch (e) {
        console.error('Failed to fetch initial data:', e)
        error.value = 'データの取得に失敗しました。リロードしてください。'
    } finally {
        loading.value = false
    }
}

// フィルター変更時の処理
watch([selectedYear, selectedMonth], async ([newYear, newMonth]) => {
    if (!newYear && !newMonth) {
        // 「すべて」が選択された場合は何もしない
        return
    }

    if (newYear && !newMonth) {
        // 年のみ選択された場合、その年のデータを取得
        await fetchYearData(parseInt(newYear))
    } else if (newYear && newMonth) {
        // 年月両方選択された場合、その月のデータを取得
        await fetchMonthData(parseInt(newYear), parseInt(newMonth))
    }
})

// データ取得
onMounted(() => {
    fetchInitialData()
})
</script>
