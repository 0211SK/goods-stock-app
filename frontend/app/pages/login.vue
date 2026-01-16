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
import { onMounted, onUnmounted } from 'vue'

// bodyのスクロール禁止
onMounted(() => {
    document.body.style.overflow = 'hidden'
})
onUnmounted(() => {
    document.body.style.overflow = ''
})

/**
 * ログインページ
 * メールアドレスとパスワードでSupabase認証を行う
 */

// ページメタデータ：ヘッダー・フッターを非表示にする'auth'レイアウトを使用
definePageMeta({
    layout: 'auth'
})

// フォーム入力値（開発用にデフォルト値を設定）
const email = ref('test@example.com')
const password = ref('password123')
// ログイン処理中フラグ（ボタンの無効化に使用）
const loading = ref(false)
// エラーメッセージ
const error = ref('')

// 認証関連の機能を取得
const { login } = useAuth()
// ルーター（ログイン成功後の遷移に使用）
const router = useRouter()

/**
 * ログインフォーム送信時の処理
 * 1. Supabaseで認証
 * 2. 成功したらトップページ（/）に遷移
 * 3. 失敗したらエラーメッセージを表示
 */
const onSubmit = async () => {
    // ローディング開始
    loading.value = true
    // エラーメッセージをクリア
    error.value = ''
    try {
        // Supabaseでログイン処理を実行（トークンがCookieに保存される）
        await login(email.value, password.value)
        // ログイン成功後、トップページに遷移
        await router.push('/')
    } catch (e) {
        // ログイン失敗時のエラーメッセージ
        error.value = 'メールまたはパスワードが正しくありません'
    } finally {
        // ローディング終了
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

/* ===== スマホ調整 ===== */
@media (max-width: 767px) {
    .login-root {
        /* h1のマージン調整 */
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
