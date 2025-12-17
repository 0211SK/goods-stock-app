<template>
    <main style="max-width: 360px; margin: 48px auto; padding: 16px;">
        <h1>ログイン</h1>

        <form @submit.prevent="onSubmit" style="display: grid; gap: 12px; margin-top: 16px;">
            <label>
                メール
                <input v-model="email" type="email" required style="width: 100%; padding: 8px;" />
            </label>

            <label>
                パスワード
                <input v-model="password" type="password" required style="width: 100%; padding: 8px;" />
            </label>

            <button type="submit" :disabled="loading" style="padding: 10px;">
                {{ loading ? '送信中...' : 'ログイン' }}
            </button>

            <p v-if="error" style="color: red;">{{ error }}</p>
        </form>
    </main>
</template>

<script setup lang="ts">
const email = ref('test@example.com')
const password = ref('password123')
const loading = ref(false)
const error = ref('')

const { login } = useAuth()
const router = useRouter()

const onSubmit = async () => {
    loading.value = true
    error.value = ''
    try {
        await login(email.value, password.value)
        await router.push('/')
    } catch (e) {
        error.value = 'メールまたはパスワードが正しくありません'
    } finally {
        loading.value = false
    }
}
</script>
