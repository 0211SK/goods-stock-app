<template>
    <div class="inventory-form-root">
        <!-- 読み込み中・エラー表示 -->
        <div v-if="(loading && !item) || (error && !item)" class="center-message">
            <div v-if="loading && !item">読み込み中…</div>
            <div v-else>データの取得に失敗しました。リロードしてください</div>
        </div>
        <!-- エラーメッセージ表示エリア（フォーム用） -->
        <div v-else>
            <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
            </div>

            <!-- 在庫登録・更新フォーム -->
            <form class="form" @submit.prevent="handleSubmit">
                <!-- 作品選択 -->
                <label>作品
                    <select v-model.number="formData.workId" required>
                        <option value="">選択してください</option>
                        <option v-for="w in works" :key="w.id" :value="w.id">{{ w.name }}</option>
                    </select>
                </label>

                <!-- 種類選択 -->
                <label>種類
                    <select v-model.number="formData.itemTypeId" required>
                        <option value="">選択してください</option>
                        <option v-for="t in itemTypes" :key="t.id" :value="t.id">{{ t.name }}</option>
                    </select>
                </label>

                <!-- グッズ名入力（最大255文字） -->
                <label>グッズ名
                    <input v-model="formData.goodsName" required maxlength="255" />
                </label>

                <!-- 個数入力（1以上） -->
                <label>個数
                    <input type="number" v-model.number="formData.quantity" min="1" required />
                </label>

                <!-- 価格入力（0円以上） -->
                <label>価格
                    <input type="number" v-model.number="formData.unitPrice" min="0" required />
                </label>

                <!-- 購入日入力 -->
                <label>購入日
                    <input type="date" v-model="formData.purchaseDate" :max="today" required />
                </label>

                <!-- 画像アップロード（オプショナル） -->
                <div class="image-upload">
                    <label>画像</label>

                    <!-- 画像プレビュー -->
                    <div v-if="formData.imageUrl" class="image-preview">
                        <img :src="getImageUrl(formData.imageUrl)" alt="プレビュー" />
                        <button type="button" class="btn-remove" @click="removeImage" :disabled="imageUploading">
                            削除
                        </button>
                    </div>

                    <!-- ファイル選択 -->
                    <div v-else>
                        <input ref="fileInput" type="file" accept="image/*" @change="onFileChange"
                            :disabled="imageUploading" />
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

                <!-- メモ入力（最大1000文字、オプショナル） -->
                <label>メモ
                    <textarea v-model="formData.memo" maxlength="1000"></textarea>
                </label>

                <!-- 送信・キャンセルボタン -->
                <div class="actions">
                    <button type="submit" :disabled="submitting">{{ submitLabel }}</button>
                    <button type="button" @click="handleCancel">キャンセル</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useImageUpload } from '~/composables/useImageUpload'

/**
 * 在庫フォームのデータ型
 * 登録・更新時に使用するデータ構造
 */
export interface InventoryFormData {
    workId: number | null          // 作品ID
    itemTypeId: number | null      // 種類ID
    goodsName: string              // グッズ名
    quantity: number               // 個数
    unitPrice: number              // 価格
    purchaseDate: string           // 購入日
    imageUrl: string | null        // 画像URL
    memo: string | null            // メモ
}

/** 作品の型定義 */
interface Work {
    id: number
    name: string
}

/** 種類の型定義 */
interface ItemType {
    id: number
    name: string
}

/**
 * コンポーネントのProps定義
 */
interface Props {
    initialData?: Partial<InventoryFormData>  // 初期データ（編集時に使用）
    works: Work[]                             // 作品一覧
    itemTypes: ItemType[]                     // 種類一覧
    submitting?: boolean                      // 送信中フラグ
    errorMessage?: string | null              // エラーメッセージ
    submitLabel?: string                      // 送信ボタンのラベル
    loading?: boolean                         // 読み込み中フラグ
    error?: string | null                     // データ取得エラー
    item?: any | null                         // 編集対象データ
}

// Propsのデフォルト値を設定
const props = withDefaults(defineProps<Props>(), {
    submitting: false,
    errorMessage: null,
    submitLabel: '登録する'
})

/**
 * コンポーネントが親に通知するイベント定義
 * - submit: フォーム送信時に発火（フォームデータのみ、画像は即座アップロード済み）
 * - cancel: キャンセルボタンクリック時に発火
 */
const emit = defineEmits<{
    submit: [data: InventoryFormData]
    cancel: []
}>()

// 画像アップロード用のcomposable
const { uploadImage, deleteImage, validateImageFile, getImageUrl, loading: imageUploading, error: imageError } = useImageUpload()

