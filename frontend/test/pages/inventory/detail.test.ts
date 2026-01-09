import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import InventoryDetailPage from '../../../app/pages/inventory/[workId]/[id]/index.vue'

// 必要なcomposableのモック
vi.mock('../../../app/composables/useOwnedItems', () => ({
    useOwnedItems: () => ({
        loading: false,
        error: '',
        fetchDetail: vi.fn(async () => ({ id: 1, workId: 2, goodsName: 'test' })),
        deleteItem: vi.fn(async () => { })
    })
}))
vi.mock('../../../app/composables/useFooterButtons', () => ({
    useFooterButtons: vi.fn()
}))

// #importsのモック
const mockPush = vi.fn()
vi.mock('#imports', () => ({
    useRoute: () => ({ params: { id: '1', workId: '2' } }),
    useRouter: () => ({ push: mockPush })
}))

describe('InventoryDetailPage', () => {
    let wrapper: any

    beforeEach(async () => {
        wrapper = mount(InventoryDetailPage)
        await new Promise(r => setTimeout(r, 0)) // onMountedのasync処理待ち
    })

    it('タイトルが表示される', () => {
        expect(wrapper.text()).toContain('グッズ詳細')
    })

    it('InventoryDetailコンポーネントが表示される', () => {
        expect(wrapper.findComponent({ name: 'InventoryDetail' }).exists()).toBe(true)
    })

    it('削除モーダルが表示される（showDeleteModal=true）', async () => {
        wrapper.vm.showDeleteModal = true
        await wrapper.vm.$nextTick()
        expect(wrapper.findComponent({ name: 'DeleteConfirmModal' }).exists()).toBe(true)
    })

    it('編集ボタンで編集ページに遷移する', async () => {
        await wrapper.vm.goEdit()
        expect(mockPush).toHaveBeenCalledWith('/inventory/2/1/edit')
    })

    it('キャンセルで削除モーダルが閉じる', async () => {
        wrapper.vm.showDeleteModal = true
        await wrapper.vm.$nextTick()
        wrapper.vm.showDeleteModal = false
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.showDeleteModal).toBe(false)
    })

    it('削除成功で成功モーダルが表示される', async () => {
        await wrapper.vm.confirmDelete()
        expect(wrapper.vm.showSuccessModal).toBe(true)
    })


    it('成功モーダルを閉じると一覧ページに遷移する', async () => {
        wrapper.vm.item = { workId: 2 }
        await wrapper.vm.closeSuccessModal()
        expect(mockPush).toHaveBeenCalledWith('/inventory/2')
    })
})
