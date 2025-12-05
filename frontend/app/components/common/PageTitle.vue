<template>
    <h1 class="page-title">{{ title }}</h1>
</template>

<script setup lang="ts">
const props = defineProps<{
    title: string
}>()
</script>

<style scoped>
.page-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 1rem;
}
</style>
