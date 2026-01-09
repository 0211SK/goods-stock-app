import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useOwnedItems } from '../../app/composables/useOwnedItems'
import { mockApiSuccess, mockApiError } from '../helpers/mockApi'

describe('useOwnedItems', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('fetchList', () => {
        it('正常に一覧を取得する', async () => {
            const mockData = {
                items: [
                    { id: 1, goodsName: 'アイテム1', quantity: 2 },
                    { id: 2, goodsName: 'アイテム2', quantity: 1 },
                ],
                page: 1,
                size: 10,
                total: 2,
            }

            const mockApi = mockApiSuccess(mockData)
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { fetchList, items, loading, error, meta } = useOwnedItems()

            expect(loading.value).toBe(false)

            await fetchList({ workId: 1 })

            expect(mockApi).toHaveBeenCalledWith('/api/v1/owned-items', {
                params: { workId: 1 },
            })
            expect(items.value).toEqual(mockData.items)
            expect(meta.value).toEqual({ page: 1, size: 10, total: 2 })
            expect(loading.value).toBe(false)
            expect(error.value).toBeNull()
        })

        it('エラー時に空配列とエラーメッセージを設定する', async () => {
            const mockApi = mockApiError('サーバーエラー')
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { fetchList, items, error } = useOwnedItems()

            await fetchList()

            expect(items.value).toEqual([])
            expect(error.value).toBe('サーバーエラー')
        })
    })

    describe('create', () => {
        it('正常に新規アイテムを作成する', async () => {
            const mockResponse = { id: 1, goodsName: '新しいアイテム' }
            const mockApi = mockApiSuccess(mockResponse)
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { create } = useOwnedItems()
            const payload = { goodsName: '新しいアイテム', quantity: 1 }

            const result = await create(payload)

            expect(mockApi).toHaveBeenCalledWith('/api/v1/owned-items', {
                method: 'POST',
                body: payload,
            })
            expect(result).toEqual(mockResponse)
        })

        it('エラー時に例外をスローする', async () => {
            const mockApi = mockApiError('作成に失敗しました')
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { create, error } = useOwnedItems()

            await expect(create({ goodsName: 'test' })).rejects.toThrow()
            expect(error.value).toBe('作成に失敗しました')
        })
    })
})
