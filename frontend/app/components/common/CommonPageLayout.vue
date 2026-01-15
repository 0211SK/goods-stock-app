<template>
    <div class="box">
        <div class="box2">
            <PageTitle :title="title" class="page-title" />
            <slot name="filter" />
        </div>
        <slot />
    </div>
</template>

<script setup lang="ts">
import PageTitle from '~/components/common/PageTitle.vue'
defineProps<{ title: string }>()
</script>

<style scoped>
.box2 {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 18px 12px;
}

.page-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 1rem;
}
</style>
