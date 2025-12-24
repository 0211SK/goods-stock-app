<template>
    <section class="page">
        <PageTitle title="グッズ作品一覧" />
        <GenreSection :genres="genres" />
    </section>
</template>

<script setup lang="ts">
import PageTitle from '~/components/common/PageTitle.vue'
import GenreSection from '~/components/inventory/GenreSection.vue'
import { onMounted } from 'vue'

const { items: genres, fetchWorks } = useWorks()

onMounted(() => {
    fetchWorks({ page: 1, size: 200 })
})
</script>
