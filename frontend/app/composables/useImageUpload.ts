import { ref } from 'vue'

/**
 * 画像アップロードのレスポンス型
 */
export type ImageUploadResponse = {
    imageUrl: string
}

/**
 * 画像削除のレスポンス型
 */
export type ImageDeleteResponse = {
    success: boolean
    message: string
}

/**
 * 画像アップロード・削除を管理するコンポーザブル関数
 */
export const useImageUpload = () => {
    // API呼び出し中フラグ
    const loading = ref(false)
    // エラーメッセージ
    const error = ref<string | null>(null)

    /**
     * 画像をアップロード
     * @param file アップロードする画像ファイル
     * @returns アップロードされた画像の相対パス（DBに保存用）
     * @throws API呼び出しエラー時は例外をスロー
     */
    const uploadImage = async (file: File): Promise<string> => {
        loading.value = true
        error.value = null
        try {
            // FormDataを作成して画像ファイルを設定
            const formData = new FormData()
            formData.append('file', file)

            // multipart/form-dataでPOST
            const { $api } = useNuxtApp()
            const res = await $api<ImageUploadResponse>('/api/v1/upload/image', {
                method: 'POST',
                body: formData,
            })

            // 相対パスをそのまま返す（DBに保存するため）
            return res.imageUrl
        } catch (e: any) {
            console.error('uploadImage failed', e)
            error.value = e?.message ?? String(e)
            throw e
        } finally {
            loading.value = false
        }
    }

    /**
     * 画像を削除
     * @param imageUrl 削除する画像のURL
     * @throws API呼び出しエラー時は例外をスロー
     */
    const deleteImage = async (imageUrl: string): Promise<void> => {
        if (!imageUrl) return

        loading.value = true
        error.value = null
        try {
            const { $api } = useNuxtApp()
            await $api<ImageDeleteResponse>('/api/v1/upload/image', {
                method: 'DELETE',
                params: { imageUrl },
            })
        } catch (e: any) {
            console.error('deleteImage failed', e)
            error.value = e?.message ?? String(e)
            throw e
        } finally {
            loading.value = false
        }
    }

    /**
     * 相対パスを完全なURLに変換
     * @param relativePath 相対パス（例: /uploads/images/xxx.jpg）
     * @returns 完全なURL（例: http://localhost:8080/uploads/images/xxx.jpg）
     */
    const getImageUrl = (relativePath: string | null | undefined): string => {
        if (!relativePath) return ''

        // 既に完全なURLの場合はそのまま返す
        if (relativePath.startsWith('http')) {
            return relativePath
        }

        // 相対パスを完全なURLに変換
        const config = useRuntimeConfig()
        return config.public.apiBase + relativePath
    }

    /**
     * 画像ファイルのバリデーション
     * @param file 検証するファイル
     * @returns エラーメッセージ。問題なければnull
     */
    const validateImageFile = (file: File | null | undefined): string | null => {
        if (!file) {
            return 'ファイルが選択されていません。'
        }

        // ファイルサイズチェック（5MB）
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            return 'ファイルサイズが大きすぎます。最大5MBまでです。'
        }

        // ファイル形式チェック（JPEG, PNG, GIF, WebP）
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            return '画像ファイルのみアップロード可能です。対応形式: JPEG, PNG, GIF, WebP'
        }

        // HEIC形式の警告
        if (file.type === 'image/heic' || file.type === 'image/heif') {
            return 'HEIC/HEIF形式は非対応です。JPEG/PNGに変換してアップロードしてください。'
        }

        return null
    }

    // 外部から使用する関数と状態を公開
    return {
        loading,
        error,
        uploadImage,
        deleteImage,
        validateImageFile,
        getImageUrl,
    }
}

export default useImageUpload
