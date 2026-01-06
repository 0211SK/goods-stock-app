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
const { loading, error, fetchDetail } = useOwnedItems()

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
    if (confirm('本当に削除しますか？')) {
        // TODO: 削除API実装後に処理を追加
        alert('削除機能は実装予定です')
    }
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
</style>
