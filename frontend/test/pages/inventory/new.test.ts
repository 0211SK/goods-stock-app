import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import InventoryNewPage from '../../../app/pages/inventory/new.vue'

// 必要なcomposableのモック
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
const mockCreate = vi.fn(async (payload) => ({ ...payload }))
vi.mock('../../../app/composables/useOwnedItems', () => ({
    useOwnedItems: () => ({
        create: mockCreate
    })
}))
vi.mock('../../../app/composables/useFooterButtons', () => ({
    useFooterButtons: vi.fn()
}))

// #importsのモック
const mockPush = vi.fn()
const mockBack = vi.fn()
vi.mock('#imports', () => ({
    useRoute: () => ({ query: { workId: '5' } }),
    useRouter: () => ({ push: mockPush, back: mockBack })
}))

describe('InventoryNewPage', () => {
    let wrapper: any

    beforeEach(async () => {
        mockCreate.mockClear()
        mockPush.mockClear()
        mockBack.mockClear()
        wrapper = mount(InventoryNewPage)
        await new Promise(r => setTimeout(r, 0))
    })

    it('タイトルが表示される', () => {
        expect(wrapper.text()).toContain('在庫登録')
    })

    it('InventoryFormが表示される', () => {
        expect(wrapper.findComponent({ name: 'InventoryForm' }).exists()).toBe(true)
    })

    it('initialDataにworkIdが入る', () => {
        expect(wrapper.vm.initialData).toEqual({ workId: 5 })
    })

    it('onSubmitでcreateとpushが呼ばれる', async () => {
        const formData = {
            workId: 5,
            itemTypeId: 2,
            goodsName: 'test',
            quantity: 1,
            unitPrice: 100,
            purchaseDate: '2026-01-01',
            imageUrl: null,
            memo: ''
        }
        await wrapper.vm.onSubmit(formData)
        expect(mockCreate).toHaveBeenCalledWith(formData)
        expect(mockPush).toHaveBeenCalledWith('/inventory/5')
    })

    it('onSubmitでエラー時はerrorMessageがセットされる', async () => {
        mockCreate.mockImplementationOnce(() => { throw new Error('登録エラー') })
        const formData = {
            workId: 5,
            itemTypeId: 2,
            goodsName: 'test',
            quantity: 1,
            unitPrice: 100,
            purchaseDate: '2026-01-01',
            imageUrl: null,
            memo: ''
        }
        await wrapper.vm.onSubmit(formData)
        expect(wrapper.vm.errorMessage).toBe('登録エラー')
    })

    it('cancelでbackが呼ばれる', async () => {
        await wrapper.vm.cancel()
        expect(mockBack).toHaveBeenCalled()
    })
})
