import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
    plugins: [vue()],
    test: {
        globals: true,
        environment: 'happy-dom',
        setupFiles: ['./test/setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'test/',
                '**/*.config.ts',
                '**/*.d.ts',
                '.nuxt/',
                'dist/',
            ],
        },
    },
    resolve: {
        alias: {
            '~': fileURLToPath(new URL('./app', import.meta.url)),
            '@': fileURLToPath(new URL('./app', import.meta.url)),
            '#imports': fileURLToPath(new URL('./test/mocks/nuxt-imports.ts', import.meta.url)),
        },
    },
})
