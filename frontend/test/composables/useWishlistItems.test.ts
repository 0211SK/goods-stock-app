import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useWishlistItems } from '../../app/composables/useWishlistItems'
import { mockApiSuccess, mockApiError } from '../helpers/mockApi'

describe('useWishlistItems', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('fetchList', () => {
        it('正常に一覧を取得する', async () => {
            const mockData = {
                items: [
                    { id: 1, goodsName: 'ウィッシュアイテム1', quantity: 1 },
                    { id: 2, goodsName: 'ウィッシュアイテム2', quantity: 2 },
                ],
                page: 1,
                size: 10,
                totalCount: 2,
                totalPages: 1,
            }

            const mockApi = mockApiSuccess(mockData)
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { fetchList, items, loading, error, meta } = useWishlistItems()

            expect(loading.value).toBe(false)

            await fetchList({ workId: 1 })

            expect(mockApi).toHaveBeenCalledWith('/api/v1/wish-items', {
                params: { workId: 1 },
            })
            expect(items.value).toEqual(mockData.items)
            expect(meta.value).toEqual({ page: 1, size: 10, totalCount: 2, totalPages: 1 })
            expect(loading.value).toBe(false)
            expect(error.value).toBeNull()
        })

        it('エラー時に空配列とエラーメッセージを設定する', async () => {
            const mockApi = mockApiError('取得エラー')
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { fetchList, items, error } = useWishlistItems()

            await fetchList()

            expect(items.value).toEqual([])
            expect(error.value).toBe('取得エラー')
        })
    })

    describe('create', () => {
        it('正常に新規アイテムを作成する', async () => {
            const mockResponse = { id: 1, goodsName: '新しいウィッシュ' }
            const mockApi = mockApiSuccess(mockResponse)
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { create } = useWishlistItems()
            const payload = { goodsName: '新しいウィッシュ', quantity: 1 }

            const result = await create(payload)

            expect(mockApi).toHaveBeenCalledWith('/api/v1/wish-items', {
                method: 'POST',
                body: payload,
            })
            expect(result).toEqual(mockResponse)
        })
    })

    describe('fetchDetail', () => {
        it('正常に詳細を取得する', async () => {
            const mockDetail = { id: 1, goodsName: '詳細アイテム' }
            const mockApi = mockApiSuccess(mockDetail)
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { fetchDetail } = useWishlistItems()

            const result = await fetchDetail(1)

            expect(mockApi).toHaveBeenCalledWith('/api/v1/wish-items/1')
            expect(result).toEqual(mockDetail)
        })
    })

    describe('update', () => {
        it('正常に更新する', async () => {
            const mockResponse = { id: 1, goodsName: '更新後' }
            const mockApi = mockApiSuccess(mockResponse)
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { update } = useWishlistItems()
            const payload = { goodsName: '更新後' }

            const result = await update(1, payload)

            expect(mockApi).toHaveBeenCalledWith('/api/v1/wish-items/1', {
                method: 'PUT',
                body: payload,
            })
            expect(result).toEqual(mockResponse)
        })
    })

    describe('deleteItem', () => {
        it('正常に削除する', async () => {
            const mockResponse = { success: true, message: '削除しました' }
            const mockApi = mockApiSuccess(mockResponse)
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { deleteItem } = useWishlistItems()

            const result = await deleteItem(1)

            expect(mockApi).toHaveBeenCalledWith('/api/v1/wish-items/1', {
                method: 'DELETE',
            })
            expect(result).toEqual(mockResponse)
        })
    })
})
