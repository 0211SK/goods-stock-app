import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useWorks } from '../../app/composables/useWorks'
import { mockApiSuccess, mockApiError } from '../helpers/mockApi'

describe('useWorks', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('fetchWorks', () => {
        it('正常に作品一覧を取得する', async () => {
            const mockData = {
                items: [
                    { id: 1, name: '作品A', nameKana: 'さくひんえー', memo: 'メモA' },
                    { id: 2, name: '作品B', nameKana: 'さくひんびー', memo: null },
                ],
            }

            const mockApi = mockApiSuccess(mockData)
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { fetchWorks, items, loading, error } = useWorks()

            await fetchWorks({ keyword: 'test' })

            expect(mockApi).toHaveBeenCalledWith('/api/v1/works', {
                params: { keyword: 'test' },
            })
            expect(items.value).toHaveLength(2)
            expect(items.value[0]).toEqual(mockData.items[0])
            expect(loading.value).toBe(false)
            expect(error.value).toBeNull()
        })

        it('エラー時に空配列を設定する', async () => {
            const mockApi = mockApiError('取得失敗')
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { fetchWorks, items, error } = useWorks()

            await fetchWorks()

            expect(items.value).toEqual([])
            expect(error.value).toBe('取得失敗')
        })
    })

    describe('createWork', () => {
        it('正常に作品を作成する', async () => {
            const mockApi = mockApiSuccess({})
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { createWork } = useWorks()
            const data = { name: '新作品', nameKana: 'しんさくひん', memo: 'テスト' }

            await createWork(data)

            expect(mockApi).toHaveBeenCalledWith('/api/v1/works', {
                method: 'POST',
                body: data,
            })
        })

        it('エラー時に例外をスローする', async () => {
            const mockApi = mockApiError('作成失敗')
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { createWork, error } = useWorks()

            await expect(createWork({ name: 'test', nameKana: 'てすと' })).rejects.toThrow()
            expect(error.value).toBe('作成失敗')
        })
    })

    describe('updateWork', () => {
        it('正常に作品を更新する', async () => {
            const mockApi = mockApiSuccess({})
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { updateWork } = useWorks()
            const data = { name: '更新作品', nameKana: 'こうしんさくひん' }

            await updateWork(1, data)

            expect(mockApi).toHaveBeenCalledWith('/api/v1/works/1', {
                method: 'PUT',
                body: data,
            })
        })
    })

    describe('deleteWork', () => {
        it('正常に作品を削除する', async () => {
            const mockApi = mockApiSuccess({})
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { deleteWork } = useWorks()

            await deleteWork(1)

            expect(mockApi).toHaveBeenCalledWith('/api/v1/works/1', {
                method: 'DELETE',
            })
        })

        it('エラー時に例外をスローする', async () => {
            const mockApi = mockApiError('削除失敗')
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { deleteWork, error } = useWorks()

            await expect(deleteWork(1)).rejects.toThrow()
            expect(error.value).toBe('削除失敗')
        })
    })
})
