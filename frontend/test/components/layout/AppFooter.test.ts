import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppFooter from '../../../app/components/layout/AppFooter.vue'

// モック関数を定義
const mockPush = vi.fn()
const mockBack = vi.fn()

// Nuxtのインポートをモック
vi.mock('#imports', () => ({
    useRouter: () => ({
        push: mockPush,
        back: mockBack,
    }),
    useState: (key: string, init: () => any) => ({ value: init() }),
}))

describe('AppFooter.vue', () => {
    it('footer要素が存在する', () => {
        const wrapper = mount(AppFooter)
        expect(wrapper.find('footer.app-footer').exists()).toBe(true)
    })

    it('footer-buttonsクラスのdivが存在する', () => {
        const wrapper = mount(AppFooter)
        expect(wrapper.find('.footer-buttons').exists()).toBe(true)
    })

    it('トップボタンが表示される', () => {
        const wrapper = mount(AppFooter)

        const homeButton = wrapper.find('.footer-btn--home')
        expect(homeButton.exists()).toBe(true)
        expect(homeButton.text()).toContain('トップ')
        expect(homeButton.find('.icon').text()).toBe('🏠')
        expect(homeButton.attributes('title')).toBe('トップページへ')
    })

    it('戻るボタンが表示される', () => {
        const wrapper = mount(AppFooter)

        const backButton = wrapper.find('.footer-btn--back')
        expect(backButton.exists()).toBe(true)
        expect(backButton.text()).toContain('戻る')
        expect(backButton.find('.icon').text()).toBe('←')
        expect(backButton.attributes('title')).toBe('前のページへ戻る')
    })

    it('トップボタンクリックで/inventoryへ遷移する', async () => {
        vi.clearAllMocks()
        const wrapper = mount(AppFooter)

        const homeButton = wrapper.find('.footer-btn--home')
        await homeButton.trigger('click')

        expect(mockPush).toHaveBeenCalledWith('/inventory')
        expect(mockPush).toHaveBeenCalledTimes(1)
    })

    it('戻るボタンクリックでrouter.back()が呼ばれる', async () => {
        vi.clearAllMocks()
        const wrapper = mount(AppFooter)

        const backButton = wrapper.find('.footer-btn--back')
        await backButton.trigger('click')

        expect(mockBack).toHaveBeenCalledTimes(1)
    })

    it('トップボタンと戻るボタンにアイコンとラベルが含まれる', () => {
        const wrapper = mount(AppFooter)

        const buttons = wrapper.findAll('.footer-btn')

        buttons.forEach(button => {
            expect(button.find('.icon').exists()).toBe(true)
            expect(button.find('.label').exists()).toBe(true)
        })
    })
})
