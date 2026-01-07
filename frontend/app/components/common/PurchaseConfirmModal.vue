<template>
    <!-- 購入確認モーダル -->
    <div v-if="showPurchaseModal" class="modal-overlay" @click="handleCancel">
        <div class="modal-content modal-content--large" @click.stop>
            <h3>購入確認</h3>
            <p>この商品を購入済みとして在庫に登録しますか？</p>

            <!-- 現在の画像表示 -->
            <div v-if="currentImageUrl" class="current-image">
                <p class="image-label">現在の画像:</p>
                <img :src="getImageUrl(currentImageUrl)" alt="現在の画像" class="preview-image" />
            </div>

            <!-- 新しい画像をアップロード（オプショナル） -->
            <div class="image-upload-section">
                <p class="image-label">購入した商品の画像に更新してください</p>

                <!-- 新しい画像プレビュー -->
                <div v-if="newImageUrl" class="image-preview">
                    <img :src="getImageUrl(newImageUrl)" alt="新しい画像" class="preview-image" />
                    <button type="button" class="btn-remove" @click="removeNewImage" :disabled="imageUploading">
                        削除
                    </button>
                </div>

                <!-- ファイル選択 -->
                <div v-else>
                    <input ref="fileInput" type="file" accept="image/*" @change="onFileChange"
                        :disabled="imageUploading || purchasing" />
                </div>

                <!-- アップロード中表示 -->
                <div v-if="imageUploading" class="uploading">
                    アップロード中...
                </div>

                <!-- エラー表示 -->
                <div v-if="imageError" class="image-error">
                    {{ imageError }}
                </div>
            </div>

            <div class="modal-actions">
                <button @click="handleConfirm" :disabled="purchasing || imageUploading" class="btn-confirm">
                    {{ purchasing ? '登録中...' : '購入済みにする' }}
                </button>
                <button @click="handleCancel" :disabled="purchasing || imageUploading" class="btn-cancel">
                    キャンセル
                </button>
            </div>
        </div>
    </div>

    <!-- 購入成功モーダル -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="$emit('close-success')">
        <div class="modal-content" @click.stop>
            <h3>購入完了</h3>
            <p>在庫として登録しました。欲しいものリストから削除されました。</p>
            <div class="modal-actions">
                <button @click="$emit('close-success')" class="btn-confirm">OK</button>
            </div>
        </div>
    </div>

    <!-- 購入エラーモーダル -->
    <div v-if="showErrorModal" class="modal-overlay" @click="$emit('close-error')">
        <div class="modal-content" @click.stop>
            <h3>エラー</h3>
            <p>{{ errorMessage }}</p>
            <div class="modal-actions">
                <button @click="$emit('close-error')" class="btn-confirm">閉じる</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useImageUpload } from '~/composables/useImageUpload'

/**
 * 購入確認・成功・エラーモーダルコンポーネント
 */
interface Props {
    showPurchaseModal: boolean
    showSuccessModal: boolean
    showErrorModal: boolean
    errorMessage?: string
    purchasing?: boolean
    currentImageUrl?: string | null
}

const props = withDefaults(defineProps<Props>(), {
    errorMessage: '',
    purchasing: false,
    currentImageUrl: null
})

const emit = defineEmits<{
    confirm: [newImageUrl: string | null]
    cancel: []
    'close-success': []
    'close-error': []
}>()

// 画像アップロード用のcomposable
const { uploadImage, deleteImage, validateImageFile, getImageUrl, loading: imageUploading, error: imageError } = useImageUpload()

// ファイル入力要素への参照
const fileInput = ref<HTMLInputElement>()

// 新しくアップロードされた画像URL
const newImageUrl = ref<string | null>(null)

/**
 * モーダルが開かれたときに新しい画像URLをリセット
 */
watch(() => props.showPurchaseModal, (isOpen) => {
    if (isOpen) {
        newImageUrl.value = null
        if (fileInput.value) {
            fileInput.value.value = ''
        }
    }
})

/**
 * 画像ファイル選択時の処理
 */
const onFileChange = async (e: Event) => {
    const files = (e.target as HTMLInputElement).files
    const file = files?.[0]

    if (!file) return

    // バリデーション
    const validationError = validateImageFile(file)
    if (validationError) {
        alert(validationError)
        return
    }

    try {
        // 古い新規画像があれば削除
        if (newImageUrl.value) {
            try {
                await deleteImage(newImageUrl.value)
            } catch (e) {
                console.warn('古い画像の削除に失敗しましたが、続行します', e)
            }
        }

        // 新しい画像をアップロード
        const uploadedUrl = await uploadImage(file)
        newImageUrl.value = uploadedUrl

    } catch (e: any) {
        console.error('画像アップロードエラー:', e)
        alert('画像のアップロードに失敗しました')
    }
}

/**
 * 新しい画像を削除
 */
const removeNewImage = async () => {
    if (!newImageUrl.value) return

    try {
        await deleteImage(newImageUrl.value)
        newImageUrl.value = null

        // ファイル入力をリセット
        if (fileInput.value) {
            fileInput.value.value = ''
        }
    } catch (e: any) {
        console.error('画像削除エラー:', e)
        alert('画像の削除に失敗しました')
    }
}

/**
 * 確認ボタン押下
 */
const handleConfirm = () => {
    emit('confirm', newImageUrl.value)
}

/**
 * キャンセルボタン押下
 */
const handleCancel = async () => {
    // アップロードした新しい画像があれば削除
    if (newImageUrl.value) {
        try {
            await deleteImage(newImageUrl.value)
        } catch (e) {
            console.warn('画像の削除に失敗しました', e)
        }
        newImageUrl.value = null
    }

    emit('cancel')
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;
}

.modal-content h3 {
    margin-top: 0;
    margin-bottom: 1rem;
}

.modal-content p {
    margin-bottom: 1.5rem;
}

.modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.btn-confirm,
.btn-cancel {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
}

.btn-confirm {
    background-color: #4CAF50;
    color: white;
}

.btn-confirm:hover {
    background-color: #45a049;
}

.btn-confirm:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.btn-cancel {
    background-color: #f44336;
    color: white;
}

.btn-cancel:hover {
    background-color: #da190b;
}

.btn-cancel:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.modal-content--large {
    max-width: 500px;
}

.current-image {
    margin-bottom: 1rem;
}

.image-label {
    font-weight: bold;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.preview-image {
    max-width: 100%;
    max-height: 200px;
    border-radius: 4px;
    margin-bottom: 0.5rem;
}

.image-upload-section {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background-color: #f5f5f5;
    border-radius: 4px;
}

.image-preview {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.btn-remove {
    padding: 0.25rem 0.5rem;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
}

.btn-remove:hover {
    background-color: #da190b;
}

.btn-remove:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.uploading {
    color: #4CAF50;
    font-size: 0.875rem;
    margin-top: 0.5rem;
}

.image-error {
    color: #f44336;
    font-size: 0.875rem;
    margin-top: 0.5rem;
}

input[type="file"] {
    font-size: 0.875rem;
}
</style>
