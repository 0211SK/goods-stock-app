<template>
    <section class="page">
        <PageTitle title="欲しいものリスト" />
        <WishlistFilterBar />

        <WishlistList />
    </section>
</template>

<script setup lang="ts">
import PageTitle from '~/components/common/PageTitle.vue'
import WishlistFilterBar from '~/components/wishlist/WishlistFilterBar.vue'
import WishlistList from '~/components/wishlist/WishlistList.vue'
</script>
