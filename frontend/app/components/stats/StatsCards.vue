<template>
    <div class="stats-container">
        <!-- ウィッシュリスト月別想定金額 -->
        <div class="card wishlist-monthly">
            <h2 class="card-title">欲しいものリスト月別想定金額</h2>
            <div v-if="loading" class="loading">読み込み中...</div>
            <div v-else-if="error" class="error">{{ error }}</div>
            <div v-else>
                <div v-if="wishlistMonthlyStats.length === 0" class="no-data">データがありません</div>
                <div v-else class="monthly-list">
                    <div v-for="stat in wishlistMonthlyStats" :key="stat.month" class="monthly-item">
                        <div class="month">{{ stat.month }}</div>
                        <div class="stats-detail">
                            <div class="amount">¥{{ stat.total.toLocaleString() }}</div>
                            <div class="count">{{ stat.count }}点</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 月別支出統計 -->
        <div class="card monthly-stats">
            <h2 class="card-title">月別支出統計</h2>
            <div v-if="loading" class="loading">読み込み中...</div>
            <div v-else-if="error" class="error">{{ error }}</div>
            <div v-else>
                <div v-if="monthlyStats.length === 0" class="no-data">データがありません</div>
                <div v-else class="monthly-list">
                    <div v-for="stat in monthlyStats" :key="stat.month" class="monthly-item">
                        <div class="month">{{ stat.month }}</div>
                        <div class="stats-detail">
                            <div class="amount">¥{{ stat.total.toLocaleString() }}</div>
                            <div class="count">{{ stat.count }}点</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 月別支出予定統計（月フィルターが選択されている時のみ表示） -->
        <div v-if="selectedMonth" class="card monthly-planned">
            <h2 class="card-title">月別支出予定統計</h2>
            <div v-if="loading" class="loading">読み込み中...</div>
            <div v-else-if="error" class="error">{{ error }}</div>
            <div v-else>
                <div v-if="monthlyPlannedStats.length === 0" class="no-data">データがありません</div>
                <div v-else class="monthly-list">
                    <div v-for="stat in monthlyPlannedStats" :key="stat.month" class="monthly-item">
                        <div class="month">{{ stat.month }}</div>
                        <div class="stats-detail">
                            <div class="amount">¥{{ stat.total.toLocaleString() }}</div>
                            <div class="count">{{ stat.count }}点</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 年別合計（月フィルターが「すべて」の時のみ表示） -->
        <div v-if="!selectedMonth" class="card yearly-stats">
            <h2 class="card-title">年別合計</h2>
            <div v-if="loading" class="loading">読み込み中...</div>
            <div v-else-if="error" class="error">{{ error }}</div>
            <div v-else>
                <div v-if="yearlyStats.length === 0" class="no-data">データがありません</div>
                <div v-else class="yearly-list">
                    <div v-for="stat in yearlyStats" :key="stat.year" class="yearly-item">
                        <div class="year">{{ stat.year }}年</div>
                        <div class="stats-detail">
                            <div class="amount">¥{{ stat.total.toLocaleString() }}</div>
                            <div class="count">{{ stat.count }}点</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
type MonthlyStatItem = {
    month: string
    total: number
    count: number
}

type YearlyStatItem = {
    year: string
    total: number
    count: number
}

defineProps<{
    selectedMonth: string
    loading: boolean
    error: string | null
    wishlistMonthlyStats: MonthlyStatItem[]
    monthlyStats: MonthlyStatItem[]
    monthlyPlannedStats: MonthlyStatItem[]
    yearlyStats: YearlyStatItem[]
}>()
</script>

<style scoped>
.stats-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 1rem;
}

.card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #333;
}

.loading,
.error,
.no-data {
    text-align: center;
    padding: 2rem;
    color: #666;
}

.error {
    color: #dc3545;
}

/* 月別統計 */
.monthly-list,
.yearly-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.monthly-item,
.yearly-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 6px;
    transition: background 0.2s;
}

.monthly-item:hover,
.yearly-item:hover {
    background: #e9ecef;
}

.month,
.year {
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
}

.stats-detail {
    text-align: right;
}

.stats-detail .amount {
    font-size: 1.25rem;
    font-weight: 700;
    color: #16a34a;
    margin-bottom: 0.25rem;
}

.stats-detail .count {
    font-size: 0.875rem;
    color: #666;
}

/* レスポンシブ対応 */
@media (min-width: 768px) {
    .stats-container {
        padding: 2rem;
    }

    .card {
        padding: 2rem;
    }
}

@media (min-width: 1024px) {

    .monthly-item,
    .yearly-item {
        padding: 1.25rem;
    }

    .month,
    .year {
        font-size: 1.15rem;
    }

    .stats-detail .amount {
        font-size: 1.5rem;
    }
}
</style>
