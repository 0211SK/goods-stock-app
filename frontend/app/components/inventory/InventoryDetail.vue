<template>
    <div class="inventory-detail">
        <div v-if="loading" class="loading">読み込み中…</div>
        <div v-else-if="error" class="error">データの取得に失敗しました。リロードしてください</div>
        <div v-else-if="!item" class="no-data">データが見つかりません。</div>
        <div v-else>
            <div class="detail">
                <div class="box">
                    <div class="image" :class="{ 'no-image-bg': !item.imageUrl }">
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
.inventory-detail {
    margin-top: 18px;
    padding: 0 12px;
}

.loading,
.error,
.no-data {
    text-align: center;
    color: #666;
    padding: 40px 20px;
}

.detail {
    display: flex;
    gap: 24px;
    align-items: start;
    max-width: 980px;
    margin: 24px auto;
}

.image {
    width: 320px;
    height: 360px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
}

.image img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain
}

.info {
    flex: 1
}

.image.no-image-bg {
    background-color: #e2e2e2;
}

.no-image {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6e6e6e
}

.box {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* タブレット表示 */
@media (max-width: 1100px) {
    .detail {
        gap: 16px;
    }

    .image {
        width: 280px;
        height: 320px;
    }
}

/* スマホ横向き・小型タブレット */
@media (max-width: 800px) {
    .detail {
        gap: 12px;
    }

    .image {
        width: 280px;
        height: 320px;
    }
}

/* スマホ縦向き */
@media (max-width: 480px) {
    .inventory-detail {
        margin-top: 12px;
        padding: 0 6px;
    }

    .detail {
        gap: 8px;
        flex-direction: column;
        align-items: stretch;
    }

    .image {
        width: 260px;
        height: 300px;
    }

    .box {
        gap: 8px;
    }
}

/* 極小スマホ（320px以下） */
@media (max-width: 360px) {
    .detail {
        gap: 6px;
    }

    .image {
        width: 200px;
        height: 240px;
    }
}
</style>