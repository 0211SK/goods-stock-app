import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useImageUpload } from '../../app/composables/useImageUpload'
import { mockApiSuccess, mockApiError } from '../helpers/mockApi'

describe('useImageUpload', () => {
    beforeEach(() => {
        vi.clearAllMocks()
            ; (global as any).useRuntimeConfig = vi.fn(() => ({
                public: {
                    apiBase: 'http://localhost:8080',
                },
            }))
    })

    describe('uploadImage', () => {
        it('画像を正常にアップロードする', async () => {
            const mockImageUrl = '/uploads/images/test.jpg'
            const mockApi = mockApiSuccess({ imageUrl: mockImageUrl })
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { uploadImage } = useImageUpload()
            const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

            const result = await uploadImage(file)

            expect(result).toBe(mockImageUrl)
            expect(mockApi).toHaveBeenCalledWith(
                '/api/v1/upload/image',
                expect.objectContaining({
                    method: 'POST',
                })
            )
        })

        it('エラー時に例外をスローする', async () => {
            const mockApi = mockApiError('アップロードに失敗しました')
                ; (global as any).useNuxtApp = vi.fn(() => ({ $api: mockApi }))

            const { uploadImage, error } = useImageUpload()
            const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

            await expect(uploadImage(file)).rejects.toThrow()
            expect(error.value).toBeTruthy()
        })
    })

    describe('getImageUrl', () => {
        it('相対パスを完全なURLに変換する', () => {
            const { getImageUrl } = useImageUpload()
            const result = getImageUrl('/uploads/images/test.jpg')

            expect(result).toBe('http://localhost:8080/uploads/images/test.jpg')
        })

        it('完全なURLはそのまま返す', () => {
            const { getImageUrl } = useImageUpload()
            const fullUrl = 'http://example.com/image.jpg'
            const result = getImageUrl(fullUrl)

            expect(result).toBe(fullUrl)
        })

        it('nullやundefinedの場合は空文字を返す', () => {
            const { getImageUrl } = useImageUpload()

            expect(getImageUrl(null)).toBe('')
            expect(getImageUrl(undefined)).toBe('')
        })
    })
})
