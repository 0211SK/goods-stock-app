import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import StatsCards from '../../../app/components/stats/StatsCards.vue'

describe('StatsCards.vue', () => {
    const mockWishlistMonthlyStats = [
        { month: '2024-01', total: 50000, count: 5 },
        { month: '2024-02', total: 30000, count: 3 },
    ]

    const mockMonthlyStats = [
        { month: '2024-01', total: 80000, count: 8 },
        { month: '2024-02', total: 40000, count: 4 },
    ]

    const mockMonthlyPlannedStats = [
        { month: '2024-03', total: 60000, count: 6 },
        { month: '2024-04', total: 20000, count: 2 },
    ]

    const mockYearlyStats = [
        { year: '2024', total: 500000, count: 50 },
        { year: '2023', total: 300000, count: 30 },
    ]

    const defaultProps = {
        selectedMonth: '',
        loading: false,
        error: null,
        wishlistMonthlyStats: [],
        monthlyStats: [],
        monthlyPlannedStats: [],
        yearlyStats: [],
    }

    beforeEach(() => {
        // 各テスト前のクリーンアップ
    })

    describe('ウィッシュリスト月別想定金額', () => {
        it('loading状態が正しく表示される', () => {
            const wrapper = mount(StatsCards, {
                props: { ...defaultProps, loading: true },
            })

            const cards = wrapper.findAll('.card')
            const wishlistCard = cards[0]
            expect(wishlistCard.find('.card-title').text()).toBe('欲しいものリスト月別想定金額')
            expect(wishlistCard.find('.loading').exists()).toBe(true)
            expect(wishlistCard.find('.loading').text()).toBe('読み込み中...')
        })

        it('error状態が正しく表示される', () => {
            const wrapper = mount(StatsCards, {
                props: { ...defaultProps, error: 'エラーが発生しました' },
            })

            const cards = wrapper.findAll('.card')
            const wishlistCard = cards[0]
            expect(wishlistCard.find('.error').exists()).toBe(true)
            expect(wishlistCard.find('.error').text()).toBe('エラーが発生しました')
        })

        it('データなし状態が正しく表示される', () => {
            const wrapper = mount(StatsCards, {
                props: { ...defaultProps, wishlistMonthlyStats: [] },
            })

            const cards = wrapper.findAll('.card')
            const wishlistCard = cards[0]
            expect(wishlistCard.find('.no-data').exists()).toBe(true)
            expect(wishlistCard.find('.no-data').text()).toBe('データがありません')
        })

        it('統計データが正しく表示される', () => {
            const wrapper = mount(StatsCards, {
                props: { ...defaultProps, wishlistMonthlyStats: mockWishlistMonthlyStats },
            })

            const cards = wrapper.findAll('.card')
            const wishlistCard = cards[0]
            const monthlyItems = wishlistCard.findAll('.monthly-item')

            expect(monthlyItems).toHaveLength(2)
            expect(monthlyItems[0].find('.month').text()).toBe('2024-01')
            expect(monthlyItems[0].find('.amount').text()).toBe('¥50,000')
            expect(monthlyItems[0].find('.count').text()).toBe('5点')
            expect(monthlyItems[1].find('.month').text()).toBe('2024-02')
            expect(monthlyItems[1].find('.amount').text()).toBe('¥30,000')
            expect(monthlyItems[1].find('.count').text()).toBe('3点')
        })
    })

    describe('月別支出統計', () => {
        it('loading状態が正しく表示される', () => {
            const wrapper = mount(StatsCards, {
                props: { ...defaultProps, loading: true },
            })

            const cards = wrapper.findAll('.card')
            const monthlyCard = cards[1]
            expect(monthlyCard.find('.card-title').text()).toBe('月別支出統計')
            expect(monthlyCard.find('.loading').exists()).toBe(true)
        })

        it('error状態が正しく表示される', () => {
            const wrapper = mount(StatsCards, {
                props: { ...defaultProps, error: 'エラーが発生しました' },
            })

            const cards = wrapper.findAll('.card')
            const monthlyCard = cards[1]
            expect(monthlyCard.find('.error').exists()).toBe(true)
        })

        it('データなし状態が正しく表示される', () => {
            const wrapper = mount(StatsCards, {
                props: { ...defaultProps, monthlyStats: [] },
            })

            const cards = wrapper.findAll('.card')
            const monthlyCard = cards[1]
            expect(monthlyCard.find('.no-data').exists()).toBe(true)
        })

        it('統計データが正しく表示される', () => {
            const wrapper = mount(StatsCards, {
                props: { ...defaultProps, monthlyStats: mockMonthlyStats },
            })

            const cards = wrapper.findAll('.card')
            const monthlyCard = cards[1]
            const monthlyItems = monthlyCard.findAll('.monthly-item')

            expect(monthlyItems).toHaveLength(2)
            expect(monthlyItems[0].find('.month').text()).toBe('2024-01')
            expect(monthlyItems[0].find('.amount').text()).toBe('¥80,000')
            expect(monthlyItems[0].find('.count').text()).toBe('8点')
        })
    })

    describe('月別支出予定統計', () => {
        it('selectedMonthがない場合は表示されない', () => {
            const wrapper = mount(StatsCards, {
                props: { ...defaultProps, selectedMonth: '' },
            })

            const monthlyPlannedCard = wrapper.findAll('.card').find(card =>
                card.find('.card-title').text() === '月別支出予定統計'
            )
            expect(monthlyPlannedCard).toBeUndefined()
        })

        it('selectedMonthがある場合は表示される', () => {
            const wrapper = mount(StatsCards, {
                props: {
                    ...defaultProps,
                    selectedMonth: '2024-03',
                    monthlyPlannedStats: mockMonthlyPlannedStats,
                },
            })

            const cards = wrapper.findAll('.card')
            const monthlyPlannedCard = cards.find(card =>
                card.find('.card-title').text() === '月別支出予定統計'
            )
            expect(monthlyPlannedCard).toBeDefined()
        })

        it('統計データが正しく表示される', () => {
            const wrapper = mount(StatsCards, {
                props: {
                    ...defaultProps,
                    selectedMonth: '2024-03',
                    monthlyPlannedStats: mockMonthlyPlannedStats,
                },
            })

            const cards = wrapper.findAll('.card')
            const monthlyPlannedCard = cards.find(card =>
                card.find('.card-title').text() === '月別支出予定統計'
            )
            const monthlyItems = monthlyPlannedCard!.findAll('.monthly-item')

            expect(monthlyItems).toHaveLength(2)
            expect(monthlyItems[0].find('.month').text()).toBe('2024-03')
            expect(monthlyItems[0].find('.amount').text()).toBe('¥60,000')
            expect(monthlyItems[0].find('.count').text()).toBe('6点')
        })

        it('loading状態が正しく表示される', () => {
            const wrapper = mount(StatsCards, {
                props: {
                    ...defaultProps,
                    selectedMonth: '2024-03',
                    loading: true,
                },
            })

            const cards = wrapper.findAll('.card')
            const monthlyPlannedCard = cards.find(card =>
                card.find('.card-title').text() === '月別支出予定統計'
            )
            expect(monthlyPlannedCard!.find('.loading').exists()).toBe(true)
        })
    })

    describe('年別合計', () => {
        it('selectedMonthがある場合は表示されない', () => {
            const wrapper = mount(StatsCards, {
                props: {
                    ...defaultProps,
                    selectedMonth: '2024-03',
                    yearlyStats: mockYearlyStats,
                },
            })

            const yearlyCard = wrapper.findAll('.card').find(card =>
                card.find('.card-title').text() === '年別合計'
            )
            expect(yearlyCard).toBeUndefined()
        })

        it('selectedMonthがない場合は表示される', () => {
            const wrapper = mount(StatsCards, {
                props: {
                    ...defaultProps,
                    selectedMonth: '',
                    yearlyStats: mockYearlyStats,
                },
            })

            const cards = wrapper.findAll('.card')
            const yearlyCard = cards.find(card =>
                card.find('.card-title').text() === '年別合計'
            )
            expect(yearlyCard).toBeDefined()
        })

        it('統計データが正しく表示される', () => {
            const wrapper = mount(StatsCards, {
                props: {
                    ...defaultProps,
                    selectedMonth: '',
                    yearlyStats: mockYearlyStats,
                },
            })

            const cards = wrapper.findAll('.card')
            const yearlyCard = cards.find(card =>
                card.find('.card-title').text() === '年別合計'
            )
            const yearlyItems = yearlyCard!.findAll('.yearly-item')

            expect(yearlyItems).toHaveLength(2)
            expect(yearlyItems[0].find('.year').text()).toBe('2024年')
            expect(yearlyItems[0].find('.amount').text()).toBe('¥500,000')
            expect(yearlyItems[0].find('.count').text()).toBe('50点')
            expect(yearlyItems[1].find('.year').text()).toBe('2023年')
            expect(yearlyItems[1].find('.amount').text()).toBe('¥300,000')
            expect(yearlyItems[1].find('.count').text()).toBe('30点')
        })

        it('loading状態が正しく表示される', () => {
            const wrapper = mount(StatsCards, {
                props: {
                    ...defaultProps,
                    selectedMonth: '',
                    loading: true,
                },
            })

            const cards = wrapper.findAll('.card')
            const yearlyCard = cards.find(card =>
                card.find('.card-title').text() === '年別合計'
            )
            expect(yearlyCard!.find('.loading').exists()).toBe(true)
        })

        it('error状態が正しく表示される', () => {
            const wrapper = mount(StatsCards, {
                props: {
                    ...defaultProps,
                    selectedMonth: '',
                    error: 'エラー',
                },
            })

            const cards = wrapper.findAll('.card')
            const yearlyCard = cards.find(card =>
                card.find('.card-title').text() === '年別合計'
            )
            expect(yearlyCard!.find('.error').exists()).toBe(true)
        })

        it('データなし状態が正しく表示される', () => {
            const wrapper = mount(StatsCards, {
                props: {
                    ...defaultProps,
                    selectedMonth: '',
                    yearlyStats: [],
                },
            })

            const cards = wrapper.findAll('.card')
            const yearlyCard = cards.find(card =>
                card.find('.card-title').text() === '年別合計'
            )
            expect(yearlyCard!.find('.no-data').exists()).toBe(true)
        })
    })

    describe('条件付き表示の切り替え', () => {
        it('selectedMonthなしの場合、年別合計が表示され月別支出予定統計は非表示', () => {
            const wrapper = mount(StatsCards, {
                props: {
                    ...defaultProps,
                    selectedMonth: '',
                    yearlyStats: mockYearlyStats,
                    monthlyPlannedStats: mockMonthlyPlannedStats,
                },
            })

            const cardTitles = wrapper.findAll('.card-title').map(el => el.text())
            expect(cardTitles).toContain('年別合計')
            expect(cardTitles).not.toContain('月別支出予定統計')
        })

        it('selectedMonthありの場合、月別支出予定統計が表示され年別合計は非表示', () => {
            const wrapper = mount(StatsCards, {
                props: {
                    ...defaultProps,
                    selectedMonth: '2024-03',
                    yearlyStats: mockYearlyStats,
                    monthlyPlannedStats: mockMonthlyPlannedStats,
                },
            })

            const cardTitles = wrapper.findAll('.card-title').map(el => el.text())
            expect(cardTitles).toContain('月別支出予定統計')
            expect(cardTitles).not.toContain('年別合計')
        })
    })

    describe('数値フォーマット', () => {
        it('金額がカンマ区切りで表示される', () => {
            const wrapper = mount(StatsCards, {
                props: {
                    ...defaultProps,
                    monthlyStats: [{ month: '2024-01', total: 1234567, count: 10 }],
                },
            })

            const cards = wrapper.findAll('.card')
            const monthlyCard = cards[1]
            const amount = monthlyCard.find('.amount')
            expect(amount.text()).toBe('¥1,234,567')
        })

        it('件数が正しく表示される', () => {
            const wrapper = mount(StatsCards, {
                props: {
                    ...defaultProps,
                    monthlyStats: [{ month: '2024-01', total: 50000, count: 123 }],
                },
            })

            const cards = wrapper.findAll('.card')
            const monthlyCard = cards[1]
            const count = monthlyCard.find('.count')
            expect(count.text()).toBe('123点')
        })
    })
})
