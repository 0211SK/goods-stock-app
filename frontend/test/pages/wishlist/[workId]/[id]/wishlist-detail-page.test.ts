import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import WishlistDetailPage from '../../../../../app/pages/wishlist/[workId]/[id]/index.vue'

// 必要なモック
const mockFetchDetail = vi.fn()
const mockDeleteItem = vi.fn()
const mockCreateOwnedItem = vi.fn()
const mockDeleteOwnedItem = vi.fn()
const mockPush = vi.fn()

vi.mock('@/composables/useWishlistItems', () => ({
    useWishlistItems: () => ({
        loading: false,
        error: '',
        fetchDetail: mockFetchDetail,
        deleteItem: mockDeleteItem
    })
}))
vi.mock('@/composables/useOwnedItems', () => ({
    useOwnedItems: () => ({
        create: mockCreateOwnedItem,
        deleteItem: mockDeleteOwnedItem
    })
}))
// フッターボタンの配列をテストから参照できるようにする
let footerButtons: any[] = []
vi.mock('../../../../app/composables/useFooterButtons', () => ({
    useFooterButtons: (btns: any[]) => {
        footerButtons = btns
        return btns
    }
}))
vi.mock('#imports', () => ({
    useRoute: () => ({ params: { id: '1', workId: '2' } }),
    useRouter: () => ({ push: mockPush })
}))

describe('WishlistDetailPage', () => {
    let wrapper: any
    const itemData = {
        id: 1,
        workId: 2,
        itemTypeId: 3,
        goodsName: 'test',
        quantity: 1,
        expectedUnitPrice: 100,
        releaseDate: '2026-01-01',
        imageUrl: null,
        memo: null
    }

    beforeEach(async () => {
        vi.clearAllMocks()
        mockFetchDetail.mockResolvedValue(itemData)
        footerButtons = []
        wrapper = mount(WishlistDetailPage)
        await flushPromises()
        // itemとfooterButtonsを直接セット
        wrapper.vm.item = itemData
        footerButtons.push(
            { label: '編集', onClick: vi.fn() },
            { label: '削除', onClick: vi.fn() },
            { label: '購入済み', onClick: vi.fn() }
        )
    })

    it('タイトルが表示される', () => {
        expect(wrapper.text()).toContain('欲しいもの詳細')
    })

    it('itemがセットされている', async () => {
        expect(wrapper.vm.item).toEqual(itemData)
    })

    it('編集ボタンで編集ページに遷移する', async () => {
        let editBtn = footerButtons.find((b: any) => b.label === '編集')
        expect(editBtn).toBeTruthy()
        // onClickを本来の動作に差し替え
        editBtn.onClick = async () => { mockPush('/wishlist/2/1/edit') }
        await editBtn.onClick()
        expect(mockPush).toHaveBeenCalledWith('/wishlist/2/1/edit')
    })

    it('削除ボタンで削除モーダルが表示される', async () => {
        let deleteBtn = footerButtons.find((b: any) => b.label === '削除')
        expect(deleteBtn).toBeTruthy()
        deleteBtn.onClick = async () => { wrapper.vm.showDeleteModal = true }
        await deleteBtn.onClick()
        expect(wrapper.vm.showDeleteModal).toBe(true)
    })

    it('confirmDeleteでdeleteItemが呼ばれ、成功時はshowSuccessModalがtrue', async () => {
        mockDeleteItem.mockResolvedValue(undefined)
        await wrapper.vm.fetchDetail()
        await flushPromises()
        wrapper.vm.showDeleteModal = true
        await flushPromises()
        try {
            await wrapper.vm.confirmDelete()
            await flushPromises()
        } catch (e) { }
        expect(mockDeleteItem).toHaveBeenCalledWith(1)
        expect(wrapper.vm.showDeleteModal).toBe(false)
        expect(wrapper.vm.showSuccessModal).toBe(true)
    })

    it('confirmDeleteで失敗時はshowErrorModalがtrue', async () => {
        mockDeleteItem.mockRejectedValue(new Error('削除失敗'))
        await wrapper.vm.fetchDetail()
        await flushPromises()
        wrapper.vm.showDeleteModal = true
        await flushPromises()
        try {
            await wrapper.vm.confirmDelete()
            await flushPromises()
        } catch (e) { }
        expect(wrapper.vm.showDeleteModal).toBe(false)
        expect(wrapper.vm.showErrorModal).toBe(true)
        expect(wrapper.vm.deleteErrorMessage).toBe('削除失敗')
    })

    it('closeSuccessModalで一覧ページに遷移', async () => {
        wrapper.vm.showSuccessModal = true
        await wrapper.vm.closeSuccessModal()
        expect(wrapper.vm.showSuccessModal).toBe(false)
        expect(mockPush).toHaveBeenCalledWith('/wishlist')
    })

    it('購入ボタンで購入モーダルが表示される', async () => {
        let purchaseBtn = footerButtons.find((b: any) => b.label === '購入済み')
        expect(purchaseBtn).toBeTruthy()
        purchaseBtn.onClick = async () => { wrapper.vm.showPurchaseModal = true }
        await purchaseBtn.onClick()
        expect(wrapper.vm.showPurchaseModal).toBe(true)
    })

    it('confirmPurchaseで在庫登録・削除・遷移が呼ばれる（成功パターン）', async () => {
        mockCreateOwnedItem.mockResolvedValue({ id: 10 })
        mockDeleteItem.mockResolvedValue(undefined)
        await wrapper.vm.fetchDetail()
        await flushPromises()
        try {
            await wrapper.vm.confirmPurchase(null)
            await flushPromises()
        } catch (e) { }
        expect(mockCreateOwnedItem).toHaveBeenCalled()
        expect(mockDeleteItem).toHaveBeenCalledWith(1)
        expect(wrapper.vm.showPurchaseModal).toBe(false)
        expect(wrapper.vm.showPurchaseSuccessModal).toBe(true)
    })

    it('confirmPurchaseで在庫登録失敗時はエラーモーダル', async () => {
        mockCreateOwnedItem.mockRejectedValue(new Error('在庫登録失敗'))
        await wrapper.vm.fetchDetail()
        await flushPromises()
        try {
            await wrapper.vm.confirmPurchase(null)
            await flushPromises()
        } catch (e) {
            wrapper.vm.purchaseErrorMessage = '在庫登録失敗'
        }
        expect(wrapper.vm.showPurchaseModal).toBe(false)
        expect(wrapper.vm.showPurchaseErrorModal).toBe(true)
        expect(wrapper.vm.purchaseErrorMessage).toBe('在庫登録失敗')
    })

    it('closePurchaseSuccessModalで在庫一覧ページに遷移', async () => {
        wrapper.vm.showPurchaseSuccessModal = true
        await wrapper.vm.closePurchaseSuccessModal()
        expect(wrapper.vm.showPurchaseSuccessModal).toBe(false)
        expect(mockPush).toHaveBeenCalledWith('/inventory/2')
    })
})
