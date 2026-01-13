import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import WishlistIndexPage from '../../../app/pages/wishlist/index.vue'

// 必要なモック
const mockPush = vi.fn()
let footerButtons: any[] = []

vi.mock('@/composables/useFooterButtons', () => ({
    useFooterButtons: (btns: any[]) => {
        footerButtons = btns
        return btns
    }
}))
vi.mock('#imports', () => ({
    useRoute: () => ({ query: {} }),
    useRouter: () => ({ push: mockPush })
}))

// 子コンポーネントはスタブ
vi.mock('@/components/common/PageTitle.vue', () => ({ default: { props: ['title'], template: '<div>{{ title }}</div>' } }))
vi.mock('@/components/wishlist/WishlistFilterBar.vue', () => ({ default: { template: '<div />', props: ['filters'] } }))
vi.mock('@/components/wishlist/WishlistList.vue', () => ({ default: { template: '<div />', props: ['workId', 'filters'] } }))

describe('WishlistIndexPage', () => {
    let wrapper: any

    beforeEach(async () => {
        vi.clearAllMocks()
        footerButtons = []
        wrapper = mount(WishlistIndexPage)
        await flushPromises()
    })

    it('タイトルが表示される', () => {
        expect(wrapper.text()).toContain('欲しいものリスト')
    })

    it('フィルタバーとリストが表示される', () => {
        // フィルタバーとリストのスタブが存在するか
        expect(wrapper.findComponent({ name: 'WishlistFilterBar' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'WishlistList' }).exists()).toBe(true)
    })

    it('フッターボタンがセットされている', () => {
        const btn = footerButtons.find((b: any) => b.label === '欲しいもの登録')
        expect(btn).toBeTruthy()
        expect(btn.icon).toBe('➕')
    })

    it('フッターボタン押下で新規登録ページに遷移', async () => {
        const btn = footerButtons.find((b: any) => b.label === '欲しいもの登録')
        expect(btn).toBeTruthy()
        await btn.onClick()
        expect(mockPush).toHaveBeenCalledWith('/wishlist/new')
    })

    it('update:filtersイベントでrouter.pushが呼ばれる', async () => {
        // フィルタバーのスタブを取得
        const filterBar = wrapper.findComponent({ name: 'WishlistFilterBar' })
        // update:filtersイベントをemit
        await filterBar.vm.$emit('update:filters', { keyword: 'abc' })
        await flushPromises()
        expect(mockPush).toHaveBeenCalled()
    })
})
