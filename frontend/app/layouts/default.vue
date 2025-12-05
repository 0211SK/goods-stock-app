<template>
    <div class="layout-default">
        <AppHeader />

        <main class="layout-default__main">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/layout/AppHeader.vue'
</script>

<style scoped>
.layout-default {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.layout-default__main {
    flex: 1;
    padding: 1.5rem;
    max-width: 1024px;
    margin: 0 auto;
}
</style>
