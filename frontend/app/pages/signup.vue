<template>
    <main class="login-root">
        <h1>新規ユーザー登録</h1>
        <form @submit.prevent="onSubmit" class="login-form">
            <label class="login-label">
                メール
                <input v-model="email" type="email" required class="login-input" />
            </label>
            <label class="login-label">
                パスワード
                <input v-model="password" type="password" required minlength="6" class="login-input" />
            </label>
            <button type="submit" :disabled="loading" class="login-button">
                {{ loading ? '送信中...' : '登録' }}
            </button>
            <p v-if="error" class="login-error">{{ error.message }}</p>
            <p v-if="response" class="signup-success">メールを送信しました。既に登録済みの場合は、ログインまたはメールをご確認ください。</p>
        </form>
        <div class="signup-link-wrapper">
            <nuxt-link to="/login" class="signup-link">ログイン画面へ戻る</nuxt-link>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSignup } from '../composables/useSignup'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'

if (typeof definePageMeta !== 'undefined') {
    definePageMeta({ layout: 'auth' })
}

const email = ref('')
const password = ref('')
const { signup, loading, error, response } = useSignup()
const { setToken } = useAuth()
const router = useRouter()

const onSubmit = async () => {
    await signup({ email: email.value, password: password.value })
    if (response.value && response.value.session && response.value.session.access_token) {
        setToken(response.value.session.access_token)
        await router.push('/')
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

.signup-link-wrapper {
    margin-top: 18px;
    text-align: center;
}

.signup-link {
    color: #1976d2;
    text-decoration: underline;
    cursor: pointer;
    font-size: 15px;
    display: inline-block;
    margin-top: 8px;
}

.signup-success {
    color: #388e3c;
    text-align: center;
    margin-top: 8px;
}

/* ===== スマホ調整 ===== */
@media (max-width: 767px) {
    .login-root {
        margin-top: -21px;
        padding: 0px;
    }

    .login-input {
        padding: 20px;
        font-size: 18px;
    }

    .login-form {
        width: 70%;
    }

    .login-button {
        padding: 25px;
        font-size: 16px;
    }
}
</style>