// ファイル入力要素への参照
const fileInput = ref<HTMLInputElement>()

// フォームの入力データを保持するref
const formData = ref<InventoryFormData>({
    workId: null,
    itemTypeId: null,
    goodsName: '',
    quantity: 1,
    unitPrice: 0,
    purchaseDate: '',
    imageUrl: null,
    memo: null,
})

// 選択された画像ファイルを保持
const imageFile = ref<File | null>(null)

// 今日の日付を取得（未来の日付を入力できないようにするため）
const today = computed(() => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
})

// 初期データがあればフォームに設定（編集モード用）
if (props.initialData) {
    formData.value = {
        workId: props.initialData.workId ?? null,
        itemTypeId: props.initialData.itemTypeId ?? null,
        goodsName: props.initialData.goodsName ?? '',
        quantity: props.initialData.quantity ?? 1,
        unitPrice: props.initialData.unitPrice ?? 0,
        purchaseDate: props.initialData.purchaseDate ?? '',
        imageUrl: props.initialData.imageUrl ?? null,
        memo: props.initialData.memo ?? null,
    }
}

// 初期データの変更を監視してフォームを更新（編集モードで別のアイテムを読み込んだ場合など）
watch(() => props.initialData, (newData) => {
    if (newData) {
        formData.value = {
            workId: newData.workId ?? null,
            itemTypeId: newData.itemTypeId ?? null,
            goodsName: newData.goodsName ?? '',
            quantity: newData.quantity ?? 1,
            unitPrice: newData.unitPrice ?? 0,
            purchaseDate: newData.purchaseDate ?? '',
            imageUrl: newData.imageUrl ?? null,
            memo: newData.memo ?? null,
        }
    }
}, { deep: true })

/**
 * 画像ファイル選択時の処理
 * ファイルを選択したら即座にアップロード
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
        // 古い画像があれば削除
        if (formData.value.imageUrl) {
            try {
                await deleteImage(formData.value.imageUrl)
            } catch (e) {
                console.warn('古い画像の削除に失敗しましたが、続行します', e)
            }
        }

        // 新しい画像をアップロード（相対パスが返される）
        const uploadedUrl = await uploadImage(file)

        // フォームデータを更新（相対パスで保存）
        formData.value.imageUrl = uploadedUrl

    } catch (e: any) {
        console.error('画像アップロードエラー:', e)
        alert('画像のアップロードに失敗しました')
    }
}

/**
 * 画像削除処理
 */
const removeImage = async () => {
    if (!formData.value.imageUrl) return

    try {
        await deleteImage(formData.value.imageUrl)
        formData.value.imageUrl = null

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
 * フォーム送信処理
 * バリデーションチェック後、submitイベントを発火して親コンポーネントに通知
 * 画像は既にアップロード済みなのでformData.imageUrlに含まれている
 */
const handleSubmit = () => {
    // 必須項目のチェック（HTML5バリデーションで通常は弾かれるが二重チェック）
    if (!formData.value.workId || !formData.value.itemTypeId) return
    // 親コンポーネントにデータを渡す（画像URLは既に含まれている）
    emit('submit', formData.value)
}

/**
 * キャンセルボタンクリック時の処理
 * cancelイベントを発火して親コンポーネントに通知
 */
const handleCancel = () => {
    emit('cancel')
}
</script>

<style scoped>
.form {
    max-width: 640px;
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    gap: 12px
}

.form label {
    display: flex;
    flex-direction: column;
    font-size: 14px
}

.form input,
.form select,
.form textarea {
    height: 25px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

.form textarea {
    min-height: 40px;
    resize: vertical;
}

.actions {
    display: flex;
    justify-content: center;
    gap: 50px;
}

.inventory-form-root {
    max-width: 640px;
    margin: 0 auto;
}

.center-message {
    text-align: center;
    padding: 40px 20px;
    color: #666;
    font-size: 14px;
}

.error-message {
    max-width: 640px;
    margin: 20px auto 0;
    padding: 12px;
    background: #fee;
    border: 1px solid #fcc;
    border-radius: 4px;
    color: #c33;
    font-size: 14px
}

.image-upload {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.image-preview {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: start;
}

.image-preview img {
    max-width: 300px;
    max-height: 300px;
    object-fit: contain;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.btn-remove {
    padding: 6px 12px;
    background: #d32f2f;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.btn-remove:hover {
    background: #b71c1c;
}

.btn-remove:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.uploading {
    color: #666;
    font-size: 14px;
}

.image-error {
    color: #d32f2f;
    font-size: 14px;
}
</style>
