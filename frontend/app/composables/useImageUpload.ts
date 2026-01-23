import { ref } from 'vue'
import { createClient } from '@supabase/supabase-js'

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

// Supabaseクライアント初期化
const config = useRuntimeConfig()
const supabaseUrl = config.public.supabaseUrl
const supabaseKey = config.public.supabaseAnonKey
const supabase = createClient(supabaseUrl, supabaseKey)

// バケット名（Supabase管理画面で作成したものに合わせる）
const BUCKET = 'goods-images'

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
        // 拡張子取得
        const ext = file.name.split('.').pop()
        // 一意なファイル名生成
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`
        // Supabase Storageへアップロード
        const { error: uploadError } = await supabase.storage.from(BUCKET).upload(fileName, file)
        if (uploadError) throw uploadError
        // パスを返す（DB保存用）
        return fileName
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
        // imageUrlはファイル名のみを想定
        const { error: removeError } = await supabase.storage.from(BUCKET).remove([imageUrl])
        if (removeError) throw removeError
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
    // Supabase Storageの公開URLを取得
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(relativePath)
    return data.publicUrl
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
export default function useImageUpload() {
    return {
        loading,
        error,
        uploadImage,
        deleteImage,
        validateImageFile,
        getImageUrl,
    }
}
