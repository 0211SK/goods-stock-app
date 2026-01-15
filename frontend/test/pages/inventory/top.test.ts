import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import InventoryTopPage from '../../../app/pages/inventory/index.vue'

// 必要なcomposableのモック
vi.mock('../../../app/composables/useWorks', () => ({
    useWorks: () => ({
        items: [{ id: 1, name: 'ジャンルA' }],
        fetchWorks: vi.fn()
    })
}))
vi.mock('../../../app/composables/useFooterButtons', () => ({
    useFooterButtons: vi.fn()
}))

// #importsのモック
const mockPush = vi.fn()
vi.mock('#imports', () => ({
    useRouter: () => ({ push: mockPush })
}))

describe('InventoryTopPage', () => {
    let wrapper: any

    beforeEach(async () => {
        wrapper = mount(InventoryTopPage)
        await new Promise(r => setTimeout(r, 0))
    })

    it('タイトルが表示される', () => {
        expect(wrapper.text()).toContain('グッズ作品一覧')
    })

    it('GenreSectionが表示される', () => {
        expect(wrapper.findComponent({ name: 'GenreSection' }).exists()).toBe(true)
    })

    it('goCreateで新規登録ページに遷移する', async () => {
        await wrapper.vm.goCreate()
        expect(mockPush).toHaveBeenCalledWith('/inventory/new')
    })
})
