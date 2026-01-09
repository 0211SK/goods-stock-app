import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useItemTypes } from '../../app/composables/useItemTypes'
import { mockApiSuccess, mockApiError } from '../helpers/mockApi'

describe('useItemTypes', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('fetchList', () => {
        it('正常に種類一覧を取得する', async () => {
            const mockData = {
                items: [
                    { id: 1, name: 'フィギュア', createdAt: '2024-01-01' },
                    { id: 2, name: 'グッズ', createdAt: '2024-01-02' },
                ],
                page: 1,
                size: 10,
                totalCount: 2,
                totalPages: 1,
            }

            const mockApi = mockApiSuccess(mockData)
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { fetchList, items, loading, error } = useItemTypes()

            await fetchList({ keyword: 'test' })

            expect(mockApi).toHaveBeenCalledWith('/api/v1/item-types', {
                params: { keyword: 'test' },
            })
            expect(items.value).toEqual(mockData.items)
            expect(loading.value).toBe(false)
            expect(error.value).toBeNull()
        })

        it('エラー時に空配列を設定する', async () => {
            const mockApi = mockApiError('取得失敗')
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { fetchList, items, error } = useItemTypes()

            await fetchList()

            expect(items.value).toEqual([])
            expect(error.value).toBe('取得失敗')
        })
    })

    describe('createItemType', () => {
        it('正常に種類を作成する', async () => {
            const mockApi = mockApiSuccess({})
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { createItemType } = useItemTypes()
            const data = { name: '新種類' }

            await createItemType(data)

            expect(mockApi).toHaveBeenCalledWith('/api/v1/item-types', {
                method: 'POST',
                body: data,
            })
        })

        it('エラー時に例外をスローする', async () => {
            const mockApi = mockApiError('作成失敗')
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { createItemType, error } = useItemTypes()

            await expect(createItemType({ name: 'test' })).rejects.toThrow('作成失敗')
            expect(error.value).toBe('作成失敗')
        })
    })

    describe('updateItemType', () => {
        it('正常に種類を更新する', async () => {
            const mockApi = mockApiSuccess({})
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { updateItemType } = useItemTypes()
            const data = { name: '更新種類' }

            await updateItemType(1, data)

            expect(mockApi).toHaveBeenCalledWith('/api/v1/item-types/1', {
                method: 'PUT',
                body: data,
            })
        })
    })

    describe('deleteItemType', () => {
        it('正常に種類を削除する', async () => {
            const mockApi = mockApiSuccess({})
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { deleteItemType } = useItemTypes()

            await deleteItemType(1)

            expect(mockApi).toHaveBeenCalledWith('/api/v1/item-types/1', {
                method: 'DELETE',
            })
        })

        it('エラー時に例外をスローする', async () => {
            const mockApi = mockApiError('削除失敗')
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { deleteItemType, error } = useItemTypes()

            await expect(deleteItemType(1)).rejects.toThrow('削除失敗')
            expect(error.value).toBe('削除失敗')
        })
    })
})
