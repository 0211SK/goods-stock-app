import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import InventoryListPage from '../../../app/pages/inventory/[id].vue'

vi.mock('../../../app/composables/useImageUpload', () => ({
    useImageUpload: () => ({
        uploadImage: vi.fn(),
        deleteImage: vi.fn(),
        getImageUrl: vi.fn(),
    }),
}))
// 必要なcomposableのモック
vi.mock('../../../app/composables/useWorks', () => ({
    useWorks: () => ({
        items: { value: [{ id: 1, name: '作品A' }] },
        fetchWorks: vi.fn()
    })
}))
vi.mock('../../../app/composables/useFooterButtons', () => ({
    useFooterButtons: vi.fn()
}))

// #importsのモック
const mockPush = vi.fn()
vi.mock('#imports', () => ({
    useRoute: () => ({ params: { id: '1' }, query: { itemTypeId: '2', keyword: 'abc', page: '3', size: '10', sort: 'purchaseDateDesc' } }),
    useRouter: () => ({ push: mockPush })
}))

describe('InventoryListPage', () => {
    let wrapper: any

    beforeEach(async () => {
        wrapper = mount(InventoryListPage)
        await new Promise(r => setTimeout(r, 0))
    })

    it('タイトルが表示される', () => {
        expect(wrapper.text()).toContain('グッズ一覧')
    })

    it('InventoryFilterBarが表示される', () => {
        expect(wrapper.findComponent({ name: 'InventoryFilterBar' }).exists()).toBe(true)
    })

    it('InventoryListが表示される', () => {
        expect(wrapper.findComponent({ name: 'InventoryList' }).exists()).toBe(true)
    })

    it('workNameが正しく計算される', () => {
        expect(wrapper.vm.workName).toBe('作品A')
    })

    it('filtersが正しく計算される', () => {
        expect(wrapper.vm.filters).toEqual({
            itemTypeId: 2,
            keyword: 'abc',
            page: 3,
            size: 10,
            sort: 'purchaseDateDesc',
        })
    })

    it('goToNewで新規登録ページに遷移する', async () => {
        await wrapper.vm.goToNew()
        expect(mockPush).toHaveBeenCalledWith('/inventory/new?workId=1')
    })

    it('updateFiltersでクエリが更新される', async () => {
        await wrapper.vm.updateFilters({ keyword: 'test', itemTypeId: 5, page: 2, size: 10, sort: 'purchaseDateDesc' })
        expect(mockPush).toHaveBeenCalledWith({ query: { itemTypeId: '5', keyword: 'test', page: '1', size: '10', sort: 'purchaseDateDesc' } })
    })
})
