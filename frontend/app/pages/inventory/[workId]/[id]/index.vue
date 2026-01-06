<template>
    <section class="page">
        <PageTitle title="グッズ詳細" />

        <div v-if="loading">読み込み中…</div>
        <div v-else-if="error">取得に失敗しました</div>
        <div v-else-if="item">
            <div class="detail">
                <div class="box">
                    <div class="image">
                        <img v-if="item.imageUrl" :src="getImageUrl(item.imageUrl)" alt="" />
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

        <!-- 削除確認・成功・失敗モーダル -->
        <DeleteConfirmModal :show-delete-modal="showDeleteModal" :show-success-modal="showSuccessModal"
            :show-error-modal="showErrorModal" :error-message="deleteErrorMessage" :deleting="deleting"
            @confirm="confirmDelete" @cancel="showDeleteModal = false" @close-success="closeSuccessModal"
            @close-error="showErrorModal = false" />
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from '#imports'
import PageTitle from '~/components/common/PageTitle.vue'
import DeleteConfirmModal from '~/components/common/DeleteConfirmModal.vue'
import { useOwnedItems } from '~/composables/useOwnedItems'
import { useFooterButtons } from '~/composables/useFooterButtons'
import { useImageUpload } from '~/composables/useImageUpload'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const workId = Number(route.params.workId)

const item = ref<any | null>(null)
const { loading, error, fetchDetail, deleteItem: deleteItemApi } = useOwnedItems()
const { getImageUrl } = useImageUpload()
const showDeleteModal = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const deleteErrorMessage = ref('')
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
        deleteErrorMessage.value = e?.message || '削除に失敗しました'
        showErrorModal.value = true
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

// フッターに編集・削除ボタンを追加
useFooterButtons([
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
])

onMounted(async () => {
    try {
        item.value = await fetchDetail(id)
    } catch (e) {
        // エラーはcomposable内で処理される
    }
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
</style>
