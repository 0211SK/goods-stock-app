<template>
    <main class="login-root">
        <h1>ログイン</h1>

        <form @submit.prevent="onSubmit" class="login-form">
            <label class="login-label">
                メール
                <input v-model="email" type="email" required class="login-input" />
            </label>

            <label class="login-label">
                パスワード
                <input v-model="password" type="password" required class="login-input" />
            </label>

            <button type="submit" :disabled="loading" class="login-button">
                {{ loading ? '送信中...' : 'ログイン' }}
            </button>

            <p v-if="error" class="login-error">{{ error }}</p>
        </form>
    </main>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'auth'
})

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

<style scoped>
.login-root {
    max-width: 360px;
    margin: 0 auto;
    padding: 16px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.login-root h1 {
    margin-bottom: 24px;
    text-align: center;
}

.login-form {
    display: grid;
    gap: 12px;
    width: 100%;
}

.login-label {
    display: block;
}

.login-input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}

.login-button {
    padding: 10px;
}

.login-error {
    color: red;
    text-align: center;
}
</style>
