<template>
    <section class="page">
        <PageTitle title="在庫一覧" />
        <InventoryFilterBar />

        <InventoryList />
    </section>
</template>

<script setup lang="ts">
import PageTitle from '~/components/common/PageTitle.vue'
import InventoryFilterBar from '~/components/inventory/InventoryFilterBar.vue'
import InventoryList from '~/components/inventory/InventoryList.vue'
</script>
