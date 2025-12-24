<template>
    <section class="page">
        <PageTitle title="グッズジャンル一覧" />
        <GenreSection :genres="genres" />
    </section>
</template>

<script setup lang="ts">
import PageTitle from '~/components/common/PageTitle.vue'
import GenreSection from '~/components/inventory/GenreSection.vue'

// ここは後でAPIに置き換えてください
type Genre = { id: number; name: string; nameKana?: string | null }

const genres = ref<Genre[]>([
    { id: 1, name: 'テスト作品名', nameKana: 'てすとさくひんめい' },
    { id: 2, name: 'テスト作品B', nameKana: 'てすとさくひんびー' },
])
</script>
