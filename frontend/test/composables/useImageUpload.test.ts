import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('useImageUpload (Supabase Storage)', () => {
    let uploadMock: any, removeMock: any, getPublicUrlMock: any, getUserMock: any, createClientMock: any

    beforeEach(() => {
        // useRuntimeConfigのモック
        (global as any).useRuntimeConfig = vi.fn(() => ({
            public: {
                supabaseUrl: 'https://test.supabase.co',
                supabaseAnonKey: 'test-key',
            },
        }))
        // Supabase storageの各メソッドをモック
        uploadMock = vi.fn()
        removeMock = vi.fn()
        getPublicUrlMock = vi.fn()
        getUserMock = vi.fn(() => ({ data: { user: { id: 'user-123' } }, error: null }))
        const fromMock = vi.fn(() => ({
            upload: uploadMock,
            remove: removeMock,
            getPublicUrl: getPublicUrlMock,
        }))
        const storageMock = { from: fromMock }
        const authMock = { getUser: getUserMock }
        createClientMock = vi.fn(() => ({ storage: storageMock, auth: authMock }))
        vi.resetModules()
        vi.doMock('@supabase/supabase-js', () => ({ createClient: createClientMock }))
    })

    afterEach(() => {
        vi.resetModules()
        vi.clearAllMocks()
    })

    describe('uploadImage', () => {
        it('画像を正常にアップロードする', async () => {
            uploadMock.mockResolvedValue({ error: null })
            const { uploadImage } = (await import('../../app/composables/useImageUpload')).default()
            const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
            const result = await uploadImage(file)
            expect(typeof result).toBe('string')
            expect(uploadMock).toHaveBeenCalled()
            expect(getUserMock).toHaveBeenCalled()
        })

        it('エラー時に例外をスローする', async () => {
            uploadMock.mockResolvedValue({ error: new Error('アップロードに失敗しました') })
            const { uploadImage, error } = (await import('../../app/composables/useImageUpload')).default()
            const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
            await expect(uploadImage(file)).rejects.toThrow()
            expect(error.value).toBeTruthy()
        })

        it('未ログイン時は例外をスローする', async () => {
            getUserMock.mockResolvedValue({ data: { user: null }, error: null })
            const { uploadImage } = (await import('../../app/composables/useImageUpload')).default()
            const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
            await expect(uploadImage(file)).rejects.toThrow('ユーザーIDが取得できません。ログインしてください。')
        })
    })

    describe('getImageUrl', () => {
        it('SupabaseのpublicUrlを返す', async () => {
            getPublicUrlMock.mockReturnValue({ data: { publicUrl: 'https://test.supabase.co/storage/v1/object/public/goods-images/test.jpg' } })
            const { getImageUrl } = (await import('../../app/composables/useImageUpload')).default()
            const result = getImageUrl('test.jpg')
            expect(result).toBe('https://test.supabase.co/storage/v1/object/public/goods-images/test.jpg')
            expect(getPublicUrlMock).toHaveBeenCalledWith('test.jpg')
        })

        it('完全なURLはそのまま返す', async () => {
            const { getImageUrl } = (await import('../../app/composables/useImageUpload')).default()
            const fullUrl = 'http://example.com/image.jpg'
            const result = getImageUrl(fullUrl)
            expect(result).toBe(fullUrl)
        })

        it('nullやundefinedの場合は空文字を返す', async () => {
            const { getImageUrl } = (await import('../../app/composables/useImageUpload')).default()
            expect(getImageUrl(null)).toBe('')
            expect(getImageUrl(undefined)).toBe('')
        })
    })
})
