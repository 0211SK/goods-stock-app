<template>
    <section class="page">
        <PageTitle title="グッズ詳細" />

        <div v-if="loading">読み込み中…</div>
        <div v-else-if="error">取得に失敗しました</div>
        <div v-else-if="item">
            <div class="detail">
                <div class="box">
                    <img v-if="item.imageUrl" :src="item.imageUrl" alt="" />
                    <div class="image">
                        <img v-if="item.imageUrl" :src="item.imageUrl" alt="" />
                        <div v-else class="no-image">画像なし</div>
                    </div>
                    <div class="info">
                        <h2>{{ item.goodsName ?? item.name }}</h2>
                        <p>ジャンル： {{ item.itemTypeName ?? '' }}</p>
                        <p>価格： <strong v-if="item.unitPrice">¥{{ item.unitPrice }}</strong><span v-else>未設定</span></p>
                        <p>購入日： {{ item.purchaseDate ?? item.createdAt ?? '' }}</p>
                        <p>個数： {{ item.quantity ?? '' }}</p>
                        <p>メモ： {{ item.memo ?? '' }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>データが見つかりません。</div>

        <!-- 削除確認モーダル -->
        <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
            <div class="modal-content" @click.stop>
                <p class="modal-message">本当に削除しますか？</p>
                <div class="modal-buttons">
                    <button class="btn-cancel" :disabled="deleting" @click="showDeleteModal = false">キャンセル</button>
                    <button class="btn-confirm" :disabled="deleting" @click="confirmDelete">
                        {{ deleting ? '削除中...' : '削除' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- 削除成功モーダル -->
        <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
            <div class="modal-content" @click.stop>
                <p class="modal-message success">削除しました</p>
                <div class="modal-buttons">
                    <button class="btn-success" @click="closeSuccessModal">OK</button>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from '#imports'
import PageTitle from '~/components/common/PageTitle.vue'
import { useOwnedItems } from '~/composables/useOwnedItems'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const workId = Number(route.params.workId)

const item = ref<any | null>(null)
const { loading, error, fetchDetail, deleteItem: deleteItemApi } = useOwnedItems()
const showDeleteModal = ref(false)
const showSuccessModal = ref(false)
const deleting = ref(false)

/**
 * 編集ページへ遷移
 */
const goEdit = () => {
    void router.push(`/inventory/${workId}/${id}/edit`)
}

/**
 * 削除処理
 */
const deleteItem = () => {
    showDeleteModal.value = true
}

/**
 * 削除確定処理
 */
const confirmDelete = async () => {
    deleting.value = true
    try {
        await deleteItemApi(id)
        showDeleteModal.value = false
        // 削除成功メッセージを表示
        showSuccessModal.value = true
    } catch (e: any) {
        // エラー時はモーダルを閉じてエラーメッセージを表示
        showDeleteModal.value = false
        alert('削除に失敗しました: ' + (e?.message || '不明なエラー'))
    } finally {
        deleting.value = false
    }
}

/**
 * 成功モーダルを閉じて一覧ページへ遷移
 */
const closeSuccessModal = async () => {
    showSuccessModal.value = false
    await router.push(`/inventory/${item.value.workId}`)
}

/**
 * フッターに追加ボタンを設定
 */
const extraButtons = useState<Array<{
    label: string
    icon: string
    onClick: () => void
    class?: string
}>>('footerExtraButtons', () => [])

onMounted(async () => {
    try {
        item.value = await fetchDetail(id)
    } catch (e) {
        // error is handled inside composable; nothing extra to do
    }

    // フッターに編集・削除ボタンを追加
    extraButtons.value = [
        {
            label: '編集',
            icon: '✏️',
            onClick: goEdit,
            class: 'footer-btn--edit'
        },
        {
            label: '削除',
            icon: '🗑️',
            onClick: deleteItem,
            class: 'footer-btn--delete'
        }
    ]
})

// ページを離れる前にボタンをクリア
onBeforeUnmount(() => {
    extraButtons.value = []
})
</script>

<style scoped>
.detail {
    display: flex;
    gap: 24px;
    align-items: start;
    max-width: 980px;
    margin: 24px auto;
}

.image {
    width: 320px;
    height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fafafa;
    border-radius: 8px;
    border: 1px solid #eee
}

.image img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain
}

.info {
    flex: 1
}

.no-image {
    color: #999
}

.box {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* モーダルオーバーレイ */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

/* モーダルコンテンツ */
.modal-content {
    background: white;
    border-radius: 8px;
    padding: 32px;
    min-width: 320px;
    max-width: 90%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-message {
    font-size: 16px;
    margin: 0 0 24px 0;
    text-align: center;
    color: #333;
}

.modal-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.btn-cancel,
.btn-confirm {
    padding: 10px 24px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-cancel {
    background-color: #e0e0e0;
    color: #333;
}

.btn-cancel:hover {
    background-color: #d0d0d0;
}

.btn-confirm {
    background-color: #d32f2f;
    color: white;
}

.btn-confirm:hover {
    background-color: #b71c1c;
}

.btn-cancel:disabled,
.btn-confirm:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-success {
    padding: 10px 24px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
    background-color: #4caf50;
    color: white;
}

.btn-success:hover {
    background-color: #45a049;
}

.modal-message.success {
    color: #4caf50;
    font-weight: 500;
}
</style>
