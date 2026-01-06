<template>
    <div>
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
    </div>
</template>

<script setup lang="ts">
import { useImageUpload } from '~/composables/useImageUpload'

defineProps<{
    item: any | null
    loading: boolean
    error: string | null
}>()

const { getImageUrl } = useImageUpload()
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
