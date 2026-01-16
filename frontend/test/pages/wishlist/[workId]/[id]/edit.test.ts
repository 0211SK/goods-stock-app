
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import EditPage from '../../../../../app/pages/wishlist/[workId]/[id]/edit.vue'
import WishlistForm from '../../../../../app/components/wishlist/WishlistForm.vue'

// updateSpyをグローバルで定義
const updateSpy = vi.fn()

// 必要なモック
vi.mock('../../../../app/composables/useWorks', () => ({
    useWorks: () => ({
        items: [],
        fetchWorks: vi.fn()
    })
}))
vi.mock('../../../../app/composables/useItemTypes', () => ({
    useItemTypes: () => ({
        items: [],
        fetchList: vi.fn()
    })
}))
vi.mock('../../../../app/composables/useWishlistItems', () => ({
    useWishlistItems: () => ({
        loading: false,
        error: '',
        fetchDetail: vi.fn(async () => ({ id: 1, workId: 2, itemTypeId: 3, goodsName: 'test', quantity: 1, expectedUnitPrice: 100, releaseDate: '2026-01-01', imageUrl: null, memo: null })),
        update: updateSpy
    })
}))

// #importsのモック
vi.mock('#imports', () => ({
    useRoute: () => ({ params: { id: '1', workId: '2' } }),
    useRouter: () => ({ push: vi.fn() })
}))

describe('Wishlist EditPage', () => {
    let wrapper: any

    beforeEach(async () => {
        wrapper = mount(EditPage, {
            global: {
                // WishlistFormのスタブをやめて実際のコンポーネントを使う
                stubs: {}
            }
        })
        await flushPromises()
    })

    it('タイトルが表示される', () => {
        expect(wrapper.text()).toContain('欲しいもの詳細編集')
    })

    it('フォームが表示される', async () => {
        // itemがnullのままだとフォームは表示されないため、ダミーデータをセット
        wrapper.vm.item = { id: 1, workId: 2, itemTypeId: 3, goodsName: 'test', quantity: 1, expectedUnitPrice: 100, releaseDate: '2026-01-01', imageUrl: null, memo: null }
        await wrapper.vm.$nextTick()
        expect(wrapper.findComponent({ name: 'WishlistForm' }).exists()).toBe(true)
    })

    it('loading時は「読み込み中…」が表示される', async () => {
        wrapper.vm.loading = true
        wrapper.vm.item = null
        await wrapper.vm.$nextTick()
        expect(wrapper.text()).toContain('読み込み中…')
    })

    it('error時は「データの取得に失敗しました。リロードしてください」が表示される', async () => {
        wrapper.vm.error = 'error'
        wrapper.vm.item = null
        await wrapper.vm.$nextTick()
        expect(wrapper.text()).toContain('データの取得に失敗しました。リロードしてください')
    })

    it('onSubmitでupdateが呼ばれ、詳細ページに遷移する', async () => {
        updateSpy.mockClear()
        updateSpy.mockImplementation(async (id, payload) => undefined)
        // itemがnullでないことを保証
        wrapper.vm.item = { id: 1, workId: 2, itemTypeId: 3, goodsName: 'test', quantity: 1, expectedUnitPrice: 100, releaseDate: '2026-01-01', imageUrl: null, memo: null }
        await wrapper.vm.$nextTick()
        const router = wrapper.vm.router
        await wrapper.vm.onSubmit({ workId: 2, itemTypeId: 3, goodsName: 'test', quantity: 1, expectedUnitPrice: 100, releaseDate: '2026-01-01', imageUrl: null, memo: null })
        await flushPromises()
        expect(router.push).toHaveBeenCalledWith('/wishlist/2/1')
    })

    it('cancelで詳細ページに遷移する', async () => {
        const router = wrapper.vm.router
        await wrapper.vm.cancel()
        expect(router.push).toHaveBeenCalledWith('/wishlist/2/1')
    })
})
