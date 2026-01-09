import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import EditPage from '../../../app/pages/inventory/[workId]/[id]/edit.vue'

// 必要なモック
vi.mock('../../../app/composables/useWorks', () => ({
    useWorks: () => ({
        items: [],
        fetchWorks: vi.fn()
    })
}))
vi.mock('../../../app/composables/useItemTypes', () => ({
    useItemTypes: () => ({
        items: [],
        fetchList: vi.fn()
    })
}))
vi.mock('../../../app/composables/useOwnedItems', () => ({
    useOwnedItems: () => ({
        loading: false,
        error: '',
        fetchDetail: vi.fn(async () => ({ id: 1, workId: 2, itemTypeId: 3, goodsName: 'test', quantity: 1, unitPrice: 100, purchaseDate: '2026-01-01', imageUrl: null, memo: null })),
        update: vi.fn()
    })
}))

// #importsのモック
vi.mock('#imports', () => ({
    useRoute: () => ({ params: { id: '1', workId: '2' } }),
    useRouter: () => ({ push: vi.fn() })
}))

describe('EditPage', () => {
    let wrapper: any

    beforeEach(async () => {
        wrapper = mount(EditPage)
        await new Promise(r => setTimeout(r, 0)) // onMountedのasync処理待ち
    })

    it('タイトルが表示される', () => {
        expect(wrapper.text()).toContain('グッズ詳細編集')
    })

    it('フォームが表示される', () => {
        expect(wrapper.findComponent({ name: 'InventoryForm' }).exists()).toBe(true)
    })

    it('loading時は「読み込み中…」が表示される', async () => {
        wrapper.vm.loading = true
        wrapper.vm.item = null
        await wrapper.vm.$nextTick()
        expect(wrapper.text()).toContain('読み込み中…')
    })

    it('error時は「データの取得に失敗しました」が表示される', async () => {
        wrapper.vm.error = 'error'
        wrapper.vm.item = null
        await wrapper.vm.$nextTick()
        expect(wrapper.text()).toContain('データの取得に失敗しました')
    })

    it('キャンセルで詳細ページに遷移する', async () => {
        const router = wrapper.vm.router
        await wrapper.vm.cancel()
        expect(router.push).toHaveBeenCalledWith('/inventory/2/1')
    })
})
