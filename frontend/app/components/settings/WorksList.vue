<template>
    <div>
        <div class="actions">
            <button class="btn-add" @click="$emit('add')">+ 新規登録</button>
        </div>

        <div v-if="loading && items.length === 0" class="loading">読み込み中...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else-if="items.length === 0" class="empty">作品がまだ登録されていません</div>
        <div v-else class="works-list">
            <div v-for="group in grouped" :key="group.key" class="works-group">
                <div class="works-group-key">{{ group.key }}</div>
                <div v-for="work in group.items" :key="work.id" class="work-card">
                    <div class="work-info">
                        <h3>{{ work.name }}</h3>
                        <p v-if="work.nameKana" class="kana">{{ work.nameKana }}</p>
                    </div>
                    <div class="work-actions">
                        <button class="btn-edit" @click="$emit('edit', work)">編集</button>
                        <button class="btn-delete" @click="$emit('delete', work)">削除</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { GOJUON } from '~/constants/gojuon'
import type { WorkItem } from '~/composables/useWorks'

const props = defineProps<{
    items: WorkItem[]
    loading: boolean
    error: string | null
}>()

defineEmits<{
    add: []
    edit: [work: WorkItem]
    delete: [work: WorkItem]
}>()

const DAKUON_MAP: Record<string, string> = {
    'が': 'か', 'ぎ': 'き', 'ぐ': 'く', 'げ': 'け', 'ご': 'こ',
    'ざ': 'さ', 'じ': 'し', 'ず': 'す', 'ぜ': 'せ', 'ぞ': 'そ',
    'だ': 'た', 'ぢ': 'ち', 'づ': 'つ', 'で': 'て', 'ど': 'と',
    'ば': 'は', 'び': 'ひ', 'ぶ': 'ふ', 'べ': 'へ', 'ぼ': 'ほ',
    'ぱ': 'は', 'ぴ': 'ひ', 'ぷ': 'ふ', 'ぺ': 'へ', 'ぽ': 'ほ',
}

const normalizeKana = (s: string) => s.trim().toLowerCase()

const groupKeyByKana = (kanaFirst: string | null | undefined) => {
    if (!kanaFirst) return 'その他'
    let k = normalizeKana(kanaFirst).slice(0, 1)
    if (DAKUON_MAP[k]) {
        k = DAKUON_MAP[k] ?? k
    }
    for (const row of GOJUON) {
        if (row.chars.includes(k)) return row.key
    }
    return 'その他'
}

const grouped = computed(() => {
    const map = new Map<string, WorkItem[]>()
    for (const g of props.items) {
        const key = groupKeyByKana(g.nameKana?.slice(0, 1))
        const arr = map.get(key) ?? []
        arr.push(g)
        map.set(key, arr)
    }
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
/** アクションボタンエリア */
.actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
    padding: 0 20px;
}

.btn-add {
    padding: 12px 24px;
    background: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-add:hover {
    background: #45a049;
}

/** 状態表示 */
.loading,
.error,
.empty {
    text-align: center;
    padding: 40px;
    color: #666;
}

.error {
    color: #d32f2f;
}

/** 作品一覧 */
.works-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 800px;
    margin: 0 auto;
}

.work-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    transition: box-shadow 0.2s;
    margin-top: 10px;
}

.work-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.work-info h3 {
    margin: 0 0 4px 0;
    font-size: 16px;
    font-weight: 600;
}

.work-info .kana {
    margin: 0;
    font-size: 13px;
    color: #666;
}

.work-actions {
    display: flex;
    gap: 8px;
}

.btn-edit,
.btn-delete {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-edit {
    background: #2196f3;
    color: white;
}

.btn-edit:hover {
    background: #1976d2;
}

.btn-delete {
    background: #f44336;
    color: white;
}

.btn-delete:hover {
    background: #d32f2f;
}

.works-group-key {
    font-size: 18px;
    font-weight: 700;
    margin-top: 24px;
    margin-bottom: 8px;
    padding-left: 4px;
}

@media (max-width: 480px) {
    .work-card {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .work-actions {
        width: 100%;
        justify-content: flex-end;
    }
}
</style>
