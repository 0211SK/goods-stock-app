import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useStats } from '../../app/composables/useStats'
import { mockApiSuccess, mockApiError } from '../helpers/mockApi'

describe('useStats', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('fetchMonthlySummary', () => {
        it('正常に月次サマリーを取得する', async () => {
            const mockData = {
                month: '2024-01',
                ownedItems: [
                    {
                        id: 1,
                        goodsName: 'アイテム1',
                        quantity: 2,
                        unitPrice: 1000,
                        total: 2000,
                    },
                ],
                wishItems: [
                    {
                        id: 1,
                        goodsName: 'ウィッシュ1',
                        quantity: 1,
                        expectedPrice: 1500,
                        total: 1500,
                    },
                ],
            }

            const mockApi = mockApiSuccess(mockData)
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { fetchMonthlySummary, monthlyData, loading, error } = useStats()

            const result = await fetchMonthlySummary('2024-01')

            expect(mockApi).toHaveBeenCalledWith('/api/v1/data/monthly-summary', {
                params: { month: '2024-01' },
            })
            expect(monthlyData.value).toEqual(mockData)
            expect(result).toEqual(mockData)
            expect(loading.value).toBe(false)
            expect(error.value).toBeNull()
        })

        it('エラー時にnullを設定し例外をスローする', async () => {
            const mockApi = mockApiError('データ取得失敗')
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { fetchMonthlySummary, monthlyData, error } = useStats()

            await expect(fetchMonthlySummary('2024-01')).rejects.toThrow()
            expect(monthlyData.value).toBeNull()
            expect(error.value).toBe('データ取得失敗')
        })
    })
})
