<!-- このページは接続確認用のページ
本番環境では表示されないようにする -->
<!-- <template>
    <main style="padding: 16px;">
        <h1>接続確認</h1>

        <h2>token</h2>
        <pre style="white-space: pre-wrap; word-break: break-all;">{{ token }}</pre>

        <h2>/api/auth/me response</h2>
        <pre style="white-space: pre-wrap; word-break: break-all;">{{ me }}</pre>

        <h2>error</h2>
        <pre style="white-space: pre-wrap; word-break: break-all;">{{ err }}</pre>
    </main>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp()
const { token } = useAuth()

const me = ref<any>(null)
const err = ref<string>('')

onMounted(async () => {
    try {
        me.value = await $api('/api/v1/auth/me')
    } catch (e: any) {
        err.value = e?.data?.message || e?.message || 'failed'
    }
})
</script> -->

<!-- 本番用 -->
<template></template>
<script setup lang="ts">
import { navigateTo } from 'nuxt/app'

onMounted(() => {
    navigateTo('/inventory')
})
</script>
