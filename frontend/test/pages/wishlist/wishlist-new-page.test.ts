import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import WishlistNewPage from '../../../app/pages/wishlist/new.vue'

// 必要なモック
const mockPush = vi.fn()
const mockBack = vi.fn()
const mockCreate = vi.fn()
const mockFetchWorks = vi.fn()
const mockFetchItemTypes = vi.fn()

vi.mock('~/composables/useWorks', () => ({
    useWorks: () => ({
        items: [],
        fetchWorks: mockFetchWorks
    })
}))
vi.mock('~/composables/useItemTypes', () => ({
    useItemTypes: () => ({
        items: [],
        fetchList: mockFetchItemTypes
    })
}))
vi.mock('~/composables/useWishlistItems', () => ({
    useWishlistItems: () => ({
        create: mockCreate
    })
}))
vi.mock('#imports', () => ({
    useRoute: () => ({ query: {} }),
    useRouter: () => ({ push: mockPush, back: mockBack })
}))

// 子コンポーネントはスタブ
vi.mock('~/components/common/PageTitle.vue', () => ({ default: { props: ['title'], template: '<div>{{ title }}</div>' } }))
vi.mock('~/components/wishlist/WishlistForm.vue', () => ({
    default: {
        name: 'WishlistForm',
        props: ['initialData', 'works', 'itemTypes', 'submitting', 'errorMessage'],
        emits: ['submit', 'cancel'],
        template: '<form @submit.prevent="$emit(\'submit\', $event)"><button type="submit">submit</button><button type="button" @click="$emit(\'cancel\')">cancel</button></form>'
    }
}))

describe('WishlistNewPage', () => {
    let wrapper: any

    beforeEach(async () => {
        vi.clearAllMocks()
        wrapper = mount(WishlistNewPage)
        await flushPromises()
    })

    it('タイトルが表示される', () => {
        expect(wrapper.text()).toContain('欲しいもの登録')
    })

    it('フォームが表示される', () => {
        expect(wrapper.findComponent({ name: 'WishlistForm' }).exists()).toBe(true)
    })

    it('onMountedでfetchWorksとfetchItemTypesが呼ばれる', () => {
        expect(mockFetchWorks).toHaveBeenCalled()
        expect(mockFetchItemTypes).toHaveBeenCalled()
    })

    it('submit時にcreateが呼ばれ、成功時はリストページに遷移', async () => {
        mockCreate.mockResolvedValue({ id: 1 })
        const form = wrapper.find('form')
        await form.trigger('submit.prevent', {
            workId: 1,
            itemTypeId: 2,
            goodsName: 'test',
            quantity: 1,
            expectedUnitPrice: 100,
            releaseDate: '2026-01-01',
            imageUrl: null,
            memo: null
        })
        await flushPromises()
        expect(mockCreate).toHaveBeenCalled()
        expect(mockPush).toHaveBeenCalledWith('/wishlist')
    })

    it('submit失敗時はエラーメッセージが表示される', async () => {
        mockCreate.mockRejectedValue(new Error('登録失敗'))
        const form = wrapper.find('form')
        await form.trigger('submit.prevent', {
            workId: 1,
            itemTypeId: 2,
            goodsName: 'test',
            quantity: 1,
            expectedUnitPrice: 100,
            releaseDate: '2026-01-01',
            imageUrl: null,
            memo: null
        })
        await flushPromises()
        expect(wrapper.vm.errorMessage).toBe('登録失敗')
    })

    it('cancel時はrouter.backが呼ばれる', async () => {
        const form = wrapper.find('form')
        await form.find('button[type="button"]').trigger('click')
        expect(mockBack).toHaveBeenCalled()
    })
})