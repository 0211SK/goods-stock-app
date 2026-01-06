<template>
    <div>
        <!-- エラーメッセージ表示エリア -->
        <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
        </div>

        <!-- 在庫登録・更新フォーム -->
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
                <input type="date" v-model="formData.purchaseDate" required />
            </label>

            <!-- 画像ファイル選択（オプショナル） -->
            <label>画像ファイル
                <input type="file" accept="image/*" @change="onFileChange" />
            </label>

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
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

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
}

// Propsのデフォルト値を設定
const props = withDefaults(defineProps<Props>(), {
    submitting: false,
    errorMessage: null,
    submitLabel: '登録する'
})

/**
 * コンポーネントが親に通知するイベント定義
 * - submit: フォーム送信時に発火（フォームデータと画像ファイルを渡す）
 * - cancel: キャンセルボタンクリック時に発火
 */
const emit = defineEmits<{
    submit: [data: InventoryFormData, imageFile: File | null]
    cancel: []
}>()

// フォームの入力データを保持するref

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
 * 選択されたファイルをimageFileに保存
 */
const onFileChange = (e: Event) => {
    const files = (e.target as HTMLInputElement).files
    imageFile.value = files?.[0] ?? null
}

/**
 * フォーム送信処理
 * バリデーションチェック後、submitイベントを発火して親コンポーネントに通知
 */
const handleSubmit = () => {
    // 必須項目のチェック（HTML5バリデーションで通常は弾かれるが二重チェック）
    if (!formData.value.workId || !formData.value.itemTypeId) return
    // 親コンポーネントにデータを渡す
    emit('submit', formData.value, imageFile.value)
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

.actions {
    display: flex;
    gap: 100px
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
</style>
