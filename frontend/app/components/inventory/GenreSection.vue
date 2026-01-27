<template>
    <section class="genre">
        <!-- 作品検索（一覧と同じ幅・中央揃え） -->
        <div class="genre__search">
            <div class="genre__search-inner">
                <input v-model="q" type="text" class="genre__input" placeholder="作品検索" autocomplete="off" />
                <button v-if="q" type="button" class="genre__clear" aria-label="検索条件をクリア" @click="q = ''">
                    ×
                </button>
            </div>
        </div>

        <!-- ローディング表示 -->
        <div v-if="loading" class="genre__loading">
            読み込み中…
        </div>

        <!-- エラー表示 -->
        <div v-else-if="error" class="genre__error">
            データの取得に失敗しました。リロードしてください
        </div>

        <!-- 一覧 -->
        <div v-else-if="grouped.length === 0" class="genre__empty">
            作品が存在しません
        </div>

        <div v-else class="genre__groups">
            <div v-for="g in grouped" :key="g.key" class="genre__group">
                <div class="genre__group-key">{{ g.key }}</div>

                <div class="genre__list">
                    <NuxtLink v-for="item in g.items" :key="item.id" :to="`/inventory/${item.id}`" class="genre__row">
                        <span class="genre__name">{{ item.name }}</span>
                        <span class="genre__arrow">›</span>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { GOJUON } from '~/constants/gojuon'
import type { WorkItem } from '~/composables/useWorks'

const props = defineProps<{
    genres: WorkItem[]
    error: string | null
    loading: boolean
}>()

const q = ref('')

const normalizeKana = (s: string) => s.trim().toLowerCase()

// 濁音・半濁音を清音に変換するマップ
const DAKUON_MAP: Record<string, string> = {
    'が': 'か', 'ぎ': 'き', 'ぐ': 'く', 'げ': 'け', 'ご': 'こ',
    'ざ': 'さ', 'じ': 'し', 'ず': 'す', 'ぜ': 'せ', 'ぞ': 'そ',
    'だ': 'た', 'ぢ': 'ち', 'づ': 'つ', 'で': 'て', 'ど': 'と',
    'ば': 'は', 'び': 'ひ', 'ぶ': 'ふ', 'べ': 'へ', 'ぼ': 'ほ',
    'ぱ': 'は', 'ぴ': 'ひ', 'ぷ': 'ふ', 'ぺ': 'へ', 'ぽ': 'ほ',
}

const groupKeyByKana = (kanaFirst: string | null | undefined) => {
    if (!kanaFirst) return 'その他'
    let k = normalizeKana(kanaFirst).slice(0, 1)
    // 濁音・半濁音を清音に変換
    if (DAKUON_MAP[k] !== undefined) {
        k = DAKUON_MAP[k] as string
    }
    for (const row of GOJUON) {
        if (row.chars.includes(k)) return row.key
    }
    return 'その他'
}

const filtered = computed(() => {
    const kw = q.value.trim()
    if (!kw) return props.genres
    return props.genres.filter(g => g.name.includes(kw) || (g.nameKana ?? '').includes(kw))
})

const grouped = computed(() => {
    const map = new Map<string, WorkItem[]>()

    for (const g of filtered.value) {
        const key = groupKeyByKana(g.nameKana?.slice(0, 1))
        const arr = map.get(key) ?? []
        arr.push(g)
        map.set(key, arr)
    }

    // 表示順：あ→か→…→わ→その他
    const order = [...GOJUON.map(x => x.key), 'その他']

    return order
        .map(key => ({
            key,
            items: (map.get(key) ?? []).sort((a, b) => a.name.localeCompare(b.name, 'ja')),
        }))
        .filter(x => x.items.length > 0)
})
</script>

<style scoped>
.genre {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.genre__error,
.genre__loading,
.genre__empty {
    width: min(720px, 100%);
    padding: 18px 12px;
    color: #6b7280;
    text-align: center;
}

/* 検索バー */
.genre__search {
    margin: 0 auto 18px;
}

.genre__search-inner {
    position: relative;
    display: flex;
    justify-content: center;
}

.genre__input {
    width: 100%;
    height: 44px;
    border: 1px solid #d1d5db;
    border-radius: 12px;
    padding: 0 44px 0 12px;
    /* 右にクリアボタン分の余白 */
    outline: none;
}

.genre__input:focus {
    border-color: #9ca3af;
}

/* クリアボタン */
.genre__clear {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    width: 28px;
    height: 28px;
    border: 1px solid #e5e7eb;
    border-radius: 999px;
    background: #fff;
    cursor: pointer;
    line-height: 26px;
    text-align: center;
    font-size: 18px;
    color: #6b7280;
}

.genre__clear:hover {
    border-color: #9ca3af;
}

/* グループ */
.genre__group {
    margin: 18px 0 22px;
}

.genre__group-key {
    font-size: 20px;
    font-weight: 800;
    margin: 6px 0 10px;
    padding-left: 4px;
}

.genre__list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.genre__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    padding: 0 16px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    text-decoration: none;
    color: #111827;
    background: #fff;
}

.genre__row:hover {
    border-color: #9ca3af;
}

.genre__name {
    font-weight: 600;
}

.genre__arrow {
    font-size: 20px;
    opacity: 0.6;
}
</style>
