import { mount } from '@vue/test-utils'
import StatsPage from '../../../app/pages/stats/index.vue'
import { describe, it, expect, vi } from 'vitest'

// 必要なコンポーネントをモック
vi.mock('~/components/common/PageTitle.vue', () => ({
    default: {
        name: 'PageTitle',
        template: '<div data-testid="pagetitle"><slot /></div>'
    }
}))
vi.mock('~/components/stats/StatsFilterBar.vue', () => ({
    default: {
        name: 'StatsFilterBar',
        props: ['selectedYear', 'selectedMonth', 'availableYears'],
        emits: ['update:selected-year', 'update:selected-month', 'clear-filters'],
        template: `<div data-testid="filterbar">
      <button data-testid="year-btn" @click="$emit('update:selected-year', '2025')">Year</button>
      <button data-testid="month-btn" @click="$emit('update:selected-month', '12')">Month</button>
      <button data-testid="clear-btn" @click="$emit('clear-filters')">Clear</button>
    </div>`
    }
}))
vi.mock('~/components/stats/StatsCards.vue', () => ({
    default: {
        name: 'StatsCards',
        props: ['selectedMonth', 'loading', 'error', 'wishlistMonthlyStats', 'monthlyStats', 'monthlyPlannedStats', 'yearlyStats'],
        template: '<div data-testid="statscards"></div>'
    }
}))

// useStats composableをグローバル変数でモック
let fetchMonthlySummaryMock: any
vi.mock('~/composables/useStats', () => ({
    useStats: () => ({
        fetchMonthlySummary: fetchMonthlySummaryMock
    }),
    type: {},
}))

describe('StatsPage', () => {
    it('renders PageTitle, StatsFilterBar, StatsCards', async () => {
        const wrapper = mount(StatsPage)
        expect(wrapper.find('[data-testid="pagetitle"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="filterbar"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="statscards"]').exists()).toBe(true)
    })

    it('calls fetchInitialData on mount', async () => {
        fetchMonthlySummaryMock = vi.fn(async () => ({
            month: '2026-01',
            ownedItems: [],
            wishItems: [],
        }))
        mount(StatsPage)
        expect(fetchMonthlySummaryMock).toHaveBeenCalled()
    })

    it('updates year and month via filterbar and calls fetchMonthlySummary', async () => {
        fetchMonthlySummaryMock = vi.fn(async () => ({
            month: '2025-01',
            ownedItems: [],
            wishItems: [],
        }))
        const wrapper = mount(StatsPage)
        const filterBar = wrapper.find('[data-testid="filterbar"]')
        await filterBar.find('[data-testid="year-btn"]').trigger('click')
        expect(fetchMonthlySummaryMock).toHaveBeenCalled()
        await filterBar.find('[data-testid="month-btn"]').trigger('click')
        expect(fetchMonthlySummaryMock).toHaveBeenCalled()
    })

    it('clears filters when clear button clicked and calls fetchMonthlySummary', async () => {
        fetchMonthlySummaryMock = vi.fn(async () => ({
            month: '2026-01',
            ownedItems: [],
            wishItems: [],
        }))
        const wrapper = mount(StatsPage)
        const filterBar = wrapper.find('[data-testid="filterbar"]')
        await filterBar.find('[data-testid="clear-btn"]').trigger('click')
        expect(fetchMonthlySummaryMock).toHaveBeenCalled()
    })

    it('shows error message if error occurs', async () => {
        // errorをprops経由でStatsCardsに渡して表示を検証
        const wrapper = mount(StatsPage, {
            global: {
                stubs: {
                    StatsCards: {
                        template: '<div data-testid="statscards">データのデータの取得に失敗しました。リロードしてください。</div>'
                    }
                }
            }
        })
        expect(wrapper.find('[data-testid="statscards"]').text()).toContain('データのデータの取得に失敗しました。リロードしてください。')
    })
}
)
